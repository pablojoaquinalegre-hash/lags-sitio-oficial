import { qs, getJSON } from "./utils.js";
import { priceBlock } from "./currency.js";

/**
 * Keys used in localStorage:
 * - "subscribed" (boolean JSON)
 * - "library_lagspass" (array of game objects added from LAGSpass)
 * - "library_store" (games purchased from store - not modified here)
 * - legacy "library" may exist (we don't touch it here)
 */

const KEY_SUB = "subscribed";
const KEY_LAG = "library_lagspass";

let allGames = []; // cache catalog from data/games.json

// --- Helpers ---
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Init / render ---
async function init() {
  // load catalog once
  try {
    const data = await getJSON("./data/games.json");
    allGames = Array.isArray(data?.games) ? data.games : [];
  } catch (e) {
    console.warn("No se pudo cargar data/games.json:", e);
    allGames = [];
  }

  attachUI();
  checkSubscription(); // renders games according to subscription
  // listen storage to reflect cross-tab changes
  window.addEventListener("storage", (e) => {
    if (["subscribed", KEY_LAG].includes(e.key)) checkSubscription();
  });
}

function attachUI() {
  const subscribeBtn = qs("#subscribeBtn");
  const cancelBtn = qs("#cancelBtn");
  const modal = qs("#buyModal");
  const closeModal = modal?.querySelector(".close");
  const cardForm = modal?.querySelector(".card-form");
  const confirmPurchaseBtn = qs("#confirmPurchase");

  // safe guards if elements missing
  if (subscribeBtn) {
    subscribeBtn.addEventListener("click", () => {
      if (cardForm) cardForm.classList.add("hidden");
      // reset payment selection UI
      modal?.classList.add("show");
      // remove any previously selected method attribute
      modal?.querySelectorAll(".payment-btn").forEach(b => b.classList.remove("selected"));
    });
  }
  if (closeModal) closeModal.addEventListener("click", () => modal.classList.remove("show"));
  window.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("show"); });

  // payment options
  modal?.querySelectorAll(".payment-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const method = btn.dataset.method;
      // store selected method on modal for confirm step
      modal.dataset.method = method;
      if (method === "debit" || method === "credit") {
        cardForm?.classList.remove("hidden");
      } else {
        cardForm?.classList.add("hidden");
      }
    });
  });

  if (confirmPurchaseBtn) {
    confirmPurchaseBtn.addEventListener("click", () => {
      const method = modal?.dataset?.method;
      if (!method) return alert("Selecciona un método de pago");
      writeJSON(KEY_SUB, true);
      modal?.classList.remove("show");
      checkSubscription();
      alert("¡Suscripción activada!");
      // notify other parts (biblioteca) of change
      window.dispatchEvent(new Event("library_changed"));
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      if (!confirm("¿Seguro que deseas cancelar tu suscripción?")) return;
      writeJSON(KEY_SUB, false);
      // clear only LAGSpass library (leave store purchases intact)
      writeJSON(KEY_LAG, []);
      checkSubscription();
      window.dispatchEvent(new Event("library_changed"));
      alert("Suscripción cancelada (se borraron los juegos agregados por LAGSpass).");
    });
  }
}

// Render the LAGSpass catalog area and bind "Agregar" buttons only if subscribed
async function renderGames(subscribed) {
  const list = qs(".list");
  if (!list) return;

  const games = allGames.slice(0, 30);

  // Build HTML
  const htmlArr = await Promise.all(games.map(async (g) => {
    const price = await (async () => {
      try { return await priceBlock(g.appid); } catch (e) { return { flagUrl: "", formatted: "" }; }
    })();
    const title = g.title || g.name || `Juego ${g.appid}`;
    return `
      <div class="card" data-appid="${escapeHtml(String(g.appid))}">
        <img src="https://cdn.akamai.steamstatic.com/steam/apps/${g.appid}/capsule_616x353.jpg" alt="${escapeHtml(title)}">
        <div class="body">
          <div class="title">${escapeHtml(title)}</div>
          <div class="price"><img class="flag" src="${escapeHtml(price.flagUrl || "")}"><span>${escapeHtml(price.formatted || "")}</span></div>
          ${subscribed ? `<button class="btn add-btn" data-appid="${escapeHtml(String(g.appid))}">Agregar</button>` : ""}
        </div>
      </div>
    `;
  }));

  list.innerHTML = htmlArr.join("");

  // bind add handlers (only when subscribed)
  if (subscribed) {
    list.querySelectorAll(".add-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const appid = btn.dataset.appid;
        try {
          await addToLibraryLagspass(appid);
          // visual feedback: disable button / mark added
          btn.disabled = true;
          btn.textContent = "Agregado";
        } catch (e) {
          console.error(e);
        }
      });
    });
  }
}

// Add a full game object to library_lagspass (no duplicates; if already purchased, block)
async function addToLibraryLagspass(appid) {
  const id = String(appid);
  const store = readJSON("library_store", []);
  const legacy = readJSON("library", []); // legacy purchased list
  const lag = readJSON(KEY_LAG, []);

  // If already in store (purchased), don't add to lagspass (avoid duplicates)
  const existsInStore = (store.concat(legacy)).some(g => String(g.appid) === id);
  if (existsInStore) {
    alert("Este juego ya está en tu biblioteca (comprado).");
    return;
  }

  if (lag.some(g => String(g.appid) === id)) {
    alert("Este juego ya está en tu biblioteca de LAGSpass.");
    return;
  }

  const gameObj = allGames.find(g => String(g.appid) === id);
  if (!gameObj) {
    // fallback minimal object
    const small = { appid: id, title: `Juego ${id}`, developer: "", publisher: "", year: "", categories: [], rating: "N/A" };
    lag.push(small);
    writeJSON(KEY_LAG, lag);
    window.dispatchEvent(new Event("library_changed"));
    return;
  }

  // Normalize object
  const normalized = {
    appid: gameObj.appid,
    title: gameObj.title || gameObj.name || `Juego ${gameObj.appid}`,
    developer: gameObj.developer || "",
    publisher: gameObj.publisher || "",
    year: gameObj.year || "",
    categories: gameObj.categories || [],
    rating: gameObj.rating || "N/A"
  };

  lag.push(normalized);
  writeJSON(KEY_LAG, lag);

  // notify library page
  window.dispatchEvent(new Event("library_changed"));
  return;
}

function checkSubscription() {
  const subscribed = JSON.parse(localStorage.getItem(KEY_SUB) || "false");
  // show/hide subscribe/cancel buttons
  const subscribeBtn = qs("#subscribeBtn");
  const cancelBtn = qs("#cancelBtn");
  if (subscribeBtn) subscribeBtn.style.display = subscribed ? "none" : "inline-block";
  if (cancelBtn) cancelBtn.style.display = subscribed ? "inline-block" : "none";

  // render catalog with or without Add buttons
  renderGames(!!subscribed);
  list.innerHTML = htmlArr.join("");

// aplicar animación escalonada
list.querySelectorAll(".card").forEach((card, i) => {
  setTimeout(() => {
    card.classList.add("animate-in");
  }, i * 100); // delay 100ms entre cada card
});

// bind add handlers (solo si está suscrito)
if (subscribed) {
  list.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const appid = btn.dataset.appid;
      try {
        await addToLibraryLagspass(appid);
        btn.disabled = true;
        btn.textContent = "Agregado";
      } catch (e) {
        console.error(e);
      }
    });
  });
}
}

init();

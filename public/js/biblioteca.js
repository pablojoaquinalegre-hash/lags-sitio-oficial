import { qs, qsa, getJSON } from "./utils.js";
import { priceBlock } from "./currency.js";

/**
 * Biblioteca unificada:
 * - lee library_store (comprados)
 * - lee legacy library (comprados antiguos)
 * - lee library_lagspass (suscripción)
 * - si subscribed == true, muestra store + lagspass; si no, solo store
 * - deduplica por appid (prioriza store if duplicated)
 */

const KEY_STORE = "library_store";
const KEY_LEG = "library";
const KEY_LAG = "library_lagspass";
const KEY_SUB = "subscribed";

let catalog = []; // optional: catalog to enrich missing fields

function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function init() {
  // try to fetch full catalog to enrich entries if needed
  try {
    const data = await getJSON("./data/games.json");
    catalog = Array.isArray(data?.games) ? data.games : [];
  } catch (e) {
    catalog = [];
  }

  const listEl = qs(".sidebar .list");
  const detailsEl = qs(".details");

  if (!listEl || !detailsEl) {
    console.warn("biblioteca: elementos .sidebar .list o .details no encontrados en DOM");
    return;
  }

  function readKey(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (e) {
      return [];
    }
  }

  function readSub() {
    try {
      return JSON.parse(localStorage.getItem(KEY_SUB) || "false");
    } catch (e) {
      return false;
    }
  }

  function normalize(raw) {
    if (!raw) return null;
    // raw might be a number/string (appid), or object
    if (typeof raw === "string" || typeof raw === "number") {
      const appid = String(raw);
      const found = catalog.find(x => String(x.appid) === appid);
      if (found) return makeSafe(found);
      return { appid, title: `Juego ${appid}`, developer: "", publisher: "", categories: [], rating: "N/A", year: "" };
    }
    if (raw.appid) {
      const appid = String(raw.appid);
      const found = catalog.find(x => String(x.appid) === appid) || {};
      // merge: saved raw overrides catalog fields (user data might be richer)
      const merged = Object.assign({}, found, raw);
      return makeSafe(merged);
    }
    return makeSafe(raw);
  }

  function makeSafe(g) {
    return {
      appid: g.appid,
      title: g.title || g.name || `Juego ${g.appid}`,
      developer: g.developer || "",
      publisher: g.publisher || "",
      categories: g.categories || [],
      rating: g.rating || "N/A",
      year: g.year || ""
    };
  }

  // Build visible library: store (library_store + legacy) first, then lagspass (only if sub)
  function buildVisibleLibrary() {
    const storeA = readKey(KEY_STORE);
    const storeB = readKey(KEY_LEG);
    const lag = readKey(KEY_LAG);
    const subscribed = !!readSub();

    // combine store entries, normalize
    const storeCombinedRaw = [...storeA, ...storeB];
    const map = new Map();
    storeCombinedRaw.forEach(r => {
      const nm = normalize(r);
      if (nm && !map.has(String(nm.appid))) map.set(String(nm.appid), nm);
    });

    if (subscribed) {
      (lag || []).forEach(r => {
        const nm = normalize(r);
        if (nm && !map.has(String(nm.appid))) map.set(String(nm.appid), nm);
      });
    }

    // Return array in insertion order: store first (we already populated that), then lagspass added later
    return Array.from(map.values());
  }

  let currentLibrary = buildVisibleLibrary();

  function renderList() {
    currentLibrary = buildVisibleLibrary();
    if (!currentLibrary.length) {
      listEl.innerHTML = `<p style="padding:10px;color:#aaa;">Tu biblioteca está vacía</p>`;
      detailsEl.innerHTML = `<p style="padding:20px;">Selecciona y compra juegos en la tienda o agrega desde LAGSpass.</p>`;
      return;
    }

    listEl.innerHTML = currentLibrary.map((g, i) => {
      const title = escapeHtml(g.title || `Juego ${g.appid}`);
      const dev = escapeHtml(g.developer || "");
      return `
        <div class="item ${i === 0 ? "active" : ""}" data-i="${i}">
          <img src="https://cdn.akamai.steamstatic.com/steam/apps/${g.appid}/capsule_184x69.jpg" alt="${title}"/>
          <div><div>${title}</div><small>${dev}</small></div>
        </div>
      `;
    }).join("");

    // render first item
    renderDetails(currentLibrary[0]);
  }

  async function renderDetails(g) {
    if (!g) {
      detailsEl.innerHTML = `<p style="padding:20px;">Selecciona un juego</p>`;
      return;
    }
    const title = escapeHtml(g.title || `Juego ${g.appid}`);
    let price = { flagUrl: "", formatted: "" };
    try { price = await priceBlock(g.appid); } catch (e) { /* ignore */ }

    detailsEl.innerHTML = `
      <div class="grid cols-2">
        <img class="card" src="https://cdn.akamai.steamstatic.com/steam/apps/${g.appid}/library_600x900.jpg" alt="${title}"/>
        <div class="card body">
          <h2>${title}</h2>
          <div>${escapeHtml(g.publisher || "")} • ${escapeHtml(g.year || "")}</div>
          <div class="badges">${(g.categories || []).slice(0,5).map(c => `<span class="badge">${escapeHtml(c)}</span>`).join("")}</div>
          <p>Rating: ${escapeHtml(String(g.rating || "N/A"))} ★</p>
          <p class="price"><img class="flag" src="${escapeHtml(price.flagUrl || "")}"> ${escapeHtml(price.formatted || "")}</p>
          <button class="btn brand">Jugar</button>
        </div>
      </div>
    `;
  }

  // Delegated click on list
  listEl.addEventListener("click", async (e) => {
    const item = e.target.closest(".item");
    if (!item) return;
    qsa(".sidebar .item").forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    const idx = +item.dataset.i;
    currentLibrary = buildVisibleLibrary(); // recalc in case of changes
    await renderDetails(currentLibrary[idx]);
  });

  // Listen for library_changed (custom event dispatched by LAGSpass) and storage changes (cross-tab)
  window.addEventListener("library_changed", () => renderList());
  window.addEventListener("storage", (e) => {
    if ([KEY_STORE, KEY_LEG, KEY_LAG, KEY_SUB].includes(e.key)) renderList();
  });

  // initial render
  renderList();
}

init();

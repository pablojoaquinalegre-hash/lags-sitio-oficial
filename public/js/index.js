import { qs, qsa, getJSON, truncate, steamBanner } from "./utils.js";
import { priceBlock } from "./currency.js";

async function loadGames(){
  const data = await getJSON("./data/games.json");
  const games = data?.games ?? [];
  const shuffled = games.sort(()=>Math.random()-0.5);
  buildCarousel(shuffled.slice(0, 10));
  mountBlocks(games);
  setupSearch(games);
}

function buildCarousel(items){
  const track = qs(".carousel .track");
  track.innerHTML = items.map(g=>`
    <div class="slide">
      <img src="${steamBanner(g.appid)}" alt="${g.title}" 
        onerror="this.onerror=null; this.src='https://images.pexels.com/photos/339119/pexels-photo-339119.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'"/>
      <div class="caption"><strong>${g.title}</strong></div>
    </div>`).join("");

  const dots = qs(".carousel .dots");
  dots.innerHTML = items.map((_,i)=>`<button data-i="${i}" class="${i===0?"active":""}"></button>`).join("");
  let idx = 0;
  const update = ()=>{
    track.style.transform = `translateX(-${idx*100}%)`;
    qsa(".carousel .dots button").forEach((b,i)=>b.classList.toggle("active", i===idx));
  };
  setInterval(()=>{ idx = (idx+1)%items.length; update(); }, 4000);
  dots.addEventListener("click", e=>{
    const b = e.target.closest("button");
    if(!b) return;
    idx = +b.dataset.i;
    update();
  });
  update();
}

function cardHTML(g, priceFmt, flagUrl){
  const cats = g.categories.slice(0,3).map(c=>`<span class="badge">${c}</span>`).join("");
  return `<div class="card game-card" 
              data-appid="${g.appid}" 
              data-title="${g.title}" 
              data-developer="${g.developer}" 
              data-publisher="${g.publisher}" 
              data-year="${g.year}" 
              data-categories="${(g.categories||[]).join(",")}" 
              data-rating="${g.rating}" 
              data-portrait="${g.images?.portrait}">
      <img src="${g.images?.cover}" alt="${g.title}" 
        onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg'">
      <div class="body">
        <div class="title" title="${g.title}">${truncate(g.title, 48)}</div>
        <div class="badges">${cats}</div>
        <div class="price"><img class="flag" src="${flagUrl}" alt="flag"> <span>${priceFmt}</span></div>
        <button class="btn buy-btn">Comprar</button>
      </div>
    </div>`;
}

async function mountSection(selector, games){
  const wrap = qs(selector);
  if(!wrap) return;
  const html = await Promise.all(games.map(async g=>{
    const { formatted, flagUrl } = await priceBlock(g.appid);
    return cardHTML(g, formatted, flagUrl);
  }));
  wrap.innerHTML = html.join("");
}

async function mountBlocks(games){
  await mountSection("#mas-jugados .games", games.slice(0,15));
  await mountSection("#proximos .games", games.slice(15,30));
  await mountSection("#gratuitos .games", games.filter(g=>["Dota 2","Team Fortress 2","Apex Legends","Destiny 2","Warframe","Path of Exile","Counter-Strike 2","PUBG: BATTLEGROUNDS","SMITE","Crossout"].includes(g.title)).slice(0,15));
  await mountSection("#ofertas .games", games.slice(30,45));
  await mountSection("#recomendados .games", games.slice(45,60));
  await mountSection("#empresas .games", games.slice(60,75));
}

function setupSearch(games){
  const input = qs("#buscador");
  const results = qs("#resultados");
  input.addEventListener("input", async () => {
    const q = input.value.trim().toLowerCase();
    if(!q){ results.innerHTML=""; return; }
    const found = games.filter(g => g.title.toLowerCase().includes(q) || (g.categories||[]).join(",").toLowerCase().includes(q)).slice(0,10);
    const html = await Promise.all(found.map(async g=>{
      const { formatted, flagUrl } = await priceBlock(g.appid);
      return `<div class="card game-card">${cardHTML(g, formatted, flagUrl)}</div>`;
    }));
    results.innerHTML = `<div class="grid games">${html.join("")}</div>`;
  });
}

loadGames();

const modal = qs("#buyModal");
const closeBtn = qs("#buyModal .close");
const gameImg = qs(".game-img");
const gameTitle = qs(".game-title");
const gameDev = qs(".game-dev");
const cardForm = qs(".card-form");
let selectedGame = null;
let paymentMethod = null;

closeBtn.addEventListener("click", ()=> modal.style.display="none");
window.addEventListener("click", e=>{ if(e.target === modal) modal.style.display="none"; });

// Abrir modal
document.body.addEventListener("click", e=>{
  const btn = e.target.closest(".buy-btn");
  if(!btn) return;
  const card = btn.closest(".game-card");

  // guardamos el juego como objeto con todos los datos
  selectedGame = {
    appid: card.dataset.appid,
    title: card.dataset.title,
    developer: card.dataset.developer,
    publisher: card.dataset.publisher,
    year: card.dataset.year,
    categories: (card.dataset.categories || "").split(","),
    rating: card.dataset.rating,
    portrait: card.dataset.portrait,
    cover: card.querySelector("img").src
  };

  const dev = card.querySelector(".badges").textContent || "";

  gameImg.src = selectedGame.portrait || selectedGame.cover;
  gameTitle.textContent = selectedGame.title;
  gameDev.textContent = dev;

  cardForm.classList.add("hidden");
  paymentMethod = null;
  modal.style.display = "flex";
});

// Selección de medio de pago
qsa(".payment-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    paymentMethod = btn.dataset.method;
    if(paymentMethod === "debit" || paymentMethod === "credit"){
      cardForm.classList.remove("hidden");
    } else {
      cardForm.classList.add("hidden");
    }
  });
});

// Confirmar compra
document.getElementById("confirmPurchase").addEventListener("click", ()=>{
  if(!selectedGame) return;

  let library = JSON.parse(localStorage.getItem("library")) || [];

  // evitar duplicados por appid
  if(!library.find(g => g.appid === selectedGame.appid)){
    library.push(selectedGame);
    localStorage.setItem("library", JSON.stringify(library));
  }

  alert("¡Compra realizada! El juego se agregó a tu biblioteca.");
  modal.style.display = "none"; 
});

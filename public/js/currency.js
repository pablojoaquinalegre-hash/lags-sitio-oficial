// currency.js
import {
  getJSON,
  convertFromUSD,
  flagForCurrency,
  fetchUSDPrice,
  loadConfig,
  store
} from "./utils.js";

// Convierte el price del juego (USD) a centavos.
// Si viene algo raro (no número, <=0), devuelve 0.
// Heurística: si es un entero muy grande (>=1000), asumimos que ya está en centavos.
function usdCentsFromGame(game) {
  const raw = game?.price;
  if (raw == null) return 0;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (Number.isInteger(n) && n >= 1000) return n; // probablemente ya está en centavos
  return Math.round(n * 100);
}

// Devuelve { formatted, flagUrl, usdCents }
// 1) Intenta leer el precio manual desde data/games.json (USD -> centavos).
// 2) Si no existe, intenta Steam (fetchUSDPrice).
export async function priceBlock(appid) {
  const [{ countries, rates }, p, gamesData] = await Promise.all([
    loadConfig(),
    fetchUSDPrice(appid),
    getJSON("./data/games.json")
  ]);

  // moneda del usuario (guardada en localStorage)
  const user = store.get("lags:user") || {};
  const currency = user.currency || "USD";

  // buscar el juego por appid en tu JSON local
  const game = gamesData?.games?.find(g => String(g.appid) === String(appid)) || null;

  // priorizar precio manual del JSON; si no hay, usar Steam
  let usdCents = usdCentsFromGame(game);
  if (!usdCents) {
    usdCents = p?.cents || 0;
  }

  const formatted = convertFromUSD(usdCents, currency, rates);
  const flagUrl = flagForCurrency(currency, countries);
  return { formatted, flagUrl, usdCents };
}

// Guardar/actualizar la moneda preferida del usuario
export function setCurrency(newCurrency) {
  const user = store.get("lags:user") || {};
  user.currency = newCurrency;
  store.set("lags:user", user);
  return newCurrency;
}
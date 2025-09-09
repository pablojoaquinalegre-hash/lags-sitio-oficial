// Generic helpers
export const qs = (sel, ctx=document)=>ctx.querySelector(sel);
export const qsa = (sel, ctx=document)=>Array.from(ctx.querySelectorAll(sel));
export const on = (el, ev, fn)=>el && el.addEventListener(ev, fn);

// Local storage helpers
export const store = {
  get(k, d=null){ try{ return JSON.parse(localStorage.getItem(k)) ?? d; } catch{ return d; } },
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)); },
  del(k){ localStorage.removeItem(k); }
};

// Fetch JSON helper with error handling
export async function getJSON(url){
  try{
    const res = await fetch(url);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }catch(err){
    console.warn("getJSON fail", url, err);
    return null;
  }
}

// Truncate text
export function truncate(str, n=50){ if(!str) return ""; return (str.length>n)? str.slice(0, n-1)+"…": str; }

// Image fallback to a real public placeholder (Steam header generic)
export function safeImg(imgEl){
  if(!imgEl) return;
  imgEl.onerror = () => { imgEl.onerror = null; imgEl.src = "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg"; };
}

// Build game image URLs (Steam official CDN)
export function steamHeader(appid){ return `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`; }
export function steamBanner(appid){ return `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/capsule_616x353.jpg`; }
export function steamPortrait(appid){ return `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`; }

// Live USD price from Steam (appdetails). Returns cents integer & formatted USD.
export async function fetchUSDPrice(appid){
  const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us&filters=price_overview`;
  try{
    const data = await getJSON(url);
    const obj = data?.[appid]?.data?.price_overview;
    if(!obj) return { cents: 0, usd: "USD $0.00" };
    return { cents: obj.final, usd: `${obj.currency} $${(obj.final/100).toFixed(2)}` };
  }catch(e){
    console.warn("price fetch fail", e);
    return { cents: 0, usd: "USD $0.00" };
  }
}

// Countries & rates cache
export async function loadConfig(){
  const [countries, rates] = await Promise.all([
    getJSON("./data/countries.json"),
    getJSON("./data/rates.json"),
  ]);
  return { countries, rates };
}

// Currency conversion given USD cents and target currency code
export function convertFromUSD(usdCents, target, rates){
  const rate = rates?.rates?.[target] ?? 1;
  const value = (usdCents/100) * rate;
  // Formatting per locale-ish (simple)
  const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: target, maximumFractionDigits: (["ARS","CLP","COP","PYG"].includes(target)?0:2) });
  try{
    return fmt.format(value);
  }catch{
    // Fallback generic
    const decimals = (["ARS","CLP","COP","PYG"].includes(target)?0:2);
    return `${target} ${value.toFixed(decimals)}`;
  }
}

// Find flag URL for a currency
export function flagForCurrency(target, countries){
  const c = countries?.countries?.find(c=>c.currency===target) || null;
  return c?.flag || "https://flagcdn.com/w40/us.png";
}

// User region handling
export function getUserCurrency(countries){
  const saved = store.get("lags:user");
  if(saved?.currency) return saved.currency;
  return "USD";
}

import { qs, getJSON, store } from "./utils.js";

onload = async () => {
  const form = qs("#register-form");
  const countrySel = qs("#country");
  const cfg = await getJSON("./data/countries.json");
  countrySel.innerHTML = cfg.countries.map(c=>`<option value="${c.currency}">${c.name} (${c.currency})</option>`).join("");

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const currency = countrySel.value;
    if(!name || !email || !password){ alert("Completa todos los campos"); return; }
    // Save user profile + currency
    store.set("lags:user", { name, email, currency });
    store.set("lags:session", { email, at: Date.now() });
    location.href = "./index.html";
  });
};

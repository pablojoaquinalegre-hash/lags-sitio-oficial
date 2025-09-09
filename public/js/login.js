import { qs, store } from "./utils.js";

onload = () => {
  const form = qs("#login-form");
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = form.email.value.trim();
    const pass = form.password.value.trim();
    if(!email || !pass){ alert("Completa tu email y contraseña"); return; }
    // Fake auth OK
    store.set("lags:session", { email, at: Date.now() });
    location.href = "./index.html";
  });
};

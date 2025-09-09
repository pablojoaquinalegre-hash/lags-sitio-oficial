import { qs, store } from "./utils.js";

onload = () => {
  const user = store.get("lags:user") || { name:"Jugador/a", email:"", currency:"USD" };
  qs("#name").textContent = user.name;
  qs("#email").textContent = user.email || "—";
  qs("#currency").textContent = user.currency;

  const input = qs("#avatar-input");
  const img = qs("#avatar");
  input.addEventListener("change", (e)=>{
    const file = e.target.files?.[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    img.style.opacity = "0";
    setTimeout(()=>{ img.src = url; img.style.transition = "opacity .4s ease"; img.style.opacity = "1"; }, 60);
  });

  qs("#edit-name").addEventListener("click", ()=>{
    const n = prompt("Nuevo nombre:", user.name);
    if(n){ user.name = n; store.set("lags:user", user); qs("#name").textContent = n; }
  });

  qs("#logout").addEventListener("click", ()=>{
    store.del("lags:session");
    location.href = "./login.html";
  });
};

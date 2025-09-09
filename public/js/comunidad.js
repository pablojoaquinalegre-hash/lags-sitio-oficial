import { qs } from "./utils.js";

// Lista de comentarios estáticos (50 comentarios)
const staticComments = [
  // Primeros 5 comentarios: 1 de cada tema
  "Ubisoft la concha de tu madre, otra vez parche roto en AC!",  // videojuegos
  "El gobierno se caga en nosotros, qué país de mierda", // política
  "Necesito un laburo aunque sea para sobrevivir, hijos de puta", // laburo
  "Hoy me levanté y no sé ni qué hacer con mi vida, loco", // pelotudo general

  // Resto de los 95 comentarios mezclados
  "Ese jugador de Valorant es un manco de mierda, me hizo perder la ranked",
  "El Elden Ring me tiene traumado, caí 3 veces en la misma grieta",
  "FIFA 25 es una estafa, EA chupala",
  "Alguien para coop en Valheim? Estoy solo y re manco",
  "Compré Cyberpunk 2077 y todavía no puedo creer que siga bugueado",
  "Call of Duty Warzone es puro pay to win, qué asco",
  "Ubisoft me quiere hacer llorar con otro DLC de mierda",
  "El Dota 2 de hoy me hizo llorar de frustración",
  "Minecraft es lo único que me calma después de ranked",
  "No puedo creer que el Among Us todavía se juegue, viejo",
  "Warframe gratis y todavía mejor que muchos juegos pagos",
  "Steam me bloqueó la cuenta por error, hijos de puta",
  "Me re cagaron en la oferta del Elden Ring, quería descuento",
  "Alguien juega CS2? Estoy buscando team",
  "Gente, el Apex Legends nuevo está una locura",
  "Destiny 2 gratis y nadie me avisó, gracias Epic",
  "PUBG: BATTLEGROUNDS me hizo perder 10 partidas seguidas",
  "SMITE está mejor que nunca, gracias dios",
  "Crossout es para locos, pero me encanta",
  "League of Legends me volvió a sacar un ACV",
  "Fortnite, dejá de ser tan pay to win por favor",
  "Rocket League sigue siendo lo más sano que hay",
  "FIFA 25 vs PES 2025, batalla de la concha de la lora",
  "Gente, alguien que me explique cómo se juega Rust",
  "El God of War me rompió el control del stress",
  "No puedo creer que Mario Kart siga arruinando amistades",
  "Alguien más atrapado en Hogwarts Legacy? Estoy perdido",
  "The Sims me hace sentir superior a todos",
  "Animal Crossing me relajó, gracias Nintendo",
  "Valorant me tiene los huevos al plato",
  "Rainbow Six Siege es para profesionales o suicidas",
  "Hice un stream en Twitch y me flamearon todo el chat",
  "El Red Dead Redemption 2 me rompió el corazón",
  "GTA V Online me hace perder la vida social",
  "Among Us otra vez me acusaron sin sentido",
  "Rocket League me hizo llorar de risa",
  "League of Legends, reporten al support hijo de puta",
  "CS2 hoy un cheater me cagó la partida",
  "Warframe: gracias por seguir siendo gratis y roto",
  "Path of Exile: loco, el último parche es imposible",
  "Smite me hizo olvidar la realidad",
  "Crossout: me robaron un tanque en multiplayer",
  "PUBG: BATTLEGROUNDS: 3 kills y muero de una cagada",
  "Dota 2: report al support por favor",
  "Apex Legends: no puedo ganar ni una",
  "FIFA 25: EA Sports no aprende más",
  "Cyberpunk 2077: bugs everywhere, qué asco",
  "Valheim: solo y frío, ayuda pls",
  "Hades: me atrapó la rutina del juego",
  "Dark Souls III: lloré otra vez",
  "Elden Ring: qué loco que es este juego",
  "Chabon, ¿cómo carajo hago para pasar este jefe en Sekiro?",
  "No entiendo nada de Rust, me robaron TODO en 2 segundos",
  "Fui a ranked y todos mancos, me quiero pegar un tiro",
  "Este GTA V Online es un quilombo, los pibes no saben ni apuntar",
  "Estoy llorando con los bugs del Cyberpunk otra vez",
  "Alguien que me enseñe a farmear en WoW, soy un desastre",
  "Que asco el matchmaking de Valorant, puro cheater",
  "Me trolearon en Among Us y encima me culparon a mí",
  "FIFA 25: cada pase que doy es para la mierda",
  "El Elden Ring me dejó sin dedos, literalmente",
  "Minecraft: hice una casa y me la robaron los vecinos",
  "Estoy llorando con los servers de League of Legends",
  "Call of Duty: me mataron por glitch, qué asco",
  "Alguien juega Apex y no es un manco de mierda?",
  "Rocket League: hice un golazo y el server bugueó",
  "PUBG: perdí con un tipo que ni veía, qué locura",
  "Dark Souls: estoy llorando otra vez por el jefe final",
  "Smite me hizo enojar tanto que tiré el teclado",
  "Crossout: exploté mi tanque y todavía perdí",
  "Hades: no puedo dejar de jugar, loco",
  "Valorant: report al team por favor",
  "Minecraft: los mobs me arruinaron todo",
  "Among Us: me acusaron y era inocente",
  "Fortnite: el nuevo pase es un robo total",
  "GTA V Online: me hackearon la cuenta",
  "Cyberpunk 2077: no puedo creer que sigan bugueados",
  "Alguien para jugar LoL? Necesito desahogarme",
  "Steam: me cancelaron la compra, hijos de puta",
  "Destiny 2: nadie me ayuda en las raids",
  "FIFA 25: EA Sports, chupame la pija",
  "Elden Ring: caí otra vez al mismo agujero",
  "PUBG: me mataron por glitch, qué bronca",
  "Rocket League: el server se colgó justo en el gol",
  "Among Us: otra vez me culpan los boludos",
  "Valorant: los pibes del team son todos mancos",
  "LoL: el support ni se mueve, hijos de puta",
  "Call of Duty: puro pay to win, qué asco",
  "Cyberpunk: todavía me falta el parche",
  "FIFA 25: el arbitro es un hijo de puta",
  "Minecraft: me robaron la casa los admin",
  "Dark Souls: lloré 3 horas seguidas",
  "GTA V: me mataron por spawn kill, loco",
  "Rocket League: me bugueó el coche, qué locura",
  "Elden Ring: el jefe me re cagó la partida",
  "Among Us: 5 reportes y sigo siendo inocente",
  "LoL: otra ranked perdida por el team",
  "Valorant: no puedo ganar ni una partida",
  "FIFA 25: cada update es peor",
  "PUBG: me mataron por el lag, loco",
  "Smite: los dioses están rotos, qué bronca",
  "Crossout: el tanque explota solo, loco",
  "Cyberpunk: todavía bugueado, no aprenden",
  "Minecraft: los mobs me mataron la base",
  "Rocket League: el server se cayó justo al final",
  "Elden Ring: no paso el jefe, me quiero matar",
  "Dark Souls: otra vez el mismo fallo de hitbox",
  "GTA V: cheater en cada partida, loco",
  "LoL: otra ranked perdida, hijos de puta",
  "Valorant: me mataron 3 veces por lag",
  "Among Us: me culparon otra vez, qué asco"
];

// Comentarios en portugués (para Brasil)
const staticCommentsPT = [
  "Ubisoft me deixou na mão de novo, que raiva!",
  "Esse jogador de Valorant é um noob total, perdi a ranked",
  "Elden Ring me deixou traumatizado, caí 3 vezes no mesmo buraco",
  "FIFA 25 é uma roubada, EA se foda",
  "Alguém pra jogar coop no Valheim? Tô sozinho e péssimo",
  "Cyberpunk 2077 ainda bugado, que ódio",
  "Call of Duty Warzone é pay to win, que nojo",
  "Minecraft me acalma depois da ranked",
  "Among Us ainda jogável, velho",
  "Steam bloqueou minha conta, filhos da mãe",
  "Rocket League é o jogo mais saudável que existe",
  "Valorant me irritou de novo, os caras são noobs",
  "League of Legends me fez quebrar o controle",
  "PUBG: BATTLEGROUNDS perdi feio, que raiva",
  "Fortnite, para de ser tão pay to win",
  "Smite está quebrado demais, que bronca",
  "Crossout explodiu meu tanque e perdi",
  "Hades não consigo parar de jogar, loco",
  "Destiny 2 ninguém ajuda nas raids",
  "GTA V Online, me hackearam a conta"
];

// Lista de usuarios (50 usuarios)
const users = [
  { name: "Soretito123", handle: "@Soretito123" },
  { name: "MaruDev", handle: "@maru.dev" },
  { name: "Juanceto01", handle: "@Juanceto01" },
  { name: "July3p", handle: "@July3p" },
  { name: "Santo Pete", handle: "@Pete" },
  { name: "Que te importa", handle: "@fer" },
  { name: "Lionel Messi", handle: "@lu" },
  { name: "Enbaja", handle: "@gonza" },
  { name: "Sofi", handle: "@sofi" },
  { name: "Gabi", handle: "@gabi" },
  { name: "CristianR", handle: "@crisr" },
  { name: "LautiX", handle: "@lautix" },
  { name: "Ana_L", handle: "@ana.l" },
  { name: "PabloGamer", handle: "@pablog" },
  { name: "Mariana77", handle: "@mariana77" },
  { name: "KevinYT", handle: "@kevin" },
  { name: "Tomi123", handle: "@tomi123" },
  { name: "ValeIndie", handle: "@valeindie" },
  { name: "FedeShot", handle: "@fedeshot" },
  { name: "NicoRPG", handle: "@nicorpg" },
  { name: "CharlyX", handle: "@charlyx" },
  { name: "BetoManco", handle: "@betomanco" },
  { name: "RocioPlays", handle: "@rocioplays" },
  { name: "GonzaLoco", handle: "@gonzaloco" },
  { name: "FerchoLOL", handle: "@fercholol" },
  { name: "LeoHacker", handle: "@leohacker" },
  { name: "JuaniCrash", handle: "@juanicrash" },
  { name: "CataRPG", handle: "@catarpg" },
  { name: "PameGamer", handle: "@pamegamer" },
  { name: "LuchoXD", handle: "@luchoxd" },
  { name: "FedeBug", handle: "@fedebug" },
  { name: "SantiPvP", handle: "@santipv" },
  { name: "ValeRPG", handle: "@valerpg" },
  { name: "JuliXP", handle: "@julixp" },
  { name: "TomiLOL", handle: "@tomilol" },
  { name: "KiraDev", handle: "@kiradev" },
  { name: "MatiasBug", handle: "@matiasbug" },
  { name: "NicoPvP", handle: "@nicopvp" },
  { name: "FeliXD", handle: "@felixd" },
  { name: "JuanitaG", handle: "@juanitag" },
  { name: "RamiXP", handle: "@ramixp" },
  { name: "LauBug", handle: "@laubug" },
  { name: "FedeCrash", handle: "@fedecrash" },
  { name: "CrisPvP", handle: "@crispvp" },
  { name: "LeoRPG", handle: "@leorpg" },
  { name: "SofiBug", handle: "@sofibug" },
  { name: "ValeShot", handle: "@valeshot" },
  { name: "LuchoRPG", handle: "@luchorpg" },
  { name: "TomiXD", handle: "@tomixd" },
  { name: "MaruBug", handle: "@marubug" },
  { name: "GonzaPvP", handle: "@gonzapvp" },
  { name: "FeliRPG", handle: "@felirpg" },
  { name: "ChinoLoko", handle: "@chino" },
  { name: "PelucaGamer", handle: "@pelucagamer" },
  { name: "TitoManco", handle: "@tito" },
  { name: "JaviLOL", handle: "@javilol" },
  { name: "LuliXD", handle: "@lulixd" },
  { name: "RuloBug", handle: "@rulobug" },
  { name: "CamiPvP", handle: "@camipvp" },
  { name: "FachaGamer", handle: "@facha" },
  { name: "MatiXP", handle: "@matixp" },
  { name: "KekoRPG", handle: "@kekorpg" },
  { name: "NatiLOL", handle: "@natilol" },
  { name: "PabloXD", handle: "@pabloxd" },
  { name: "FedePvP", handle: "@fedepvp" },
  { name: "SantiBug", handle: "@santibug" },
  { name: "ValeCrash", handle: "@valecrash" },
  { name: "LuchoShot", handle: "@luchos" },
  { name: "TomiRPG", handle: "@tomirpg" },
  { name: "MaruXP", handle: "@maruxp" },
  { name: "GonzaLOL", handle: "@gonzalol" },
  { name: "FeliXD2", handle: "@felixd2" },
  { name: "CharlyBug", handle: "@charlybug" },
  { name: "PameRPG", handle: "@pamerpg" },
  { name: "LautiBug", handle: "@lautibug" },
  { name: "AnaXP", handle: "@anaxp" },
  { name: "PabloShot", handle: "@pabloshot" },
  { name: "RocioLOL", handle: "@rociolol" },
  { name: "LeoBug", handle: "@leobug" },
  { name: "SofiShot", handle: "@sofishot" },
  { name: "ValeLOL", handle: "@valelol" },
  { name: "LuchoXP", handle: "@luchoxp" },
  { name: "TomiBug", handle: "@tomibug" },
  { name: "MaruShot", handle: "@marushot" },
  { name: "GonzaCrash", handle: "@gonzacrash" },
  { name: "FeliShot", handle: "@felishot" }
];

// Lista de banderas aleatorias
const flags = [
  "https://flagcdn.com/ar.svg",
  "https://flagcdn.com/br.svg",
  "https://flagcdn.com/cl.svg",
  "https://flagcdn.com/mx.svg",
  "https://flagcdn.com/co.svg",
  "https://flagcdn.com/pe.svg",
  "https://flagcdn.com/uy.svg",
  "https://flagcdn.com/ec.svg",
  "https://flagcdn.com/bo.svg",
  "https://flagcdn.com/py.svg"
];

const feed = qs("#feed");
const textarea = qs(".compose textarea");
const btnPublish = qs(".compose .btn.brand");

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.style.display = "none";
document.body.appendChild(fileInput);

function renderComment({ user, handle, avatar, text, time, flag, image }) {
  const div = document.createElement("div");
  div.className = "post";

  const imgTag = document.createElement("img");
  imgTag.className = "avatar";
  imgTag.src = avatar;
  imgTag.alt = user;
  imgTag.onerror = () => imgTag.src = "https://i.pravatar.cc/150?img=69"; 

  const innerHTML = `
    <div>
      <div class="meta">
        <strong>${user}</strong>
        <img src="${flag}" style="width:16px;vertical-align:middle;margin-left:4px;">
        <span>${handle}</span> · <span>${time}</span>
      </div>
      <div>${text ? text.replace(/\n/g,"<br>") : ""}</div>
      ${image ? `<img src="${image}" style="max-width:100%;border-radius:12px;margin-top:6px;">` : ""}
      <div class="badges"><span class="badge">Me gusta</span><span class="badge">Comentar</span><span class="badge">Compartir</span></div>
    </div>
  `;
  
  div.appendChild(imgTag);
  div.insertAdjacentHTML("beforeend", innerHTML);

  // Insertamos oculto y animamos después
  div.style.opacity = "0";
  div.style.transform = "translateY(-80px) rotateX(15deg)";
  div.style.filter = "blur(18px)";
  feed.prepend(div);

  // Animación separada para cada comentario
  setTimeout(() => {
    div.style.transition = "transform 1s cubic-bezier(0.22, 1, 0.36, 1), opacity 1s ease, filter 1s ease";
    div.style.opacity = "1";
    div.style.transform = "translateY(0) rotateX(0)";
    div.style.filter = "blur(0)";
  }, 50); // pequeño delay para que el DOM registre el estilo inicial
}



let commentIndex = 0;

function sequentialComment() {
  const j = commentIndex % users.length;
  const k = Math.floor(Math.random() * flags.length);

  let text;
  if(flags[k] === "https://flagcdn.com/br.svg") {
    const iPT = commentIndex % staticCommentsPT.length;
    text = staticCommentsPT[iPT];
  } else {
    const i = commentIndex % staticComments.length;
    text = staticComments[i];
  }

  commentIndex++;

  return {
    user: users[j].name,
    handle: users[j].handle,
    avatar: `https://i.pravatar.cc/150?img=${j+1}`,
    text,
    time: `${Math.floor(Math.random() * 59) + 1}m`,
    flag: flags[k]
  };
}

function spawnComment() {
  renderComment(sequentialComment());
  const delay = Math.floor(Math.random() * 1000) + 3000; 
  setTimeout(spawnComment, delay);
}
spawnComment();

btnPublish.addEventListener("click", ()=>{
  const text = textarea.value.trim();
  if(!text && !fileInput.files.length) return alert("Escribe algo o selecciona una imagen.");

  if(fileInput.files.length){
    const reader = new FileReader();
    reader.onload = e => {
      renderComment({
        user: "Tú",
        handle: "@miCuenta",
        avatar: "https://i.pravatar.cc/150?img=69",
        text,
        time: "Ahora",
        flag: "https://flagcdn.com/ar.svg",
        image: e.target.result
      });
      textarea.value = "";
      fileInput.value = "";
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    renderComment({
      user: "Tú",
      handle: "@miCuenta",
      avatar: "https://i.pravatar.cc/150?img=69",
      text,
      time: "Ahora",
      flag: "https://flagcdn.com/ar.svg"
    });
    textarea.value = "";
  }
});

textarea.addEventListener("dblclick", ()=> fileInput.click());

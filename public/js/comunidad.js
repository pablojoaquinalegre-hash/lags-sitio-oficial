import { qs } from "./utils.js";

// Lista de comentarios estáticos (50 comentarios)
const staticComments = [
  // Primeros 5 comentarios: 1 de cada tema
"Ubisoft otra vez parche roto en AC, qué desastre!",        // videojuegos
"El gobierno nos tiene complicados, qué país loco",        // política
"Necesito un laburo aunque sea para sobrevivir, uff",     // laburo
"Hoy me levanté y no sé ni qué hacer con mi vida, loco", // vida personal

// Resto de los 95 comentarios mezclados
"Ese jugador de Valorant no ayudó nada, me hizo perder la ranked",
"El Elden Ring me tiene atrapado, caí 3 veces en la misma grieta",
"FIFA 25 está complicado, EA debería mejorar algunos detalles",
"Alguien para coop en Valheim? Estoy solo y me cuesta avanzar",
"Compré Cyberpunk 2077 y sigue con varios bugs",
"Call of Duty Warzone parece muy pay to win, qué mal",
"Ubisoft lanzó otro DLC complicado, no lo esperaba",
"El Dota 2 de hoy fue súper difícil, me hizo sudar",
"Minecraft sigue siendo lo más relajante después de ranked",
"No puedo creer que el Among Us todavía sea tan popular",
"Warframe gratis y aún divertido que muchos juegos pagos",
"Steam bloqueó mi cuenta por error, qué frustración",
"Me perdí la oferta del Elden Ring, quería descuento",
"Alguien juega CS2? Busco team para ranked",
"Apex Legends nuevo está muy entretenido",
"Destiny 2 gratis y nadie me avisó, gracias Epic",
"PUBG: BATTLEGROUNDS me hizo perder varias partidas seguidas",
"SMITE está mejor que nunca, muy divertido",
"Crossout es loco, pero me gusta mucho",
"League of Legends me volvió a frustrar",
"Fortnite, sigan equilibrando el juego por favor",
"Rocket League sigue siendo muy divertido",
"FIFA 25 vs PES 2025, qué difícil elegir",
"Alguien que me explique cómo jugar Rust",
"God of War me dejó sin palabras con la historia",
"No puedo creer que Mario Kart siga arruinando amistades",
"Atrapado en Hogwarts Legacy, estoy perdido",
"The Sims me hace reír mucho con las situaciones",
"Animal Crossing me relajó, gracias Nintendo",
"Valorant me está costando un montón",
"Rainbow Six Siege es para jugadores muy estratégicos",
"Hice un stream en Twitch y todo el chat me flameó",
"Red Dead Redemption 2 me emocionó mucho",
"GTA V Online me hizo perder varias horas sin darme cuenta",
"Among Us otra vez me acusaron sin sentido",
"Rocket League me hizo reír de lo loco del partido",
"League of Legends, reporten al support por favor",
"CS2 hoy un cheater arruinó mi partida",
"Warframe: sigue siendo gratis y divertido",
"Path of Exile: el último parche cambió todo",
"Smite me absorbió por completo, qué buen juego",
"Crossout: perdí un tanque en multiplayer, qué locura",
"PUBG: BATTLEGROUNDS: 3 kills y muero por mala suerte",
"Dota 2: report al support, necesito ayuda",
"Apex Legends: no puedo ganar ni una partida",
"FIFA 25: EA Sports debería mejorar los pases",
"Cyberpunk 2077: todavía con varios bugs, qué locura",
"Valheim: solo y perdido, ayuda pls",
"Hades: me atrapó la rutina del juego",
"Dark Souls III: frustrante otra vez",
"Elden Ring: qué juego tan loco",
"Chabon, ¿cómo paso este jefe en Sekiro?",
"No entiendo Rust, me robaron todo muy rápido",
"Fui a ranked y todos jugaban mal, qué locura",
"GTA V Online es un quilombo, los pibes no saben apuntar",
"Los bugs de Cyberpunk me siguen sorprendiendo",
"Alguien que me enseñe a farmear en WoW, soy un desastre",
"Matchmaking de Valorant complicado, muchos cheaters",
"Me trolearon en Among Us y me culparon sin sentido",
"FIFA 25: cada pase parece no salir bien",
"Elden Ring me dejó sin dedos, literal",
"Minecraft: hice una casa y me la rompieron",
"Estoy frustrado con los servers de League of Legends",
"Call of Duty: me mataron por glitch, qué bronca",
"Alguien juega Apex sin problemas?",
"Rocket League: hice un golazo y bugueó el server",
"PUBG: perdí con un tipo que no se veía, qué locura",
"Dark Souls: lloré otra vez por el jefe final",
"Smite me hizo enojar, tiré el teclado sin querer",
"Crossout: mi tanque explotó y perdí",
"Hades: no puedo dejar de jugar, muy adictivo",
"Valorant: report al team por favor",
"Minecraft: los mobs arruinaron todo",
"Among Us: me acusaron siendo inocente",
"Fortnite: el nuevo pase es caro, pero divertido",
"GTA V Online: hackeo frustrante",
"Cyberpunk 2077: todavía bugueado",
"Alguien para jugar LoL? Necesito desahogarme",
"Steam: me cancelaron la compra, qué frustración",
"Destiny 2: nadie ayuda en las raids",
"FIFA 25: EA Sports debería escuchar a los jugadores",
"Elden Ring: caí otra vez al mismo agujero",
"PUBG: me mataron por glitch, qué bronca",
"Rocket League: el server se colgó justo en el gol",
"Among Us: otra vez me culpan sin razón",
"Valorant: el team está complicado",
"LoL: el support no ayuda, qué frustrante",
"Call of Duty: balance del juego necesario",
"Cyberpunk: todavía falta parche",
"FIFA 25: arbitraje complicado en el juego",
"Minecraft: me robaron la casa en el server",
"Dark Souls: lloré varias horas",
"GTA V: me mataron por spawn kill, loco",
"Rocket League: bug en el coche, qué locura",
"Elden Ring: jefe muy difícil",
"Among Us: 5 reportes y sigo siendo inocente",
"LoL: otra ranked perdida, el team complicado",
"Valorant: no puedo ganar partidas",
"FIFA 25: cada update empeora cosas",
"PUBG: me mataron por lag",
"Smite: los dioses están rotos, frustrante",
"Crossout: tanque explota solo, qué locura",
"Cyberpunk: sigue bugueado, no aprenden",
"Minecraft: mobs destruyeron mi base",
"Rocket League: server cayó justo al final",
"Elden Ring: no paso el jefe, qué frustrante",
"Dark Souls: hitbox fallando otra vez",
"GTA V: cheater en cada partida, qué locura",
"LoL: otra ranked perdida, frustrante",
"Valorant: me mataron 3 veces por lag",
"Among Us: me culparon otra vez, qué mal"

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

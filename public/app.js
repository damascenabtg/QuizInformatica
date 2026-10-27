const $ = (id) => document.getElementById(id);
const LETRAS = ["A", "B", "C", "D"];
const ESPERA_ENTRE_QUESTOES = 2200; // ms mostrando o feedback

let sessao = null;
let tempoMax = 20;
let fimDoTempo = 0;   // timestamp local em que a questão expira
let intervalo = null;
let respondendo = false;
let dicasRestantes = 3;

async function post(url, dados) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.erro || "Erro de comunicação");
  return j;
}

function mostrar(tela) {
  for (const t of ["tela-inicio", "tela-quiz", "tela-fim"]) $(t).classList.toggle("oculto", t !== tela);
  $("aba-dica").classList.toggle("oculto", tela !== "tela-quiz");
}

// ---------- Tela cheia ----------
$("btn-tela-cheia").onclick = () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen?.().catch(() => {});
};

// ---------- Início ----------
$("form-inicio").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("erro-inicio").textContent = "";
  try {
    const nome = $("nome").value.trim();
    const r = await post("/api/iniciar", { nome, turma: $("turma").value });
    sessao = r.sessao;
    tempoMax = r.tempo;
    dicasRestantes = r.dicas;
    mostrar("tela-quiz");
    carregarPergunta();
  } catch (err) {
    $("erro-inicio").textContent = err.message;
  }
});

// ---------- Dicas ----------
function atualizarLampada() {
  $("dicas-restantes").textContent = dicasRestantes;
  $("btn-dica").classList.toggle("esgotada", dicasRestantes <= 0);
}

function fecharDica() {
  $("painel-dica").classList.remove("aberto");
  $("btn-dica").classList.remove("acesa");
}

$("btn-dica").onclick = async () => {
  const painel = $("painel-dica");
  if (painel.classList.contains("aberto")) return fecharDica();
  if (respondendo) return;
  try {
    const r = await post("/api/dica", { sessao });
    dicasRestantes = r.dicasRestantes;
    $("texto-dica").innerHTML = "";
    $("texto-dica").append(r.dica);
    const aviso = document.createElement("small");
    aviso.textContent = `Esta questão agora vale metade dos pontos · ${dicasRestantes} dica(s) restante(s)`;
    $("texto-dica").append(aviso);
    $("btn-dica").classList.add("acesa");
  } catch (err) {
    $("texto-dica").textContent = err.message;
  }
  atualizarLampada();
  painel.classList.add("aberto");
};

// ---------- Perguntas ----------
async function carregarPergunta() {
  const q = await post("/api/pergunta", { sessao });
  respondendo = false;
  fecharDica();
  dicasRestantes = q.dicasRestantes;
  atualizarLampada();

  $("contador").textContent = `Questão ${q.numero}/${q.total}`;
  $("placar").textContent = `⭐ ${q.pontos} pts`;
  $("progresso").style.width = ((q.numero - 1) / q.total) * 100 + "%";
  $("categoria").textContent = q.categoria;
  $("pergunta").textContent = q.pergunta;
  $("feedback").innerHTML = "";

  const box = $("opcoes");
  box.innerHTML = "";
  q.opcoes.forEach((texto, i) => {
    const b = document.createElement("button");
    b.className = "opcao";
    b.innerHTML = `<span class="letra">${LETRAS[i]}</span><span></span>`;
    b.lastChild.textContent = texto;
    b.onclick = () => responder(i);
    box.appendChild(b);
  });

  iniciarTimer(q.restante);
}

function iniciarTimer(restante) {
  clearInterval(intervalo);
  fimDoTempo = performance.now() + restante * 1000;
  const tick = () => {
    const seg = Math.max(0, (fimDoTempo - performance.now()) / 1000);
    const frac = seg / tempoMax;
    $("timer-num").textContent = Math.ceil(seg);
    const barra = $("timer-barra");
    barra.style.width = frac * 100 + "%";
    barra.style.background = frac > 0.5 ? "var(--certo)" : frac > 0.25 ? "var(--c)" : "var(--errado)";
    if (seg <= 0) {
      clearInterval(intervalo);
      responder(-1); // tempo esgotado
    }
  };
  tick();
  intervalo = setInterval(tick, 100);
}

// Atalhos de teclado: A/B/C/D ou 1/2/3/4
document.addEventListener("keydown", (e) => {
  if ($("tela-quiz").classList.contains("oculto") || respondendo || e.target.tagName === "INPUT") return;
  const k = e.key.toUpperCase();
  const i = LETRAS.indexOf(k) >= 0 ? LETRAS.indexOf(k) : ["1", "2", "3", "4"].indexOf(k);
  if (i >= 0) responder(i);
});

function animarAcerto() {
  Confete.bordas();
  const brilho = $("brilho");
  brilho.classList.remove("ativo");
  void brilho.offsetWidth; // reinicia a animação
  brilho.classList.add("ativo");
  $("placar").classList.remove("pulo");
  void $("placar").offsetWidth;
  $("placar").classList.add("pulo");
}

function animarErro() {
  const card = $("card-pergunta");
  card.classList.remove("tremer");
  void card.offsetWidth;
  card.classList.add("tremer");
}

async function responder(indice) {
  if (respondendo) return;
  respondendo = true;
  clearInterval(intervalo);
  fecharDica();

  const botoes = [...$("opcoes").children];
  botoes.forEach((b) => (b.disabled = true));

  let r;
  try {
    r = await post("/api/responder", { sessao, resposta: indice });
  } catch (err) {
    $("feedback").innerHTML = `<div class="feedback nok">${err.message}</div>`;
    return;
  }

  botoes.forEach((b, i) => {
    if (i === r.correta) b.classList.add("certa");
    else if (i === indice) b.classList.add("marcada-errada");
    else b.classList.add("apagada");
  });

  $("placar").textContent = `⭐ ${r.pontos} pts`;
  let html;
  if (r.acertou) {
    animarAcerto();
    const fogo = r.sequencia > 1 ? ` · 🔥 ${r.sequencia} seguidas!` : "";
    const dica = r.usouDica ? " · 💡 com dica" : "";
    html = `<div class="feedback ok">✅ Correto! +${r.ganhos} pontos<small>Respondeu em ${formatarTempo(r.segundos)}${fogo}${dica}</small></div>`;
  } else if (r.esgotou) {
    animarErro();
    html = `<div class="feedback nok">⏰ Tempo esgotado!<small>A resposta certa era a letra ${LETRAS[r.correta]}</small></div>`;
  } else {
    animarErro();
    html = `<div class="feedback nok">❌ Errou!<small>A resposta certa era a letra ${LETRAS[r.correta]}</small></div>`;
  }
  $("feedback").innerHTML = html;

  setTimeout(() => (r.fim ? mostrarResultado(r.resultado) : carregarPergunta()), ESPERA_ENTRE_QUESTOES);
}

// ---------- Resultado ----------
const SOBRE = {
  "Conceitos básicos": "bits, bytes e unidades de medida (KB, MB, GB, TB)",
  "Hardware": "as peças físicas: processador, placa-mãe, placa de vídeo, fonte e dispositivos de entrada e saída",
  "Software": "sistemas operacionais, navegadores, antivírus e software livre",
  "Memória": "memória RAM, ROM, cache e memória virtual",
  "Armazenamento local": "HD, SSD, pen drive e unidades de capacidade",
  "Nuvem": "armazenamento em nuvem, como o Google Drive, e suas vantagens"
};

const pct = (c) => Math.round((c.acertos / c.total) * 100);

function descreverDesempenho(cats) {
  const frases = [];
  const hw = cats["Hardware"], sw = cats["Software"];

  // Comparação principal: hardware x software
  if (hw && sw) {
    if (pct(hw) > pct(sw)) frases.push(`Você mandou melhor em <b>Hardware</b> (${pct(hw)}%) do que em <b>Software</b> (${pct(sw)}%). Você entende bem a parte física do computador!`);
    else if (pct(sw) > pct(hw)) frases.push(`Você mandou melhor em <b>Software</b> (${pct(sw)}%) do que em <b>Hardware</b> (${pct(hw)}%). Você entende bem os programas e sistemas!`);
    else frases.push(`Você ficou equilibrado entre <b>Hardware</b> e <b>Software</b> (${pct(hw)}% em cada).`);
  } else if (hw) {
    frases.push(`Em <b>Hardware</b> você acertou ${pct(hw)}% (não caíram questões de Software nesta partida).`);
  } else if (sw) {
    frases.push(`Em <b>Software</b> você acertou ${pct(sw)}% (não caíram questões de Hardware nesta partida).`);
  }

  const ordem = Object.entries(cats).sort((a, b) => pct(b[1]) - pct(a[1]) || b[1].total - a[1].total);
  const [melhor, mCat] = ordem[0];
  const [pior, pCat] = ordem[ordem.length - 1];
  if (pct(mCat) > 0) frases.push(`Seu ponto forte foi <b>${melhor}</b>: você domina ${SOBRE[melhor]}.`);
  if (ordem.length > 1 && pct(pCat) < 100 && pior !== melhor) {
    frases.push(`Para melhorar, revise <b>${pior}</b> (${pct(pCat)}%): ${SOBRE[pior]}.`);
  }
  if (ordem.every(([, c]) => pct(c) === 100)) frases.push("Gabaritou todos os conteúdos. Incrível! 🎯");
  return frases.join(" ");
}

function mostrarResultado(res) {
  mostrar("tela-fim");
  const medalhas = { 1: "🥇", 2: "🥈", 3: "🥉" };
  $("fim-emoji").textContent = medalhas[res.posicao] || "🎉";
  $("fim-titulo").textContent = `Muito bem, ${res.nome}!`;
  $("fim-pontos").textContent = res.pontos;
  $("fim-posicao").textContent = res.posicao + "º";
  $("fim-acertos").textContent = `${res.acertos}/${res.total}`;
  $("fim-tempo").textContent = formatarTempo(res.tempoTotal);
  $("link-ranking").href = "/ranking?destaque=" + encodeURIComponent(res.data);

  $("fim-descricao").innerHTML = descreverDesempenho(res.categorias);
  $("fim-categorias").innerHTML = Object.entries(res.categorias)
    .sort((a, b) => pct(b[1]) - pct(a[1]))
    .map(([nome, c]) => {
      const p = pct(c);
      const cor = p >= 70 ? "var(--certo)" : p >= 40 ? "var(--c)" : "var(--errado)";
      return `
        <div class="cat">
          <div class="cat-topo"><span>${nome}</span><span>${c.acertos}/${c.total} · ${p}%</span></div>
          <div class="cat-barra"><div style="width:0%;background:${cor}" data-largura="${p}%"></div></div>
        </div>`;
    }).join("");
  // Anima as barras crescendo
  requestAnimationFrame(() => setTimeout(() => {
    document.querySelectorAll(".cat-barra div").forEach((d) => (d.style.width = d.dataset.largura));
  }, 50));

  const lista = $("fim-questoes");
  lista.innerHTML = "";
  for (const q of res.questoes) {
    const li = document.createElement("li");
    li.textContent = `${q.acertou ? "✅" : "❌"} ${q.pergunta}${q.usouDica ? " 💡" : ""}`;
    lista.append(li);
  }

  Confete.chuva(res.posicao <= 3 ? 4000 : 2000);
}

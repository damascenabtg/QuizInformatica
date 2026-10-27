// Quiz de Informática Básica — servidor local sem dependências externas.
// Uso: node server.js   (porta padrão 3000; senha do professor padrão "professor")
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const QUESTOES = require("./questions");

const PORTA = Number(process.env.PORT) || 3000;
const SENHA_PROFESSOR = process.env.SENHA || "professor";
const QUESTOES_POR_PARTIDA = 15; // sorteadas do banco de questões
const TEMPO_POR_QUESTAO = 20;    // segundos
const PONTOS_MAX = 1000;         // resposta certa instantânea
const PONTOS_MIN = 500;          // resposta certa no último segundo
const BONUS_SEQUENCIA = 100;     // por acerto seguido (a partir do 2º)
const MAX_DICAS = 3;             // dicas por partida
const FATOR_DICA = 0.5;          // usar dica reduz os pontos da questão pela metade
const ARQ_RANKING = path.join(__dirname, "data", "ranking.json");
const PASTA_PUBLICA = path.join(__dirname, "public");

// ---------- Persistência do ranking ----------
function carregarRanking() {
  try {
    return JSON.parse(fs.readFileSync(ARQ_RANKING, "utf8"));
  } catch {
    return [];
  }
}
function salvarRanking(lista) {
  fs.mkdirSync(path.dirname(ARQ_RANKING), { recursive: true });
  fs.writeFileSync(ARQ_RANKING, JSON.stringify(lista, null, 2));
}
let ranking = carregarRanking();

function rankingOrdenado() {
  // Mais pontos primeiro; empate → quem respondeu em menos tempo total.
  return [...ranking].sort((a, b) => b.pontos - a.pontos || a.tempoTotal - b.tempoTotal);
}

// ---------- Sessões de jogo (em memória) ----------
const sessoes = new Map();

function embaralhar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function novaSessao(nome, turma) {
  const id = crypto.randomUUID();
  const ordem = embaralhar(QUESTOES.map((_, i) => i)).slice(0, QUESTOES_POR_PARTIDA);
  // Embaralha também as alternativas de cada questão.
  const perguntas = ordem.map((qi) => {
    const q = QUESTOES[qi];
    const mapa = embaralhar([0, 1, 2, 3]);
    return {
      categoria: q.categoria,
      pergunta: q.pergunta,
      opcoes: mapa.map((m) => q.opcoes[m]),
      correta: mapa.indexOf(q.correta),
      dica: q.dica
    };
  });
  const s = {
    id, nome, turma, perguntas,
    atual: 0, pontos: 0, acertos: 0, sequencia: 0,
    tempoTotal: 0, enviadaEm: null, criadaEm: Date.now(),
    dicasRestantes: MAX_DICAS, dicaNaAtual: false,
    historico: []
  };
  sessoes.set(id, s);
  return s;
}

function calcularPontos(segundos) {
  const fracao = Math.min(segundos / TEMPO_POR_QUESTAO, 1);
  return Math.round(PONTOS_MAX - (PONTOS_MAX - PONTOS_MIN) * fracao);
}

const arred3 = (n) => Math.round(n * 1000) / 1000;

function resumoPorCategoria(historico) {
  const cats = {};
  for (const h of historico) {
    cats[h.categoria] ??= { acertos: 0, total: 0 };
    cats[h.categoria].total++;
    if (h.acertou) cats[h.categoria].acertos++;
  }
  return cats;
}

function finalizar(s) {
  const registro = {
    nome: s.nome,
    turma: s.turma,
    pontos: s.pontos,
    acertos: s.acertos,
    total: s.perguntas.length,
    tempoTotal: arred3(s.tempoTotal),
    dicasUsadas: MAX_DICAS - s.dicasRestantes,
    data: new Date().toISOString()
  };
  ranking.push(registro);
  salvarRanking(ranking);
  const pos = rankingOrdenado().indexOf(registro) + 1;
  sessoes.delete(s.id);
  return {
    ...registro,
    posicao: pos,
    categorias: resumoPorCategoria(s.historico),
    questoes: s.historico
  };
}

// ---------- Utilidades HTTP ----------
function json(res, status, dados) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(dados));
}

function lerCorpo(req) {
  return new Promise((resolve) => {
    let corpo = "";
    req.on("data", (c) => {
      corpo += c;
      if (corpo.length > 1e5) req.destroy();
    });
    req.on("end", () => {
      try { resolve(JSON.parse(corpo || "{}")); } catch { resolve({}); }
    });
  });
}

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

function servirEstatico(req, res) {
  let rota = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (rota === "/") rota = "/index.html";
  if (rota === "/ranking") rota = "/ranking.html";
  const arquivo = path.normalize(path.join(PASTA_PUBLICA, rota));
  if (!arquivo.startsWith(PASTA_PUBLICA)) return json(res, 403, { erro: "Proibido" });
  fs.readFile(arquivo, (err, dados) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Página não encontrada");
    }
    res.writeHead(200, {
      "Content-Type": TIPOS[path.extname(arquivo)] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    res.end(dados);
  });
}

// ---------- API ----------
async function api(req, res, rota) {
  if (req.method === "POST" && rota === "/api/iniciar") {
    const { nome, turma } = await lerCorpo(req);
    const n = String(nome || "").trim().slice(0, 30);
    const t = String(turma || "").trim().slice(0, 20);
    if (n.length < 2) return json(res, 400, { erro: "Digite seu nome (mínimo 2 letras)." });
    const s = novaSessao(n, t);
    return json(res, 200, { sessao: s.id, total: s.perguntas.length, tempo: TEMPO_POR_QUESTAO, dicas: MAX_DICAS });
  }

  if (req.method === "POST" && rota === "/api/pergunta") {
    const { sessao } = await lerCorpo(req);
    const s = sessoes.get(sessao);
    if (!s) return json(res, 404, { erro: "Sessão não encontrada. Recomece o quiz." });
    const q = s.perguntas[s.atual];
    // O tempo começa a contar no servidor quando a pergunta é enviada pela primeira vez.
    if (s.enviadaEm === null) s.enviadaEm = Date.now();
    const decorrido = (Date.now() - s.enviadaEm) / 1000;
    return json(res, 200, {
      numero: s.atual + 1,
      total: s.perguntas.length,
      categoria: q.categoria,
      pergunta: q.pergunta,
      opcoes: q.opcoes,
      restante: Math.max(0, TEMPO_POR_QUESTAO - decorrido),
      pontos: s.pontos,
      dicasRestantes: s.dicasRestantes,
      dica: s.dicaNaAtual ? q.dica : null
    });
  }

  if (req.method === "POST" && rota === "/api/dica") {
    const { sessao } = await lerCorpo(req);
    const s = sessoes.get(sessao);
    if (!s || s.enviadaEm === null) return json(res, 404, { erro: "Sessão inválida." });
    const q = s.perguntas[s.atual];
    if (!s.dicaNaAtual) {
      if (s.dicasRestantes <= 0) return json(res, 400, { erro: "Você já usou todas as suas dicas!" });
      s.dicasRestantes--;
      s.dicaNaAtual = true;
    }
    return json(res, 200, { dica: q.dica, dicasRestantes: s.dicasRestantes });
  }

  if (req.method === "POST" && rota === "/api/responder") {
    const { sessao, resposta } = await lerCorpo(req);
    const s = sessoes.get(sessao);
    if (!s || s.enviadaEm === null) return json(res, 404, { erro: "Sessão inválida." });
    const q = s.perguntas[s.atual];
    const segundos = Math.min((Date.now() - s.enviadaEm) / 1000, TEMPO_POR_QUESTAO);
    const noTempo = segundos < TEMPO_POR_QUESTAO;
    const acertou = noTempo && Number(resposta) === q.correta;
    const usouDica = s.dicaNaAtual;

    let ganhos = 0;
    if (acertou) {
      s.sequencia++;
      ganhos = calcularPontos(segundos) + (s.sequencia > 1 ? BONUS_SEQUENCIA : 0);
      if (usouDica) ganhos = Math.round(ganhos * FATOR_DICA);
      s.acertos++;
    } else {
      s.sequencia = 0;
    }
    s.pontos += ganhos;
    s.tempoTotal += segundos;
    s.historico.push({ categoria: q.categoria, pergunta: q.pergunta, acertou, usouDica });
    s.atual++;
    s.enviadaEm = null;
    s.dicaNaAtual = false;

    const fim = s.atual >= s.perguntas.length;
    return json(res, 200, {
      acertou,
      esgotou: !noTempo,
      correta: q.correta,
      ganhos,
      usouDica,
      sequencia: s.sequencia,
      segundos: arred3(segundos),
      pontos: s.pontos,
      fim,
      resultado: fim ? finalizar(s) : null
    });
  }

  if (req.method === "GET" && rota === "/api/ranking") {
    return json(res, 200, { ranking: rankingOrdenado(), jogando: sessoes.size });
  }

  if (req.method === "POST" && rota === "/api/resetar") {
    const { senha } = await lerCorpo(req);
    if (senha !== SENHA_PROFESSOR) return json(res, 401, { erro: "Senha incorreta." });
    ranking = [];
    salvarRanking(ranking);
    return json(res, 200, { ok: true });
  }

  json(res, 404, { erro: "Rota não encontrada" });
}

// Limpa sessões abandonadas há mais de 2 horas.
setInterval(() => {
  const limite = Date.now() - 2 * 60 * 60 * 1000;
  for (const [id, s] of sessoes) if (s.criadaEm < limite) sessoes.delete(id);
}, 10 * 60 * 1000).unref();

http
  .createServer((req, res) => {
    const rota = new URL(req.url, "http://x").pathname;
    if (rota.startsWith("/api/")) {
      api(req, res, rota).catch((e) => {
        console.error(e);
        json(res, 500, { erro: "Erro interno" });
      });
    } else {
      servirEstatico(req, res);
    }
  })
  .listen(PORTA, "0.0.0.0", () => {
    console.log("\n  Quiz de Informática rodando!\n");
    console.log(`  Neste computador:   http://localhost:${PORTA}`);
    for (const lista of Object.values(os.networkInterfaces())) {
      for (const net of lista || []) {
        if (net.family === "IPv4" && !net.internal) console.log(`  Alunos na rede:     http://${net.address}:${PORTA}`);
      }
    }
    console.log(`  Ranking (telão):    http://localhost:${PORTA}/ranking`);
    console.log(`\n  Senha do professor para zerar o ranking: "${SENHA_PROFESSOR}"\n`);
  });

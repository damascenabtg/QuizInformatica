// Confetes em tela cheia, desenhados num <canvas> (sem bibliotecas externas).
const Confete = (() => {
  const canvas = document.getElementById("confete");
  const ctx = canvas.getContext("2d");
  const VERDES = ["#22c55e", "#4ade80", "#86efac", "#16a34a", "#bbf7d0", "#a3e635"];
  const FESTA = ["#facc15", "#22c55e", "#6366f1", "#e11d48", "#38bdf8", "#f59e0b"];
  let particulas = [];
  let animando = false;

  function ajustar() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  addEventListener("resize", ajustar);
  ajustar();

  function criar(x, y, vx, vy, cores) {
    particulas.push({
      x, y, vx, vy,
      w: 6 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      cor: cores[Math.floor(Math.random() * cores.length)],
      giro: Math.random() * Math.PI,
      vGiro: (Math.random() - 0.5) * 0.3,
      vida: 1
    });
  }

  // Explosão vinda das quatro bordas da tela, "em volta" do conteúdo.
  function bordas(qtd = 160, cores = VERDES) {
    const W = innerWidth, H = innerHeight;
    for (let i = 0; i < qtd; i++) {
      const lado = i % 4;
      const f = 6 + Math.random() * 8;
      if (lado === 0) criar(0, Math.random() * H, f, -Math.random() * 6, cores);           // esquerda
      else if (lado === 1) criar(W, Math.random() * H, -f, -Math.random() * 6, cores);     // direita
      else if (lado === 2) criar(Math.random() * W, -10, (Math.random() - 0.5) * 6, Math.random() * 4, cores); // topo
      else criar(Math.random() * W, H + 10, (Math.random() - 0.5) * 6, -(8 + Math.random() * 8), cores);       // base
    }
    iniciar();
  }

  // Chuva longa para a tela final.
  function chuva(duracaoMs = 3000, cores = FESTA) {
    const fim = performance.now() + duracaoMs;
    const gerar = () => {
      for (let i = 0; i < 6; i++) criar(Math.random() * innerWidth, -10, (Math.random() - 0.5) * 3, 2 + Math.random() * 3, cores);
      iniciar();
      if (performance.now() < fim) requestAnimationFrame(gerar);
    };
    gerar();
  }

  function iniciar() {
    if (!animando) {
      animando = true;
      requestAnimationFrame(quadro);
    }
  }

  function quadro() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of particulas) {
      p.vy += 0.25;      // gravidade
      p.vx *= 0.985;     // resistência do ar
      p.x += p.vx;
      p.y += p.vy;
      p.giro += p.vGiro;
      p.vida -= 0.006;
      ctx.save();
      ctx.globalAlpha = Math.max(p.vida, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.giro);
      ctx.fillStyle = p.cor;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.giro)));
      ctx.restore();
    }
    particulas = particulas.filter((p) => p.vida > 0 && p.y < innerHeight + 40);
    if (particulas.length) requestAnimationFrame(quadro);
    else {
      animando = false;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
  }

  return { bordas, chuva };
})();

// Proteções para exposição (feira): o visitante fica preso ao quiz.
// O bloqueio de verdade vem do Edge em modo quiosque (iniciar.bat); aqui só
// fechamos o que o navegador ainda deixaria fazer dentro da página.
(() => {
  const OCIOSO_MS = 2 * 60 * 1000; // sem uso por 2 min → volta à tela inicial

  const ehCampo = (el) => el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");

  // Botão direito, seleção de texto e arrastar (campos de texto continuam funcionando)
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("selectstart", (e) => { if (!ehCampo(e.target)) e.preventDefault(); });
  document.addEventListener("dragstart", (e) => e.preventDefault());

  // Atalhos: imprimir, salvar, ver código, abrir arquivo, buscar, zoom, ferramentas do desenvolvedor, voltar/avançar
  document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    const ctrl = e.ctrlKey || e.metaKey;
    const bloquear =
      k === "f12" || k === "f5" || k === "f3" || k === "f7" || k === "f11" ||
      (ctrl && ["p", "s", "u", "o", "f", "g", "h", "j", "d", "r", "+", "-", "=", "0"].includes(k)) ||
      (ctrl && e.shiftKey && ["i", "j", "c", "k", "delete"].includes(k)) ||
      (e.altKey && ["arrowleft", "arrowright", "home"].includes(k));
    if (bloquear) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // Zoom com Ctrl + rodinha do mouse
  document.addEventListener("wheel", (e) => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });

  // Volta à tela inicial quando o visitante vai embora no meio do caminho.
  // No ranking só vale se ele veio do quiz: o telão abre /ranking direto e não deve ser redirecionado.
  const naInicial = () => {
    const inicio = document.getElementById("tela-inicio");
    if (!inicio || inicio.classList.contains("oculto")) return false;
    return [...inicio.querySelectorAll("input")].every((i) => !i.value);
  };
  const noRanking = location.pathname.startsWith("/ranking");
  if (noRanking && !document.referrer) return;

  let timer;
  const reiniciar = () => {
    clearTimeout(timer);
    timer = setTimeout(() => { if (!naInicial()) location.href = "/"; }, OCIOSO_MS);
  };
  for (const ev of ["pointerdown", "pointermove", "keydown", "touchstart", "wheel"]) {
    document.addEventListener(ev, reiniciar, { passive: true });
  }
  reiniciar();
})();

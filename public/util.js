// Formata segundos como "MM:SS.mmm" (minutos, segundos e milésimos).
function formatarTempo(segundos) {
  const ms = Math.round(Number(segundos) * 1000);
  const min = Math.floor(ms / 60000);
  const seg = Math.floor((ms % 60000) / 1000);
  const mil = ms % 1000;
  return `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}.${String(mil).padStart(3, "0")}`;
}

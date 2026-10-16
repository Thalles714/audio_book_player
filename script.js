const nomeCapitulo = document.getElementById("capitulo");
const audio = document.getElementById("audio-capitulo");
const botaoPlayPause = document.getElementById("play-pause");
const botaoProximoCapitulo = document.getElementById("proximo");
const botaoCapituloAnterior = document.getElementById("anterior");
const mensagem = document.getElementById("status-audio");

const quantidadeCapitulos = 10;

let capitulo = 1;

function atualizarControles() {
  const tocando = !audio.paused;
  botaoPlayPause.classList.toggle("bi-play-circle-fill", !tocando);
  botaoPlayPause.classList.toggle("bi-pause-circle-fill", tocando);
  botaoPlayPause.setAttribute("aria-label", tocando ? "Pausar" : "Reproduzir");
}

async function tocarFaixa() {
  mensagem.textContent = "";
  try {
    await audio.play();
  } catch (erro) {
    // Trocar de capítulo ou pausar pode interromper uma tentativa pendente.
    if (erro.name !== "AbortError") {
      mensagem.textContent = "Não foi possível reproduzir este capítulo. Tente novamente.";
    }
  }
  atualizarControles();
}

function tocarOuPausarFaixa() {
  if (audio.paused) {
    return tocarFaixa();
  }
  audio.pause();
}

function mudarCapitulo(novoCapitulo) {
  capitulo = novoCapitulo;
  audio.src = "books/dom-casmurro/" + capitulo + ".mp3";
  nomeCapitulo.innerText = "Capítulo " + capitulo;
  return tocarFaixa();
}

function capituloAnterior() {
  return mudarCapitulo(capitulo === 1 ? quantidadeCapitulos : capitulo - 1);
}

function proximoCapitulo() {
  return mudarCapitulo(capitulo === quantidadeCapitulos ? 1 : capitulo + 1);
}

botaoPlayPause.addEventListener("click", tocarOuPausarFaixa);
botaoCapituloAnterior.addEventListener("click", capituloAnterior);
botaoProximoCapitulo.addEventListener("click", proximoCapitulo);
audio.addEventListener("ended", proximoCapitulo);
audio.addEventListener("play", atualizarControles);
audio.addEventListener("pause", atualizarControles);
audio.addEventListener("error", () => {
  mensagem.textContent = "Não foi possível carregar o áudio deste capítulo.";
  atualizarControles();
});

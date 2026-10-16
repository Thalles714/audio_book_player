# Player de audiolivro

Interface para reproduzir dez capítulos de Dom Casmurro, construída como exercício de HTML, CSS e JavaScript.

Projeto de estudo de Thalles Leal Tavares. [Portfólio atual](https://portifoliothallesleal.vercel.app/) · [Perfil profissional](https://github.com/Thalles714).

## O que este projeto demonstra

- Reproduzir e pausar áudio.
- Navegar entre capítulos.
- Avançar automaticamente ao final de uma faixa.

## Executar localmente

```sh
git clone https://github.com/Thalles714/audio_book_player.git
cd audio_book_player
python -m http.server 8000
```

Abra [localhost:8000](http://localhost:8000). Requer Python apenas para servir os arquivos; a interface usa HTML, CSS e JavaScript no navegador.

## Estrutura

- `index.html`, `style.css` e `script.js`: interface e controles.
- `books/dom-casmurro/`: arquivos de áudio.
- `images/`: capa do livro.

A presença dos áudios neste exercício não atribui licença ou autoria ao desenvolvedor; os direitos da gravação devem ser verificados antes de redistribuí-la.

## Verificação

Com Node.js 20 ou superior: `node --test tests/player.test.cjs`. Os testes simulam o elemento de áudio; a reprodução real depende do navegador e dos arquivos de mídia.

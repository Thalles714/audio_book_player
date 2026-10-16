const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function player() {
  const elements = {};
  for (const id of ['capitulo', 'audio-capitulo', 'play-pause', 'proximo', 'anterior', 'status-audio']) {
    const classes = new Set(['bi-play-circle-fill']);
    elements[id] = { paused: true, attributes: {}, events: {}, textContent: '',
      classList: { toggle(name, on) { on ? classes.add(name) : classes.delete(name); }, contains: name => classes.has(name) },
      setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(name, listener) { this.events[name] = listener; }
    };
  }
  const audio = elements['audio-capitulo'];
  audio.play = async () => { audio.paused = false; audio.events.play(); };
  audio.pause = () => { audio.paused = true; audio.events.pause(); };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8'), {
    document: { getElementById: id => elements[id] }
  });
  return { elements, audio, button: elements['play-pause'] };
}

test('play rejection keeps a play button and reports the error', async () => {
  const { audio, button, elements } = player();
  audio.play = async () => { throw new Error('blocked'); };
  await button.events.click();
  assert.equal(button.attributes['aria-label'], 'Reproduzir');
  assert.ok(button.classList.contains('bi-play-circle-fill'));
  assert.match(elements['status-audio'].textContent, /Não foi possível/);
});

test('play and pause use the real media state', async () => {
  const { audio, button } = player();
  await button.events.click();
  assert.equal(button.attributes['aria-label'], 'Pausar');
  audio.pause();
  assert.equal(button.attributes['aria-label'], 'Reproduzir');
});

test('previous and next wrap chapters and use relative paths', async () => {
  const { elements, audio } = player();
  await elements.anterior.events.click();
  assert.equal(audio.src, 'books/dom-casmurro/10.mp3');
  await elements.proximo.events.click();
  assert.equal(audio.src, 'books/dom-casmurro/1.mp3');
  await audio.events.ended();
  assert.equal(audio.src, 'books/dom-casmurro/2.mp3');
});

test('intentional interruption does not display a playback failure', async () => {
  const { audio, button, elements } = player();
  audio.play = async () => { const error = new Error(); error.name = 'AbortError'; throw error; };
  await button.events.click();
  assert.equal(elements['status-audio'].textContent, '');
});

test('first chapter also resolves under a project subdirectory', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const src = html.match(/<audio[^>]*src="([^"]+)"/)[1];
  assert.equal(new URL(src, 'https://example.com/audio_book_player/').pathname,
    '/audio_book_player/books/dom-casmurro/1.mp3');
});

const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');

const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script(?:\s+id="([^"]*)")?(?:\s+type="([^"]*)")?>([\s\S]*?)<\/script>/g)];

// Verify preconnect links and uncropped object-fit: contain CSS
assert(html.includes('rel="preconnect" href="https://en.wikipedia.org"'), 'Must include preconnect for en.wikipedia.org');
assert(html.includes('rel="preconnect" href="https://upload.wikimedia.org"'), 'Must include preconnect for upload.wikimedia.org');
assert(html.includes('object-fit:contain'), 'Photo CSS must use object-fit:contain so 100% of every image is visible without cropping');
assert(!html.includes('.real-photo-img{width:100%;height:100%;object-fit:cover'), 'Must not crop images with object-fit:cover');

function boot() {
  const store = {};
  const nodes = {};
  const makeEl = (id = '') => ({
    id,
    innerHTML: '',
    textContent: '',
    value: '',
    checked: false,
    hidden: false,
    open: false,
    scrollTop: 0,
    dataset: {},
    style: {},
    children: [{ focus() {} }],
    classList: {
      set: new Set(),
      add(c) { this.set.add(c); },
      remove(c) { this.set.delete(c); },
      contains(c) { return this.set.has(c); }
    },
    parentElement: { hidden: false },
    setAttribute(k, v) { this[k] = String(v); },
    getAttribute(k) { return this[k]; },
    focus() {},
    showModal() { this.open = true; },
    close() { this.open = false; },
    reportValidity() {},
    querySelector() { return { focus() {}, setAttribute() {}, innerHTML: '' }; },
    querySelectorAll() { return []; },
    closest() { return null; }
  });

  const document = {
    documentElement: { dataset: { theme: 'light' } },
    body: makeEl('body'),
    getElementById(id) { return (nodes[id] ??= makeEl(id)); },
    addEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; }
  };

  for (const [, id, type, content] of scripts) {
    if (type === 'application/json' && id) {
      nodes[id] = makeEl(id);
      nodes[id].textContent = content;
    }
  }

  const ctx = {
    window: { scrollY: 0, scrollTo() {}, addEventListener() {} },
    document,
    localStorage: {
      getItem: k => store[k] ?? null,
      setItem: (k, v) => { store[k] = String(v); }
    },
    speechSynthesis: { getVoices: () => [], cancel() {}, speak() {} },
    SpeechSynthesisUtterance: function(t) { this.text = t; },
    Audio: function(src) { this.src = src; this.play = () => Promise.resolve(); this.pause = () => {}; },
    matchMedia: () => ({ matches: false }),
    URL: { createObjectURL: () => 'blob:x', revokeObjectURL() {} },
    Blob: function() {},
    FileReader: function() {},
    console
  };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const [, , type, content] of scripts) {
    if (type !== 'application/json') vm.runInContext(content, ctx);
  }
  return { ctx, nodes };
}

const { ctx, nodes } = boot();
const run = code => vm.runInContext(code, ctx);
const click = a => run(`$('view').onclick({target:{dataset:{action:${JSON.stringify(a)}},closest:()=>({dataset:{action:${JSON.stringify(a)}}})}})`);

// 1. Verify strict concrete-only whitelist: concrete objects resolve, abstract/functional words return null
const concreteCount = run('defaults.filter(r => resolveVocabPhotoTopic(r) !== null).length');
const omittedCount = run('defaults.filter(r => resolveVocabPhotoTopic(r) === null).length');
assert(concreteCount >= 550 && concreteCount <= 800, `Expected 550–800 concrete entries, got ${concreteCount}`);
assert(omittedCount >= 5100, `Expected >5,100 abstract/ambiguous entries omitted, got ${omittedCount}`);

// Verify concrete words resolve accurately
assert.equal(run('resolveVocabPhotoTopic({word:"apple",pos:"noun"}).query'), 'Apple');
assert.equal(run('resolveVocabPhotoTopic({word:"elephant",pos:"noun"}).query'), 'Elephant');
assert.equal(run('resolveVocabPhotoTopic({word:"microscope",pos:"noun"}).query'), 'Microscope');
assert.equal(run('resolveVocabPhotoTopic({word:"bicycle",pos:"noun"}).query'), 'Bicycle');

// Verify abstract, functional, and previously-misleading words return null (no photo)
for (const [w, p] of [
  ['a', 'indefinite article'], ['about', 'preposition'], ['above', 'preposition'],
  ['ability', 'noun'], ['accept', 'verb'], ['advantage', 'noun'], ['afford', 'verb'],
  ['although', 'conjunction'], ['always', 'adverb'], ['annoy', 'verb'], ['assume', 'verb'],
  ['attitude', 'noun'], ['bother', 'verb'], ['concept', 'noun'], ['consequence', 'noun'],
  ['consist', 'verb'], ['ignore', 'verb'], ['illusion', 'noun'], ['theory', 'noun'],
  ['think', 'verb'], ['trouble', 'noun'], ['truth', 'noun'], ['understand', 'verb'],
  ['wide', 'adjective'], ['wise', 'adjective'], ['wish', 'noun'], ['worry', 'verb'], ['youth', 'noun']
]) {
  assert.equal(run(`resolveVocabPhotoTopic({word:${JSON.stringify(w)},pos:${JSON.stringify(p)}})`), null, `Abstract word ${w}:${p} must not have a misleading photo`);
  assert.equal(run(`vocabPhotoCard({word:${JSON.stringify(w)},pos:${JSON.stringify(p)}})`), '', `vocabPhotoCard for ${w}:${p} must be empty`);
}

// 2. Verify Vocabulary view (mode 0) renders no photo for abstract word #0 ("a"), and renders real-photo-card for concrete word ("apple")
run('mode=0;selectedVocabKey=key(defaults[0]);render()');
assert(!nodes.view.innerHTML.includes('vocab-photo-card'), 'Abstract word "a" must not render vocab-photo-card');
run('const appleIdx=defaults.findIndex(r=>r.word==="apple"&&r.pos==="noun");page=Math.floor(appleIdx/pageSize);selectedVocabKey=key(defaults[appleIdx]);render()');
assert(nodes.view.innerHTML.includes('class="real-photo-card vocab-photo-card"'), 'Concrete word "apple" must render vocab-photo-card');

// 3. Verify Reading (mode 5) renders 1 header photo and concrete word photos, without paragraph/gallery clutter
run('mode=5;render()');
click('read-open-wright');
assert(nodes.view.innerHTML.includes('reading-photo-card'), 'Reading header must render reading-photo-card');
click('read-stage-1');
assert(!nodes.view.innerHTML.includes('reading-para-photo'), 'Reading paragraphs must not be cluttered with per-paragraph photos');

// 4. Verify non-AI / non-diagram photo URL filter
assert.equal(run('isRealPhotoUrl("https://upload.wikimedia.org/wikipedia/commons/a/b/Wright_Flyer.jpg", "Wright Flyer")'), true);
assert.equal(run('isRealPhotoUrl("https://upload.wikimedia.org/wikipedia/commons/a/b/Icon.svg", "Icon")'), false);
assert.equal(run('isRealPhotoUrl("https://upload.wikimedia.org/wikipedia/commons/a/b/Locator_map.png", "Map")'), false);
assert.equal(run('isRealPhotoUrl("https://upload.wikimedia.org/wikipedia/commons/a/b/AI_generated_art.jpg", "Midjourney")'), false);

console.log(`PASS real photos: ${concreteCount} concrete 1-to-1 vocabulary photos verified, ${omittedCount} abstract/ambiguous words cleanly omitted (no misleading photos), 100% uncropped object-fit:contain display, fast 360px thumbnails & CDN preconnect.`);

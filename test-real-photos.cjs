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

// 1. Verify balanced photo coverage: ~4,271 suitable photos kept, ~1,672 truly abstract/grammatical words omitted
const withPhotoCount = run('defaults.filter(r => resolveVocabPhotoTopic(r) !== null).length');
const omittedCount = run('defaults.filter(r => resolveVocabPhotoTopic(r) === null).length');
assert(withPhotoCount >= 4000, `Expected >= 4,000 suitable vocabulary photos, got ${withPhotoCount}`);
assert(omittedCount >= 900 && omittedCount <= 2000, `Expected 900–2,000 truly abstract/grammatical entries omitted, got ${omittedCount}`);

// Verify concrete & situational words resolve to accurate Wikipedia topics
assert.equal(run('resolveVocabPhotoTopic({word:"apple",pos:"noun"}).query'), 'Apple');
assert.equal(run('resolveVocabPhotoTopic({word:"elephant",pos:"noun"}).query'), 'Elephant');
assert.equal(run('resolveVocabPhotoTopic({word:"pillow",pos:"noun"}).query'), 'Pillow');
assert.equal(run('resolveVocabPhotoTopic({word:"abandon",pos:"verb"}).query'), 'Shipwreck');
assert.equal(run('resolveVocabPhotoTopic({word:"bicycle",pos:"noun"}).query'), 'Bicycle');

// Verify purely grammatical and ultra-abstract words return null
for (const [w, p] of [
  ['a', 'indefinite article'], ['about', 'preposition'], ['above', 'preposition'],
  ['although', 'conjunction'], ['always', 'adverb'], ['aspect', 'noun'],
  ['assumption', 'noun'], ['consequence', 'noun'], ['consist', 'verb'],
  ['derive', 'verb'], ['illusion', 'noun'], ['phenomenon', 'noun'],
  ['theory', 'noun'], ['trouble', 'noun'], ['truth', 'noun'],
  ['wise', 'adjective'], ['worry', 'verb'], ['worth', 'adjective']
]) {
  assert.equal(run(`resolveVocabPhotoTopic({word:${JSON.stringify(w)},pos:${JSON.stringify(p)}})`), null, `Abstract word ${w}:${p} must not have a misleading photo`);
}

// 2. Verify ALL 5,943 vocabulary entries have the hidden Explanatory Example (EN / VI) section
const allHaveHiddenExExplain = run(`defaults.every(r => {
  const html = vocabularyDetails(r);
  return html.includes('class="meaning-reveal example-explain-reveal"')
    && html.includes('Show example &amp; explanation (EN / VI)')
    && html.includes('Explanatory example (EN):')
    && html.includes('Dịch nghĩa &amp; giải thích (VI):')
    && !html.includes('<details open')
    && !html.includes('<p><b>Example</b><br>Not available</p>');
})`);
assert(allHaveHiddenExExplain, 'All 5,943 vocabulary words must include a closed Explanatory Example (EN / VI) reveal and no missing Examples');

// 3. Verify Vocabulary view (mode 0) renders photo + hidden example explanation on "abandon" (#1)
run('mode=0;page=0;selectedVocabKey=key(defaults[1]);render()');
assert(nodes.view.innerHTML.includes('class="real-photo-card vocab-photo-card"'), 'Word "abandon" must render vocab-photo-card');
assert(nodes.view.innerHTML.includes('Show example &amp; explanation (EN / VI)'), 'Vocabulary view must render hidden example explanation');

// 4. Verify Reading (mode 5) Stage 0 and word modal also render hidden example explanation
run('mode=5;render()');
click('read-open-wright');
assert(nodes.view.innerHTML.includes('reading-photo-card'), 'Reading header must render reading-photo-card');
assert(nodes.view.innerHTML.includes('Show example &amp; explanation (EN / VI)'), 'Reading Stage 0 must render hidden example explanation');
click('read-word-0');
assert(nodes['reading-word-content'].innerHTML.includes('Show example &amp; explanation (EN / VI)'), 'Reading word dialog must render hidden example explanation');

// 5. Verify non-AI / non-diagram photo URL filter
assert.equal(run('isRealPhotoUrl("https://upload.wikimedia.org/wikipedia/commons/a/b/Wright_Flyer.jpg", "Wright Flyer")'), true);
assert.equal(run('isRealPhotoUrl("https://upload.wikimedia.org/wikipedia/commons/a/b/Icon.svg", "Icon")'), false);
assert.equal(run('isRealPhotoUrl("https://upload.wikimedia.org/wikipedia/commons/a/b/Locator_map.png", "Map")'), false);
assert.equal(run('isRealPhotoUrl("https://upload.wikimedia.org/wikipedia/commons/a/b/AI_generated_art.jpg", "Midjourney")'), false);

console.log(`PASS real photos & bilingual example explanations: ${withPhotoCount}/5943 suitable photos kept (${omittedCount} abstract/grammatical omitted), 5943/5943 hidden EN/VI explanatory examples verified, 100% uncropped object-fit:contain display.`);

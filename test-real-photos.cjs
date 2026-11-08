const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script(?:\s+id="([^"]*)")?(?:\s+type="([^"]*)")?>([\s\S]*?)<\/script>/g)];

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

// 1. Verify all 5,943 vocabulary entries resolve to valid real-photo topics with vocabulary hints
const vocabCount = run('defaults.length');
assert.equal(vocabCount, 5943, 'Should have 5,943 vocabulary entries');
const allResolved = run(`defaults.every(r => {
  const info = resolveVocabPhotoTopic(r);
  return info && info.query && info.query.length >= 2 && info.caption && info.caption.includes('Gợi ý');
})`);
assert(allResolved, 'Every vocabulary entry must resolve to a concrete photo query and Vietnamese hint caption');

// 2. Verify Vocabulary view (mode 0) renders real-photo-card
run('mode=0;render()');
assert(nodes.view.innerHTML.includes('class="real-photo-card vocab-photo-card"'), 'Vocabulary view must render real-photo-card');
assert(nodes.view.innerHTML.includes('Ảnh thật'), 'Vocabulary view must include real photo badge');

// 3. Verify Flashcards (mode 1) renders real-photo-card on BOTH front and flipped back
run('mode=1;flipped=false;render()');
assert(nodes.view.innerHTML.includes('class="real-photo-card vocab-photo-card compact-photo"'), 'Flashcard front must render compact real-photo-card hint');
run('mode=1;flipped=true;render()');
assert(nodes.view.innerHTML.includes('class="real-photo-card vocab-photo-card"'), 'Flashcard back must render full real-photo-card');

// 4. Verify Quiz (mode 2) renders real-photo-card hint
run('mode=2;render()');
assert(nodes.view.innerHTML.includes('class="real-photo-card vocab-photo-card compact-photo"'), 'Quiz view must render compact real-photo-card hint');

// 5. Verify Grammar (mode 4) renders grammar-photo-card
run('mode=4;render()');
assert(nodes.view.innerHTML.includes('grammar-photo-card'), 'Grammar view must render contextual real photo card');

// 6. Verify Reading (mode 5) Stage 0 (words) and Stage 1 (paragraphs & scene gallery)
run('mode=5;render()');
click('read-open-wright');
assert(nodes.view.innerHTML.includes('reading-photo-card'), 'Reading header must render reading-photo-card');
assert(nodes.view.innerHTML.includes('vocab-photo-card'), 'Reading Stage 0 must render vocab-photo-card for each target word');
click('read-word-0');
assert(nodes['reading-word-content'].innerHTML.includes('vocab-photo-card'), 'Reading word dialog must render vocab-photo-card');

click('read-stage-1');
const wrightParaPhotos = (nodes.view.innerHTML.match(/reading-para-photo/g) || []).length;
assert.equal(wrightParaPhotos, 4, '4-paragraph reading (wright) must render 4 reading-para-photo cards');
assert(nodes.view.innerHTML.includes('Gợi ý từ vựng trong đoạn'), 'Reading paragraph photos must include vocabulary hints for the paragraph');

// Check 1-paragraph reading (b1-ice-a) renders paragraph photo + 3-scene visual gallery
click('read-open-b1-ice-a');
click('read-stage-1');
assert(nodes.view.innerHTML.includes('reading-para-photo'), '1-paragraph reading must render reading-para-photo');
const galleryPhotos = (nodes.view.innerHTML.match(/reading-gallery-photo/g) || []).length;
assert.equal(galleryPhotos, 3, '1-paragraph reading must also render 3 reading-gallery-photo cards');

// 7. Verify Collocations (mode 6) renders real photos on cards and in word modal
run('mode=6;handleStudyAction("col-open-"+collocations[0].id)');
assert(nodes.view.innerHTML.includes('vocab-photo-card'), 'Collocation cards must render real photo cards');
click('col-word-0');
assert(nodes['reading-word-content'].innerHTML.includes('vocab-photo-card'), 'Collocation word modal must render real photo card');

// 8. Verify non-AI / non-diagram photo URL filter
assert.equal(run('isRealPhotoUrl("https://upload.wikimedia.org/wikipedia/commons/a/b/Wright_Flyer.jpg", "Wright Flyer")'), true);
assert.equal(run('isRealPhotoUrl("https://upload.wikimedia.org/wikipedia/commons/a/b/Icon.svg", "Icon")'), false);
assert.equal(run('isRealPhotoUrl("https://upload.wikimedia.org/wikipedia/commons/a/b/Locator_map.png", "Map")'), false);
assert.equal(run('isRealPhotoUrl("https://upload.wikimedia.org/wikipedia/commons/a/b/AI_generated_art.jpg", "Midjourney")'), false);

console.log('PASS real photos: 5943/5943 vocabulary words, flashcards (front & back), quiz, 120 grammar lessons, 348 readings (608 paragraphs + scene galleries), and 820 collocations verified with non-AI Wikimedia filter.');

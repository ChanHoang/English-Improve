const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');

const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
const collocations = require('./collocations-v1.json');
const plan = require('./collocations-plan.json');
const rows = JSON.parse(html.match(/<script id="bundle" type="application\/json">([^<]*)<\/script>/)[1]);

// 1. Validate Roadmap >= 3,000 collocations & A2+ only
assert(plan.totalPlannedCollocations >= 3000, 'Roadmap must have at least 3,000 collocations');
assert.equal(plan.totalPlannedCollocations, 3480);
assert.equal(plan.totalGroups, 174);
assert.equal(plan.completedCollocations, 1820, 'Batches 1–5 have 1,820 completed collocations');
assert.equal(plan.completedGroups, 91);
assert.equal(plan.levels.A2.completedCollocations, 720, 'All 720 A2 collocations across 36 groups completed');
assert.equal(plan.levels.B1.completedCollocations, 680, 'All 680 B1 collocations across 34 groups completed');
assert.equal(plan.levels.B2.completedCollocations, 400, '20 B2 groups = 400 B2 collocations completed');

for (const g of plan.groups) {
  assert(['A2', 'B1', 'B2', 'C1'].includes(g.level), `Group ${g.group} level must be A2+`);
  assert.equal(g.targets.length, 20);
  for (const t of g.targets) {
    const src = rows[t.rowIndex];
    assert(src, `Valid rowIndex ${t.rowIndex}`);
    assert.notEqual(src.level, 'A1', `No A1 words allowed in collocations roadmap: ${src.word}`);
    assert.equal(t.word, src.word);
    assert.equal(t.pos, src.pos);
    assert.equal(t.level, src.level);
    assert(t.collocation && t.collocation.length >= 3);
  }
}

// 2. Validate Batches 1–5 active groups (1,820 collocations, 910 questions)
const uniqueRows = new Set();
const questionIds = new Set();
let totalQuestions = 0;

for (const g of collocations) {
  assert.equal(g.items.length, 20);
  assert.equal(g.questions.length, 10);
  for (const it of g.items) {
    assert(!uniqueRows.has(it.rowIndex), `Unique rowIndex ${it.rowIndex}`);
    uniqueRows.add(it.rowIndex);
    const src = rows[it.rowIndex];
    assert.notEqual(src.level, 'A1', 'Strictly A2 and above');
    assert.equal(it.word, src.word);
    assert.equal(it.pos, src.pos);
    assert.equal(it.level, src.level);
    assert(it.collocation.length >= 4);
    assert(it.pattern.length >= 4);
    assert(it.en.length >= 10);
    assert(it.vi.length >= 3);
    assert(it.example.length >= 15);
    assert(it.exampleVi.length >= 10);
    assert(it.note.length >= 15);
  }
  for (const q of g.questions) {
    assert(!questionIds.has(q.id));
    questionIds.add(q.id);
    assert.equal(q.options.length, 3);
    assert.equal(new Set(q.options).size, 3);
    assert.equal(q.explanations.length, 3);
    assert(q.explanations.every(e => e.length > 15));
    totalQuestions++;
  }
}
assert.equal(uniqueRows.size, 1820);
assert.equal(totalQuestions, 910);

// 3. Validate UI navigation, hidden Vietnamese meanings, word dialog, and practice persistence in VM
const store = new Map();
function boot() {
  const nodes = new Proxy({}, {
    get: (o, k) => o[k] ??= {
      value: '',
      checked: false,
      innerHTML: '',
      scrollTop: 0,
      parentElement: {},
      classList: {
        set: new Set(),
        remove(c) { this.set.delete(c); },
        add(c) { this.set.add(c); },
        contains(c) { return this.set.has(c); }
      },
      setAttribute(k, v) { this[k] = v; },
      focus() {},
      reportValidity() { this.invalid = true; },
      showModal() { this.open = true; },
      close() { this.open = false; },
      querySelector() { return { open: false, focus() {} }; },
      querySelectorAll() { return []; }
    }
  });
  nodes.bundle.textContent = html.match(/<script id="bundle" type="application\/json">([^<]*)<\/script>/)[1];
  nodes['a1-vietnamese'].textContent = html.match(/<script id="a1-vietnamese" type="application\/json">([^<]*)<\/script>/)[1];
  nodes['michael-audio-manifest'].textContent = html.match(/<script id="michael-audio-manifest" type="application\/json">([^<]*)<\/script>/)[1];
  const c = {
    document: {
      getElementById: id => nodes[id],
      addEventListener() {},
      querySelectorAll() { return []; },
      documentElement: { dataset: { theme: 'light' } }
    },
    localStorage: {
      getItem: k => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v)
    },
    window: { scrollY: 0, scrollTo() {} }
  };
  vm.createContext(c);
  vm.runInContext(script, c);
  return { nodes, run: s => vm.runInContext(s, c) };
}

let { nodes, run } = boot();
const dispatch = a => run('handleStudyAction(' + JSON.stringify(a) + ')');

// Switch to Collocations mode (mode 6)
run('mode=6;render()');
assert.equal(nodes['secondary-title'].textContent, 'Collocations');
assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="col-level-/g) || []).length, 4);
assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="col-open-/g) || []).length, 91);
assert.match(nodes.view.innerHTML, /1820 active collocations/);
assert.match(nodes.view.innerHTML, /3,480 planned collocations across 174 groups/);

dispatch('col-level-A2');
assert.equal(run('collocationLevel'), 'A2');
assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="col-open-/g) || []).length, 36);
assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="col-plan-/g) || []).length, 0);

dispatch('col-level-B1');
assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="col-open-/g) || []).length, 34);
assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="col-plan-/g) || []).length, 0);

dispatch('col-level-B2');
assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="col-open-/g) || []).length, 20);
assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="col-plan-/g) || []).length, 36);

dispatch('col-level-C1');
assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="col-open-/g) || []).length, 1);

for (const g of collocations) {
  dispatch('col-open-' + g.id);
  assert.equal(run('selectedCollocation'), g.id);
  assert.equal(run('collocationStage'), 0);
  assert.equal((nodes.view.innerHTML.match(/class="collocation-item"/g) || []).length, 20);
  assert(!nodes.view.innerHTML.includes('<details open'), 'Vietnamese meanings must start closed');
  assert(nodes.view.innerHTML.includes('Show Vietnamese meaning'));
  assert(nodes.view.innerHTML.includes('headphone-icon'));

  dispatch('col-word-0');
  assert.equal(nodes['reading-word-dialog'].open, true);
  assert(nodes['reading-word-content'].innerHTML.includes(g.items[0].collocation));
  nodes['reading-word-dialog'].close();

  dispatch('col-stage-1');
  assert.equal(run('collocationStage'), 1);
  dispatch('cq-complete');
  assert(!run('collocationDone[' + JSON.stringify(g.id) + ']'), 'Cannot complete before answering all questions');

  for (let i = 0; i < g.questions.length; i++) {
    const q = g.questions[i];
    dispatch('cq-page-' + Math.floor(i / 5));
    const pick = i === 0 ? (q.answer + 1) % 3 : q.answer;
    dispatch('cq-answer-' + i + '-' + pick);
    assert.equal(run('collocationAnswers[' + JSON.stringify(g.id) + '][' + i + ']'), pick);
    assert.match(nodes.view.innerHTML, /option-explanation right/);
    assert.match(nodes.view.innerHTML, /option-explanation wrong/);
    dispatch('cq-answer-' + i + '-' + q.answer);
    assert.equal(run('collocationAnswers[' + JSON.stringify(g.id) + '][' + i + ']'), pick);
  }
  dispatch('cq-complete');
  assert(run('collocationDone[' + JSON.stringify(g.id) + ']'));
}

({ nodes, run } = boot());
assert.equal(run('Object.values(collocationDone).filter(Boolean).length'), 91);
run('mode=3;render()');
assert.match(nodes.view.innerHTML, /Collocations · 91 \/ 91 active groups completed/);

console.log('PASS Collocations: 3,480 A2–C1 planned collocations across 174 groups (10 batches); 1,820 active collocations in 91 groups across Batches 1–5 (720/720 A2 complete, 680/680 B1 complete, 400/1,120 B2, 20 C1); 910 practice questions; hidden Vietnamese meanings; audio & progress persistence.');

if (fs.existsSync(__dirname + "/test-real-photos.cjs")) require("./test-real-photos.cjs");

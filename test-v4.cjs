const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8'),script=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
const store=new Map([['ox5-reading-answers-v2','{"wright":{"0":2}}'],['ox5-progress','{"test":"known"}']]);
function boot(){
 const nodes=new Proxy({}, {get:(o,k)=>o[k]??={value:'',checked:false,innerHTML:'',scrollTop:0,parentElement:{},classList:{set:new Set(),remove(c){this.set.delete(c)},add(c){this.set.add(c)},contains(c){return this.set.has(c)}},setAttribute(k,v){this[k]=v},focus(){},reportValidity(){this.invalid=true},showModal(){this.open=true},close(){this.open=false},querySelector(){return {open:false,focus(){}}},querySelectorAll(){return []}}});
 nodes.bundle.textContent=html.match(/<script id="bundle" type="application\/json">([^<]*)<\/script>/)[1];
 const c={document:{getElementById:id=>nodes[id],addEventListener(){}},localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)},window:{scrollY:0,scrollTo(){}}};vm.createContext(c);vm.runInContext(script,c);return {nodes,run:s=>vm.runInContext(s,c)};
}
let {nodes,run}=boot();
const dispatch=a=>run('handleStudyAction('+JSON.stringify(a)+')'),readAction=a=>run('handleReadingAction('+JSON.stringify(a)+')');
assert.equal(run('defaults.length'),5943);assert.equal(run('grammar.length'),120);assert.equal(run('readings.length'),152);
assert.equal(run('Object.keys(readingAnswers).length'),0,'old assessment results must not be reused');
assert.equal((nodes.view.innerHTML.match(/data-row=/g)||[]).length,1,'single word in main area');
for(const label of ['Vocabulary','Grammar','Reading'])assert(nodes.tabs.innerHTML.includes('>'+label+'</button>'));
assert(!nodes.tabs.innerHTML.includes('C1'));
for(const size of [10,20,50,100,200]){run('pageSize='+size+';page=0;render()');assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="entry-/g)||[]).length,size)}
dispatch('entry-201');assert.equal(run('page'),1);assert.equal(run('selectedVocabKey'),run('key(filtered()[201])'));
nodes['page-number'].value='10';nodes['secondary-items'].onsubmit({target:{id:'page-form'},preventDefault(){}});assert.equal(run('page'),9);
nodes['page-number'].value='9999';nodes['secondary-items'].onsubmit({target:{id:'page-form'},preventDefault(){}});assert.equal(run('page'),9);assert(nodes['page-number'].invalid);
run('mode=4;render()');assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="g-open-/g)||[]).length,120);assert.equal((nodes.view.innerHTML.match(/data-lesson=/g)||[]).length,1);
const bank=JSON.parse(fs.readFileSync(__dirname+'/grammar-quiz.json','utf8'));let grammarCount=0;
for(const [id,qs] of Object.entries(bank)){
 assert(qs.length>=10,id);dispatch('g-open-'+id);assert(nodes.view.innerHTML.includes('data-lesson="'+id+'"'));
 dispatch('g-panel-practice');assert.equal(run('grammarPanel'),'practice');
 for(let i=0;i<qs.length;i++){
  const q=qs[i];assert.equal(q.options.length,3);assert.equal(q.explanations.length,3);assert.equal(new Set(q.options).size,3);assert(q.explanations.every(x=>x.length>15));
  dispatch('gq-page-'+Math.floor(i/5));const pick=i===0?(q.answer+1)%3:q.answer;dispatch('gq-answer-'+i+'-'+pick);
  assert.equal(run('grammarAnswers[selectedGrammar]['+i+']'),pick);
  assert(nodes.view.innerHTML.includes(q.explanations[0].replaceAll('&','&amp;').replaceAll('<','&lt;'))||nodes.view.innerHTML.includes('option-explanation'),'explanations rendered');
  dispatch('gq-answer-'+i+'-'+q.answer);assert.equal(run('grammarAnswers[selectedGrammar]['+i+']'),pick,'no changing locked answer');grammarCount++;
 }
}
run("document.getElementById('query').value='present simple';render()");assert.match(nodes['secondary-items'].innerHTML,/Present simple/);
run("document.getElementById('query').value='';mode=5;selectedReading=null;readingLevel=null;render()");assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="read-open-/g)||[]).length,0);
assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="read-level-/g)||[]).length,4);
dispatch('read-level-A2');assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="read-open-/g)||[]).length,72);assert.match(nodes.view.innerHTML,/36 groups · 72 readings · 990 target words/);
dispatch('read-level-A2');assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="read-open-/g)||[]).length,0);
dispatch('read-level-B1');assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="read-open-/g)||[]).length,68);assert.match(nodes.view.innerHTML,/34 groups · 68 readings · 902 target words/);
dispatch('read-level-B2');assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="read-open-/g)||[]).length,12);
dispatch('read-level-C1');assert.match(nodes.view.innerHTML,/No readings published at this level yet/);
dispatch('read-level-A2');nodes.query.value='no-matching-reading-xyz';run('render()');assert.match(nodes.view.innerHTML,/No readings match/);assert.equal((nodes['secondary-items'].innerHTML.match(/data-action="read-open-/g)||[]).length,0);nodes.query.value='';run('render()');
const lessons=JSON.parse(fs.readFileSync(__dirname+'/readings-v3.json','utf8')),groups=new Map();let readingCount=0;
for(const l of lessons){
 assert(l.level!=='A1');assert(l.targets.length>=25&&l.targets.length<=30);assert(l.questions.length>=34);assert(l.sources.length);groups.set(l.group,[...(groups.get(l.group)||[]),l]);
 readAction('read-open-'+l.id);readAction('read-stage-0');assert.match(nodes.view.innerHTML,/Learn the words/);assert(!nodes.view.innerHTML.includes('assessment-question'));
 readAction('read-word-0');assert(nodes['reading-word-dialog'].open);readAction('read-close');
 assert(nodes.view.innerHTML.includes('Learn '+l.targets.length+' words'));assert.equal(run('readingLevel'),l.level);
 readAction('read-stage-1');assert.equal((nodes.view.innerHTML.match(/class="word-link"/g)||[]).length,l.targets.length);assert(!/Đoạn [1-9]/.test(nodes.view.innerHTML));
 for(const t of l.targets){const o=t.occurrence;assert.equal(l.paragraphs[o.p][0].slice(o.start,o.end),o.text);assert.equal(run('defaults['+t.rowIndex+'].word'),t.word);assert(['A1','A2','B1','B2','C1'].indexOf(t.level)<=['A1','A2','B1','B2','C1'].indexOf(l.level));}
 for(const g of l.grammar)assert(l.questions.filter(q=>q.grammarId===g.id).length>=2);
 dispatch('read-grammar-'+l.grammar[0].id);assert.equal(run('mode'),4);assert.equal(run('selectedGrammar'),l.grammar[0].id);readAction('read-return');assert.equal(run('mode'),5);assert.equal(run('readingStage()'),1);
 readAction('read-stage-2');dispatch('rq-complete');assert(!run('readingDone[selectedReading]'));
 for(let i=0;i<l.questions.length;i++){
  const q=l.questions[i];assert.equal(q.explanations.length,q.options.length);assert.equal(new Set(q.options).size,q.options.length);assert(q.explanations.every(x=>x.length>10));
  dispatch('rq-category-'+q.category);const qi=l.questions.slice(0,i).filter(x=>x.category===q.category).length;dispatch('rq-page-'+Math.floor(qi/5));
  const pick=i===0?(q.answer+1)%3:q.answer;dispatch('rq-answer-'+i+'-'+pick);assert.equal(run('readingAnswers[selectedReading]['+i+']'),pick);assert.match(nodes.view.innerHTML,/option-explanation right/);assert.match(nodes.view.innerHTML,/option-explanation wrong/);readingCount++;
 }
 dispatch('rq-complete');assert(run('readingDone[selectedReading]'));
}
assert.equal(groups.size,76);const unique=new Set();for(const pair of groups.values()){assert.equal(pair.length,2);assert.deepEqual(pair[0].targets.map(t=>t.rowIndex),pair[1].targets.map(t=>t.rowIndex));if(pair[0].level==='A2')for(const t of pair[0].targets){assert(!unique.has(t.rowIndex));unique.add(t.rowIndex)}}assert.equal(unique.size,990);
assert.deepEqual(lessons.filter(l=>!l.id.startsWith('b1-')),JSON.parse(fs.readFileSync(__dirname+'/readings-before-b1.json','utf8')),'old lessons and answer indexes unchanged');
({nodes,run}=boot());assert.equal(run('Object.keys(grammarAnswers).length'),120);assert.equal(run('Object.values(readingDone).filter(Boolean).length'),152);
run("mode=5;selectedReading='morse';render()");assert.equal(run('Object.keys(readingAnswers.morse).length'),34);
dispatch('rq-reset');assert.equal(run('Object.keys(readingAnswers.morse).length'),0);assert(!run('readingDone.morse'));
run('mode=4;selectedGrammar=1;grammarPanel="practice";render()');dispatch('gq-reset');assert.equal(run('Object.keys(grammarAnswers[1]).length'),0);
nodes['menu-toggle'].onclick();assert(nodes.sidebar.classList.contains('is-open'));nodes['lessons-toggle'].onclick();assert(!nodes.sidebar.classList.contains('is-open'));assert(nodes.secondary.classList.contains('is-open'));run('closeMenu()');assert(!nodes.secondary.classList.contains('is-open'));
run("mode=2;document.getElementById('query').value='';render()");run('quiz.pick=0;round.total=10;render()');assert.match(nodes.view.innerHTML,/option-explanations/,'last vocabulary quiz answer also explains all options');run('quiz=null;render()');assert.match(nodes.view.innerHTML,/Results/);
console.log('PASS '+grammarCount+' grammar questions; '+readingCount+' reading questions; 990 A2 entries; 152 lessons; all-option explanations, wrong/correct locks, category pagination, completion guards, reset, persistence, grammar links, level accordion, two-level navigation, mobile drawers, vocabulary page sizes/jump, final quiz feedback.');

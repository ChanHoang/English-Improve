const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8'),script=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
const store=new Map([['ox5-reading-answers',JSON.stringify({wright:{0:2}})]]);
function boot(){
 const nodes=new Proxy({}, {get:(o,k)=>o[k]??={value:'',checked:false,innerHTML:'',parentElement:{},classList:{remove(){},toggle(){return true}},setAttribute(){},focus(){},showModal(){this.open=true},close(){this.open=false},querySelector(){return {open:false,focus(){}}},querySelectorAll(){return []}}});
 nodes.bundle.textContent=html.match(/<script id="bundle" type="application\/json">([^<]*)<\/script>/)[1];
 const c={document:{getElementById:id=>nodes[id],addEventListener(){}},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},window:{scrollY:0,scrollTo(){}}};
 vm.createContext(c);vm.runInContext(script,c);return {nodes,run:s=>vm.runInContext(s,c)};
}
let {nodes,run}=boot();
assert.equal(run('defaults.length'),5943);assert.equal(run('grammar.length'),120);
assert.equal(run('new Set(curriculum.flatMap(c=>c.ids)).size'),120);assert.equal(run('curriculum.flatMap(c=>c.ids).length'),120);
assert(run('grammar.every(g=>g.examples.length>=4&&g.structures.length&&g.practice.length)'));
run('mode=4;render()');assert.equal((nodes.view.innerHTML.match(/data-lesson=/g)||[]).length,120);
run('mode=5;render()');assert.equal((nodes.view.innerHTML.match(/data-action="read-open-/g)||[]).length,2);
assert.match(nodes.view.innerHTML,/4\/120/);
const lessons=JSON.parse(fs.readFileSync(__dirname+'/readings.json','utf8'));
assert.deepEqual(lessons[0].targets.map(t=>t.rowIndex),lessons[1].targets.map(t=>t.rowIndex));
for(const l of lessons){
 assert.equal(l.level,'A2');assert.equal(l.targets.length,25);assert.equal(l.questions.length,5);
 run('handleReadingAction('+JSON.stringify('read-open-'+l.id)+')');
 assert.equal(run('readingStage()'),0);assert.match(nodes.view.innerHTML,/Từ vựng của nhóm/);assert(!nodes.view.innerHTML.includes('class="reading-question"'));
 run("handleReadingAction('read-word-0')");assert.equal(nodes['reading-word-dialog'].open,true);
 run("handleReadingAction('read-review')");run("handleReadingAction('read-close')");
 run("handleReadingAction('read-stage-1')");assert.equal((nodes.view.innerHTML.match(/class="word-link"/g)||[]).length,25);assert(!/Đoạn [1-9]/.test(nodes.view.innerHTML));
 for(const t of l.targets){assert.equal(l.paragraphs[t.occurrence.p][0].slice(t.occurrence.start,t.occurrence.end),t.occurrence.text);assert.equal(run('defaults['+t.rowIndex+'].word'),t.word)}
 run('handleReadingAction('+JSON.stringify('read-grammar-'+l.grammar[0].id)+')');assert.equal(run('mode'),4);
 run("handleReadingAction('read-return')");assert.equal(run('readingStage()'),1);
 run("handleReadingAction('read-stage-2')");assert.equal((nodes.view.innerHTML.match(/class="reading-question"/g)||[]).length,5);
 run("handleReadingAction('read-complete')");assert(!run('readingDone[selectedReading]'));
 l.questions.forEach((q,i)=>run('handleReadingAction('+JSON.stringify('read-answer-'+i+'-'+q.answer)+')'));
 assert.match(nodes.view.innerHTML,/Đúng 5\/5/);
 run("handleReadingAction('read-answer-0-99')");assert.match(nodes.view.innerHTML,/Đúng 5\/5/);
 run("handleReadingAction('read-complete')");assert(run('readingDone[selectedReading]'));
}
({nodes,run}=boot());assert.equal(run('Object.values(readingDone).filter(Boolean).length'),2);
run("mode=5;selectedReading='wright';render()");assert.equal(run('readingStage()'),2);assert.match(nodes.view.innerHTML,/Đúng 5\/5/);
run("handleReadingAction('read-reset')");assert.match(nodes.view.innerHTML,/Đúng 0\/5/);assert(!run('readingDone.wright'));
run("mode=0;selectedReading=null;render()");assert.match(nodes.view.innerHTML,/Trang 1/);
for(const n of [10,20,50,100,200]){run('pageSize='+n+';render()');assert.equal((nodes.view.innerHTML.match(/<details data-row=/g)||[]).length,n)}
nodes['sidebar-lesson'].onchange({target:{value:'120'}});assert.equal(run('mode'),4);assert.match(nodes.view.innerHTML,/data-lesson="120"/);
console.log('PASS: 5,943 entries; 120 expanded grammar lessons; all 120 roadmap allocations; two A2 stories, same 25 verified targets; all three stages; quiz guards/scoring/reset/persistence; grammar links; pagination; sidebar jump.');

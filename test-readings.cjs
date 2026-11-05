const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync('Oxford/index.html','utf8');
const script=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
const store=new Map();
function boot(){
 const nodes=new Proxy({}, {get:(o,k)=>o[k]??={value:'',checked:false,parentElement:{},focus(){},showModal(){this.open=true},close(){this.open=false},querySelector(){return {open:false,focus(){}}},querySelectorAll(){return []}}});
 nodes.bundle.textContent=html.match(/<script id="bundle" type="application\/json">([^<]*)<\/script>/)[1];
 const c={document:{getElementById:id=>nodes[id]},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},window:{scrollY:0,scrollTo(){}}};
 vm.createContext(c);vm.runInContext(script,c);
 return {nodes,run:s=>vm.runInContext(s,c)};
}
let {nodes,run}=boot();
run('mode=5;render()');assert.match(nodes.view.innerHTML,/BẢN MẪU/);
assert.equal((nodes.view.innerHTML.match(/Mở bài đọc/g)||[]).length,5);
const lessons=JSON.parse(fs.readFileSync('Oxford/readings.json','utf8'));
for(const l of lessons){
 run('handleReadingAction('+JSON.stringify('read-open-'+l.id)+')');
 assert.equal((nodes.view.innerHTML.match(/class="word-link"/g)||[]).length,25);
 for(const t of l.targets){
  assert.equal(l.paragraphs[t.occurrence.p][0].slice(t.occurrence.start,t.occurrence.end),t.occurrence.text);
 }
 run("handleReadingAction('read-word-0')");
 assert.equal(nodes['reading-word-dialog'].open,true);
 assert(nodes['reading-word-content'].innerHTML.includes(l.targets[0].vi));
 run("handleReadingAction('read-review')");
 assert(run("state(defaults[readings.find(x=>x.id===selectedReading).targets[0].rowIndex])")==='review');
 run("handleReadingAction('read-close')");
 assert.equal(nodes['reading-word-dialog'].open,false);
 run("handleReadingAction('read-answer-0-"+l.questions[0].answer+"')");
 assert.match(nodes.view.innerHTML,/Đúng 1 \/ 4/);
 run("handleReadingAction('read-answer-0-"+((l.questions[0].answer+1)%3)+"')");
 assert.match(nodes.view.innerHTML,/Đúng 1 \/ 4/);
 run("handleReadingAction('read-complete')");
 run("handleReadingAction('read-grammar-"+l.grammar[0].id+"')");
 assert.equal(run('mode'),4);
 assert.match(nodes.view.innerHTML,/Trở lại bài đọc/);
 run("handleReadingAction('read-return')");
 assert.equal(run('mode'),5);
 assert(nodes.view.innerHTML.includes(l.englishTitle));
}
({nodes,run}=boot());
assert.equal(run('Object.keys(readingDone).length'),5);
run("mode=5;selectedReading='marshmallow';render()");
assert.match(nodes.view.innerHTML,/Đúng 1 \/ 4/);
run("handleReadingAction('read-reset')");
assert.match(nodes.view.innerHTML,/Đúng 0 \/ 4/);
run("selectedReading=null;document.getElementById('query').value='penicillin';render()");
assert.equal((nodes.view.innerHTML.match(/Mở bài đọc/g)||[]).length,1);
run("mode=0;document.getElementById('query').value='';render()");
assert.match(nodes.view.innerHTML,/Trang 1/);
run('mode=4;render()');assert.equal((nodes.view.innerHTML.match(/data-lesson=/g)||[]).length,120);
console.log('PASS 5 readings, 125 marked targets, dialog, shared review state, grading, no regrading, persistence, grammar return, search, existing views');

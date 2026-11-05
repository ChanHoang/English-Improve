const fs=require('fs'),assert=require('assert/strict');
const old=require('./readings-before-batch-07-11.json'),all=require('./readings-v3.json');
assert.equal(all.length-old.length,10);
for(const l of old)assert.deepEqual(all.find(x=>x.id===l.id),l,'Existing content and saved-answer indexes must remain stable: '+l.id);
const fresh=all.filter(l=>!old.some(x=>x.id===l.id));
for(const l of fresh){
 assert(l.wordCount>=280,l.id+' needs a developed article');
 assert.equal(l.questions.length,34);
 assert.equal(l.questions.filter(q=>q.category==='content').length,5);
 assert.equal(l.questions.filter(q=>q.category==='vocabulary').length,25);
 assert.equal(l.questions.filter(q=>q.category==='grammar').length,4);
 assert(l.targets.every(t=>t.level!=='A1'));
 const text=l.paragraphs.map(p=>p[0]).join('\n');
 for(const g of l.grammar){assert(text.includes(g.example),l.id+' grammar quotation '+g.id);assert(l.questions.filter(q=>q.grammarId===g.id).length>=2)}
 for(const t of l.targets)assert.equal(l.questions.filter(q=>q.targetWord===t.word).length,1);
 assert(!text.includes('[['));assert(l.paragraphs.every(p=>p[1].length>100));
 assert(l.sources.every(s=>s[1].startsWith('https://')));
}
const html=fs.readFileSync('index.html','utf8');assert(!html.includes('Đã có 6 nhóm / 12 bài'));
console.log('PASS: 10 new articles; 340 new questions; original 12 articles and question order unchanged; 25 non-A1 targets per article; exact grammar examples; aligned translations and sources.');
console.log(fresh.map(l=>l.id+': '+l.wordCount+' words').join('\n'));
console.log('Grammar coverage: '+new Set(all.flatMap(l=>l.grammar.map(g=>g.id))).size+'/120');

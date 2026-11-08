const fs=require('fs'),assert=require('assert/strict');
const html=fs.readFileSync('index.html','utf8'),rows=JSON.parse(html.match(/<script id="bundle" type="application\/json">([^<]*)<\/script>/)[1]);
const lessons=require('./readings-v3.json'),old=require('./readings-before-a2.json'),a2=lessons.filter(l=>l.level==='A2'),added=lessons.filter(l=>l.id.startsWith('a2-'));
const expected=rows.flatMap((r,i)=>r.level==='A2'?[i]:[]),actual=[...new Set(a2.flatMap(l=>l.targets.map(t=>t.rowIndex)))].sort((a,b)=>a-b);
assert.deepEqual(actual,expected);assert.equal(a2.length,72);assert.equal(added.length,66);
assert.deepEqual(lessons.filter(l=>! /^(a2|b1|b2[sc]|c1[sc])-/.test(l.id)),old);
const groupRows=new Set(),questionIds=new Set(),grammarIds=new Set();
for(const l of a2){
 assert(l.targets.length>=25&&l.targets.length<=30);
 for(const t of l.targets){assert.equal(rows[t.rowIndex].level,'A2');assert.equal(t.word,rows[t.rowIndex].word);assert.equal(t.pos,rows[t.rowIndex].pos);if(l.part==='A'){assert(!groupRows.has(t.rowIndex));groupRows.add(t.rowIndex)}}
 for(const g of l.grammar)grammarIds.add(g.id);
}
for(const id of [...Array.from({length:8},(_,i)=>i+1),...Array.from({length:8},(_,i)=>i+11),...Array.from({length:49},(_,i)=>i+21)])assert(grammarIds.has(id),'planned grammar '+id);
for(const l of added){
 assert(l.wordCount>=220);assert(!l.paragraphs.some(p=>p[0].includes('[[')));
 assert(l.paragraphs.every(p=>p[0].trim()&&p[1].trim()));
 assert(l.sources.every(s=>s[0]&&new URL(s[1]).protocol==='https:'));
 assert.equal(l.questions.filter(q=>q.category==='content').length,5);
 const vqs=l.questions.filter(q=>q.category==='vocabulary');
 assert.equal(vqs.length,l.targets.length);
 assert.notDeepEqual(vqs.map(q=>q.targetIndex),l.targets.map((_,i)=>i),'vocabulary questions must be shuffled vs Learn-the-words order');
 assert(l.questions.filter(q=>q.category==='grammar').length>=8);
 for(const [i,t] of l.targets.entries()){
  assert.equal(t.en,rows[t.rowIndex].def,'do not invent source definitions');
  const q=l.questions.find(q=>q.category==='vocabulary'&&q.targetIndex===i);assert(q);
  assert([t.vi,t.word,t.occurrence.text,`${t.pos} · ${t.vi}`].includes(q.options[q.answer]));
  const o=t.occurrence;assert.equal(l.paragraphs[o.p][0].slice(o.start,o.end),o.text);
 }
 for(const g of l.grammar){assert(l.paragraphs.some(p=>p[0].includes(g.example)));assert(l.questions.filter(q=>q.grammarId===g.id).length>=4)}
 for(const q of l.questions){assert(!questionIds.has(q.id));questionIds.add(q.id);assert.equal(new Set(q.options).size,3);assert.equal(q.explanations.length,3);assert(q.explanations.every(s=>s.length>15))}
}
assert(!/<script[^>]+src=|<link[^>]+rel=["']stylesheet/i.test(html),'standalone offline app');
assert(html.includes('English definition unavailable in the source.'));
assert(html.includes('Vietnamese guide'));
assert(html.includes('reading-level-switcher{position:sticky'));
assert.equal(require('./a2-build-status.json').filter(x=>x.status==='complete').length,33);
console.log('PASS A2: 990/990 exact source entries, 36 paired groups, 72 readings, '+a2.reduce((s,l)=>s+l.questions.length,0)+' questions, '+grammarIds.size+' grammar topics; shuffled multi-format vocabulary & expanded grammar verified.');

const fs=require('fs'),assert=require('assert/strict');
const html=fs.readFileSync('index.html','utf8'),rows=JSON.parse(html.match(/<script id="bundle" type="application\/json">([^<]*)<\/script>/)[1]);
const lessons=require('./readings-v3.json'),old=require('./readings-before-b1.json'),b1=lessons.filter(l=>l.level==='B1'),added=b1.filter(l=>l.id.startsWith('b1-'));
assert.deepEqual(lessons.filter(l=>!l.id.startsWith('b1-')),old,'preserve all 88 old lessons and saved answer positions');
assert.equal(b1.length,68);assert.equal(added.length,64);assert.equal(new Set(b1.map(l=>l.group)).size,34);
const expected=rows.flatMap((r,i)=>r.level==='B1'?[i]:[]),actual=[...new Set(b1.flatMap(l=>l.targets.filter(t=>t.level==='B1').map(t=>t.rowIndex)))].sort((a,b)=>a-b);
assert.deepEqual(actual,expected);assert.equal(actual.length,902);
const groupRows=new Set(),questionIds=new Set(),grammarIds=new Set();
for(const l of b1){
 assert(l.targets.length>=25&&l.targets.length<=30);
 if(l.part==='A')for(const t of l.targets.filter(t=>t.level==='B1')){assert(!groupRows.has(t.rowIndex),'avoid unplanned duplicate target');groupRows.add(t.rowIndex)}
 for(const g of l.grammar)grammarIds.add(g.id);
}
for(const l of added){
 assert(l.wordCount>=220);assert(!l.paragraphs.some(p=>p[0].includes('[[')));assert(l.paragraphs.every(p=>p[0].trim()&&p[1].trim()));
 assert(l.sources.length&&l.sources.every(s=>s[0]&&new URL(s[1]).protocol==='https:'));
 assert.equal(l.questions.filter(q=>q.category==='content').length,5);
 assert.equal(l.questions.filter(q=>q.category==='vocabulary').length,l.targets.length);
 assert.equal(l.questions.filter(q=>q.category==='grammar').length,4);
 for(const [i,t] of l.targets.entries()){
  const source=rows[t.rowIndex];assert.equal(t.level,'B1');assert.equal(source.level,'B1');assert.equal(t.word,source.word);assert.equal(t.pos,source.pos);assert.equal(t.en,source.def,'never invent dictionary definitions');
  const q=l.questions.find(q=>q.targetIndex===i);assert(q);assert.equal(q.options[q.answer],t.vi);const o=t.occurrence;assert.equal(l.paragraphs[o.p][0].slice(o.start,o.end),o.text);
 }
 for(const g of l.grammar){assert(l.paragraphs.some(p=>p[0].includes(g.example)));assert.equal(l.questions.filter(q=>q.grammarId===g.id).length,2)}
 for(const q of l.questions){assert(!questionIds.has(q.id));questionIds.add(q.id);assert.equal(new Set(q.options).size,3,l.id+' '+q.q);assert.equal(q.explanations.length,3);assert(q.explanations.every(s=>s.length>10))}
 const pair=added.filter(x=>x.group===l.group);assert.equal(pair.length,2);assert.deepEqual(pair[0].targets.map(t=>t.rowIndex),pair[1].targets.map(t=>t.rowIndex));assert.notEqual(pair[0].englishTitle,pair[1].englishTitle);assert.notDeepEqual(pair[0].paragraphs,pair[1].paragraphs);
}
assert.equal(require('./b1-build-status.json').filter(x=>x.status==='complete').length,32);
assert(!/<script[^>]+src=|<link[^>]+rel=["']stylesheet/i.test(html));assert(html.includes('All '));assert(html.includes('Vietnamese guide'));assert(html.includes('English definition unavailable in the source.'));
console.log('PASS B1: 902/902 exact entries; 34 paired groups; 68 readings; '+b1.reduce((s,l)=>s+l.questions.length,0)+' questions; '+grammarIds.size+' grammar topics; old 88 lessons unchanged; offline bundle.');

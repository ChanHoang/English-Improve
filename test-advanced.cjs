const fs=require('fs'),assert=require('assert/strict');
const html=fs.readFileSync('index.html','utf8'),rows=JSON.parse(html.match(/<script id="bundle" type="application\/json">([^<]*)<\/script>/)[1]);
const all=require('./readings-v3.json'),old=require('./readings-before-advanced.json'),isNew=l=>/^(b2[sc]|c1[sc])-/.test(l.id),added=all.filter(isNew);
assert.deepEqual(all.filter(l=>!isNew(l)),old,'preserve all 152 existing lessons, questions and answer positions');
assert.equal(all.length,348);assert.equal(added.length,196);assert.equal(new Set(added.map(l=>l.group)).size,98);
assert.equal(require('./advanced-build-status.json').filter(x=>x.status==='ready').length,98);
const ids=new Set(),questionIds=new Set(),grammarIds=new Set(),newRows=new Set();let senseNotes=0;
for(const l of all){assert(!ids.has(l.id));ids.add(l.id);for(const g of l.grammar)grammarIds.add(g.id)}
assert.deepEqual([...grammarIds].sort((a,b)=>a-b),Array.from({length:120},(_,i)=>i+1));
for(const [level,entryCount,lessonCount]of [['B2',1571,112],['C1',1404,96]]){
 const ls=all.filter(l=>l.level===level);assert.equal(ls.length,lessonCount);
 const expected=rows.flatMap((r,i)=>r.level===level?[i]:[]),actual=[...new Set(ls.flatMap(l=>l.targets.filter(t=>t.level===level).map(t=>t.rowIndex)))].sort((a,b)=>a-b);
 assert.equal(actual.length,entryCount);assert.deepEqual(actual,expected,level+' exact coverage');
}
for(const l of added){
 assert(l.targets.length>=25&&l.targets.length<=30);assert(l.wordCount>=(l.level==='C1'?300:260));
 const text=l.paragraphs.map(p=>p[0]).join(' ');assert(!text.includes('[['));assert.equal(l.wordCount,text.split(/\s+/).length);
 assert(l.paragraphs.every(p=>p[0].trim()&&p[1].trim()));assert(l.sources.length&&l.sources.every(s=>s[0]&&new URL(s[1]).protocol==='https:'));
 const pair=added.filter(x=>x.group===l.group);assert.equal(pair.length,2);assert.deepEqual(pair[0].targets.map(t=>t.rowIndex),pair[1].targets.map(t=>t.rowIndex));assert.notEqual(pair[0].englishTitle,pair[1].englishTitle);assert.notEqual(pair[0].paragraphs[0][0],pair[1].paragraphs[0][0]);
 assert(l.questions.filter(q=>q.category==='content').length>=5);assert.equal(l.questions.filter(q=>q.category==='vocabulary').length,l.targets.length);
 for(const [i,t]of l.targets.entries()){
  const r=rows[t.rowIndex];assert.equal(t.word,r.word);assert.equal(t.pos,r.pos);assert.equal(t.level,r.level);assert.equal(t.level,l.level);assert.equal(t.en,r.def,'original definitions unchanged');assert(t.vi.trim());
  if(l.part==='A'){assert(!newRows.has(t.rowIndex),'new target repeated across groups');newRows.add(t.rowIndex)}
  const o=t.occurrence;assert.equal(l.paragraphs[o.p][0].slice(o.start,o.end),o.text);
  const q=l.questions.find(q=>q.category==='vocabulary'&&q.targetIndex===i);assert(q);assert.equal(q.options[q.answer],t.vi);
  if(t.sourceSenseNote){senseNotes++;assert(t.sourceSenseNote.length>20);assert(q.explanations[q.answer].includes(t.sourceSenseNote),'quiz must not present other-sense definition as a matching explanation')}
 }
 assert(l.grammar.length>=2);assert.equal(new Set(l.grammar.map(g=>g.id)).size,l.grammar.length,'distinct grammar focuses');
 for(const g of l.grammar){assert(text.includes(g.example),l.id+' grammar quotation '+g.id);assert(g.note.length>10);assert(l.questions.filter(q=>q.grammarId===g.id).length>=2)}
 for(const q of l.questions){assert(!questionIds.has(q.id));questionIds.add(q.id);assert.equal(new Set(q.options).size,3);assert.equal(q.explanations.length,3);assert(q.answer>=0&&q.answer<3);assert(q.explanations.every(x=>x.length>10))}
}
assert.equal(newRows.size,2892);assert(senseNotes>0);assert(html.includes('source-sense-note'));assert(html.includes('Course coverage · A2–C1 complete'));assert(html.includes('Vietnamese guide'));
assert(!/<script[^>]+src=|<link[^>]+rel=["']stylesheet/i.test(html),'standalone offline bundle');
console.log('PASS advanced: 196 new readings; 98 pairs; B2 1571/1571 and C1 1404/1404 exact entries; 120 grammar focuses; '+questionIds.size+' new questions; '+senseNotes+' source-sense notes; all existing progress keys preserved.');

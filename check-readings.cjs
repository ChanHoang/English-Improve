const fs=require('fs'),assert=require('assert/strict');
const html=fs.readFileSync('Oxford/index.html','utf8');
const data=JSON.parse(html.match(/<script id="bundle" type="application\/json">([^<]*)<\/script>/)[1]);
const lessons=JSON.parse(fs.readFileSync('Oxford/readings.json','utf8'));
const rank=['A1','A2','B1','B2','C1'];
for(const l of lessons){
 for(const t of l.targets){
  const index=data.findIndex(r=>r.word===t.word&&r.pos===t.pos&&rank.indexOf(r.level)<=rank.indexOf(l.level));
  assert(index>=0,'Missing '+l.id+' '+t.word+' '+t.pos);
  t.rowIndex=index;t.level=data[index].level;
  const forms=l.forms[t.word]||[t.word];
  const matches=[];
  for(let pi=0;pi<l.paragraphs.length;pi++){
   const p=l.paragraphs[pi][0],re=new RegExp('\\b('+forms.join('|')+')\\b','gi');
   for(const m of p.matchAll(re))matches.push({p:pi,start:m.index,end:m.index+m[0].length,text:m[0]});
  }
  assert(matches.length,'Missing occurrence '+t.word);
  t.occurrence=matches[t.word==='new'?matches.length-1:t.word==='control'&&l.id==='wright'?1:0];
 }
 l.wordCount=l.paragraphs.map(p=>p[0]).join(' ').match(/\b[\w’'-]+\b/g).length;
 console.log(l.level,l.targets.length,l.wordCount, [...new Set(l.targets.map(t=>t.level))].join('/'));
}
fs.writeFileSync('Oxford/readings.json',JSON.stringify(lessons,null,2));


const fs=require('fs');
const h=fs.readFileSync('index.html','utf8'),d=JSON.parse(h.match(/<script id="bundle" type="application\/json">([^<]*)<\/script>/)[1]);
const r=require('./readings-v3.json'),used=new Set(r.filter(l=>l.level==='B1').flatMap(l=>l.targets.map(t=>t.rowIndex)));
const a=d.map((t,rowIndex)=>({...t,rowIndex})).filter(t=>t.level==='B1'&&!used.has(t.rowIndex));
fs.writeFileSync('b1-unassigned.json',JSON.stringify(a,null,2));
console.log('B1',d.filter(t=>t.level==='B1').length,'remaining',a.length);
console.log(a.map(t=>t.word+' ('+t.pos+')').join('|'));

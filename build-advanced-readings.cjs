const fs=require('fs'),assert=require('assert/strict');
const parts=['b2-science','b2-society','c1-science','c1-society'];
const grammar=require('./grammar-lessons.json'),bank=require('./grammar-quiz.json');
const senseNotes={};
for(const file of ['c1s-sense-notes.cjs','c1s-external-review-notes.cjs','advanced-sense-notes.json','b2s-sense-notes.cjs','c1c-sense-notes.cjs'])if(fs.existsSync(file))for(const [slug,notes]of Object.entries(require('./'+file)))senseNotes[slug]={...senseNotes[slug],...notes};
const vocabulary=[];
for(const part of parts)if(fs.existsSync(part+'-plan.json'))for(const p of require('./'+part+'-plan.json')){const file='advanced-content/'+p.slug+'.cjs';if(fs.existsSync(file)){try{const s=require('./'+file),ms=typeof s.meanings==='string'?s.meanings.split('|'):s.meanings;p.targets.forEach((t,i)=>{if(ms[i])vocabulary.push({...t,vi:ms[i],group:p.slug})})}catch{ /* The validation loop reports incomplete authoring files. */ }}}
const meaningKeys=new Map();
function meaningKey(s){if(!meaningKeys.has(s)){const plain=s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('đ','d').toLowerCase().replace(/[^a-z0-9 ]/g,' '),filtered=plain.replace(/\b(su|viec|nguoi|mot|cach|thuoc|de|duoc|ve|tinh)\b/g,'').trim();meaningKeys.set(s,(filtered||plain).split(/\s+/).filter(Boolean))}return meaningKeys.get(s)}
function distinctMeaning(a,b){const x=meaningKey(a),y=meaningKey(b);return x.length&&y.length&&!x.some(t=>t.length>2&&y.includes(t))}
const rows=JSON.parse(fs.readFileSync('index.html','utf8').match(/<script id="bundle" type="application\/json">([^<]*)<\/script>/)[1]);
const base=require('./readings-before-advanced.json'),lessons=[...base],status=[],errors=[],seen=new Set();
function question(l,category,q,options,explanations,extra={}){assert.equal(new Set(options).size,options.length,'duplicate options: '+q);const offset=l.questions.length%3,order=[0,1,2].map(i=>(i+offset)%3);l.questions.push({q,category,options:order.map(i=>options[i]),answer:order.indexOf(0),explanations:order.map(i=>explanations[i]),...extra})}
for(const part of parts){const file=part+'-plan.json';if(!fs.existsSync(file)){errors.push(file+' missing');continue}
 for(const p of require('./'+file)){
  for(const t of p.targets){assert(!seen.has(t.rowIndex),'duplicate planned target '+t.word);seen.add(t.rowIndex);assert.equal(t.en,rows[t.rowIndex].def);assert.equal(t.pos,rows[t.rowIndex].pos);assert.equal(p.level,rows[t.rowIndex].level)}
  const content='advanced-content/'+p.slug+'.cjs';if(!fs.existsSync(content)){status.push({slug:p.slug,level:p.level,status:'planned'});continue}
  try{const s=require('./'+content),meanings=typeof s.meanings==='string'?s.meanings.split('|'):s.meanings;assert.equal(meanings.length,p.targets.length,'VI meanings count');assert.equal(s.articles.length,2);assert(p.targets.length>=25&&p.targets.length<=30);
   const pair=[];
   for(const [index,a]of s.articles.entries()){
    const targets=p.targets.map((t,i)=>({...t,level:p.level,vi:meanings[i],...(senseNotes[p.slug]?.[t.word+':'+t.pos]?{sourceSenseNote:senseNotes[p.slug][t.word+':'+t.pos]}:{})}));const texts=a.text.trim().split(/\n\s*\n/),vi=a.translation.trim().split(/\n\s*\n/);assert.equal(texts.length,vi.length,'guide paragraph count');
    const paragraphs=texts.map((text,pi)=>{let out='',last=0;for(const m of text.matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)){out+=text.slice(last,m.index);const [word,pos]=m[1].split(':');const t=targets.find(t=>t.word.toLowerCase()===word.toLowerCase()&&(!pos||t.pos===pos)&&!t.occurrence);assert(t,'unknown/duplicate marker '+m[1]);const surface=m[2]||word;t.occurrence={p:pi,start:out.length,end:out.length+surface.length,text:surface};out+=surface;last=m.index+m[0].length}return [out+text.slice(last),vi[pi]]});
    for(const t of targets)assert(t.occurrence,(index?'B':'A')+' missing '+t.word+':'+t.pos);
    const text=paragraphs.map(p=>p[0]).join(' '),wordCount=text.split(/\s+/).length;assert(wordCount>=(p.level==='C1'?300:260),'too short '+wordCount);
    assert(a.sources.length&&a.sources.every(x=>new URL(x[1]).protocol==='https:'));assert(a.checks.length>=5);assert(a.grammar.length>=2);
    const l={id:p.slug+'-'+(index?'b':'a'),group:p.slug,groupTitle:p.title,order:p.order,level:p.level,part:index?'B':'A',title:a.titleVI,englishTitle:a.title,paragraphs,targets,grammar:a.grammar,sources:a.sources,questions:[],forms:{},wordCount,note:'Bài đọc được biên soạn dựa trên các nguồn dẫn bên dưới. Nghĩa Việt theo ngữ cảnh do ứng dụng biên soạn; định nghĩa English–English giữ nguyên từ dữ liệu gốc. Các ví dụ hoặc giả định được nêu rõ, không phải lời nói lịch sử được ghi chép.'};
    for(const [q,correct,w1,w2,why] of a.checks)question(l,'content',q,[correct,w1,w2],[why,'Không đúng: '+w1+' '+why,'Không đúng: '+w2+' '+why]);
    for(const [i,t]of targets.entries()){
     const candidates=vocabulary.filter(x=>x.group!==p.slug&&x.word!==t.word&&distinctMeaning(x.vi,t.vi)),samePart=candidates.filter(x=>x.pos===t.pos),alternatives=samePart.length>=2?samePart:candidates;const x=alternatives[(t.rowIndex+i+index*17)%alternatives.length],rest=candidates.filter(y=>y.vi!==x.vi&&y.word!==x.word&&distinctMeaning(x.vi,y.vi));assert(rest.length,'distinct distractors '+t.word+' / '+t.vi+' / '+x.vi+' / '+candidates.length);const y=rest[(i+5+index*13)%rest.length];const context=paragraphs[t.occurrence.p][0],boundary=context.lastIndexOf('. ',t.occurrence.start),start=boundary<0?0:boundary+2,end=context.indexOf('. ',t.occurrence.end);
     question(l,'vocabulary','In “'+context.slice(start,end<0?context.length:end+1)+'”, what does “'+t.occurrence.text+'” mean?',[t.vi,x.vi,y.vi],[t.word+' ở đây nghĩa là “'+t.vi+'”. '+(t.sourceSenseNote?t.sourceSenseNote:t.en?'Định nghĩa nguồn: '+t.en:'Nguồn chưa có định nghĩa English–English; nghĩa Việt được biên soạn theo ngữ cảnh.'),'“'+x.vi+'” phù hợp với mục '+x.word+' trong khóa học; '+t.word+' ở câu này là “'+t.vi+'”.','“'+y.vi+'” phù hợp với mục '+y.word+' trong khóa học; '+t.word+' ở câu này là “'+t.vi+'”.'],{targetWord:t.word,targetIndex:i});
    }
    for(const g of a.grammar){assert(grammar.some(x=>x.id===g.id),'grammar id');assert(text.includes(g.example),'grammar quotation '+g.id+': '+g.example);assert(g.note?.trim(),'grammar note');for(const q of bank[g.id].slice(index*2,index*2+2))l.questions.push({...q,category:'grammar',grammarId:g.id})}
    for(const [i,q]of l.questions.entries()){q.id=l.id+'-v1-'+i;assert.equal(new Set(q.options).size,3);assert(q.explanations.every(x=>x?.length>10),'short explanation')}
    pair.push(l);
   }
   lessons.push(...pair);status.push({slug:p.slug,level:p.level,status:'ready',words:p.targets.length});
  }catch(e){errors.push(p.slug+': '+e.message);status.push({slug:p.slug,level:p.level,status:'needs-review'})}
 }
}
fs.writeFileSync('advanced-build-status.json',JSON.stringify(status,null,2));
console.log(status.filter(x=>x.status==='ready').length+'/'+status.length+' groups ready');if(errors.length)console.log(errors.join('\n'));
if(errors.length||status.some(x=>x.status!=='ready')){process.exitCode=2}else{
 for(const level of ['B2','C1']){const expected=rows.flatMap((r,i)=>r.level===level?[i]:[]),actual=[...new Set(lessons.filter(l=>l.level===level).flatMap(l=>l.targets.filter(t=>t.level===level).map(t=>t.rowIndex)))].sort((a,b)=>a-b);assert.deepEqual(actual,expected)}
 assert.equal(new Set(lessons.flatMap(l=>l.grammar.map(g=>g.id))).size,120,'full grammar coverage');
 fs.writeFileSync('readings-v3.json',JSON.stringify(lessons,null,2));console.log('Published dataset '+lessons.length+' readings; B2 and C1 exact coverage complete.');
}

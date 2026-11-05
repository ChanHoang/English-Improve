const fs=require('fs'),assert=require('assert/strict');
const plan=require('./b1-plan.json');
const bank=require('./grammar-quiz.json'),grammar=require('./grammar-lessons.json');
const readings=require('./readings-v3.json').filter(l=>!l.id.startsWith('b1-'));
const manifest=[];
// Near-synonyms should not compete in a single meaning question.
const synonymSets=[['illness','disease'],['worry','stress'],['chance','opportunity'],['choice','option','alternative'],['helpful','useful'],['excellent','brilliant'],['maybe','perhaps'],['certain','sure'],['reply','respond'],['present','show'],['chef','cook'],['tale','story'],['gift','present'],['happy','pleased'],['clever','intelligent'],['awful','terrible'],['correct','right'],['finish','end'],['sad','unhappy'],['speak','talk'],['look','appearance'],['quiet','silent']];
function addQuestion(l,category,q,options,reasons,extra={}){const shift=l.questions.length%3,order=[0,1,2].map(i=>(i+shift)%3);l.questions.push({q,category,options:order.map(i=>options[i]),answer:order.indexOf(0),explanations:order.map(i=>reasons[i]),...extra})}
for(const p of plan){
 const file='b1-content/'+p.slug+'.cjs';if(!fs.existsSync(file)){manifest.push({slug:p.slug,status:'missing'});continue}
 const spec=require('./'+file);if(typeof spec.meanings==='string')spec.meanings=spec.meanings.split('|');assert.equal(spec.meanings.length,p.targets.length,p.slug+' translations');assert.equal(spec.articles.length,2,p.slug);
 for(const [partIndex,a] of spec.articles.entries()){
  const targets=p.targets.map((t,i)=>({...t,level:'B1',vi:spec.meanings[i]}));
  const text=a.text.trim().split('\n\n'),vi=a.translation.trim().split('\n\n');assert.equal(text.length,vi.length,p.slug+' paragraphs');
  const paragraphs=text.map((s,pi)=>{let output='',last=0;for(const m of s.matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)){output+=s.slice(last,m.index);const [word,pos]=m[1].split(':');const target=targets.find(t=>t.word.toLowerCase()===word.toLowerCase()&&(!pos||t.pos===pos)&&!t.occurrence);assert(target,p.slug+' unknown/duplicate '+m[1]);const surface=m[2]||word;target.occurrence={p:pi,start:output.length,end:output.length+surface.length,text:surface};output+=surface;last=m.index+m[0].length;}return [output+s.slice(last),vi[pi]]});
  for(const t of targets)assert(t.occurrence,p.slug+' '+partIndex+' missing '+t.word+' '+t.pos);
  const body=paragraphs.map(p=>p[0]).join(' ');
  const l={id:'b1-'+p.slug+'-'+(partIndex?'b':'a'),group:'b1-'+p.slug,groupTitle:p.title,order:p.order,level:'B1',part:partIndex?'B':'A',title:a.titleVI,englishTitle:a.title,paragraphs,targets,grammar:a.grammar,sources:a.sources,questions:[],forms:{},note:'Bài học được biên soạn từ các nguồn được dẫn, có câu hỏi và ví dụ giả định để luyện tiếng Anh. Ví dụ giả định không phải lời nói hay sự kiện lịch sử được ghi chép. Định nghĩa từ lấy từ bộ dữ liệu từ vựng đang học; nghĩa Việt theo ngữ cảnh do ứng dụng biên soạn.',wordCount:body.split(/\s+/).length};
  assert(l.wordCount>=220,l.id+' too short');assert(a.checks.length>=5);
  for(const [q,correct,wrong1,wrong2,why] of a.checks)addQuestion(l,'content',q,[correct,wrong1,wrong2],[why,'Không phải “'+wrong1+'”. '+why,'Không phải “'+wrong2+'”. '+why]);
  for(const [i,t] of targets.entries()){
   const other=targets.filter(x=>x.vi!==t.vi&&x.word!==t.word&&!synonymSets.some(s=>s.includes(t.word)&&s.includes(x.word))),a=other[i%other.length],distinct=other.filter(x=>x.vi!==a.vi),b=distinct[(i+7)%distinct.length];
   const context=paragraphs[t.occurrence.p][0],boundary=context.lastIndexOf('. ',t.occurrence.start);const begin=boundary<0?0:boundary+2,finish=context.indexOf('. ',t.occurrence.end);
   addQuestion(l,'vocabulary','In “'+context.slice(begin,finish<0?context.length:finish+1)+'”, what does “'+t.occurrence.text+'” mean?',[t.vi,a.vi,b.vi],[t.word+' ở đây là “'+t.vi+'”. '+(t.en?'Định nghĩa trong nguồn từ vựng: '+t.en:'Nguồn từ vựng chưa có định nghĩa English–English; nghĩa Việt ở đây được biên soạn theo câu trong bài.'),'“'+a.vi+'” là nghĩa của '+a.word+'; '+t.word+' ở đây nghĩa là “'+t.vi+'”.','“'+b.vi+'” là nghĩa của '+b.word+'; '+t.word+' ở đây nghĩa là “'+t.vi+'”.'],{targetWord:t.word,targetIndex:i});
  }
  for(const g of a.grammar){assert(body.includes(g.example),l.id+' grammar quotation '+g.id);assert(grammar.some(x=>x.id===g.id));const qs=bank[g.id];assert(qs?.length>=2);for(const q of qs.slice(partIndex*2,partIndex*2+2))l.questions.push({...q,category:'grammar',grammarId:g.id})}
  l.questions.forEach((q,i)=>q.id=l.id+'-v1-'+i);readings.push(l);
 }
 manifest.push({slug:p.slug,status:'complete',words:p.targets.length});
}
fs.writeFileSync('b1-build-status.json',JSON.stringify(manifest,null,2));
const incomplete=manifest.filter(x=>x.status!=='complete');
if(incomplete.length){console.log('Validated '+(32-incomplete.length)+'/32 new groups. Remaining: '+incomplete.map(x=>x.slug).join(', '));process.exitCode=2}else{
 const ids=new Set(readings.filter(l=>l.level==='B1').flatMap(l=>l.targets.filter(t=>t.level==='B1').map(t=>t.rowIndex)));assert.equal(ids.size,902);
 fs.writeFileSync('readings-v3.json',JSON.stringify(readings,null,2));console.log(readings.length+' readings; B1: '+readings.filter(l=>l.level==='B1').length+' articles, '+ids.size+' entries.');
}

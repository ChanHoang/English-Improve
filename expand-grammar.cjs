const fs=require('fs'),assert=require('assert/strict');
const path='Oxford/index.html';
let html=fs.readFileSync(path,'utf8');
const lessons=JSON.parse(html.match(/const grammar=(\[[^\n]+);/)[1]);
let current;
const seen=new Set();
for(const raw of fs.readFileSync('Oxford/grammar-expanded.txt','utf8').replace(/^\uFEFF/,'').split(/\r?\n/)){
 if(!raw.trim())continue;
 if(raw.startsWith('@')){
  const id=Number(raw.slice(1));assert(!seen.has(id),'Duplicate '+id);seen.add(id);
  current=lessons.find(x=>x.id===id);assert(current,'Unknown '+id);
  current.usage=[];current.structures=[];current.examples=[];current.practice=[];current.extra=[];
  continue;
 }
 const [type,...fields]=raw.split('|');assert(current,'Missing lesson');
 const fieldCounts={U:1,S:2,E:4,Q:3,X:1};assert.equal(fields.length,fieldCounts[type],current.id+' '+type);
 assert(fields.every(x=>x.trim()),'Empty '+current.id);
 switch(type){
  case 'U':current.usage.push(fields[0]);break;
  case 'S':current.structures.push({label:fields[0],formula:fields[1]});break;
  case 'E':current.examples.push({context:fields[0],en:fields[1],vi:fields[2],why:fields[3]});break;
  case 'Q':current.practice.push({question:fields[0],answer:fields[1],why:fields[2]});break;
  case 'X':current.extra.push(fields[0]);break;
 }
}
assert.equal(seen.size,120);
const sources={
102:['British Council · Inversion after negative adverbials','https://learnenglish.britishcouncil.org/free-resources/grammar/c1/inversion-after-negative-adverbials'],
106:['British Council · Participle clauses','https://learnenglish.britishcouncil.org/free-resources/grammar/c1/participle-clauses'],
111:['Cambridge · Suggest','https://dictionary.cambridge.org/grammar/british-grammar/suggest'],
114:['Cambridge · Ellipsis','https://dictionary.cambridge.org/grammar/british-grammar/ellipsis']
};
for(const l of lessons){
 assert(l.usage.length&&l.structures.length>=3&&l.examples.length>=4&&l.practice.length,'Incomplete '+l.id);
 l.references=sources[l.id]?[sources[l.id]]:[];
}
html=html.replace(/const grammar=\[[^\n]+;/,()=> 'const grammar='+JSON.stringify(lessons).replace(/</g,'\\u003c')+';');
const begin=html.indexOf('function grammarView(){'),end=html.indexOf('function pagination(',begin);
assert(begin>=0&&end>begin);
html=html.slice(0,begin)+`
function grammarLessonBody(r){
 const block=(title,content)=>'<section class="grammar-section"><h3>'+title+'</h3>'+content+'</section>';
 let content='<p class="muted">'+esc(r.topic)+' · '+r.examples.length+' tình huống · '+r.practice.length+' bài tự kiểm tra</p>';
 content+=block('1. Khi nào dùng?',r.usage.map(p=>'<p>'+esc(p)+'</p>').join(''));
 content+=block('2. Cấu trúc cần nhớ','<div class="grammar-patterns">'+r.structures.map(s=>'<div class="grammar-pattern"><strong>'+esc(s.label)+'</strong><p>'+esc(s.formula)+'</p></div>').join('')+'</div>');
 content+=block('3. Ví dụ trong đời sống','<div class="grammar-examples">'+r.examples.map((e,i)=>'<div class="grammar-example"><h4><span class="example-number">'+(i+1)+'</span> '+esc(e.context)+'</h4><p lang="en"><strong>'+esc(e.en)+'</strong></p><p class="grammar-translation">'+esc(e.vi)+'</p><p class="grammar-explanation"><b>Vì sao dùng như vậy?</b><br>'+esc(e.why)+'</p></div>').join('')+'</div>');
 content+=block('4. Phân biệt và lỗi dễ mắc','<p>'+esc(r.explanation)+'</p><div class="grammar-caution"><b>Điểm cần tránh</b><p>'+esc(r.pitfall)+'</p></div>'+r.extra.map(p=>'<p>'+esc(p)+'</p>').join(''));
 content+=block('5. Tự kiểm tra',r.practice.map((p,i)=>'<div class="grammar-practice"><p><b>Bài '+(i+1)+'</b></p><p>'+esc(p.question)+'</p><details class="grammar-answer" data-exercise="'+r.id+'-'+i+'"><summary>Xem đáp án và giải thích</summary><p><strong>'+esc(p.answer)+'</strong></p><p>'+esc(p.why)+'</p></details></div>').join(''));
 if(r.references.length)content+=block('Đọc thêm',r.references.map(([name,url])=>'<p><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(name)+'</a></p>').join(''));
 return content+btn(grammarDone[r.id]?'Đã học ✓':'Đánh dấu đã học','grammar-'+r.id,'aria-pressed="'+Boolean(grammarDone[r.id])+'"');
}
function grammarView(){
 const q=norm($('query').value.trim());
 const lessons=grammar.filter(r=>(!grammarTopic||r.topic===grammarTopic)&&norm([r.title,r.rule,...r.usage,...r.structures.map(s=>s.formula),...r.examples.map(e=>e.en+' '+e.vi),r.pitfall].join(' ')).includes(q));
 const done=grammar.filter(r=>grammarDone[r.id]).length;
 let result='<article class="grammar-intro"><small>SỔ TAY TỰ HỌC</small><h2>Ngữ pháp từ nền tảng đến C1</h2><p>'+done+' / '+grammar.length+' bài đã học</p><progress value="'+done+'" max="'+grammar.length+'"></progress><p>Mở một bài để học cách dùng, xem từng cấu trúc và đối chiếu ví dụ. Thử tự trả lời bài tập trước khi mở lời giải. Đánh dấu đã học khi bạn có thể tự đặt câu trong tình huống tương tự.</p><details class="grammar-key"><summary>Đọc ký hiệu ngữ pháp</summary><ul><li><b>S</b> là chủ ngữ, người hoặc vật được nói đến.</li><li><b>V</b> là động từ nguyên mẫu; <b>V2</b> là dạng quá khứ; <b>V3</b> là quá khứ phân từ.</li><li><b>O</b> là tân ngữ; <b>N</b> là danh từ; <b>adj</b> là tính từ; <b>adv</b> là trạng từ.</li><li>Dấu <b>/</b> chỉ các lựa chọn; phần trong ngoặc là thành phần có thể thêm tùy ngữ cảnh.</li></ul></details><label>Chủ đề <select id="grammar-topic"><option value="">Tất cả chủ đề</option>'+[...new Set(grammar.map(r=>r.topic))].map(t=>'<option '+(t===grammarTopic?'selected':'')+'>'+esc(t)+'</option>').join('')+'</select></label><p>'+lessons.length+' bài phù hợp</p><p class="muted">Nội dung và ví dụ do ứng dụng biên soạn theo lộ trình học. Các bài nâng cao hướng tới cách diễn đạt ở C1; đây không phải danh mục chứng nhận trình độ.</p></article>';
 if(!lessons.length)result+='<p>Không tìm thấy bài phù hợp.</p>';
 return result+lessons.map(r=>'<details class="grammar-lesson" data-lesson="'+r.id+'"><summary><span class="tag">'+r.id+'</span> <strong>'+esc(r.title)+'</strong>'+(grammarDone[r.id]?' ✓':'')+'<span class="lesson-count">'+r.examples.length+' ví dụ</span></summary>'+grammarLessonBody(r)+'</details>').join('');
}
`+html.slice(end);
const css=`
.grammar-intro h2{margin-top:10px}
.grammar-key{background:#f6f4ed;margin:18px 0}
.grammar-key li{margin:10px 0;line-height:1.6}
.grammar-lesson>summary{line-height:1.8;padding:4px}
.lesson-count{display:inline-block;margin-left:12px;color:#52665d;font-size:14px}
.grammar-section{margin-top:28px}
.grammar-section h3{font-size:20px;border-bottom:2px solid #d5e5da;padding-bottom:9px;margin-bottom:16px}
.grammar-section>p{line-height:1.8}
.grammar-patterns{display:grid;gap:10px}
.grammar-pattern{border-left:4px solid #39735a;padding:14px 16px;background:#eef5ef;border-radius:0 10px 10px 0}
.grammar-pattern>strong{display:block;color:#20543e}
.grammar-pattern p{margin:8px 0 0;line-height:1.8}
.grammar-examples{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.grammar-example{padding:18px;border:1px solid #dce4da;border-radius:12px;background:#fdfcf8;overflow-wrap:anywhere}
.grammar-example h4{font-size:15px;font-weight:600;color:#52665d;margin:0 0 14px}
.example-number{display:inline-block;background:#e4efe6;padding:2px 7px;border-radius:8px}
.grammar-example p[lang=en]{font-size:18px;line-height:1.7;margin:10px 0}
.grammar-translation{line-height:1.7;margin-top:8px}
.grammar-explanation{font-size:15px;color:#42594e;line-height:1.7;border-top:1px solid #e3e8df;padding-top:12px}
.grammar-caution{background:#fff4df;border-left:4px solid #bb8534;padding:16px;border-radius:0 10px 10px 0}
.grammar-caution p{margin-bottom:0;line-height:1.8}
.grammar-practice{padding:16px;background:#f3f5f0;border-radius:12px;margin:12px 0}
.grammar-answer{margin-bottom:0}
.grammar-answer summary{font-weight:600}
.grammar-lesson>button{margin-top:22px}
@media(max-width:650px){.grammar-examples{grid-template-columns:1fr}.grammar-section h3{font-size:19px}.grammar-example{padding:14px}.grammar-lesson{padding:14px}.lesson-count{font-size:12px}}
`;
html=html.replace('</style>',css+'</style>');
// Keep open self-check answers when marking a lesson as learned.
html=html.replace("const openIds=[...$('view').querySelectorAll('details[data-lesson][open]')]", "const openExercises=[...$('view').querySelectorAll('details[data-exercise][open]')].map(d=>d.dataset.exercise);\n  const openIds=[...$('view').querySelectorAll('details[data-lesson][open]')]");
html=html.replace("for(const d of $('view').querySelectorAll('details[data-lesson]'))if(openIds.includes(d.querySelector('button').dataset.action))d.open=true;", "for(const d of $('view').querySelectorAll('details[data-lesson]'))if(openIds.includes(d.querySelector('button').dataset.action))d.open=true;\n  for(const d of $('view').querySelectorAll('details[data-exercise]'))if(openExercises.includes(d.dataset.exercise))d.open=true;");
fs.writeFileSync(path,html);
fs.writeFileSync('Oxford/grammar-lessons.json',JSON.stringify(lessons,null,2));
console.log(JSON.stringify({lessons:lessons.length,examples:lessons.reduce((n,l)=>n+l.examples.length,0),exercises:lessons.reduce((n,l)=>n+l.practice.length,0),structures:lessons.reduce((n,l)=>n+l.structures.length,0),minExamples:Math.min(...lessons.map(l=>l.examples.length))}));

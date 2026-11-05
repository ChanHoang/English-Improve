const fs=require('fs'),assert=require('assert/strict');
const path='Oxford/index.html';
let html=fs.readFileSync(path,'utf8');
const lines=name=>fs.readFileSync('Oxford/'+name,'utf8').replace(/^\uFEFF/,'').trim().split(/\r?\n/).map(x=>x.split('|'));
const base=lines('grammar.txt'),notes=lines('grammar-notes.txt'),advanced=lines('grammar-advanced.txt');
assert.equal(base.length,100);assert.equal(notes.length,100);
const topics=['Thì và thời gian','Cấu trúc câu','Danh từ và lượng từ','Đại từ và sở hữu','Tính từ và so sánh','Giới từ','Động từ khuyết thiếu','Mẫu động từ','Bị động','Điều kiện và mong ước','Mệnh đề và liên kết','Nâng cao đến C1'];
function topic(i){return i<=10?0:i<=20?1:i<=36?2:i<=43?3:i<=54?4:i<=60?5:i<=69?6:i<=76?7:i<=79?8:i<=86?9:10}
const grammar=base.map(([title,rule,example,vi],i)=>({id:i+1,title,rule,example,vi,explanation:notes[i][0],pitfall:notes[i][1],topic:topics[topic(i+1)]}));
advanced.forEach(([title,rule,explanation,example,vi,pitfall],i)=>grammar.push({id:101+i,title,rule,explanation,example,vi,pitfall,topic:topics[11]}));
assert(grammar.every(r=>r.explanation&&r.pitfall));
html=html.replace(/const grammar=\[[^\n]+;/,()=> 'const grammar='+JSON.stringify(grammar)+';');
html=html.replace("'100 điểm ngữ pháp','6 thì thường dùng'","'Ngữ pháp đến C1'");
html=html.replace("giọng Anh Anh hoặc Anh Mỹ","giọng Anh Mỹ");
html=html.replace("+btn('🔊 Anh Anh','uk')","");
html=html.replace("if(a==='uk'||a==='us'){audio(r,a==='uk'?'en-GB':'en-US');return}","if(a==='us'){audio(r,'en-US');return}");
html=html.replace("<br>Anh Anh · '+esc(r.uk||'Chưa có dữ liệu')+'","");
html=html.replace("let mode=0, page=0,","const pageSizes=[10,20,50,100,200];\nlet pageSize=read('ox5-page-size',20);\nif(!pageSizes.includes(pageSize))pageSize=20;\nlet mode=0, page=0,");
const start=html.indexOf('function grammarView(){'),end=html.indexOf('\nfunction render(){',start);
html=html.slice(0,start)+`
let grammarTopic='';
function grammarView(){
 const q=norm($('query').value.trim());
 const lessons=grammar.filter(r=>(!grammarTopic||r.topic===grammarTopic)&&norm([r.title,r.rule,r.explanation,r.example,r.vi,r.pitfall].join(' ')).includes(q));
 const done=grammar.filter(r=>grammarDone[r.id]).length;
 let result='<article><h2>Ngữ pháp từ nền tảng đến C1</h2><p>'+done+' / '+grammar.length+' bài đã học</p><progress value="'+done+'" max="'+grammar.length+'"></progress><p>Học theo chủ đề, đọc phần phân biệt và tự đặt câu trước khi đánh dấu đã học. Nhóm nâng cao tập trung vào diễn đạt chính xác, sắc thái và tổ chức ý. Đây là lộ trình biên soạn cho ứng dụng, không phải danh mục chứng nhận trình độ CEFR.</p><p>S là chủ ngữ; V là nguyên mẫu; V2 là quá khứ; V3 là quá khứ phân từ.</p><label>Chủ đề <select id="grammar-topic"><option value="">Tất cả chủ đề</option>'+[...new Set(grammar.map(r=>r.topic))].map(t=>'<option '+(t===grammarTopic?'selected':'')+'>'+esc(t)+'</option>').join('')+'</select></label><p>'+lessons.length+' bài phù hợp</p></article>';
 if(!lessons.length)result+='<p>Không tìm thấy bài phù hợp.</p>';
 return result+lessons.map(r=>'<details data-lesson="'+r.id+'"><summary><span class="tag">'+r.id+'</span> '+esc(r.title)+(grammarDone[r.id]?' ✓':'')+'</summary><p class="muted">'+esc(r.topic)+'</p><h3>Cách dùng và cấu trúc</h3><p>'+esc(r.rule)+'</p><h3>Hiểu và phân biệt</h3><p>'+esc(r.explanation)+'</p><h3>Ví dụ</h3><p><b>'+esc(r.example)+'</b><br>'+esc(r.vi)+'</p><h3>Điểm cần chú ý</h3><p>'+esc(r.pitfall)+'</p>'+btn(grammarDone[r.id]?'Đã học ✓':'Đánh dấu đã học','grammar-'+r.id,'aria-pressed="'+Boolean(grammarDone[r.id])+'"')+'</details>').join('');
}
function pagination(count){
 const pages=Math.ceil(count/pageSize);
 return '<div class="actions"><label>Số từ mỗi trang <select id="page-size">'+pageSizes.map(n=>'<option value="'+n+'" '+(n===pageSize?'selected':'')+'>'+n+' từ</option>').join('')+'</select></label><form id="page-form"><label>Đến trang <input id="page-number" type="number" min="1" max="'+pages+'" step="1" required value="'+(page+1)+'" style="width:100px"></label> / '+pages+' <button type="submit">Đi</button></form></div>';
}
`+html.slice(end);
html=html.replace("Math.floor((rows.length-1)/20)","Math.floor((rows.length-1)/pageSize)");
html=html.replace("Math.ceil(rows.length/20)","Math.ceil(rows.length/pageSize)");
html=html.replace("html+=rows.slice(page*20,page*20+20)","html+=pagination(rows.length);\n  html+=rows.slice(page*pageSize,page*pageSize+pageSize)");
html=html.replace("(page*20+i)","(page*pageSize+i)").replace("(page+1)*20>=rows.length","(page+1)*pageSize>=rows.length");
html=html.replace("const opened=e.target.closest('details');","");
html=html.replace("querySelectorAll('details[open]')","querySelectorAll('details[data-lesson][open]')").replace("querySelectorAll('details'))","querySelectorAll('details[data-lesson]'))");
const events=`
$('view').onchange=e=>{
 if(e.target.id==='page-size'){
  const size=Number(e.target.value);
  if(!pageSizes.includes(size))return;
  page=Math.floor(page*pageSize/size);pageSize=size;
  save('ox5-page-size',pageSize);render();$('page-size').focus();
 }
 if(e.target.id==='grammar-topic'){grammarTopic=e.target.value;render();$('grammar-topic').focus()}
};
$('view').onsubmit=e=>{
 if(e.target.id!=='page-form')return;
 e.preventDefault();
 const number=Number($('page-number').value),max=Math.ceil(filtered().length/pageSize);
 if(!Number.isInteger(number)||number<1||number>max){$('page-number').reportValidity();return}
 page=number-1;render();$('page-number').focus();
};
`;
html=html.replace("function parseCSV(text){",events+"\nfunction parseCSV(text){");
fs.writeFileSync(path,html);
console.log('Updated',grammar.length,'lessons and pagination');

let selectedReading=null;
let readingDone=read('ox5-reading-done',{});
let readingAnswers=read('ox5-reading-answers',{});
let readingStages=read('ox5-reading-stages',{});
let activeReadingWord=null;
const ranges=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const curriculum=[
 {level:'A2',ids:[...ranges(1,8),...ranges(11,18),...ranges(21,69)],theme:'Phát minh, đồ vật quen thuộc, hành trình và các câu chuyện đời thường.'},
 {level:'B1',ids:[9,10,19,20,...ranges(70,86),...ranges(91,98),100],theme:'Nhân vật, khám phá, những sự kiện bất ngờ và lịch sử đời sống.'},
 {level:'B2',ids:[...ranges(87,90),99,101,107,108,109,117,118],theme:'Những lựa chọn làm thay đổi lịch sử, văn hóa và thế giới tự nhiên.'},
 {level:'C1',ids:[...ranges(102,106),...ranges(110,116),119,120],theme:'Câu chuyện nhiều góc nhìn, sắc thái, nguyên nhân và hệ quả.'}
];
function currentReading(){return readings.find(l=>l.id===selectedReading)}
function readingStage(){return Math.max(0,Math.min(2,Number(readingStages[selectedReading])||0))}
function setReadingStage(stage){
 readingStages[selectedReading]=stage;
 if(!save('ox5-reading-stages',readingStages))$('audioStatus').textContent=' Chưa lưu được bước học.';
 render();window.scrollTo(0,0);
}
function readingMarkedParagraph(lesson,index){
 const text=lesson.paragraphs[index][0];
 const occurrences=lesson.targets.map((t,i)=>({...t.occurrence,i})).filter(o=>o.p===index).sort((a,b)=>a.start-b.start);
 let result='',cursor=0;
 for(const o of occurrences){
  result+=esc(text.slice(cursor,o.start))+'<button class="word-link" data-action="read-word-'+o.i+'" aria-label="Xem nghĩa '+esc(lesson.targets[o.i].word)+'">'+esc(text.slice(o.start,o.end))+'</button>';
  cursor=o.end;
 }
 return result+esc(text.slice(cursor));
}
function readingRoadmap(){
 const covered=new Set(readings.flatMap(l=>l.grammar.map(g=>g.id)));
 return '<details class="roadmap"><summary>Lộ trình A2–C1 · '+covered.size+'/120 chủ điểm đã có trong bài đọc</summary><p>25–30 mục từ mới mỗi nhóm, hai bài đọc khác nhau dùng chung nhóm từ. Từ A1 vẫn xuất hiện làm nền nhưng không tạo nhóm học riêng.</p><p>Ưu tiên chuyện có thật, lịch sử thú vị và sự kiện dễ hình dung. Giữa các nhóm, dự kiến ôn tối đa 3 mục từ trọng tâm cũ khi cần; từ thông dụng trong câu không tính vào giới hạn này.</p><p class="muted">Các nhóm tương lai đang ở bước lập lộ trình. Việc phân nhóm từ chi tiết và viết bài sẽ thực hiện từng đợt. Cấp độ là định hướng biên soạn.</p>'+curriculum.map(c=>{
 const count=defaults.filter(r=>r.level===c.level).length,groups=Math.ceil(count/28);
 return '<details><summary><b>'+c.level+'</b> · '+count.toLocaleString('vi')+' mục · dự kiến '+groups+' nhóm</summary><p>'+esc(c.theme)+'</p><p>'+c.ids.length+' chủ điểm ngữ pháp được phân bổ cho giai đoạn này. Các bài sau tiếp tục ôn lại khi phù hợp.</p><div class="curriculum-list">'+c.ids.map(id=>'<span>'+ (covered.has(id)?'✓ ':'○ ')+esc(grammar.find(g=>g.id===id).title)+'</span>').join('')+'</div></details>';
 }).join('')+'<p><b>Đợt tiếp theo dự kiến</b> · Một nhóm A2 về đồ ăn và đời sống, với hai câu chuyện lịch sử dễ đọc. Chủ đề và danh sách từ sẽ được kiểm chứng trước khi viết.</p></details>';
}
function readingExercises(l){
 const answers=readingAnswers[l.id]||{},score=l.questions.filter((q,i)=>answers[i]===q.answer).length;
 let result='<article><h2>Hiểu câu chuyện</h2><p id="reading-score" tabindex="-1" role="status">Đúng '+score+'/'+l.questions.length+' · Đã trả lời '+Object.keys(answers).length+'/'+l.questions.length+'</p>';
 result+=l.questions.map((q,i)=>{
  const pick=answers[i];
  return '<section class="reading-question"><h3>'+(i+1)+'. '+esc(q.q)+'</h3>'+q.options.map((option,j)=>btn(esc(option),'read-answer-'+i+'-'+j,'class="answer" '+(pick===undefined?'':'disabled aria-pressed="'+(j===pick)+'"'))).join('')+(pick===undefined?'':'<p role="status"><b>'+(pick===q.answer?'Đúng.':'Chưa đúng. Đáp án là '+esc(q.options[q.answer])+'.')+'</b> '+esc(q.why)+'</p>')+'</section>';
 }).join('');
 const all=l.questions.every((_,i)=>answers[i]!==undefined);
 result+='<div class="actions">'+btn('← Đọc lại','read-stage-1')+btn('Làm lại bài tập','read-reset')+btn(readingDone[l.id]?'Đã hoàn thành ✓':'Hoàn thành bài','read-complete','class="primary" '+(!all?'disabled':'')+' aria-pressed="'+Boolean(readingDone[l.id])+'"')+'</div>';
 if(all&&readingDone[l.id]){
  const other=readings.find(x=>x.group===l.group&&x.id!==l.id);
  result+='<p role="status">Đã hoàn thành bài '+l.part+'.</p>'+btn('Mở bài '+other.part+' · '+esc(other.title),'read-open-'+other.id);
 }
 return result+'</article>';
}
function readingView(){
 if(selectedReading===null){
  const q=norm($('query').value.trim());
  const groups=[...new Set(readings.map(l=>l.group))];
  let html='<div class="page-heading"><small>LỘ TRÌNH ĐỌC</small><h1>Từ vựng qua câu chuyện</h1><p>Học từ → Đọc bài → Hiểu câu chuyện</p></div>';
  for(const group of groups){
   const pair=readings.filter(l=>l.group===group);
   if(!pair.some(l=>norm(l.title+' '+l.level+' '+l.targets.map(t=>t.word).join(' ')).includes(q)))continue;
   html+='<article class="reading-group"><div class="group-heading"><span class="tag">'+pair[0].level+'</span><h2>Nhóm 01 · Những chuyến bay đầu tiên</h2><small>25 từ · 2 bài đọc</small></div>'+pair.map(l=>'<div class="reading-row"><div><small>BÀI '+l.part+(readingDone[l.id]?' · ĐÃ HOÀN THÀNH':'')+'</small><h3>'+esc(l.title)+'</h3></div>'+btn(readingDone[l.id]?'Học lại':readingStages[l.id]===undefined?'Bắt đầu':'Tiếp tục','read-open-'+l.id,'class="primary"')+'</div>').join('')+'</article>';
  }
  if(!readings.some(l=>norm(l.title+' '+l.level+' '+l.targets.map(t=>t.word).join(' ')).includes(q)))html+='<p>Không tìm thấy bài phù hợp.</p>';
  return html+readingRoadmap();
 }
 const l=currentReading(),stage=readingStage();
 let html=btn('← Các bài đọc','read-list')+'<div class="page-heading"><small>'+l.level+' · NHÓM 01 · BÀI '+l.part+'</small><h1>'+esc(l.title)+'</h1></div>';
 html+='<nav class="study-steps" aria-label="Các bước học">'+['Học 25 từ','Đọc bài','Làm bài tập'].map((name,i)=>btn((i+1)+'. '+name,'read-stage-'+i,'aria-current="'+(i===stage?'step':'false')+'"')).join('')+'</nav>';
 if(stage===0){
  html+='<article><h2>Từ vựng của nhóm</h2><p class="muted">Hai bài dùng chung 25 từ này. Bấm vào từ để nghe và đánh dấu cần ôn.</p><div class="study-vocabulary">'+l.targets.map((t,i)=>'<section><div>'+btn(esc(t.word),'read-word-'+i,'class="vocab-name"')+'<small>'+esc(t.pos)+' · '+t.level+'</small>'+btn('♫','read-say-'+i,'class="small-audio" aria-label="Nghe '+esc(t.word)+' bằng giọng Mỹ"')+'</div><p>'+esc(t.vi)+'</p><p lang="en" class="muted">'+esc(t.en)+'</p></section>').join('')+'</div></article><div class="step-bottom">'+btn('Tiếp → Đọc bài','read-stage-1','class="primary"')+'</div>';
 }else if(stage===1){
  html+='<article class="reading-article"><h2 lang="en">'+esc(l.englishTitle)+'</h2><div class="continuous-reading" lang="en">'+l.paragraphs.map((_,i)=>'<p>'+readingMarkedParagraph(l,i)+'</p>').join('')+'</div><details><summary>Xem bản dịch tiếng Việt</summary>'+l.paragraphs.map(p=>'<p>'+esc(p[1])+'</p>').join('')+'</details></article>';
  html+='<details><summary>Ngữ pháp được dùng trong bài</summary>'+l.grammar.map(g=>'<p lang="en"><b>'+esc(g.example)+'</b></p><p>'+esc(g.note)+'</p>'+btn(esc(grammar.find(x=>x.id===g.id).title),'read-grammar-'+g.id)).join('')+'</details>';
  html+='<details><summary>Nguồn và từ hỗ trợ</summary><p>'+esc(l.note)+'</p><p>Bài và bản dịch do ứng dụng biên soạn. Sự kiện đối chiếu nguồn ngày 05/11/2026.</p><ul>'+l.sources.map(([name,url])=>'<li><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(name)+'</a></li>').join('')+'</ul></details><div class="step-bottom">'+btn('← Học từ','read-stage-0')+btn('Tiếp → Làm bài tập','read-stage-2','class="primary"')+'</div>';
 }else html+=readingExercises(l);
 return html;
}
function openReadingWord(index){
 const l=currentReading(),t=l.targets[index],r=defaults[t.rowIndex];activeReadingWord=index;
 $('reading-word-content').innerHTML='<h2 id="reading-word-title">'+esc(t.word)+'</h2><p>'+esc(t.pos)+' · '+t.level+' · '+esc(r.us||'Chưa có phiên âm Mỹ')+'</p><p><b>'+esc(t.vi)+'</b></p><p lang="en">'+esc(t.en)+'</p><p class="muted">Giải nghĩa được biên soạn theo ngữ cảnh bài học.</p>'+btn('♫ Nghe giọng Mỹ','read-audio')+'<div class="actions">'+btn('Cần ôn','read-review','aria-pressed="'+(state(r)==='review')+'"')+btn('Đã thuộc','read-known','aria-pressed="'+(state(r)==='known')+'"')+'</div><p id="reading-word-status" role="status"></p>';
 $('reading-word-dialog').showModal();
}
function handleReadingAction(action){
 if(!action.startsWith('read-'))return false;
 if(action.startsWith('read-open-')){
  const id=action.slice(10);if(!readings.some(l=>l.id===id))return true;
  selectedReading=id;$('query').value='';render();window.scrollTo(0,0);return true;
 }
 if(action==='read-list'){selectedReading=null;render();window.scrollTo(0,0);return true}
 if(action==='read-return'){mode=5;$('query').value='';render();return true}
 if(action.startsWith('read-stage-')){const stage=Number(action.slice(11));if([0,1,2].includes(stage))setReadingStage(stage);return true}
 if(action.startsWith('read-word-')){openReadingWord(Number(action.slice(10)));return true}
 if(action.startsWith('read-say-')){
  audio(defaults[currentReading().targets[Number(action.slice(9))].rowIndex],'en-US');return true;
 }
 if(action.startsWith('read-grammar-')){
  const id=Number(action.slice(13));mode=4;grammarTopic='';$('query').value=grammar.find(g=>g.id===id).title;render();
  const lesson=$('view').querySelector('[data-lesson="'+id+'"]');if(lesson)lesson.open=true;
  window.scrollTo(0,0);return true;
 }
 if(action==='read-close'){$('reading-word-dialog').close();return true}
 const l=currentReading();if(!l)return true;
 if(action==='read-audio'){
  audio(defaults[l.targets[activeReadingWord].rowIndex],'en-US');
  $('reading-word-status').textContent=$('audioStatus').textContent;return true;
 }
 if(action==='read-known'||action==='read-review'){
  const r=defaults[l.targets[activeReadingWord].rowIndex],next=action.slice(5);
  if(state(r)===next)delete progress[key(r)];else progress[key(r)]=next;
  const saved=save('ox5-progress',progress);
  for(const b of $('reading-word-content').querySelectorAll('[data-action="read-known"],[data-action="read-review"]'))b.setAttribute('aria-pressed',String(state(r)===b.dataset.action.slice(5)));
  $('reading-word-status').textContent=saved?'Đã lưu.':'Chưa lưu được tiến độ.';return true;
 }
 if(action.startsWith('read-answer-')){
  const [, ,qi,choice]=action.split('-'),i=Number(qi),pick=Number(choice);
  if(!l.questions[i]||!Number.isInteger(pick)||!l.questions[i].options[pick])return true;
  readingAnswers[l.id]??={};if(readingAnswers[l.id][i]!==undefined)return true;
  readingAnswers[l.id][i]=pick;
  if(!save('ox5-reading-answers',readingAnswers))$('audioStatus').textContent=' Chưa lưu được kết quả bài đọc.';
  const scroll=window.scrollY;render();$('reading-score').focus({preventScroll:true});window.scrollTo(0,scroll);return true;
 }
 if(action==='read-reset'){
  readingAnswers[l.id]={};readingDone[l.id]=false;
  save('ox5-reading-answers',readingAnswers);save('ox5-reading-done',readingDone);render();return true;
 }
 if(action==='read-complete'){
  if(!l.questions.every((_,i)=>readingAnswers[l.id]?.[i]!==undefined))return true;
  readingDone[l.id]=true;
  if(!save('ox5-reading-done',readingDone))$('audioStatus').textContent=' Chưa lưu được trạng thái bài đọc.';
  render();return true;
 }
 return false;
}
$('reading-word-dialog').onclick=e=>{const action=e.target.dataset.action;if(action)handleReadingAction(action)};

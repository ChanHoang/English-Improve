let selectedReading=null;
let readingDone=read('ox5-reading-done',{});
let readingAnswers=read('ox5-reading-answers',{});
let activeReadingWord=null;
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
function readingView(){
 const query=norm($('query').value.trim());
 if(selectedReading===null){
  const list=readings.filter(l=>norm([l.level,l.title,l.englishTitle,...l.targets.map(t=>t.word)].join(' ')).includes(query));
  return '<article><small>BẢN MẪU · 5 BÀI</small><h2>Đọc để học từ</h2><p>Mỗi bài có 25 mục từ theo chủ đề, nghĩa trong ngữ cảnh và câu hỏi tự kiểm tra. Cấp độ bài là ước lượng biên soạn; cấp độ từng mục từ lấy từ bộ dữ liệu gốc.</p><p>Nội dung, bản dịch và giải nghĩa trong ngữ cảnh do ứng dụng biên soạn. Sự kiện có nguồn ở cuối mỗi bài. Bài đọc và câu hỏi dùng được ngoại tuyến; mở nguồn cần Internet.</p></article><div class="reading-grid">'+list.map(l=>{
   const done=readingDone[l.id],answers=readingAnswers[l.id]||{};
   const score=l.questions.filter((q,i)=>answers[i]===q.answer).length;
   return '<article><span class="tag">'+l.level+'</span><h2>'+esc(l.title)+'</h2><p>'+esc(l.hook)+'</p><p class="muted">'+l.wordCount+' từ trong bài · 25 mục từ học · '+(done?'Đã đọc':'Chưa đánh dấu đã đọc')+'</p><p>Đúng '+score+' / '+l.questions.length+' câu</p>'+btn('Mở bài đọc','read-open-'+l.id,'class="primary"')+'</article>';
  }).join('')+'</div>'+(list.length?'':'<p>Không tìm thấy bài. Thử tìm A1, C1 hoặc một từ trong nhóm.</p>');
 }
 const l=readings.find(x=>x.id===selectedReading);
 const answers=readingAnswers[l.id]||{};
 const score=l.questions.filter((q,i)=>answers[i]===q.answer).length;
 let html=btn('← Danh sách bài mẫu','read-list')+'<article><span class="tag">'+l.level+'</span><h2>'+esc(l.englishTitle)+'</h2><p>'+esc(l.title)+'</p><p><b>'+esc(l.hook)+'</b></p><p class="muted">'+l.wordCount+' từ · 25 mục từ học · '+esc(l.note)+'</p><p>Bấm từ gạch chân để xem nghĩa trong câu và nghe phát âm Mỹ. Mỗi mục từ được đánh dấu ở một vị trí tiêu biểu.</p></article>';
 html+=l.paragraphs.map((p,i)=>'<article class="reading-paragraph"><small>ĐOẠN '+(i+1)+'</small><p lang="en">'+readingMarkedParagraph(l,i)+'</p><details><summary>Xem bản dịch đoạn '+(i+1)+'</summary><p>'+esc(p[1])+'</p></details></article>').join('');
 html+='<details><summary>25 mục từ của bài · nghĩa theo ngữ cảnh</summary><div class="reading-words">'+l.targets.map((t,i)=>'<div>'+btn(esc(t.word),'read-word-'+i)+' <small>'+esc(t.pos)+' · '+t.level+'</small><p>'+esc(t.vi)+'</p></div>').join('')+'</div></details>';
 html+='<article><h2>Ngữ pháp trong bài</h2>'+l.grammar.map(g=>'<p lang="en"><b>'+esc(g.example)+'</b></p><p>'+esc(g.note)+'</p>'+btn('Mở bài '+esc(grammar.find(x=>x.id===g.id).title),'read-grammar-'+g.id)).join('')+'</article>';
 html+='<article><h2>Tự kiểm tra</h2><p id="reading-score" role="status">Đúng '+score+' / '+l.questions.length+' câu · Đã trả lời '+Object.keys(answers).length+' câu</p>';
 html+=l.questions.map((q,i)=>{
  const pick=answers[i];
  return '<section class="reading-question"><h3>'+(i+1)+'. '+esc(q.q)+'</h3>'+q.options.map((option,j)=>btn(esc(option),'read-answer-'+i+'-'+j,'class="answer" '+(pick===undefined?'':'disabled aria-pressed="'+(j===pick)+'"'))).join('')+(pick===undefined?'':'<p role="status"><b>'+(pick===q.answer?'Đúng.':'Chưa đúng. Đáp án là '+esc(q.options[q.answer])+'.')+'</b> '+esc(q.why)+'</p>')+'</section>';
 }).join('');
 html+=btn('Làm lại câu hỏi','read-reset')+'</article><article><h2>Thử dùng từ của bạn</h2><p>'+esc(l.prompt)+'</p><p class="muted">Bài viết tự luyện, không chấm tự động.</p>'+btn(readingDone[l.id]?'Đã đọc ✓':'Đánh dấu đã đọc','read-complete','aria-pressed="'+Boolean(readingDone[l.id])+'"')+'</article>';
 html+='<details><summary>Nguồn và cách biên soạn</summary><p>Bài đọc được viết mới để học tiếng Anh, không phải bản dịch nguyên văn nguồn. Nguồn sự kiện được kiểm tra ngày 05/11/2026. Những lời mời suy ngẫm và phần phân tích được biên soạn cho bài học.</p><ul>'+l.sources.map(([name,url])=>'<li><a target="_blank" rel="noopener noreferrer" href="'+esc(url)+'">'+esc(name)+'</a></li>').join('')+'</ul></details>';
 return html;
}
function openReadingWord(index){
 const l=readings.find(x=>x.id===selectedReading),t=l.targets[index],r=defaults[t.rowIndex];
 activeReadingWord=index;
 $('reading-word-content').innerHTML='<h2 id="reading-word-title">'+esc(t.word)+'</h2><p>'+esc(t.pos)+' · '+t.level+' · '+esc(r.us||'Chưa có phiên âm Mỹ')+'</p><p><b>Nghĩa trong bài</b><br>'+esc(t.vi)+'</p><p lang="en">'+esc(t.en)+'</p><p class="muted">Giải nghĩa EN–VI do ứng dụng biên soạn cho ngữ cảnh này.</p>'+btn('🔊 Nghe giọng Mỹ','read-audio')+'<div class="actions">'+btn('Cần ôn','read-review','aria-pressed="'+(state(r)==='review')+'"')+btn('Đã thuộc','read-known','aria-pressed="'+(state(r)==='known')+'"')+'</div><p class="muted">Đánh dấu cho mục từ trong bộ gốc đi kèm ứng dụng.</p><p id="reading-word-status" role="status"></p>';
 $('reading-word-dialog').showModal();
}
function handleReadingAction(action){
 if(!action.startsWith('read-'))return false;
 if(action.startsWith('read-open-')){selectedReading=action.slice(10);$('query').value='';render();return true}
 if(action==='read-list'){selectedReading=null;render();return true}
 if(action==='read-return'){mode=5;$('query').value='';render();return true}
 if(action.startsWith('read-word-')){openReadingWord(Number(action.slice(10)));return true}
 if(action.startsWith('read-grammar-')){
  const id=Number(action.slice(13));mode=4;grammarTopic='';$('query').value=grammar.find(g=>g.id===id).title;render();
  const lesson=$('view').querySelector('[data-lesson="'+id+'"]');if(lesson)lesson.open=true;
  return true;
 }
 if(action==='read-close'){$('reading-word-dialog').close();return true}
 const l=readings.find(x=>x.id===selectedReading);
 if(action==='read-audio'){
  audio(defaults[l.targets[activeReadingWord].rowIndex],'en-US');
  $('reading-word-status').textContent=$('audioStatus').textContent;return true;
 }
 if(action==='read-known'||action==='read-review'){
  const r=defaults[l.targets[activeReadingWord].rowIndex],next=action.slice(5);
  if(state(r)===next)delete progress[key(r)];else progress[key(r)]=next;
  const saved=save('ox5-progress',progress);
  for(const b of $('reading-word-content').querySelectorAll('[data-action="read-known"],[data-action="read-review"]'))b.setAttribute('aria-pressed',String(state(r)===b.dataset.action.slice(5)));
  $('reading-word-status').textContent=saved?'Đã lưu tiến độ.':'Chưa lưu được. Thay đổi chỉ có trong phiên này.';
  return true;
 }
 if(action.startsWith('read-answer-')){
  const [, ,qi,choice]=action.split('-');const i=Number(qi),pick=Number(choice);
  readingAnswers[l.id]??={};
  if(readingAnswers[l.id][i]!==undefined)return true;
  readingAnswers[l.id][i]=pick;
  if(!save('ox5-reading-answers',readingAnswers))$('audioStatus').textContent=' Chưa lưu được kết quả bài đọc.';
  const scroll=window.scrollY;render();window.scrollTo(0,scroll);$('reading-score').focus();return true;
 }
 if(action==='read-reset'){
  readingAnswers[l.id]={};save('ox5-reading-answers',readingAnswers);render();return true;
 }
 if(action==='read-complete'){
  readingDone[l.id]=!readingDone[l.id];
  if(!save('ox5-reading-done',readingDone))$('audioStatus').textContent=' Chưa lưu được trạng thái bài đọc.';
  render();return true;
 }
 return false;
}
$('reading-word-dialog').onclick=e=>{const action=e.target.dataset.action;if(action)handleReadingAction(action)};

function readingGroupNumber(l){return [...new Set(readings.filter(x=>x.level===l.level).map(x=>x.group))].indexOf(l.group)+1}
let selectedGrammar=Number(read('ox5-selected-grammar',1)),grammarPanel='lesson';
let grammarAnswers=read('ox5-grammar-answers-v1',{}),grammarPages={};
let readingCategory='content',readingPages={},selectedVocabKey=null;
let readingLevel=null;
const readingLevels=['A2','B1','B2','C1'];
let collocationLevel=null,selectedCollocation=null,collocationStage=0,activeCollocationWord=null;
let collocationAnswers=read('ox5-collocation-answers-v1',{}),collocationDone=read('ox5-collocation-done-v1',{}),collocationPages={};
function currentCollocationGroup(){return collocations.find(g=>g.id===selectedCollocation)||null}
function readingLevelButtons(){return '<nav class="reading-level-switcher" aria-label="Reading levels">'+readingLevels.map(level=>{const items=readings.filter(l=>l.level===level),open=readingLevel===level;return btn('<strong>'+level+'</strong><small>'+items.length+' readings</small>','read-level-'+level,'class="reading-level-toggle" aria-expanded="'+open+'" aria-controls="reading-level-panel"')}).join('')+'</nav><div id="reading-level-panel">'+(readingLevel?readingLevelItems(readingLevel):'<p class="nav-help">Choose a level to see its lessons.</p>')+'</div>'}
function readingLevelItems(level){const q=norm($('query').value.trim()),items=readings.filter(l=>l.level===level);if(!items.length)return '<p class="nav-help">Coming later. No readings published yet.</p>';let out='';for(const group of [...new Set(items.map(l=>l.group))]){const pair=items.filter(l=>l.group===group);if(!pair.some(l=>norm(l.title+' '+l.englishTitle+' '+l.targets.map(t=>t.word).join(' ')).includes(q)))continue;out+='<h3 class="nav-group">'+String(readingGroupNumber(pair[0])).padStart(2,'0')+' '+esc(pair[0].groupTitle)+'</h3>'+pair.map(l=>btn(l.part+'. '+esc(l.englishTitle)+(readingDone[l.id]?' ✓':''),'read-open-'+l.id,'class="secondary-link" aria-current="'+(selectedReading===l.id?'page':'false')+'"')).join('')}return out||'<p class="nav-help">No readings match this search.</p>'}
function collocationLevelButtons(){
 return '<nav class="reading-level-switcher" aria-label="Collocation levels">'+readingLevels.map(level=>{
  const lvInfo=collocationPlan.levels[level];
  const open=collocationLevel===level;
  return btn('<strong>'+level+'</strong><small>'+lvInfo.completedCollocations+' / '+lvInfo.plannedCollocations+' collocations</small>','col-level-'+level,'class="reading-level-toggle" aria-expanded="'+open+'" aria-controls="collocation-level-panel"');
 }).join('')+'</nav><div id="collocation-level-panel">'+(collocationLevel?collocationLevelItems(collocationLevel):collocationAllActiveItems())+'</div>';
}
function collocationMatchGroup(g,q){
 if(!q)return true;
 return norm([g.englishTitle,g.title,g.level,...g.items.map(it=>it.collocation+' '+it.word+' '+it.pattern+' '+it.vi+' '+it.en)].join(' ')).includes(q);
}
function collocationAllActiveItems(){
 const q=norm($('query').value.trim());
 const matched=collocations.filter(g=>collocationMatchGroup(g,q));
 let out='<p class="nav-count">Ready (Batches 1–3): '+collocationPlan.completedCollocations+' collocations ('+collocations.length+' groups) · Roadmap: '+collocationPlan.totalPlannedCollocations.toLocaleString('en')+' collocations</p>';
 for(const level of readingLevels){
  const list=matched.filter(g=>g.level===level);
  if(!list.length)continue;
  out+='<h3 class="nav-group">'+level+' · Active groups ('+list.length*20+' collocations)</h3>'+list.map((g,i)=>btn(String(i+1).padStart(2,'0')+'. '+esc(g.englishTitle)+(collocationDone[g.id]?' ✓':'')+'<small>'+esc(g.title)+' · 20 collocations</small>','col-open-'+g.id,'class="secondary-link" aria-current="'+(selectedCollocation===g.id?'page':'false')+'"')).join('');
 }
 return matched.length?out:out+'<p class="nav-help">No collocations match this search.</p>';
}
function collocationLevelItems(level){
 const q=norm($('query').value.trim());
 const active=collocations.filter(g=>g.level===level&&collocationMatchGroup(g,q));
 const planned=collocationPlan.groups.filter(g=>g.level===level&&g.status==='planned'&&(!q||norm(g.groupTitle+' '+g.titleVi+' '+g.targets.map(t=>t.word+' '+t.collocation).join(' ')).includes(q)));
 const lvInfo=collocationPlan.levels[level];
 let out='<p class="nav-count">'+lvInfo.completedCollocations+' active / '+lvInfo.plannedCollocations+' planned '+level+' collocations</p>';
 if(active.length){
  out+='<h3 class="nav-group">'+level+' · Ready in Batches 1–3 ('+active.length+' groups)</h3>'+active.map((g,i)=>btn(String(i+1).padStart(2,'0')+'. '+esc(g.englishTitle)+(collocationDone[g.id]?' ✓':'')+'<small>'+esc(g.title)+' · 20 collocations</small>','col-open-'+g.id,'class="secondary-link" aria-current="'+(selectedCollocation===g.id?'page':'false')+'"')).join('');
 }
 if(planned.length){
  out+='<h3 class="nav-group">'+level+' · Roadmap ('+planned.length+' planned groups)</h3>'+planned.map((g,i)=>btn('Batch '+g.batch+' · '+esc(g.groupTitle)+'<small>20 planned collocations ('+g.targets.slice(0,4).map(t=>esc(t.word)).join(', ')+'…)</small>','col-plan-'+g.group,'class="secondary-link"')).join('');
 }
 if(!active.length&&!planned.length)out+='<p class="nav-help">No collocations match this search.</p>';
 return out;
}
function highlightCollocation(sentence,phrase){
 const escaped=phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const re=new RegExp('('+escaped+')','i');
 const parts=String(sentence||'').split(re);
 return parts.map((p,i)=>i%2===1?'<strong class="collocation-highlight">'+esc(p)+'</strong>':esc(p)).join('');
}
function collocationRoadmap(filterLevel){
 const batches=filterLevel?collocationPlan.batches.filter(b=>b.levels.includes(filterLevel)):collocationPlan.batches;
 return '<details class="reading-roadmap" id="collocation-roadmap-box"><summary>Collocation Roadmap · '+collocationPlan.totalPlannedCollocations.toLocaleString('en')+' collocations across '+collocationPlan.totalGroups+' groups (A2–C1 only)</summary><p>Lộ trình gồm <b>'+collocationPlan.totalPlannedCollocations.toLocaleString('vi-VN')+' collocations</b> được xây dựng hoàn toàn từ 4.867 mục từ vựng cấp độ <b>A2, B1, B2, C1</b> của dự án (không lấy từ A1). Đợt 1, 2 & 3 đã hoàn thành <b>'+collocationPlan.completedCollocations+' collocations</b> trong <b>'+collocationPlan.completedGroups+' nhóm</b> (720/720 A2 hoàn tất + 360 B1 + 40 B2 + 20 C1) kèm 570 câu hỏi trắc nghiệm.</p>'+batches.map(b=>{
  const gs=collocationPlan.groups.filter(g=>g.batch===b.batch&&(!filterLevel||g.level===filterLevel));
  return '<details><summary><b>'+esc(b.title)+'</b> · '+gs.length+' groups · '+(gs.length*20)+' collocations · '+(b.status==='complete'?'Completed ✓':'Planned')+'</summary><p>'+esc(b.focus)+'</p><div class="curriculum-list">'+gs.map(g=>'<span>'+(g.status==='complete'?'✓ ':'○ ')+'<b>'+g.level+'</b> · '+esc(g.groupTitle)+' ('+g.targets.slice(0,5).map(t=>esc(t.collocation)).join('; ')+'…)</span>').join('')+'</div></details>';
 }).join('')+'</details>';
}
function collocationExercises(g){
 const answers=collocationAnswers[g.id]||{},all=g.questions.every((_,i)=>answers[i]!==undefined),score=g.questions.filter((q,i)=>answers[i]===q.answer).length;
 const p=collocationPages[g.id]||0,size=5,qs=g.questions;
 let out='<article><div class="assessment-heading"><h2>Practice Collocations</h2><p id="collocation-score" tabindex="-1" role="status">'+score+'/'+qs.length+' correct · '+Object.keys(answers).length+'/'+qs.length+' answered</p></div>';
 out+=qs.slice(p*size,(p+1)*size).map((q,j)=>questionMarkup(q,p*size+j,answers[p*size+j],'cq')).join('');
 out+='<div class="step-bottom">'+btn('Previous','cq-page-'+(p-1),p===0?'disabled':'')+'<span>Page '+(p+1)+'/'+Math.ceil(qs.length/size)+'</span>'+btn('Next','cq-page-'+(p+1),(p+1)*size>=qs.length?'disabled':'')+'</div>';
 out+='<div class="actions">'+btn('← Review collocations','col-stage-0')+btn('Reset practice','cq-reset')+btn(collocationDone[g.id]?'Completed ✓':'Complete group','cq-complete','class="primary" '+(!all?'disabled':'')+' aria-pressed="'+Boolean(collocationDone[g.id])+'"')+'</div>';
 return out+'</article>';
}
function collocationView(){
 const q=norm($('query').value.trim());
 if(!selectedCollocation){
  const activeList=collocations.filter(g=>(!collocationLevel||g.level===collocationLevel)&&collocationMatchGroup(g,q));
  const plannedList=collocationLevel?collocationPlan.groups.filter(g=>g.level===collocationLevel&&g.status==='planned'&&(!q||norm(g.groupTitle+' '+g.titleVi+' '+g.targets.map(t=>t.word+' '+t.collocation).join(' ')).includes(q))):[];
  let out='<div class="page-heading"><small>COLLOCATION PATH · '+(collocationLevel||'A2–C1')+'</small><h1>'+(collocationLevel?collocationLevel+' Collocations':'Collocations in Context (A2–C1)')+'</h1><p>'+collocationPlan.completedCollocations+' active collocations in Batches 1–3 ('+collocations.length+' groups) · '+collocationPlan.totalPlannedCollocations.toLocaleString('en')+' planned collocations across '+collocationPlan.totalGroups+' groups</p></div>';
  out+='<div class="level-cards">'+readingLevels.map(level=>{const lv=collocationPlan.levels[level];return btn('<strong>'+level+'</strong><span>'+lv.completedCollocations+' ready / '+lv.plannedCollocations+' planned</span>','col-level-'+level,'class="level-card" aria-pressed="'+(collocationLevel===level)+'"')}).join('')+'</div>';
  if(activeList.length){
   out+=activeList.map((g,idx)=>'<article class="reading-group" data-col-group="'+esc(g.id)+'"><div class="group-heading"><span class="tag">'+g.level+'</span><h2>Batch '+g.batch+' · Group '+String(g.order).padStart(2,'0')+' · '+esc(g.englishTitle)+'</h2><small>'+g.items.length+' collocations · '+g.questions.length+' questions'+(collocationDone[g.id]?' · COMPLETED ✓':'')+'</small></div><p class="muted">'+esc(g.title)+' — '+g.items.slice(0,5).map(it=>esc(it.collocation)).join(' • ')+'…</p><div class="reading-row"><div><small>HEADWORDS ('+g.level+')</small><h3>'+g.items.slice(0,8).map(it=>esc(it.word)).join(', ')+'…</h3></div>'+btn(collocationDone[g.id]?'Review':'Open','col-open-'+g.id,'class="primary"')+'</div></article>').join('');
  }else{
   out+='<article><p>No active collocation groups match this search.</p></article>';
  }
  if(plannedList.length){
   out+='<details class="reading-roadmap"><summary>Upcoming '+collocationLevel+' groups in roadmap ('+plannedList.length+' groups · '+(plannedList.length*20)+' planned collocations)</summary>'+plannedList.map(pg=>'<article class="reading-group" id="plan-'+esc(pg.group)+'"><div class="group-heading"><span class="tag">'+pg.level+' · Batch '+pg.batch+'</span><h2>'+esc(pg.groupTitle)+'</h2><small>20 planned collocations</small></div><p class="muted">'+pg.targets.map(t=>'<b>'+esc(t.collocation)+'</b> ('+esc(t.word)+', '+esc(t.pos)+')').join(' · ')+'</p></article>').join('')+'</details>';
  }
  return out+collocationRoadmap(collocationLevel);
 }
 const g=currentCollocationGroup();
 const items=q?g.items.map((it,i)=>({it,i})).filter(({it})=>norm(it.collocation+' '+it.word+' '+it.pattern+' '+it.vi+' '+it.en+' '+it.example).includes(q)):g.items.map((it,i)=>({it,i}));
 const bottomBar=typeof michaelWordBottomBar==='function'?michaelWordBottomBar():'';
 let out=btn('← All collocation groups','col-list')+'<div class="page-heading"><small>'+g.level+' · BATCH '+g.batch+' · GROUP '+String(g.order).padStart(2,'0')+'</small><h1>'+esc(g.englishTitle)+'</h1><p>'+esc(g.title)+'</p></div><nav class="study-steps" aria-label="Collocation study steps">'+['1. Learn '+g.items.length+' collocations','2. Practice ('+g.questions.length+')'].map((s,i)=>btn(s,'col-stage-'+i,'aria-current="'+(collocationStage===i?'step':'false')+'"')).join('')+'</nav>';
 if(collocationStage===0){
  const icon=typeof soundIcon==='function'?soundIcon():'♫';
  const speedBar=typeof michaelWordTools==='function'?michaelWordTools():'';
  out+='<article><h2>Learn the collocations</h2>'+speedBar+'<div class="study-vocabulary collocation-grid">'+items.map(({it,i})=>{
   const reveal=typeof meaningReveal==='function'?meaningReveal(it.vi+' — Ví dụ: '+it.exampleVi,it.note):'<p>'+esc(it.vi)+'</p>';
   const photo=typeof vocabPhotoCard==='function'?vocabPhotoCard(defaults[it.rowIndex],true,it.collocation+' '+it.example):'';
   return '<section class="collocation-item" data-col-index="'+i+'">'+photo+'<div><strong class="collocation-phrase" lang="en">'+esc(it.collocation)+'</strong> <span class="tag">'+esc(it.pattern)+'</span></div><div>'+btn(esc(it.word),'col-word-'+i,'class="vocab-name"')+'<small>'+esc(it.pos)+' · '+it.level+'</small>'+btn(icon,'col-say-'+i,'class="small-audio" aria-label="Listen to '+esc(it.word)+'" title="Play pronunciation"')+'</div><p lang="en" class="muted">'+esc(it.en)+'</p><p lang="en" class="collocation-example">'+highlightCollocation(it.example,it.collocation)+'</p>'+reveal+'</section>';
  }).join('')+(items.length?'':'<p>No collocations in this group match your search.</p>')+'</div></article><div class="step-bottom">'+btn('Next → Practice ('+g.questions.length+')','col-stage-1','class="primary"')+'</div>'+bottomBar;
 }else{
  out+=collocationExercises(g)+bottomBar;
 }
 return out;
}
function openCollocationWord(index){
 const g=currentCollocationGroup();if(!g||!g.items[index])return;
 const it=g.items[index],r=defaults[it.rowIndex];activeCollocationWord=index;
 const icon=typeof soundIcon==='function'?soundIcon():'♫ Listen (US)';
 const speedBar=typeof michaelWordTools==='function'?michaelWordTools():'';
 const photo=typeof vocabPhotoCard==='function'?vocabPhotoCard(r,false,it.collocation+' '+it.example):'';
 const reveal=typeof meaningReveal==='function'?meaningReveal(it.vi+' (Collocation: '+it.collocation+')','Nghĩa của cụm từ trong bài học Collocation'):'<p><b>'+esc(it.vi)+'</b></p>';
 $('reading-word-content').innerHTML='<h2 id="reading-word-title">'+esc(it.word)+'</h2>'+photo+'<p>'+esc(it.pos)+' · '+it.level+' · '+esc(r.us||'US pronunciation unavailable')+'</p><p lang="en"><b>Collocation:</b> '+esc(it.collocation)+' <small>('+esc(it.pattern)+')</small></p>'+reveal+'<p lang="en">'+esc(r.def||'English definition unavailable in the source.')+'</p>'+btn(icon,'col-audio','aria-label="Play pronunciation" title="Play pronunciation"')+speedBar+'<div class="actions">'+btn('Review','col-review','aria-pressed="'+(state(r)==='review')+'"')+btn('Known','col-known','aria-pressed="'+(state(r)==='known')+'"')+'</div><p id="reading-word-status" role="status"></p>';
 $('reading-word-dialog').showModal();
 if(typeof schedulePhotoHydration==='function')schedulePhotoHydration();
}
const categoryNames={content:'Story',vocabulary:'Vocabulary',grammar:'Grammar'};
function rememberGrammar(id){selectedGrammar=id;save('ox5-selected-grammar',id);grammarPanel='lesson'}
function matchingGrammar(){const q=norm($('query').value.trim());return grammar.filter(g=>norm([g.englishTitle,g.title,g.topic,g.rule,...g.examples.map(e=>e.en+' '+e.vi)].join(' ')).includes(q))}
function grammarView(){
 const g=grammar.find(g=>g.id===selectedGrammar)||grammar[0];
 const gPhoto=typeof grammarPhotoCard==='function'?grammarPhotoCard(g):'';
 return '<div class="page-heading"><small>GRAMMAR · '+g.id+'/120</small><h1>'+esc(g.englishTitle)+'</h1><p>'+esc(g.title)+'</p></div><nav class="content-tabs" aria-label="Grammar sections">'+btn('Lesson','g-panel-lesson','aria-pressed="'+(grammarPanel==='lesson')+'"')+btn('Practice · '+grammarQuiz[g.id].length,'g-panel-practice','aria-pressed="'+(grammarPanel==='practice')+'"')+'</nav>'+(grammarPanel==='lesson'?'<article class="grammar-lesson" data-lesson="'+g.id+'">'+gPhoto+grammarLessonBody(g)+'<div class="step-bottom">'+btn('Next → Practice','g-panel-practice','class="primary"')+'</div></article>':grammarPractice(g));
}
function explanationMarkup(q,pick){return '<div class="option-explanations" role="status"><p><strong>'+(pick===q.answer?'Correct':'Not quite')+' · Answer '+String.fromCharCode(65+q.answer)+'</strong></p>'+q.options.map((option,i)=>'<div class="option-explanation '+(i===q.answer?'right':'wrong')+'"><b>'+String.fromCharCode(65+i)+'. '+esc(option)+' — '+(i===q.answer?'Correct':'Incorrect')+(i===pick?' · Your choice':'')+'</b><p>'+esc(q.explanations[i])+'</p></div>').join('')+'</div>'}
function questionMarkup(q,index,pick,prefix){return '<section class="assessment-question" id="question-'+index+'"><p class="question-number">QUESTION '+(index+1)+'</p><h3>'+esc(q.q)+'</h3><div class="answer-options">'+q.options.map((o,i)=>btn(String.fromCharCode(65+i)+'. '+esc(o),prefix+'-answer-'+index+'-'+i,'class="answer" '+(pick===undefined?'':'disabled ')+'aria-pressed="'+(pick===i)+'"')).join('')+'</div>'+(pick===undefined?'':explanationMarkup(q,pick))+'</section>'}
function grammarPractice(g){
 const qs=grammarQuiz[g.id],answers=grammarAnswers[g.id]||{},p=grammarPages[g.id]||0,size=5,score=qs.filter((q,i)=>answers[i]===q.answer).length;
 return '<article><div class="assessment-heading"><h2>Practice</h2><p>'+score+'/'+qs.length+' correct · '+Object.keys(answers).length+'/'+qs.length+' answered</p></div><p class="muted">Chọn một đáp án để xem giải thích cho cả A, B và C.</p>'+qs.slice(p*size,(p+1)*size).map((q,j)=>questionMarkup(q,p*size+j,answers[p*size+j],'gq')).join('')+'<div class="step-bottom">'+btn('Previous','gq-page-'+(p-1),p===0?'disabled':'')+'<span>Page '+(p+1)+'/'+Math.ceil(qs.length/size)+'</span>'+btn('Next','gq-page-'+(p+1),(p+1)*size>=qs.length?'disabled':'')+'</div>'+btn('Reset practice','gq-reset')+'</article>';
}
function readingExercises(l){
 const answers=readingAnswers[l.id]||{},all=l.questions.every((_,i)=>answers[i]!==undefined),score=l.questions.filter((q,i)=>answers[i]===q.answer).length;
 const qs=l.questions.map((q,i)=>({q,i})).filter(x=>x.q.category===readingCategory),key=l.id+'-'+readingCategory,p=readingPages[key]||0,size=5;
 let out='<article><h2>Practice</h2><p id="reading-score" tabindex="-1" role="status">'+score+'/'+l.questions.length+' correct · '+Object.keys(answers).length+'/'+l.questions.length+' answered</p><nav class="content-tabs" aria-label="Exercise categories">'+Object.entries(categoryNames).map(([c,n])=>{const rows=l.questions.map((q,i)=>({q,i})).filter(x=>x.q.category===c);return btn(n+' '+rows.filter(x=>answers[x.i]!==undefined).length+'/'+rows.length,'rq-category-'+c,'aria-pressed="'+(readingCategory===c)+'"')}).join('')+'</nav>';
 out+=qs.slice(p*size,(p+1)*size).map(({q,i})=>questionMarkup(q,i,answers[i],'rq')).join('');
 out+='<div class="step-bottom">'+btn('Previous','rq-page-'+(p-1),p===0?'disabled':'')+'<span>Page '+(p+1)+'/'+Math.ceil(qs.length/size)+'</span>'+btn('Next','rq-page-'+(p+1),(p+1)*size>=qs.length?'disabled':'')+'</div>';
 if((p+1)*size>=qs.length&&readingCategory!=='grammar')out+=btn('Next → '+categoryNames[readingCategory==='content'?'vocabulary':'grammar'],'rq-category-'+(readingCategory==='content'?'vocabulary':'grammar'),'class="primary"');
 out+='<div class="actions">'+btn('Read again','read-stage-1')+btn('Reset all exercises','rq-reset')+btn(readingDone[l.id]?'Completed ✓':'Complete lesson','rq-complete','class="primary" '+(!all?'disabled':'')+' aria-pressed="'+Boolean(readingDone[l.id])+'"')+'</div>';
 if(readingDone[l.id]){const other=readings.find(x=>x.group===l.group&&x.id!==l.id);out+='<p>Lesson completed. '+btn('Open lesson '+other.part,'read-open-'+other.id)+'</p>'}
 return out+'</article>';
}
function readingView(){
 if(!selectedReading&&!readingLevel)return '<div class="page-heading"><small>READING PATH</small><h1>Choose your level</h1><p>Select A2, B1, B2 or C1 in the reading sidebar.</p></div><div class="level-cards">'+readingLevels.map(level=>btn('<strong>'+level+'</strong><span>'+readings.filter(l=>l.level===level).length+' readings</span>','read-level-'+level,'class="level-card"')).join('')+'</div>'+readingRoadmap();
 if(!selectedReading){const q=norm($('query').value.trim()),levelItems=readings.filter(l=>l.level===readingLevel);return '<div class="page-heading"><small>READING PATH</small><h1>'+readingLevel+' · Words through stories</h1><p>'+new Set(levelItems.map(l=>l.group)).size+' groups · '+levelItems.length+' readings · '+new Set(levelItems.flatMap(l=>l.targets.filter(t=>t.level===readingLevel).map(t=>t.rowIndex))).size+' target words</p></div>'+[...new Set(readings.filter(l=>l.level===readingLevel).map(l=>l.group))].map(group=>{const pair=readings.filter(l=>l.group===group);if(!pair.some(l=>norm(l.englishTitle+' '+l.title+' '+l.level+' '+l.targets.map(t=>t.word).join(' ')).includes(q)))return '';return '<article class="reading-group"><div class="group-heading"><span class="tag">'+pair[0].level+'</span><h2>Group '+String(readingGroupNumber(pair[0])).padStart(2,'0')+' · '+esc(pair[0].groupTitle)+'</h2><small>'+pair[0].targets.length+' words · 2 readings</small></div>'+pair.map(l=>'<div class="reading-row"><div><small>LESSON '+l.part+(readingDone[l.id]?' · COMPLETED':'')+'</small><h3>'+esc(l.englishTitle)+'</h3></div>'+btn(readingDone[l.id]?'Review':'Open','read-open-'+l.id,'class="primary"')+'</div>').join('')+'</article>'}).join('')+(!levelItems.length?'<article><h2>Coming later</h2><p>No readings published at this level yet.</p></article>':!levelItems.some(l=>norm(l.englishTitle+' '+l.title+' '+l.level+' '+l.targets.map(t=>t.word).join(' ')).includes(q))?'<article><p>No readings match this search.</p></article>':'')+readingRoadmap()}
 const l=currentReading(),stage=readingStage();
 const rPhoto=typeof readingPhotoCard==='function'?readingPhotoCard(l,false):'';
 const persistentPlayer=(typeof michaelReadingPlayer==='function'&&michaelReadingPlayer(l))||(typeof michaelWordBottomBar==='function'?michaelWordBottomBar():'');
 let out='<div class="page-heading"><small>'+l.level+' · GROUP '+String(readingGroupNumber(l)).padStart(2,'0')+' · LESSON '+l.part+'</small><h1>'+esc(l.englishTitle)+'</h1><p>'+esc(l.title)+'</p></div>'+rPhoto+'<nav class="study-steps" aria-label="Study steps">'+['Learn '+l.targets.length+' words','Read','Practice'].map((s,i)=>btn((i+1)+'. '+s,'read-stage-'+i,'aria-current="'+(stage===i?'step':'false')+'"')).join('')+'</nav>';
 if(stage===0){out+=persistentPlayer+'<article><h2>Learn the words</h2><p class="muted">Hai bài cùng nhóm dùng chung '+l.targets.length+' mục từ. Bấm vào từ để xem nghĩa, nghe và đánh dấu ôn tập.</p><div class="study-vocabulary">'+l.targets.map((t,i)=>{const vPhoto=typeof vocabPhotoCard==='function'?vocabPhotoCard(defaults[t.rowIndex],true,t.en):'';return '<section>'+vPhoto+'<div>'+btn(esc(t.word),'read-word-'+i,'class="vocab-name"')+'<small>'+esc(t.pos)+' · '+t.level+'</small>'+btn('♫','read-say-'+i,'class="small-audio" aria-label="Listen to '+esc(t.word)+'"')+'</div><p>'+esc(t.vi)+'</p><p lang="en" class="muted">'+esc(t.en||'English definition unavailable in the source.')+'</p>'+(typeof exampleExplanationReveal==='function'?exampleExplanationReveal(defaults[t.rowIndex]):'')+readingSenseNote(t)+'</section>'}).join('')+'</div></article><div class="step-bottom">'+btn('Next → Read','read-stage-1','class="primary"')+'</div>'}
 else if(stage===1){out+='<article class="reading-article"><div class="continuous-reading" lang="en">'+l.paragraphs.map((_,i)=>'<div class="reading-para-block">'+(typeof readingParagraphPhoto==='function'?readingParagraphPhoto(l,i):'')+'<p>'+readingMarkedParagraph(l,i)+'</p></div>').join('')+(typeof readingSceneGallery==='function'?readingSceneGallery(l):'')+'</div><details><summary>'+(/^(a2|b1|b2[sc]|c1[sc])-/.test(l.id)?'Vietnamese guide':'Vietnamese translation')+'</summary>'+l.paragraphs.map(p=>'<p>'+esc(p[1])+'</p>').join('')+'</details></article><details><summary>Grammar in this reading</summary>'+l.grammar.map(g=>'<p lang="en"><b>'+esc(g.example)+'</b></p><p>'+esc(g.note)+'</p>'+btn(esc(grammar.find(x=>x.id===g.id).englishTitle),'read-grammar-'+g.id)).join('')+'</details><details><summary>Sources & notes</summary><p>'+esc(l.note)+'</p><ul>'+l.sources.map(([n,url])=>'<li><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(n)+'</a></li>').join('')+'</ul></details><div class="step-bottom">'+btn('← Words','read-stage-0')+btn('Next → Practice ('+l.questions.length+')','read-stage-2','class="primary"')+'</div>'}
 else out+=persistentPlayer+readingExercises(l);return out;
}
function pagination(count){const pages=Math.max(1,Math.ceil(count/pageSize));return '<div class="sidebar-pagination"><label>Words per page <select id="page-size">'+pageSizes.map(n=>'<option '+(n===pageSize?'selected':'')+'>'+n+'</option>').join('')+'</select></label><form id="page-form"><label>Page <input id="page-number" type="number" min="1" max="'+pages+'" required value="'+(page+1)+'"></label><span> / '+pages+'</span><button type="submit">Go</button></form><div class="actions">'+btn('←','page-prev',page===0?'disabled aria-label="Previous page"':'aria-label="Previous page"')+btn('→','page-next',(page+1)*pageSize>=count?'disabled aria-label="Next page"':'aria-label="Next page"')+'</div></div>'}
function actions(r){return '<div class="actions">'+btn('♫ Listen (US)','us')+btn('Review','mark-review','aria-pressed="'+(state(r)==='review')+'"')+btn('Known','mark-known','aria-pressed="'+(state(r)==='known')+'"')+'</div>'}
function vocabularyQuizExplanation(){
 if(!quiz||quiz.pick===undefined)return '';
 const correct=quiz.choices.indexOf(quiz.r[quiz.field]);
 const explanations=quiz.choices.map((choice,i)=>{
  if(quiz.field==='level')return i===correct?'Mục từ này được xếp ở '+choice+' trong bộ dữ liệu đang học.':'Bộ dữ liệu xếp mục từ này ở '+quiz.r.level+', không phải '+choice+'. CEFR là phân loại trong nguồn, không suy ra chỉ từ cách viết.';
  if(i===correct)return 'Đây là nghĩa của “'+quiz.r.word+'” trong dữ liệu đang học'+(quiz.r.example?'. Ví dụ: '+quiz.r.example:'.');
  const other=data.find(r=>r[quiz.field]===choice&&norm(r.word)!==norm(quiz.r.word));
  return (other?'Định nghĩa này thuộc mục “'+other.word+'” trong nguồn. ':'Lựa chọn này không khớp nghĩa của mục đang hỏi trong nguồn. ')+'“'+quiz.r.word+'” ở đây được định nghĩa là: '+quiz.r[quiz.field]+'.';
 });
 return explanationMarkup({options:quiz.choices,answer:correct,explanations},quiz.pick);
}
function renderSecondary(){
 const box=$('secondary-items'),scroll=box.scrollTop;let out='';
 $('secondary-title').textContent=labels[mode];
 if(mode===4){const gs=matchingGrammar();out='<p class="nav-count">'+gs.length+' topics · '+grammar.filter(g=>grammarDone[g.id]).length+' learned</p>';let prev='';for(const g of gs){if(g.topic!==prev){prev=g.topic;out+='<h3 class="nav-group">'+esc(topicEnglish[g.topic]||g.topic)+'</h3>'}out+=btn(g.id+'. '+esc(g.englishTitle)+(grammarDone[g.id]?' ✓':''),'g-open-'+g.id,'class="secondary-link" aria-current="'+(g.id===selectedGrammar?'page':'false')+'" title="'+esc(g.title)+'"')}if(!gs.length)out+='<p>No topics found.</p>'}
 else if(mode===5){out=readingLevelButtons()}
 else if(mode===6){out=collocationLevelButtons()}
 else if(mode===0||mode===1){const rows=filtered();page=Math.min(page,Math.max(0,Math.ceil(rows.length/pageSize)-1));out='<p class="nav-count">'+rows.length.toLocaleString('en')+' words</p>'+pagination(rows.length)+rows.slice(page*pageSize,(page+1)*pageSize).map((r,i)=>btn(esc(r.word)+' <small>'+esc(r.pos)+' · '+r.level+'</small>'+(state(r)==='known'?' ✓':''),'entry-'+(page*pageSize+i),'class="secondary-link" aria-current="'+((mode===0?key(r)===selectedVocabKey:page*pageSize+i===card)?'page':'false')+'"')).join('')}
 else {out='<h3 class="nav-group">Levels</h3>'+['','A1','A2','B1','B2','C1'].map(l=>btn(l||'All levels','level-'+l,'class="secondary-link" aria-current="'+($('level').value===l?'page':'false')+'"')).join('')+'<p class="nav-help">'+(mode===2?'Choose a level, then practice in the main panel.':'Your progress is saved in this browser.')+'</p>'}
 box.innerHTML=out;box.scrollTop=scroll;
}
function render(){
 if(mode===5&&selectedReading){const active=readings.find(l=>l.id===selectedReading);if(active)readingLevel=active.level;}
 if(mode===6&&selectedCollocation){const active=collocations.find(g=>g.id===selectedCollocation);if(active)collocationLevel=active.level;}
 if([1,2,3].includes(mode)){legacyRender();if(mode===1){page=Math.floor(card/pageSize);if(!flipped&&typeof vocabPhotoCard==='function'){const r=filtered()[card];if(r)$('view').innerHTML=$('view').innerHTML.replace('<p></p>',vocabPhotoCard(r,true));}}if(mode===2){if(quiz?.r&&typeof vocabPhotoCard==='function')$('view').innerHTML=$('view').innerHTML.replace('</h2>','</h2>'+vocabPhotoCard(quiz.r,true));if(quiz?.pick!==undefined)$('view').innerHTML+=vocabularyQuizExplanation();}if(mode===3){const colDoneCount=Object.values(collocationDone).filter(Boolean).length;$('view').innerHTML=$('view').innerHTML.replace('</article>','<p>Collocations · '+colDoneCount+' / '+collocations.length+' active groups completed ('+collocationPlan.completedCollocations+' / '+collocationPlan.totalPlannedCollocations+' planned A2–C1 collocations)</p></article>');}if((mode===1||mode===2)&&typeof michaelWordBottomBar==='function')$('view').innerHTML+=michaelWordBottomBar();$('view').innerHTML=$('view').innerHTML.replaceAll('Thẻ ','Card ').replaceAll('mục đã thuộc','words learned').replaceAll('mục cần ôn','words to review').replaceAll('đã thuộc','learned').replaceAll('câu đúng','correct').replaceAll('Câu ','Question ').replaceAll('Nhớ lại nghĩa trước khi lật thẻ.','Recall the meaning before flipping the card.');}
 else{let out='';if(mode===4)out=(selectedReading?btn('← Return to reading','read-return'):'')+grammarView();else if(mode===5)out=readingView();else if(mode===6)out=collocationView();else{const rows=filtered();page=Math.min(page,Math.max(0,Math.ceil(rows.length/pageSize)-1));let index=rows.findIndex(r=>key(r)===selectedVocabKey);if(index<page*pageSize||index>=(page+1)*pageSize)index=page*pageSize;const r=rows[index];if(r){selectedVocabKey=key(r);out='<div class="page-heading"><small>VOCABULARY · '+(index+1)+'/'+rows.length+'</small><h1>'+esc(r.word)+'</h1></div><article data-row="'+index+'">'+details(r)+actions(r)+'</article><div class="step-bottom">'+btn('Previous word','entry-'+(index-1),index===0?'disabled':'')+btn('Next word','entry-'+(index+1),index+1>=rows.length?'disabled':'')+'</div>'+(typeof michaelWordBottomBar==='function'?michaelWordBottomBar():'')}else out='<article><h1>No words found</h1><p>Try another search or level.</p></article>'}$('view').innerHTML=out}
 $('tabs').innerHTML=labels.map((l,i)=>btn(l,'tab-'+i,'aria-pressed="'+(i===mode)+'"')).join('');
 $('query').hidden=false;$('level').hidden=mode>=4;$('review').parentElement.hidden=mode>=4;
 $('query').placeholder=mode===4?'Search grammar…':mode===5?'Search readings…':mode===6?'Search collocations…':'Search words…';
 $('query').setAttribute('aria-label',$('query').placeholder);
 $('source-panel').hidden=mode>=4;
 $('source').textContent=imported?'Using your imported CSV.':'Community vocabulary dataset: winterdl / GitHub. Missing fields are shown as unavailable.';
 renderSecondary();
 if(typeof schedulePhotoHydration==='function')schedulePhotoHydration();
}
function rerenderAnswer(index){const y=window.scrollY;render();const q=document.getElementById('question-'+index);if(q){q.setAttribute('tabindex','-1');q.focus({preventScroll:true})}window.scrollTo(0,y)}
function handleStudyAction(a){
 if(a.startsWith('col-level-')){const level=a.slice(10);if(readingLevels.includes(level)){collocationLevel=collocationLevel===level?null:level;selectedCollocation=null;mode=6;$('query').value='';render();$('secondary-items').scrollTop=0;window.scrollTo(0,0)}return true}
 if(a.startsWith('col-open-')){const id=a.slice(9),g=collocations.find(x=>x.id===id);if(g){selectedCollocation=g.id;collocationLevel=g.level;collocationStage=0;$('query').value='';render();closeMenu();window.scrollTo(0,0)}return true}
 if(a.startsWith('col-plan-')){const slug=a.slice(9),pg=collocationPlan.groups.find(x=>x.group===slug);if(pg){selectedCollocation=null;collocationLevel=pg.level;mode=6;render();closeMenu();const el=document.getElementById('plan-'+slug)||document.getElementById('collocation-roadmap-box');if(el){el.open=true;el.scrollIntoView?.()}}return true}
 if(a==='col-list'){selectedCollocation=null;render();window.scrollTo(0,0);return true}
 if(a.startsWith('col-stage-')){const s=Number(a.slice(10));if([0,1].includes(s)){collocationStage=s;render();window.scrollTo(0,0)}return true}
 if(a.startsWith('col-say-')){const g=currentCollocationGroup(),idx=Number(a.slice(8));if(g&&g.items[idx]){const r=defaults[g.items[idx].rowIndex];audio(r,'en-US');const lbl=document.querySelector?.('[data-bottom-word-label]');if(lbl)lbl.innerHTML=esc(r.word)+' <small>'+esc(r.pos||'')+' · '+esc(r.level||'')+(r.us?' · '+esc(r.us):'')+'</small>'}return true}
 if(a.startsWith('col-word-')){openCollocationWord(Number(a.slice(9)));return true}
 if(a==='col-audio'){const g=currentCollocationGroup();if(g&&g.items[activeCollocationWord]){audio(defaults[g.items[activeCollocationWord].rowIndex],'en-US');$('reading-word-status').textContent=$('audioStatus').textContent}return true}
 if(a==='col-known'||a==='col-review'){const g=currentCollocationGroup();if(g&&g.items[activeCollocationWord]){const r=defaults[g.items[activeCollocationWord].rowIndex],next=a.slice(4);if(state(r)===next)delete progress[key(r)];else progress[key(r)]=next;const saved=save('ox5-progress',progress);for(const b of $('reading-word-content').querySelectorAll('[data-action="col-known"],[data-action="col-review"]'))b.setAttribute('aria-pressed',String(state(r)===b.dataset.action.slice(4)));$('reading-word-status').textContent=saved?'Saved.':'Could not save progress.'}return true}
 if(a.startsWith('cq-')){const g=currentCollocationGroup();if(!g)return true;if(a.startsWith('cq-answer-')){const [i,pick]=a.slice(10).split('-').map(Number),q=g.questions[i];if(!q||!Number.isInteger(pick)||pick<0||pick>=q.options.length)return true;collocationAnswers[g.id]??={};if(collocationAnswers[g.id][i]!==undefined)return true;collocationAnswers[g.id][i]=pick;if(!save('ox5-collocation-answers-v1',collocationAnswers))$('audioStatus').textContent='Could not save progress.';rerenderAnswer(i)}else if(a.startsWith('cq-page-')){collocationPages[g.id]=Math.max(0,Math.min(Math.ceil(g.questions.length/5)-1,Number(a.slice(8))||0));render();window.scrollTo(0,0)}else if(a==='cq-reset'){collocationAnswers[g.id]={};collocationDone[g.id]=false;collocationPages[g.id]=0;save('ox5-collocation-answers-v1',collocationAnswers);save('ox5-collocation-done-v1',collocationDone);render()}else if(a==='cq-complete'){if(g.questions.every((_,i)=>collocationAnswers[g.id]?.[i]!==undefined)){collocationDone[g.id]=true;save('ox5-collocation-done-v1',collocationDone);render()}}return true}
 if(a.startsWith('read-level-')){const level=a.slice(11);if(readingLevels.includes(level)){readingLevel=readingLevel===level?null:level;selectedReading=null;mode=5;$('query').value='';render();$('secondary-items').scrollTop=0;window.scrollTo(0,0)}return true}
 if(a.startsWith('read-open-')){const l=readings.find(l=>l.id===a.slice(10));if(l)readingLevel=l.level;return false}
 if(a.startsWith('g-open-')){const id=Number(a.slice(7));if(grammar.some(g=>g.id===id)){rememberGrammar(id);render();closeMenu();window.scrollTo(0,0)}return true}
 if(a.startsWith('g-panel-')){grammarPanel=a.slice(8)==='practice'?'practice':'lesson';render();window.scrollTo(0,0);return true}
 if(a.startsWith('entry-')){const i=Number(a.slice(6)),rows=filtered();if(!Number.isInteger(i)||!rows[i])return true;page=Math.floor(i/pageSize);selectedVocabKey=key(rows[i]);if(mode===1){card=i;flipped=false}render();closeMenu();window.scrollTo(0,0);return true}
 if(a==='page-prev'||a==='page-next'){const max=Math.max(0,Math.ceil(filtered().length/pageSize)-1);page=Math.max(0,Math.min(max,page+(a==='page-prev'?-1:1)));selectedVocabKey=null;if(mode===1){card=page*pageSize;flipped=false}render();return true}
 if(a.startsWith('level-')){$('level').value=a.slice(6);resetFilter();return true}
 if(a.startsWith('read-grammar-')){const id=Number(a.slice(13));if(grammar.some(g=>g.id===id)){mode=4;rememberGrammar(id);$('query').value='';render();window.scrollTo(0,0)}return true}
 if(a.startsWith('gq-')){const qs=grammarQuiz[selectedGrammar];if(a.startsWith('gq-answer-')){const [i,pick]=a.slice(10).split('-').map(Number);if(!qs[i]||!Number.isInteger(pick)||pick<0||pick>=qs[i].options.length)return true;grammarAnswers[selectedGrammar]??={};if(grammarAnswers[selectedGrammar][i]!==undefined)return true;grammarAnswers[selectedGrammar][i]=pick;if(!save('ox5-grammar-answers-v1',grammarAnswers))$('audioStatus').textContent='Could not save progress.';rerenderAnswer(i)}else if(a.startsWith('gq-page-')){grammarPages[selectedGrammar]=Math.max(0,Math.min(Math.ceil(qs.length/5)-1,Number(a.slice(8))||0));render();window.scrollTo(0,0)}else if(a==='gq-reset'){grammarAnswers[selectedGrammar]={};grammarPages[selectedGrammar]=0;save('ox5-grammar-answers-v1',grammarAnswers);render()}return true}
 if(a.startsWith('rq-')){const l=currentReading();if(!l)return true;if(a.startsWith('rq-answer-')){const [i,pick]=a.slice(10).split('-').map(Number),q=l.questions[i];if(!q||!Number.isInteger(pick)||pick<0||pick>=q.options.length)return true;readingAnswers[l.id]??={};if(readingAnswers[l.id][i]!==undefined)return true;readingAnswers[l.id][i]=pick;if(!save('ox5-reading-answers-v3',readingAnswers))$('audioStatus').textContent='Could not save progress.';rerenderAnswer(i)}else if(a.startsWith('rq-category-')){const c=a.slice(12);if(categoryNames[c]){readingCategory=c;render();window.scrollTo(0,0)}}else if(a.startsWith('rq-page-')){const n=l.questions.filter(q=>q.category===readingCategory).length;readingPages[l.id+'-'+readingCategory]=Math.max(0,Math.min(Math.ceil(n/5)-1,Number(a.slice(8))||0));render();window.scrollTo(0,0)}else if(a==='rq-reset'){readingAnswers[l.id]={};readingDone[l.id]=false;readingCategory='content';for(const c of Object.keys(categoryNames))readingPages[l.id+'-'+c]=0;save('ox5-reading-answers-v3',readingAnswers);save('ox5-reading-done-v3',readingDone);render()}else if(a==='rq-complete'){if(l.questions.every((_,i)=>readingAnswers[l.id]?.[i]!==undefined)){readingDone[l.id]=true;save('ox5-reading-done-v3',readingDone);render()}}return true}
 return false;
}
function closeMenu(){$('sidebar').classList.remove('is-open');$('secondary').classList.remove('is-open');$('menu-shade').hidden=true;$('menu-toggle').setAttribute('aria-expanded','false');$('lessons-toggle').setAttribute('aria-expanded','false')}
function toggleMenu(id,button){const wasOpen=$(id).classList.contains('is-open');closeMenu();if(!wasOpen){$(id).classList.add('is-open');$('menu-shade').hidden=false;$(button).setAttribute('aria-expanded','true')}}
$('menu-toggle').onclick=()=>toggleMenu('sidebar','menu-toggle');$('lessons-toggle').onclick=()=>toggleMenu('secondary','lessons-toggle');$('menu-shade').onclick=closeMenu;
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
$('secondary-items').onclick=e=>{const a=e.target.closest('[data-action]')?.dataset.action;if(!a)return;if(handleStudyAction(a))return;if(handleReadingAction(a)){closeMenu();return}};
$('secondary-items').onchange=$('view').onchange;
$('secondary-items').onsubmit=e=>{if(e.target.id!=='page-form')return;e.preventDefault();const n=Number($('page-number').value),max=Math.ceil(filtered().length/pageSize);if(!Number.isInteger(n)||n<1||n>max){$('page-number').reportValidity();return}page=n-1;if(mode===1){card=page*pageSize;flipped=false}render();$('page-number').focus()};
$('reading-word-dialog').onclick=e=>{const a=e.target.closest?.('[data-action]')?.dataset.action||e.target.dataset?.action;if(!a)return;if(handleStudyAction(a))return;handleReadingAction(a)};

function readingRoadmap(){
 return '<details class="reading-roadmap"><summary>Course coverage · A2–C1 complete</summary><p>Nội dung A2, B1, B2 và C1 đã sẵn sàng; đây là độ bao phủ khóa học, không phải số bài bạn đã học xong. Mỗi nhóm có hai bài dùng chung bộ từ. Một số nhóm B1 ban đầu có thêm từ A2 để ôn tập. Bản hướng dẫn tiếng Việt tóm lược ý chính của các bài mới.</p>'+readingLevels.map(level=>{const ls=readings.filter(l=>l.level===level),covered=new Set(ls.flatMap(l=>l.targets.filter(t=>t.level===level).map(t=>t.rowIndex))),total=defaults.filter(r=>r.level===level).length,gs=new Set(ls.flatMap(l=>l.grammar.map(g=>g.id)));return '<p><b>'+level+'</b> · '+new Set(ls.map(l=>l.group)).size+' groups · '+ls.length+' readings · '+covered.size+'/'+total+' '+level+' entries · '+gs.size+' grammar topics · '+(covered.size===total&&total?'All '+level+' content ready':ls.length?'In progress':'Planned')+'</p>'}).join('')+'<p>Grammar across all readings: '+new Set(readings.flatMap(l=>l.grammar.map(g=>g.id))).size+'/120 topics. Mỗi mục B2–C1 mới được học trong hai bài cùng nhóm. Định nghĩa nguồn được giữ nguyên; ghi chú chỉ rõ khi nghĩa nguồn khác ngữ cảnh.</p></details>';
}

function readingSenseNote(t){return t.sourceSenseNote?'<p class="muted source-sense-note"><b>Source meaning note</b><br>'+esc(t.sourceSenseNote)+'</p>':''}
function openReadingWord(index){
 const l=currentReading(),t=l.targets[index],r=defaults[t.rowIndex];activeReadingWord=index;
 const photo=typeof vocabPhotoCard==='function'?vocabPhotoCard(r,false,t.en):'';
 $('reading-word-content').innerHTML='<h2 id="reading-word-title">'+esc(t.word)+'</h2>'+photo+'<p>'+esc(t.pos)+' · '+t.level+' · '+esc(r.us||'US pronunciation unavailable')+'</p><p><b>'+esc(t.vi)+'</b></p><p lang="en">'+esc(t.en||'English definition unavailable in the source.')+'</p>'+(typeof exampleExplanationReveal==='function'?exampleExplanationReveal(r):'')+readingSenseNote(t)+'<p class="muted">Nghĩa Việt theo ngữ cảnh do ứng dụng biên soạn. Định nghĩa English–English giữ nguyên từ nguồn.</p>'+btn('♫ Listen (US)','read-audio')+'<div class="actions">'+btn('Review','read-review','aria-pressed="'+(state(r)==='review')+'"')+btn('Known','read-known','aria-pressed="'+(state(r)==='known')+'"')+'</div><p id="reading-word-status" role="status"></p>';
 $('reading-word-dialog').showModal();
 if(typeof schedulePhotoHydration==='function')schedulePhotoHydration();
}

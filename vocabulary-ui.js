function soundIcon(){return '<svg class="headphone-icon" aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="12" width="5" height="9" rx="2"/><rect x="16" y="12" width="5" height="9" rx="2"/></svg>';}
const a1Vietnamese=JSON.parse(document.getElementById('a1-vietnamese').textContent);
const lessonMeanings=new Map();
const readingContextByKey=new Map();
const collocationContextByKey=new Map();

function extractSentenceAround(text,startIdx){
  if(!text)return '';
  const pos=Math.max(0,Math.min(text.length-1,Number(startIdx)||0));
  let s=pos,e=pos;
  while(s>0&&!/[.!?]/.test(text[s-1]))s--;
  while(e<text.length&&!/[.!?]/.test(text[e]))e++;
  if(e<text.length)e++;
  return text.slice(s,e).trim();
}

for(const lesson of readings){
  for(const target of lesson.targets){
    const row=defaults[target.rowIndex];
    if(!row)continue;
    const k=JSON.stringify([row.word,row.pos,row.level]);
    if(target.vi){
      const list=lessonMeanings.get(k)||[];
      if(!list.includes(target.vi))list.push(target.vi);
      lessonMeanings.set(k,list);
    }
    if(!readingContextByKey.has(k)){
      const pIdx=target.occurrence?.p??0;
      const para=lesson.paragraphs?.[pIdx]||lesson.paragraphs?.[0]||['',''];
      const enSent=extractSentenceAround(para[0],target.occurrence?.start??0);
      const enSentences=(para[0]||'').split(/(?<=[.!?])\s+/).filter(Boolean);
      const viSentences=(para[1]||'').split(/(?<=[.!?])\s+/).filter(Boolean);
      const sIdx=enSentences.findIndex(s=>s.includes(enSent.slice(0,Math.min(24,enSent.length))));
      const viSent=(sIdx>=0&&enSentences.length===viSentences.length&&viSentences[sIdx])?viSentences[sIdx]:(para[1]||'');
      readingContextByKey.set(k,{
        enSentence:enSent||row.example||'',
        viSentence:viSent,
        enDef:target.en||row.def||'',
        viMeaning:target.vi||'',
        lessonTitle:lesson.englishTitle||'',
        lessonTitleVi:lesson.title||'',
        senseNote:target.sourceSenseNote||''
      });
    }
  }
}

if(typeof collocations!=='undefined'&&Array.isArray(collocations)){
  for(const g of collocations){
    for(const it of (g.items||[])){
      const row=defaults[it.rowIndex];
      const k=row?JSON.stringify([row.word,row.pos,row.level]):JSON.stringify([it.word,it.pos,it.level]);
      if(!collocationContextByKey.has(k)){
        collocationContextByKey.set(k,it);
      }
    }
  }
}

function meaningReveal(text,note=''){
  return '<details class="meaning-reveal"><summary>Show Vietnamese meaning</summary><div lang="vi"><p>'+esc(text||'Chưa có nghĩa tiếng Việt cho mục từ này.')+'</p>'+(note?'<small>'+esc(note)+'</small>':'')+'</div></details>';
}

function vocabularyMeaning(r){
  if(!r)return {text:'',note:''};
  if(r.vi)return {text:r.vi,note:'Nghĩa từ dữ liệu nhập'};
  const lessons=lessonMeanings.get(JSON.stringify([r.word,r.pos,r.level]));
  if(lessons?.length)return {text:lessons.join(' • '),note:'Nghĩa theo ngữ cảnh bài đọc; có thể khác sắc thái của định nghĩa tiếng Anh phía trên.'};
  if(r.level==='A1'&&a1Vietnamese[r.word])return {text:a1Vietnamese[r.word],note:'Nghĩa thường gặp do ứng dụng biên soạn; chọn nghĩa phù hợp với từ loại và câu đang đọc.'};
  return {text:'',note:''};
}

function buildFallbackBilingualExample(r,vnMeaning){
  const w=r.word,pos=(r.pos||'').toLowerCase(),rawEx=(r.example||'').trim();
  const cleanEx=rawEx.includes(',')&&rawEx.split(',')[1]?.trim().length>12?rawEx.split(',').slice(1).join(',').trim():rawEx;
  const isFullSent=cleanEx.length>=18&&/^[A-Z‘'"]/.test(cleanEx)&&/[.!?]['"’]?$/.test(cleanEx);
  let enSent=isFullSent?cleanEx:'';
  if(!enSent){
    if(pos.includes('noun'))enSent=cleanEx?`In everyday life, people often use the phrase "${cleanEx}" when talking about ${w}.`:`We learned how the noun "${w}" is used in a clear sentence.`;
    else if(pos.includes('verb'))enSent=cleanEx?`You can ${cleanEx.replace(/^to\s+/i,'')} when the situation requires it.`:`Knowing how to ${w} properly is very helpful in daily communication.`;
    else if(pos.includes('adjective'))enSent=cleanEx?`That is a classic example of "${cleanEx}" in real life.`:`The situation became much more ${w} than anyone had expected.`;
    else if(pos.includes('adverb'))enSent=cleanEx?`In this context, we often say "${cleanEx}".`:`She spoke ${w} so that everyone in the room could understand her point.`;
    else enSent=cleanEx?`Notice how "${w}" is used in the expression "${cleanEx}".`:`The word "${w}" connects ideas clearly in this sentence.`;
  }
  const enExplain=`In this example, "${w}" (${r.pos}) means: ${r.def||'see usage in context above'}.`;
  const viExplain=vnMeaning
    ?`Từ "${w}" (${r.pos} · cấp độ ${r.level}) mang nghĩa tiếng Việt là "${vnMeaning}"${rawEx?` — cách kết hợp từ thường gặp: "${rawEx}"`:''}.${r.def?` Định nghĩa gốc giải thích đây là: ${r.def}.`:''}`
    :`Từ "${w}" (${r.pos} · cấp độ ${r.level})${rawEx?` thường dùng trong mẫu "${rawEx}"`:''}.`;
  const viSent=vnMeaning
    ?`Ví dụ minh họa cách dùng từ "${w}" (${vnMeaning}) trong ngữ cảnh câu hoàn chỉnh.`
    :`Ví dụ minh họa cách dùng từ "${w}" trong ngữ cảnh câu.`;
  return {enExample:enSent,enExplain,viExample:viSent,viExplain,enDef:r.def||''};
}

function vocabularyExampleInfo(r,meaningObj){
  if(!r)return {enExample:'',enExplain:'',viExample:'',viExplain:'',enDef:''};
  const k=JSON.stringify([r.word,r.pos,r.level]);
  const vn=meaningObj?.text||vocabularyMeaning(r).text||'';
  const col=collocationContextByKey.get(k);
  if(col){
    return {
      enExample:col.example,
      enExplain:`In this sentence, "${r.word}" (${r.pos}) is used in the collocation "${col.collocation}" (${col.pattern}), which means: ${col.en}.`,
      viExample:col.exampleVi,
      viExplain:`Từ "${r.word}" (${r.pos} · ${r.level}) mang nghĩa "${vn||col.vi}", đi trong cụm "${col.collocation}" (${col.vi}). ${col.note||''}`,
      enDef:r.def||col.en||''
    };
  }
  const rd=readingContextByKey.get(k);
  if(rd&&rd.enSentence){
    const rawEx=(r.example||'').trim();
    return {
      enExample:rd.enSentence,
      enExplain:`In this context (from "${rd.lessonTitle}"), "${r.word}" (${r.pos}) means: ${rd.enDef||r.def||'see definition above'}.${rawEx&&rawEx!==rd.enSentence?` Dictionary pattern: "${rawEx}".`:''}`,
      viExample:rd.viSentence||`Ngữ cảnh bài đọc "${rd.lessonTitleVi}": từ "${r.word}" mang nghĩa "${rd.viMeaning||vn}".`,
      viExplain:`Trong câu này, "${r.word}" (${r.pos} · ${r.level}) có nghĩa tiếng Việt là "${rd.viMeaning||vn}"${rawEx?` (mẫu từ điển: "${rawEx}")`:''}.${rd.senseNote?' '+rd.senseNote:''}`,
      enDef:r.def||rd.enDef||''
    };
  }
  return buildFallbackBilingualExample(r,vn);
}

function exampleExplanationReveal(r,exInfo){
  if(!r)return '';
  const info=exInfo||vocabularyExampleInfo(r);
  if(!info||!info.enExample)return '';
  return '<details class="meaning-reveal example-explain-reveal"><summary>Show example &amp; explanation (EN / VI)</summary><div>'
    +'<p lang="en"><b>Explanatory example (EN):</b> “'+esc(info.enExample)+'”<br><small>'+esc(info.enExplain)+'</small></p>'
    +'<p lang="vi"><b>Dịch nghĩa &amp; giải thích (VI):</b> “'+esc(info.viExample)+'”<br><small>'+esc(info.viExplain)+'</small></p>'
    +'</div></details>';
}

function vocabularyDetails(r){
  const meaning=vocabularyMeaning(r),photo=typeof vocabPhotoCard==='function'?vocabPhotoCard(r,false):'',exInfo=vocabularyExampleInfo(r,meaning);
  const primaryExample=(r.example&&r.example.trim())?r.example:exInfo.enExample;
  return photo
    +'<p><b>Pronunciation</b><br>US · '+esc(r.us||'Not available')+'</p>'
    +'<p><b>English definition</b><br>'+esc(r.def||exInfo.enDef||'Not available')+'</p>'
    +'<p><b>Example</b><br>'+esc(primaryExample||'Not available')+'</p>'
    +exampleExplanationReveal(r,exInfo)
    +meaningReveal(meaning.text,meaning.note);
}

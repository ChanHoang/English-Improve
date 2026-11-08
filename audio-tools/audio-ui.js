const michaelManifest=JSON.parse(document.getElementById('michael-audio-manifest').textContent);
let michaelWordPlayer=null;
const michaelAudioCache=new Map();
function michaelWordFile(r){
 if(!r)return null;
 return michaelManifest.words[JSON.stringify([r.word,r.pos||'',r.level])]||michaelManifest.words[JSON.stringify([r.word,r.pos||''])]||null;
}
function preloadMichaelSrc(src){
 if(!src||michaelAudioCache.has(src)||typeof Audio!=='function')return null;
 if(michaelAudioCache.size>=160){
  const oldest=michaelAudioCache.keys().next().value;
  michaelAudioCache.delete(oldest);
 }
 try{
  const a=new Audio(src);
  a.preload='auto';
  a.load?.();
  michaelAudioCache.set(src,a);
  return a;
 }catch{return null;}
}
function preloadMichaelWord(r){
 const file=michaelWordFile(r);
 if(file)preloadMichaelSrc(michaelManifest.base+file);
}
function warmActiveViewAudio(){
 try{
  if(mode===0){
   const rows=typeof filtered==='function'?filtered():[];
   const idx=rows.findIndex(r=>key(r)===selectedVocabKey);
   const start=Math.max(0,idx>=0?idx:page*pageSize);
   for(let i=start;i<Math.min(rows.length,start+6);i++)preloadMichaelWord(rows[i]);
  }else if(mode===1){
   const rows=typeof filtered==='function'?filtered():[];
   for(let i=card;i<Math.min(rows.length,card+4);i++)preloadMichaelWord(rows[i]);
  }else if(mode===2&&quiz?.r){
   preloadMichaelWord(quiz.r);
  }else if(mode===5&&typeof currentReading==='function'&&currentReading()){
   const l=currentReading();
   const rFile=michaelManifest.readings[l.id];
   if(rFile)preloadMichaelSrc(michaelManifest.base+rFile);
   l.targets.slice(0,12).forEach(t=>preloadMichaelWord(defaults[t.rowIndex]));
   if(typeof setTimeout==='function'){
    setTimeout(()=>{l.targets.slice(12).forEach(t=>preloadMichaelWord(defaults[t.rowIndex]));},60);
   }
  }else if(mode===6&&typeof currentCollocationGroup==='function'&&currentCollocationGroup()){
   const g=currentCollocationGroup();
   g.items.slice(0,12).forEach(it=>preloadMichaelWord(defaults[it.rowIndex]));
   if(typeof setTimeout==='function'){
    setTimeout(()=>{g.items.slice(12).forEach(it=>preloadMichaelWord(defaults[it.rowIndex]));},60);
   }
  }
 }catch{}
}
function stopMichaelAudio(){
 if(michaelWordPlayer){michaelWordPlayer.pause();michaelWordPlayer=null;}
 document.querySelectorAll('audio[data-michael-reading]').forEach(p=>p.pause());
}
function playMichaelWord(r){
 const file=michaelWordFile(r);
 if(!file)return false;
 stopMichaelAudio();window.speechSynthesis?.cancel();
 const src=michaelManifest.base+file;
 preloadMichaelSrc(src);
 const player=new Audio(src);
 player.preload='auto';
 michaelWordPlayer=player;lastSpokenWord=r;player.playbackRate=michaelSpeed;
 const status=text=>{if(michaelWordPlayer===player){$('audioStatus').textContent=text;const target=$('reading-word-status');if(target)target.textContent=text;}};
 status('');
 player.onplaying=()=>status('');
 player.onended=()=>status('');
 const failure=()=>status('Michael audio could not load. Check your connection and try again.');
 player.onerror=failure;player.play().catch(failure);return true;
}
document.addEventListener('play',e=>{
 if(!e.target.matches?.('audio[data-michael-reading]'))return;
 if(michaelWordPlayer){michaelWordPlayer.pause();michaelWordPlayer=null;}
 window.speechSynthesis?.cancel();
 document.querySelectorAll('audio[data-michael-reading]').forEach(p=>{if(p!==e.target)p.pause()});
 e.target.closest('.michael-player').querySelector('.michael-error').textContent='';
},true);
document.addEventListener('error',e=>{
 if(e.target.matches?.('audio[data-michael-reading]'))e.target.closest('.michael-player').querySelector('.michael-error').textContent='Audio could not load. Check your connection and try again.';
},true);
for(const ev of ['pointerover','pointerdown','touchstart','focusin']){
 document.addEventListener(ev,e=>{
  const btnEl=e.target.closest?.('[data-action]');
  if(!btnEl)return;
  const a=btnEl.dataset.action||'';
  if(a==='us'&&typeof contextWord==='function')preloadMichaelWord(contextWord());
  else if(a.startsWith('read-say-')||a.startsWith('read-word-')){
   const idx=Number(a.replace(/^read-(say|word)-/,''));
   const l=typeof currentReading==='function'?currentReading():null;
   if(l?.targets?.[idx])preloadMichaelWord(defaults[l.targets[idx].rowIndex]);
  }else if(a.startsWith('col-say-')||a.startsWith('col-word-')){
   const idx=Number(a.replace(/^col-(say|word)-/,''));
   const g=typeof currentCollocationGroup==='function'?currentCollocationGroup():null;
   if(g?.items?.[idx])preloadMichaelWord(defaults[g.items[idx].rowIndex]);
  }
 },{passive:true});
}

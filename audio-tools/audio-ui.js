const michaelManifest=JSON.parse(document.getElementById('michael-audio-manifest').textContent);
let michaelWordPlayer=null;
function stopMichaelAudio(){
 if(michaelWordPlayer){michaelWordPlayer.pause();michaelWordPlayer=null;}
 document.querySelectorAll('audio[data-michael-reading]').forEach(p=>p.pause());
}
function playMichaelWord(r){
 const file=michaelManifest.words[JSON.stringify([r.word,r.pos||'',r.level])]||michaelManifest.words[JSON.stringify([r.word,r.pos||''])];
 if(!file)return false;
 stopMichaelAudio();window.speechSynthesis?.cancel();
 const player=new Audio(michaelManifest.base+file);michaelWordPlayer=player;lastSpokenWord=r;player.playbackRate=michaelSpeed;
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

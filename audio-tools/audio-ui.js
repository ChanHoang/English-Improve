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
 status('Loading Michael (US)…');
 player.onplaying=()=>status('Michael (US) · Kokoro AI-generated audio');
 player.onended=()=>status('Michael (US) · Finished');
 const failure=()=>status('Michael audio could not load. Check your connection and try again.');
 player.onerror=failure;player.play().catch(failure);return true;
}
function michaelReadingPlayer(l){
 const file=michaelManifest.readings[l.id];if(!file)return '';
 return '<section class="michael-player" aria-label="Reading audio"><p><b>Listen · Michael (US)</b><br><small>Kokoro AI-generated audio</small></p><audio controls preload="none" data-michael-reading="'+esc(l.id)+'" aria-label="Listen to '+esc(l.englishTitle)+'" src="'+esc(michaelManifest.base+file)+'"></audio><label>Speed <select data-michael-speed aria-label="Reading playback speed"><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option></select></label><p class="michael-error" role="status"></p></section>';
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

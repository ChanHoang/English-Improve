let lastSpokenWord=null,michaelSpeed=read('ox5-audio-speed',1);
const michaelSpeeds=[0.5,0.75,1,1.25,1.5,1.75,2];
if(!michaelSpeeds.includes(michaelSpeed))michaelSpeed=1;
function audioMessage(text){$('audioStatus').textContent=text;const target=$('reading-word-status');if(target)target.textContent=text;}
function michaelSpeedControl(){return '<label class="audio-speed-label">Speed <select data-michael-speed aria-label="Playback speed">'+michaelSpeeds.map(s=>'<option value="'+s+'"'+(s===michaelSpeed?' selected':'')+'>'+s+'×</option>').join('')+'</select></label>';}
function michaelWordTools(){return '<span class="word-audio-tools">'+michaelSpeedControl()+'</span>';}
function michaelReadingPlayer(l){
 const file=michaelManifest.readings[l.id];if(!file)return '';
 return '<section class="michael-player compact-player" aria-label="Reading audio"><audio preload="metadata" data-michael-reading="'+esc(l.id)+'" src="'+esc(michaelManifest.base+file)+'"></audio><div class="compact-audio-row"><button type="button" data-audio-command="replay" aria-label="Replay reading" title="Replay">'+soundIcon()+'</button><button type="button" data-audio-command="play" aria-label="Play reading" title="Alt+P">▶</button><input type="range" min="0" max="0" value="0" step="0.1" disabled data-audio-seek aria-label="Reading audio position"><span class="audio-clock"><span data-audio-current>0:00</span> / <span data-audio-duration>--:--</span></span>'+michaelSpeedControl()+'</div><p class="michael-error" role="status"></p></section>';
}
function michaelWordBottomBar(){
 const r=contextWord();
 const label=r?(esc(r.word)+' <small>'+esc(r.pos||'')+' · '+esc(r.level||'')+(r.us?' · '+esc(r.us):'')+'</small>'):'Select or click any word to listen (US)';
 return '<section class="michael-player compact-player word-bottom-player" aria-label="Word audio controls"><div class="compact-audio-row"><button type="button" data-audio-command="replay" aria-label="Play pronunciation" title="Play / Replay">'+soundIcon()+'</button><button type="button" data-audio-command="play" aria-label="Play or pause word audio" title="Alt+P">▶</button><span class="bottom-word-label" data-bottom-word-label>'+label+'</span>'+michaelSpeedControl()+'</div><p class="michael-error" role="status"></p></section>';
}
function syncPlayback(p){const b=p.closest('.michael-player').querySelector('[data-audio-command="play"]');b.textContent=p.paused?'▶':'Ⅱ';b.setAttribute('aria-label',p.paused?'Play reading':'Pause reading');}
function timeLabel(seconds){seconds=Math.max(0,Math.floor(seconds||0));return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');}
function readingAudio(){return document.querySelector('audio[data-michael-reading]');}
function setMichaelSpeed(speed){
 if(!michaelSpeeds.includes(speed))return;michaelSpeed=speed;save('ox5-audio-speed',speed);if(michaelWordPlayer)michaelWordPlayer.playbackRate=speed;
 document.querySelectorAll('audio[data-michael-reading]').forEach(p=>p.playbackRate=speed);document.querySelectorAll('[data-michael-speed]').forEach(s=>s.value=String(speed));audioMessage('');
}
function contextWord(){
 if($('reading-word-dialog')?.open&&typeof currentCollocationGroup==='function'&&mode===6&&currentCollocationGroup()&&activeCollocationWord!==null)return defaults[currentCollocationGroup().items[activeCollocationWord].rowIndex];
 if($('reading-word-dialog')?.open&&currentReading())return defaults[currentReading().targets[activeReadingWord].rowIndex];
 if(mode===0)return data.find(r=>key(r)===selectedVocabKey);if(mode===1)return filtered()[card];if(mode===2)return quiz?.r;
 if(mode===5&&currentReading()&&readingStage()===0){const ts=currentReading().targets.map(t=>defaults[t.rowIndex]);return ts.find(r=>lastSpokenWord&&key(r)===key(lastSpokenWord))||ts[0];}
 if(mode===6&&typeof currentCollocationGroup==='function'&&currentCollocationGroup()){const ts=currentCollocationGroup().items.map(t=>defaults[t.rowIndex]);return ts.find(r=>lastSpokenWord&&key(r)===key(lastSpokenWord))||ts[0];}
 return lastSpokenWord;
}
function audioCommand(command){
 const p=$('reading-word-dialog')?.open?null:readingAudio();
 if(command==='slower'||command==='faster'){const i=michaelSpeeds.indexOf(michaelSpeed);setMichaelSpeed(michaelSpeeds[Math.max(0,Math.min(michaelSpeeds.length-1,i+(command==='faster'?1:-1)))]);return true;}
 if(command==='replay'||command==='play'){
  if(p){if(command==='replay')p.currentTime=0;if(command==='play'&&!p.paused){p.pause();return true;}p.play().catch(()=>audioMessage('Audio could not play. Check your connection and try again.'));return true;}
  if(command==='play'&&michaelWordPlayer){if(!michaelWordPlayer.paused){michaelWordPlayer.pause();return true;}if(!michaelWordPlayer.ended){michaelWordPlayer.play().catch(()=>audioMessage('Press Listen to try again.'));return true;}}const r=contextWord();if(r){audio(r,'en-US');return true;}return false;
 }
 return false;
}
document.addEventListener('play',e=>{if(e.target.matches?.('audio[data-michael-reading]')){e.target.playbackRate=michaelSpeed;syncPlayback(e.target);}},true);
document.addEventListener('loadedmetadata',e=>{
 const p=e.target;if(!p.matches?.('audio[data-michael-reading]'))return;const box=p.closest('.michael-player'),seek=box.querySelector('[data-audio-seek]');seek.disabled=false;seek.max=p.duration;box.querySelector('[data-audio-duration]').textContent=timeLabel(p.duration);p.playbackRate=michaelSpeed;
},true);
let activeSeekInput=null;
function seekFromPointer(seek,e){
 if(!seek||seek.disabled||typeof seek.getBoundingClientRect!=='function')return;
 const rect=seek.getBoundingClientRect();if(!rect||!rect.width)return;
 const thumbHalf=8,usable=Math.max(1,rect.width-thumbHalf*2);
 const ratio=Math.max(0,Math.min(1,(e.clientX-rect.left-thumbHalf)/usable));
 const box=seek.closest?.('.michael-player'),p=box?.querySelector?.('audio');
 const max=Number(seek.max)||(p?.duration)||0;if(!max)return;
 const next=ratio*max;seek.value=next;
 if(p)p.currentTime=next;
 const cur=box?.querySelector?.('[data-audio-current]');if(cur)cur.textContent=timeLabel(next);
}
document.addEventListener('pointerdown',e=>{
 const seek=e.target?.closest?.('[data-audio-seek]');if(!seek||seek.disabled)return;
 activeSeekInput=seek;seek.setPointerCapture?.(e.pointerId);seekFromPointer(seek,e);
});
document.addEventListener('pointermove',e=>{if(activeSeekInput)seekFromPointer(activeSeekInput,e);});
document.addEventListener('pointerup',()=>{activeSeekInput=null;});
document.addEventListener('pointercancel',()=>{activeSeekInput=null;});
document.addEventListener('timeupdate',e=>{
 const p=e.target;if(!p.matches?.('audio[data-michael-reading]')||activeSeekInput)return;
 const box=p.closest('.michael-player');box.querySelector('[data-audio-seek]').value=p.currentTime;box.querySelector('[data-audio-current]').textContent=timeLabel(p.currentTime);
},true);
for(const event of ['pause','ended'])document.addEventListener(event,e=>{if(e.target.matches?.('audio[data-michael-reading]'))syncPlayback(e.target);},true);
document.addEventListener('input',e=>{if(e.target.matches?.('[data-audio-seek]')){const box=e.target.closest('.michael-player'),p=box.querySelector('audio');p.currentTime=Number(e.target.value);box.querySelector('[data-audio-current]').textContent=timeLabel(p.currentTime);}});
document.addEventListener('change',e=>{
 if(e.target.matches?.('[data-michael-speed]'))setMichaelSpeed(Number(e.target.value));
});
document.addEventListener('click',e=>{const button=e.target.closest?.('[data-audio-command]');if(button)audioCommand(button.dataset.audioCommand);});
const replayChoices={'alt-r':'Alt+R',r:'R',space:'Space',none:'Off'};
let replayShortcut=read('ox5-replay-shortcut','alt-r');if(!Object.hasOwn(replayChoices,replayShortcut))replayShortcut='alt-r';
function setReplayShortcut(value){if(!Object.hasOwn(replayChoices,value))return;replayShortcut=value;save('ox5-replay-shortcut',value);}
document.addEventListener('keydown',e=>{
 if(e.ctrlKey||e.metaKey||e.shiftKey||e.isComposing||e.repeat||e.target.isContentEditable||e.target.closest?.('input,textarea,select,[contenteditable],[role="textbox"]'))return;
 if($('settings-dialog')?.open||$('info-dialog')?.open)return;
 const replay=(replayShortcut==='alt-r'&&e.altKey&&e.code==='KeyR')||(replayShortcut==='r'&&!e.altKey&&e.code==='KeyR')||(replayShortcut==='space'&&!e.altKey&&e.code==='Space'&&!e.target.closest?.('button,a,summary'));
 const command=replay?'replay':e.altKey?{KeyP:'play',Minus:'slower',Equal:'faster'}[e.code]:null;if(command&&audioCommand(command))e.preventDefault();
});
function updateThemeButton(){const dark=document.documentElement.dataset.theme==='dark';$('theme-toggle').textContent=dark?'☀ Light':'☾ Dark';$('theme-toggle').setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');$('theme-toggle').setAttribute('aria-pressed',String(dark));}
$('theme-toggle').onclick=()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';save('ox5-theme',document.documentElement.dataset.theme);updateThemeButton();};updateThemeButton();

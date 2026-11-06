let lastSpokenWord=null,michaelSpeed=read('ox5-audio-speed',1);
const michaelSpeeds=[0.5,0.75,1,1.25,1.5,1.75,2];
if(!michaelSpeeds.includes(michaelSpeed))michaelSpeed=1;
const savedMichaelLoops=read('ox5-audio-loops',{});
const michaelLoops=savedMichaelLoops&&typeof savedMichaelLoops==='object'&&!Array.isArray(savedMichaelLoops)?savedMichaelLoops:{};
function audioMessage(text){$('audioStatus').textContent=text;const target=$('reading-word-status');if(target)target.textContent=text;}
function michaelSpeedControl(){return '<label class="audio-speed-label">Speed <select data-michael-speed aria-label="Playback speed">'+michaelSpeeds.map(s=>'<option value="'+s+'"'+(s===michaelSpeed?' selected':'')+'>'+s+'×</option>').join('')+'</select></label>';}
function michaelWordTools(){return '<span class="word-audio-tools">'+michaelSpeedControl()+'<button type="button" data-audio-command="replay" title="Alt+R">↻ Replay</button><small>Alt+R: replay · Alt+−/=: speed</small></span>';}
function michaelReadingPlayer(l){
 const file=michaelManifest.readings[l.id];if(!file)return '';
 return '<section class="michael-player" aria-label="Reading audio"><p><b>Listen · Michael (US)</b><br><small>Kokoro AI-generated audio</small></p><audio controls preload="none" data-michael-reading="'+esc(l.id)+'" aria-label="Listen to '+esc(l.englishTitle)+'" src="'+esc(michaelManifest.base+file)+'"></audio><div class="audio-timeline"><input type="range" min="0" max="0" value="0" step="0.1" disabled data-audio-seek aria-label="Reading audio position"><div><span data-audio-current>0:00</span><span data-audio-duration>Load audio to seek</span></div></div><div class="audio-controls"><button type="button" data-audio-command="replay" title="Alt+R">↻ Replay</button>'+michaelSpeedControl()+'</div><div class="audio-loop"><b>Repeat a section</b><p class="muted">Play or seek, then set A (start) and B (end).</p><div class="audio-controls"><button type="button" data-audio-command="set-a" title="Alt+A">Set A</button><label>A <input type="number" min="0" step="0.1" value="0" data-loop-start aria-label="Loop start in seconds"> s</label><button type="button" data-audio-command="set-b" title="Alt+B">Set B</button><label>B <input type="number" min="0" step="0.1" data-loop-end aria-label="Loop end in seconds"> s</label><button type="button" data-audio-command="loop" aria-pressed="false" title="Alt+L">Loop A–B: Off</button><button type="button" data-audio-command="clear-loop">Clear</button></div><p data-loop-status role="status">Set two points to repeat a section.</p></div><details class="audio-shortcuts"><summary>Keyboard shortcuts</summary><p><kbd>Alt+P</kbd> Play/pause · <kbd>Alt+R</kbd> Replay · <kbd>Alt+−</kbd> Slower · <kbd>Alt+=</kbd> Faster<br><kbd>Alt+A</kbd> Set start · <kbd>Alt+B</kbd> Set end · <kbd>Alt+L</kbd> Loop on/off</p><small>Shortcuts are inactive while typing. All actions also have touch controls.</small></details><p class="michael-error" role="status"></p></section>';
}
function timeLabel(seconds){seconds=Math.max(0,Math.floor(seconds||0));return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');}
function readingAudio(){return document.querySelector('audio[data-michael-reading]');}
function loopFor(p){return michaelLoops[p.dataset.michaelReading]||{start:0,end:0,enabled:false};}
function validLoop(loop,p){return Number.isFinite(loop.start)&&Number.isFinite(loop.end)&&loop.start>=0&&loop.end>loop.start+.2&&Number.isFinite(p.duration)&&loop.end<=p.duration;}
function syncLoop(p){
 const box=p.closest('.michael-player'),loop=loopFor(p),valid=validLoop(loop,p);if(!valid)loop.enabled=false;
 box.querySelector('[data-loop-start]').value=Math.round(loop.start*10)/10;box.querySelector('[data-loop-end]').value=loop.end?Math.round(loop.end*10)/10:'';
 const button=box.querySelector('[data-audio-command="loop"]');button.textContent='Loop A–B: '+(loop.enabled?'On':'Off');button.setAttribute('aria-pressed',String(loop.enabled));
 box.querySelector('[data-loop-status]').textContent=valid?'A '+timeLabel(loop.start)+' → B '+timeLabel(loop.end)+(loop.enabled?' · Repeating':' · Ready to repeat'):'Choose B after A, within the recording (at least 0.2 seconds apart).';
}
function saveLoop(p,loop){michaelLoops[p.dataset.michaelReading]=loop;syncLoop(p);save('ox5-audio-loops',michaelLoops);}
function setMichaelSpeed(speed){
 if(!michaelSpeeds.includes(speed))return;michaelSpeed=speed;save('ox5-audio-speed',speed);if(michaelWordPlayer)michaelWordPlayer.playbackRate=speed;
 document.querySelectorAll('audio[data-michael-reading]').forEach(p=>p.playbackRate=speed);document.querySelectorAll('[data-michael-speed]').forEach(s=>s.value=String(speed));audioMessage('Playback speed: '+speed+'×');
}
function contextWord(){
 if($('reading-word-dialog')?.open&&currentReading())return defaults[currentReading().targets[activeReadingWord].rowIndex];
 if(mode===0)return data.find(r=>key(r)===selectedVocabKey);if(mode===1)return filtered()[card];if(mode===2)return quiz?.r;
 if(mode===5&&currentReading()&&readingStage()===0){const ts=currentReading().targets.map(t=>defaults[t.rowIndex]);return ts.find(r=>lastSpokenWord&&key(r)===key(lastSpokenWord))||ts[0];}return lastSpokenWord;
}
function audioCommand(command){
 const p=$('reading-word-dialog')?.open?null:readingAudio();
 if(command==='slower'||command==='faster'){const i=michaelSpeeds.indexOf(michaelSpeed);setMichaelSpeed(michaelSpeeds[Math.max(0,Math.min(michaelSpeeds.length-1,i+(command==='faster'?1:-1)))]);return true;}
 if(command==='replay'||command==='play'){
  if(p){const loop=loopFor(p);if(command==='replay')p.currentTime=loop.enabled&&validLoop(loop,p)?loop.start:0;if(command==='play'&&!p.paused){p.pause();return true;}p.play().catch(()=>audioMessage('Audio could not play. Check your connection and try again.'));return true;}
  if(command==='play'&&michaelWordPlayer){if(!michaelWordPlayer.paused){michaelWordPlayer.pause();return true;}if(!michaelWordPlayer.ended){michaelWordPlayer.play().catch(()=>audioMessage('Press Listen to try again.'));return true;}}const r=contextWord();if(r){audio(r,'en-US');return true;}return false;
 }
 if(!p||!Number.isFinite(p.duration)){audioMessage('Play the reading once to load its timeline.');return false;}
 const loop={...loopFor(p)};
 if(command==='set-a')loop.start=Math.round(p.currentTime*10)/10;else if(command==='set-b')loop.end=Math.min(p.duration,Math.round(p.currentTime*10)/10);
 else if(command==='clear-loop'){loop.start=0;loop.end=0;loop.enabled=false;}
 else if(command==='loop'){if(!validLoop(loop,p)){syncLoop(p);return true;}loop.enabled=!loop.enabled;if(loop.enabled){p.currentTime=loop.start;p.play().catch(()=>audioMessage('Press Play to repeat this section.'));}}
 else return false;saveLoop(p,loop);return true;
}
document.addEventListener('play',e=>{if(e.target.matches?.('audio[data-michael-reading]'))e.target.playbackRate=michaelSpeed;},true);
document.addEventListener('loadedmetadata',e=>{
 const p=e.target;if(!p.matches?.('audio[data-michael-reading]'))return;const box=p.closest('.michael-player'),seek=box.querySelector('[data-audio-seek]');seek.disabled=false;seek.max=p.duration;box.querySelector('[data-audio-duration]').textContent=timeLabel(p.duration);p.playbackRate=michaelSpeed;syncLoop(p);
},true);
document.addEventListener('timeupdate',e=>{
 const p=e.target;if(!p.matches?.('audio[data-michael-reading]'))return;const loop=loopFor(p);if(!p.paused&&loop.enabled&&validLoop(loop,p)&&(p.currentTime>=loop.end||p.currentTime<loop.start))p.currentTime=loop.start;
 const box=p.closest('.michael-player');box.querySelector('[data-audio-seek]').value=p.currentTime;box.querySelector('[data-audio-current]').textContent=timeLabel(p.currentTime);
},true);
document.addEventListener('ended',e=>{const p=e.target;if(p.matches?.('audio[data-michael-reading]')){const loop=loopFor(p);if(loop.enabled&&validLoop(loop,p)){p.currentTime=loop.start;p.play().catch(()=>{})}}},true);
document.addEventListener('input',e=>{if(e.target.matches?.('[data-audio-seek]'))e.target.closest('.michael-player').querySelector('audio').currentTime=Number(e.target.value);});
document.addEventListener('change',e=>{
 if(e.target.matches?.('[data-michael-speed]'))setMichaelSpeed(Number(e.target.value));
 if(e.target.matches?.('[data-loop-start],[data-loop-end]')){const p=e.target.closest('.michael-player').querySelector('audio'),loop={...loopFor(p)};loop[e.target.matches('[data-loop-start]')?'start':'end']=Number(e.target.value);saveLoop(p,loop);}
});
document.addEventListener('click',e=>{const button=e.target.closest?.('[data-audio-command]');if(button)audioCommand(button.dataset.audioCommand);});
document.addEventListener('keydown',e=>{
 if(!e.altKey||e.ctrlKey||e.metaKey||e.isComposing||e.repeat||e.target.isContentEditable||e.target.closest?.('input,textarea,select,[contenteditable],[role="textbox"]'))return;
 const command={KeyP:'play',KeyR:'replay',Minus:'slower',Equal:'faster',KeyA:'set-a',KeyB:'set-b',KeyL:'loop'}[e.code];if(command&&audioCommand(command))e.preventDefault();
});
function updateThemeButton(){const dark=document.documentElement.dataset.theme==='dark';$('theme-toggle').textContent=dark?'☀ Light':'☾ Dark';$('theme-toggle').setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');$('theme-toggle').setAttribute('aria-pressed',String(dark));}
$('theme-toggle').onclick=()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';save('ox5-theme',document.documentElement.dataset.theme);updateThemeButton();};updateThemeButton();

const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const manifest=require('./audio/a2-michael/manifest.json'),store=new Map(),events={};
const nodes=new Map();function element(){return {textContent:'',value:'',open:false,dataset:{},setAttribute(k,v){this[k]=v}}}function node(id){if(!nodes.has(id))nodes.set(id,element());return nodes.get(id)}
node('michael-audio-manifest').textContent=JSON.stringify(manifest);
let activeReading=null;const media=[];
class Audio {constructor(src){this.src=src;this.paused=true;this.ended=false;media.push(this)}pause(){this.paused=true}play(){this.paused=false;return Promise.resolve()}}
const doc={getElementById:node,querySelector:()=>activeReading,querySelectorAll:s=>s.startsWith('audio')?(activeReading?[activeReading]:[]):[],documentElement:{dataset:{theme:'light'}},addEventListener:(event,fn)=>{(events[event]??=[]).push(fn)}};
const c={document:doc,Audio,window:{speechSynthesis:{cancel(){}}},$:node,esc:s=>String(s),read:(k,d)=>store.has(k)?store.get(k):d,save:(k,v)=>{store.set(k,v);return true},mode:0,data:[{word:'ability',pos:'noun',level:'A2'}],selectedVocabKey:'ability',key:r=>r.word,currentReading:()=>null,soundIcon:()=>'<svg></svg>'};
vm.createContext(c);vm.runInContext(fs.readFileSync(__dirname+'/audio-tools/audio-ui.js','utf8')+'\n'+fs.readFileSync(__dirname+'/audio-tools/audio-controls.js','utf8'),c);
c.audio=(r)=>vm.runInContext('playMichaelWord('+JSON.stringify(r)+')',c);
const run=s=>vm.runInContext(s,c),fire=(event,e)=>{for(const fn of events[event]||[])fn(e)};
assert(run('playMichaelWord(data[0])'));const first=media.at(-1);run('setMichaelSpeed(1.25)');assert.equal(first.playbackRate,1.25);assert.equal(store.get('ox5-audio-speed'),1.25);
run('audioCommand("replay")');assert(first.paused);assert.equal(media.at(-1).playbackRate,1.25);assert.notEqual(first,media.at(-1));run('audioCommand("play")');assert(media.at(-1).paused);run('audioCommand("play")');assert(!media.at(-1).paused);
const boxNodes=new Map();const box={querySelector:s=>{if(!boxNodes.has(s))boxNodes.set(s,element());return boxNodes.get(s)}};
const p={dataset:{michaelReading:'wright'},duration:100,currentTime:20,paused:false,playbackRate:1,playCount:0,matches:()=>true,closest:()=>box,pause(){this.paused=true},play(){this.paused=false;this.playCount++;return Promise.resolve()}};activeReading=p;
fire('loadedmetadata',{target:p});assert.equal(box.querySelector('[data-audio-seek]').max,100);assert.equal(p.playbackRate,1.25);
p.currentTime=33;fire('timeupdate',{target:p});assert.equal(p.currentTime,33,'no automatic looping');assert.equal(box.querySelector('[data-audio-current]').textContent,'0:33');
assert.equal(run('audioCommand("loop")'),false);assert.equal(run('audioCommand("set-a")'),false);p.paused=true;fire('ended',{target:p});assert(p.paused,'ending does not repeat');
let prevented=0;p.currentTime=45;
fire('keydown',{altKey:true,code:'KeyR',target:{closest:()=>true},preventDefault(){prevented++}});assert.equal(p.currentTime,45,'typing cannot trigger replay');assert.equal(prevented,0);
fire('keydown',{altKey:true,code:'KeyR',target:{closest:()=>null},preventDefault(){prevented++}});assert.equal(p.currentTime,0);assert.equal(prevented,1);
fire('keydown',{altKey:true,code:'Minus',target:{closest:()=>null},preventDefault(){}});assert.equal(p.playbackRate,1);for(let i=0;i<20;i++)run('audioCommand("slower")');assert.equal(p.playbackRate,.5);for(let i=0;i<20;i++)run('audioCommand("faster")');assert.equal(p.playbackRate,2);
node('theme-toggle').onclick();assert.equal(doc.documentElement.dataset.theme,'dark');assert.equal(store.get('ox5-theme'),'dark');assert.equal(node('theme-toggle')['aria-pressed'],'true');node('theme-toggle').onclick();assert.equal(doc.documentElement.dataset.theme,'light');
run('stopMichaelAudio()');assert(p.paused);
const html=fs.readFileSync(__dirname+'/index.html','utf8');assert(html.includes('id="theme-toggle"'));assert(html.includes('prefers-color-scheme'));assert(html.includes('data-theme=dark'));assert(html.includes('data-audio-seek'));
console.log('PASS audio controls: replay, pause/resume, speed limits and persistence, single timeline without looping, safe shortcuts, stop on navigation, and saved light/dark theme.');

const markup=run('michaelReadingPlayer({id:"wright",englishTitle:"Wright"})');assert.equal((markup.match(/data-audio-seek/g)||[]).length,1);assert(!markup.includes('audio controls'));assert(!markup.includes('data-loop'));assert(markup.includes('compact-player'));

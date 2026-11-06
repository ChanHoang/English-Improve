const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const {createRequire}=require('module');
const {KokoroTTS}=require('kokoro-js');
const kr=createRequire(require.resolve('kokoro-js'));
const {env}=kr('@huggingface/transformers');
const {StyleTextToSpeech2Model,AutoTokenizer}=kr('@huggingface/transformers');
const {spawnSync}=require('child_process'),ffmpeg=require('ffmpeg-static');
env.cacheDir=path.resolve(__dirname,'model-cache');
const lameContext={};vm.createContext(lameContext);
vm.runInContext(fs.readFileSync(path.join(path.dirname(require.resolve('lamejs/package.json')),'lame.all.js'),'utf8'),lameContext);
const repo=path.resolve(__dirname,'..'),out=path.join(repo,'audio/a2-michael');
fs.mkdirSync(out,{recursive:true});
const html=fs.readFileSync(path.join(repo,'index.html'),'utf8');
const rows=JSON.parse(html.match(/<script id="bundle"[^>]*>([^<]*)<\/script>/)[1]);
const allScope=process.argv.includes('--scope=all');
const lessons=JSON.parse(fs.readFileSync(path.join(repo,'readings-v3.json'),'utf8')).filter(l=>allScope?['A2','B1'].includes(l.level):l.level==='A2');
const clean=s=>s.replace(/\([^)]*\)|[¹²³⁴]/g,'').trim();
const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,20);
const jobs=new Map(),words={},readings={};
// Preserve the source's noun/verb/adjective stress distinctions in isolated words.
const homographs={
 download:{noun:'dˈaʊnloʊd',verb:'dˌaʊnlˈoʊd'},
 increase:{noun:'ˈɪŋkɹiːs',verb:'ɪnˈkɹiːs'},
 inside:{adjective:'ˈɪnsaɪd',adverb:'ˌɪnsˈaɪd',noun:'ˌɪnsˈaɪd',preposition:'ˌɪnsˈaɪd'},
 outside:{adjective:'ˈaʊtsaɪd',noun:'ˌaʊtsˈaɪd',preposition:'ˌaʊtsˈaɪd'},
 record:{noun:'ˈɹɛkɚd',verb:'ɹɪkˈɔːɹd'},
 research:{noun:'ˈɹiːsɜːɹtʃ',verb:'ɹɪsˈɜːɹtʃ'}
};
// Source IPA distinguishes heteronyms across levels. Preserve strong isolated forms
// for function words, and do not propagate the source's erroneous /many/ entries.
{
 const groups=new Map();for(const r of rows){const list=groups.get(r.word)||[];list.push(r);groups.set(r.word,list);}
 for(const [word,list] of groups){
  if(['more','most','much','can','do','that'].includes(word)||new Set(list.map(r=>r.us).filter(Boolean)).size<2)continue;
  for(const r of list){if(!r.us||homographs[word]?.[r.pos])continue;
   let ipa=r.us.replace(/^\/|\/$/g,'').replaceAll('əʊ','oʊ').replaceAll('ər','ɚ').replaceAll('r','ɹ').replace(/e(?!ɪ)/g,'ɛ');
   homographs[word]??={};homographs[word][r.pos]=ipa;
  }
 }
}
for(const r of rows.filter(r=>allScope||r.level==='A2')){
 const text=clean(r.word),phonemes=homographs[text]?.[r.pos],id='word-'+hash(phonemes?text+'|'+phonemes:text),file=id+'.mp3';
 words[JSON.stringify(allScope?[r.word,r.pos||'',r.level]:[r.word,r.pos||''])]=file;jobs.set(id,{id,text,phonemes,file,type:'word'});
}
for(const l of lessons){const text=l.paragraphs.map(p=>p[0]).join('\n\n'),id='reading-'+l.id;readings[l.id]=id+'.mp3';jobs.set(id,{id,text,file:id+'.mp3',type:'reading'});}
const manifest={version:allScope?2:1,scope:allScope?'All vocabulary; A2 and B1 readings':'A2',voice:'am_michael',name:'Kokoro Michael',language:'en-US',model:'Kokoro-82M-v1.0',speed:1,format:'mp3',bitrateKbps:64,base:'audio/a2-michael/',words,readings};
if(process.argv.includes('--plan-only')){fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));console.log('Planned '+jobs.size+' files');process.exit(0);}
const logPath=path.join(out,'generation.json');
const done=fs.existsSync(logPath)?JSON.parse(fs.readFileSync(logPath,'utf8')):{};
const shardArg=process.argv.find(x=>x.startsWith('--shard='));
const shard=shardArg?shardArg.slice(8).split('/').map(Number):null;
const outputLog=shard?path.join(out,'generation-worker-'+shard[0]+'.json'):logPath;
if(shard&&fs.existsSync(outputLog))Object.assign(done,JSON.parse(fs.readFileSync(outputLog,'utf8')));
function mp3(chunks,rate){
 const pcm=Buffer.alloc(chunks.reduce((n,a)=>n+a.length,0)*2);let offset=0;
 for(const chunk of chunks)for(const sample of chunk){pcm.writeInt16LE(Math.round(Math.max(-1,Math.min(1,sample))*32767),offset);offset+=2;}
 const encoded=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-f','s16le','-ar',String(rate),'-ac','1','-i','pipe:0','-codec:a','libmp3lame','-b:a','64k','-write_xing','0','-id3v2_version','0','-f','mp3','pipe:1'],{input:pcm,maxBuffer:30*1024*1024,windowsHide:true});
 if(encoded.status!==0)throw Error('MP3 encode failed: '+encoded.stderr?.toString());return encoded.stdout;
 /* Reference pure-JS encoder, retained for reproducibility comparisons.
 const enc=new lameContext.lamejs.Mp3Encoder(1,rate,64),result=[];
 for(const chunk of chunks){const pcm=new Int16Array(chunk.length);for(let i=0;i<chunk.length;i++)pcm[i]=Math.round(Math.max(-1,Math.min(1,chunk[i]))*32767);
  for(let i=0;i<pcm.length;i+=1152){const b=enc.encodeBuffer(pcm.subarray(i,i+1152));if(b.length)result.push(Buffer.from(b));}
 }result.push(Buffer.from(enc.flush()));return Buffer.concat(result); */
}
(async()=>{
 console.log(JSON.stringify({entries:Object.keys(words).length,uniqueWords:[...jobs.values()].filter(j=>j.type==='word').length,readings:lessons.length,jobs:jobs.size}));
 const modelId='onnx-community/Kokoro-82M-v1.0-ONNX';
 const model=await StyleTextToSpeech2Model.from_pretrained(modelId,{dtype:'fp32',device:'cpu',session_options:{intraOpNumThreads:2,interOpNumThreads:1}});
 const tts=new KokoroTTS(model,await AutoTokenizer.from_pretrained(modelId));
 let n=0;for(const job of jobs.values()){
  if(shard&&n++%shard[1]!==shard[0])continue;
  if(!shard)n++;const inputHash=hash(job.text+(job.phonemes?'|'+job.phonemes:'')),file=path.join(out,job.file);
  if(done[job.id]?.inputHash===inputHash&&fs.existsSync(file)&&fs.statSync(file).size===done[job.id].bytes)continue;
  const start=Date.now(),chunks=[];let rate=24000,total=0,sum=0,peak=0;
  // Bound every synthesis request; never silently truncate a long reading.
  const sentences=job.text.match(/[^.!?\n]+(?:[.!?]+[”"']*|$)/g)||[job.text];
  const parts=[];let part='';for(const sentence of sentences){if((part+' '+sentence).length>350&&part){parts.push(part.trim());part='';}part+=' '+sentence;}if(part.trim())parts.push(part.trim());
  for(let i=0;i<parts.length;i++){
   const audio=job.phonemes?await tts.generate_from_ids(tts.tokenizer(job.phonemes,{truncation:false}).input_ids,{voice:'am_michael',speed:1}):await tts.generate(parts[i],{voice:'am_michael',speed:1});rate=audio.sampling_rate;
   for(const x of audio.audio){if(!Number.isFinite(x))throw Error('Invalid sample '+job.id);peak=Math.max(peak,Math.abs(x));sum+=x*x;}
   chunks.push(audio.audio);total+=audio.audio.length;
   if(i<parts.length-1){const silence=new Float32Array(Math.round(rate*.16));chunks.push(silence);total+=silence.length;}
  }
  if(total/rate<.15||Math.sqrt(sum/total)<.001)throw Error('Empty audio '+job.id);
  const bytes=mp3(chunks,rate);fs.writeFileSync(file+'.tmp',bytes);fs.renameSync(file+'.tmp',file);
  done[job.id]={inputHash,bytes:bytes.length,duration:total/rate,peak,rms:Math.sqrt(sum/total),parts:parts.length,seconds:(Date.now()-start)/1000};
  fs.writeFileSync(outputLog,JSON.stringify(done,null,2));
  if(n%20===0||job.type==='reading')console.log(JSON.stringify({n,total:jobs.size,id:job.id,...done[job.id]}));
 }
 fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
 console.log('COMPLETE '+jobs.size+' audio files');
})().catch(e=>{console.error(e);process.exitCode=1});

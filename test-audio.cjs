const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const manifest=require('./audio/a2-michael/manifest.json'),stats=require('./audio/a2-michael/generation.json');
const rows=JSON.parse(html.match(/<script id="bundle"[^>]*>([^<]*)<\/script>/)[1]);
const lessons=require('./readings-v3.json');
assert.deepEqual(JSON.parse(html.match(/<script id="michael-audio-manifest"[^>]*>([^<]*)<\/script>/)[1]),manifest);
const allScope=manifest.version===2,coveredRows=rows.filter(r=>allScope||r.level==='A2');assert.equal(coveredRows.length,allScope?5943:990);assert.equal(Object.keys(manifest.words).length,coveredRows.length);
assert.equal(Object.keys(manifest.readings).length,allScope?140:72);
const wordKey=r=>JSON.stringify(allScope?[r.word,r.pos||'',r.level]:[r.word,r.pos||'']);
for(const r of coveredRows)assert(manifest.words[wordKey(r)],r.word);
const files=new Set([...Object.values(manifest.words),...Object.values(manifest.readings)]);
for(const file of files){
 assert(/^[a-z0-9-]+\.mp3$/.test(file));const b=fs.readFileSync(path.join(__dirname,manifest.base,file));const stat=stats[file.slice(0,-4)];
 assert.equal(b.length,stat.bytes);assert(b.length>1000);assert.equal(b[0],255);assert.equal(b[1]&224,224,'MPEG frame header');assert(stat.rms>.001&&stat.duration>.15);
 let offset=0,decodedSeconds=0;
 while(offset<b.length){
  const header=b.readUInt32BE(offset);assert.equal((header>>>21)&2047,2047,'frame sync '+file);
  const version=(header>>>19)&3,layer=(header>>>17)&3;assert.equal(version,2,'MPEG-2');assert.equal(layer,1,'Layer III');
  const kbps=[0,8,16,24,32,40,48,56,64,80,96,112,128,144,160][(header>>>12)&15];
  const sampleRate=[22050,24000,16000][(header>>>10)&3];assert.equal(sampleRate,24000);assert.equal(kbps,64);
  const frameBytes=Math.floor(72000*kbps/sampleRate)+((header>>>9)&1);assert(offset+frameBytes<=b.length,'complete frame '+file);offset+=frameBytes;decodedSeconds+=576/sampleRate;
 }
 assert(Math.abs(decodedSeconds-stat.duration)<.2,'encoded duration matches complete waveform '+file);
}
for(const l of lessons.filter(l=>allScope?['A2','B1'].includes(l.level):l.level==='A2')){
 const file=manifest.readings[l.id];assert(file,l.id);const stat=stats[file.slice(0,-4)];
 const text=l.paragraphs.map(p=>p[0]).join('\n\n');const hash=crypto.createHash('sha256').update(text).digest('hex').slice(0,20);
 assert.equal(stat.inputHash,hash,l.id+' current text');const count=text.split(/\s+/).length;assert(stat.duration>count/5&&stat.duration<count,'plausible complete reading '+l.id);
}
for(const word of ['download','increase','record','research'])assert.notEqual(manifest.words[wordKey(rows.find(r=>r.word===word&&r.pos==='noun'))],manifest.words[wordKey(rows.find(r=>r.word===word&&r.pos==='verb'))],'distinct stress '+word);
if(allScope)for(const word of ['close','use','live','wind','present','object','conduct','desert','separate']){
 const group=rows.filter(r=>r.word===word);assert(new Set(group.map(r=>manifest.words[wordKey(r)])).size>1,'separate heteronym audio '+word);
}
const code=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];new vm.Script(code);
console.log('PASS Michael audio: '+coveredRows.length+' entries, '+Object.keys(manifest.readings).length+' complete readings, '+files.size+' validated MP3 files; complete MPEG frames, durations, source hashes, and distinct stress checked.');

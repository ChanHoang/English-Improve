const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..'),file=path.join(root,'index.html');let h=fs.readFileSync(file,'utf8');
const code=fs.readFileSync(path.join(__dirname,'audio-ui.js'),'utf8')+'\n'+fs.readFileSync(path.join(__dirname,'audio-controls.js'),'utf8');
h=h.replace('utterance.voice=voice;utterance.lang=lang;','utterance.voice=voice;utterance.lang=lang;utterance.rate=michaelSpeed;');
const match=/const michaelManifest=[\s\S]*?\nrender\(\);\n<\/script>/;
if(!match.test(h))throw Error('Audio script boundary missing');h=h.replace(match,()=>code+'\nrender();\n</script>');
h=h.replace(/<button[^>]*id="theme-toggle"[^>]*>[\s\S]*?<\/button>/,'');h=h.replace('</header>','<button type="button" id="theme-toggle" class="theme-toggle" aria-label="Switch theme">☾ Dark</button></header>');
if(!h.includes('id="theme-init"'))h=h.replace('<style>','<script id="theme-init">try{const t=JSON.parse(localStorage.getItem("ox5-theme"));document.documentElement.dataset.theme=t==="dark"||t==="light"?t:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch{document.documentElement.dataset.theme="light"}</script>\n<style>');
const css=fs.readFileSync(path.join(__dirname,'controls.css'),'utf8');h=h.replace(/<style id="audio-controls-style">[\s\S]*?<\/style>/,'');h=h.replace('</style>','</style>\n<style id="audio-controls-style">'+css+'</style>');
if(!h.includes("btn('🔊 Listen (US)','us')+michaelWordTools()"))h=h.replace("btn('🔊 Listen (US)','us')","btn('🔊 Listen (US)','us')+michaelWordTools()");
h=h.replaceAll("btn('♫ Listen (US)','us')+btn", "btn('♫ Listen (US)','us')+michaelWordTools()+btn");
// Word dialogs and reading word lists also expose speed/replay for touch users.
h=h.replaceAll("btn('♫ Listen (US)','read-audio')+'<div", "btn('♫ Listen (US)','read-audio')+michaelWordTools()+'<div");
if(!h.includes("<h2>Learn the words</h2>'+michaelWordTools()"))h=h.replace("<h2>Learn the words</h2>","<h2>Learn the words</h2>'+michaelWordTools()+'");
h=h.replaceAll("michaelWordTools()+''+michaelWordTools()","michaelWordTools()");
fs.writeFileSync(file,h);console.log('Installed shortcuts, A–B loop, timeline, speed memory, and light/dark theme.');

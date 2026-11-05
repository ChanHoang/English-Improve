const fs=require('fs');
const path='Oxford/index.html';let html=fs.readFileSync(path,'utf8');
const lessons=JSON.parse(fs.readFileSync('Oxford/readings.json','utf8'));
html=html.replace("'Ngữ pháp đến C1'];","'Ngữ pháp đến C1','Bài đọc mẫu'];");
html=html.replace('</style>',`
.reading-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,310px),1fr));gap:12px}
.reading-paragraph p[lang=en]{font-size:19px;line-height:1.95}
.word-link{display:inline;padding:0 2px;border:0;border-bottom:2px solid #61977b;border-radius:3px;background:#e9f3e7;font:inherit;color:#174d36}
.reading-words{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}
.reading-words>div{padding:8px;background:#f6f4ed;border-radius:8px}
.reading-question{border-top:1px solid #dce4da;padding:20px 0}
dialog{border:1px solid #b6c6bb;border-radius:20px;padding:22px;max-width:500px;width:calc(100% - 32px);max-height:85vh;overflow:auto;color:#18352e}
dialog::backdrop{background:#102f28aa}
@media(max-width:500px){main{padding:12px}header{padding:22px}nav button{flex-grow:1}.reading-paragraph p[lang=en]{font-size:18px}}
</style>`);
html=html.replace('</main>','</main><dialog id="reading-word-dialog" aria-labelledby="reading-word-title"><button data-action="read-close" style="float:right" aria-label="Đóng nghĩa từ">Đóng ×</button><div id="reading-word-content"></div></dialog>');
html=html.replace('function render(){',()=> 'const readings='+JSON.stringify(lessons).replace(/</g,'\\u003c')+';\n'+fs.readFileSync('Oxford/reading-ui.js','utf8')+'\nfunction render(){');
html=html.replace("$('query').placeholder=mode>=4?", "$('query').hidden=mode===5&&selectedReading!==null;\n $('query').placeholder=mode===5?'Tìm bài, cấp độ hoặc từ…':mode>=4?");
html=html.replace("if(mode>=4){html=grammarView()}","if(mode===5){html=readingView()}else if(mode===4){html=(selectedReading?btn('← Trở lại bài đọc','read-return'):'')+grammarView()}");
html=html.replace("const a=e.target.dataset.action;if(!a)return;","const a=e.target.dataset.action;if(!a)return;\n if(handleReadingAction(a))return;");
html=html.replace('id="reading-score" role="status"','id="reading-score" tabindex="-1" role="status"');
fs.writeFileSync(path,html);
console.log('Reading tab installed');

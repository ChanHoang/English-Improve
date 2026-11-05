const fs=require('fs');
function edit(slug,fn){const s=require('./b1-content/'+slug+'.cjs');fn(s.articles);fs.writeFileSync('b1-content/'+slug+'.cjs','module.exports='+JSON.stringify(s,null,2)+';\n')}
edit('conflict',a=>a[0].text=a[0].text.replace('Fighting stopped','[[fighting|Fighting]] stopped'));
edit('volcano',aa=>aa.forEach(a=>a.grammar.forEach(g=>{if(g.id===10){g.id=118;g.note='Had been + V-ing diễn tả quá trình kéo dài trước một thời điểm hoặc sự kiện trong quá khứ.'}})));
edit('weather',a=>{a[0].grammar.find(g=>g.id===77).id=78});
let ui=fs.readFileSync('ui-v4.js','utf8');
if(!ui.includes('function readingGroupNumber('))ui='function readingGroupNumber(l){return [...new Set(readings.filter(x=>x.level===l.level).map(x=>x.group))].indexOf(l.group)+1}\n'+ui;
ui=ui.replaceAll('String(pair[0].order)', 'String(readingGroupNumber(pair[0]))').replaceAll('String(l.order)','String(readingGroupNumber(l))');
ui=ui.replace("l.id.startsWith('a2-')?'Vietnamese guide'","/^(a2|b1)-/.test(l.id)?'Vietnamese guide'");
ui=ui.replace('levelItems.flatMap(l=>l.targets.map(t=>t.rowIndex))','levelItems.flatMap(l=>l.targets.filter(t=>t.level===readingLevel).map(t=>t.rowIndex))');
const start=ui.indexOf('function readingRoadmap(){');
ui=ui.slice(0,start)+`function readingRoadmap(){
 return '<details class="reading-roadmap"><summary>Course coverage · A2 & B1 complete</summary><p>Nội dung A2 và B1 đã sẵn sàng; đây là độ bao phủ khóa học, không phải số bài bạn đã học xong. Mỗi nhóm có hai bài dùng chung bộ từ. Một số nhóm B1 ban đầu có thêm từ A2 để ôn tập. Bản hướng dẫn tiếng Việt tóm lược ý chính của các bài mới.</p>'+readingLevels.map(level=>{const ls=readings.filter(l=>l.level===level),covered=new Set(ls.flatMap(l=>l.targets.filter(t=>t.level===level).map(t=>t.rowIndex))),total=defaults.filter(r=>r.level===level).length,gs=new Set(ls.flatMap(l=>l.grammar.map(g=>g.id)));return '<p><b>'+level+'</b> · '+new Set(ls.map(l=>l.group)).size+' groups · '+ls.length+' readings · '+covered.size+'/'+total+' '+level+' entries · '+gs.size+' grammar topics · '+(covered.size===total&&total?'All '+level+' content ready':ls.length?'In progress':'Planned')+'</p>'}).join('')+'<p>Grammar across all readings: '+new Set(readings.flatMap(l=>l.grammar.map(g=>g.id))).size+'/120 topics. B2–C1 sẽ tiếp tục bổ sung theo lộ trình.</p></details>';
}
`;
fs.writeFileSync('ui-v4.js',ui);
let test=fs.readFileSync('test-v4.cjs','utf8');
test=test.replace("run('readings.length'),88","run('readings.length'),152").replace('groups.size,44','groups.size,76').replace("filter(Boolean).length'),88","filter(Boolean).length'),152").replace('88 lessons;','152 lessons;');
test=test.replace("dispatch('read-level-B1');assert.equal((nodes['secondary-items'].innerHTML.match(/data-action=\"read-open-/g)||[]).length,4);","dispatch('read-level-B1');assert.equal((nodes['secondary-items'].innerHTML.match(/data-action=\"read-open-/g)||[]).length,68);assert.match(nodes.view.innerHTML,/34 groups · 68 readings · 902 target words/);");
test=test.replace("lessons.filter(l=>!l.id.startsWith('a2-')),JSON.parse(fs.readFileSync(__dirname+'/readings-before-a2.json'","lessons.filter(l=>!l.id.startsWith('b1-')),JSON.parse(fs.readFileSync(__dirname+'/readings-before-b1.json'");
fs.writeFileSync('test-v4.cjs',test);
let a2=fs.readFileSync('test-a2.cjs','utf8').replace("lessons.filter(l=>!l.id.startsWith('a2-'))","lessons.filter(l=>! /^(a2|b1)-/.test(l.id))");fs.writeFileSync('test-a2.cjs',a2);

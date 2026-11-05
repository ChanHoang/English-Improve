const fs=require('fs');let s=fs.readFileSync('ui-v4.js','utf8');
const start=s.indexOf(" else if(mode===5){out=btn('All groups'"),end=s.indexOf('\n else if(mode===0||mode===1)',start);
if(start>=0)s=s.slice(0,start)+" else if(mode===5){out=readingLevelButtons()}"+s.slice(end);
s=s.replace("[...new Set(readings.map(l=>l.group))].map(group=>", "[...new Set(readings.filter(l=>l.level===readingLevel).map(l=>l.group))].map(group=>");
s=s.replace("<h1>Words through stories</h1>","<h1>'+readingLevel+' · Words through stories</h1>");
s=s.replace("if(mode===5)out=readingView()","if(mode===5)out=readingView()");
fs.writeFileSync('ui-v4.js',s);
fs.appendFileSync('two-panels.css','\n.reading-level{border-bottom:1px solid #dcebf3;padding:6px 0}.reading-level-toggle{width:100%;display:flex;justify-content:space-between;align-items:center;background:#edf8fc;border:1px solid #cce8f2;padding:14px 10px;border-radius:9px;font-weight:700}.reading-level-toggle[aria-expanded=true]{background:#dff5fc;color:#007e9e}.reading-level-toggle small{font-size:11px;font-weight:400}.level-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px}.level-card{padding:24px;background:white;text-align:left}.level-card strong,.level-card span{display:block}.level-card strong{font-size:26px}.level-card span{margin-top:10px;color:#648298}\n');

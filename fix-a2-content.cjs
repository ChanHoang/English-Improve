const fs=require('fs');const path='a2-content/oceans.cjs';let s=fs.readFileSync(path,'utf8');s=s.replaceAll('[[inside:preposition]]','inside').replace('[[whole|whole]]','whole').replace('but looking [[close]] at a photograph is different from touching living coral','but getting a [[close]] view in a photograph is different from touching living coral');fs.writeFileSync(path,s);
for(const [file,from,to] of [
 ['games','The [[first]] games','The [[first]] of these games'],
 ['games','because both [[compete]] under shared rules','because both [[compete]] [[against]] each other under shared rules'],
 ['build','Where did the idea [[start|start]]?','Where did the idea start? At the [[start]], planners faced the problem of a busy river.'],
 ['transport','and people did not stop walking [[any more]] than they stopped needing roads','and the high seat above a giant front wheel was not necessary [[any more]]'],
 ['ships','There was [[nowhere]] to skip the careful conservation work.','There was [[nowhere]] to put the remains and simply forget about their care.']
]){const p='a2-content/'+file+'.cjs';fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(from,to))}

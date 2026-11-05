const fs=require('fs');
function edit(file,a,b){let s=fs.readFileSync(file,'utf8');if(!s.includes(a))throw Error('Missing text '+file);fs.writeFileSync(file,s.replace(a,b))}
edit('a2-content/music.cjs',"['Metropolitan Museum of Art · Musical instruments collection','https://www.metmuseum.org/about-the-met/collection-areas/musical-instruments']","['Metropolitan Museum of Art · Celebrating Sax','https://www.metmuseum.org/exhibitions/listings/2014/celebrating-sax'],['Yamaha · Why saxophones are woodwinds','https://www.yamaha.com/en/musical_instrument_guide/saxophone/structure/structure003.html']");
edit('a2-content/transport.cjs','người không ngừng đi bộ, cũng như không ngừng cần đường.','ghế ngồi cao phía trên bánh trước khổng lồ không còn cần thiết nữa.');
edit('a2-content/mystery.cjs','“That person [[sure:adverb]] looks guilty.”','“[[Sure:adverb]], we can check, but that person looks guilty.”');
edit('a2-content/mystery.cjs','“It [[sure:adverb]] looks ancient.”','“[[Sure:adverb]], I can look again. It looks ancient.”');
edit('a2-content/mind.cjs','learning [[little:adverb]] and hoping for a magical night','thinking [[little:adverb]] about study and hoping for a magical night');
edit('a2-content/mind.cjs','even when we initially understand [[little:adverb]]','even when we initially think [[little:adverb]] about it');

const fs=require('fs'),assert=require('assert/strict');
const html=fs.readFileSync('index.html','utf8'),dict=JSON.parse(html.match(/<script id="bundle" type="application\/json">([^<]*)<\/script>/)[1]);
const readings=JSON.parse(fs.readFileSync('readings.json','utf8')).filter(l=>['wright','ingenuity'].includes(l.id));
for(const l of readings)for(const g of l.grammar){const exact={wright:{3:'The flight lasted twelve seconds and covered a distance of 120 feet, about 37 metres.',63:'They had to repair the aircraft after an unsuccessful attempt.'},ingenuity:{3:'It stayed in the air for about 39 seconds and reached a height of three metres.',61:'They could not walk over and repair the helicopter after it reached Mars.'}};if(exact[l.id]?.[g.id])g.example=exact[l.id][g.id]}
const groups=[];
function group(id,level,title,rows){
 const targets=rows.trim().split('\n').map(line=>{const [word,pos,vi,en]=line.split('~'),rowIndex=dict.findIndex(r=>r.word===word&&r.pos===pos);assert(rowIndex>=0,word+' '+pos);return {word,pos,vi,en,rowIndex,level:dict[rowIndex].level}});
 assert.equal(targets.length,25,id);assert.equal(new Set(targets.map(t=>t.rowIndex)).size,25);const g={id,level,title,targets,order:groups.length+2};groups.push(g);return g;
}
function story(g,id,part,title,englishTitle,english,vietnamese,sources,grammar){
 const targets=structuredClone(g.targets),paras=english.trim().split('\n\n'),vi=vietnamese.trim().split('\n\n');assert.equal(paras.length,vi.length,id);
 const paragraphs=paras.map((s,p)=>{let output='',last=0;for(const m of s.matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)){output+=s.slice(last,m.index);const t=targets.find(t=>t.word===m[1].toLowerCase());assert(t,'unknown '+m[1]);assert(!t.occurrence,'duplicate '+id+' '+t.word);const text=m[2]||m[1];t.occurrence={p,start:output.length,end:output.length+text.length,text};output+=text;last=m.index+m[0].length;}output+=s.slice(last);return [output,vi[p]]});
 for(const t of targets)assert(t.occurrence,id+' missing '+t.word);
 const lesson={id,part,group:g.id,groupTitle:g.title,order:g.order,level:g.level,title,englishTitle,paragraphs,targets,grammar,sources,questions:[],forms:{},note:'Bài và các câu hỏi suy luận do ứng dụng biên soạn từ những sự kiện được dẫn nguồn; không phải trích nguyên văn. Từ ngoài nhóm là từ hỗ trợ, có thể cao hơn cấp độ mục tiêu.',wordCount:paragraphs.map(p=>p[0]).join(' ').split(/\s+/).length};readings.push(lesson);return lesson;
}
function question(l,category,q,opts,why,extra={}){assert.equal(opts.length,3);assert.equal(why.length,3);const offset=l.questions.length%3,order=[0,1,2].map(i=>(i+offset)%3);l.questions.push({q,category,options:order.map(i=>opts[i]),answer:order.indexOf(0),explanations:order.map(i=>why[i]),...extra})}
function content(l,q,a,b,c,why,wb,wc){question(l,'content',q,[a,b,c],[why,wb,wc])}
function grammarQ(l,id,q,a,b,c,why,wb,wc){question(l,'grammar',q,[a,b,c],[why,wb,wc],{grammarId:id})}
const food=group('food-02','A2','Small foods, big surprises',`
bean~noun~hạt đậu~a seed used as food, such as a cacao seed
bowl~noun~bát~a deep round container for food
contain~verb~chứa~to have something inside
cook~noun~người nấu ăn~a person who prepares food
dry~adjective~khô~having little or no water on the outside
factory~noun~nhà máy~a building where goods are made
fresh~adjective~mới làm, còn tươi~recently made or obtained
heat~noun~nhiệt~energy that makes something hot
material~noun~nguyên liệu~a substance used to make something
method~noun~phương pháp~a way of doing something
oil~noun~dầu~a fatty liquid used in preparing food
process~noun~quá trình~a series of changes or actions
produce~verb~sản xuất, tạo ra~to make something
quantity~noun~lượng~an amount of something
recipe~noun~công thức nấu ăn~instructions for preparing a dish
serve~verb~phục vụ món ăn~to give food or drink to someone
smell~noun~mùi~the quality noticed with your nose
soft~adjective~mềm~easy to press or change in shape
sweet~adjective~ngọt~having a taste like sugar
taste~noun~vị~the quality noticed when you eat
temperature~noun~nhiệt độ~how hot or cold something is
traditional~adjective~truyền thống~connected with customs passed down over time
variety~noun~sự đa dạng~a number of different kinds
remove~verb~loại bỏ, lấy ra~to take something away
cover~verb~đậy, phủ~to put something over something else
`);
const chocolate=story(food,'chocolate','A','Khi sô-cô-la chưa phải là thanh kẹo','Before Chocolate Was a Bar',
`A piece of chocolate feels ordinary today, but its story begins with a [[bean]]. Cacao grows in large fruits on trees. The seeds are the [[material]] used to make chocolate. Long before a modern [[factory]] could [[produce]] chocolate bars, people in parts of the Americas made cacao drinks. Some [[traditional]] drinks were mixed with spices. They did not have the same [[sweet]] [[taste]] as a milk-chocolate bar.

How does a seed become something you can eat? Makers let the seeds ferment, then make them [[dry]]. Roasting gives them a different [[smell]]. They [[remove]] the outer shells and grind what remains. This [[process]] needs time. The ground cacao can [[contain]] a large [[quantity]] of natural fat, called cocoa butter. Despite its name, cocoa butter does not come from a cow. It is the fat of the seed, rather than an [[oil]] added from another plant.

How much chocolate do you need for a bowl of fruit? A chocolate maker must pay attention to [[temperature]]. With enough [[heat]], chocolate becomes [[soft]] and then melts. A [[cook]] can put melted chocolate in a [[bowl]] and use it to [[cover]] fruit. This is one modern [[method]] of using it, not a description of every historical drink. You can [[serve]] it with [[fresh]] fruit, or follow a different [[recipe]]. There is a great [[variety]] of ways to enjoy the same plant. The next time you eat chocolate, remember that people drank it long before they bought it as a solid bar.`,
`Một miếng sô-cô-la ngày nay có vẻ bình thường, nhưng câu chuyện bắt đầu từ hạt cacao. Cacao mọc trong quả lớn trên cây. Hạt là nguyên liệu làm sô-cô-la. Rất lâu trước khi nhà máy hiện đại sản xuất thanh sô-cô-la, người dân ở một số vùng châu Mỹ đã làm đồ uống cacao. Một số đồ uống truyền thống pha với gia vị. Chúng không có vị ngọt giống thanh sô-cô-la sữa.

Hạt trở thành thức ăn như thế nào? Người làm cho hạt lên men rồi phơi khô. Việc rang tạo mùi khác. Họ bỏ lớp vỏ ngoài và nghiền phần còn lại. Quá trình này cần thời gian. Cacao nghiền có thể chứa lượng lớn chất béo tự nhiên gọi là bơ cacao. Dù có tên là bơ, nó không đến từ bò. Đó là chất béo của hạt, chứ không phải dầu từ cây khác được thêm vào.

Bạn cần bao nhiêu sô-cô-la cho một bát trái cây? Người làm sô-cô-la phải chú ý nhiệt độ. Khi đủ nhiệt, sô-cô-la mềm rồi chảy. Người nấu có thể cho sô-cô-la chảy vào bát để phủ trái cây. Đây là một cách dùng hiện đại, không phải mô tả mọi đồ uống trong lịch sử. Bạn có thể phục vụ với trái cây tươi hoặc dùng công thức khác. Có rất nhiều cách thưởng thức cùng một loài cây. Lần tới khi ăn sô-cô-la, hãy nhớ rằng người ta đã uống nó từ lâu trước khi mua dạng thanh rắn.`,
[['Kew · History of chocolate','https://www.kew.org/read-and-watch/food-of-the-gods-a-brief-history-of-chocolate'],['ICCO · Processing cocoa','https://www.icco.org/processing-cocoa/'],['ICCO · Growing cocoa','https://www.icco.org/growing-cocoa/']],
[{id:15,example:'The next time you eat chocolate, remember that people drank it long before they bought it as a solid bar.',note:'Remember là mệnh lệnh nhẹ, chủ ngữ you được hiểu ngầm.'},{id:28,example:'How much chocolate do you need for a bowl of fruit?',note:'Chocolate chỉ chất liệu không đếm được, nên dùng How much. Với beans đếm được số nhiều, dùng How many beans…?'}]);
const popcorn=story(food,'popcorn','B','Bí mật nằm trong hạt bắp','The Water Inside the Pop',
`Put some popcorn in a [[bowl]] and it looks nothing like the hard seeds that came before it. The surprising part of the story is water. A popcorn seed may look [[dry]], but it can [[contain]] a small [[quantity]] of water inside. When the [[temperature]] rises, that water becomes steam. The shell is strong enough to hold pressure for a time. The hard outside holds it in until pressure breaks the shell. The [[soft]] [[material]] inside then spreads out, and the familiar white snack appears.

Not every kind of corn can do this well. Popcorn is a special type. A [[cook]] can use more than one [[method]] to make it: hot air works, and so does a pan with a little [[oil]]. Oil is not the hidden thing that makes every seed pop; water is. The [[heat]] starts the change, while the shell helps hold the pressure. A [[bean]] does not turn into ordinary popcorn just because you heat it. The seed itself matters.

The same basic [[process]] can happen in a home kitchen or in a food [[factory]]. Machines can [[produce]] large amounts, but the tiny water supply is still important. A [[traditional]] pan [[recipe]] may tell you to [[cover]] the pan, so the corn stays inside as it jumps. When it is ready, you [[remove]] the pan from the heat. The [[smell]] of [[fresh]] popcorn often arrives before the first bite. You can [[serve]] it with salt, or make a [[sweet]] version. This [[variety]] changes the [[taste]], but it does not change the secret inside the seed.`,
`Cho bắp rang vào bát, nó trông khác hẳn những hạt cứng ban đầu. Điều bất ngờ là nước. Hạt bắp rang có thể trông khô nhưng chứa một lượng nước nhỏ bên trong. Khi nhiệt độ tăng, nước thành hơi. Vỏ đủ chắc để giữ áp suất trong một thời gian. Lớp vỏ cứng giữ hơi đến khi áp suất làm vỏ vỡ. Chất mềm bên trong bung ra và món ăn màu trắng quen thuộc xuất hiện.

Không phải loại bắp nào cũng làm được điều đó tốt. Bắp rang là một loại đặc biệt. Người nấu có nhiều phương pháp: khí nóng hoặc chảo với ít dầu. Dầu không phải thành phần bí mật khiến mọi hạt nổ; nước mới là yếu tố đó. Nhiệt khởi động sự thay đổi, còn vỏ giúp giữ áp suất. Hạt đậu không biến thành bắp rang thông thường chỉ vì được làm nóng. Bản thân loại hạt rất quan trọng.

Quá trình cơ bản này diễn ra ở bếp gia đình hoặc nhà máy thực phẩm. Máy có thể sản xuất lượng lớn, nhưng chút nước trong hạt vẫn quan trọng. Công thức dùng chảo truyền thống có thể yêu cầu đậy chảo để bắp ở bên trong khi bung lên. Khi đã xong, bạn nhấc chảo khỏi nguồn nhiệt. Mùi bắp rang mới làm thường đến trước miếng ăn đầu tiên. Có thể dùng với muối hoặc làm bản ngọt. Sự đa dạng làm thay đổi vị, nhưng không đổi bí mật bên trong hạt.`,
[['USDA · How does popcorn pop?','https://www.nal.usda.gov/exhibits/speccoll/exhibits/show/popcorn/how-does-popcorn-pop-'],['American Chemical Society · Popcorn','https://www.acs.org/education/whatischemistry/adventures-in-chemistry/secret-science-stuff/popcorn.html']],
[{id:80,example:'When the temperature rises, that water becomes steam.',note:'Hai vế hiện tại đơn mô tả kết quả chung trong quá trình làm nóng hạt.'},{id:53,example:'The shell is strong enough to hold pressure for a time.',note:'Tính từ strong đứng trước enough; to hold pressure nêu việc mà độ chắc cho phép thực hiện.'}]);
const messages=group('messages-03','A2','Messages that changed the world',`
mail~noun~thư từ~letters sent through a postal service
stamp~noun~tem thư~a small label showing postage has been paid
code~noun~mã~a system of signs used to represent information
communicate~verb~giao tiếp~to share information with others
connect~verb~kết nối~to join things so information can pass
copy~noun~bản sao~another version of the same text
correctly~adverb~một cách chính xác~without making a mistake
document~noun~tài liệu~a written record containing information
electric~adjective~dùng điện~using electricity
electricity~noun~điện~a form of energy that can power devices
electronic~adjective~điện tử~using small electrical components to handle information
error~noun~lỗi~something that is incorrect
express~verb~bày tỏ~to put a thought or feeling into words or signs
formal~adjective~trang trọng~suitable for official or serious situations
international~adjective~quốc tế~involving more than one country
network~noun~mạng lưới~a connected system of routes or points
print~verb~in~to put words or images on paper using a machine
receive~verb~nhận~to get something sent to you
reply~noun~lời hồi đáp~an answer to a message
service~noun~dịch vụ~work provided to help users
sheet~noun~tờ~a flat piece of paper
sign~noun~dấu hiệu~a visible mark that gives information
symbol~noun~biểu tượng~a mark or image that represents something
system~noun~hệ thống~connected parts that work together
user~noun~người sử dụng~a person who uses a service or tool
`);
const stamp=story(messages,'penny-black','A','Mảnh giấy nhỏ đổi cách gửi thư','A Penny on a Letter',
`Before [[electronic]] messages, a [[sheet]] of paper could carry news across a country. People used to send news this way. They used [[mail]] to [[communicate]], to [[express]] feelings, or to send a [[formal]] [[document]]. But a postal [[service]] needed rules about payment. In Britain, reformer Rowland Hill supported a simpler [[system]]: the sender would pay, and a light letter could travel within the country for one penny. The Penny Black [[stamp]] appeared in May 1840.

The small black label was a [[sign]] that postage had been paid. It showed Queen Victoria’s head, an image that became a familiar [[symbol]]. A postal [[user]] could put it on a letter instead of leaving the whole charge for the person who would [[receive]] it. The change helped a growing [[network]] of post offices [[connect]] people. A [[reply]] still had to travel physically, however. A stamp could not make a horse or train move at the speed of [[electricity]].

Postage and telegraphy solved different problems. An [[electric]] telegraph could send a short message through a wire using a [[code]]. A letter could carry handwriting, a drawing, or a paper [[copy]] that someone wanted to keep. Printers could [[print]] many stamps with the same design, but the sender still had to write the address [[correctly]]. One [[error]] could send the letter the wrong way. Other countries later issued stamps too, and they became part of [[international]] communication. Something small enough to fit in a pocket helped change a much larger world.`,
`Trước tin nhắn điện tử, một tờ giấy có thể mang tin đi khắp đất nước. Người ta từng thường gửi tin bằng cách này. Họ dùng thư để giao tiếp, bày tỏ tình cảm hoặc gửi tài liệu trang trọng. Nhưng dịch vụ bưu chính cần quy tắc thanh toán. Tại Anh, Rowland Hill ủng hộ hệ thống đơn giản hơn: người gửi trả tiền, và thư nhẹ có thể đi trong nước với giá một penny. Tem Penny Black xuất hiện tháng 5 năm 1840.

Nhãn nhỏ màu đen cho biết cước đã được trả. Nó có hình đầu Nữ hoàng Victoria, trở thành biểu tượng quen thuộc. Người dùng có thể dán nó lên thư thay vì để toàn bộ cước cho người nhận. Thay đổi này giúp mạng bưu cục ngày càng rộng kết nối mọi người. Tuy nhiên, thư hồi đáp vẫn phải di chuyển thực tế. Con tem không làm ngựa hay tàu nhanh như điện.

Bưu chính và điện báo giải quyết các vấn đề khác nhau. Điện báo dùng điện có thể gửi thông điệp ngắn qua dây bằng mã. Thư mang chữ viết tay, tranh hoặc bản giấy mà người ta muốn giữ. Máy in tạo được nhiều tem cùng mẫu, nhưng người gửi vẫn phải ghi địa chỉ đúng. Một lỗi có thể khiến thư đi nhầm hướng. Các nước khác sau đó cũng phát hành tem, trở thành một phần giao tiếp quốc tế. Vật nhỏ vừa túi áo đã góp phần thay đổi thế giới rộng lớn hơn.`,
[['Smithsonian Postal Museum · Great Britain','https://postalmuseum.si.edu/exhibition/international-philately-europe-northern-europe/great-britain'],['USPS · Stamps and postcards','https://about.usps.com/who/profile/history/stamps-postcards.htm']],
[{id:67,example:'People used to send news this way.',note:'Used to + send nói thói quen gửi tin trong quá khứ. Phân biệt với used mail to communicate: used ở câu đó chỉ là quá khứ của use.'},{id:97,example:'They used mail to communicate, to express feelings, or to send a formal document.',note:'To communicate / to express / to send diễn tả mục đích dùng thư.'}]);
const morse=story(messages,'morse','B','Thông điệp không cần người mang','A Message Without a Messenger',
`On 24 May 1844, Samuel Morse sent a famous message from Washington to Alfred Vail in Baltimore. It was not [[mail]], and it did not need a [[stamp]]. An [[electric]] telegraph used [[electricity]] to [[connect]] the two places. A [[code]] turned letters into short and long marks. The [[system]] made it possible to [[communicate]] without carrying the original piece of paper along the whole route.

Morse’s early machine made marks on paper. A person had to read each [[sign]] [[correctly]] to understand the words. A short mark or a long mark was a [[symbol]], not a complete word by itself. An [[error]] could change the message. The [[user]] therefore needed skill, not just a wire. Vail could [[receive]] a message and send a [[reply]]. Surviving paper records include versions of the message sent in both directions. One [[copy]] is an important historical [[document]] today.

The famous message was a [[formal]] sentence from the Bible, suggested by Annie Ellsworth. It showed how a machine could [[express]] words over a distance. It did not mean that Morse alone invented every part of telegraphy, or that no one had sent an electric signal before 1844. This was an important demonstration on a new line. Later telegraph routes became a large [[network]], and the [[service]] crossed borders into [[international]] communication. Modern [[electronic]] messages can appear on a screen, and a printer can [[print]] them on a [[sheet]] of paper. The tools have changed, but people still want the same thing: to be understood by someone far away.`,
`Ngày 24 tháng 5 năm 1844, Samuel Morse gửi thông điệp nổi tiếng từ Washington đến Alfred Vail ở Baltimore. Nó không phải thư và không cần tem. Điện báo dùng điện kết nối hai nơi. Mã chuyển các chữ cái thành dấu ngắn và dài. Hệ thống giúp giao tiếp mà không cần mang tờ giấy gốc đi hết tuyến đường.

Máy ban đầu của Morse tạo dấu trên giấy. Người đọc phải hiểu đúng từng dấu để biết nội dung. Một dấu ngắn hoặc dài là ký hiệu, không tự nó là cả một từ. Lỗi có thể đổi thông điệp. Vì thế người dùng cần kỹ năng, không chỉ cần dây điện. Vail nhận tin rồi gửi lời đáp. Các bản ghi giấy còn lại có những phiên bản gửi theo cả hai hướng. Một bản sao hiện là tài liệu lịch sử quan trọng.

Thông điệp nổi tiếng là câu trang trọng từ Kinh Thánh do Annie Ellsworth gợi ý. Nó cho thấy máy có thể truyền lời qua khoảng cách. Điều này không có nghĩa Morse một mình phát minh mọi bộ phận của điện báo, hay trước năm 1844 chưa ai gửi tín hiệu điện. Đây là cuộc trình diễn quan trọng trên tuyến mới. Sau đó các tuyến thành mạng lưới lớn và dịch vụ vượt biên giới. Tin điện tử hiện đại xuất hiện trên màn hình và có thể in ra giấy. Công cụ đổi khác nhưng con người vẫn muốn được ai đó ở xa hiểu mình.`,
[['Library of Congress · Invention of the telegraph','https://www.loc.gov/collections/samuel-morse-papers/articles-and-essays/collection-highlights/invention-of-the-telegraph/'],['Smithsonian · Telegraph message','https://www.si.edu/object/what-hath-god-wrought-telegraph-message:nmah_713485']],
[{id:61,example:'Vail could receive a message and send a reply.',note:'Could + V nguyên mẫu nói khả năng của hệ thống ở thời điểm quá khứ.'},{id:72,example:'The system made it possible to communicate without carrying the original piece of paper along the whole route.',note:'Sau giới từ without dùng carrying (V-ing).'}]);
// Additional groups and exercises are authored separately, then combined below.
require('./reading-expansion-more.cjs')({group,story,content,grammarQ,readings});
require('./reading-expansion-questions.cjs')({readings,content,grammarQ});
require('./reading-batch-07-11.cjs')({group,story,content,grammarQ,readings});
for(const l of readings){
 l.groupTitle??='First flights';l.order??=1;
 for(let i=0;i<l.targets.length;i++){
  const t=l.targets[i],o=t.occurrence,s=l.paragraphs[o.p][0];
  const boundary=s.lastIndexOf('. ',o.start),start=boundary<0?0:boundary+2,end=s.indexOf('. ',o.end);
  const excerpt=s.slice(start,end<0?s.length:end+1);
  const other=l.targets.filter(x=>x.word!==t.word&&x.vi!==t.vi);
  const d1=other[(i*3)%other.length],d2=other[(i*3+7)%other.length];
  question(l,'vocabulary','In “'+excerpt+'”, what does “'+o.text+'” mean?',[t.vi,d1.vi,d2.vi],[t.word+' trong câu này nghĩa là “'+t.vi+'”: '+t.en+'.','“'+d1.vi+'” là nghĩa của '+d1.word+', không phải '+t.word+'. Ở đây '+t.word+' nghĩa là “'+t.vi+'”.','“'+d2.vi+'” là nghĩa của '+d2.word+', không phải '+t.word+'. Ở đây '+t.word+' nghĩa là “'+t.vi+'”.'],{targetWord:t.word});
 }
 // Keep categories together, stable question IDs independent of display position.
 l.questions=l.questions.sort((a,b)=>['content','vocabulary','grammar'].indexOf(a.category)-['content','vocabulary','grammar'].indexOf(b.category));
 l.questions.forEach((q,i)=>q.id=l.id+'-v3-'+i);
 assert(l.questions.filter(q=>q.category==='content').length>=5,l.id+' content');
 assert.equal(l.questions.filter(q=>q.category==='vocabulary').length,25);
 for(const g of l.grammar)assert(l.questions.filter(q=>q.grammarId===g.id).length>=2,l.id+' grammar '+g.id);
}
const unique=new Set();for(const g of [readings[0],...groups])for(const t of g.targets){assert(!unique.has(t.rowIndex),'Repeat target '+t.word);unique.add(t.rowIndex)}
fs.writeFileSync('readings-v3.json',JSON.stringify(readings,null,2));
console.log(readings.length+' readings, '+unique.size+' distinct targets, '+readings.reduce((n,l)=>n+l.questions.length,0)+' exercises.');

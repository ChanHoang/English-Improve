const fs=require('fs');
const lessons=[];
const words=s=>s.trim().split('\n').map(line=>{const [word,pos,vi,en]=line.split('|');return {word,pos,vi,en}});
lessons.push({
id:'liberty',level:'A1',title:'Vì sao Tượng Nữ thần Tự do có màu xanh?',englishTitle:'A Green Woman by the Water',hook:'Bạn nghĩ người ta sơn bức tượng màu xanh, hay màu sắc tự thay đổi?',
note:'Bài giới thiệu dùng câu ngắn. Từ hỗ trợ ngoài nhóm học: statue = bức tượng; copper = đồng; torch = ngọn đuốc; crown = vương miện.',
paragraphs:[
['Near New York City, there is a small island. Water is all around it. People take a boat to visit a famous statue there. It looks like a very tall woman. You can see her in many photos. Her right hand holds a torch. Her left arm holds a tablet with a date on it. There is a crown on her head.','Gần thành phố New York có một hòn đảo nhỏ. Nước bao quanh đảo. Mọi người đi tàu để thăm một bức tượng nổi tiếng ở đó. Tượng trông như một người phụ nữ rất cao. Bạn có thể thấy bà trong nhiều bức ảnh. Tay phải của bà cầm ngọn đuốc. Cánh tay trái giữ một tấm bảng có ghi ngày tháng. Trên đầu bà có một chiếc vương miện.'],
['Today, the statue is green. But think about its first day in New York in 1886. The outside was brown, not green. Why does the colour change? The outside is copper. Air and water slowly change this metal. The green colour comes from this change.','Ngày nay, bức tượng có màu xanh. Nhưng hãy nghĩ về ngày đầu của tượng ở New York vào năm 1886. Bên ngoài tượng khi ấy có màu nâu, không phải xanh. Vì sao màu sắc thay đổi? Bên ngoài tượng làm bằng đồng. Không khí và nước dần làm thay đổi kim loại này. Màu xanh xuất hiện từ sự biến đổi đó.'],
['The statue came from France, another country. It is old now, but its history can still teach us something new. Look at a photo of it. What do you notice first: its face, its size, or its colour? You can learn about art and science from the same place.','Bức tượng đến từ Pháp, một quốc gia khác. Tượng nay đã lâu đời, nhưng lịch sử của nó vẫn có thể dạy ta điều mới. Hãy nhìn một bức ảnh của tượng. Bạn chú ý điều gì trước tiên: gương mặt, kích thước hay màu sắc? Bạn có thể học về nghệ thuật và khoa học từ cùng một nơi.']
],
targets:words(`city|noun|thành phố|a large town
island|noun|đảo|land with water all around it
water|noun|nước|the liquid in seas and rivers
boat|noun|tàu, thuyền|a vehicle that travels on water
visit|verb|đến thăm|to go to a place to see it
famous|adjective|nổi tiếng|known by many people
woman|noun|phụ nữ|an adult female person
tall|adjective|cao|having a large height
green|adjective|màu xanh lá|having the colour of grass
brown|adjective|màu nâu|having a colour like dark wood
colour|noun|màu sắc|the appearance of something as red, blue, and so on
hand|noun|bàn tay|the body part at the end of an arm
arm|noun|cánh tay|the body part between the shoulder and hand
head|noun|đầu|the body part with the eyes and mouth
photo|noun|bức ảnh|a picture made with a camera
day|noun|ngày|a period of twenty-four hours
people|noun|mọi người|more than one person
country|noun|quốc gia|an area with its own government
history|noun|lịch sử|what happened in the past
old|adjective|lâu đời|having existed for a long time
new|adjective|mới|not known or experienced before
learn|verb|học|to get knowledge
look|verb|nhìn|to direct your eyes towards something
change|verb|thay đổi|to become different
air|noun|không khí|the gases around us that we breathe`),
forms:{photo:['photo','photos'],look:['Look','looks']},
grammar:[{id:13,example:'There is a small island.',note:'There is + danh từ số ít dùng để giới thiệu một sự vật. Nếu có nhiều đảo, dùng there are.'},{id:1,example:'Air and water slowly change this metal.',note:'Hiện tại đơn diễn tả quá trình tự nhiên nói chung. Chủ ngữ air and water là số nhiều nên change không thêm s.'}],
questions:[
{q:'Why is the statue green today?',options:['People paint it every day.','Its copper exterior changes naturally.','Green water covers it.'],answer:1,why:'Đoạn 2 giải thích màu xanh xuất hiện khi đồng bên ngoài biến đổi do tiếp xúc với môi trường.'},
{q:'Which country did the statue come from?',options:['France','Canada','Italy'],answer:0,why:'Đoạn 3 nêu trực tiếp France.'},
{q:'In “Her left arm holds a tablet”, what does arm mean?',options:['Một loại vũ khí','Một hòn đảo','Cánh tay'],answer:2,why:'Arm ở đây là bộ phận cơ thể của hình người, phù hợp với hand và head trong đoạn.'},
{q:'Choose the sentence that introduces one island.',options:['There are a small island.','There is a small island.','There have a small island.'],answer:1,why:'A small island là danh từ đếm được số ít nên dùng there is.'}
],
sources:[['National Park Service · Statue of Liberty Facts','https://www.nps.gov/stli/learn/statue-of-liberty-facts.htm']],
prompt:'Viết 2 câu mô tả một địa điểm bạn biết, dùng there is và hai từ trong nhóm.'
});
lessons.push({
id:'wright',level:'A2',title:'Mười hai giây mở ra một hành trình mới',englishTitle:'Twelve Seconds in the Air',hook:'Một chuyến bay chỉ dài 12 giây có thể quan trọng như thế nào?',
note:'Từ hỗ trợ: aircraft = máy bay; powered flight = chuyến bay có động cơ; wing = cánh máy bay. Một số câu hỏi trong bài là lời dẫn của người biên soạn.',
paragraphs:[
['How do you invent something that can fly? You need more than a dream. You need an engine, equipment, and a way to control your machine. An engineer must think about its shape, its weight, and the direction in which it will move. These are useful questions for understanding the work of Wilbur and Orville Wright.','Làm sao phát minh ra một thứ có thể bay? Bạn cần nhiều hơn một giấc mơ. Bạn cần động cơ, thiết bị và cách điều khiển cỗ máy. Một kỹ sư phải nghĩ về hình dạng, trọng lượng và hướng chuyển động của nó. Những câu hỏi này giúp ta hiểu công việc của Wilbur và Orville Wright.'],
['The brothers worked for several years to develop their invention. Each experiment helped them learn. The purpose was not simply to leave the ground. A pilot also needed control in the air. If the speed or direction was wrong, the flight could end badly. Careful work mattered more than a quick record.','Hai anh em làm việc trong nhiều năm để phát triển phát minh. Mỗi thí nghiệm giúp họ học thêm. Mục đích không đơn giản chỉ là rời mặt đất. Phi công còn cần điều khiển máy bay trên không. Nếu tốc độ hoặc hướng bay sai, chuyến bay có thể kết thúc tồi tệ. Làm việc cẩn thận quan trọng hơn một kỷ lục chóng vánh.'],
['They had to repair the aircraft after an unsuccessful attempt. Finally, on December 17, 1903, Orville made a successful powered flight near Kitty Hawk, North Carolina. The wind was strong. The flight lasted twelve seconds and covered a distance of 120 feet, about 37 metres. Later that day, Wilbur stayed in the air for 59 seconds.','Họ phải sửa máy bay sau một lần thử không thành công. Cuối cùng, ngày 17 tháng 12 năm 1903, Orville thực hiện chuyến bay có động cơ thành công gần Kitty Hawk, Bắc Carolina. Gió mạnh. Chuyến bay kéo dài 12 giây, đi được 120 foot, khoảng 37 mét. Sau đó trong cùng ngày, Wilbur ở trên không 59 giây.'],
['Think about the materials and technology behind such a machine: wood, metal, an engine, and a careful design. Its shape helped it lift into the air. The first flight was short, but the problem was large. Study the story carefully and you see a process of learning, testing, and trying again.','Hãy nghĩ về vật liệu và công nghệ đằng sau một cỗ máy như vậy: gỗ, kim loại, động cơ và thiết kế cẩn thận. Hình dạng giúp nó nâng lên không trung. Chuyến bay đầu ngắn, nhưng vấn đề cần giải quyết lớn. Tìm hiểu kỹ câu chuyện, bạn sẽ thấy một quá trình học hỏi, thử nghiệm và thử lại.']
],
targets:words(`invent|verb|phát minh|to create something new
dream|noun|ước mơ|something you strongly hope to achieve
engine|noun|động cơ|a machine that provides power
equipment|noun|thiết bị|the things needed for an activity
control|noun|sự điều khiển|the ability to direct how something moves
engineer|noun|kỹ sư|a person who designs or builds technical systems
shape|noun|hình dạng|the form of an object
weight|noun|trọng lượng|how heavy something is
direction|noun|hướng|the way something moves towards
several|determiner|một vài, nhiều hơn hai|more than two but not a large number
develop|verb|phát triển|to make something more advanced or useful
invention|noun|phát minh|a new thing someone has created
experiment|noun|thí nghiệm|a test used to learn how something works
purpose|noun|mục đích|the reason for doing something
ground|noun|mặt đất|the surface you stand on
pilot|noun|phi công|a person who flies an aircraft
speed|noun|tốc độ|how fast something moves
record|noun|kỷ lục|the best measured achievement
repair|verb|sửa chữa|to make a damaged thing work again
finally|adverb|cuối cùng|after a period of time or difficulty
successful|adjective|thành công|achieving the intended result
wind|noun|gió|air moving outside
distance|noun|khoảng cách|the space between two points
technology|noun|công nghệ|practical knowledge and tools used to do things
carefully|adverb|một cách cẩn thận|with attention to avoiding mistakes`),
forms:{},
grammar:[{id:3,example:'The flight lasted twelve seconds.',note:'Lasted là quá khứ đơn của last, chỉ một sự kiện đã kết thúc năm 1903. Sau did trong câu hỏi, dùng last, không dùng lasted.'},{id:63,example:'They had to repair the aircraft.',note:'Had to diễn tả sự cần thiết trong quá khứ. Đây không phải quá khứ hoàn thành, vì sau to là repair nguyên mẫu.'}],
questions:[
{q:'How long was Orville’s first flight on December 17?',options:['59 minutes','12 seconds','37 seconds'],answer:1,why:'Đoạn 3 phân biệt chuyến đầu 12 giây với chuyến sau 59 giây của Wilbur.'},
{q:'What problem did the brothers need to solve besides leaving the ground?',options:['Serving food','Building an airport','Controlling the machine in the air'],answer:2,why:'Đoạn 2 nhấn mạnh điều khiển, không chỉ cất lên.'},
{q:'Which word means “the space between two points”?',options:['distance','purpose','weight'],answer:0,why:'Distance trong bài chỉ quãng đường 120 foot mà máy bay đi được.'},
{q:'Which question has the correct past-simple form?',options:['Did the flight lasted twelve seconds?','Did the flight last twelve seconds?','Does the flight lasted twelve seconds?'],answer:1,why:'Did đã thể hiện quá khứ, nên last trở về nguyên mẫu.'}
],
sources:[['NPS · The First Flight','https://www.nps.gov/articles/firstflight.htm'],['NPS · Fourth Flight Landing','https://www.nps.gov/places/000/fourth-flight-landing.htm'],['NASA · First Powered Flight','https://www.nasa.gov/history/120-years-ago-the-first-powered-flight-at-kitty-hawk/']],
prompt:'Kể lại một lần bạn phải thử nhiều lần mới thành công. Dùng quá khứ đơn và ba từ trong bài.'
});
fs.writeFileSync('Oxford/readings.json',JSON.stringify(lessons,null,2));

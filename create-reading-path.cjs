const fs=require('fs');
const prior=JSON.parse(fs.readFileSync('Oxford/readings.json','utf8'));
const first=prior.find(l=>l.id==='wright');
first.group='flight-01';first.part='A';first.order=1;
first.questions=[
{q:'What is the main idea of the story?',options:['A short flight was the result of years of work.','The brothers built a plane in twelve seconds.','Long flights are always more important than short ones.'],answer:0,why:'Bài nối nhiều năm học hỏi và thử nghiệm với chuyến bay ngắn nhưng quan trọng.'},
{q:'Why was leaving the ground not enough?',options:['The plane needed a comfortable kitchen.','The pilot also had to control the machine.','The brothers wanted to travel by boat.'],answer:1,why:'Vế A pilot also needed control in the air nêu thách thức điều khiển.'},
{q:'Why did the brothers repair the aircraft?',options:['They wanted to change its colour.','They were preparing it for a museum.','An earlier attempt had been unsuccessful.'],answer:2,why:'Bài nói họ sửa máy bay sau một lần thử không thành công.'},
{q:'Which happened first?',options:['Orville flew for twelve seconds.','Wilbur flew for fifty-nine seconds.','The brothers began years of experiments.'],answer:2,why:'Các thí nghiệm diễn ra trong nhiều năm trước các chuyến bay ngày 17/12/1903.'},
{q:'What does the writer want us to notice?',options:['Success can grow from repeated learning and testing.','Luck makes preparation unnecessary.','A failed attempt means a project must end.'],answer:0,why:'Đoạn cuối nhấn quá trình học, thử nghiệm và làm lại.'}
];
const second={
id:'ingenuity',level:'A2',group:'flight-01',part:'B',order:1,title:'39 giây bay trên một thế giới khác',englishTitle:'A Small Helicopter, a Different World',
hook:'Làm sao lái một chiếc trực thăng khi nó ở trên sao Hỏa?',
note:'Từ hỗ trợ: Mars = sao Hỏa; helicopter = trực thăng; blade = cánh quạt; motor = mô-tơ.',
paragraphs:[
['On April 19, 2021, a small helicopter finally rose above the ground on Mars. Its name was Ingenuity. It stayed in the air for about 39 seconds and reached a height of three metres. It was the first successful powered, controlled flight on another planet. This was a new record, but nobody sat inside the machine.','Ngày 19 tháng 4 năm 2021, một chiếc trực thăng nhỏ cuối cùng cất lên khỏi mặt đất sao Hỏa. Nó tên là Ingenuity. Nó ở trên không khoảng 39 giây và lên cao ba mét. Đây là chuyến bay có động lực, được điều khiển thành công đầu tiên trên hành tinh khác. Đó là một kỷ lục mới, nhưng không có ai ngồi trong cỗ máy.'],
['A pilot on Earth could not fly it like a toy helicopter. The distance was too great: messages needed time to travel between the planets. So the computer on the helicopter had control during the flight. The team sent instructions before it took off. Ingenuity had to follow them by itself.','Phi công trên Trái Đất không thể lái nó như trực thăng đồ chơi. Khoảng cách quá lớn: tín hiệu cần thời gian di chuyển giữa các hành tinh. Vì vậy, máy tính trên trực thăng giữ quyền điều khiển trong chuyến bay. Nhóm gửi chỉ dẫn trước khi nó cất cánh. Ingenuity phải tự làm theo.'],
['Why was this experiment so difficult? The air on Mars is much thinner than the air on Earth. An engineer designing a flying machine for Mars must think carefully about weight, shape, and speed. Wind can also affect the direction of a flight. An ordinary car engine cannot simply turn a car into a Mars helicopter. Ingenuity used electric motors to turn its blades.','Vì sao thử nghiệm này khó đến vậy? Không khí sao Hỏa loãng hơn nhiều so với Trái Đất. Kỹ sư thiết kế máy bay cho sao Hỏa phải cân nhắc kỹ trọng lượng, hình dạng và tốc độ. Gió cũng có thể ảnh hưởng hướng bay. Động cơ ô tô thông thường không thể đơn giản biến ô tô thành trực thăng sao Hỏa. Ingenuity dùng mô-tơ điện để quay cánh quạt.'],
['The team worked for several years to develop the technology and test the equipment. They could not walk over and repair the helicopter after it reached Mars. Its purpose was to show that this kind of flight was possible. To invent something for another world, a dream is only the beginning. The invention must also work in a place where its makers cannot stand beside it. On that April day, a very short flight gave a very big answer.','Nhóm làm việc trong nhiều năm để phát triển công nghệ và kiểm tra thiết bị. Họ không thể bước tới sửa trực thăng sau khi nó đến sao Hỏa. Mục đích của nó là chứng minh kiểu bay này có thể thực hiện. Để phát minh ra thứ dành cho một thế giới khác, ước mơ chỉ là bước khởi đầu. Phát minh còn phải hoạt động ở nơi người tạo ra nó không thể đứng cạnh. Ngày tháng Tư đó, một chuyến bay rất ngắn đem lại câu trả lời rất lớn.']
],
targets:JSON.parse(JSON.stringify(first.targets)),forms:{},
grammar:[
{id:49,example:'The air on Mars is much thinner than the air on Earth.',note:'Thinner than so sánh độ loãng; much nhấn mức chênh lệch. Đây là một lý do việc bay khó hơn.'},
{id:61,example:'The team could not walk over and repair the helicopter.',note:'Could not nói giới hạn khả năng trong tình huống quá khứ. Sau could dùng walk và repair nguyên mẫu.'},
{id:3,example:'It stayed in the air for about 39 seconds.',note:'Stayed là quá khứ đơn, kể một sự kiện đã kết thúc vào ngày 19/4/2021.'}
],
questions:[
{q:'Why could a person on Earth not fly Ingenuity like a toy helicopter?',options:['The helicopter was too colourful.','Messages took time to travel between the planets.','Nobody knew what Mars was.'],answer:1,why:'Khoảng cách làm tín hiệu mất thời gian, nên không thể điều khiển trực tiếp từng chuyển động như đồ chơi.'},
{q:'What controlled the helicopter during its flight?',options:['A pilot sitting inside','A long cable from Earth','Its onboard computer'],answer:2,why:'Máy tính trên trực thăng làm theo chỉ dẫn được gửi trước chuyến bay.'},
{q:'Why does the story mention thin air?',options:['To explain a challenge for flight on Mars','To say Mars has no air at all','To explain why people enjoy holidays there'],answer:0,why:'Không khí loãng là một trong các khó khăn của việc thiết kế máy bay cho sao Hỏa.'},
{q:'What was the main purpose of the first flight?',options:['To carry tourists','To show that this type of flight was possible','To bring the team back to Earth'],answer:1,why:'Ingenuity là thử nghiệm công nghệ, kiểm tra tính khả thi của chuyến bay.'},
{q:'What connects this story with the Wright brothers’ story?',options:['Both first flights lasted exactly twelve seconds.','Both machines had people sitting inside.','Both short flights tested a major new possibility.'],answer:2,why:'Hai chuyến đều ngắn nhưng giải quyết câu hỏi lớn về khả năng bay trong hoàn cảnh mới.'}
],
sources:[['NASA · Ingenuity’s first flight, 19/04/2021','https://www.nasa.gov/news-release/nasas-ingenuity-mars-helicopter-succeeds-in-historic-first-flight/'],['JPL · Ingenuity mission','https://www.jpl.nasa.gov/missions/ingenuity/']]
};
fs.writeFileSync('Oxford/readings.json',JSON.stringify([first,second],null,2));

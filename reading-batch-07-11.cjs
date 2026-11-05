module.exports=function(api){
const {group,story,content,grammarQ}=api;
function exercises(l,items,gs){for(const x of items)content(l,...x);for(const x of gs)grammarQ(l,...x);return l}
const survival=group('survival-07','B2','When getting home becomes the mission',`
crew~noun~phi hành đoàn, thủy thủ đoàn~the people working together on a ship or spacecraft
mission~noun~nhiệm vụ~an important journey or task with a particular aim
emergency~noun~tình huống khẩn cấp~a dangerous situation requiring immediate action
rescue~noun~cuộc giải cứu~the act of bringing someone out of danger
crisis~noun~khủng hoảng~a time of serious danger or difficulty
oxygen~noun~ôxy~the gas in air that people need to breathe
fuel~noun~nhiên liệu~a substance burned to provide energy
resource~noun~nguồn lực~something available that can help achieve an aim
limited~adjective~có hạn~available only in a small amount
essential~adjective~thiết yếu~completely necessary
attempt~noun~nỗ lực, lần thử~an effort to do something difficult
risk~noun~nguy cơ~the possibility that something harmful will happen
pressure~noun~áp lực~demands or difficulties that make a situation stressful
failure~noun~sự thất bại~the lack of success in achieving an aim
manage~verb~xoay xở làm được~to succeed in doing something difficult
practical~adjective~thiết thực~suited to real needs and conditions
adapt~verb~thích nghi~to change to suit a new situation
maintain~verb~duy trì~to keep something at a necessary level
prevent~verb~ngăn chặn~to stop something from happening
recover~verb~hồi phục~to return to a better physical condition
route~noun~tuyến đường~the path taken from one place to another
shelter~noun~chỗ trú ẩn~a place that protects people from danger or weather
remote~adjective~xa xôi~far away from places where help is easily available
dramatic~adjective~đầy kịch tính~involving sudden and striking events or changes
determination~noun~sự quyết tâm~the willingness to keep trying despite difficulty
`);
const apollo=story(survival,'apollo-13','A','Chuyến bay thành cuộc tìm đường về','A Lifeboat Beyond Earth',
`In April 1970, the Apollo 13 [[crew]] expected to land on the Moon. An oxygen tank exploded during the journey, and the [[mission]] changed. Reaching the lunar surface no longer mattered; getting home did. This [[emergency]] happened in a place so [[remote]] that nobody could simply send another vehicle to collect the astronauts. Their [[rescue]] would depend on people in space and on Earth working together under enormous [[pressure]].

The lunar module became a [[shelter]] instead of a landing vehicle. It had its own [[oxygen]], water and power, but these supplies were [[limited]]. A [[resource]] meant for one job now had to serve another. The astronauts needed to [[adapt]], while ground teams developed [[practical]] instructions. They also had to remove carbon dioxide from the air. Filters from the two spacecraft sections did not fit the same equipment, so a solution was built using available materials. What mattered most was keeping the crew alive.

Every [[attempt]] to solve one problem had to take other needs into account. Electrical power was [[essential]], and saving it meant accepting cold conditions. [[Fuel]] was needed for changes to the flight path. The team had to [[maintain]] a safe [[route]] home and [[prevent]] further trouble. A quick decision was not automatically a good decision: it could introduce another [[risk]]. Having abandoned the landing, the astronauts concentrated on returning to Earth.

All three did [[manage]] to return safely on 17 April. Once home, they could [[recover]] from the exhausting trip. Calling Apollo 13 a [[failure]] describes the lost landing, but misses the successful effort to save its crew. The [[dramatic]] journey offers a useful distinction: [[determination]] does not always mean continuing the original plan. In a [[crisis]], it can mean changing the goal and using what is still available.`,
`Tháng 4 năm 1970, phi hành đoàn Apollo 13 dự định hạ cánh xuống Mặt Trăng. Một bình ôxy phát nổ trong hành trình khiến nhiệm vụ thay đổi. Việc đặt chân lên bề mặt Mặt Trăng không còn quan trọng; điều quan trọng là trở về. Tình huống khẩn cấp xảy ra ở nơi xa đến mức không ai có thể đơn giản phái một phương tiện khác tới đón họ. Cuộc giải cứu phụ thuộc vào sự phối hợp giữa những người trong không gian và dưới Trái Đất, trong áp lực rất lớn.

Mô-đun Mặt Trăng trở thành nơi trú ẩn thay vì phương tiện hạ cánh. Nó có ôxy, nước và điện riêng nhưng nguồn cung có hạn. Nguồn lực dành cho một công việc phải phục vụ công việc khác. Phi hành gia cần thích nghi, còn đội mặt đất xây dựng hướng dẫn thiết thực. Họ cũng phải loại bỏ khí cacbonic khỏi không khí. Bộ lọc của hai phần tàu không lắp vừa cùng thiết bị nên họ tạo một giải pháp bằng vật liệu sẵn có. Điều quan trọng nhất là giữ phi hành đoàn sống sót.

Mỗi lần giải quyết một vấn đề phải tính đến các nhu cầu khác. Điện rất thiết yếu; tiết kiệm điện đồng nghĩa với chịu lạnh. Nhiên liệu cần cho việc điều chỉnh đường bay. Nhóm phải duy trì đường về an toàn và ngăn ngừa rắc rối tiếp theo. Quyết định nhanh chưa chắc tốt: nó có thể tạo ra nguy cơ khác. Sau khi từ bỏ việc hạ cánh, các phi hành gia tập trung trở về Trái Đất.

Cả ba đã xoay xở trở về an toàn ngày 17 tháng 4. Về nhà, họ có thể hồi phục sau chuyến đi kiệt sức. Gọi Apollo 13 là thất bại phản ánh mục tiêu hạ cánh không đạt, nhưng bỏ qua nỗ lực cứu người thành công. Hành trình kịch tính này cho thấy một sự phân biệt hữu ích: quyết tâm không phải lúc nào cũng là tiếp tục kế hoạch ban đầu. Trong khủng hoảng, đó có thể là đổi mục tiêu và tận dụng những gì còn lại.`,
[['NASA · Apollo 13 mission details','https://www.nasa.gov/missions/apollo/apollo-13-mission-details/'],['NASA · Apollo 13 accident','https://nssdc.gsfc.nasa.gov/planetary/lunar/ap13acc.html']],
[{id:105,example:'What mattered most was keeping the crew alive.',note:'Câu chẻ với What: What mattered most là chủ ngữ, was nối với thông tin được nhấn mạnh: keeping the crew alive.'},{id:106,example:'Having abandoned the landing, the astronauts concentrated on returning to Earth.',note:'Having + V3 chỉ hành động hoàn tất trước hành động chính. Chủ thể của cả hai hành động đều là the astronauts.'}]);
exercises(apollo,[
['What changed the goal of Apollo 13?','An oxygen tank exploded.','Another spacecraft arrived.','The crew had already landed.','Vụ nổ khiến mục tiêu chuyển sang trở về an toàn.','Không có tàu khác đến đón; đây chính là khó khăn được nêu.','Bài nói họ từ bỏ hạ cánh, không phải đã hạ cánh.'],
['Why was the lunar module useful?','It offered supplies and a temporary refuge.','It had unlimited power.','It could bring a replacement crew.','Nó có ôxy, nước và điện riêng nên được dùng làm nơi trú.','Bài nhấn mạnh nguồn cung có hạn.','Không có chức năng đưa người thay thế trong câu chuyện.'],
['Why did the filters create a problem?','Equipment in the two sections was incompatible.','There was no carbon dioxide to remove.','The crew had thrown away all materials.','Bộ lọc không vừa cùng thiết bị nên cần giải pháp lắp ghép.','Khí cacbonic cần được loại bỏ khỏi không khí.','Giải pháp được làm từ vật liệu sẵn có, không phải đã vứt hết.'],
['What does the paragraph about decisions suggest?','A solution must be checked for effects on other needs.','The fastest decision is always safest.','Fuel and electricity are unlimited.','Mỗi giải pháp phải tính đến điện, nhiên liệu và nguy cơ phát sinh.','Bài nói quyết định nhanh chưa chắc là quyết định tốt.','Nguồn lực hữu hạn là trở ngại chính của chuyến về.'],
['Why is “failure” an incomplete description?','The landing failed, but the crew returned safely.','Apollo 13 landed twice.','The original plan never changed.','Bài phân biệt thất bại về hạ cánh và thành công về cứu người.','Không có lần hạ cánh Mặt Trăng nào trong nhiệm vụ này.','Mục tiêu nhiệm vụ thay đổi ngay sau vụ nổ.']
],[
[105,'Complete: “What mattered most ___ keeping the crew alive.”','was','were','did','Mệnh đề What mattered most được xem như một ý đơn nên dùng was.','Were không hòa hợp với mệnh đề chủ ngữ số ít ở đây.','Did không nối chủ ngữ với cụm keeping để tạo câu chẻ.'],
[105,'Which sentence emphasizes the team’s need using a what-clause?','What the team needed was more time.','What did the team needed was more time.','What the team needed more time.','What the team needed làm chủ ngữ, was nối phần nhấn mạnh.','Mệnh đề danh từ không đảo did; sau did cũng phải là need.','Thiếu động từ chính was nối hai phần câu chẻ.'],
[106,'In “Having abandoned the landing, the astronauts concentrated on returning”, which happened first?','They abandoned the landing.','They concentrated before abandoning it.','They completed both actions tomorrow.','Having + V3 cho biết việc từ bỏ diễn ra trước hành động chính.','Thứ tự này ngược với dấu hiệu having abandoned.','Câu kể quá khứ, không có ý tương lai ngày mai.'],
[106,'Which opening avoids a dangling participle?','Having checked the supplies, the astronauts changed the plan.','Having checked the supplies, the plan changed itself.','Having checked the supplies, the cold became worse.','Astronauts là chủ thể hợp lý vừa kiểm tra vừa đổi kế hoạch.','The plan không thể tự kiểm tra nguồn cung.','The cold không phải chủ thể có thể kiểm tra nguồn cung.']
]);
const endurance=story(survival,'endurance','B','Khi con tàu không còn là đường về','The Ship That Never Came Home',
`Ernest Shackleton left for Antarctica in 1914 with an ambitious [[mission]]: to cross the continent. His ship, Endurance, became trapped in ice and eventually sank. The [[crew]] lost their transport, their familiar [[shelter]] and any realistic chance of completing the original crossing. A planned journey had become an [[emergency]]. If the ship had remained free, the expedition would have faced a very different future.

The men were stranded in a [[remote]] environment with [[limited]] supplies. Air still contained [[oxygen]], unlike the dangerous situation inside a damaged spacecraft, but breathing was only one need. Food, warmth and [[fuel]] were also [[essential]]. They had to [[adapt]] to life on moving ice and [[maintain]] routines while waiting for a chance to leave. In this [[crisis]], a small boat was a precious [[resource]], not merely an accessory carried by a larger ship.

The party eventually reached Elephant Island. From there, Shackleton and five others made an [[attempt]] to reach South Georgia in the James Caird, a small boat. This [[route]] crossed dangerous ocean water. The [[risk]] was enormous, but staying where they were did not offer a reliable path to [[rescue]]. Under such [[pressure]], [[practical]] judgement mattered as much as courage. No amount of confidence could [[prevent]] bad weather. Nor could [[determination]] turn the boat into a comfortable ocean liner.

After reaching South Georgia and crossing its mountainous interior, Shackleton was able to seek help. The men left on Elephant Island were eventually rescued; all 28 members of the Endurance party survived. Only after reaching help could Shackleton organize the rescue. The survivors would have time to [[recover]], although the ship would never return with them. Did they [[manage]] to cross Antarctica as planned? No. Yet judging this [[dramatic]] story only as a [[failure]] would ignore what their changing decisions achieved: they brought the whole Endurance party home alive.`,
`Ernest Shackleton lên đường đến Nam Cực năm 1914 với nhiệm vụ đầy tham vọng: băng qua lục địa. Tàu Endurance mắc trong băng rồi chìm. Thủy thủ đoàn mất phương tiện di chuyển, nơi trú quen thuộc và cơ hội thực tế hoàn thành cuộc vượt lục địa. Chuyến đi theo kế hoạch trở thành tình huống khẩn cấp. Nếu tàu không bị mắc kẹt, đoàn thám hiểm đã đứng trước một tương lai rất khác.

Những người này mắc kẹt trong môi trường xa xôi với nguồn cung hạn chế. Không khí vẫn có ôxy, khác với tình trạng nguy hiểm bên trong một tàu vũ trụ hư hại, nhưng thở chỉ là một nhu cầu. Thức ăn, hơi ấm và nhiên liệu cũng thiết yếu. Họ phải thích nghi với cuộc sống trên băng trôi, duy trì sinh hoạt trong lúc chờ cơ hội rời đi. Trong khủng hoảng này, một chiếc thuyền nhỏ là nguồn lực quý giá, không đơn thuần là vật phụ mang theo tàu lớn.

Đoàn cuối cùng tới đảo Elephant. Từ đó, Shackleton và năm người khác cố đến South Georgia trên chiếc thuyền nhỏ James Caird. Tuyến đi qua vùng biển nguy hiểm. Nguy cơ rất lớn nhưng ở lại cũng không có con đường đáng tin cậy để được cứu. Dưới áp lực ấy, phán đoán thiết thực quan trọng không kém lòng can đảm. Tự tin đến đâu cũng không ngăn được thời tiết xấu. Quyết tâm cũng không biến thuyền thành tàu biển tiện nghi.

Sau khi đến South Georgia và vượt vùng núi bên trong đảo, Shackleton có thể tìm trợ giúp. Những người ở lại đảo Elephant cuối cùng được cứu; cả 28 người thuộc đoàn Endurance sống sót. Chỉ sau khi tìm được trợ giúp, Shackleton mới có thể tổ chức giải cứu. Những người sống sót có thời gian hồi phục, dù con tàu không bao giờ cùng họ trở về. Họ có vượt Nam Cực theo kế hoạch không? Không. Nhưng nếu chỉ đánh giá câu chuyện kịch tính này là thất bại, ta bỏ qua thành quả từ những quyết định thay đổi: đưa cả đoàn Endurance sống sót trở về.`,
[['Royal Museums Greenwich · Ernest Shackleton','https://www.rmg.co.uk/stories/maritime-history/sir-ernest-shackleton?show=conWebDoc.189']],
[{id:83,example:'If the ship had remained free, the expedition would have faced a very different future.',note:'Điều kiện loại 3: If + had + V3, would have + V3; tưởng tượng lại một quá khứ không xảy ra.'},{id:102,example:'Only after reaching help could Shackleton organize the rescue.',note:'Only after đặt đầu câu kéo theo đảo trợ động từ could lên trước chủ ngữ Shackleton; không đảo bên trong cụm after.'}]);
exercises(endurance,[
['What was the original aim?','To cross Antarctica.','To build a town on Elephant Island.','To find the Apollo 13 crew.','Nhiệm vụ năm 1914 là vượt lục địa Nam Cực.','Đảo Elephant là nơi họ tới sau khi mất tàu, không phải mục tiêu xây thị trấn.','Apollo 13 chỉ là phép so sánh về nhu cầu sống còn.'],
['Why did a small boat become especially valuable?','The larger ship was lost.','It could stop all bad weather.','It contained unlimited fuel.','Khi tàu chìm, thuyền nhỏ trở thành nguồn lực để thoát hiểm.','Bài khẳng định không thể ngăn thời tiết xấu bằng tự tin.','Nguồn cung bị hạn chế, không phải vô tận.'],
['Who travelled from Elephant Island toward South Georgia?','Shackleton and five others.','All 28 men in the same small boat.','Only Shackleton, alone.','Bài ghi rõ Shackleton đi cùng năm người khác.','Những người khác ở lại và được giải cứu sau.','Có năm người đồng hành nên không phải đi một mình.'],
['Why does the article distinguish the Endurance party?','The survival statement refers to these 28 people.','It says every Antarctic expedition was safe.','It claims nobody in history died in Antarctica.','Phạm vi là đoàn Endurance, tránh suy rộng sang mọi đoàn thám hiểm.','Một cuộc giải cứu không chứng minh mọi chuyến đi đều an toàn.','Bài không đưa ra nhận định về tất cả người từng tới Nam Cực.'],
['What idea links this story with Apollo 13?','Changing the original goal can save lives.','Success always means keeping the first plan.','A rescue requires no judgement.','Cả hai bỏ mục tiêu ban đầu để ưu tiên sống sót.','Giữ mục tiêu ban đầu không còn khả thi trong hai câu chuyện.','Bài nhấn mạnh phán đoán thiết thực cùng lòng can đảm.']
],[
[83,'Complete the unreal past condition: “If the ship ___ free, the expedition would have faced a different future.”','had remained','will remain','has remain','Điều kiện loại 3 cần had + V3: had remained.','Will remain là tương lai, không phù hợp giả định trái quá khứ.','Has remain vừa sai dạng phân từ vừa không phải quá khứ hoàn thành.'],
[83,'What does the conditional sentence imply?','The ship did not remain free.','The ship definitely remained free.','The ship will be free tomorrow.','Điều kiện trái quá khứ tưởng tượng một tình huống khác thực tế bị mắc băng.','Đây là giả định trái thực tế, không phải xác nhận tàu tự do.','Had remained nói về quá khứ, không dự báo ngày mai.'],
[102,'Complete: “Only after reaching help ___ organize the rescue.”','could Shackleton','Shackleton could','could organize Shackleton','Only after đầu câu yêu cầu could đứng trước chủ ngữ.','Thứ tự chủ ngữ + could dùng khi không có cấu trúc đảo này.','Động từ chính organize phải đứng sau chủ ngữ trong phần còn lại.'],
[102,'Which sentence correctly uses negative inversion?','Never had the crew faced such a situation.','Never the crew had faced such a situation.','Never had faced the crew such a situation.','Never đầu câu: had + chủ ngữ + faced.','Thiếu đảo had lên trước the crew.','Faced phải đi sau chủ ngữ, không chen trước the crew.']
]);
require('./reading-batch-geology.cjs')({...api,exercises});
require('./reading-batch-inventions.cjs')({...api,exercises});
require('./reading-batch-time.cjs')({...api,exercises});
require('./reading-batch-art.cjs')({...api,exercises});
};

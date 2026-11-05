const fs=require('fs');
const lessons=JSON.parse(fs.readFileSync('Oxford/readings.json','utf8'));
const words=s=>s.trim().split('\n').map(line=>{const [word,pos,vi,en]=line.split('|');return {word,pos,vi,en}});
lessons.push({
id:'penicillin',level:'B1',title:'Penicillin — từ phát hiện đến thuốc điều trị',englishTitle:'The Long Journey from a Dish to a Drug',hook:'Nếu phát hiện một chất diệt vi khuẩn hôm nay, ngày mai đã có thể dùng nó làm thuốc chưa?',
note:'Bài lịch sử khoa học. Bacteria = vi khuẩn; mold = nấm mốc; penicillin = một loại kháng sinh. Bài có một số mục A2 dùng để ôn lại.',
paragraphs:[
['In 1928, Alexander Fleming noticed something unusual in his London laboratory. Mold had appeared in a dish containing bacteria. Around it, some bacteria were no longer growing. A tiny change in one dish offered a valuable clue. But a scientific observation and an effective treatment are different things.','Năm 1928, Alexander Fleming nhận thấy điều bất thường trong phòng thí nghiệm ở London. Nấm mốc xuất hiện trong một đĩa chứa vi khuẩn. Quanh nó, một số vi khuẩn không còn phát triển. Một thay đổi nhỏ trong một chiếc đĩa đem lại manh mối quý giá. Nhưng một quan sát khoa học và một phương pháp điều trị hiệu quả là hai việc khác nhau.'],
['The basic question was exciting: could a substance made by mold help sick people? To answer it, researchers needed to examine its effects. Chemical work was essential. They also needed a practical method of making enough material. A powerful effect in a dish did not automatically mean that doctors had a medicine they could use.','Câu hỏi cơ bản rất hấp dẫn: liệu một chất do nấm mốc tạo ra có thể giúp người bệnh? Để trả lời, các nhà nghiên cứu cần xem xét tác dụng của nó. Công việc về hóa học là thiết yếu. Họ cũng cần một phương pháp thực tế để tạo ra đủ chất này. Tác dụng mạnh trong đĩa không tự động có nghĩa là bác sĩ đã có thuốc dùng được.'],
['More than a decade passed before penicillin reached its first clinical use. Howard Florey, Ernst Chain, and their colleagues at Oxford helped turn the finding into medical treatment. Production was a major difficulty. Increasing the supply required effort beyond the original discovery. Progress depended on the work of many people, rather than on a single moment of luck.','Hơn một thập kỷ trôi qua trước khi penicillin được sử dụng lâm sàng lần đầu. Howard Florey, Ernst Chain và đồng nghiệp tại Oxford giúp biến phát hiện thành phương pháp điều trị y khoa. Sản xuất là một khó khăn lớn. Tăng nguồn cung đòi hỏi nỗ lực vượt ra ngoài phát hiện ban đầu. Tiến bộ phụ thuộc vào công việc của nhiều người, chứ không chỉ một khoảnh khắc may mắn.'],
['This history suggests a useful way to think about any new treatment. Ask what evidence supports it, what improvement it offers, and how its safety has been tested. Ask about risk as well as promise. Patients benefit when researchers can connect an interesting finding with reliable practice. That connection is an achievement in its own right.','Lịch sử này gợi ra một cách hữu ích để suy nghĩ về phương pháp điều trị mới. Hãy hỏi bằng chứng nào hỗ trợ nó, nó đem lại cải thiện gì và độ an toàn đã được kiểm tra ra sao. Hỏi cả về rủi ro bên cạnh triển vọng. Người bệnh được lợi khi các nhà nghiên cứu kết nối phát hiện thú vị với thực hành đáng tin cậy. Bản thân sự kết nối đó cũng là một thành tựu.']
],
targets:words(`laboratory|noun|phòng thí nghiệm|a place where scientific tests are carried out
tiny|adjective|rất nhỏ|extremely small
valuable|adjective|quý giá|useful or important
scientific|adjective|thuộc khoa học|relating to systematic study and testing
effective|adjective|hiệu quả|producing the intended result
treatment|noun|phương pháp điều trị|care intended to improve an illness
basic|adjective|cơ bản|forming the starting point
substance|noun|chất|a particular type of material
examine|verb|xem xét kỹ|to study something closely
chemical|adjective|thuộc hóa học|relating to substances and their reactions
essential|adjective|thiết yếu|necessary for something to happen
practical|adjective|khả thi trong thực tế|suitable for real use
method|noun|phương pháp|a particular way of doing something
powerful|adjective|mạnh|having a strong effect
medical|adjective|thuộc y khoa|relating to the treatment of illness
production|noun|sự sản xuất|the process of making something
difficulty|noun|khó khăn|something that makes an activity hard
effort|noun|nỗ lực|energy used to achieve something
progress|noun|tiến bộ|movement towards a better result
evidence|noun|bằng chứng|information that supports a conclusion
improvement|noun|sự cải thiện|a change that makes something better
safety|noun|sự an toàn|the state of being protected from harm
risk|noun|rủi ro|the possibility of harm
benefit|verb|được lợi|to gain something useful
achievement|noun|thành tựu|something worthwhile accomplished through effort`),
forms:{},
grammar:[{id:9,example:'Mold had appeared in a dish containing bacteria.',note:'Had appeared diễn tả việc nấm xuất hiện trước lúc Fleming quan sát. Had + V3 giúp phân biệt hai mốc quá khứ.'},{id:77,example:'Ask how its safety has been tested.',note:'Has been tested là bị động ở hiện tại hoàn thành. Trọng tâm ở việc kiểm tra an toàn và kết quả liên quan hiện tại.'}],
questions:[
{q:'What did Fleming observe near the mold?',options:['Some bacteria stopped growing.','The dish changed into metal.','A finished medicine appeared.'],answer:0,why:'Đoạn đầu mô tả vùng gần nấm mốc có vi khuẩn không còn phát triển.'},
{q:'Why does the text mention production?',options:['To say that discovery was unimportant.','To show that making enough medicine was another challenge.','To suggest no further work was needed.'],answer:1,why:'Đoạn 3 cho thấy đưa phát hiện vào điều trị còn cần giải quyết lượng sản xuất.'},
{q:'In “Patients benefit”, benefit is…',options:['a noun meaning profit','an adjective meaning safe','a verb meaning gain something useful'],answer:2,why:'Patients là chủ ngữ; benefit diễn tả người bệnh được lợi. Bài này học benefit ở vai trò động từ B1.'},
{q:'Which statement is supported by the passage?',options:['An effect in a dish guarantees safety in people.','Only Fleming contributed to penicillin.','Observation and usable treatment are different stages.'],answer:2,why:'Cả bài phân biệt phát hiện với quá trình phát triển thành điều trị; đoạn cuối là câu hỏi suy ngẫm của người biên soạn.'}
],
sources:[['ACS · Discovery and Development of Penicillin','https://www.acs.org/education/whatischemistry/landmarks/flemingpenicillin.html'],['Robert Gaynes · Emerging Infectious Diseases, 2017','https://wwwnc.cdc.gov/eid/article/23/5/16-1556_article']],
prompt:'Viết 3 câu phân biệt một discovery với một effective treatment. Dùng ít nhất một câu bị động.'
});
lessons.push({
id:'earthrise',level:'B2',title:'Đi đến Mặt Trăng, nhìn lại Trái Đất',englishTitle:'A Different View of Home',hook:'Một bức ảnh có thể thay đổi góc nhìn của bạn mà không chứng minh một kết luận khoa học nào không?',
note:'Ngày và hoàn cảnh chụp được kiểm chứng với NASA. Phần bàn về cách diễn giải ảnh là phân tích của người biên soạn, không phải lời kể trực tiếp của phi hành gia.',
paragraphs:[
['On December 24, 1968, Bill Anders took a remarkable photograph during the Apollo 8 mission. The crew was traveling around the Moon when he used his camera to capture Earth above the lunar surface. The picture became known as Earthrise. A distant home appeared within an extraordinary scene: a bright planet surrounded by darkness.','Ngày 24 tháng 12 năm 1968, Bill Anders chụp một bức ảnh đáng chú ý trong sứ mệnh Apollo 8. Phi hành đoàn đang bay quanh Mặt Trăng khi ông dùng máy ảnh ghi lại Trái Đất phía trên bề mặt Mặt Trăng. Bức ảnh được biết đến với tên Earthrise. Quê nhà xa xôi xuất hiện trong khung cảnh khác thường: một hành tinh sáng giữa bóng tối.'],
['Its visual power comes partly from this dramatic difference. From that perspective, the places where people live seem small. The apparent size of Earth in the photograph should not be confused with its actual size. A camera offers a particular view, not every possible view. Nevertheless, such an encounter with a familiar world can shift our attention.','Sức mạnh thị giác của ảnh phần nào đến từ sự khác biệt nổi bật này. Từ góc nhìn đó, những nơi con người sống dường như nhỏ bé. Không nên nhầm kích thước biểu kiến của Trái Đất trong ảnh với kích thước thật. Máy ảnh cho một góc nhìn cụ thể, không phải mọi góc nhìn có thể có. Dẫu vậy, gặp lại thế giới quen thuộc theo cách ấy có thể làm chuyển hướng sự chú ý của ta.'],
['How should we interpret the photograph? One response is emotional: it may inspire a sense of connection. Another is analytical: we can ask what the image actually shows. The distinction matters. An observation can reveal the visible position of Earth relative to the Moon. It cannot, by itself, demonstrate every claim someone makes about the future of our planet.','Ta nên diễn giải bức ảnh thế nào? Một phản ứng mang tính cảm xúc: nó có thể khơi dậy cảm giác gắn kết. Phản ứng khác mang tính phân tích: ta hỏi hình ảnh thực sự cho thấy gì. Sự phân biệt này quan trọng. Một quan sát có thể cho thấy vị trí nhìn thấy của Trái Đất so với Mặt Trăng. Nhưng chỉ riêng nó không thể chứng minh mọi nhận định về tương lai hành tinh.'],
['The significance of Earthrise is therefore worth discussing on more than one level. It records a moment in space exploration, while also inviting reflection on the concept of home. Its potential to raise awareness depends partly on the viewer. Our perception of an image is influenced by what we already know and value.','Vì vậy, ý nghĩa của Earthrise đáng được bàn ở nhiều khía cạnh. Nó ghi lại một thời điểm trong khám phá không gian, đồng thời gợi suy nghĩ về khái niệm quê nhà. Tiềm năng nâng cao nhận thức của ảnh phần nào phụ thuộc người xem. Cách ta cảm nhận một hình ảnh chịu ảnh hưởng bởi điều ta đã biết và coi trọng.'],
['For a reader, this is a useful exercise in objective description. First list what is visible. Then explain what you think it means. That order helps illustrate the difference between evidence and interpretation. Recognition of that difference does not make the picture less moving. It makes the discussion more precise.','Với người đọc, đây là bài tập hữu ích về mô tả khách quan. Trước tiên liệt kê điều nhìn thấy. Sau đó giải thích bạn nghĩ nó có ý nghĩa gì. Trình tự này giúp minh họa sự khác nhau giữa bằng chứng và diễn giải. Nhận ra sự khác nhau ấy không khiến ảnh bớt lay động; nó làm cuộc thảo luận chính xác hơn.']
],
targets:words(`remarkable|adjective|đáng chú ý|unusual enough to deserve attention
mission|noun|sứ mệnh|an organized journey with a specific purpose
crew|noun|phi hành đoàn|the people operating a spacecraft
capture|verb|ghi lại bằng hình ảnh|to record something in a picture
distant|adjective|xa xôi|far away
extraordinary|adjective|khác thường|very unusual or special
visual|adjective|thuộc thị giác|relating to what can be seen
dramatic|adjective|nổi bật, mạnh mẽ|striking enough to attract attention
perspective|noun|góc nhìn|a particular position or way of seeing
apparent|adjective|biểu kiến|seeming to be the case from what is seen
encounter|noun|sự gặp gỡ|an experience of meeting something
shift|verb|chuyển hướng|to move or change position
interpret|verb|diễn giải|to explain what something means
emotional|adjective|thuộc cảm xúc|connected with feelings
inspire|verb|khơi dậy|to encourage a feeling or idea
observation|noun|sự quan sát|something noticed through careful attention
reveal|verb|cho thấy|to make something visible or known
significance|noun|ý nghĩa, tầm quan trọng|the importance of something
exploration|noun|sự khám phá|travel or investigation to learn about a place
concept|noun|khái niệm|an abstract idea
potential|noun|tiềm năng|the possibility of developing an effect
awareness|noun|nhận thức|knowledge that something exists or matters
perception|noun|cách cảm nhận|the way something is understood or experienced
objective|adjective|khách quan|based on facts rather than personal feelings
illustrate|verb|minh họa|to make an idea clearer with an example`),
forms:{},
grammar:[{id:4,example:'The crew was traveling around the Moon when he used his camera.',note:'Was traveling dựng bối cảnh đang diễn ra; used kể hành động xảy ra trong bối cảnh ấy.'},{id:113,example:'It may inspire a sense of connection.',note:'May giới hạn mức khẳng định. Bài không khẳng định mọi người xem đều có cùng phản ứng cảm xúc.'}],
questions:[
{q:'Where was the photograph taken?',options:['From a ship on Earth','From Apollo 8 traveling around the Moon','From a city on Mars'],answer:1,why:'Đoạn 1 đặt sự kiện trong sứ mệnh Apollo 8 quanh Mặt Trăng.'},
{q:'Which statement is an interpretation rather than a directly visible fact?',options:['Earth appears above the lunar surface.','The scene contains darkness.','The picture may inspire a sense of connection.'],answer:2,why:'Cảm giác gắn kết là phản ứng có thể có của người xem, không phải chi tiết nhìn thấy trực tiếp.'},
{q:'What does objective mean in the final paragraph?',options:['Based on facts rather than personal feelings','A goal for a spacecraft','Very far away'],answer:0,why:'Ở đây objective là tính từ bổ nghĩa description, không phải danh từ nghĩa mục tiêu.'},
{q:'Why does the writer use may in “may inspire”?',options:['To make a cautious claim','To refer to the month of May','To prove everyone feels the same'],answer:0,why:'May thể hiện khả năng và giữ chỗ cho sự khác biệt giữa các người xem.'}
],
sources:[['NASA · Apollo 8’s Iconic Earthrise','https://science.nasa.gov/resource/apollo-8s-iconic-earthrise/']],
prompt:'Chọn một bức ảnh bạn biết. Viết một câu mô tả điều thấy được và một câu diễn giải dùng may hoặc might.'
});
lessons.push({
id:'marshmallow',level:'C1',title:'Một viên kẹo có dự đoán được tương lai?',englishTitle:'When a Compelling Story Meets Better Questions',hook:'Nếu hai điều đi cùng nhau, ta đã biết điều nào gây ra điều nào chưa?',
note:'Bài tập trung vào nghiên cứu năm 2018 và tư duy phương pháp. Đây không phải tổng quan toàn bộ nghiên cứu về tự chủ. Phần hướng dẫn đánh giá bằng chứng do người biên soạn viết.',
paragraphs:[
['A child faces a small reward and the possibility of a larger one after waiting. The scene is simple; the underlying question is not. Can early patience predict later achievement? The story is compelling because it seems to offer a visible indicator of a hidden ability. Yet a seemingly simple task may support several explanations. Its credibility depends on the empirical evidence, not on how memorable the story sounds.','Một đứa trẻ đứng trước phần thưởng nhỏ và khả năng nhận phần lớn hơn sau khi chờ. Tình huống đơn giản, nhưng câu hỏi bên dưới thì không. Sự kiên nhẫn lúc nhỏ có dự đoán thành tích về sau không? Câu chuyện hấp dẫn vì dường như đem lại chỉ báo nhìn thấy được cho một năng lực tiềm ẩn. Tuy nhiên, một nhiệm vụ có vẻ đơn giản có thể phù hợp nhiều cách giải thích. Độ đáng tin phụ thuộc bằng chứng thực nghiệm, không phải câu chuyện dễ nhớ đến đâu.'],
['In 2018, Tyler Watts, Greg Duncan, and Haonan Quan revisited this question. In their analysis focused on children whose mothers had not completed college, the correlation between waiting and later achievement was weaker than in earlier work. It became substantially smaller after accounting for family background, early cognitive ability, and the home environment.','Năm 2018, Tyler Watts, Greg Duncan và Haonan Quan xem xét lại câu hỏi này. Trong phân tích tập trung vào trẻ có mẹ chưa tốt nghiệp đại học, tương quan giữa việc chờ đợi và thành tích về sau yếu hơn trong nghiên cứu trước. Nó nhỏ đi đáng kể sau khi tính đến hoàn cảnh gia đình, năng lực nhận thức ban đầu và môi trường ở nhà.'],
['These findings invite scrutiny of the methodology. A measured variable can be associated with another without being its cause. We must differentiate prediction from explanation. If a relationship appears to diminish when background factors are considered, attributing success solely to patience becomes difficult to justify. That does not establish that patience is irrelevant. It limits the conclusion that this particular evidence can sustain.','Các phát hiện này khiến ta cần xem xét kỹ phương pháp. Một biến được đo có thể liên hệ với biến khác mà không gây ra nó. Ta phải phân biệt dự đoán với giải thích. Nếu mối liên hệ dường như giảm đi khi xét các yếu tố nền, việc quy thành công hoàn toàn cho tính kiên nhẫn trở nên khó biện minh. Điều đó không chứng minh kiên nhẫn không liên quan. Nó giới hạn kết luận mà bằng chứng cụ thể này có thể hỗ trợ.'],
['Consider a theoretical intervention that teaches children to wait longer. Would it improve their later lives? An observational association alone cannot answer that question. A systematic test of the intervention would be needed. We should also ask whether a measure has sufficient reliability, whether the conclusion has validity, and whether other researchers can reproduce the relevant pattern. These are general questions for evaluating research, rather than additional findings from the 2018 paper.','Hãy xét một biện pháp can thiệp giả định dạy trẻ chờ lâu hơn. Nó có cải thiện cuộc sống về sau không? Chỉ một mối liên hệ quan sát được chưa trả lời được câu hỏi. Cần kiểm tra biện pháp can thiệp một cách có hệ thống. Ta cũng nên hỏi phép đo có đủ độ tin cậy không, kết luận có giá trị không và nhà nghiên cứu khác có tái tạo được mẫu kết quả liên quan không. Đây là câu hỏi chung để đánh giá nghiên cứu, không phải các phát hiện bổ sung từ bài năm 2018.'],
['A robust reading therefore requires restraint. A statistical result should neither be ignored nor promoted into a universal rule. A preliminary explanation may be useful without being final. Overstating it can undermine understanding and produce a misleading headline. Nonetheless, revisiting an attractive claim is productive: it teaches us which conclusions remain plausible and which require stronger evidence.','Vì vậy, đọc một cách vững vàng đòi hỏi sự tiết chế. Không nên bỏ qua một kết quả thống kê, cũng không nên nâng nó thành quy luật phổ quát. Giải thích sơ bộ có thể hữu ích mà chưa là cuối cùng. Nói quá mức có thể làm suy yếu hiểu biết và tạo tiêu đề gây hiểu lầm. Dẫu vậy, xem xét lại một nhận định hấp dẫn vẫn có ích: nó cho biết kết luận nào còn hợp lý và kết luận nào cần bằng chứng mạnh hơn.']
],
targets:words(`underlying|adjective|nằm bên dưới, nền tảng|forming the less visible basis of something
compelling|adjective|hấp dẫn, có sức thuyết phục|powerful enough to attract serious attention
indicator|noun|chỉ báo|something that points to a condition or trend
seemingly|adverb|có vẻ như|according to how something appears
credibility|noun|độ đáng tin|the quality of being believable
empirical|adjective|dựa trên thực nghiệm|based on observation or measurement
correlation|noun|tương quan|a relationship in how two measures vary
substantially|adverb|đáng kể|to a large degree
cognitive|adjective|thuộc nhận thức|relating to thinking and learning
scrutiny|noun|sự xem xét kỹ|close and careful examination
methodology|noun|hệ phương pháp|the approach and methods used in research
variable|noun|biến số|a measured feature that can take different values
differentiate|verb|phân biệt|to recognize an important difference
diminish|verb|giảm đi|to become smaller or weaker
solely|adverb|hoàn toàn chỉ|only and not for any other reason
theoretical|adjective|mang tính giả định, lý thuyết|considered as an idea rather than an actual test
intervention|noun|biện pháp can thiệp|an action designed to change a situation
systematic|adjective|có hệ thống|following an organized method
reliability|noun|độ tin cậy của phép đo|the consistency of a measurement
validity|noun|tính có giá trị, xác đáng|the extent to which a conclusion or measure is justified
reproduce|verb|tái tạo|to obtain a similar result again
robust|adjective|vững chắc|strong enough to withstand careful examination
restraint|noun|sự tiết chế|control over how far one goes
statistical|adjective|thuộc thống kê|relating to the analysis of numerical data
misleading|adjective|gây hiểu lầm|likely to lead someone to a wrong impression`),
forms:{},
grammar:[{id:113,example:'A seemingly simple task may support several explanations.',note:'Seemingly và may giữ khoảng cách giữa vẻ ngoài, khả năng giải thích và sự chắc chắn. Cấu trúc này quan trọng khi tóm tắt nghiên cứu.'},{id:112,example:'Attributing success solely to patience becomes difficult to justify.',note:'Cụm V-ing attributing… làm chủ ngữ, giúp biến một hành động lập luận thành đối tượng đánh giá. Động từ chính là becomes.'}],
questions:[
{q:'What happened after background factors were taken into account?',options:['The measured association became smaller.','All children waited longer.','The study proved that patience causes success.'],answer:0,why:'Đoạn 2 nói mối tương quan nhỏ đi đáng kể sau khi xét các yếu tố nền.'},
{q:'Which conclusion is most consistent with the passage?',options:['Patience can never matter.','Waiting longer guarantees success.','Prediction alone does not establish causation.'],answer:2,why:'Đoạn 3 yêu cầu phân biệt khả năng dự đoán với giải thích nguyên nhân.'},
{q:'In this context, empirical evidence is evidence based on…',options:['a memorable story','observation or measurement','a personal promise'],answer:1,why:'Empirical nói về quan sát hoặc đo lường, đối lập với việc tin chỉ vì câu chuyện hấp dẫn.'},
{q:'Was a waiting-training intervention tested in the study as described here?',options:['Yes, and it guaranteed success.','No; that paragraph poses a hypothetical methodological question.','Yes, on all children worldwide.'],answer:1,why:'Đoạn 4 ghi rõ đây là can thiệp giả định và câu hỏi chung, không phải phát hiện của nghiên cứu 2018.'}
],
sources:[['Watts, Duncan & Quan (2018) · Psychological Science · DOI 10.1177/0956797618761661','https://pubmed.ncbi.nlm.nih.gov/29799765/']],
prompt:'Viết 3–4 câu phản hồi một tiêu đề “Trẻ chờ lâu chắc chắn thành công”. Dùng correlation, evidence và ít nhất một cách diễn đạt dè dặt.'
});
fs.writeFileSync('Oxford/readings.json',JSON.stringify(lessons,null,2));

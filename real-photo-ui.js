const photoTopicsData = (() => {
  try {
    const el = document.getElementById('photo-topics');
    return el ? JSON.parse(el.textContent) : { readings: {}, readingParagraphs: {}, vocab: {} };
  } catch {
    return { readings: {}, readingParagraphs: {}, vocab: {} };
  }
})();

const photoMemoryCache = new Map();
try {
  const savedPhotos = JSON.parse(localStorage.getItem('ox5-real-photos-v2') || '{}');
  for (const [k, v] of Object.entries(savedPhotos)) {
    if (v && v.url) photoMemoryCache.set(k, v);
  }
} catch {}

function persistPhotoCache() {
  try {
    const obj = {};
    let count = 0;
    for (const [k, v] of photoMemoryCache.entries()) {
      if (v && v.url) {
        obj[k] = v;
        count++;
        if (count >= 700) break;
      }
    }
    localStorage.setItem('ox5-real-photos-v2', JSON.stringify(obj));
  } catch {}
}

const EXACT_WORD_VISUALS = {
  'i':['Self-portrait','Person smiling portrait','Đại từ nhân xưng ngôi thứ nhất số ít "I" (tôi — người đang nói)'],
  'you':['Conversation','Two people talking face to face','Đại từ nhân xưng ngôi thứ hai "you" (bạn / các bạn — người đang nghe)'],
  'we':['Teamwork','Group of friends together','Đại từ nhân xưng ngôi thứ nhất số nhiều "we" (chúng tôi / chúng ta)'],
  'they':['Crowd','Group of people walking','Đại từ nhân xưng ngôi thứ ba số nhiều "they" (họ / chúng)'],
  'a':['Horse','Horse portrait','Dùng "a" trước danh từ đếm được số ít (ví dụ: a horse — một chú ngựa)'],
  'an':['Apple','Red apple fruit','Dùng "an" trước danh từ bắt đầu bằng nguyên âm (ví dụ: an apple — một quả táo)'],
  'the':['Sun','Sunlight sky','Dùng "the" cho sự vật xác định hoặc duy nhất (ví dụ: the sun — mặt trời)'],
  'abandon':['Shipwreck','Abandoned ship','Rời bỏ, bỏ lại (abandon a ship / project)'],
  'ability':['Sign language','People communicating','Khả năng, năng lực thực hiện việc gì (ability to communicate)'],
  'able':['Conversation','Speaking foreign language','Có khả năng làm được việc gì (be able to speak a language)'],
  'abolish':['Parliament','Parliament chamber','Chính thức bãi bỏ một đạo luật hay chế độ (abolish a law/tax)'],
  'about':['Flower','Botanical garden flowers','Về chủ đề gì đó (a book about flowers) hoặc khoảng chừng ($10)'],
  'above':['Bookshelf','Wooden bookshelf','Ở vị trí cao hơn, phía trên (on the shelf above)'],
  'abroad':['Passport','International airport passport','Ở nước ngoài, đi du lịch hoặc du học nước ngoài (travel/study abroad)'],
  'absence':['Chair','Empty office desk chair','Sự vắng mặt (in somebody’s absence)'],
  'absent':['Classroom','Empty classroom desk','Vắng mặt tại lớp học hoặc nơi làm việc (absent from work/school)'],
  'absorb':['Leaf','Green leaf water drops','Hấp thụ chất lỏng hoặc khí (Plants absorb carbon dioxide)'],
  'abstract':['Abstract art','Modern art gallery','Trừu tượng, dựa trên ý niệm (abstract art / ideas)'],
  'abundance':['Wildlife','Savanna wildlife herd','Sự dồi dào, phong phú (an abundance of wildlife)'],
  'academic':['University','University lecture hall','Thuộc về học thuật, đại học (academic standards)'],
  'academy':['Royal Academy of Music','Music conservatory building','Học viện chuyên ngành (Royal Academy of Music)'],
  'accelerate':['Speedometer','Train high speed','Tăng tốc, diễn ra nhanh hơn (accelerate speed/growth)'],
  'accent':['Speech','Microphone speaking','Giọng điệu, âm sắc vùng miền khi phát âm (a regional accent)'],
  'accept':['Handshake','Business handshake gift','Chấp nhận, đồng ý nhận (accept an offer/gift)'],
  'access':['Laptop','Wi-Fi internet laptop','Quyền truy cập hoặc lối vào (high-speed internet access)'],
  'accident':['Traffic collision','Road safety ambulance','Tai nạn bất ngờ, sự cố giao thông (a traffic accident)'],
  'accommodation':['Hotel','Hotel room interior','Chỗ ở, nơi lưu trú khi đi xa (hotel accommodation)'],
  'accompany':['Piano','Violin and piano duet','Đi cùng hoặc đệm đàn cho ai (accompany a singer on the piano)'],
  'accomplish':['Mountaineering','Climber mountain summit','Hoàn thành, đạt được mục tiêu (accomplish a goal)'],
  'account':['Bank','Bank passbook savings','Tài khoản ngân hàng hoặc bản tường thuật (a bank account)'],
  'accurate':['Archery','Bullseye target','Chính xác, đúng đắn (accurate information / aim)'],
  'accuse':['Courtroom','Gavel courtroom justice','Buộc tội, cáo buộc (accuse somebody of a crime)'],
  'achieve':['Medal','Olympic gold medal','Đạt được thành tựu sau nỗ lực (achieve success/goals)'],
  'achievement':['Trophy','Graduation cap celebration','Thành tựu, kết quả đạt được (a proud achievement)'],
  'acid':['Citrus','Lemon citrus fruit','Chất axit, vị chua (citric acid in lemons)'],
  'acknowledge':['Letter (message)','Signing letter mail','Thừa nhận hoặc xác nhận đã nhận thư (acknowledge receipt)'],
  'acquire':['Art museum','Museum painting gallery','Đạt được, thu nhận kiến thức hoặc tài sản (acquire a painting/skill)'],
  'across':['Pedestrian crossing','Bridge across river','Băng qua từ bên này sang bên kia (walk across the street/bridge)'],
  'act':['Theatre','Stage actor theatre','Hành động hoặc biểu diễn trên sân khấu (act in a play)'],
  'action':['Firefighting','Firefighter in action','Hành động khẩn trương (take prompt action)'],
  'active':['Jogging','People jogging in park','Năng động, tích cực vận động (stay physically active)'],
  'activity':['Camping','Outdoor recreational activity','Hoạt động học tập, vui chơi hoặc ngoại khóa (outdoor activities)'],
  'actor':['Actor','Stage theatre performance','Nam diễn viên sân khấu hoặc điện ảnh (a theatre/film actor)'],
  'actress':['Actress','Film production camera','Nữ diễn viên (a leading actress)'],
  'actual':['Tape measure','Measuring tape ruler','Thực tế, có thật (the actual size/cost)'],
  'actually':['Conversation','Two people talking','Thực ra, trên thực tế (what actually happened)'],
  'adapt':['Arctic fox','Arctic fox winter coat','Thích nghi với môi trường mới (adapt to a new climate)'],
  'add':['Cooking','Adding spices cooking','Thêm vào, cộng thêm (add salt to the water)'],
  'addition':['Construction','Building extension construction','Phần thêm vào, phép cộng (in addition to)'],
  'additional':['Baggage','Suitcases travel luggage','Bổ sung, thêm vào (additional information/cost)'],
  'address':['House numbering','Street sign house number','Địa chỉ nhà hoặc bài phát biểu (write down the address)'],
  'adequate':['First aid kit','Emergency supplies kit','Đầy đủ, đáp ứng đủ nhu cầu (adequate supplies/training)'],
  'adjust':['Eyeglasses','Adjusting camera lens','Điều chỉnh cho phù hợp (adjust the mirror/seat)'],
  'administration':['Government building','Public administration office','Sự quản lý, cơ quan hành chính (business/public administration)'],
  'admire':['Landscape','Person looking at mountain view','Ngưỡng mộ, ngắm nhìn vẻ đẹp (admire the view)'],
  'admit':['Ticket (admission)','Cinema admission ticket','Thừa nhận hoặc cho phép vào cửa (admit to a concert)'],
  'adopt':['Adoption','Family holding child hands','Nhận nuôi hoặc áp dụng phương pháp mới (adopt a child / new policy)'],
  'adult':['Adult','Adults walking in city','Người trưởng thành (adults and children)'],
  'advance':['Laboratory','Science laboratory research','Tiến bộ, tiến lên phía trước (scientific advances)'],
  'advanced':['Robotics','Modern laboratory microscope','Tiên tiến, ở trình độ cao (advanced technology)'],
  'advantage':['Bicycle','Cycling city traffic','Lợi thế, ưu điểm (give somebody an advantage)'],
  'adventure':['Kayaking','Mountain hiking adventure','Cuộc phiêu lưu, khám phá mạo hiểm (an exciting adventure)'],
  'advertise':['Billboard','Times Square billboards','Quảng cáo sản phẩm, dịch vụ (advertise a product)'],
  'advertisement':['Poster','Vintage advertising poster','Mẫu quảng cáo trên báo, biển hiệu (a newspaper advertisement)'],
  'advertising':['Neon sign','Commercial advertising signs','Ngành hoặc hoạt động quảng cáo (the advertising industry)'],
  'advice':['Physician','Doctor advising patient','Lời khuyên hữu ích (ask for medical advice)'],
  'advise':['Consultation','Lawyer advising client','Khuyên bảo, tư vấn (advise somebody to do something)'],
  'affair':['Newspaper','International conference diplomacy','Sự việc, vấn đề thời sự (world/current affairs)'],
  'affect':['Drought','Rain on crops field','Ảnh hưởng, tác động đến (weather affects crops)'],
  'afford':['Piggy bank','House keys and coins','Đủ khả năng chi trả (afford to buy a house)'],
  'afraid':['Thunderstorm','Child looking at storm clouds','Sợ hãi, lo lắng (afraid of the dark / heights)'],
  'after':['Sunset','Runners finishing race','Sau khi, ở phía sau (after work / after the rain)'],
  'afternoon':['Afternoon','Sunny park afternoon','Buổi chiều (in the afternoon)'],
  'afterwards':['Coffeehouse','Friends talking after meal','Sau đó, về sau (go for coffee afterwards)'],
  'again':['Sunrise','Sunrise over horizon','Lại một lần nữa (try again)'],
  'against':['Rowing','Umbrella against wind','Chống lại, ngược chiều hoặc tựa vào (lean against the wall)'],
  'age':['Dendrochronology','Growth rings tree trunk','Tuổi tác hoặc thời đại lịch sử (at the age of)'],
  'aged':['Old age','Elderly couple walking','Ở độ tuổi... hoặc cao tuổi (aged 10 to 14)'],
  'agency':['Travel agency','Travel agency storefront','Cơ quan, đại lý dịch vụ (a travel/news agency)'],
  'agenda':['Meeting','Notebook and pen on conference table','Chương trình nghị sự, nội dung cuộc họp (top of the agenda)'],
  'agent':['Real estate broker','Real estate agent showing house','Người đại diện, nhân viên đại lý (a travel/estate agent)'],
  'aggressive':['Dog','Growling dog teeth','Hung hăng, quyết liệt (aggressive behaviour)'],
  'ago':['Fossil','Ammonite fossil rock','Cách đây về trước trong quá khứ (millions of years ago)'],
  'agree':['Handshake','Two people shaking hands','Đồng ý, thống nhất ý kiến (agree on a plan)'],
  'agreement':['Contract','Signing a contract pen','Hợp đồng, sự thỏa thuận (sign an agreement)'],
  'agriculture':['Agriculture','Tractor farming field','Nông nghiệp, trồng trọt chăn nuôi (modern agriculture)'],
  'ahead':['Road','Straight highway ahead','Ở phía trước, tiến về trước (the road ahead)'],
  'aid':['Humanitarian aid','First aid rescue supply','Sự cứu trợ, giúp đỡ (humanitarian/medical aid)'],
  'aim':['Archery','Archer aiming bow','Mục tiêu hoặc nhắm vào đích (aim at a target)'],
  'air':['Atmosphere of Earth','Clouds in blue sky','Không khí, bầu khí quyển (fresh mountain air)'],
  'aircraft':['Airplane','Commercial airliner in flight','Máy bay, phương tiện bay (a passenger aircraft)'],
  'airline':['Airline','Passenger airplanes at airport gate','Hãng hàng không (an international airline)'],
  'airport':['Airport','Airport control tower and runway','Sân bay, cảng hàng không (arrive at the airport)'],
  'alarm':['Alarm clock','Classic twin bell alarm clock','Chuông báo thức hoặc còi báo động (set the alarm clock)'],
  'album':['Album','Vinyl record album sleeve','Album nhạc hoặc cuốn album ảnh (release a new album)'],
  'alcohol':['Wine','Wine glasses bottle','Đồ uống có cồn, rượu bia (avoid alcohol)'],
  'alcoholic':['Cocktail','Bottles at a bar','Có chứa cồn (alcoholic drinks)'],
  'alert':['Lifeguard','Lifeguard watching ocean','Cảnh giác, tỉnh táo hoặc thông báo khẩn (stay alert)'],
  'alike':['Twins','Identical twins smiling','Giống nhau, tương tự nhau (look very much alike)'],
  'alive':['Seedling','Green plant sprouting from soil','Còn sống, tràn đầy sức sống (keep a plant alive)'],
  'all':['Earth','Crowds of people globe','Tất cả, toàn bộ (all over the world)'],
  'allow':['Traffic light','Green traffic signal pedestrian','Cho phép (allow somebody to enter)'],
  'almost':['Finish line','Runner near finish line','Gần như, suýt nữa (almost finished)'],
  'alone':['Beach','Single person on quiet beach','Một mình, đơn độc (live/travel alone)'],
  'along':['Trail','Footpath along a river','Dọc theo con đường, bờ sông (walk along the beach)'],
  'already':['Train station','Train departing platform','Đã... rồi (the train has already left)'],
  'also':['Fruit','Apples and oranges in basket','Cũng, ngoài ra (speak French and also German)'],
  'alter':['Tailor','Tailor sewing garment','Thay đổi, chỉnh sửa (alter a dress/plan)'],
  'alternative':['Solar panel','Wind turbines and solar panels','Sự lựa chọn thay thế (alternative energy sources)'],
  'although':['Rainbow','Sunlight through storm clouds','Mặc dù (although it was raining)'],
  'always':['Lighthouse','Lighthouse beam at night','Luôn luôn, mọi lúc (the sun always rises in the east)'],
  'amaze':['Fireworks','Fireworks display night sky','Làm kinh ngạc, sửng sốt (amaze the audience)'],
  'amazing':['Aurora','Northern lights aurora borealis','Tuyệt vời, đáng kinh ngạc (an amazing view)'],
  'ambition':['Astronaut','Astronaut in spacesuit','Hoài bão, khát vọng lớn (achieve a lifelong ambition)'],
  'ambulance':['Ambulance','Emergency ambulance vehicle','Xe cứu thương (call an ambulance)'],
  'among':['Wildflower','Red poppy among wheat field','Ở giữa nhiều người hoặc vật (hidden among the trees)'],
  'amount':['Measuring cup','Coins and banknotes pile','Lượng, số lượng (a large amount of money/water)'],
  'analyse':['Laboratory','Scientist analysing sample in lab','Phân tích kỹ lưỡng (analyse data/samples)'],
  'analysis':['Microscope','Chemical analysis laboratory','Sự phân tích, kết quả phân tích (scientific analysis)'],
  'ancient':['Parthenon','Ancient Greek temple ruins','Cổ đại, lâu đời (an ancient civilization/temple)'],
  'angry':['Thunderstorm','Person frowning in traffic','Tức giận (angry with somebody)'],
  'animal':['Wildlife','African elephant in savanna','Động vật, thú vật (wild and domestic animals)'],
  'ankle':['Ankle','Runner tying shoe near ankle','Mắt cá chân, cổ chân (sprain your ankle)'],
  'announce':['Press conference','Speaker at microphones','Thông báo công khai (announce a decision/winner)'],
  'annoy':['Mosquito','Mosquito on skin','Làm phiền, chọc tức (annoy the neighbours)'],
  'annual':['National Cherry Blossom Festival','Cherry blossoms spring bloom','Hằng năm, thường niên (an annual festival/report)'],
  'answer':['Classroom','Student raising hand in class','Câu trả lời, giải đáp (answer a question)'],
  'anxious':['Waiting room','Person waiting at exam hall','Lo âu, bồn chồn (anxious about the exam results)'],
  'apart':['Jigsaw puzzle','Jigsaw puzzle pieces apart','Tách rời, cách nhau (live miles apart / take something apart)'],
  'apartment':['Apartment','Modern apartment building exterior','Căn hộ chung cư (rent a two-bedroom apartment)'],
  'apologize':['Flower bouquet','Offering flowers apology','Xin lỗi (apologize for being late)'],
  'appear':['Sunrise','Sun appearing over mountains','Xuất hiện hoặc có vẻ như (a ship appeared on the horizon)'],
  'apple':['Apple','Fresh red apples on tree','Quả táo (peel an apple)'],
  'application':['Job interview','Filling out application form','Đơn xin việc/nhập học hoặc ứng dụng (submit an application)'],
  'apply':['Paintbrush','Applying paint with brush','Nộp đơn xin hoặc áp dụng, bôi lên (apply for a job)'],
  'appointment':['Calendar','Dentist appointment calendar','Cuộc hẹn khám bệnh hoặc làm việc (make a dentist appointment)'],
  'appreciate':['Applause','Audience applauding performance','Trân trọng, đánh giá cao hoặc cảm kích (appreciate your help)'],
  'approach':['Runway','Airplane approaching runway','Tiếp cận, đến gần hoặc phương pháp (approach the airport)'],
  'architect':['Architect','Architect reviewing blueprints','Kiến trúc sư (designed by a famous architect)'],
  'architecture':['Gothic architecture','Cathedral vaulted ceiling architecture','Kiến trúc, nghệ thuật thiết kế công trình (modern/classical architecture)'],
  'argue':['Debate','Two speakers debating podium','Tranh luận, cãi nhau hoặc lập luận (argue about politics)'],
  'army':['Terracotta Army','Soldiers marching formation','Quân đội, lục quân (join the army)'],
  'arrange':['Flower bouquet','Florist arranging flowers','Sắp xếp, thu xếp hoặc cắm hoa (arrange a meeting / arrange flowers)'],
  'arrest':['Handcuffs','Police car lights','Bắt giữ theo pháp luật (arrest a suspect)'],
  'arrive':['Train station','Passenger train arriving station','Đến nơi (arrive at the station on time)'],
  'art':['Painting','Painter palette and canvas','Nghệ thuật, hội họa (a work of art)'],
  'article':['Newspaper','Newspaper columns print','Bài báo, điều khoản hoặc đồ vật (read a newspaper article)'],
  'artist':['Artist','Artist painting on easel in studio','Nghệ sĩ, họa sĩ (a contemporary artist)'],
  'ash':['Volcanic ash','Campfire wood ash','Tro bụi sau khi cháy hoặc tro núi lửa (volcanic ash)'],
  'asleep':['Sleep','Sleeping cat on cushion','Đang ngủ (fall fast asleep)'],
  'assist':['Physical therapy','Nurse assisting elderly person','Hỗ trợ, giúp đỡ (assist the doctor during surgery)'],
  'atmosphere':['Atmosphere of Earth','Earth atmosphere seen from space','Bầu khí quyển hoặc bầu không khí tại một nơi (the Earth’s atmosphere)'],
  'attach':['Paper clip','Paper clip attached to documents','Đính kèm, gắn vào (attach a file/label)'],
  'attempt':['Wright Glider','Mountain climber attempting summit','Nỗ lực, cố gắng thử làm việc khó (make an attempt to climb)'],
  'attend':['Lecture','Students attending university lecture','Tham dự, có mặt tại buổi học/họp (attend a conference)'],
  'attract':['Magnet','Butterfly on nectar flower','Thu hút, hấp dẫn (flowers attract bees)'],
  'audience':['Audience','Concert hall audience applauding','Khán giả, thính giả trong rạp (a live theatre audience)'],
  'author':['Writer','Author writing book at desk','Tác giả sách, bài viết (the author of a bestseller)'],
  'autumn':['Autumn','Autumn leaves orange trees','Mùa thu (autumn leaves falling)'],
  'average':['Thermometer','Measuring tape height chart','Trung bình, mức bình thường (above/below average temperatures)'],
  'avoid':['Detour','Cyclist avoiding pothole road','Tránh xa, ngăn ngừa không để xảy ra (avoid heavy traffic)'],
  'award':['Trophy','Golden trophy statuette','Giải thưởng hoặc trao thưởng (win a prestigious award)'],
  'baby':['Infant','Newborn baby sleeping','Em bé sơ sinh, con non (a newborn baby)'],
  'bake':['Baking','Fresh bread baking in oven','Nướng bánh bằng lò (bake fresh bread)'],
  'balance':['Tightrope walking','Balance scale equilibrium','Sự cân bằng, giữ thăng bằng hoặc số dư (keep your balance)'],
  'ball':['Ball','Soccer ball on grass','Quả bóng trò chơi thể thao (kick the ball)'],
  'banana':['Banana','Bunch of ripe yellow bananas','Quả chuối (a bunch of bananas)'],
  'band':['Musical ensemble','Live rock band on stage','Ban nhạc hoặc dải băng (play in a brass/rock band)'],
  'bank':['Bank','Historic bank building columns','Ngân hàng hoặc bờ sông (deposit money in a bank)'],
  'bar':['Chocolate bar','Bar of dark chocolate','Thanh (sô-cô-la, kim loại) hoặc quầy phục vụ đồ uống (a bar of chocolate)'],
  'barrier':['Thames Barrier','Flood barrier gates across river','Rào chắn, đập ngăn hoặc rào cản (a flood/language barrier)'],
  'basketball':['Basketball','Basketball hoop court game','Môn bóng rổ (play basketball)'],
  'bat':['Bat','Fruit bat flying at night','Con dơi hoặc gậy bóng chày/cricket (a bat flying at night)'],
  'bath':['Bathtub','White porcelain bathtub bathroom','Bồn tắm hoặc việc tắm bồn (have a hot bath)'],
  'bathroom':['Bathroom','Modern clean bathroom sink mirror','Phòng tắm, nhà vệ sinh (wash your hands in the bathroom)'],
  'battery':['Electric battery','AA batteries and charger','Pin tích điện cho thiết bị (recharge the battery)'],
  'beach':['Beach','Sandy beach ocean waves','Bãi biển cát trắng (walk along the sandy beach)'],
  'bean':['Coffee bean','Cocoa and coffee beans','Hạt đậu, hạt cà phê hoặc ca cao (cocoa/coffee beans)'],
  'bear':['Brown bear','Brown bear catching salmon','Con gấu hoặc chịu đựng, mang vác (a polar/brown bear)'],
  'beat':['Drum','Hands playing djembe drum','Đánh nhịp trống, nhịp tim đập hoặc đánh bại (the beat of a drum)'],
  'beautiful':['Sunset','Beautiful mountain lake reflection','Đẹp, tươi đẹp (a beautiful sunset)'],
  'bed':['Bed','Comfortable bedroom bed pillows','Chiếc giường ngủ hoặc lòng sông, luống hoa (go to bed)'],
  'bedroom':['Bedroom','Cozy sunlit bedroom interior','Phòng ngủ (a quiet upstairs bedroom)'],
  'bee':['Honey bee','Honey bee on yellow flower','Con ong mật (a bee collecting nectar)'],
  'beef':['Beef','Raw beef steak cut','Thịt bò (roast beef)'],
  'beer':['Beer','Glass of draft beer foam','Bia (a glass of cold beer)'],
  'boil':['Boiling','Water boiling in pot','Đun sôi nước hoặc thực phẩm (Water boils at 100°C)'],
  'borrow':['Library','Borrowing a book from library','Mượn đồ vật hoặc sách (borrow a book from the library)'],
  'lend':['Library','Handing over a book','Cho mượn (lend a book to a friend)'],
  'invent':['Steam engine','Early aircraft invention','Phát minh ra thứ mới chưa từng có (invent the steam engine)'],
  'invention':['Incandescent light bulb','Historical patent invention','Phát minh, sáng chế mới (a useful invention)'],
  'repair':['Auto mechanic','Repairing bicycle wheel','Sửa chữa đồ vật, máy móc bị hỏng (repair the aircraft/bicycle)'],
  'climb':['Rock climbing','Mountaineer climbing peak','Leo trèo lên núi, thang hoặc cây (climb a mountain)'],
  'swim':['Swimming (sport)','Swimmer in pool','Bơi lội dưới nước (swim across the lake)'],
  'fly':['Airplane','Bird or aircraft flying in sky','Bay trên không trung (fly an aircraft)'],
  'drive':['Driving','Hands on car steering wheel','Lái xe ô tô, phương tiện (drive carefully)'],
  'ride':['Cycling','Person riding a bicycle','Cưỡi ngựa hoặc đi xe đạp, xe máy (ride a bicycle/horse)'],
  'sail':['Sailing','Sailboat under full sail','Đi thuyền buồm vượt biển (sail across the ocean)'],
  'dive':['Scuba diving','Scuba diver underwater coral','Lặn xuống nước (dive into the sea)'],
  'jump':['High jump','Athlete jumping over bar','Nhảy bật lên cao hoặc qua chướng ngại vật (jump over the fence)'],
  'run':['Running','Runner sprinting on track','Chạy bộ hoặc vận hành (run a marathon)'],
  'walk':['Walking','People walking on park path','Đi bộ, dạo bước (walk in the park)'],
  'dance':['Dance','Ballroom dancers on stage','Nhảy múa, khiêu vũ (dance to the music)'],
  'sing':['Singing','Singer at microphone','Ca hát (sing a song)'],
  'laugh':['Laughter','Friends laughing together','Cười tươi vui vẻ (laugh out loud)'],
  'cry':['Tears','Child crying with tears','Khóc hoặc kêu lớn (cry with joy/sadness)'],
  'smile':['Smile','Warm friendly smile','Mỉm cười (a warm smile)'],
  'sleep':['Sleep','Person sleeping peacefully','Ngủ nghỉ (get eight hours of sleep)'],
  'wake':['Alarm clock','Morning sunlight bedroom','Thức dậy sau giấc ngủ (wake up early)'],
  'wash':['Hand washing','Washing hands with soap and water','Rửa sạch bằng nước và xà phòng (wash your hands)'],
  'clean':['Cleaning','Cleaning window glass','Làm sạch, dọn dẹp gọn gàng (keep the kitchen clean)'],
  'sweep':['Broom','Sweeping floor with broom','Quét nhà, quét sàn bằng chổi (sweep the floor)'],
  'fold':['Origami','Folding paper or clothes','Gấp giấy hoặc quần áo gọn gàng (fold the paper in half)'],
  'tie':['Knot','Tying shoelaces or rope knot','Buộc dây, thắt nút (tie a knot / tie your shoes)'],
  'pour':['Tea','Pouring hot tea into cup','Rót, đổ chất lỏng (pour a cup of coffee)'],
  'stir':['Soup','Wooden spoon stirring pot','Khuấy đều món ăn hoặc đồ uống (stir the soup)'],
  'chop':['Cutting board','Chopping vegetables with knife','Thái, chặt nhỏ nguyên liệu (chop the onions)'],
  'slice':['Bread','Sliced loaf of bread','Cắt thành từng lát mỏng (slice the bread)'],
  'peel':['Orange (fruit)','Peeling orange skin','Gọt vỏ trái cây, củ quả (peel an apple/orange)'],
  'melt':['Ice','Melting ice cube in sun','Tan chảy từ rắn sang lỏng (snow melts in spring)'],
  'freeze':['Icicle','Frozen lake ice crystals','Đóng băng khi nhiệt độ xuống thấp (water freezes at 0°C)'],
  'burn':['Campfire','Burning wood logs fire','Cháy hoặc đốt cháy tạo nhiệt và ánh sáng (wood burns in the fire)'],
  'float':['Hot air balloon','Boat floating on calm water','Nổi trên mặt nước hoặc lơ lửng trong không khí (wood floats on water)'],
  'sink':['Shipwreck','Stone sinking in water','Chìm xuống dưới nước (the ship sank in 1915)'],
  'dig':['Spade','Spade digging garden soil','Đào đất bằng xẻng (dig a hole in the garden)'],
  'plant':['Tree planting','Planting a young tree in soil','Trồng cây, gieo hạt xuống đất (plant a tree)'],
  'harvest':['Harvest','Combine harvester wheat field','Thu hoạch mùa màng (harvest the crops)'],
  'sew':['Sewing machine','Sewing fabric with needle and thread','Khâu vá, may quần áo (sew a button on a shirt)'],
  'knit':['Knitting','Knitting wool yarn with needles','Đan len (knit a warm sweater)'],
  'weave':['Loom','Weaving cloth on handloom','Dệt vải trên khung cửi (weave cloth)'],
  'carve':['Wood carving','Carving wood or stone sculpture','Chạm khắc gỗ hoặc đá (carve a statue)'],
  'paint':['Painting','Artist brush painting on canvas','Sơn hoặc vẽ tranh màu (paint a picture)'],
  'draw':['Drawing','Pencil sketching on paper','Vẽ phác thảo hoặc kéo ra (draw a portrait)'],
  'weigh':['Weighing scale','Weighing fruit on market scale','Cân trọng lượng (weigh the ingredients)'],
  'measure':['Tape measure','Measuring wood with ruler','Đo kích thước, chiều dài, nhiệt độ (measure the distance)'],
  'count':['Abacus','Counting coins on table','Đếm số lượng (count from one to ten)'],
  'pack':['Suitcase','Packing clothes into suitcase','Đóng gói hành lý, đồ đạc (pack your bags)'],
  'wrap':['Gift wrapping','Gift box wrapped with ribbon','Gói quà hoặc bọc kín (wrap a birthday present)'],
  'lock':['Padlock','Metal padlock and key','Khóa lại bằng ổ khóa (lock the door)'],
  'unlock':['Key (lock)','Inserting key into door lock','Mở khóa (unlock the gate)'],
  'push':['Door','Pushing heavy wooden door','Đẩy về phía trước (push the button/door)'],
  'pull':['Tug of war','Pulling a heavy rope','Kéo về phía mình (pull the rope)'],
  'lift':['Weightlifting','Crane lifting heavy container','Nhấc bổng lên cao hoặc thang máy (lift a heavy box)'],
  'drop':['Drop (liquid)','Water drop falling into pond','Làm rơi hoặc giọt chất lỏng (drop a glass)'],
  'throw':['Baseball','Throwing a ball','Ném, quăng đi (throw the ball)'],
  'catch':['Baseball glove','Catching a ball in mid-air','Bắt lấy, chụp lấy (catch the ball / catch a train)'],
  'kick':['Association football','Player kicking football','Đá bằng chân (kick the ball into the goal)'],
  'hit':['Tennis','Tennis racket hitting ball','Đánh trúng, va chạm (hit the ball with a racket)'],
  'knock':['Door knocker','Hand knocking on wooden door','Gõ cửa (knock on the door)'],
  'clap':['Applause','Hands clapping applause','Vỗ tay tán thưởng (clap your hands)'],
  'shake':['Handshake','Shaking hands greeting','Bắt tay hoặc lắc mạnh (shake hands / shake the bottle)'],
  'nod':['Nod (gesture)','Person nodding in agreement','Gật đầu đồng ý (nod your head)'],
  'point':['Pointing','Finger pointing at map','Chỉ tay về hướng hoặc điểm (point at the map)'],
  'stare':['Human eye','Close-up of eyes looking intently','Nhìn chằm chằm (stare out of the window)'],
  'whisper':['Whispering','Child whispering in ear','Thì thầm nhỏ tiếng (whisper a secret)'],
  'shout':['Megaphone','Person shouting through megaphone','Hét lớn, gọi to (shout for help)'],
  'yawn':['Yawn','Person or lion yawning','Ngáp vì buồn ngủ hoặc mệt (stifle a yawn)'],
  'sneeze':['Sneeze','Person sneezing into tissue','Hắt hơi (sneeze into a handkerchief)'],
  'cough':['Cough','Person coughing hand over mouth','Ho (a dry cough)'],
  'breathe':['Breathing','Hiker breathing fresh mountain air','Hít thở không khí (breathe deeply)'],
  'smell':['Rose','Smelling fragrant rose flower','Ngửi mùi hương (smell the flowers)'],
  'taste':['Wine tasting','Chef tasting soup with spoon','Nếm vị thức ăn (taste the soup)'],
  'touch':['Braille','Fingers touching texture or Braille','Chạm tay vào bề mặt (do not touch the wet paint)'],
  'listen':['Headphones','Person listening with headphones','Lắng nghe âm thanh, âm nhạc (listen carefully to music)'],
  'watch':['Binoculars','Watching birds through binoculars','Quan sát, theo dõi hoặc đồng hồ đeo tay (watch the sunset)'],
  'search':['Magnifying glass','Search and rescue team with dog','Tìm kiếm kỹ lưỡng (search for clues)'],
  'discover':['Telescope','Archaeologist discovering artifact','Khám phá, phát hiện ra điều mới (discover a new planet)'],
  'explore':['Cave','Explorer inside limestone cave','Thám hiểm, khám phá vùng đất mới (explore the cave)'],
  'rescue':['Lifeboat (rescue)','Coast guard helicopter rescue','Cứu hộ người gặp nạn (rescue survivors at sea)'],
  'protect':['Umbrella','Hard hat safety helmet','Bảo vệ khỏi nguy hiểm, hư hại (protect your eyes from the sun)'],
  'save':['Piggy bank','Lifeguard saving swimmer','Tiết kiệm tiền hoặc cứu giúp, lưu trữ (save money / save a life)'],
  'waste':['Food waste','Litter and overflowing trash bin','Lãng phí hoặc rác thải (don’t waste water/food)'],
  'recycle':['Recycling','Recycling bins for paper glass plastic','Tái chế vật liệu đã qua sử dụng (recycle aluminum cans)'],
  'pollute':['Air pollution','Factory smokestacks smoke','Làm ô nhiễm môi trường (pollute the river/air)'],
  'destroy':['Earthquake','Ruined building after disaster','Phá hủy hoàn toàn (the fire destroyed the building)'],
  'damage':['Hail','Car windshield damaged by storm','Làm hư hại một phần (storm damage to the roof)'],
  'build':['Construction','Construction workers building bridge','Xây dựng công trình (build a stone bridge)'],
  'design':['Architectural drawing','Architect sketching blueprint','Thiết kế bản vẽ, kiểu dáng (design a new building)'],
  'create':['Pottery','Sculptor creating clay artwork','Tạo ra, sáng tạo tác phẩm mới (create a work of art)'],
  'produce':['Assembly line','Factory assembly line production','Sản xuất, tạo ra sản phẩm hoặc nông sản (produce electricity/food)'],
  'deliver':['Mail carrier','Courier delivering parcel box','Giao hàng, phát thư (deliver letters and parcels)'],
  'collect':['Stamp collecting','Collecting seashells on beach','Sưu tầm hoặc thu gom (collect postage stamps)'],
  'share':['Pizza','Friends sharing slices of pizza','Chia sẻ cùng nhau (share a meal with friends)'],
  'divide':['Cake','Cutting cake into equal slices','Chia nhỏ thành các phần (divide the cake into six pieces)'],
  'connect':['Bridge','Cables plugged into network switch','Kết nối hai điểm hoặc thiết bị với nhau (connect the printer to the computer)'],
  'separate':['Sorting','Sorting ripe and unripe fruit','Tách riêng ra (separate the egg white from the yolk)'],
  'mix':['Mixing bowl','Whisk mixing batter in bowl','Trộn lẫn các nguyên liệu (mix flour and water)'],
  'fill':['Drinking glass','Pouring water to fill a glass','Làm đầy (fill the glass with water)'],
  'empty':['Drinking glass','Empty glass on wooden table','Trống rỗng hoặc đổ hết ra (an empty room/glass)'],
  'full':['Basket','Basket full of fresh apples','Đầy ắp (a basket full of fruit)'],
  'heavy':['Anvil','Worker lifting heavy barbell','Nặng (a heavy iron box)'],
  'light':['Feather','White feather floating in air','Nhẹ hoặc ánh sáng, đèn chiếu (as light as a feather)'],
  'hard':['Diamond','Hard granite rock stone','Cứng rắn hoặc khó khăn, chăm chỉ (as hard as rock)'],
  'soft':['Cotton','Soft wool pillow cushion','Mềm mại, êm ái (a soft pillow)'],
  'smooth':['Pebble','Smooth river stones water','Nhẵn mịn, êm ả (smooth glass surface)'],
  'rough':['Tree bark','Rough tree bark texture','Thô ráp, gồ ghề hoặc biển động (rough wooden surface)'],
  'sharp':['Kitchen knife','Sharp steel chef knife blade','Sắc bén, nhọn (a sharp knife)'],
  'blunt':['Pencil','Worn blunt pencil tip','Cùn, không sắc (a blunt pencil/knife)'],
  'wet':['Rain','Wet cobblestones in rain','Ẩm ướt, thấm nước (wet clothes after the rain)'],
  'dry':['Desert','Dry cracked desert soil','Khô ráo, hạn hán (keep the seeds dry)'],
  'hot':['Lava','Steaming hot cup of coffee','Nóng bức, nhiệt độ cao (a hot summer day)'],
  'warm':['Fireplace','Cozy fireplace wool sweater','Ấm áp (a warm winter coat)'],
  'cool':['Autumn','Shaded forest stream breeze','Mát mẻ dễ chịu (keep food in a cool place)'],
  'cold':['Snow','Snow-covered pine trees winter','Lạnh giá (cold winter weather)'],
  'freezing':['Frost','Icicles hanging from roof','Lạnh cóng, dưới độ đóng băng (freezing temperatures)'],
  'bright':['Sunlight','Bright sunbeams through clouds','Sáng rực rỡ, thông minh (bright sunshine)'],
  'dark':['Night sky','Dark night sky with stars','Tối tăm, sẫm màu (a dark moonless night)'],
  'dirty':['Mud','Muddy boots after hiking','Bẩn, lấm bùn đất (dirty boots)'],
  'quiet':['Library','Quiet reading room in library','Yên tĩnh, tĩnh lặng (a quiet village street)'],
  'noisy':['Traffic congestion','Busy city street traffic horns','Ồn ào, náo nhiệt (a noisy construction site)'],
  'loud':['Loudspeaker','Concert stage speakers','To tiếng, âm lượng lớn (a loud explosion/music)'],
  'silent':['Snow','Silent snow-covered forest','Im lặng, không phát ra tiếng động (silent film / silent night)'],
  'fast':['Cheetah','High-speed bullet train','Nhanh chóng (a fast train)'],
  'slow':['Tortoise','Giant tortoise walking slowly','Chậm rãi (a slow pace)'],
  'early':['Sunrise','Early morning dew on grass','Sớm, buổi đầu (catch the early train)'],
  'late':['Night','Clock showing midnight','Muộn, trễ giờ (arrive late for the meeting)'],
  'young':['Seedling','Young child playing in park','Trẻ tuổi, non tơ (young children)'],
  'old':['Ancient oaks','Old historic stone building','Già, cũ kỹ hoặc lâu đời (an old castle)'],
  'new':['Bicycle','Brand new bicycle','Mới tinh (a new invention)'],
  'modern':['Skyscraper','Modern glass architecture','Hiện đại, tân tiến (modern technology)'],
  'traditional':['Kimono','Traditional festival costumes','Truyền thống lâu đời (traditional music and dance)'],
  'famous':['Eiffel Tower','World-famous landmark monument','Nổi tiếng khắp nơi (a famous painting)'],
  'popular':['Beach','Popular crowded tourist beach','Phổ biến, được nhiều người yêu thích (a popular holiday destination)'],
  'crowded':['Shibuya Crossing','Crowded pedestrian street Tokyo','Đông đúc, chật kín người (crowded streets)'],
  'lonely':['Lighthouse','Solitary lighthouse on rocky island','Cô đơn, hẻo lánh (a lonely island)'],
  'remote':['Elephant Island','Remote mountain cabin in snow','Xa xôi, hẻo lánh (a remote village)'],
  'safe':['Lifeboat (shipboard)','Seat belt fastened safely','An toàn, được bảo vệ (a safe harbour)'],
  'dangerous':['Cliff','Warning sign on steep cliff','Nguy hiểm, rủi ro cao (a dangerous mountain road)'],
  'brave':['Firefighter','Firefighter rescuing in smoke','Dũng cảm, gan dạ (a brave rescue)'],
  'frightened':['Fear','Startled cat wide eyes','Hoảng sợ, khiếp đảm (frightened of spiders)'],
  'calm':['Lake','Mirror reflection on calm mountain lake','Bình tĩnh hoặc mặt biển/hồ phẳng lặng (a calm sea)']
};

const CONCRETE_ANCHOR_KEYWORDS = [
  ['steam engine','Steam engine','động cơ hơi nước'],
  ['polar bear','Polar bear','gấu Bắc Cực'],
  ['honey bee','Honey bee','ong mật'],
  ['beaver dam','Beaver dam','đập hải ly'],
  ['hot air balloon','Hot air balloon','khinh khí cầu'],
  ['space station','International Space Station','trạm vũ trụ'],
  ['solar panel','Solar panel','tấm pin mặt trời'],
  ['wind turbine','Wind turbine','tua-bin gió'],
  ['climate change','Glacier','biến đổi khí hậu & băng tan'],
  ['public transport','Tram','giao thông công cộng'],
  ['traffic jam','Traffic congestion','tắc nghẽn giao thông'],
  ['seat belt','Seat belt','dây an toàn'],
  ['life jacket','Personal flotation device','áo phao cứu sinh'],
  ['post office','Post office','bưu điện'],
  ['police station','Police station','đồn cảnh sát'],
  ['fire engine','Fire engine','xe cứu hỏa'],
  ['washing machine','Washing machine','máy giặt'],
  ['vacuum cleaner','Vacuum cleaner','máy hút bụi'],
  ['air conditioning','Air conditioning','máy điều hòa'],
  ['central heating','Radiator (heating)','hệ thống sưởi'],
  ['mobile phone','Smartphone','điện thoại di động'],
  ['credit card','Payment card','thẻ tín dụng'],
  ['bank account','Bank','tài khoản ngân hàng'],
  ['high school','Secondary school','trung học'],
  ['prime minister','10 Downing Street','thủ tướng / chính phủ'],
  ['human rights','Universal Declaration of Human Rights','quyền con người'],
  ['blood pressure','Sphygmomanometer','huyết áp'],
  ['heart attack','Electrocardiography','nhịp tim & cấp cứu y tế'],
  ['carbon dioxide','Leaf','hấp thụ khí CO₂ ở lá cây'],
  ['fossil fuel','Coal-fired power station','nhiên liệu hóa thạch'],
  ['rainforest','Tropical rainforest','rừng mưa nhiệt đới'],
  ['coral reef','Coral reef','rạn san hô'],
  ['ice cream','Ice cream','kem lạnh'],
  ['orange juice','Orange juice','nước cam'],
  ['olive oil','Olive oil','dầu ô liu'],
  ['swimming pool','Swimming pool','hồ bơi'],
  ['tennis court','Tennis court','sân quần vợt'],
  ['football match','Association football','trận bóng đá'],
  ['train station','Train station','nhà ga tàu hỏa'],
  ['bus stop','Bus stop','trạm xe buýt'],
  ['living room','Living room','phòng khách'],
  ['dining room','Dining room','phòng ăn'],
  ['alarm clock','Alarm clock','đồng hồ báo thức'],
  ['aircraft','Airplane','máy bay'],
  ['airplane','Airplane','máy bay'],
  ['aeroplane','Airplane','máy bay'],
  ['helicopter','Helicopter','trực thăng'],
  ['airport','Airport','sân bay'],
  ['astronaut','Astronaut','phi hành gia'],
  ['spacecraft','Spacecraft','tàu vũ trụ'],
  ['satellite','Satellite','vệ tinh'],
  ['telescope','Telescope','kính thiên văn'],
  ['microscope','Microscope','kính hiển vi'],
  ['laboratory','Laboratory','phòng thí nghiệm'],
  ['scientist','Scientist','nhà khoa học'],
  ['experiment','Laboratory glassware','thí nghiệm khoa học'],
  ['vaccine','Vaccination','vắc-xin phòng bệnh'],
  ['hospital','Hospital','bệnh viện'],
  ['ambulance','Ambulance','xe cứu thương'],
  ['doctor','Physician','bác sĩ'],
  ['nurse','Nursing','y tá'],
  ['patient','Hospital bed','bệnh nhân'],
  ['medicine','Pharmaceutical drug','thuốc y tế'],
  ['surgery','Operating theater','phẫu thuật'],
  ['university','University','trường đại học'],
  ['classroom','Classroom','lớp học'],
  ['library','Library','thư viện'],
  ['museum','Museum','bảo tàng'],
  ['theatre','Theatre','nhà hát'],
  ['cinema','Movie theater','rạp chiếu phim'],
  ['orchestra','Orchestra','dàn nhạc giao hưởng'],
  ['violin','Violin','đàn vĩ cầm'],
  ['piano','Piano','đàn dương cầm'],
  ['guitar','Guitar','đàn ghi-ta'],
  ['drum','Drum','trống'],
  ['concert','Concert','buổi hòa nhạc'],
  ['painting','Painting','bức tranh hội họa'],
  ['sculpture','Sculpture','tác phẩm điêu khắc'],
  ['statue','Statue','bức tượng'],
  ['photograph','Photograph','bức ảnh chụp'],
  ['camera','Camera','máy ảnh'],
  ['newspaper','Newspaper','tờ báo'],
  ['magazine','Magazine','tạp chí'],
  ['envelope','Envelope','phong bì thư'],
  ['stamp','Postage stamp','tem bưu chính'],
  ['passport','Passport','hộ chiếu'],
  ['suitcase','Suitcase','va-li hành lý'],
  ['luggage','Baggage','hành lý'],
  ['bicycle','Bicycle','xe đạp'],
  ['motorcycle','Motorcycle','xe mô tô'],
  ['railway','Rail transport','đường sắt'],
  ['locomotive','Locomotive','đầu máy xe lửa'],
  ['subway','Rapid transit','tàu điện ngầm'],
  ['tunnel','Tunnel','đường hầm'],
  ['bridge','Bridge','cây cầu'],
  ['harbour','Harbor','bến cảng'],
  ['lighthouse','Lighthouse','ngọn hải đăng'],
  ['sailboat','Sailboat','thuyền buồm'],
  ['submarine','Submarine','tàu ngầm'],
  ['shipwreck','Shipwreck','xác tàu đắm'],
  ['castle','Castle','lâu đài'],
  ['palace','Palace','cung điện'],
  ['cathedral','Cathedral','nhà thờ lớn'],
  ['temple','Temple','ngôi đền'],
  ['mosque','Mosque','nhà thờ Hồi giáo'],
  ['skyscraper','Skyscraper','tòa nhà chọc trời'],
  ['pyramid','Egyptian pyramids','kim tự tháp'],
  ['fountain','Fountain','đài phun nước'],
  ['cottage','Cottage','ngôi nhà nhỏ ở quê'],
  ['kitchen','Kitchen','nhà bếp'],
  ['refrigerator','Refrigerator','tủ lạnh'],
  ['oven','Oven','lò nướng'],
  ['kettle','Kettle','ấm đun nước'],
  ['pan','Frying pan','chảo nấu ăn'],
  ['knife','Kitchen knife','con dao'],
  ['spoon','Spoon','chiếc thìa'],
  ['fork','Fork','chiếc nĩa'],
  ['plate','Plate (dishware)','đĩa ăn'],
  ['bowl','Bowl','cái bát'],
  ['bottle','Bottle','cái chai'],
  ['glass','Drinking glass','cốc thủy tinh'],
  ['cup','Cup','tách uống nước'],
  ['bread','Bread','bánh mì'],
  ['cheese','Cheese','phô mai'],
  ['butter','Butter','bơ'],
  ['chocolate','Chocolate','sô-cô-la'],
  ['soup','Soup','món súp'],
  ['salad','Salad','món rau trộn'],
  ['sandwich','Sandwich','bánh mì kẹp'],
  ['pizza','Pizza','bánh pizza'],
  ['pasta','Pasta','mì ống'],
  ['rice','Rice','gạo / cơm'],
  ['wheat','Wheat','lúa mì'],
  ['corn','Maize','bắp / ngô'],
  ['potato','Potato','khoai tây'],
  ['tomato','Tomato','cà chua'],
  ['onion','Onion','hành tây'],
  ['garlic','Garlic','tỏi'],
  ['carrot','Carrot','cà rốt'],
  ['lemon','Lemon','quả chanh vàng'],
  ['orange','Orange (fruit)','quả cam'],
  ['strawberry','Strawberry','quả dâu tây'],
  ['grape','Grape','quả nho'],
  ['banana','Banana','quả chuối'],
  ['apple','Apple','quả táo'],
  ['coffee','Coffee','cà phê'],
  ['tea','Tea','trà'],
  ['milk','Milk','sữa'],
  ['wine','Wine','rượu vang'],
  ['chicken','Chicken','thịt gà / con gà'],
  ['beef','Beef','thịt bò'],
  ['fish','Fish','cá'],
  ['egg','Egg as food','quả trứng'],
  ['sugar','Sugar','đường'],
  ['salt','Salt','muối'],
  ['pepper','Black pepper','hạt tiêu'],
  ['honey','Honey','mật ong'],
  ['flour','Flour','bột mì'],
  ['volcano','Volcano','núi lửa'],
  ['earthquake','Earthquake','động đất'],
  ['glacier','Glacier','sông băng'],
  ['iceberg','Iceberg','tảng băng trôi'],
  ['waterfall','Waterfall','thác nước'],
  ['desert','Desert','sa mạc'],
  ['canyon','Canyon','hẻm núi'],
  ['cave','Cave','hang động'],
  ['cliff','Cliff','vách đá'],
  ['island','Island','hòn đảo'],
  ['valley','Valley','thung lũng'],
  ['mountain','Mountain','ngọn núi'],
  ['forest','Forest','khu rừng'],
  ['jungle','Jungle','rừng rậm'],
  ['river','River','dòng sông'],
  ['lake','Lake','hồ nước'],
  ['ocean','Ocean','đại dương'],
  ['beach','Beach','bãi biển'],
  ['wave','Wind wave','sóng biển'],
  ['tide','Tide','thủy triều'],
  ['rainbow','Rainbow','cầu vồng'],
  ['lightning','Lightning','tia chớp'],
  ['thunder','Thunderstorm','sấm sét & giông bão'],
  ['hurricane','Tropical cyclone','bão lớn'],
  ['tornado','Tornado','lốc xoáy'],
  ['flood','Flood','lũ lụt'],
  ['drought','Drought','hạn hán'],
  ['snow','Snow','tuyết rơi'],
  ['frost','Frost','sương giá'],
  ['fog','Fog','sương mù'],
  ['cloud','Cloud','đám mây'],
  ['sunshine','Sunlight','ánh nắng mặt trời'],
  ['sunset','Sunset','hoàng hôn'],
  ['sunrise','Sunrise','bình minh'],
  ['moon','Moon','Mặt Trăng'],
  ['planet','Planet','hành tinh'],
  ['earth','Earth','Trái Đất'],
  ['diamond','Diamond','kim cương'],
  ['gold','Gold','vàng'],
  ['silver','Silver','bạc'],
  ['iron','Iron','sắt'],
  ['steel','Steel','thép'],
  ['copper','Copper','đồng'],
  ['coal','Coal','than đá'],
  ['wood','Wood','gỗ'],
  ['cotton','Cotton','bông vải'],
  ['wool','Wool','len'],
  ['silk','Silk','lụa'],
  ['leather','Leather','da thuộc'],
  ['plastic','Plastic','nhựa'],
  ['concrete','Concrete','bê tông'],
  ['brick','Brick','viên gạch'],
  ['elephant','Elephant','con voi'],
  ['lion','Lion','sư tử'],
  ['tiger','Tiger','con hổ'],
  ['whale','Whale','cá voi'],
  ['dolphin','Dolphin','cá heo'],
  ['shark','Shark','cá mập'],
  ['octopus','Octopus','bạch tuộc'],
  ['penguin','Penguin','chim cánh cụt'],
  ['eagle','Eagle','đại bàng'],
  ['owl','Owl','chim cú'],
  ['butterfly','Butterfly','con bướm'],
  ['spider','Spider','con nhện'],
  ['ant','Ant','con kiến'],
  ['bee','Honey bee','con ong'],
  ['snake','Snake','con rắn'],
  ['frog','Frog','con ếch'],
  ['turtle','Turtle','con rùa'],
  ['monkey','Monkey','con khỉ'],
  ['rabbit','Rabbit','con thỏ'],
  ['sheep','Sheep','con cừu'],
  ['cow','Cattle','con bò'],
  ['pig','Pig','con lợn'],
  ['horse','Horse','con ngựa'],
  ['dog','Dog','con chó'],
  ['cat','Cat','con mèo'],
  ['bird','Bird','con chim'],
  ['tree','Tree','cây cối'],
  ['flower','Flower','bông hoa'],
  ['rose','Rose','hoa hồng'],
  ['seed','Seed','hạt giống'],
  ['root','Root','rễ cây'],
  ['leaf','Leaf','chiếc lá'],
  ['grass','Grass','cỏ xanh'],
  ['jacket','Jacket','áo khoác ngắn'],
  ['coat','Coat','áo choàng'],
  ['shirt','Shirt','áo sơ mi'],
  ['sweater','Sweater','áo len'],
  ['dress','Dress','váy liền'],
  ['skirt','Skirt','chân váy'],
  ['trousers','Trousers','quần dài'],
  ['jeans','Jeans','quần bò / jeans'],
  ['shoes','Shoe','đôi giày'],
  ['boots','Boot','đôi ủng / bốt'],
  ['hat','Hat','chiếc mũ'],
  ['gloves','Glove','găng tay'],
  ['scarf','Scarf','khăn quàng cổ'],
  ['umbrella','Umbrella','chiếc ô / dù'],
  ['pocket','Pocket','túi áo / túi quần'],
  ['button','Button','cúc áo / nút bấm'],
  ['zip','Zipper','khóa kéo'],
  ['mirror','Mirror','chiếc gương'],
  ['clock','Clock','đồng hồ'],
  ['watch','Watch','đồng hồ đeo tay'],
  ['calendar','Calendar','tờ lịch'],
  ['candle','Candle','ngọn nến'],
  ['lamp','Lamp','cây đèn'],
  ['bulb','Incandescent light bulb','bóng đèn'],
  ['battery','Electric battery','viên pin'],
  ['engine','Internal combustion engine','động cơ máy'],
  ['wheel','Wheel','bánh xe'],
  ['rope','Rope','dây thừng'],
  ['chain','Chain','dây xích'],
  ['hammer','Hammer','chiếc búa'],
  ['nail','Nail (fastener)','đinh sắt'],
  ['ladder','Ladder','cái thang'],
  ['brush','Brush','bàn chải / cọ'],
  ['scissors','Scissors','cây kéo'],
  ['needle','Sewing needle','cây kim'],
  ['thread','Yarn','sợi chỉ / sợi len'],
  ['fence','Fence','hàng rào'],
  ['gate','Gate','cánh cổng'],
  ['roof','Roof','mái nhà'],
  ['chimney','Chimney','ống khói'],
  ['stairs','Stairs','cầu thang'],
  ['elevator','Elevator','thang máy'],
  ['lift','Elevator','thang máy'],
  ['window','Window','cửa sổ'],
  ['door','Door','cánh cửa'],
  ['key','Key (lock)','chìa khóa'],
  ['lock','Padlock','ổ khóa'],
  ['carpet','Carpet','thảm trải sàn'],
  ['curtain','Curtain','rèm cửa'],
  ['pillow','Pillow','chiếc gối'],
  ['blanket','Blanket','tấm chăn'],
  ['towel','Towel','khăn tắm'],
  ['soap','Soap','bánh xà phòng'],
  ['toothbrush','Toothbrush','bàn chải đánh răng'],
  ['comb','Comb','chiếc lược'],
  ['ring','Ring (jewellery)','chiếc nhẫn'],
  ['necklace','Necklace','vòng cổ'],
  ['coin','Coin','đồng xu'],
  ['banknote','Banknote','tiền giấy'],
  ['wallet','Wallet','chiếc ví'],
  ['receipt','Receipt','hóa đơn biên lai'],
  ['ticket','Ticket (admission)','tấm vé'],
  ['menu','Menu','thực đơn'],
  ['waiter','Waiting staff','nhân viên phục vụ'],
  ['chef','Chef','đầu bếp'],
  ['baker','Baker','thợ làm bánh'],
  ['farmer','Farmer','người nông dân'],
  ['fisherman','Fisherman','ngư dân'],
  ['pilot','Aircraft pilot','phi công'],
  ['sailor','Sailor','thủy thủ'],
  ['soldier','Soldier','người lính'],
  ['firefighter','Firefighter','lính cứu hỏa'],
  ['police','Police officer','cảnh sát'],
  ['judge','Judge','thẩm phán'],
  ['lawyer','Lawyer','luật sư'],
  ['journalist','Journalist','nhà báo'],
  ['photographer','Photographer','nhiếp ảnh gia'],
  ['musician','Musician','nhạc công'],
  ['singer','Singing','ca sĩ'],
  ['dancer','Dance','vũ công'],
  ['athlete','Sport of athletics','vận động viên'],
  ['swimmer','Swimming (sport)','vận động viên bơi lội'],
  ['cyclist','Cycling','người đi xe đạp'],
  ['football','Association football','bóng đá'],
  ['tennis','Tennis','quần vợt'],
  ['golf','Golf','môn đánh gôn'],
  ['skiing','Skiing','trượt tuyết'],
  ['sailing','Sailing','đua thuyền buồm'],
  ['chess','Chess','cờ vua'],
  ['puzzle','Jigsaw puzzle','trò chơi ghép hình'],
  ['balloon','Balloon','quả bóng bay'],
  ['fireworks','Fireworks','pháo hoa'],
  ['wedding','Wedding','đám cưới'],
  ['graduation','Graduation','lễ tốt nghiệp'],
  ['parliament','Parliament','quốc hội'],
  ['election','Voting','cuộc bầu cử & bỏ phiếu'],
  ['court','Courtroom','tòa án'],
  ['prison','Prison','nhà tù'],
  ['factory','Factory','nhà máy sản xuất'],
  ['warehouse','Warehouse','nhà kho'],
  ['supermarket','Supermarket','siêu thị'],
  ['bakery','Bakery','tiệm bánh'],
  ['pharmacy','Pharmacy','hiệu thuốc'],
  ['bookstore','Bookstore','hiệu sách'],
  ['cafe','Coffeehouse','quán cà phê'],
  ['restaurant','Restaurant','nhà hàng'],
  ['hotel','Hotel','khách sạn'],
  ['tent','Tent','lều cắm trại'],
  ['campfire','Campfire','lửa trại'],
  ['compass','Compass','la bàn'],
  ['map','Map','bản đồ'],
  ['globe','Globe','quả địa cầu'],
  ['brain','Human brain','bộ não'],
  ['heart','Heart','trái tim'],
  ['lungs','Lung','lá phổi'],
  ['stomach','Stomach','dạ dày'],
  ['bone','Bone','xương'],
  ['skeleton','Human skeleton','bộ xương'],
  ['muscle','Muscle','cơ bắp'],
  ['blood','Red blood cell','tế bào máu'],
  ['eye','Human eye','đôi mắt'],
  ['ear','Ear','đôi tai'],
  ['nose','Human nose','chiếc mũi'],
  ['tooth','Human tooth','chiếc răng'],
  ['teeth','Human tooth','hàm răng'],
  ['tongue','Tongue','cái lưỡi'],
  ['throat','Throat','cổ họng'],
  ['shoulder','Shoulder','bờ vai'],
  ['elbow','Elbow','khuỷu tay'],
  ['wrist','Wrist','cổ tay'],
  ['finger','Finger','ngón tay'],
  ['thumb','Thumb','ngón tay cái'],
  ['knee','Knee','đầu gối'],
  ['ankle','Ankle','mắt cá chân'],
  ['foot','Foot','bàn chân'],
  ['feet','Foot','đôi bàn chân'],
  ['beard','Beard','bộ râu'],
  ['smile','Smile','nụ cười'],
  ['tears','Tears','nước mắt'],
  ['train','Train','đoàn tàu hỏa'],
  ['bus','Bus','xe buýt'],
  ['truck','Truck','xe tải'],
  ['lorry','Truck','xe tải lớn'],
  ['car','Car','xe ô tô'],
  ['taxi','Taxicab','xe taxi'],
  ['ship','Ship','con tàu thủy'],
  ['boat','Boat','chiếc thuyền'],
  ['ferry','Ferry','chuyến phà'],
  ['road','Road','con đường'],
  ['street','Street','đường phố'],
  ['highway','Highway','đường cao tốc'],
  ['park','Park','công viên'],
  ['garden','Garden','khu vườn'],
  ['farm','Farm','nông trại'],
  ['field','Field (agriculture)','cánh đồng'],
  ['house','House','ngôi nhà'],
  ['building','Building','tòa nhà'],
  ['office','Office','văn phòng'],
  ['computer','Personal computer','máy tính'],
  ['keyboard','Computer keyboard','bàn phím'],
  ['screen','Computer monitor','màn hình'],
  ['telephone','Telephone','điện thoại'],
  ['radio','Radio receiver','máy thu thanh radio'],
  ['television','Television set','máy truyền hình TV'],
  ['book','Book','cuốn sách'],
  ['notebook','Notebook','quyển sổ tay'],
  ['pencil','Pencil','bút chì'],
  ['pen','Pen','cây bút'],
  ['paper','Paper','tờ giấy'],
  ['letter','Letter (message)','bức thư'],
  ['table','Table (furniture)','chiếc bàn'],
  ['chair','Chair','chiếc ghế'],
  ['desk','Desk','bàn làm việc'],
  ['bed','Bed','chiếc giường'],
  ['money','Currency','tiền tệ']
];

const SEMANTIC_FALLBACKS = [
  [/\b(cook|bake|fry|roast|boil|grill|recipe|meal|dish|eat|food|taste|flavour|flavor|hungry|kitchen)\b/i,'Cooking','Chef cooking in kitchen','ẩm thực & nấu nướng'],
  [/\b(money|pay|price|cost|buy|sell|bank|loan|tax|budget|debt|profit|wealth|afford|expensive|cheap|financial|currency)\b/i,'Currency','Coins and banknotes currency','tài chính & tiền tệ'],
  [/\b(doctor|hospital|medical|disease|illness|pain|health|healthy|cure|treat|treatment|symptom|virus|infection|medicine|surgery)\b/i,'Health care','Medical stethoscope doctor','y tế & sức khỏe'],
  [/\b(school|student|teacher|study|learn|exam|degree|college|university|lesson|class|education|knowledge)\b/i,'Classroom','Students studying in library','học tập & giáo dục'],
  [/\b(law|court|judge|trial|crime|criminal|police|legal|prison|guilty|innocent|arrest|punish|justice)\b/i,'Courthouse','Gavel and scales of justice','pháp luật & tòa án'],
  [/\b(music|song|sing|melody|rhythm|instrument|concert|orchestra|band|tune|sound|listen)\b/i,'Musical instrument','Acoustic guitar and piano','âm nhạc & biểu diễn'],
  [/\b(art|paint|draw|picture|gallery|museum|design|colour|color|creative|exhibition)\b/i,'Painting','Artist palette and painting','nghệ thuật & hội họa'],
  [/\b(sport|game|match|team|player|win|lose|score|race|run|swim|jump|kick|ball|champion|athletic)\b/i,'Sport of athletics','Runners on stadium track','thể thao & vận động'],
  [/\b(travel|journey|trip|flight|fly|passenger|tourist|holiday|vacation|hotel|abroad|luggage|airport)\b/i,'Air travel','Travel suitcase at airport','du lịch & hành trình'],
  [/\b(drive|car|road|traffic|vehicle|transport|bus|train|bicycle|engine|wheel)\b/i,'Road transport','Cars driving on highway','giao thông & phương tiện'],
  [/\b(ship|sail|sea|ocean|boat|harbour|port|wave|coast|island|marine)\b/i,'Sailing ship','Ship sailing on ocean','biển cả & hàng hải'],
  [/\b(weather|rain|snow|wind|storm|cloud|sun|warm|cold|temperature|climate|freeze)\b/i,'Weather','Sunlight and rain clouds','thời tiết & khí hậu'],
  [/\b(plant|tree|flower|leaf|grow|seed|soil|forest|garden|nature|wild|animal|bird|fish)\b/i,'Natural environment','Green forest and sunlight','thiên nhiên & sinh vật'],
  [/\b(build|house|room|wall|roof|floor|door|window|home|apartment|construction|architect)\b/i,'Architecture','Residential house building','nhà cửa & kiến trúc'],
  [/\b(computer|internet|digital|software|website|data|screen|online|technology|electronic|machine)\b/i,'Personal computer','Laptop computer on desk','máy tính & công nghệ'],
  [/\b(science|research|experiment|scientist|laboratory|theory|chemical|physics|energy|space|planet)\b/i,'Laboratory','Science laboratory equipment','khoa học & thí nghiệm'],
  [/\b(write|read|book|story|novel|poem|author|page|word|letter|text|publish|newspaper)\b/i,'Book','Open book and fountain pen','sách & ngôn ngữ viết'],
  [/\b(speak|talk|say|tell|ask|answer|discuss|conversation|language|voice|chat|communicate)\b/i,'Conversation','Two people having a conversation','hội thoại & giao tiếp'],
  [/\b(happy|smile|laugh|joy|pleased|cheerful|delighted|excited|glad|enjoy)\b/i,'Laughter','People smiling and laughing','niềm vui & nụ cười'],
  [/\b(sad|cry|tear|unhappy|upset|depressed|grief|sorrow|lonely|disappointed)\b/i,'Sadness','Raindrops on window glass','cảm xúc & tâm trạng'],
  [/\b(angry|furious|annoyed|mad|argue|quarrel|conflict|fight|attack)\b/i,'Thunderstorm','Lightning storm over sea','xung đột & tranh luận'],
  [/\b(afraid|fear|scared|frightened|terrified|panic|danger|dangerous|risk|threat)\b/i,'Traffic sign','Cliff edge warning sign','cảnh báo & sự thận trọng'],
  [/\b(work|job|office|company|business|manager|worker|employ|career|colleague|meeting|project)\b/i,'Office','Colleagues in office meeting','công việc & công sở'],
  [/\b(government|president|minister|parliament|vote|election|political|policy|nation|country|citizen)\b/i,'Parliament','Parliament building exterior','xã hội & công dân'],
  [/\b(time|hour|minute|day|week|month|year|morning|evening|night|clock|schedule|early|late|future|past)\b/i,'Clock','Pocket watch and clock face','thời gian & lịch trình'],
  [/\b(walk|step|move|carry|hold|lift|push|pull|open|close|put|take|give|bring)\b/i,'Walking','Person walking on footpath','hoạt động thường ngày']
];

function resolveVocabPhotoTopic(r, extraContext = '') {
  if (!r || !r.word) return { query: 'Book', fallback: 'Library', caption: 'Gợi nhớ từ vựng qua hình ảnh thực tế' };
  const w = String(r.word).replace(/\([^)]*\)|[¹²³⁴]/g, '').trim();
  const lw = w.toLowerCase();
  const pos = (r.pos || 'noun').toLowerCase();
  const def = String(r.def || '');
  const ex = String(extraContext || r.example || '');

  // 1. Check explicit sense-disambiguated map from photo-topics.json
  const directKey = lw + ':' + pos;
  if (photoTopicsData.vocab && photoTopicsData.vocab[directKey]) {
    const mapped = photoTopicsData.vocab[directKey];
    return {
      query: mapped,
      fallback: w + ' ' + mapped,
      caption: 'Gợi ý "' + w + '" (' + pos + ') · Hình ảnh: ' + mapped + (r.example ? ' — "' + r.example + '"' : '')
    };
  }

  // 2. Check exact visual hint dictionary
  if (EXACT_WORD_VISUALS[lw]) {
    const [wiki, commons, hint] = EXACT_WORD_VISUALS[lw];
    return {
      query: wiki,
      fallback: commons,
      caption: 'Gợi ý "' + w + '": ' + hint
    };
  }

  // 3. Check if headword matches a concrete anchor keyword
  for (const [kw, wiki, vnLabel] of CONCRETE_ANCHOR_KEYWORDS) {
    if (lw === kw) {
      return {
        query: wiki,
        fallback: wiki + ' photograph',
        caption: 'Gợi ý "' + w + '" (' + vnLabel + ')' + (r.example ? ' · "' + r.example + '"' : '')
      };
    }
  }

  // 4. Check explicit noun entry in photo-topics.json
  if (photoTopicsData.vocab && photoTopicsData.vocab[lw + ':noun']) {
    const mapped = photoTopicsData.vocab[lw + ':noun'];
    return {
      query: mapped,
      fallback: w + ' ' + mapped,
      caption: 'Gợi ý "' + w + '" (' + pos + ') · Hình ảnh: ' + mapped
    };
  }

  // 5. Scan example + definition for a concrete visual scene anchor
  const searchCorpus = (ex + ' ' + def).toLowerCase();
  for (const [kw, wiki, vnLabel] of CONCRETE_ANCHOR_KEYWORDS) {
    const re = new RegExp('\\b' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 's?\\b', 'i');
    if (re.test(searchCorpus)) {
      return {
        query: wiki,
        fallback: wiki + ' real photograph',
        caption: 'Gợi ý "' + w + '" (' + pos + ') qua hình ảnh ' + vnLabel + (r.example ? ' · "' + r.example + '"' : '')
      };
    }
  }

  // 6. Concrete noun headword
  if (pos.includes('noun') && lw.length >= 3 && !/(tion|ment|ness|ity|ism|ance|ence)$/.test(lw)) {
    const cap = lw.charAt(0).toUpperCase() + lw.slice(1);
    return {
      query: cap,
      fallback: w + ' photograph',
      caption: 'Gợi ý danh từ "' + w + '"' + (r.example ? ' · "' + r.example + '"' : '')
    };
  }

  // 7. Semantic domain fallback from definition & example
  for (const [re, wiki, commons, vnDomain] of SEMANTIC_FALLBACKS) {
    if (re.test(def + ' ' + ex)) {
      return {
        query: wiki,
        fallback: commons,
        caption: 'Gợi ý "' + w + '" (' + pos + ' · ' + vnDomain + ')' + (r.example ? ' · "' + r.example + '"' : '')
      };
    }
  }

  return {
    query: w.charAt(0).toUpperCase() + w.slice(1),
    fallback: w + ' ' + pos,
    caption: 'Gợi ý "' + w + '" (' + pos + ')'
  };
}

function readingPhotoCard(l, compact = false) {
  if (!l) return '';
  const query = photoTopicsData.readings?.[l.id] || l.englishTitle || l.title;
  const fallback = l.englishTitle + ' ' + (l.targets?.slice(0, 3).map(t => t.word).join(' ') || '');
  const sampleWords = (l.targets || []).slice(0, 5).map(t => t.word + (t.vi ? ' (' + t.vi + ')' : '')).join(', ');
  const caption = l.englishTitle + ' (' + query + ')' + (sampleWords ? ' — Từ vựng trọng tâm: ' + sampleWords : '');
  return '<figure class="real-photo-card reading-photo-card' + (compact ? ' compact-photo' : '') + '" data-photo-kind="reading" data-photo-query="' + esc(query) + '" data-photo-fallback="' + esc(fallback) + '" data-photo-caption="' + esc(caption) + '"><div class="real-photo-frame"><div class="real-photo-placeholder">Đang tải ảnh thực tế (' + esc(query) + ')…</div></div><figcaption class="real-photo-caption"><span class="photo-badge">Ảnh thật · Wikimedia</span> <span>' + esc(caption) + '</span></figcaption></figure>';
}

function readingParagraphPhoto(l, paraIndex) {
  if (!l) return '';
  const paraTopics = (photoTopicsData.readingParagraphs && photoTopicsData.readingParagraphs[l.id]) || [photoTopicsData.readings?.[l.id] || l.englishTitle];
  const query = paraTopics[paraIndex % paraTopics.length] || paraTopics[0] || l.englishTitle;
  const paraTargets = (l.targets || []).filter(t => t.occurrence && t.occurrence.p === paraIndex);
  const sampleTargets = (paraTargets.length ? paraTargets : (l.targets || []).slice(paraIndex * 4, paraIndex * 4 + 4))
    .slice(0, 5)
    .map(t => t.word + (t.vi ? ' (' + t.vi + ')' : ''))
    .join(', ');
  const caption = 'Chủ đề "' + query + '"' + (sampleTargets ? ' · Gợi ý từ vựng trong đoạn: ' + sampleTargets : '');
  return '<figure class="real-photo-card reading-para-photo compact-photo" data-photo-kind="reading-para" data-photo-query="' + esc(query) + '" data-photo-fallback="' + esc(query + ' ' + l.englishTitle) + '" data-photo-caption="' + esc(caption) + '"><div class="real-photo-frame"><div class="real-photo-placeholder">Ảnh thực tế đoạn văn: ' + esc(query) + '</div></div><figcaption class="real-photo-caption"><span class="photo-badge">Ảnh thật · Gợi ý từ vựng</span> <span>' + esc(caption) + '</span></figcaption></figure>';
}

function readingSceneGallery(l) {
  if (!l || !l.paragraphs || l.paragraphs.length > 1) return '';
  const paraTopics = ((photoTopicsData.readingParagraphs && photoTopicsData.readingParagraphs[l.id]) || []).slice(1, 4);
  if (!paraTopics.length) return '';
  const chunkSize = Math.max(1, Math.ceil((l.targets || []).length / 3));
  const cards = paraTopics.map((query, idx) => {
    const slice = (l.targets || []).slice(idx * chunkSize, (idx + 1) * chunkSize).slice(0, 4);
    const words = slice.map(t => t.word + (t.vi ? ' (' + t.vi + ')' : '')).join(', ');
    const caption = query + (words ? ' · Gợi ý từ vựng: ' + words : '');
    return '<figure class="real-photo-card reading-gallery-photo compact-photo" data-photo-kind="reading-scene" data-photo-query="' + esc(query) + '" data-photo-fallback="' + esc(query + ' photograph') + '" data-photo-caption="' + esc(caption) + '"><div class="real-photo-frame"><div class="real-photo-placeholder">Ảnh thực tế: ' + esc(query) + '</div></div><figcaption class="real-photo-caption"><span class="photo-badge">Ảnh thật</span> <span>' + esc(caption) + '</span></figcaption></figure>';
  }).join('');
  return '<div class="reading-visual-strip" aria-label="Real photographs illustrating vocabulary in this passage">' + cards + '</div>';
}

function vocabPhotoCard(r, compact = false, extraContext = '') {
  if (!r) return '';
  const info = resolveVocabPhotoTopic(r, extraContext);
  return '<figure class="real-photo-card vocab-photo-card' + (compact ? ' compact-photo' : '') + '" data-photo-kind="vocab" data-photo-query="' + esc(info.query) + '" data-photo-fallback="' + esc(info.fallback) + '" data-photo-caption="' + esc(info.caption) + '"><div class="real-photo-frame"><div class="real-photo-placeholder">Ảnh minh họa: ' + esc(info.query) + '</div></div><figcaption class="real-photo-caption"><span class="photo-badge">Ảnh thật</span> <span>' + esc(info.caption) + '</span></figcaption></figure>';
}

function vocabularyPhotoCard(r, extraVi = '', variant = '') {
  return vocabPhotoCard(r, Boolean(variant && variant.includes('compact')), extraVi);
}

function collocationPhotoCard(it) {
  if (!it) return '';
  const r = (typeof defaults !== 'undefined' && defaults[it.rowIndex]) ? defaults[it.rowIndex] : { word: it.word || it.headword, pos: it.pos, def: it.en || it.sense, example: it.example };
  return vocabPhotoCard(r, true, (it.collocation || '') + ' ' + (it.example || ''));
}

function grammarPhotoCard(g) {
  if (!g || !g.examples || !g.examples.length) return '';
  const exText = g.examples.map(e => e.en).join(' ');
  const info = resolveVocabPhotoTopic({ word: g.englishTitle || g.title, pos: 'grammar', def: g.rule || '', example: g.examples[0].en || '' }, exText);
  const caption = 'Tình huống hội thoại / ví dụ: "' + (g.examples[0].en || '') + '" (' + (g.examples[0].vi || '') + ')';
  return '<figure class="real-photo-card grammar-photo-card compact-photo" data-photo-kind="grammar" data-photo-query="' + esc(info.query) + '" data-photo-fallback="' + esc(info.fallback) + '" data-photo-caption="' + esc(caption) + '"><div class="real-photo-frame"><div class="real-photo-placeholder">Ảnh tình huống: ' + esc(info.query) + '</div></div><figcaption class="real-photo-caption"><span class="photo-badge">Ảnh thật · Ngữ cảnh</span> <span>' + esc(caption) + '</span></figcaption></figure>';
}

function isRealPhotoUrl(url, title = '') {
  if (!url || typeof url !== 'string') return false;
  const lower = (url + ' ' + title).toLowerCase();
  if (/\.(svg|gif|tif|tiff|pdf|ogg|ogv|webm)(\?|$)/i.test(url)) return false;
  if (/(disambig|question_book|padlock|ambox|edit-clear|wikimedia-logo|commons-logo|wiki_letter|flag_of_|coat_of_arms|map_of_|blank_map|locator_map|location_map|orthographic|_diagram|_chart|_graph|icon|symbol_category|text_document|nuvola|gnome-|crystal_clear|tango-|oxygen480|font_awesome|ai_generated|ai-generated|midjourney|stable_diffusion|dall-e)/i.test(lower)) return false;
  return true;
}

function renderPhotoFigure(fig, data) {
  if (!fig || !data || !data.url) return;
  fig.dataset.photoLoaded = 'true';
  const captionText = fig.dataset.photoCaption || data.title || '';
  const sourceUrl = data.pageUrl || ('https://en.wikipedia.org/wiki/' + encodeURIComponent((data.title || fig.dataset.photoQuery || '').replace(/\s+/g, '_')));
  const frame = fig.querySelector('.real-photo-frame');
  const cap = fig.querySelector('.real-photo-caption');
  if (frame) {
    frame.innerHTML = '<img class="real-photo-img" src="' + esc(data.url) + '" alt="' + esc(captionText) + '" loading="lazy" referrerpolicy="no-referrer">';
    const img = frame.querySelector('img');
    if (img) {
      img.onerror = () => {
        frame.innerHTML = '<div class="real-photo-placeholder">Ảnh thực tế (' + esc(fig.dataset.photoQuery || '') + ') cần kết nối Internet để hiển thị.</div>';
      };
    }
  }
  if (cap) {
    cap.innerHTML = '<span class="photo-badge">Ảnh thật · Wikimedia</span> <span>' + esc(captionText) + '</span> <a href="' + esc(sourceUrl) + '" target="_blank" rel="noopener noreferrer" class="photo-source-link">Nguồn ảnh ↗</a>';
  }
}

async function fetchCommonsPhoto(searchQuery) {
  if (typeof fetch !== 'function' || !searchQuery) return null;
  try {
    const q = 'filetype:bitmap -ai -midjourney -map -diagram -logo -icon -svg ' + searchQuery;
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrsearch=' + encodeURIComponent(q) + '&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url&iiurlwidth=560';
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const pages = Object.values(json?.query?.pages || {});
    for (const p of pages) {
      const thumb = p?.imageinfo?.[0]?.thumburl || p?.imageinfo?.[0]?.url;
      if (isRealPhotoUrl(thumb, p.title)) {
        return {
          url: thumb,
          title: (p.title || '').replace(/^File:/i, '').replace(/\.[^.]+$/, ''),
          pageUrl: 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(p.title || '')
        };
      }
    }
  } catch {}
  return null;
}

async function fetchWikiBatch(queries) {
  if (typeof fetch !== 'function' || !queries.length) return;
  const normalizedMap = new Map();
  const titlesParam = queries.map(q => {
    const clean = q.trim();
    const cap = clean.charAt(0).toUpperCase() + clean.slice(1);
    normalizedMap.set(cap.toLowerCase(), q);
    return cap;
  }).join('|');

  try {
    const url = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&redirects=1&prop=pageimages&piprop=thumbnail|name&pithumbsize=560&titles=' + encodeURIComponent(titlesParam);
    const res = await fetch(url);
    if (!res.ok) return;
    const json = await res.json();
    const qData = json?.query || {};
    const reverseLookup = new Map();
    for (const q of queries) {
      const cap = q.trim().charAt(0).toUpperCase() + q.trim().slice(1);
      reverseLookup.set(cap, q);
    }
    for (const n of qData.normalized || []) {
      const orig = reverseLookup.get(n.from);
      if (orig) reverseLookup.set(n.to, orig);
    }
    for (const r of qData.redirects || []) {
      const orig = reverseLookup.get(r.from);
      if (orig) reverseLookup.set(r.to, orig);
    }
    for (const p of Object.values(qData.pages || {})) {
      const origQuery = reverseLookup.get(p.title) || normalizedMap.get((p.title || '').toLowerCase());
      const thumb = p?.thumbnail?.source;
      if (origQuery && isRealPhotoUrl(thumb, p.pageimage || p.title)) {
        photoMemoryCache.set(origQuery.toLowerCase(), {
          url: thumb,
          title: p.title,
          pageUrl: 'https://en.wikipedia.org/wiki/' + encodeURIComponent((p.title || '').replace(/\s+/g, '_'))
        });
      }
    }
  } catch {}
}

let hydrateTimer = null;
function schedulePhotoHydration() {
  if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return;
  if (typeof setTimeout !== 'function') { hydrateVisiblePhotos(); return; }
  if (hydrateTimer && typeof clearTimeout === 'function') clearTimeout(hydrateTimer);
  hydrateTimer = setTimeout(hydrateVisiblePhotos, 30);
}

async function hydrateVisiblePhotos() {
  if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return;
  const figures = Array.from(document.querySelectorAll('figure.real-photo-card:not([data-photo-loaded="true"])'));
  if (!figures.length) return;

  const uncachedQueries = new Set();
  for (const fig of figures) {
    const q = (fig.dataset.photoQuery || '').trim();
    if (!q) continue;
    const cached = photoMemoryCache.get(q.toLowerCase());
    if (cached) {
      renderPhotoFigure(fig, cached);
    } else {
      uncachedQueries.add(q);
    }
  }

  if (!uncachedQueries.size || typeof fetch !== 'function') return;
  const list = [...uncachedQueries];
  for (let i = 0; i < list.length; i += 25) {
    await fetchWikiBatch(list.slice(i, i + 25));
  }

  const stillMissing = [];
  for (const fig of figures) {
    if (fig.dataset.photoLoaded === 'true') continue;
    const q = (fig.dataset.photoQuery || '').trim();
    const cached = photoMemoryCache.get(q.toLowerCase());
    if (cached) {
      renderPhotoFigure(fig, cached);
    } else {
      stillMissing.push(fig);
    }
  }

  for (const fig of stillMissing.slice(0, 12)) {
    const q = (fig.dataset.photoQuery || '').trim();
    const fb = (fig.dataset.photoFallback || q).trim();
    const cached = photoMemoryCache.get(q.toLowerCase());
    if (cached) {
      renderPhotoFigure(fig, cached);
      continue;
    }
    const commons = (await fetchCommonsPhoto(q)) || (fb !== q ? await fetchCommonsPhoto(fb) : null);
    if (commons) {
      photoMemoryCache.set(q.toLowerCase(), commons);
      renderPhotoFigure(fig, commons);
    } else {
      const frame = fig.querySelector('.real-photo-frame');
      if (frame) frame.innerHTML = '<div class="real-photo-placeholder">Chưa tải được ảnh từ Wikimedia (kiểm tra kết nối mạng).</div>';
    }
  }
  persistPhotoCache();
}

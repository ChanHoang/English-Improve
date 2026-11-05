module.exports=({group,story,exercises})=>{
const g=group('time-10','B2','Who decides what time it is?',`
precise~adjective~chính xác đến chi tiết~stated or measured with exact detail
measure~verb~đo~to find the size or amount of something
accurate~adjective~chính xác, đúng thực tế~correct and free from significant error
standard~noun~chuẩn chung~an agreed basis used for comparison
season~noun~mùa~one of the main periods into which a year is divided
railway~noun~đường sắt~a transport system in which trains run on tracks
schedule~noun~lịch trình~a plan stating when events or journeys happen
arrival~noun~sự đến nơi~the act of reaching a destination
departure~noun~sự khởi hành~the act of leaving a place
confusion~noun~sự nhầm lẫn~a lack of clear understanding
agreement~noun~sự thống nhất~a shared decision accepted by different people
adopt~verb~áp dụng~to begin using a method or system
establish~verb~thiết lập~to create something intended to continue
official~adjective~chính thức~accepted or authorized by an organization or authority
regional~adjective~thuộc vùng~relating to a particular part of a country
global~adjective~toàn cầu~involving the whole world
zone~noun~vùng, khu vực~an area defined by a particular feature or rule
adjust~verb~điều chỉnh~to change something slightly so that it works better
calculate~verb~tính toán~to find an answer using numbers
regular~adjective~đều đặn~happening at repeated or consistent intervals
cycle~noun~chu kỳ~a series of events that repeats
annual~adjective~hằng năm~happening once each year
duration~noun~khoảng thời gian kéo dài~the amount of time something lasts
occasion~noun~dịp~a particular time when something happens
frequency~noun~tần suất~the number of times something happens in a period
`);
const a=story(g,'railway-time','A','Khi đồng hồ mỗi thị trấn chỉ một giờ khác nhau','When Every Town Had Its Own Time',
`Imagine checking a station clock before a train’s [[departure]], then discovering that your destination uses a different local time. In nineteenth-century Britain, this was not simply a broken watch. Towns commonly based their time on the Sun. A clock could be [[accurate]] according to one town’s practice while disagreeing with another. Such [[regional]] differences became awkward when the [[railway]] made travel faster and connected more places.

A useful [[schedule]] must give passengers a clear meaning for every [[arrival]] time. To [[calculate]] a journey’s [[duration]], you need to know whether both clocks follow the same [[standard]]. Otherwise, a [[precise]] number can still create [[confusion]]. Imagine a journey listed as thirty minutes on one basis but compared with a destination clock several minutes behind. The number alone does not explain which convention is being used. People needed [[agreement]] about the reference, not just better watches.

In 1840, the Great Western Railway told its stations to use London time. Other operators also came to [[adopt]] a shared reference, and Greenwich Mean Time became railway time across Britain. This helped [[establish]] a common basis for timetables. By 1880, Greenwich time had become Britain’s [[official]] legal standard. Passengers had to get used to reading a common time. A station could [[adjust]] its clock to a shared signal instead of relying only on local solar observations.

Today, the [[global]] time system contains many zones. Being in a different time [[zone]] does not mean your clock is faulty. Whether you plan a [[regular]] commute or an [[annual]] holiday, check the relevant local time. A timetable gives the [[frequency]] of trains as well as individual departures; neither changes the daily [[cycle]] of daylight. A new [[season]] may bring a different timetable, and a special [[occasion]] may require extra services. We can [[measure]] time carefully, but we still need shared rules to make its numbers useful. Could you explain which time your ticket uses?`,
`Hãy tưởng tượng nhìn đồng hồ ga trước khi tàu khởi hành rồi phát hiện nơi đến dùng giờ địa phương khác. Ở Anh thế kỷ 19, điều này không đơn giản do đồng hồ hỏng. Các thị trấn thường dựa giờ vào Mặt Trời. Đồng hồ có thể đúng theo quy ước thị trấn này nhưng khác thị trấn kia. Khác biệt vùng trở nên bất tiện khi đường sắt giúp đi nhanh và kết nối nhiều nơi hơn.

Lịch trình hữu ích phải cho hành khách hiểu rõ mỗi giờ đến. Muốn tính thời gian hành trình, cần biết hai đồng hồ có theo cùng chuẩn không. Nếu không, con số rất chi tiết vẫn gây nhầm. Hãy hình dung chuyến đi được ghi ba mươi phút theo một chuẩn nhưng lại so với đồng hồ nơi đến chậm hơn vài phút. Chỉ con số không giải thích quy ước nào đang dùng. Người ta cần thống nhất mốc tham chiếu, không chỉ đồng hồ tốt hơn.

Năm 1840, Great Western Railway yêu cầu các ga dùng giờ London. Các hãng khác cũng dần áp dụng chuẩn chung và GMT trở thành giờ đường sắt trên toàn Anh. Điều đó giúp thiết lập cơ sở chung cho lịch tàu. Đến năm 1880, giờ Greenwich đã thành chuẩn pháp lý chính thức của Anh. Hành khách phải quen đọc giờ chung. Ga có thể điều chỉnh đồng hồ theo tín hiệu chung thay vì chỉ dựa quan sát Mặt Trời địa phương.

Ngày nay, hệ thống giờ toàn cầu có nhiều múi. Ở múi giờ khác không có nghĩa đồng hồ sai. Dù đi làm đều đặn hay nghỉ hằng năm, hãy kiểm tra giờ địa phương liên quan. Lịch tàu cho tần suất và từng lần khởi hành; chúng không thay đổi chu kỳ ánh sáng mỗi ngày. Mùa mới có thể có lịch mới, dịp đặc biệt có thể cần thêm chuyến. Ta đo thời gian cẩn thận nhưng vẫn cần quy tắc chung để con số hữu ích. Bạn có thể giải thích vé dùng giờ nào không?`,
[['Network Rail · 180 years of railway time','https://www.networkrail.co.uk/stories/180-years-of-railway-time/'],['Royal Museums Greenwich · Greenwich Mean Time','https://www.rmg.co.uk/stories/time/greenwich-mean-time-gmt'],['Royal Museums Greenwich · Observatory history','https://www.rmg.co.uk/stories/space-astronomy/history-royal-observatory']],
[{id:69,example:'Passengers had to get used to reading a common time.',note:'Get used to + V-ing chỉ quá trình trở nên quen với việc gì; to ở đây là giới từ nên reading, không phải read.'},{id:20,example:'Could you explain which time your ticket uses?',note:'Câu hỏi gián tiếp giữ trật tự chủ ngữ + động từ: your ticket uses; không đảo does your ticket use bên trong.'}]);
exercises(a,[
['Why could two working clocks disagree?','They followed different local solar times.','Every clock was broken.','Trains changed the movement of the Sun.','Mỗi nơi có quy ước giờ riêng dựa vào Mặt Trời.','Đoạn đầu nói không đơn giản là đồng hồ hỏng.','Tàu làm tăng nhu cầu thống nhất, không đổi chuyển động thiên thể.'],
['Why is a precise number not always enough?','The time reference must also be clear.','Numbers cannot represent time.','A destination never has a clock.','Con số chi tiết vẫn khó hiểu nếu không biết chuẩn tham chiếu.','Bài không phủ nhận đo thời gian bằng số.','Vấn đề là đồng hồ nơi đến dùng chuẩn nào, không phải thiếu đồng hồ.'],
['What did the Great Western Railway do in 1840?','It told stations to use London time.','It stopped all train journeys.','It introduced the Gregorian calendar.','Đây là hành động cụ thể để thống nhất giờ ga.','Không có việc dừng toàn bộ hành trình.','Lịch Gregorian không phải cải cách đường sắt được kể.'],
['What was different by 1880?','Greenwich time had become a legal standard in Britain.','Every country used one identical clock time.','Local time zones had disappeared worldwide.','Bài nêu mốc chuẩn pháp lý tại Anh.','Chuẩn tại Anh không đồng nghĩa mọi quốc gia cùng một giờ.','Đoạn cuối nói hệ thống hiện nay vẫn có nhiều múi giờ.'],
['What practical lesson closes the article?','Check which local time a timetable uses.','Assume every time difference means a fault.','Ignore time references if a number looks exact.','Lịch chỉ có ích khi hiểu đúng chuẩn giờ liên quan.','Múi giờ khác không chứng minh đồng hồ hỏng.','Độ chi tiết không thay thế việc hiểu mốc tham chiếu.']
],[
[69,'Complete: “Passengers had to get used to ___ a common time.”','reading','read','reads','To trong get used to là giới từ nên theo sau bằng V-ing.','Read nguyên mẫu thuộc used to read, cấu trúc thói quen quá khứ khác.','Reads là động từ chia ngôi, không đứng sau giới từ to.'],
[69,'What does “get used to” emphasize?','The process of becoming familiar with something.','A habit that existed only in the past.','A machine’s purpose.','Get diễn tả chuyển đổi sang trạng thái quen.','Used to + nguyên mẫu mới diễn tả thói quen quá khứ.','Be used to do có thể chỉ công dụng, khác get used to + V-ing.'],
[20,'Complete: “Could you explain which time ___?”','your ticket uses','does your ticket use','uses your ticket','Sau explain dùng mệnh đề hỏi gián tiếp với chủ ngữ trước động từ.','Đảo does dùng cho câu hỏi trực tiếp, không cho mệnh đề này.','Uses đứng trước chủ ngữ là sai trật tự ở đây.'],
[20,'Which is a correct indirect question?','Do you know when the train leaves?','Do you know when does the train leave?','Do you know when leaves the train?','Mệnh đề when the train leaves theo trật tự câu trần thuật.','Không đảo does trong mệnh đề sau Do you know.','Leaves không đảo trước the train trong câu hỏi gián tiếp.']
]);
const b=story(g,'leap-day','B','Ngày sinh nhật không xuất hiện mỗi năm','The Birthday That Skips a Date',
`For someone born on 29 February, a birthday is an [[annual]] [[occasion]], but the date itself does not appear every year. The reason begins with a mismatch between our calendar and the [[cycle]] of the seasons. The time from one spring equinox to the next is about 365.2422 days. A calendar containing only 365 days cannot match that [[duration]] exactly. A small difference becomes significant when it repeats.

To make the calendar more [[accurate]], we add leap days. However, the familiar [[regular]] pattern of one every four years needs an exception. In the Gregorian calendar, a year divisible by four is normally a leap year. A year divisible by 100 is not, unless it is also divisible by 400. This makes 2000 a leap year, but not 1900 or 2100. Unless a century year is divisible by 400, it is not a leap year. The [[frequency]] of leap days is therefore slightly lower than a simple four-year rule suggests.

Why [[adopt]] such a complicated [[standard]]? We can [[measure]] the seasonal year and [[calculate]] the difference. Adding a full day every four years slightly overcorrects it. The exceptions help [[adjust]] the calendar so that a [[season]] does not keep drifting through the months. This is a [[precise]] rule for organizing dates, not a command that makes Earth move differently. Not every year divisible by four is a leap year.

The rule also illustrates why [[agreement]] matters in everyday life. A [[global]] booking service must know which dates exist. A [[railway]] [[schedule]] must place a [[departure]] and an [[arrival]] on valid dates, particularly for overnight travel. A time [[zone]] tells you which local time applies; a leap-year rule tells you whether February has another day. Mixing the two creates [[confusion]]. Different cultures may use other calendars for [[regional]] celebrations, while [[official]] records follow an agreed system. People [[establish]] these conventions to coordinate life. The planet continues its journey whether or not a birthday date appears on the page.`,
`Với người sinh ngày 29 tháng 2, sinh nhật là dịp hằng năm nhưng ngày tháng ấy không xuất hiện mỗi năm. Lý do bắt đầu từ sự lệch giữa lịch và chu kỳ mùa. Thời gian từ một xuân phân tới xuân phân tiếp theo khoảng 365,2422 ngày. Lịch chỉ có 365 ngày không khớp chính xác khoảng đó. Chênh lệch nhỏ trở nên đáng kể khi lặp lại.

Để lịch chính xác hơn, ta thêm ngày nhuận. Tuy nhiên, quy luật quen thuộc bốn năm một lần cần ngoại lệ. Theo lịch Gregorian, năm chia hết cho bốn thường là năm nhuận. Năm chia hết cho 100 thì không, trừ khi cũng chia hết cho 400. Vì vậy 2000 là năm nhuận, nhưng 1900 và 2100 thì không. Nếu năm tròn thế kỷ không chia hết cho 400 thì không phải năm nhuận. Tần suất ngày nhuận do đó thấp hơn một chút so với quy tắc bốn năm đơn giản.

Tại sao áp dụng chuẩn phức tạp ấy? Ta đo năm theo mùa và tính chênh lệch. Thêm trọn ngày mỗi bốn năm làm điều chỉnh hơi quá. Ngoại lệ giúp chỉnh lịch để mùa không cứ trôi qua các tháng. Đây là quy tắc chính xác để tổ chức ngày tháng, không phải lệnh buộc Trái Đất chuyển động khác. Không phải mọi năm chia hết cho bốn đều nhuận.

Quy tắc cũng cho thấy vì sao thống nhất quan trọng trong đời sống. Dịch vụ đặt chỗ toàn cầu phải biết ngày nào tồn tại. Lịch đường sắt phải đặt giờ khởi hành và đến vào ngày hợp lệ, nhất là hành trình qua đêm. Múi giờ cho biết giờ địa phương áp dụng; quy tắc nhuận cho biết tháng 2 có thêm ngày không. Trộn hai vấn đề sẽ gây nhầm. Các nền văn hóa có thể dùng lịch khác cho lễ vùng, còn hồ sơ chính thức theo hệ thống đã thống nhất. Con người thiết lập quy ước để phối hợp cuộc sống. Hành tinh vẫn đi tiếp dù ngày sinh nhật có xuất hiện trên trang lịch hay không.`,
[['NASA JPL · Why we have leap day','https://www.jpl.nasa.gov/edu/news/doing-the-math-on-why-we-have-leap-day/'],['US Naval Observatory · Leap years','https://aa.usno.navy.mil/faq/leap_years']],
[{id:84,example:'Unless a century year is divisible by 400, it is not a leap year.',note:'Unless = if…not: nếu năm tròn thế kỷ không chia hết cho 400. Không thêm not vào mệnh đề unless vì sẽ đảo nghĩa.'},{id:119,example:'Not every year divisible by four is a leap year.',note:'Not every là phủ định một phần: có ngoại lệ. Nó không có nghĩa No year… (không năm nào).'}]);
exercises(b,[
['What mismatch creates the need for leap days?','A seasonal year is longer than 365 whole days.','February always has 31 days.','Time zones make Earth stop moving.','Năm theo mùa khoảng 365,2422 ngày nên còn phần lẻ.','Bài nói tháng 2 có 28 hoặc 29 ngày theo quy tắc, không phải 31.','Múi giờ là quy ước, không điều khiển chuyển động Trái Đất.'],
['Which of these is a Gregorian leap year?','2000.','1900.','2100.','2000 chia hết cho 400 nên là ngoại lệ được giữ ngày nhuận.','1900 chia hết cho 100 nhưng không chia hết cho 400.','2100 chia hết cho 100 nhưng không chia hết cho 400.'],
['Why are some century years skipped?','One added day every four years slightly overcorrects the mismatch.','The seasonal year is exactly 366 days.','Birthdays are not annual occasions.','Phần lẻ ít hơn một phần tư ngày nên cần bỏ bớt ngày nhuận.','Khoảng được nêu là 365,2422 ngày, không phải 366.','Sinh nhật vẫn là dịp hằng năm dù ngày 29/2 không luôn xuất hiện.'],
['How does a time zone differ from a leap-year rule?','One selects local time; the other affects February’s length.','Both change Earth’s orbit.','Both say February always has 29 days.','Bài phân biệt hai quy ước để tránh nhầm.','Quy ước ghi thời gian không thay đổi quỹ đạo hành tinh.','Ngày 29/2 chỉ xuất hiện ở năm nhuận.'],
['What does “Not every year divisible by four” mean?','Some such years are exceptions.','None of those years are leap years.','All of those years are leap years without exception.','Not every phủ định tính tuyệt đối, cho phép nhiều năm vẫn nhuận.','None phủ định toàn bộ, trái với ví dụ năm 2000.','All without exception bỏ qua quy tắc 100 và 400.']
],[
[84,'Replace “unless” without changing the meaning: “Unless the year is divisible by 400…”','If the year is not divisible by 400…','If the year is divisible by 400…','Because the year is divisible by 400…','Unless tương đương if…not ở điều kiện này.','Bỏ not sẽ đảo điều kiện.','Because nêu nguyên nhân đã xác nhận, không thay điều kiện unless.'],
[84,'Complete the rule correctly: “Unless a century year ___ divisible by 400, it is not a leap year.”','is','is not','will be','Is giữ đúng nghĩa: trừ khi chia hết cho 400.','Thêm not vào unless đảo nghĩa thành quy tắc sai.','Quy tắc chung dùng hiện tại đơn, không cần will.'],
[119,'Which sentence says there are exceptions, without rejecting every case?','Not all years have 365 days.','No years have 365 days.','All years have exactly 365 days.','Not all chỉ phủ định một phần: có năm khác 365 ngày.','No years phủ định toàn bộ, sai vì năm thường có 365 ngày.','All khẳng định tuyệt đối, không cho phép ngoại lệ.'],
[119,'“Not every booking crosses a time zone” implies which possibility?','Some bookings may stay within one time zone.','No booking can cross a time zone.','Every booking must cross a time zone.','Not every cho phép ít nhất có trường hợp không vượt múi giờ.','No booking là phủ định toàn bộ, mạnh hơn điều câu gốc nói.','Every must trái trực tiếp với not every.']
]);
};

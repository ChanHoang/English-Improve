module.exports=({group,story,exercises})=>{
const g=group('art-11','B2','When a picture disappears',`
artistic~adjective~thuộc nghệ thuật~relating to art and its creation
theft~noun~vụ trộm, hành vi trộm~the act of taking something that belongs to someone else
thief~noun~kẻ trộm~a person who steals
steal~verb~lấy trộm~to take something without the owner's permission
portrait~noun~tranh chân dung~a picture representing a person
crime~noun~tội phạm, hành vi phạm pháp~an action that breaks the law
gallery~noun~phòng trưng bày~a room or building used to show works of art
security~noun~an ninh~measures intended to keep people or things safe
guard~noun~nhân viên bảo vệ~a person whose job is to protect a place or people
suspect~noun~nghi phạm~a person thought possibly to have committed a crime
investigation~noun~cuộc điều tra~a careful search for facts about an event
witness~noun~nhân chứng~a person who saw an event happen
missing~adjective~mất tích, không tìm thấy~not in the expected place and not located
frame~noun~khung tranh~the border that surrounds a picture
appeal~noun~sức hấp dẫn~the quality that makes something interesting or attractive
reputation~noun~danh tiếng~the opinion people generally have of someone or something
public~noun~công chúng~people in general
insurance~noun~bảo hiểm~an arrangement that provides financial protection against specified losses
permission~noun~sự cho phép~approval allowing someone to do something
treasure~noun~báu vật~something considered especially precious
value~noun~giá trị~the importance or worth of something
image~noun~hình ảnh~a visual representation of something
ownership~noun~quyền sở hữu~the state or right of owning something
loan~noun~việc cho mượn~an arrangement allowing temporary use of something belonging to another
recognition~noun~sự nhận ra~the ability to identify something already known
`);
const a=story(g,'mona-lisa-theft','A','Bức tranh nổi tiếng hơn sau khi biến mất','The Smile That Went Missing',
`In August 1911, the Mona Lisa disappeared from the Louvre. An [[image]] familiar to art lovers was suddenly a [[missing]] object. The [[portrait]] had [[artistic]] importance before the [[theft]], but the disappearance brought even greater attention. A picture’s [[appeal]] can come from its colours, expression and history. For a time, however, the story surrounding this one was also a story about [[crime]].

More than two years later, Vincenzo Peruggia tried to sell the painting to an Italian art dealer. The dealer alerted the authorities, and the work was recovered. Peruggia, who had worked at the Louvre, had taken the painting. The [[thief]] had been able to [[steal]] a cultural [[treasure]], but keeping it hidden did not give him legitimate [[ownership]]. Having an object in your room is different from having the right to sell it.

This distinction matters whenever a work leaves a [[gallery]]. A [[loan]] involves [[permission]]; taking a picture without consent does not. A [[frame]] may be replaceable, but the work it surrounds can have a [[value]] that money does not fully express. [[Insurance]] concerns financial protection, whereas the loss of access to an artwork affects viewers too. These are general differences, not details of the Louvre’s insurance arrangements in 1911.

An [[investigation]] must also distinguish a [[suspect]] from a proven offender, and a [[witness]] from someone repeating a rumour. A [[guard]] can contribute to [[security]], but no single job title explains every event in a complex case. The painting’s recovery allowed the [[public]] to see it again, while its [[reputation]] grew even stronger. Its widespread [[recognition]] raises an interesting question: does knowing an artwork’s story change how we look at it? The crime did not create Leonardo’s skill. Nevertheless, it became part of the story viewers brought to the painting.`,
`Tháng 8 năm 1911, Mona Lisa biến mất khỏi Louvre. Hình ảnh quen thuộc với người yêu nghệ thuật bỗng trở thành đồ vật mất tích. Chân dung đã có tầm quan trọng nghệ thuật trước vụ trộm nhưng sự biến mất khiến nó được chú ý hơn. Sức hấp dẫn của tranh có thể đến từ màu sắc, biểu cảm và lịch sử. Trong một thời gian, câu chuyện quanh bức tranh còn là câu chuyện phạm pháp.

Hơn hai năm sau, Vincenzo Peruggia tìm cách bán tranh cho người buôn nghệ thuật Italy. Người này báo nhà chức trách và tác phẩm được tìm lại. Peruggia, người từng làm ở Louvre, đã lấy tranh. Kẻ trộm lấy được báu vật văn hóa nhưng giấu nó không đem lại quyền sở hữu hợp pháp. Có vật trong phòng khác với có quyền bán nó.

Phân biệt ấy quan trọng khi tác phẩm rời phòng trưng bày. Cho mượn có sự cho phép; lấy không đồng ý thì không. Khung có thể thay nhưng tác phẩm bên trong có giá trị không thể hiện hết bằng tiền. Bảo hiểm liên quan bảo vệ tài chính, còn mất khả năng xem tác phẩm cũng ảnh hưởng công chúng. Đây là phân biệt chung, không phải chi tiết hợp đồng bảo hiểm của Louvre năm 1911.

Điều tra cũng phải phân biệt nghi phạm với người đã được chứng minh phạm tội, nhân chứng với người nhắc lại tin đồn. Bảo vệ góp phần bảo đảm an ninh, nhưng riêng chức danh không giải thích toàn bộ vụ việc phức tạp. Việc tìm lại tranh giúp công chúng xem lại và danh tiếng nó càng lớn. Mức độ được nhận ra rộng rãi đặt câu hỏi: biết câu chuyện tác phẩm có thay đổi cách nhìn không? Tội phạm không tạo ra tài năng Leonardo. Tuy vậy, nó trở thành một phần câu chuyện người xem mang đến bức tranh.`,
[['Louvre · Mona Lisa and the theft','https://www.louvre.fr/en/explore/the-palace/from-the-mona-lisa-to-the-wedding-feast-at-cana']],
[{id:88,example:'Peruggia, who had worked at the Louvre, had taken the painting.',note:'Who had worked… là mệnh đề quan hệ không xác định, bổ sung thông tin về Peruggia; được ngăn bằng hai dấu phẩy, không thay who bằng that.'},{id:116,example:'Nevertheless, it became part of the story viewers brought to the painting.',note:'Nevertheless nối ý tương phản: vụ trộm không tạo tài năng nghệ sĩ nhưng vẫn trở thành một phần câu chuyện của tác phẩm.'}]);
exercises(a,[
['What does the opening say about the painting before the theft?','It already had artistic importance.','Nobody considered it an artwork.','The thief painted it himself.','Bài ghi rõ giá trị nghệ thuật có trước vụ trộm.','Không có ý tranh hoàn toàn vô danh hay không phải nghệ thuật.','Tác giả là Leonardo; Peruggia lấy tác phẩm đã tồn tại.'],
['What helped bring about its recovery?','An art dealer alerted the authorities.','The painting walked back into the gallery.','Every suspect was automatically declared guilty.','Người được đề nghị mua tranh đã báo nhà chức trách.','Đây không phải truyện hư cấu về tranh tự di chuyển.','Đoạn cuối nhấn mạnh nghi phạm khác người đã chứng minh phạm tội.'],
['How does a loan differ from theft in the article?','A loan involves permission.','A loan always transfers permanent ownership.','Theft becomes a loan if the object is hidden.','Cho mượn có đồng ý, lấy trộm thì không.','Loan là tạm cho dùng, không chuyển quyền sở hữu vĩnh viễn.','Giấu vật không thay đổi việc có hay không có sự cho phép.'],
['What does the article claim about insurance?','It explains the general idea, not the Louvre’s 1911 policy.','It gives the exact amount paid in 1911.','It says insurance recreates the original painting.','Bài chủ động giới hạn phần bảo hiểm ở phân biệt khái niệm chung.','Không có con số hay xác nhận khoản chi trả.','Bảo vệ tài chính không đồng nghĩa tái tạo nguyên tác.'],
['Why does the ending mention Leonardo’s skill?','To distinguish artistic achievement from later publicity.','To claim theft created the painting’s quality.','To suggest the painting had no value before 1911.','Tài năng tạo tranh và câu chuyện vụ trộm là hai nguồn ý nghĩa khác nhau.','Câu cuối nói rõ tội phạm không tạo ra tài năng.','Đoạn đầu xác nhận giá trị nghệ thuật có trước vụ trộm.']
],[
[88,'Complete the extra-information clause: “Peruggia, ___ had worked at the Louvre, had taken the painting.”','who','that','what','Who dùng cho người trong mệnh đề không xác định có dấu phẩy.','Không dùng that trong mệnh đề quan hệ không xác định này.','What không đứng sau danh từ riêng để thay who ở đây.'],
[88,'What do the commas around “who had worked at the Louvre” show?','The clause adds information about an already named person.','The clause is the main verb of the sentence.','The words are a direct quotation.','Tên Peruggia xác định người; mệnh đề chỉ thêm thông tin.','Động từ chính là had taken, không phải phần giữa dấu phẩy.','Dấu phẩy không đánh dấu trích dẫn trực tiếp.'],
[116,'Which connector best signals contrast? “The crime did not create his skill. ___, it affected the painting’s story.”','Nevertheless','For example','Similarly','Nevertheless thể hiện dù vậy, tương phản giữa hai ý.','For example giới thiệu ví dụ, không diễn tả quan hệ nhượng bộ này.','Similarly chỉ sự tương đồng, không phải tương phản.'],
[116,'Choose the correctly punctuated connection.','The work was missing. However, its fame grew.','The work was missing however its fame grew.','The work was missing, however its fame grew.','However nối hai câu độc lập: tách câu và đặt dấu phẩy sau từ nối.','Hai mệnh đề độc lập bị nối liền không dấu câu.','Chỉ một dấu phẩy trước however gây nối câu sai; có thể dùng dấu chấm phẩy và thêm dấu phẩy sau however.']
]);
const b=story(g,'scream-theft','B','Một tiếng thét, nhiều phiên bản','More Than One Scream',
`A familiar [[image]] shows a figure with an open mouth beneath a swirling sky. Edvard Munch’s The Scream has such wide [[recognition]] that it is easy to imagine one unique object behind every reproduction. In fact, Munch made several versions. The [[artistic]] idea is shared, but the physical works are different. Although the central figure resembles a person, the work is more than a conventional [[portrait]]. Its [[appeal]] lies partly in how strongly it suggests a feeling.

This distinction becomes important when reading about [[theft]]. One version was stolen from Norway’s National Museum in 1994. In 2004, armed men entered the Munch Museum and took another version, together with Madonna. A [[witness]] in the museum could see a [[crime]] unfolding, not an agreed [[loan]] to another [[gallery]]. The works were taken without [[permission]]. A [[thief]] who can [[steal]] an artwork does not thereby gain lawful [[ownership]].

The works taken in 2004 were recovered in 2006. Their return did not end every problem: conservators needed to examine their condition and address damage. An [[investigation]] seeks facts about the offence; conservation asks different questions about the physical object. A [[suspect]] is a person under suspicion, not a description of the painting itself. Likewise, a [[guard]] works on [[security]], while a conservator works on care. Both jobs matter, but their responsibilities differ.

Why does recovering the original matter if copies are everywhere? A reproduction shows an image, but not the same material object with its own history. A [[frame]] cannot explain all of that history, nor can a price express every kind of [[value]]. The [[public]] can regard a work as a [[treasure]] even without owning it. [[Insurance]] may address financial loss; it cannot make a damaged surface untouched. It would be wrong to assume that recovery means perfect condition. The [[missing]] pictures returned, but the need for care remained. Munch’s [[reputation]] and the image’s popularity make the story widely known; attention to versions keeps us from confusing two different thefts.`,
`Hình ảnh quen thuộc có nhân vật há miệng dưới bầu trời cuộn xoáy. The Scream của Edvard Munch được nhận ra rộng đến mức ta dễ tưởng có đúng một đồ vật gốc phía sau mọi bản sao. Thực ra Munch tạo nhiều phiên bản. Ý tưởng nghệ thuật chung nhưng tác phẩm vật chất khác nhau. Dù nhân vật giữa tranh giống người, tác phẩm vượt khỏi một chân dung thông thường. Sức hấp dẫn một phần ở cảm xúc mãnh liệt nó gợi lên.

Phân biệt này quan trọng khi đọc về trộm tranh. Một phiên bản bị lấy khỏi Bảo tàng Quốc gia Na Uy năm 1994. Năm 2004, người có vũ khí vào Bảo tàng Munch, lấy phiên bản khác cùng Madonna. Nhân chứng ở bảo tàng nhìn thấy hành vi phạm pháp, không phải việc cho phòng tranh khác mượn có thỏa thuận. Tác phẩm bị lấy không được cho phép. Kẻ trộm lấy được tranh không vì thế có quyền sở hữu hợp pháp.

Những tác phẩm bị lấy năm 2004 được tìm lại năm 2006. Trở về không chấm dứt mọi vấn đề: người bảo tồn phải kiểm tra tình trạng và xử lý hư hại. Điều tra tìm sự thật về vụ phạm pháp; bảo tồn đặt câu hỏi khác về vật thể. Nghi phạm là người bị nghi ngờ, không phải mô tả bức tranh. Tương tự, bảo vệ làm công việc an ninh, còn người bảo tồn chăm sóc tác phẩm. Cả hai quan trọng nhưng trách nhiệm khác nhau.

Tại sao tìm lại nguyên tác quan trọng nếu bản sao ở khắp nơi? Bản sao thể hiện hình ảnh nhưng không phải cùng vật thể có lịch sử riêng. Khung tranh không giải thích hết lịch sử, giá tiền cũng không diễn tả mọi giá trị. Công chúng có thể coi tác phẩm là báu vật dù không sở hữu. Bảo hiểm có thể xử lý tổn thất tài chính nhưng không làm bề mặt hư hại thành chưa từng bị động tới. Sẽ sai nếu cho rằng tìm lại đồng nghĩa tình trạng hoàn hảo. Tranh mất tích trở về nhưng nhu cầu chăm sóc còn đó. Danh tiếng Munch và độ phổ biến hình ảnh khiến câu chuyện được biết rộng; chú ý các phiên bản giúp tránh nhầm hai vụ trộm.`,
[['MUNCH · A Scream through culture','https://www.munch.no/en/our-collection/a-scream-through-culture'],['MUNCH · Conservation after the robbery','https://www.munch.no/en/whats-on-arkiv/the-scream--live-conservation/']],
[{id:98,example:'Both jobs matter, but their responsibilities differ.',note:'Both jobs và their responsibilities là chủ ngữ số nhiều, nên matter/differ không thêm s.'},{id:110,example:'It would be wrong to assume that recovery means perfect condition.',note:'That recovery means perfect condition là mệnh đề danh từ làm bổ ngữ của assume; recovery số ít nên means.'}]);
exercises(b,[
['Why is it important to know there are several versions?','The two thefts involved different physical works.','Every reproduction is the same physical painting.','Munch never repeated an artistic idea.','Bài phân biệt phiên bản bị lấy năm 1994 với phiên bản năm 2004.','Bản sao hình ảnh không phải cùng vật thể gốc.','Munch tạo nhiều phiên bản theo cùng mô-típ.'],
['What was taken with a version of The Scream in 2004?','Madonna.','The Mona Lisa.','A railway timetable.','Đoạn hai nêu rõ tác phẩm Madonna.','Mona Lisa thuộc câu chuyện Louvre, không phải vụ này.','Lịch tàu không xuất hiện trong vụ trộm.'],
['Why was work still needed after recovery in 2006?','The condition and damage needed attention.','Recovery automatically restored every surface.','The museum no longer cared about the works.','Người bảo tồn kiểm tra tình trạng và xử lý hư hại.','Tìm lại không tự chữa hư hại vật chất.','Chính việc chăm sóc sau tìm lại thể hiện họ vẫn quan tâm.'],
['How does conservation differ from an investigation?','It focuses on the physical care of the work.','It decides who is legally guilty.','It replaces every painting with a photograph.','Bảo tồn chăm sóc vật thể, điều tra tìm sự thật vụ việc.','Kết luận trách nhiệm pháp lý không phải chức năng được nêu của bảo tồn.','Bài không đề nghị thay nguyên tác bằng ảnh.'],
['Why does the final paragraph distinguish an image from an object?','Copies do not share the original object’s material history.','A frame proves every fact about a painting.','Insurance removes all physical damage automatically.','Bản sao mang hình ảnh nhưng không phải cùng vật thể có lịch sử riêng.','Khung không giải thích toàn bộ lịch sử tác phẩm.','Bảo hiểm liên quan tài chính, không tự làm bề mặt nguyên vẹn.']
],[
[98,'Complete: “Both jobs ___, but their responsibilities differ.”','matter','matters','is matter','Both jobs số nhiều nên động từ matter không thêm s.','Matters dùng với chủ ngữ ngôi ba số ít, không phải both jobs.','Matter là động từ thường; không thêm is trước nó.'],
[98,'Choose the correct agreement.','The condition of the paintings requires attention.','The condition of the paintings require attention.','The condition of the paintings are requiring attention.','Chủ ngữ chính là condition số ít nên requires.','Paintings nằm trong cụm of, không quyết định số của động từ chính.','Are không hòa hợp với condition; trạng thái này cũng không cần tiếp diễn.'],
[110,'In “assume that recovery means perfect condition”, what follows “assume”?','A clause stating the content of the assumption.','A relative clause describing a person.','A direct question with inversion.','That recovery means… là mệnh đề nội dung, làm bổ ngữ của assume.','Không có danh từ chỉ người để mệnh đề quan hệ bổ nghĩa.','Mệnh đề giữ recovery means, không đảo như câu hỏi trực tiếp.'],
[110,'Complete: “We know that the works ___ recovered in 2006.”','were','was','did','Works số nhiều và bị động quá khứ nên were recovered.','Was không hòa hợp với works số nhiều.','Did recovered sai dạng; câu cần bị động, không phải did + nguyên mẫu.']
]);
};

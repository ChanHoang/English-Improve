const fs=require('fs'),assert=require('assert/strict');
const html=fs.readFileSync('index.html','utf8'),dict=JSON.parse(html.match(/<script id="bundle" type="application\/json">([^<]*)<\/script>/)[1]);
const old=require('./readings-v3.json').filter(l=>!l.id.startsWith('a2-'));
const used=new Set(old.filter(l=>l.level==='A2').flatMap(l=>l.targets.map(t=>t.rowIndex)));
const themes=[
['cold','Life at the cold edges','bear|climate|coast|wild|thick|skin|female|male|feed|fish|fishing|danger|safe|protect|alive|dead|death|birth|nature|normal|normally|extreme|extremely|although'],
['clever','Animals with surprising skills','monkey|brain|intelligent|clever|behaviour|behave|ability|able|insect|spider|web|frog|catch|hide|hole|nut|pet|human|human|identify|recognize|individual|individual|themselves'],
['plants','Trees and seeds that travel','forest|grass|plant|farm|farming|field|wood|wooden|environment|earth|grow|valley|lake|hill|deep|wet|dry|season|whole|especially|among|belong|itself|exist'],
['weather','Colours and power in the sky','cloud|sky|storm|wave|blow|gas|light|bright|heavy|rise|fall|height|high|low|low|degree|physics|energy|power|effect|affect|cause|cause|predict'],
['oceans','A world beneath the waves','ocean|continent|biology|level|bottom|bottom|inside|inside|inside|round|round|round|flat|narrow|wide|huge|enormous|tiny|half|nearly|almost|further|region|view'],
['space','Messages beyond our planet','moon|planet|astronaut|land|flying|flying|fly|zero|billion|source|scientific|research|research|researcher|lab|expert|expert|evidence|discovery|discover|impossible|incredible|exact|exactly'],
['transport','Moving through a crowded city','railway|underground|underground|passenger|platform|vehicle|wheel|cycle|cycle|motorcycle|truck|lorry|van|transport|parking|petrol|ride|drive|driving|route|crowded|crowd|seat|gate'],
['build','Building across difficult places','bridge|tower|architect|architecture|structure|metal|stone|column|roof|stair|lift|lift|top|top|straight|straight|cross|cross|side|gap|tool|tool|engineer|connected'],
['ships','Ships and the stories they leave','ship|sail|sailing|captain|board|lost|missing|disaster|accident|destroy|survive|save|scared|fear|hope|luck|lucky|fortunately|unfortunately|suddenly|immediately|reach|towards|along'],
['olympics','Races that became traditions','athlete|race|race|runner|running|run|track|train|trainer|training|fit|fit|physical|injury|ankle|knee|shoulder|neck|hurt|hurt|pain|win|winner|prize'],
['games','How games find their rules','basketball|baseball|soccer|hockey|golf|ski|ski|ski|skiing|coach|goal|score|score|beat|compete|competition|final|finish|first|third|fair|rule|strategy|target'],
['music','Instruments that changed the sound','instrument|musical|musician|jazz|classical|pop|pop|singing|voice|listener|loud|loud|loudly|quietly|noise|noisy|record|recording|perform|stage|audience|clap|hit|hit'],
['movies','Moving pictures and silent stories','film|cartoon|comedy|drama|director|character|scene|screen|star|celebrity|fame|fan|fun|laugh|laughter|joke|joke|cry|smile|smile|ending|fiction|series|based'],
['art','Pictures that last','painter|drawing|brush|brush|gallery|image|photograph|pattern|shape|appearance|attractive|creative|design|designer|fashion|model|gold|gold|silver|silver|jewellery|gift|original|quality'],
['books','Words that open doors','author|novel|publish|education|teaching|learning|knowledge|understanding|essay|lecture|lecture|professor|introduction|term|expression|pronounce|sign|meaning|blank|blank|page|number|count|copy'],
['digital','From signals to screens','digital|electrical|device|app|program|data|download|download|laptop|smartphone|mobile|mobile|tablet|printer|text|mail|link|link|chat|chat|reply|respond|response|available'],
['work','Making things for millions','industry|employ|employee|employer|boss|manager|manage|businessman|assistant|assistant|colleague|working|salary|pay|earn|task|department|organization|organize|arrange|arrangement|advertise|advertisement|advertising'],
['money','Small objects, shared value','cash|credit|penny|sale|offer|offer|borrow|lend|own|owner|possession|benefit|advantage|amount|rate|per|per cent|per cent|per cent|double|double|double|double|average'],
['food','Food with a longer story','chef|beef|biscuit|chip|fat|fork|knife|spoon|plate|sauce|lemon|jam|sweet|taste|boil|burn|heat|oven|cooker|fridge|store|can|bar|smell'],
['homes','Everyday comforts were once new','furniture|carpet|cupboard|lamp|mirror|home|upstairs|downstairs|inside|outside|outside|outside|lock|lock|button|fix|broken|comfortable|ideal|ordinary|everyday|daily|lifestyle|habit'],
['clothes','What clothes can tell us','clothing|pants|belt|sock|suit|tie|tie|uniform|pocket|pack|wash|washing|towel|thin|curly|tidy|tidy|adult|teenage|twin|twin|single|single|marry'],
['health','Small changes that protect people','medical|medicine|drug|disease|illness|ill|flu|virus|patient|dentist|blood|bone|heart|stomach|headache|prevent|care|care|careful|condition|treatment|necessary|serious|weak'],
['mind','The hidden work of rest','sleep|asleep|rest|rest|memory|mind|mind|thought|thinking|focus|focus|attention|stress|stress|worried|worry|nervous|unhappy|awful|badly|worse|worst|dream|notice'],
['pioneers','People who changed expectations','independent|female|male|lady|guy|hero|national|award|achieve|succeed|fail|opportunity|chance|decision|choice|alternative|option|accept|refuse|allow|permission|support|support|encourage'],
['help','People helping people','charity|community|society|social|volunteer|peace|war|army|soldier|officer|organization|helpful|kindness|polite|rude|manner|greet|welcome|guest|invitation|invite|attend|celebrate|together'],
['history','Walls, castles and people','ancient|castle|palace|king|queen|government|president|state|church|god|attack|attack|fight|fight|gun|kill|prison|public|public|population|united|law|lawyer|historical'],
['mystery','How clues become answers','crime|criminal|detective|thief|steal|secret|secret|search|search|question|report|reporter|journalist|media|news|interview|case|argument|argue|disagree|discussion|comment|review|review'],
['numbers','Numbers that help us see','mathematics|maths|unit|circle|circle|square|square|position|mark|mark|middle|middle|average|general|specific|particular|certain|factor|increase|increase|reduce|result|survey|progress'],
['travel','Discovering places differently','abroad|foreign|tourism|tour|traveller|guide|guide|airline|book|reception|stay|wait|camp|camp|camping|adventure|experience|enter|visit|back|past|forward|anywhere|anywhere'],
['traditions','Celebrations across generations','tradition|wedding|relationship|divorced|birth|age|birthday|lovely|happily|pleased|please|surprise|surprise|surprised|surprising|wonderful|welcome|ring|ring|wish|wish|promise|promise|hope'],
['planet','Using things more than once','plastic|plastic|rubbish|bin|recycle|pollution|smoke|smoke|smoking|cigarette|use|replace|avoid|control|solution|solve|suggest|suggestion|consider|depend|involve|provide|request|deal'],
['science','Curiosity in ordinary objects','chemistry|soap|toy|toy|balloon|pull|push|drop|throw|jump|jump|touch|hold|finger|knock|shake|move|movement|react|realize|explanation|explain|test|experiment'],
['stories','How stories reach an audience','speaker|speech|talk|conference|present|notice|poster|background|context|personality|act|action|attention|check|look|sense|matter|matter|mention|refer|recommend|seem|appear|disappear']
];
const plans=themes.map(([slug,title,words],n)=>{const targets=[];for(const word of words.split('|')){const i=dict.findIndex((r,i)=>r.level==='A2'&&r.word===word&&!used.has(i));if(i<0)continue;used.add(i);targets.push({word,pos:dict[i].pos,rowIndex:i,en:dict[i].def});}return {slug,title,order:n+4,capacity:n<24?28:27,targets}});
fs.writeFileSync('a2-plan.json',JSON.stringify(plans,null,2));
const remaining=dict.map((r,rowIndex)=>({...r,rowIndex})).filter(r=>r.level==='A2'&&!used.has(r.rowIndex));fs.writeFileSync('a2-unassigned.json',JSON.stringify(remaining,null,2));
console.log(plans.map(p=>p.order+' '+p.slug+' '+p.targets.length+'/'+p.capacity).join('\n'));
console.log('UNASSIGNED '+remaining.length+'\n'+remaining.map(r=>r.word+'~'+r.pos).join(' | '));

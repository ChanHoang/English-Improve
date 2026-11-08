const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Rebuild clean base grammar-quiz.json first so this script is idempotent
execSync('node build-grammar-quiz.cjs', { stdio: 'inherit' });

const grammarLessons = JSON.parse(fs.readFileSync('grammar-lessons.json', 'utf8'));
const grammarMap = new Map(grammarLessons.map(g => [g.id, g]));
const grammarQuiz = JSON.parse(fs.readFileSync('grammar-quiz.json', 'utf8'));

// Helper: deterministic hash for shuffling and option ordering
function hashStr(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

// 2. Upgrade all existing questions in grammar-quiz.json AND add 5 new deep questions per topic
for (const [idStr, qs] of Object.entries(grammarQuiz)) {
  const id = Number(idStr);
  const g = grammarMap.get(id);
  if (!g) continue;

  const structSummary = (g.structures || []).slice(0, 2).map(s => `${s.label}: ${s.formula}`).join(' | ');
  const usageNote = (g.usage && g.usage[0]) ? g.usage[0] : g.explanation;

  // Upgrade explanations of existing questions
  for (const q of qs) {
    const correctOpt = q.options[q.answer];
    const correctBaseReason = q.explanations[q.answer];
    q.explanations = q.options.map((opt, idx) => {
      const baseReason = q.explanations[idx];
      if (idx === q.answer) {
        return `✓ Chính xác (“${opt}”): ${baseReason} • Quy tắc trọng tâm (${g.title}): ${g.rule}` + (structSummary ? ` • Công thức áp dụng: ${structSummary}` : '');
      } else {
        return `✗ Chưa đúng (“${opt}”): ${baseReason} • Cách sửa đúng: Trong ngữ cảnh câu này cần dùng “${correctOpt}” (${correctBaseReason.replace(/\.$/, '')}). • Lưu ý tránh bẫy: ${g.pitfall}`;
      }
    });
  }

  // Add 5 new diverse pedagogical questions per topic from g.examples, g.structures, and g.practice
  const examples = g.examples || [];
  const otherLessons = grammarLessons.filter(x => x.id !== id && x.topic === g.topic);
  const fallbackLessons = grammarLessons.filter(x => x.id !== id);
  const dLesson1 = otherLessons[id % Math.max(1, otherLessons.length)] || fallbackLessons[id % fallbackLessons.length];
  const dLesson2 = otherLessons[(id + 3) % Math.max(1, otherLessons.length)] || fallbackLessons[(id + 7) % fallbackLessons.length];

  for (let k = 0; k < 5; k++) {
    const ex = examples[k % examples.length];
    const exNext = examples[(k + 1) % examples.length] || ex;
    const dEx1 = (dLesson1.examples && dLesson1.examples[k % dLesson1.examples.length]) || { en: dLesson1.example, vi: dLesson1.vi, why: dLesson1.rule };
    const dEx2 = (dLesson2.examples && dLesson2.examples[k % dLesson2.examples.length]) || { en: dLesson2.example, vi: dLesson2.vi, why: dLesson2.rule };

    let qText = '';
    let pool = [];

    if (k === 0) {
      // Type A: Context-to-Sentence Application
      qText = `[Ngữ cảnh thực tế · ${ex.context}] Bạn muốn diễn đạt ý: “${ex.vi}” bằng chủ điểm "${g.englishTitle || g.title}". Câu tiếng Anh nào dưới đây đúng chuẩn ngữ pháp?`;
      pool = [
        {
          opt: ex.en,
          exp: `✓ Chính xác: “${ex.en}” áp dụng chuẩn xác chủ điểm ${g.title} trong tình huống “${ex.context}”. • Phân tích ngữ pháp: ${ex.why} • Quy tắc gốc: ${g.rule}`
        },
        {
          opt: dEx1.en !== ex.en ? dEx1.en : `Not valid: ${exNext.en}`,
          exp: `✗ Chưa đúng: Câu này thuộc cấu trúc/ngữ cảnh khác (“${dEx1.vi || dLesson1.title}”), không diễn đạt đúng ý “${ex.vi}” theo quy tắc ${g.title} (${ex.why}).`
        },
        {
          opt: dEx2.en !== ex.en && dEx2.en !== dEx1.en ? dEx2.en : `Incorrect form of: ${ex.en}`,
          exp: `✗ Chưa đúng: Lựa chọn này không khớp với nghĩa “${ex.vi}” và cấu trúc yêu cầu của ${g.title}. Câu chuẩn phải là “${ex.en}” (${ex.why}).`
        }
      ];
    } else if (k === 1) {
      // Type B: Grammatical Function & Why-Analysis
      qText = `Phân tích câu mẫu trong bài (${g.englishTitle || g.title}):\n“${ex.en}” (${ex.vi})\nVì sao cấu trúc trong câu này được sử dụng như vậy?`;
      pool = [
        {
          opt: ex.why,
          exp: `✓ Chính xác: ${ex.why} • Mở rộng cách dùng (${g.title}): ${usageNote} • Lưu ý thêm: ${g.pitfall}`
        },
        {
          opt: `Vì đây là mệnh đề điều kiện giả định trái với quá khứ (${dLesson1.title}).`,
          exp: `✗ Chưa đúng: Câu “${ex.en}” thuộc chủ điểm ${g.title} (ngữ cảnh: ${ex.context}), hoàn toàn không phải mệnh đề giả định trái với quá khứ. Lý do đúng là: ${ex.why}`
        },
        {
          opt: `Vì động từ chính bắt buộc chia ở thể bị động khách quan không cần chủ ngữ (${dLesson2.title}).`,
          exp: `✗ Chưa đúng: Giải thích này sai bản chất ngữ pháp của câu “${ex.en}”. Trong câu này: ${ex.why} (Quy tắc: ${g.rule}).`
        }
      ];
    } else if (k === 2) {
      // Type C: Structure & Formula Recognition
      const st = (g.structures && g.structures[0]) || { label: g.title, formula: g.rule };
      const dSt1 = (dLesson1.structures && dLesson1.structures[0]) || { label: dLesson1.title, formula: dLesson1.rule };
      const dSt2 = (dLesson2.structures && dLesson2.structures[0]) || { label: dLesson2.title, formula: dLesson2.rule };
      qText = `Khi áp dụng chủ điểm "${g.englishTitle || g.title}" (${st.label}) như trong câu “${ex.en}”, công thức/quy tắc chuẩn cần nhớ là gì?`;
      pool = [
        {
          opt: st.formula,
          exp: `✓ Chính xác: Công thức chuẩn cho “${st.label}” (${g.title}) là: ${st.formula} • Ví dụ minh họa: “${ex.en}” (${ex.vi} — ${ex.why}).`
        },
        {
          opt: dSt1.formula !== st.formula ? dSt1.formula : `S + had been + V-ing + since/for (${dLesson1.title})`,
          exp: `✗ Chưa đúng: Đây là công thức của chủ điểm khác (${dLesson1.title}), không phải mẫu “${st.label}” của ${g.title}. Công thức đúng phải là: ${st.formula}`
        },
        {
          opt: dSt2.formula !== st.formula && dSt2.formula !== dSt1.formula ? dSt2.formula : `Having + V3/ed + S + would have + V3 (${dLesson2.title})`,
          exp: `✗ Chưa đúng: Công thức này không thuộc mục “${st.label}” của bài ${g.title}. Hãy nhớ quy tắc chuẩn: ${st.formula} (Tránh lỗi: ${g.pitfall}).`
        }
      ];
    } else if (k === 3) {
      // Type D: Pitfall & Error Prevention Check
      qText = `Khi sử dụng "${g.englishTitle || g.title}" (ví dụ: “${ex.en}”), người học cần lưu ý nguyên tắc nào dưới đây để tránh lỗi sai phổ biến?`;
      pool = [
        {
          opt: g.pitfall,
          exp: `✓ Chính xác: Đây chính là lỗi sai điển hình nhất cần tránh khi dùng ${g.title}: ${g.pitfall} • Quy tắc chuẩn: ${g.rule}`
        },
        {
          opt: `Luôn lược bỏ toàn bộ trợ động từ và chủ ngữ trong mọi câu khẳng định lẫn câu hỏi.`,
          exp: `✗ Chưa đúng: Việc lược bỏ toàn bộ chủ ngữ và trợ động từ sẽ làm câu sai cấu trúc ngữ pháp. Lưu ý đúng của bài ${g.title} là: ${g.pitfall}`
        },
        {
          opt: `Bắt buộc thêm giới từ "to" vào ngay sau mọi trợ động từ khuyết thiếu và trạng từ tần suất.`,
          exp: `✗ Chưa đúng: Đây là nhận định sai quy tắc ngữ pháp tiếng Anh. Điểm cần đặc biệt lưu ý ở chủ điểm ${g.title} là: ${g.pitfall}`
        }
      ];
    } else {
      // Type E: Second Context Application
      qText = `[Vận dụng ngữ cảnh · ${exNext.context}] Câu nào dưới đây sử dụng đúng cấu trúc "${g.englishTitle || g.title}" để diễn đạt: “${exNext.vi}”?`;
      pool = [
        {
          opt: exNext.en,
          exp: `✓ Chính xác: “${exNext.en}” vận dụng đúng chủ điểm ${g.title} trong ngữ cảnh “${exNext.context}”. • Giải thích chi tiết: ${exNext.why} • Ghi nhớ: ${g.explanation}`
        },
        {
          opt: dEx1.en !== exNext.en ? dEx1.en : `Wrong structure: ${ex.en} (in ${dLesson1.title})`,
          exp: `✗ Chưa đúng: Câu này không diễn đạt ý “${exNext.vi}” và không khớp ngữ cảnh đang hỏi. Câu đúng phải là “${exNext.en}” (${exNext.why}).`
        },
        {
          opt: dEx2.en !== exNext.en && dEx2.en !== dEx1.en ? dEx2.en : `Ungrammatical pattern for: ${exNext.vi}`,
          exp: `✗ Chưa đúng: Phương án này sai lệch cả về cấu trúc lẫn ý nghĩa so với yêu cầu đề bài. Đáp án chuẩn là “${exNext.en}” (${exNext.why}).`
        }
      ];
    }

    // Ensure 3 distinct options
    if (new Set(pool.map(x => x.opt)).size === 3) {
      const pos = (id + k) % 3;
      const ordered = [];
      ordered[pos] = pool[0];
      ordered[(pos + 1) % 3] = pool[1];
      ordered[(pos + 2) % 3] = pool[2];
      qs.push({
        id: `g${id}-extra-${k + 1}`,
        q: qText,
        options: ordered.map(x => x.opt),
        answer: pos,
        explanations: ordered.map(x => x.exp),
        category: 'grammar',
        grammarId: id
      });
    }
  }
}

fs.writeFileSync('grammar-quiz.json', JSON.stringify(grammarQuiz, null, 2));
console.log('Upgraded grammar-quiz.json total questions:', Object.values(grammarQuiz).reduce((s, a) => s + a.length, 0));

// 3. Now upgrade all 348 readings in readings-v3.json:
//    - Diversify Vocabulary questions into 5 distinct formats & shuffle their order so they never match Learn-the-words order!
//    - Expand Grammar questions in each reading to 4 questions per grammar focus (8-12 grammar questions per reading) with deep explanations!
const readings = JSON.parse(fs.readFileSync('readings-v3.json', 'utf8'));
const synonymSets = [
  ['illness', 'disease'], ['worry', 'stress'], ['chance', 'opportunity'],
  ['choice', 'option', 'alternative'], ['helpful', 'useful'], ['excellent', 'brilliant'],
  ['maybe', 'perhaps'], ['certain', 'sure'], ['reply', 'respond'], ['present', 'show'],
  ['chef', 'cook'], ['tale', 'story'], ['gift', 'present'], ['happy', 'pleased'],
  ['clever', 'intelligent'], ['awful', 'terrible'], ['correct', 'right'],
  ['finish', 'end'], ['sad', 'unhappy'], ['speak', 'talk'], ['look', 'appearance'],
  ['quiet', 'silent']
];

function areNearSynonyms(w1, w2) {
  return synonymSets.some(s => s.includes(w1.toLowerCase()) && s.includes(w2.toLowerCase()));
}

for (const l of readings) {
  const contentQs = l.questions.filter(q => q.category === 'content').map(q => {
    const correctOpt = q.options[q.answer];
    const baseRight = q.explanations[q.answer];
    q.explanations = q.options.map((opt, idx) => {
      const exp = q.explanations[idx] || "";
      if (exp.length > 25) return exp;
      if (idx === q.answer) return "✓ Đúng (“" + opt + "”): " + exp + " (Dựa theo nội dung bài đọc: " + l.englishTitle + ").";
      return "✗ Chưa đúng (“" + opt + "”): " + exp + " Đáp án đúng theo bài đọc là “" + correctOpt + "” (" + baseRight + ").";
    });
    return q;
  });

  // Build upgraded, multi-format Vocabulary questions for each target i (0..l.targets.length-1)
  const vocabQuestionsByTarget = l.targets.map((t, i) => {
    const paraText = l.paragraphs[t.occurrence.p][0];
    const boundary = paraText.lastIndexOf('. ', t.occurrence.start);
    const sStart = boundary < 0 ? 0 : boundary + 2;
    const sEndIdx = paraText.indexOf('. ', t.occurrence.end);
    const sentence = paraText.slice(sStart, sEndIdx < 0 ? paraText.length : sEndIdx + 1);

    // Build blanked sentence around t.occurrence
    const relStart = t.occurrence.start - sStart;
    const relEnd = t.occurrence.end - sStart;
    const blankedSentence = sentence.slice(0, relStart) + '______' + sentence.slice(relEnd);

    // Pick 2 strong distractors from the lesson's targets (preferring same POS!)
    const validOthers = l.targets.filter((x, idx) =>
      idx !== i &&
      x.word.toLowerCase() !== t.word.toLowerCase() &&
      x.vi.trim() !== t.vi.trim() &&
      !areNearSynonyms(x.word, t.word)
    );
    const samePosOthers = validOthers.filter(x => x.pos === t.pos);
    const poolA = samePosOthers.length >= 2 ? samePosOthers : validOthers;
    const d1 = poolA[(i * 7 + 3 + hashStr(l.id)) % poolA.length];
    const poolB = poolA.filter(x => x.word !== d1.word && x.vi !== d1.vi);
    const d2 = (poolB.length ? poolB : validOthers.filter(x => x.word !== d1.word && x.vi !== d1.vi))[(i * 11 + 5 + hashStr(l.id)) % Math.max(1, (poolB.length || validOthers.length - 1))];

    const senseNoteText = t.sourceSenseNote
      ? ` • Lưu ý phân biệt nghĩa nguồn: ${t.sourceSenseNote}`
      : (t.en ? ` • Định nghĩa chuẩn (${t.pos}): ${t.en}` : '');

    // Choose 1 of 5 diverse formats based on (i + hash) % 5
    // Note: If t.sourceSenseNote is present, use formats that highlight contextual meaning vs source sense note clearly!
    const formatIdx = (i + hashStr(l.id + ':' + t.word)) % 5;
    let qText = '';
    let pool = [];

    if (formatIdx === 0) {
      // Format 0: Cloze Fill-in-the-blank in the reading's sentence (Options: English words)
      qText = `[Điền từ vào ngữ cảnh bài đọc] Chọn từ đúng (${t.pos} — nghĩa trong bài: “${t.vi}”) để hoàn thành câu trích từ bài đọc:\n“${blankedSentence}”`;
      pool = [
        {
          opt: t.occurrence.text,
          exp: `✓ Chính xác (“${t.occurrence.text}” — mục từ ${t.word}, ${t.pos}): Trong câu văn này, “${t.occurrence.text}” mang nghĩa là “${t.vi}”, khớp hoàn toàn với ngữ pháp và mạch ý của đoạn đọc.${senseNoteText}`
        },
        {
          opt: d1.word !== t.occurrence.text ? d1.word : d1.word + ' (' + d1.pos + ')',
          exp: `✗ Chưa đúng (“${d1.word}”): Từ “${d1.word}” (${d1.pos}) có nghĩa là “${d1.vi}”, không phù hợp với chỗ trống cần nghĩa “${t.vi}” (${t.word}) trong câu này.`
        },
        {
          opt: d2.word !== t.occurrence.text && d2.word !== d1.word ? d2.word : d2.word + ' (' + d2.pos + ')',
          exp: `✗ Chưa đúng (“${d2.word}”): Từ “${d2.word}” (${d2.pos}) mang nghĩa là “${d2.vi}”, làm sai lệch ý nghĩa của câu gốc dùng “${t.occurrence.text}” (“${t.vi}”).`
        }
      ];
    } else if (formatIdx === 1 && t.en && !t.sourceSenseNote) {
      // Format 1: English Definition + Context to Target Word (Options: English words)
      qText = `[Nhận diện từ theo định nghĩa & ngữ cảnh] Từ vựng nào (${t.pos}) xuất hiện trong câu “${blankedSentence}” khớp với định nghĩa: “${t.en}” (nghĩa trong bài: “${t.vi}”)?`;
      pool = [
        {
          opt: t.word,
          exp: `✓ Chính xác (“${t.word}”, ${t.pos}): Từ này xuất hiện dưới dạng “${t.occurrence.text}” trong câu, mang nghĩa “${t.vi}” và khớp chính xác với định nghĩa tiếng Anh: ${t.en}.`
        },
        {
          opt: d1.word,
          exp: `✗ Chưa đúng (“${d1.word}”, ${d1.pos}): “${d1.word}” có nghĩa là “${d1.vi}” (${d1.en || 'khác nghĩa'}), không khớp với định nghĩa và chỗ trống của “${t.word}”.`
        },
        {
          opt: d2.word,
          exp: `✗ Chưa đúng (“${d2.word}”, ${d2.pos}): “${d2.word}” có nghĩa là “${d2.vi}” (${d2.en || 'khác nghĩa'}), không phải từ mục tiêu “${t.word}” (“${t.vi}”).`
        }
      ];
    } else if (formatIdx === 2 || t.sourceSenseNote) {
      // Format 2: Contextual Meaning & Sense Inference (Options: Vietnamese contextual meanings)
      qText = `[Suy luận nghĩa theo ngữ cảnh] Đọc kỹ câu trích từ bài: “${sentence}”\nTrong ngữ cảnh này, từ “${t.occurrence.text}” (${t.pos}) được dùng với ý nghĩa nào?`;
      pool = [
        {
          opt: t.vi,
          exp: `✓ Chính xác (“${t.vi}”): Dựa vào mạch văn của câu “${sentence}”, mục từ “${t.word}” (${t.pos}) mang nghĩa là “${t.vi}”.${senseNoteText}`
        },
        {
          opt: d1.vi,
          exp: `✗ Chưa đúng (“${d1.vi}”): Đây là nghĩa của mục từ “${d1.word}” (${d1.pos}) trong bài, còn “${t.occurrence.text}” (${t.word}) ở câu này có nghĩa là “${t.vi}”.`
        },
        {
          opt: d2.vi,
          exp: `✗ Chưa đúng (“${d2.vi}”): Đây là nghĩa của mục từ “${d2.word}” (${d2.pos}) trong bài; không khớp với nghĩa “${t.vi}” của “${t.word}” trong ngữ cảnh trên.`
        }
      ];
    } else if (formatIdx === 3) {
      // Format 3: Expressing an idea in context (Vietnamese Meaning -> English Target Word)
      qText = `[Vận dụng từ vựng trong câu] Để diễn đạt ý “${t.vi}” (${t.pos}) trong câu văn của bài đọc: “${blankedSentence}”, tác giả đã sử dụng từ nào?`;
      pool = [
        {
          opt: t.word,
          exp: `✓ Chính xác (“${t.word}”, ${t.pos}): Trong bài, tác giả dùng “${t.occurrence.text}” (dạng của “${t.word}”) để diễn đạt chính xác ý “${t.vi}”.${senseNoteText}`
        },
        {
          opt: d1.word,
          exp: `✗ Chưa đúng (“${d1.word}”): “${d1.word}” (${d1.pos}) có nghĩa là “${d1.vi}”, không diễn đạt ý “${t.vi}” trong câu văn đang xét.`
        },
        {
          opt: d2.word,
          exp: `✗ Chưa đúng (“${d2.word}”): “${d2.word}” (${d2.pos}) có nghĩa là “${d2.vi}”, trong khi từ cần chọn ở đây là “${t.word}” (“${t.vi}”).`
        }
      ];
    } else {
      // Format 4: Part of Speech + Contextual Meaning Analysis
      qText = `[Phân tích từ loại & nghĩa ngữ cảnh] Quan sát từ “${t.occurrence.text}” trong câu: “${sentence}”\nTổ hợp (Từ loại · Nghĩa tiếng Việt) nào mô tả chính xác mục từ “${t.word}” ở đây?`;
      pool = [
        {
          opt: `${t.pos} · ${t.vi}`,
          exp: `✓ Chính xác (“${t.pos} · ${t.vi}”): Trong câu trên, “${t.occurrence.text}” đóng vai trò là ${t.pos} (mục từ “${t.word}”) với nghĩa ngữ cảnh là “${t.vi}”.${senseNoteText}`
        },
        {
          opt: `${d1.pos} · ${d1.vi}`,
          exp: `✗ Chưa đúng (“${d1.pos} · ${d1.vi}”): Đây là mô tả của từ “${d1.word}”, không phải của “${t.word}” (${t.pos} · ${t.vi}).`
        },
        {
          opt: `${d2.pos} · ${d2.vi}`,
          exp: `✗ Chưa đúng (“${d2.pos} · ${d2.vi}”): Đây là mô tả của từ “${d2.word}”, còn “${t.word}” ở đây là ${t.pos} mang nghĩa “${t.vi}”.`
        }
      ];
    }

    const ansPos = (i + hashStr(l.id + '#ans#' + i)) % 3;
    const ordered = [];
    ordered[ansPos] = pool[0];
    ordered[(ansPos + 1) % 3] = pool[1];
    ordered[(ansPos + 2) % 3] = pool[2];

    return {
      q: qText,
      category: 'vocabulary',
      options: ordered.map(x => x.opt),
      answer: ansPos,
      explanations: ordered.map(x => x.exp),
      targetWord: t.word,
      targetIndex: i
    };
  });

  // Deterministic non-sequential shuffle of vocabQuestionsByTarget so the order NEVER matches Learn 25-30 words!
  const indices = Array.from({ length: vocabQuestionsByTarget.length }, (_, idx) => idx);
  let seed = hashStr(l.id + ':shuffle-vocab') || 123456789;
  for (let idx = indices.length - 1; idx > 0; idx--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const swapIdx = seed % (idx + 1);
    [indices[idx], indices[swapIdx]] = [indices[swapIdx], indices[idx]];
  }
  // Ensure the first 3 items are never [0, 1, 2]
  if (indices[0] === 0 && indices[1] === 1) {
    [indices[0], indices[indices.length - 1]] = [indices[indices.length - 1], indices[0]];
  }
  const shuffledVocabQs = indices.map(idx => vocabQuestionsByTarget[idx]);

  // Build expanded & upgraded Grammar questions for the reading (4 questions per grammar focus = 8 to 12 grammar questions per reading!)
  const newGrammarQs = [];
  const partOffset = l.part === 'B' ? 1 : 0;
  for (const [gi, gSpec] of (l.grammar || []).entries()) {
    const gLesson = grammarMap.get(gSpec.id);
    const topicPool = grammarQuiz[gSpec.id] || [];
    const otherG1 = grammarMap.get(((gSpec.id + 3) % 120) + 1);
    const otherG2 = grammarMap.get(((gSpec.id + 9) % 120) + 1);

    // 1. First question for this grammar focus: Directly analyses the exact sentence `gSpec.example` from the reading!
    if (gSpec.example && gSpec.note && gLesson) {
      const ansPos = (gi + partOffset + hashStr(l.id)) % 3;
      const pool = [
        {
          opt: `${gLesson.englishTitle || gLesson.title}: ${gSpec.note}`,
          exp: `✓ Chính xác: Trong câu trích từ bài đọc “${gSpec.example}”, tác giả sử dụng chủ điểm ${gLesson.title} (${gLesson.englishTitle}). • Phân tích trong bài: ${gSpec.note} • Quy tắc tổng quát: ${gLesson.rule} • Lưu ý tránh bẫy: ${gLesson.pitfall}`
        },
        {
          opt: `${otherG1.englishTitle || otherG1.title}: Diễn tả giả định trái ngược hoàn toàn với sự thật trong quá khứ.`,
          exp: `✗ Chưa đúng: Câu “${gSpec.example}” trong bài không phải là giả định trái với quá khứ thuộc bài ${otherG1.title}. Điểm ngữ pháp thực sự được dùng ở đây là ${gLesson.title}: ${gSpec.note}`
        },
        {
          opt: `${otherG2.englishTitle || otherG2.title}: Đảo ngữ phủ định bắt buộc đứng đầu câu để nhấn mạnh tân ngữ.`,
          exp: `✗ Chưa đúng: Nhận định này không khớp với cấu trúc của câu “${gSpec.example}”. Theo phân tích ngữ pháp của bài đọc: ${gSpec.note} (Chủ điểm: ${gLesson.title} — ${gLesson.rule}).`
        }
      ];
      const ordered = [];
      ordered[ansPos] = pool[0];
      ordered[(ansPos + 1) % 3] = pool[1];
      ordered[(ansPos + 2) % 3] = pool[2];
      newGrammarQs.push({
        q: `[Ngữ pháp trong ngữ cảnh bài đọc] Phân tích câu văn trích từ bài:\n“${gSpec.example}”\nCấu trúc ngữ pháp và ý nghĩa nào dưới đây giải thích đúng câu trên?`,
        options: ordered.map(x => x.opt),
        answer: ansPos,
        explanations: ordered.map(x => x.exp),
        category: 'grammar',
        grammarId: gSpec.id
      });
    }

    // 2. Add 3 more distinct upgraded questions for this grammarId from our upgraded grammarQuiz bank
    const startIdx = (partOffset * 4 + gi * 3) % Math.max(1, topicPool.length);
    const countToTake = (gSpec.example && gSpec.note && gLesson) ? 3 : 4;
    for (let k = 0; k < countToTake && k < topicPool.length; k++) {
      const srcQ = topicPool[(startIdx + k * 2) % topicPool.length];
      newGrammarQs.push({
        ...srcQ,
        category: 'grammar',
        grammarId: gSpec.id
      });
    }
  }

  l.questions = [...contentQs, ...shuffledVocabQs, ...newGrammarQs];
  l.questions.forEach((q, idx) => {
    q.id = `${l.id}-v4-${idx}`;
  });
}

fs.writeFileSync('readings-v3.json', JSON.stringify(readings, null, 2));

// Update the historical snapshots so regression checks verify the upgraded baseline consistently
const beforeAdvanced = readings.filter(l => !/^(b2[sc]|c1[sc])-/.test(l.id));
const beforeB1 = readings.filter(l => !/^(b1|b2[sc]|c1[sc])-/.test(l.id));
const beforeA2 = readings.filter(l => !/^(a2|b1|b2[sc]|c1[sc])-/.test(l.id));
fs.writeFileSync('readings-before-advanced.json', JSON.stringify(beforeAdvanced, null, 2));
fs.writeFileSync('readings-before-b1.json', JSON.stringify(beforeB1, null, 2));
fs.writeFileSync('readings-before-a2.json', JSON.stringify(beforeA2, null, 2));

const totalReadingQuestions = readings.reduce((s, l) => s + l.questions.length, 0);
const totalReadingGrammar = readings.reduce((s, l) => s + l.questions.filter(q => q.category === 'grammar').length, 0);
const totalReadingVocab = readings.reduce((s, l) => s + l.questions.filter(q => q.category === 'vocabulary').length, 0);
console.log(`Upgraded all 348 readings: ${totalReadingQuestions} total reading questions (${totalReadingVocab} multi-format shuffled vocabulary questions, ${totalReadingGrammar} deep grammar questions).`);

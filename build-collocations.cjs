const fs = require('fs');
const path = require('path');

const initReadings = JSON.parse(fs.readFileSync(path.join(__dirname, "readings-v3.json"), "utf8"));
if (initReadings.reduce((s, l) => s + l.questions.length, 0) < 14000 && fs.existsSync(path.join(__dirname, "upgrade-questions.cjs"))) {
  require("./upgrade-questions.cjs");
}

const baseHtml = fs.readFileSync(path.join(__dirname, 'index-before-two-panels.html'), 'utf8');
const defaults = JSON.parse(baseHtml.match(/<script id="bundle" type="application\/json">([^<]*)<\/script>/)[1]);
const readings = JSON.parse(fs.readFileSync(path.join(__dirname, 'readings-v3.json'), 'utf8'));

const rawActiveGroups = [
  ...require('./collocation-content/batch1-a2-part1.cjs'),
  ...require('./collocation-content/batch1-a2-part2.cjs'),
  ...require('./collocation-content/batch1-a2-part3.cjs'),
  ...require('./collocation-content/batch2-a2-part1.cjs'),
  ...require('./collocation-content/batch2-a2-part2.cjs'),
  ...require('./collocation-content/batch2-a2-part3.cjs'),
  ...require('./collocation-content/batch2-a2-part4.cjs'),
  ...require('./collocation-content/batch1-b1-c1.cjs').filter(g => g.level === 'B1'),
  ...require('./collocation-content/batch3-b1-part1.cjs'),
  ...require('./collocation-content/batch3-b1-part2.cjs'),
  ...require('./collocation-content/batch3-b1-part3.cjs'),
  ...require('./collocation-content/batch4-b1-part1.cjs'),
  ...require('./collocation-content/batch4-b1-part2.cjs'),
  ...require('./collocation-content/batch4-b1-part3.cjs'),
  ...require('./collocation-content/batch1-b1-c1.cjs').filter(g => g.level === 'B2'),
  ...require('./collocation-content/batch5-b2-part1.cjs'),
  ...require('./collocation-content/batch5-b2-part2.cjs'),
  ...require('./collocation-content/batch5-b2-part3.cjs'),
  ...require('./collocation-content/batch6-b2.cjs'),
  ...require('./collocation-content/batch7-b2.cjs'),
  ...require('./collocation-content/batch1-b1-c1.cjs').filter(g => g.level === 'C1'),
  ...require('./collocation-content/batch8-c1.cjs'),
  ...require('./collocation-content/batch9-c1.cjs'),
  ...require('./collocation-content/batch10-c1.cjs')
];

// Verify and transform all 174 active groups (Batches 1–10 = 174 groups, 3,480 collocations)
const seenRowIndexes = new Set();
const activeByGroup = new Map();

const activeGroups = rawActiveGroups.map((g, gi) => {
  if (g.items.length !== 20) throw new Error(`Group ${g.id} must have 20 items, got ${g.items.length}`);
  const items = g.items.map((tuple, idx) => {
    const [rowIndex, word, pos, expectedLevel, collocation, pattern, en, vi, example, exampleVi, note] = tuple;
    const src = defaults[rowIndex];
    if (!src) throw new Error(`Invalid rowIndex ${rowIndex} in ${g.id}`);
    if (src.word !== word || src.pos !== pos) {
      throw new Error(`Mismatch at rowIndex ${rowIndex} in ${g.id}: expected ${word}(${pos}), got ${src.word}(${src.pos})`);
    }
    if (src.level === 'A1') {
      throw new Error(`Forbidden A1 word at rowIndex ${rowIndex} (${word}) in ${g.id}`);
    }
    if (seenRowIndexes.has(rowIndex)) {
      throw new Error(`Duplicate rowIndex ${rowIndex} (${word}) in ${g.id}`);
    }
    seenRowIndexes.add(rowIndex);
    return {
      id: `${g.id}-${String(idx + 1).padStart(2, '0')}`,
      rowIndex,
      word: src.word,
      pos: src.pos,
      level: src.level,
      collocation,
      pattern,
      en,
      vi,
      example,
      exampleVi,
      note
    };
  });

  // Build 10 rich multiple-choice practice questions per group
  const questions = [];
  for (let qi = 0; qi < 10; qi++) {
    const targetIdx = qi * 2;
    const item = items[targetIdx];
    const d1 = items[(targetIdx + 3) % 20];
    const d2 = items[(targetIdx + 7) % 20];
    const answerPos = (gi + qi) % 3;

    if (qi % 2 === 0) {
      const escapedCol = item.collocation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedCol, 'i');
      const blankedSentence = regex.test(item.example)
        ? item.example.replace(regex, '______')
        : `In this context, which collocation means "${item.en}"? (${item.exampleVi})`;

      const pool = [
        {
          opt: item.collocation,
          isCorrect: true,
          exp: `Đúng. Cụm collocation “${item.collocation}” (${item.pattern}) có nghĩa là “${item.vi}”, khớp chính xác với ngữ cảnh câu: “${item.example}” (${item.exampleVi}). ${item.note}`
        },
        {
          opt: d1.collocation,
          isCorrect: false,
          exp: `Chưa đúng. “${d1.collocation}” mang nghĩa là “${d1.vi}” (từ trọng tâm: ${d1.word}), không phù hợp với ngữ cảnh “${item.exampleVi}”.`
        },
        {
          opt: d2.collocation,
          isCorrect: false,
          exp: `Chưa đúng. “${d2.collocation}” mang nghĩa là “${d2.vi}” (từ trọng tâm: ${d2.word}), không khớp với ý nghĩa “${item.vi}” cần điền ở đây.`
        }
      ];
      const ordered = [];
      ordered[answerPos] = pool[0];
      ordered[(answerPos + 1) % 3] = pool[1];
      ordered[(answerPos + 2) % 3] = pool[2];

      questions.push({
        id: `${g.id}-q${qi + 1}`,
        targetIndex: targetIdx,
        category: 'context',
        q: regex.test(item.example)
          ? `Choose the natural collocation to complete the sentence:\n"${blankedSentence}"`
          : `Which collocation with "${item.word}" means "${item.en}"?`,
        options: ordered.map(x => x.opt),
        answer: answerPos,
        explanations: ordered.map(x => x.exp)
      });
    } else {
      const pool = [
        {
          opt: item.vi,
          isCorrect: true,
          exp: `Đúng. “${item.collocation}” (${item.pattern}) có nghĩa tiếng Việt là “${item.vi}” (${item.en}). Ví dụ: “${item.example}”. ${item.note}`
        },
        {
          opt: d1.vi,
          isCorrect: false,
          exp: `Chưa đúng. “${d1.vi}” là nghĩa của cụm “${d1.collocation}”, không phải của “${item.collocation}”.`
        },
        {
          opt: d2.vi,
          isCorrect: false,
          exp: `Chưa đúng. “${d2.vi}” là nghĩa của cụm “${d2.collocation}”, trong khi “${item.collocation}” có nghĩa là “${item.vi}”.`
        }
      ];
      const ordered = [];
      ordered[answerPos] = pool[0];
      ordered[(answerPos + 1) % 3] = pool[1];
      ordered[(answerPos + 2) % 3] = pool[2];

      questions.push({
        id: `${g.id}-q${qi + 1}`,
        targetIndex: targetIdx,
        category: 'meaning',
        q: `What is the meaning of the collocation "${item.collocation}" (headword: ${item.word}, ${item.pos}) in: "${item.example}"?`,
        options: ordered.map(x => x.opt),
        answer: answerPos,
        explanations: ordered.map(x => x.exp)
      });
    }
  }

  const groupObj = {
    id: g.id,
    group: g.group,
    level: g.level,
    batch: g.batch,
    order: gi + 1,
    englishTitle: g.englishTitle,
    title: g.title,
    items,
    questions
  };
  activeByGroup.set(g.group, groupObj);
  return groupObj;
});

const allReadingGroups = [];
const seenGroups = new Set();
for (const l of readings) {
  if (!seenGroups.has(l.group)) {
    seenGroups.add(l.group);
    allReadingGroups.push({
      group: l.group,
      level: l.level,
      groupTitle: l.groupTitle,
      titleVi: l.title,
      targets: l.targets
    });
  }
}

const batchAssignment = new Map();
for (const g of activeGroups) batchAssignment.set(g.group, g.batch);

const roadmapGroups = allReadingGroups.map(rg => {
  const completed = activeByGroup.get(rg.group);
  const batch = batchAssignment.get(rg.group);
  if (!completed) {
    throw new Error(`Expected all reading groups to be completed in Batches 1–10, missing ${rg.group}`);
  }
  return {
    id: completed.id,
    group: rg.group,
    level: rg.level,
    batch,
    status: 'complete',
    groupTitle: completed.englishTitle,
    titleVi: completed.title,
    collocationCount: completed.items.length,
    targets: completed.items.map(it => ({
      rowIndex: it.rowIndex,
      word: it.word,
      pos: it.pos,
      level: it.level,
      collocation: it.collocation,
      pattern: it.pattern,
      vi: it.vi
    }))
  };
});

const batchMeta = [
  { batch: 1, title: 'Đợt 1 · Nền tảng A2 trọng tâm & mẫu mở đầu B1–C1', focus: '15 nhóm A2 (300 collocations) + 2 nhóm B1 (40) + 2 nhóm B2 (40) + 1 nhóm C1 (20)', status: 'complete' },
  { batch: 2, title: 'Đợt 2 · Hoàn tất toàn bộ Collocations A2', focus: '21 nhóm A2 còn lại (420 collocations)', status: 'complete' },
  { batch: 3, title: 'Đợt 3 · Collocations B1 — Thiên nhiên, Hành trình, Khoa học & Đời sống', focus: '16 nhóm B1 (320 collocations)', status: 'complete' },
  { batch: 4, title: 'Đợt 4 · Hoàn tất toàn bộ Collocations B1 — Xã hội, Tư duy & Nghệ thuật', focus: '16 nhóm B1 còn lại (320 collocations, hoàn tất 100% B1 = 680/680)', status: 'complete' },
  { batch: 5, title: 'Đợt 5 · Collocations B2 — Khoa học, Y sinh, Khám phá & Nhận thức', focus: '18 nhóm B2 đầu tiên (360 collocations)', status: 'complete' },
  { batch: 6, title: 'Đợt 6 · Collocations B2 — Kinh tế, Luật pháp & Đổi mới', focus: '18 nhóm B2 văn hóa – xã hội & khoa học (360 collocations)', status: 'complete' },
  { batch: 7, title: 'Đợt 7 · Hoàn tất toàn bộ Collocations B2 — Đô thị, Xã hội & Môi trường', focus: '18 nhóm B2 còn lại (360 collocations, hoàn tất 100% B2 = 1.120/1.120)', status: 'complete' },
  { batch: 8, title: 'Đợt 8 · Collocations C1 — Học thuật, Chính sách & Xã hội', focus: '16 nhóm C1 xã hội & nhân văn (320 collocations)', status: 'complete' },
  { batch: 9, title: 'Đợt 9 · Collocations C1 — Khoa học, Lập luận & Hệ thống', focus: '16 nhóm C1 khoa học & tư duy phản biện (320 collocations)', status: 'complete' },
  { batch: 10, title: 'Đợt 10 · Hoàn tất toàn bộ Collocations C1 — Di sản, Thương mại & Toàn cầu', focus: '15 nhóm C1 cuối cùng (300 collocations, hoàn tất 100% lộ trình 3.480/3.480 collocations A2–C1)', status: 'complete' }
].map(b => {
  const gs = roadmapGroups.filter(g => g.batch === b.batch);
  return {
    ...b,
    groupCount: gs.length,
    collocationCount: gs.reduce((s, g) => s + g.collocationCount, 0),
    levels: [...new Set(gs.map(g => g.level))]
  };
});

const planData = {
  version: 5,
  totalPlannedCollocations: roadmapGroups.reduce((s, g) => s + g.collocationCount, 0),
  completedCollocations: activeGroups.reduce((s, g) => s + g.items.length, 0),
  totalGroups: roadmapGroups.length,
  completedGroups: activeGroups.length,
  levels: {
    A2: {
      groups: roadmapGroups.filter(g => g.level === 'A2').length,
      completedGroups: activeGroups.filter(g => g.level === 'A2').length,
      plannedCollocations: roadmapGroups.filter(g => g.level === 'A2').reduce((s, g) => s + g.collocationCount, 0),
      completedCollocations: activeGroups.filter(g => g.level === 'A2').reduce((s, g) => s + g.items.length, 0)
    },
    B1: {
      groups: roadmapGroups.filter(g => g.level === 'B1').length,
      completedGroups: activeGroups.filter(g => g.level === 'B1').length,
      plannedCollocations: roadmapGroups.filter(g => g.level === 'B1').reduce((s, g) => s + g.collocationCount, 0),
      completedCollocations: activeGroups.filter(g => g.level === 'B1').reduce((s, g) => s + g.items.length, 0)
    },
    B2: {
      groups: roadmapGroups.filter(g => g.level === 'B2').length,
      completedGroups: activeGroups.filter(g => g.level === 'B2').length,
      plannedCollocations: roadmapGroups.filter(g => g.level === 'B2').reduce((s, g) => s + g.collocationCount, 0),
      completedCollocations: activeGroups.filter(g => g.level === 'B2').reduce((s, g) => s + g.items.length, 0)
    },
    C1: {
      groups: roadmapGroups.filter(g => g.level === 'C1').length,
      completedGroups: activeGroups.filter(g => g.level === 'C1').length,
      plannedCollocations: roadmapGroups.filter(g => g.level === 'C1').reduce((s, g) => s + g.collocationCount, 0),
      completedCollocations: activeGroups.filter(g => g.level === 'C1').reduce((s, g) => s + g.items.length, 0)
    }
  },
  batches: batchMeta,
  groups: roadmapGroups
};

fs.writeFileSync(path.join(__dirname, 'collocations-v1.json'), JSON.stringify(activeGroups, null, 2));
fs.writeFileSync(path.join(__dirname, 'collocations-plan.json'), JSON.stringify(planData, null, 2));

const mdLines = [
  '# Lộ trình 3.480 Collocations (A2–C1) — English Improve',
  '',
  '## 1. Tổng quan lộ trình (Hoàn tất 100% Đợt 1–10)',
  '',
  '- **Phạm vi từ vựng:** Chỉ sử dụng từ vựng từ cấp độ **A2 trở lên (A2, B1, B2, C1)** trong bộ dữ liệu gốc của dự án (`4.867` mục từ A2–C1; loại trừ hoàn toàn `1.076` mục từ A1).',
  `- **Tổng số Collocations trong lộ trình:** **${planData.totalPlannedCollocations.toLocaleString('vi-VN')} collocations** chia đều cho **${planData.totalGroups} nhóm chủ đề** (mỗi nhóm 20 collocations trọng tâm gắn với \`rowIndex\` chuẩn).`,
  `- **Đã hoàn thành 100% (Đợt 1 đến Đợt 10):** **${planData.completedCollocations.toLocaleString('vi-VN')} collocations** thuộc **${planData.completedGroups}/${planData.totalGroups} nhóm chủ đề** (hoàn tất **100% A2 = 720/720**, **100% B1 = 680/680**, **100% B2 = 1.120/1.120**, **100% C1 = 960/960**) kèm **${activeGroups.reduce((s, g) => s + g.questions.length, 0)} câu hỏi trắc nghiệm** có giải thích chi tiết cho cả 3 lựa chọn A/B/C.`,
  '',
  '## 2. Phân bổ theo cấp độ CEFR (A2–C1)',
  '',
  '| Cấp độ | Mục từ trong dự án | Số nhóm chủ đề | Tổng Collocations lộ trình | Đã hoàn thành (Đợt 1–10) | Trạng thái |',
  '|---|---:|---:|---:|---:|---|',
  `| **A2** | 990 | ${planData.levels.A2.groups} | ${planData.levels.A2.plannedCollocations} | **${planData.levels.A2.completedCollocations}** (36/36 nhóm) | **Hoàn tất 100% A2 ✓** |`,
  `| **B1** | 902 | ${planData.levels.B1.groups} | ${planData.levels.B1.plannedCollocations} | **${planData.levels.B1.completedCollocations}** (34/34 nhóm) | **Hoàn tất 100% B1 ✓** |`,
  `| **B2** | 1.571 | ${planData.levels.B2.groups} | ${planData.levels.B2.plannedCollocations} | **${planData.levels.B2.completedCollocations}** (56/56 nhóm) | **Hoàn tất 100% B2 ✓** |`,
  `| **C1** | 1.404 | ${planData.levels.C1.groups} | ${planData.levels.C1.plannedCollocations} | **${planData.levels.C1.completedCollocations}** (48/48 nhóm) | **Hoàn tất 100% C1 ✓** |`,
  `| **Tổng (A2–C1)** | **4.867** | **${planData.totalGroups}** | **${planData.totalPlannedCollocations}** | **${planData.completedCollocations}** (**${planData.completedGroups} nhóm**) | **Hoàn tất 100% Đợt 1–10 ✓** |`,
  '',
  '## 3. Kế hoạch 10 đợt triển khai (Batches 1–10)',
  '',
  '| Đợt | Tên đợt | Cấp độ | Số nhóm | Số Collocations | Trạng thái |',
  '|---:|---|---|---:|---:|---|',
  ...batchMeta.map(b => `| **Đợt ${b.batch}** | ${b.title} | ${b.levels.join(', ')} | ${b.groupCount} | ${b.collocationCount} | Đã hoàn thành ✓ |`),
  '',
  `## 4. Danh sách ${activeGroups.length} nhóm Đợt 1–10 đã hoàn thành (${planData.completedCollocations.toLocaleString('vi-VN')} Collocations)`,
  '',
  '| # | Đợt | Mã nhóm | Cấp độ | Chủ đề tiếng Anh | Chủ đề tiếng Việt | Số Collocations | Số câu hỏi |',
  '|---:|:---:|---|---|---|---|:---:|:---:|',
  ...activeGroups.map((g, i) => `| ${i + 1} | Đợt ${g.batch} | \`${g.id}\` | **${g.level}** | ${g.englishTitle} | ${g.title} | ${g.items.length} | ${g.questions.length} |`),
  ''
];

fs.writeFileSync(path.join(__dirname, 'COLLOCATION_ROADMAP.md'), mdLines.join('\n'));
console.log(`Built ${activeGroups.length} active groups (${planData.completedCollocations} collocations, ${activeGroups.reduce((s, g) => s + g.questions.length, 0)} questions) and full roadmap of ${planData.totalPlannedCollocations} collocations across ${planData.totalGroups} groups.`);

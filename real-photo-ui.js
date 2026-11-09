const photoTopicsData = (() => {
  try {
    const el = document.getElementById('photo-topics');
    return el ? JSON.parse(el.textContent) : { readings: {}, vocab: {} };
  } catch {
    return { readings: {}, vocab: {} };
  }
})();

const photoMemoryCache = new Map();
try {
  const savedPhotos = JSON.parse(localStorage.getItem('ox5-real-photos-v3') || '{}');
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
        if (count >= 750) break;
      }
    }
    localStorage.setItem('ox5-real-photos-v3', JSON.stringify(obj));
  } catch {}
}

// Strict concrete-only resolver: returns null for abstract, functional, or polysemous words
// so learners are never shown misleading or guessed images.
function resolveVocabPhotoTopic(r) {
  if (!r || !r.word) return null;
  const w = String(r.word).replace(/\([^)]*\)|[¹²³⁴]/g, '').trim();
  const lw = w.toLowerCase();
  const pos = (r.pos || 'noun').toLowerCase();
  const directKey = lw + ':' + pos;
  const mapped = photoTopicsData.vocab && photoTopicsData.vocab[directKey];
  if (!mapped) return null;
  return {
    query: mapped,
    caption: 'Minh họa "' + w + '" (' + pos + ')' + (r.example ? ' · "' + r.example + '"' : '')
  };
}

function readingPhotoCard(l, compact = false) {
  if (!l) return '';
  const query = photoTopicsData.readings?.[l.id] || l.englishTitle || l.title;
  if (!query) return '';
  const caption = l.englishTitle + ' (' + query + ')';
  return '<figure class="real-photo-card reading-photo-card' + (compact ? ' compact-photo' : '') + '" data-photo-kind="reading" data-photo-query="' + esc(query) + '" data-photo-caption="' + esc(caption) + '"><div class="real-photo-frame"><div class="real-photo-placeholder">Đang tải ảnh tư liệu (' + esc(query) + ')…</div></div><figcaption class="real-photo-caption"><span class="photo-badge">Ảnh thật · Wikimedia</span> <span>' + esc(caption) + '</span></figcaption></figure>';
}

// Omit repetitive per-paragraph and gallery filler photos so readings load fast and stay uncluttered
function readingParagraphPhoto() {
  return '';
}

function readingSceneGallery() {
  return '';
}

function vocabPhotoCard(r, compact = false) {
  const info = resolveVocabPhotoTopic(r);
  if (!info) return '';
  return '<figure class="real-photo-card vocab-photo-card' + (compact ? ' compact-photo' : '') + '" data-photo-kind="vocab" data-photo-query="' + esc(info.query) + '" data-photo-caption="' + esc(info.caption) + '"><div class="real-photo-frame"><div class="real-photo-placeholder">Đang tải ảnh: ' + esc(info.query) + '</div></div><figcaption class="real-photo-caption"><span class="photo-badge">Ảnh thật</span> <span>' + esc(info.caption) + '</span></figcaption></figure>';
}

function vocabularyPhotoCard(r, extraVi = '', variant = '') {
  return vocabPhotoCard(r, Boolean(variant && variant.includes('compact')));
}

function collocationPhotoCard(it) {
  if (!it) return '';
  const r = (typeof defaults !== 'undefined' && defaults[it.rowIndex])
    ? defaults[it.rowIndex]
    : { word: it.word || it.headword, pos: it.pos, def: it.en || it.sense, example: it.example };
  return vocabPhotoCard(r, true);
}

// Omit stock photos from abstract grammar rules
function grammarPhotoCard() {
  return '';
}

function isRealPhotoUrl(url, title = '') {
  if (!url || typeof url !== 'string') return false;
  const lower = (url + ' ' + title).toLowerCase();
  if (/\.(svg|gif|tif|tiff|pdf|ogg|ogv|webm)(\?|$)/i.test(url)) return false;
  if (/(disambig|question_book|padlock|ambox|edit-clear|wikimedia-logo|commons-logo|wiki_letter|flag_of_|coat_of_arms|map_of_|blank_map|locator_map|location_map|orthographic|_diagram|_chart|_graph|icon|symbol_category|text_document|nuvola|gnome-|crystal_clear|tango-|oxygen480|font_awesome|ai_generated|ai-generated|midjourney|stable_diffusion|dall-e)/i.test(lower)) return false;
  return true;
}

function renderPhotoFigure(fig, data) {
  if (!fig || !data || !data.url) {
    if (fig) {
      fig.hidden = true;
      fig.style.display = 'none';
    }
    return;
  }
  fig.dataset.photoLoaded = 'true';
  fig.hidden = false;
  fig.style.display = '';
  const captionText = fig.dataset.photoCaption || data.title || '';
  const sourceUrl = data.pageUrl || ('https://en.wikipedia.org/wiki/' + encodeURIComponent((data.title || fig.dataset.photoQuery || '').replace(/\s+/g, '_')));
  const frame = fig.querySelector('.real-photo-frame');
  const cap = fig.querySelector('.real-photo-caption');
  if (frame) {
    frame.innerHTML = '<img class="real-photo-img" src="' + esc(data.url) + '" alt="' + esc(captionText) + '" loading="eager" decoding="async" referrerpolicy="no-referrer">';
    const img = frame.querySelector('img');
    if (img) {
      img.onerror = () => {
        fig.hidden = true;
        fig.style.display = 'none';
      };
    }
  }
  if (cap) {
    cap.innerHTML = '<span class="photo-badge">Ảnh thật · Wikimedia</span> <span>' + esc(captionText) + '</span> <a href="' + esc(sourceUrl) + '" target="_blank" rel="noopener noreferrer" class="photo-source-link">Nguồn ảnh ↗</a>';
  }
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
    const url = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&redirects=1&prop=pageimages&piprop=thumbnail|name&pithumbsize=360&titles=' + encodeURIComponent(titlesParam);
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
  hydrateTimer = setTimeout(hydrateVisiblePhotos, 8);
}

async function hydrateVisiblePhotos() {
  if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return;
  const figures = Array.from(document.querySelectorAll('figure.real-photo-card:not([data-photo-loaded="true"])'));
  if (!figures.length) return;

  const uncachedQueries = new Set();
  for (const fig of figures) {
    const q = (fig.dataset.photoQuery || '').trim();
    if (!q) {
      fig.hidden = true;
      fig.style.display = 'none';
      continue;
    }
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

  for (const fig of figures) {
    if (fig.dataset.photoLoaded === 'true') continue;
    const q = (fig.dataset.photoQuery || '').trim();
    const cached = photoMemoryCache.get(q.toLowerCase());
    if (cached) {
      renderPhotoFigure(fig, cached);
    } else {
      fig.dataset.photoLoaded = 'true';
      fig.hidden = true;
      fig.style.display = 'none';
    }
  }
  persistPhotoCache();
}

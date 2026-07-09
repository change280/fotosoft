/* ============================================================
 * courses-detail.js — 課程詳情頁共用渲染器
 * ------------------------------------------------------------
 * 供 fulltime-detail.html / online-detail.html 使用：
 *   CoursesDetail.mount({ track: 'fulltime' });
 *
 * 依賴：window.CoursesStore (js/courses-data.js)
 * ============================================================ */
(function (global) {
  'use strict';

  function injectStyle() {
    if (document.getElementById('courses-detail-style')) return;
    const css = `
      .cd-hero { position: relative; background: #212529; overflow: hidden; }
      .cd-hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.5; }
      .cd-hero-fade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(33,37,41,0.25) 0%, rgba(33,37,41,0.6) 55%, rgba(33,37,41,0.94) 100%); }
      .cd-hero-thumbs { position:absolute; right:1.1rem; bottom:1.1rem; z-index:11; display:flex; gap:0.55rem; max-width:min(74vw,56rem); overflow-x:auto; padding:0.35rem; border-radius:0.95rem; background:rgba(255,255,255,0.08); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.15); }
      .cd-hero-thumbs::-webkit-scrollbar { display:none; }
      .cd-hero-thumb { position:relative; width:5.8rem; height:5.8rem; flex:0 0 auto; border-radius:0.7rem; overflow:hidden; border:1px solid rgba(255,255,255,0.22); background:rgba(255,255,255,0.1); cursor:pointer; transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease; }
      .cd-hero-thumb img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .35s ease,filter .35s ease; filter:grayscale(0.15) brightness(0.88); }
      .cd-hero-thumb:hover { transform:translateY(-2px); border-color:rgba(255,255,255,0.62); }
      .cd-hero-thumb:hover img { transform:scale(1.06); filter:grayscale(0) brightness(1); }
      .cd-hero-thumb.is-active { border-color:rgba(255,255,255,0.95); box-shadow:0 10px 22px -12px rgba(15,23,42,0.7); }
      .cd-hero-thumb.is-active img { filter:grayscale(0) brightness(1); }
      @media (max-width:900px){ .cd-hero-thumbs{ right:0.75rem; bottom:0.75rem; max-width:min(86vw,38rem);} .cd-hero-thumb{ width:4.5rem; height:4.5rem; } }
      @media (max-width:640px){ .cd-hero-thumbs{ left:0.75rem; right:0.75rem; bottom:0.7rem; max-width:none; } .cd-hero-thumb{ width:3.7rem; height:3.7rem; border-radius:0.58rem; } }
      .cd-lightbox { position:fixed; inset:0; z-index:99990; display:none; align-items:center; justify-content:center; background:rgba(15,15,15,0.78); backdrop-filter:blur(4px); }
      .cd-lightbox.open { display:flex; }
      .cd-lightbox-panel { position:relative; width:min(980px,calc(100vw - 3rem)); max-height:calc(100vh - 3rem); background:rgba(255,255,255,0.96); border-radius:1rem; padding:0.8rem 0.8rem 1rem; box-shadow:0 30px 80px -28px rgba(0,0,0,0.55); }
      .cd-lightbox-image-wrap { width:100%; max-height:calc(100vh - 9rem); overflow:hidden; border-radius:0.75rem; background:#f1f3f5; display:flex; align-items:center; justify-content:center; }
      .cd-lightbox-image-wrap img { max-width:100%; max-height:calc(100vh - 9rem); object-fit:contain; display:block; }
      .cd-lightbox-caption { margin-top:0.7rem; display:flex; justify-content:space-between; gap:1rem; align-items:flex-start; color:#495057; font-size:0.9rem; line-height:1.7; }
      .cd-lightbox-meta { font-size:0.74rem; letter-spacing:0.16em; color:#6C757D; white-space:nowrap; }
      .cd-lightbox-nav, .cd-lightbox-close { position:absolute; width:2.75rem; height:2.75rem; border-radius:999px; border:1px solid rgba(222,226,230,0.95); background:rgba(255,255,255,0.95); color:#212529; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s ease; }
      .cd-lightbox-close { top:-0.8rem; right:-0.8rem; }
      .cd-lightbox-nav.prev { left:-1.2rem; top:50%; transform:translateY(-50%); }
      .cd-lightbox-nav.next { right:-1.2rem; top:50%; transform:translateY(-50%); }
      @media (max-width:768px){ .cd-lightbox-panel{ width:calc(100vw - 1.25rem); padding:0.6rem 0.6rem 0.9rem; } .cd-lightbox-nav.prev{ left:0.35rem; } .cd-lightbox-nav.next{ right:0.35rem; } .cd-lightbox-close{ top:0.35rem; right:0.35rem; } }
      .cd-wrap { max-width: 52rem; margin: 0 auto; }
      .cd-block { margin-bottom: 2.6rem; }
      .cd-h2 { font-family:"Noto Serif TC",serif; font-size:1.7rem; font-weight:700; color:#212529; line-height:1.4; margin:0 0 1.1rem; padding-bottom:0.6rem; border-bottom:1px solid #DEE2E6; }
      .cd-p { font-size:1.02rem; line-height:2; color:#343A40; margin:0 0 1.2rem; }
      .cd-p:last-child { margin-bottom:0; }
      .cd-p a, .cd-check a { color:#212529; font-weight:600; text-decoration:underline; text-underline-offset:3px; text-decoration-color:rgba(173,181,189,0.8); }
      .cd-p a:hover, .cd-check a:hover { text-decoration-color:#212529; }
      .cd-quote { margin:0; padding:1.2rem 1.6rem; border-left:3px solid #212529; background:rgba(233,236,239,0.5); border-radius:0 0.75rem 0.75rem 0; }
      .cd-quote p { font-family:"Noto Serif TC",serif; font-size:1.2rem; font-weight:500; line-height:1.75; color:#212529; margin:0; }
      .cd-quote cite { display:block; margin-top:0.7rem; font-size:0.8rem; color:#6C757D; font-style:normal; letter-spacing:0.08em; }
      .cd-quote cite::before { content:"— "; color:#ADB5BD; }
      .cd-hr { margin:2.4rem auto; width:4rem; border:0; border-top:1px solid #ADB5BD; }
      figure.cd-fig { margin:2rem 0; }
      figure.cd-fig img { width:100%; height:auto; display:block; border-radius:0.9rem; box-shadow:0 18px 40px -20px rgba(33,37,41,0.35); }
      figure.cd-fig.is-small { max-width:33%; margin:1.6rem auto; }
      figure.cd-fig.is-small img { border-radius:0.6rem; box-shadow:0 10px 24px -14px rgba(33,37,41,0.3); }
      @media (max-width:540px){ figure.cd-fig.is-small{ max-width:55%; } }
      .cd-thumb-strip { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:1.1rem; margin:1.8rem 0; align-items:start; }
      .cd-thumb-strip figure.cd-fig.is-small { margin:0; max-width:100%; }
      .cd-thumb-strip figure.cd-fig.is-small img { width:100%; aspect-ratio:1; object-fit:cover; }
      @media (max-width:900px){ .cd-thumb-strip{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
      @media (max-width:540px){ .cd-thumb-strip{ grid-template-columns:1fr; } }
      figure.cd-fig figcaption { margin-top:0.8rem; font-size:0.84rem; color:#6C757D; text-align:center; line-height:1.7; font-style:italic; }
      .cd-sec-title { font-family:"Noto Serif TC",serif; font-size:1.35rem; font-weight:700; color:#212529; margin:0 0 1.3rem; display:flex; align-items:center; gap:0.5rem; }
      .cd-sec-title i { color:#ADB5BD; font-size:1.1rem; }
      /* info */
      .cd-info { display:grid; gap:0; }
      .cd-info-row { display:flex; align-items:center; gap:0.85rem; padding:0.7rem 0; border-bottom:1px dashed rgba(206,212,218,0.7); }
      .cd-info-row:last-child { border-bottom:none; }
      .cd-info-ico { flex-shrink:0; width:2.35rem; height:2.35rem; border-radius:0.75rem; display:inline-flex; align-items:center; justify-content:center; background:rgba(33,37,41,0.05); color:#343A40; font-size:0.9rem; }
      .cd-info-label { font-size:0.68rem; font-weight:700; letter-spacing:0.1em; color:#ADB5BD; text-transform:uppercase; }
      .cd-info-value { font-size:0.98rem; font-weight:600; color:#212529; }
      /* lessons */
      .cd-lesson { position:relative; padding-left:3.4rem; padding-bottom:1.4rem; }
      .cd-lesson:last-child { padding-bottom:0; }
      .cd-lesson::before { content:''; position:absolute; left:1.09rem; top:2.2rem; bottom:-0.2rem; width:1px; background:linear-gradient(180deg,rgba(173,181,189,0.6),rgba(173,181,189,0)); }
      .cd-lesson:last-child::before { display:none; }
      .cd-lesson-num { position:absolute; left:0; top:0; width:2.2rem; height:2.2rem; border-radius:0.7rem; display:inline-flex; align-items:center; justify-content:center; font-family:'Roboto',sans-serif; font-weight:900; font-size:0.8rem; background:linear-gradient(160deg,#343A40,#212529); color:#fff; }
      .cd-lesson-title { font-family:"Noto Serif TC",serif; font-weight:700; font-size:1.02rem; color:#212529; margin-bottom:0.4rem; }
      .cd-list { display:flex; flex-direction:column; gap:0.3rem; margin:0; padding:0; list-style:none; }
      .cd-list li { position:relative; padding-left:1rem; font-size:0.9rem; color:#6C757D; line-height:1.7; }
      .cd-list li::before { content:''; position:absolute; left:0; top:0.72em; width:0.32rem; height:0.32rem; border-radius:999px; background:#ADB5BD; }
      /* cards */
      .cd-cards { display:grid; gap:1rem; }
      .cd-cards.cols-2 { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .cd-cards.cols-3 { grid-template-columns:repeat(3,minmax(0,1fr)); }
      @media (max-width:720px){ .cd-cards.cols-2, .cd-cards.cols-3 { grid-template-columns:1fr; } }
      .cd-card { background:rgba(248,249,250,0.85); border:1px solid rgba(222,226,230,0.9); border-radius:1rem; padding:1.15rem 1.25rem; transition:transform .3s,border-color .3s,background .3s; }
      .cd-card:hover { transform:translateY(-3px); border-color:#ADB5BD; background:#fff; }
      .cd-card h4 { font-weight:700; color:#212529; margin:0 0 0.4rem; font-size:0.98rem; }
      .cd-card p { font-size:0.85rem; color:#6C757D; line-height:1.7; margin:0; }
      /* checklist */
      .cd-check { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:0.15rem; }
      .cd-check li { position:relative; padding-left:1.6rem; font-size:0.92rem; color:#495057; line-height:1.9; }
      .cd-check li::before { content:'\\f00c'; font-family:'Font Awesome 6 Free'; font-weight:900; position:absolute; left:0; top:0.2em; font-size:0.72rem; color:#6C757D; }
      .cd-check.two-col { display:grid; grid-template-columns:1fr 1fr; gap:0 2rem; }
      @media (max-width:640px){ .cd-check.two-col { grid-template-columns:1fr; } }
      /* teacher */
      .cd-teachers { display:grid; gap:1rem; grid-template-columns:repeat(2,minmax(0,1fr)); }
      .cd-teachers.single { grid-template-columns:1fr; max-width:28rem; }
      @media (max-width:640px){ .cd-teachers { grid-template-columns:1fr; } }
      .cd-teacher { display:flex; align-items:center; gap:1.1rem; padding:1rem 1.15rem; border-radius:1.15rem; background:rgba(255,255,255,0.85); border:1px solid rgba(222,226,230,0.9); transition:all .3s; text-decoration:none; color:inherit; }
      .cd-teacher:hover { transform:translateY(-3px); border-color:#212529; background:#fff; box-shadow:0 16px 34px -22px rgba(33,37,41,0.3); }
      .cd-teacher img { width:4.2rem; height:4.2rem; border-radius:999px; object-fit:cover; filter:grayscale(0.2); flex-shrink:0; border:2px solid rgba(255,255,255,0.9); box-shadow:0 6px 16px -8px rgba(33,37,41,0.4); }
      .cd-teacher:hover img { filter:grayscale(0); }
      .cd-teacher-name { font-family:"Noto Serif TC",serif; font-weight:700; font-size:1.1rem; color:#212529; }
      .cd-teacher-badge { font-size:0.7rem; font-weight:400; color:#ADB5BD; margin-left:0.5rem; }
      .cd-teacher-role { font-size:0.78rem; color:#6C757D; margin-top:0.15rem; line-height:1.5; }
      .cd-teacher-more { font-size:0.72rem; font-weight:700; color:#ADB5BD; margin-top:0.3rem; display:inline-flex; align-items:center; gap:0.35rem; }
      .cd-teacher:hover .cd-teacher-more { color:#212529; }
      /* callout */
      .cd-callout { border-radius:1.25rem; padding:1.6rem 1.8rem; background:#212529; color:#fff; position:relative; overflow:hidden; }
      .cd-callout::after { content:''; position:absolute; top:-2rem; right:-2rem; width:10rem; height:10rem; border-radius:999px; background:rgba(255,255,255,0.05); }
      .cd-callout h3 { font-family:"Noto Serif TC",serif; font-size:1.3rem; font-weight:700; margin:0 0 0.8rem; }
      .cd-callout p { color:#CED4DA; font-size:0.9rem; line-height:1.9; margin:0 0 1.2rem; max-width:40rem; }
      /* buttons */
      .cd-btn { display:inline-flex; align-items:center; justify-content:center; gap:0.6rem; padding:0.95rem 2.2rem; border-radius:999px; background:linear-gradient(160deg,#343A40,#212529); color:#fff; font-size:0.85rem; font-weight:700; letter-spacing:0.12em; transition:transform .25s,box-shadow .25s; box-shadow:0 14px 30px -14px rgba(33,37,41,0.6); text-decoration:none; }
      .cd-btn:hover { transform:translateY(-2px); box-shadow:0 20px 38px -14px rgba(33,37,41,0.7); }
      .cd-btn.on-dark { background:#fff; color:#212529; }
      .cd-detail-card { background:rgba(255,255,255,0.92); border:1px solid rgba(222,226,230,0.92); border-radius:1.75rem; box-shadow:0 22px 48px -28px rgba(33,37,41,0.22); backdrop-filter:blur(10px); }
    `;
    const style = document.createElement('style');
    style.id = 'courses-detail-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function linkify(text) {
    // 先 escape，再把 URL 轉為連結
    return esc(text).replace(/(https?:\/\/[^\s，、。）)]+)/g, function (u) {
      return '<a href="' + u + '" target="_blank" rel="noopener">' + u + '</a>';
    });
  }
  function checklistItem(raw) {
    const s = String(raw || '');
    const m = s.match(/^(.*?)[：:]\s*(https?:\/\/\S+)$/);
    if (m) {
      return '<a href="' + esc(m[2]) + '" target="_blank" rel="noopener">' + esc(m[1]) + '</a>';
    }
    return linkify(s);
  }

  function renderBlocks(blocks, store) {
    const out = [];
    let smallRun = [];
    function imgFigure(b) {
      if (!b || !b.src) return '';
      const src = store.assetPath(b.src);
      const cls = b.size === 'small' ? ' is-small' : '';
      return '<figure class="cd-fig' + cls + '">' +
        '<img src="' + esc(src) + '" alt="' + esc(b.alt || b.caption || '') + '" loading="lazy">' +
        (b.caption ? '<figcaption>' + esc(b.caption) + '</figcaption>' : '') +
        '</figure>';
    }
    function flushSmall() {
      if (!smallRun.length) return;
      if (smallRun.length === 1) out.push('<div class="cd-block">' + imgFigure(smallRun[0]) + '</div>');
      else out.push('<div class="cd-block"><div class="cd-thumb-strip">' + smallRun.map(imgFigure).join('') + '</div></div>');
      smallRun = [];
    }

    (blocks || []).forEach(function (b) {
      if (!b || !b.type) return;
      if (b.type === 'image') {
        if (!b.src) return;
        if (b.size === 'small') { smallRun.push(b); return; }
        flushSmall();
        out.push('<div class="cd-block">' + imgFigure(b) + '</div>');
        return;
      }
      flushSmall();

      if (b.type === 'heading') {
        out.push('<div class="cd-block"><h2 class="cd-h2">' + esc(b.text || '') + '</h2></div>');
      } else if (b.type === 'paragraph') {
        const paras = String(b.text || '').split(/\n{2,}/).filter(Boolean)
          .map(function (p) { return '<p class="cd-p">' + linkify(p).replace(/\n/g, '<br>') + '</p>'; }).join('');
        out.push('<div class="cd-block">' + paras + '</div>');
      } else if (b.type === 'quote') {
        out.push('<div class="cd-block"><blockquote class="cd-quote"><p>' + esc(b.text || '') + '</p>' +
          (b.cite ? '<cite>' + esc(b.cite) + '</cite>' : '') + '</blockquote></div>');
      } else if (b.type === 'divider') {
        out.push('<div class="cd-block"><hr class="cd-hr"></div>');
      } else if (b.type === 'info') {
        const rows = (b.items || []).map(function (it) {
          return '<div class="cd-info-row"><span class="cd-info-ico"><i class="' + esc(it.icon || 'fa-solid fa-circle-info') + '"></i></span>' +
            '<div><p class="cd-info-label">' + esc(it.label || '') + '</p><p class="cd-info-value">' + esc(it.value || '') + '</p></div></div>';
        }).join('');
        out.push('<div class="cd-block">' + secTitle(b.heading, 'fa-solid fa-circle-info') + '<div class="cd-info">' + rows + '</div></div>');
      } else if (b.type === 'lessons') {
        const items = (b.items || []).map(function (it, i) {
          const lines = (it.lines || []).map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('');
          return '<div class="cd-lesson"><span class="cd-lesson-num">' + (i + 1) + '</span>' +
            '<p class="cd-lesson-title">' + esc(it.title || ('第 ' + (i + 1) + ' 堂')) + '</p>' +
            (lines ? '<ul class="cd-list">' + lines + '</ul>' : '') + '</div>';
        }).join('');
        out.push('<div class="cd-block">' + secTitle(b.heading, 'fa-solid fa-list-check') + items + '</div>');
      } else if (b.type === 'cards') {
        const cols = b.columns === 2 ? 'cols-2' : 'cols-3';
        const cards = (b.items || []).map(function (it) {
          return '<div class="cd-card"><h4>' + esc(it.title || '') + '</h4>' +
            (it.desc ? '<p>' + esc(it.desc) + '</p>' : '') + '</div>';
        }).join('');
        out.push('<div class="cd-block">' + secTitle(b.heading, 'fa-solid fa-star') + '<div class="cd-cards ' + cols + '">' + cards + '</div></div>');
      } else if (b.type === 'checklist') {
        const items = (b.items || []).filter(Boolean);
        const twoCol = items.length > 4 ? ' two-col' : '';
        const lis = items.map(function (it) { return '<li>' + checklistItem(it) + '</li>'; }).join('');
        out.push('<div class="cd-block">' + secTitle(b.heading, 'fa-solid fa-clipboard-check') + '<ul class="cd-check' + twoCol + '">' + lis + '</ul></div>');
      } else if (b.type === 'teacher') {
        const items = b.items || [];
        const single = items.length <= 1 ? ' single' : '';
        const cards = items.map(function (t) {
          const inner = '<img src="' + esc(store.assetPath(t.photo)) + '" alt="' + esc(t.name || '') + '" ' +
            'onerror="this.style.visibility=\'hidden\'">' +
            '<div><p class="cd-teacher-name">' + esc(t.name || '') + (t.badge ? '<span class="cd-teacher-badge">' + esc(t.badge) + '</span>' : '') + '</p>' +
            '<p class="cd-teacher-role">' + esc(t.role || '') + '</p>' +
            (t.link ? '<span class="cd-teacher-more">了解更多 <i class="fa-solid fa-arrow-right-long"></i></span>' : '') + '</div>';
          return t.link
            ? '<a href="' + esc(t.link) + '" class="cd-teacher">' + inner + '</a>'
            : '<div class="cd-teacher">' + inner + '</div>';
        }).join('');
        out.push('<div class="cd-block">' + secTitle(b.heading, 'fa-solid fa-chalkboard-user') + '<div class="cd-teachers' + single + '">' + cards + '</div></div>');
      } else if (b.type === 'callout') {
        out.push('<div class="cd-block"><div class="cd-callout"><h3>' + esc(b.title || '') + '</h3>' +
          (b.text ? '<p>' + esc(b.text) + '</p>' : '') +
          (b.url ? '<a href="' + esc(b.url) + '" target="_blank" rel="noopener" class="cd-btn on-dark"><i class="fa-solid fa-calendar-check"></i>' + esc(b.urlLabel || '預約報名') + '</a>' : '') +
          '</div></div>');
      } else if (b.type === 'cta') {
        out.push('<div class="cd-block"><a href="' + esc(b.url || '#') + '" target="_blank" rel="noopener" class="cd-btn"><i class="fa-solid fa-arrow-right"></i>' + esc(b.label || '點我報名') + '</a></div>');
      }
    });
    flushSmall();
    return out.join('');
  }

  function secTitle(heading, icon) {
    if (!heading) return '';
    return '<h3 class="cd-sec-title"><i class="' + icon + '"></i>' + esc(heading) + '</h3>';
  }

  function collectHeroGalleryImages(course, store) {
    var seen = Object.create(null);
    var list = [];

    function push(rawSrc, label) {
      var path = store.assetPath(rawSrc);
      if (!path || seen[path]) return;
      seen[path] = true;
      list.push({ src: path, label: label || '' });
    }

    push(course.heroImage || course.cardImage || store.pickFallbackImage(course.id), course.title || '');
    (course.blocks || []).forEach(function (b) {
      if (!b || b.type !== 'image' || !b.src) return;
      push(b.src, b.caption || course.title || '');
    });

    return list;
  }

  function renderHeroThumbs(items, heroImgEl, heroEl, onThumbClick) {
    if (!heroImgEl || !heroEl) return;
    var wrap = document.getElementById('cd-hero-thumbs');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'cd-hero-thumbs';
      wrap.className = 'cd-hero-thumbs';
      heroEl.appendChild(wrap);
    }

    if (!items.length) {
      wrap.classList.add('hidden');
      wrap.innerHTML = '';
      return;
    }

    wrap.classList.remove('hidden');
    wrap.innerHTML = items.map(function (it, idx) {
      var active = idx === 0 ? ' is-active' : '';
      return '<button type="button" class="cd-hero-thumb' + active + '" data-src="' + esc(it.src) + '" data-idx="' + idx + '" aria-label="開啟第 ' + (idx + 1) + ' 張圖片">' +
        '<img src="' + esc(it.src) + '" alt="' + esc(it.label || ('課程縮圖 ' + (idx + 1))) + '" loading="lazy">' +
      '</button>';
    }).join('');

    function activate(src, btn) {
      heroImgEl.src = src;
      wrap.querySelectorAll('.cd-hero-thumb').forEach(function (node) { node.classList.remove('is-active'); });
      btn.classList.add('is-active');
    }

    wrap.querySelectorAll('.cd-hero-thumb').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var src = btn.getAttribute('data-src') || '';
        var idx = Number(btn.getAttribute('data-idx')) || 0;
        if (!src) return;
        activate(src, btn);
        if (typeof onThumbClick === 'function') onThumbClick(idx);
      });
    });
  }

  function mount(options) {
    const opts = options || {};
    const expectedTrack = opts.track || null;
    injectStyle();

    const store = global.CoursesStore;
    if (!store) { console.warn('[courses-detail] 找不到 CoursesStore'); return; }

    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    const fallbackEl = document.getElementById('cd-fallback');
    const heroEl = document.getElementById('cd-hero');
    const mainEl = document.getElementById('cd-main');
    var galleryItems = [];

    var lightbox = document.getElementById('cd-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'cd-lightbox';
      lightbox.className = 'cd-lightbox';
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.innerHTML = '' +
        '<div class="cd-lightbox-panel">' +
          '<button type="button" id="cd-lightbox-close" class="cd-lightbox-close" aria-label="關閉"><i class="fa-solid fa-xmark"></i></button>' +
          '<button type="button" id="cd-lightbox-prev" class="cd-lightbox-nav prev" aria-label="上一張"><i class="fa-solid fa-chevron-left"></i></button>' +
          '<button type="button" id="cd-lightbox-next" class="cd-lightbox-nav next" aria-label="下一張"><i class="fa-solid fa-chevron-right"></i></button>' +
          '<div class="cd-lightbox-image-wrap"><img id="cd-lightbox-image" alt=""></div>' +
          '<div class="cd-lightbox-caption"><p id="cd-lightbox-caption"></p><span id="cd-lightbox-meta" class="cd-lightbox-meta"></span></div>' +
        '</div>';
      document.body.appendChild(lightbox);
    }
    var lightboxImg = document.getElementById('cd-lightbox-image');
    var lightboxCaption = document.getElementById('cd-lightbox-caption');
    var lightboxMeta = document.getElementById('cd-lightbox-meta');
    var lightboxClose = document.getElementById('cd-lightbox-close');
    var lightboxPrev = document.getElementById('cd-lightbox-prev');
    var lightboxNext = document.getElementById('cd-lightbox-next');
    var currentLightboxIndex = 0;

    function renderLightbox() {
      var item = galleryItems[currentLightboxIndex];
      if (!item) return;
      lightboxImg.src = item.src;
      lightboxImg.alt = item.label || ('課程圖片 ' + (currentLightboxIndex + 1));
      lightboxCaption.textContent = item.label || '';
      lightboxMeta.textContent = (currentLightboxIndex + 1) + ' / ' + galleryItems.length;
    }
    function openLightbox(index) {
      if (!galleryItems.length) return;
      currentLightboxIndex = Math.max(0, Math.min(galleryItems.length - 1, index || 0));
      renderLightbox();
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    function moveLightbox(delta) {
      if (!galleryItems.length) return;
      currentLightboxIndex = (currentLightboxIndex + delta + galleryItems.length) % galleryItems.length;
      renderLightbox();
    }

    if (lightboxClose) lightboxClose.onclick = closeLightbox;
    if (lightboxPrev) lightboxPrev.onclick = function () { moveLightbox(-1); };
    if (lightboxNext) lightboxNext.onclick = function () { moveLightbox(1); };
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') moveLightbox(-1);
      if (e.key === 'ArrowRight') moveLightbox(1);
    });

    function render() {
      const course = id ? store.getById(id) : null;
      const valid = course && (!expectedTrack || course.track === expectedTrack);
      if (!valid) {
        heroEl && heroEl.classList.add('hidden');
        mainEl && mainEl.classList.add('hidden');
        fallbackEl && fallbackEl.classList.remove('hidden');
        document.title = '找不到課程 | 視丘攝影藝術學院';
        return;
      }
      fallbackEl && fallbackEl.classList.add('hidden');
      document.title = course.title + ' | 視丘攝影藝術學院 Fotosoft';

      const tk = store.trackOf(course);
      const heroImg = store.heroImageOf(course);
      const heroImageEl = document.getElementById('cd-hero-img');
      heroImageEl.src = heroImg;
      heroImageEl.onerror = function () { this.src = store.pickFallbackImage(course.id); };
      document.getElementById('cd-kicker').textContent = (course.kicker || tk.en) + (course.index ? ' · ' + course.index : '');
      document.getElementById('cd-title').textContent = course.title;
      const subEl = document.getElementById('cd-subtitle');
      if (course.subtitle) { subEl.textContent = course.subtitle; subEl.classList.remove('hidden'); }
      else subEl.classList.add('hidden');
      const schedEl = document.getElementById('cd-schedule');
      if (course.schedule) { schedEl.querySelector('span').textContent = course.schedule; schedEl.classList.remove('hidden'); }
      else schedEl.classList.add('hidden');

      const introEl = document.getElementById('cd-intro');
      if (course.intro) { introEl.textContent = course.intro; introEl.classList.remove('hidden'); }
      else introEl.classList.add('hidden');

      document.getElementById('cd-body').innerHTML = renderBlocks(course.blocks, store);
      galleryItems = collectHeroGalleryImages(course, store);
      renderHeroThumbs(galleryItems, heroImageEl, heroEl, function (index) {
        openLightbox(index);
      });

      heroEl.classList.remove('hidden');
      mainEl.classList.remove('hidden');
    }

    render();
    store.subscribe(render);
    store.refreshFromRemote().then(function (ok) { if (ok) render(); });
  }

  global.CoursesDetail = { mount: mount, renderBlocks: renderBlocks };
})(window);

/* ============================================================
 * courses-admin.js — 視丘招生課程「隱藏管理系統」
 * ------------------------------------------------------------
 * 觸發：Cmd + Shift + E (Mac) / Ctrl + Shift + E (Win/Linux)
 *
 * 兩套編輯系統，以頂端頁籤切換：
 *   ▸ 全職養成 (fulltime)
 *   ▸ 線上單元課程 (online)
 *
 * 功能：
 *   1. 左側列表：依 track 篩選，可新增 / 刪除 / 搜尋 / 拖曳排序
 *   2. 右側表單：編號、標題、副標、標籤、時段、卡片圖、卡片描述、
 *      Hero 圖、導言、報名連結、外部連結、首頁精選
 *   3. 內容區塊（可拖曳排序、隨處插入、刪除）：
 *      標題 / 段落 / 引言 / 圖片(大·小) / 分隔線 /
 *      課程資訊 / 課程內容(分堂) / 卡片格 / 條列清單 / 老師 / 說明框 / 報名按鈕
 *   4. 匯出 JSON（courses-data.json）/ 匯入 / 重置
 *   5. 存檔即時同步：課程總覽卡片、首頁 PROGRAMS、課程詳情頁
 *
 * 依賴：window.CoursesStore (js/courses-data.js)
 * ============================================================ */
(function () {
  'use strict';

  if (typeof window.CoursesStore === 'undefined') {
    console.warn('[courses-admin] 找不到 CoursesStore，請先載入 js/courses-data.js');
    return;
  }
  const Store = window.CoursesStore;

  /* ---------------- 樣式 ---------------- */
  const STYLE_ID = 'fsc-admin-style';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #fsc-root, #fsc-root * { box-sizing: border-box; }
      #fsc-root { position: fixed; inset: 0; z-index: 99999; font-family: "Noto Sans TC", system-ui, sans-serif; color: #212529; }
      #fsc-root .fsc-backdrop { position: absolute; inset: 0; background: rgba(15,23,42,0.55); backdrop-filter: blur(6px); }
      #fsc-root .fsc-panel { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(1320px,96vw); height: min(92vh,1000px); background: #fff; border-radius: 14px; box-shadow: 0 40px 80px -20px rgba(0,0,0,0.35); display: flex; flex-direction: column; overflow: hidden; }
      #fsc-root .fsc-tabs { display: flex; align-items: center; gap: 4px; padding: 12px 16px 0; border-bottom: 1px solid #E9ECEF; background: #F8F9FA; }
      #fsc-root .fsc-tab { padding: 10px 18px; border-radius: 10px 10px 0 0; font-size: 14px; font-weight: 600; cursor: pointer; color: #6C757D; border: 1px solid transparent; border-bottom: none; background: transparent; }
      #fsc-root .fsc-tab.active { background: #fff; color: #212529; border-color: #E9ECEF; }
      #fsc-root .fsc-tab .fsc-tab-count { font-size: 11px; color: #ADB5BD; margin-left: 6px; }
      #fsc-root .fsc-tab-spacer { flex: 1; }
      #fsc-root .fsc-close { width: 34px; height: 34px; border-radius: 50%; border: 1px solid #DEE2E6; background: #fff; cursor: pointer; font-size: 16px; color: #6C757D; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 8px; }
      #fsc-root .fsc-close:hover { background: #F8F9FA; color: #212529; }
      #fsc-root .fsc-shell { flex: 1; display: flex; min-height: 0; }

      #fsc-root .fsc-side { width: 320px; border-right: 1px solid #E9ECEF; display: flex; flex-direction: column; background: #F8F9FA; }
      #fsc-root .fsc-search { margin: 12px; padding: 10px 12px; border: 1px solid #DEE2E6; border-radius: 8px; background: #fff; font-size: 13px; outline: none; }
      #fsc-root .fsc-search:focus { border-color: #212529; }
      #fsc-root .fsc-list { flex: 1; overflow-y: auto; padding: 0 12px 12px; }
      #fsc-root .fsc-item { display: flex; gap: 10px; align-items: center; padding: 8px; margin-bottom: 4px; border-radius: 8px; cursor: pointer; transition: background 0.15s; }
      #fsc-root .fsc-item:hover { background: #E9ECEF; }
      #fsc-root .fsc-item.active { background: #212529; color: #fff; }
      #fsc-root .fsc-item.active .fsc-item-sub { color: #ADB5BD; }
      #fsc-root .fsc-item.dragging { opacity: 0.35; }
      #fsc-root .fsc-item.drop-above { box-shadow: inset 0 2px 0 0 #212529; }
      #fsc-root .fsc-item.drop-below { box-shadow: inset 0 -2px 0 0 #212529; }
      #fsc-root .fsc-item-thumb { width: 46px; height: 46px; border-radius: 6px; background: #DEE2E6 center/cover no-repeat; flex-shrink: 0; }
      #fsc-root .fsc-item-text { min-width: 0; flex: 1; }
      #fsc-root .fsc-item-title { font-size: 13px; font-weight: 500; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      #fsc-root .fsc-item-sub { font-size: 11px; color: #6C757D; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      #fsc-root .fsc-item-star { font-size: 12px; color: #f59e0b; }
      #fsc-root .fsc-item-grip { color: #ADB5BD; cursor: grab; padding: 2px; font-size: 14px; }

      #fsc-root .fsc-side-foot { padding: 12px; border-top: 1px solid #E9ECEF; display: flex; flex-direction: column; gap: 8px; }
      #fsc-root .fsc-btn { padding: 9px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: 1px solid transparent; display: inline-flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s; }
      #fsc-root .fsc-btn-primary { background: #212529; color: #fff; }
      #fsc-root .fsc-btn-primary:hover { background: #000; }
      #fsc-root .fsc-btn-ghost { background: transparent; color: #212529; border-color: #DEE2E6; }
      #fsc-root .fsc-btn-ghost:hover { background: #E9ECEF; }
      #fsc-root .fsc-btn-danger { background: #dc2626; color: #fff; }
      #fsc-root .fsc-btn-danger:hover { background: #b91c1c; }
      #fsc-root .fsc-btn-row { display: flex; gap: 8px; }
      #fsc-root .fsc-btn-row .fsc-btn { flex: 1; }

      #fsc-root .fsc-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
      #fsc-root .fsc-main-head { padding: 14px 24px; border-bottom: 1px solid #E9ECEF; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      #fsc-root .fsc-main-title { font-family: "Noto Serif TC", serif; font-size: 18px; font-weight: 700; margin: 0; }
      #fsc-root .fsc-form { flex: 1; overflow-y: auto; padding: 20px 24px 24px; }
      #fsc-root .fsc-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ADB5BD; text-align: center; padding: 40px; }
      #fsc-root .fsc-empty h3 { font-family: "Noto Serif TC", serif; font-size: 22px; color: #6C757D; margin: 12px 0 6px; }

      #fsc-root .fsc-field { margin-bottom: 16px; }
      #fsc-root .fsc-label { display: block; font-size: 12px; font-weight: 600; color: #495057; margin-bottom: 6px; letter-spacing: 0.05em; }
      #fsc-root .fsc-hint { font-size: 11px; color: #ADB5BD; margin-top: 4px; }
      #fsc-root .fsc-input, #fsc-root .fsc-textarea, #fsc-root .fsc-select { width: 100%; padding: 9px 12px; border: 1px solid #DEE2E6; border-radius: 8px; font-size: 13px; font-family: inherit; outline: none; background: #fff; color: #212529; }
      #fsc-root .fsc-input:focus, #fsc-root .fsc-textarea:focus, #fsc-root .fsc-select:focus { border-color: #212529; }
      #fsc-root .fsc-textarea { min-height: 72px; resize: vertical; line-height: 1.7; }
      #fsc-root .fsc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      #fsc-root .fsc-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
      #fsc-root .fsc-image-row { display: flex; gap: 8px; align-items: center; }
      #fsc-root .fsc-image-row .fsc-input { flex: 1; }
      #fsc-root .fsc-file-btn { padding: 9px 12px; border-radius: 8px; font-size: 12px; background: #F8F9FA; border: 1px solid #DEE2E6; color: #495057; cursor: pointer; white-space: nowrap; }
      #fsc-root .fsc-file-btn:hover { background: #E9ECEF; }
      #fsc-root .fsc-preview { width: 100%; max-height: 150px; object-fit: cover; border-radius: 8px; background: #F8F9FA; border: 1px dashed #DEE2E6; margin-top: 8px; display: block; }
      #fsc-root .fsc-toggle { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #495057; cursor: pointer; }
      #fsc-root .fsc-toggle input { accent-color: #212529; }

      #fsc-root .fsc-section-label { font-size: 12px; font-weight: 700; color: #212529; letter-spacing: 0.08em; margin: 22px 0 8px; text-transform: uppercase; }

      /* Blocks */
      #fsc-root .fsc-blocks { border: 1px solid #DEE2E6; border-radius: 10px; padding: 10px; background: #FAFAFA; }
      #fsc-root .fsc-block { background: #fff; border: 1px solid #E9ECEF; border-radius: 8px; padding: 10px; margin-bottom: 8px; position: relative; }
      #fsc-root .fsc-block.dragging { opacity: 0.35; }
      #fsc-root .fsc-block.drop-above { box-shadow: inset 0 2px 0 0 #212529; }
      #fsc-root .fsc-block.drop-below { box-shadow: inset 0 -2px 0 0 #212529; }
      #fsc-root .fsc-block-head { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #6C757D; margin-bottom: 8px; }
      #fsc-root .fsc-block-type { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; background: #E9ECEF; color: #495057; font-weight: 600; letter-spacing: 0.06em; }
      #fsc-root .fsc-block-grip { color: #ADB5BD; cursor: grab; padding: 2px 4px; font-size: 14px; user-select: none; }
      #fsc-root .fsc-block-actions { margin-left: auto; display: flex; gap: 4px; }
      #fsc-root .fsc-block-actions button { border: 1px solid #DEE2E6; background: #fff; color: #6C757D; width: 26px; height: 26px; border-radius: 6px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }
      #fsc-root .fsc-block-actions button:hover { background: #F8F9FA; color: #212529; }
      #fsc-root .fsc-block-actions button.danger:hover { background: #FEE2E2; color: #dc2626; border-color: #FCA5A5; }
      #fsc-root .fsc-block input[type="text"], #fsc-root .fsc-block textarea, #fsc-root .fsc-block select { width: 100%; padding: 8px 10px; border: 1px solid #E9ECEF; border-radius: 6px; font-size: 13px; font-family: inherit; outline: none; background: #fff; color: #212529; margin-bottom: 6px; }
      #fsc-root .fsc-block input[type="text"]:focus, #fsc-root .fsc-block textarea:focus { border-color: #212529; }
      #fsc-root .fsc-block textarea { min-height: 64px; resize: vertical; line-height: 1.7; }
      #fsc-root .fsc-subitem { border: 1px dashed #E9ECEF; border-radius: 6px; padding: 8px; margin-bottom: 6px; background: #FCFCFD; }
      #fsc-root .fsc-subitem-head { display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #ADB5BD; margin-bottom: 4px; }
      #fsc-root .fsc-mini-del { border: none; background: none; color: #ADB5BD; cursor: pointer; font-size: 13px; }
      #fsc-root .fsc-mini-del:hover { color: #dc2626; }
      #fsc-root .fsc-mini-add { padding: 6px 10px; border-radius: 6px; font-size: 12px; border: 1px dashed #CED4DA; background: #fff; color: #495057; cursor: pointer; }
      #fsc-root .fsc-mini-add:hover { border-color: #212529; color: #212529; }
      #fsc-root .fsc-block-img { width: 100%; max-height: 180px; object-fit: contain; background: #F8F9FA; border-radius: 6px; margin: 4px 0 6px; display: block; }
      #fsc-root .fsc-divider-hint { text-align: center; color: #ADB5BD; font-size: 12px; padding: 6px 0; letter-spacing: 0.3em; }
      #fsc-root .fsc-inserter { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 4px 2px; justify-content: center; border-top: 1px dashed #E9ECEF; margin-top: 6px; }
      #fsc-root .fsc-inserter button { padding: 6px 12px; border-radius: 999px; font-size: 12px; border: 1px solid #DEE2E6; background: #fff; color: #495057; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
      #fsc-root .fsc-inserter button:hover { background: #212529; color: #fff; border-color: #212529; }

      #fsc-root .fsc-toolbar { display: flex; gap: 8px; padding: 14px 24px; border-top: 1px solid #E9ECEF; background: #F8F9FA; align-items: center; }
      #fsc-root .fsc-toolbar-spacer { flex: 1; }
      #fsc-root .fsc-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); padding: 12px 20px; background: #212529; color: #fff; border-radius: 8px; font-size: 13px; z-index: 100000; box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: fsc-in 0.25s ease-out; }
      @keyframes fsc-in { from { opacity: 0; transform: translate(-50%,20px); } to { opacity: 1; transform: translate(-50%,0); } }
      #fsc-root .fsc-dialog-backdrop { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.24); display: flex; align-items: center; justify-content: center; z-index: 100001; }
      #fsc-root .fsc-dialog { width: min(460px, calc(100vw - 32px)); background: #fff; border-radius: 16px; box-shadow: 0 30px 80px -28px rgba(0,0,0,0.35); overflow: hidden; }
      #fsc-root .fsc-dialog-body { padding: 24px 26px 20px; font-size: 18px; line-height: 1.7; color: #212529; }
      #fsc-root .fsc-dialog-actions { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 18px 18px; border-top: 1px solid #E9ECEF; }
      #fsc-hint { position: fixed; bottom: 12px; right: 12px; z-index: 99998; padding: 6px 10px; border-radius: 6px; background: rgba(33,37,41,0.7); color: #fff; font-size: 10px; letter-spacing: 0.1em; pointer-events: none; opacity: 0; transition: opacity 0.3s; }
      #fsc-hint.show { opacity: 1; }
      @media (max-width: 900px) {
        #fsc-root .fsc-panel { width: 100vw; height: 100vh; border-radius: 0; }
        #fsc-root .fsc-shell { flex-direction: column; }
        #fsc-root .fsc-side { width: 100%; height: 38%; border-right: none; border-bottom: 1px solid #E9ECEF; }
        #fsc-root .fsc-row, #fsc-root .fsc-row-3 { grid-template-columns: 1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ---------------- 工具 ---------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function safeDecode(seg) {
    try { return decodeURIComponent(seg); } catch (_) { return seg; }
  }
  function editorPathValue(path) {
    const src = String(path || '').trim();
    if (!src) return '';
    if (/^(?:https?:)?\/\//i.test(src) || /^data:/i.test(src)) return src;
    return src.split('/').map((seg, idx) => (idx === 0 ? seg : safeDecode(seg))).join('/');
  }
  function fileToCourseImagePath(file) {
    const name = file && file.name ? file.name.trim() : '';
    if (!name) return '';
    return '/image/courses/' + name;
  }
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function toast(msg) {
    const t = el('div', 'fsc-toast', esc(msg));
    (document.getElementById('fsc-root') || document.body).appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }
  function modalHtml(message) {
    return '' +
      '<div class="fsc-dialog-backdrop" data-action="cancel">' +
        '<div class="fsc-dialog" role="alertdialog" aria-modal="true" aria-labelledby="fsc-dialog-title">' +
          '<div class="fsc-dialog-body" id="fsc-dialog-title">' + esc(message) + '</div>' +
          '<div class="fsc-dialog-actions">' +
            '<button class="fsc-btn fsc-btn-ghost fsc-btn-sm" data-action="cancel">取消</button>' +
            '<button class="fsc-btn fsc-btn-primary fsc-btn-sm" data-action="save">自動儲存並繼續</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }
  function deepClone(o) { return JSON.parse(JSON.stringify(o || {})); }

  const BLOCK_META = {
    heading:   { label: '標題',   icon: 'fa-heading' },
    paragraph: { label: '段落',   icon: 'fa-paragraph' },
    quote:     { label: '引言',   icon: 'fa-quote-right' },
    image:     { label: '圖片',   icon: 'fa-image' },
    divider:   { label: '分隔線', icon: 'fa-grip-lines' },
    info:      { label: '課程資訊', icon: 'fa-circle-info' },
    lessons:   { label: '課程內容', icon: 'fa-list-check' },
    cards:     { label: '卡片格', icon: 'fa-table-cells-large' },
    checklist: { label: '條列清單', icon: 'fa-clipboard-check' },
    teacher:   { label: '老師',   icon: 'fa-chalkboard-user' },
    callout:   { label: '說明框', icon: 'fa-bullhorn' },
    cta:       { label: '報名按鈕', icon: 'fa-arrow-pointer' }
  };

  function blankBlock(type) {
    switch (type) {
      case 'heading':   return { type, text: '' };
      case 'paragraph': return { type, text: '' };
      case 'quote':     return { type, text: '', cite: '' };
      case 'image':     return { type, src: '', size: 'large', caption: '' };
      case 'divider':   return { type };
      case 'info':      return { type, heading: '課程資訊', items: [{ icon: 'fa-regular fa-clock', label: '時間', value: '' }] };
      case 'lessons':   return { type, heading: '課程內容', items: [{ title: '第一堂', lines: [''] }] };
      case 'cards':     return { type, heading: '誰適合這堂課', columns: 3, items: [{ title: '', desc: '' }] };
      case 'checklist': return { type, heading: '', items: [''] };
      case 'teacher':   return { type, heading: '老師介紹', items: [{ name: '', role: '', photo: '', link: '', badge: '' }] };
      case 'callout':   return { type, title: '', text: '', url: '', urlLabel: '預約報名' };
      case 'cta':       return { type, label: '點我報名', url: Store.FORM };
      default:          return { type: 'paragraph', text: '' };
    }
  }

  /* ---------------- 管理器 ---------------- */
  const Admin = {
    root: null, currentTrack: 'fulltime', currentId: null, draft: null, dirty: false, search: '',

    async promptAutosave(message) {
      if (!this.root || !this.dirty) return true;
      return new Promise(resolve => {
        const wrap = el('div');
        wrap.innerHTML = modalHtml(message || '尚有未儲存的變更，離開前會自動儲存，是否繼續？');

        const finish = async (action) => {
          document.removeEventListener('keydown', onKeydown, true);
          wrap.remove();
          if (action !== 'save') { resolve(false); return; }
          const ok = this.saveDraft();
          resolve(ok);
        };
        const onKeydown = (e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            finish('cancel');
          }
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            finish('save');
          }
        };

        wrap.addEventListener('click', e => {
          const action = e.target && e.target.getAttribute && e.target.getAttribute('data-action');
          if (!action) return;
          finish(action);
        });

        this.root.appendChild(wrap);
        document.addEventListener('keydown', onKeydown, true);
        const primary = wrap.querySelector('[data-action="save"]');
        if (primary) primary.focus();
      });
    },

    open() {
      if (this.root) return;
      this.root = el('div'); this.root.id = 'fsc-root';
      this.root.innerHTML = `
        <div class="fsc-backdrop"></div>
        <div class="fsc-panel">
          <div class="fsc-tabs">
            <button class="fsc-tab" data-track="fulltime">全職養成 <span class="fsc-tab-count" data-count="fulltime"></span></button>
            <button class="fsc-tab" data-track="online">線上單元課程 <span class="fsc-tab-count" data-count="online"></span></button>
            <div class="fsc-tab-spacer"></div>
            <button class="fsc-close" title="關閉 (Esc)">&times;</button>
          </div>
          <div class="fsc-shell">
            <aside class="fsc-side">
              <input class="fsc-search" type="text" placeholder="搜尋課程…">
              <div class="fsc-list"></div>
              <div class="fsc-side-foot">
                <button class="fsc-btn fsc-btn-primary" data-act="new"><i class="fa-solid fa-plus"></i> 新增課程</button>
                <div class="fsc-btn-row">
                  <button class="fsc-btn fsc-btn-ghost" data-act="export"><i class="fa-solid fa-download"></i> 匯出</button>
                  <button class="fsc-btn fsc-btn-ghost" data-act="import"><i class="fa-solid fa-upload"></i> 匯入</button>
                </div>
                <button class="fsc-btn fsc-btn-ghost" data-act="reset"><i class="fa-solid fa-rotate-left"></i> 重置為預設</button>
              </div>
            </aside>
            <div class="fsc-main"></div>
          </div>
        </div>`;
      document.body.appendChild(this.root);
      document.body.style.overflow = 'hidden';

      this.root.querySelector('.fsc-backdrop').onclick = () => this.confirmClose();
      this.root.querySelector('.fsc-close').onclick = () => this.confirmClose();
      this.root.querySelectorAll('.fsc-tab').forEach(t => t.onclick = () => this.switchTrack(t.dataset.track));
      const searchEl = this.root.querySelector('.fsc-search');
      searchEl.oninput = () => { this.search = searchEl.value.trim().toLowerCase(); this.renderList(); };
      this.root.querySelector('[data-act="new"]').onclick = () => this.newCourse();
      this.root.querySelector('[data-act="export"]').onclick = () => this.exportJSON();
      this.root.querySelector('[data-act="import"]').onclick = () => this.importJSON();
      this.root.querySelector('[data-act="reset"]').onclick = () => this.resetAll();
      this.root.querySelectorAll('.fsc-tab').forEach(t => t.classList.toggle('active', t.dataset.track === this.currentTrack));
      this.renderList();
      this.renderMain();
    },

    close() {
      if (!this.root) return;
      this.root.remove(); this.root = null;
      document.body.style.overflow = '';
      this.currentId = null; this.draft = null; this.dirty = false;
    },
    async confirmClose() {
      if (!(await this.promptAutosave('尚有未儲存的變更，離開編輯頁面前會自動儲存，是否繼續？'))) return;
      this.close();
    },

    async switchTrack(track) {
      if (track === this.currentTrack) return;
      if (!(await this.promptAutosave('尚有未儲存的變更，切換到其他課程分類前會自動儲存，是否繼續？'))) return;
      this.currentTrack = track; this.currentId = null; this.draft = null; this.dirty = false;
      this.root.querySelectorAll('.fsc-tab').forEach(t => t.classList.toggle('active', t.dataset.track === track));
      this.renderList();
      this.renderMain();
    },

    trackList() {
      let list = Store.getByTrack(this.currentTrack);
      if (this.search) list = list.filter(c => (c.title + ' ' + c.subtitle + ' ' + c.tag).toLowerCase().includes(this.search));
      return list;
    },

    renderList() {
      if (!this.root) return;
      Store.getAll(); // ensure seeded
      this.root.querySelector('[data-count="fulltime"]').textContent = Store.getByTrack('fulltime').length;
      this.root.querySelector('[data-count="online"]').textContent = Store.getByTrack('online').length;
      const wrap = this.root.querySelector('.fsc-list');
      const list = this.trackList();
      wrap.innerHTML = '';
      if (!list.length) { wrap.innerHTML = '<p style="color:#ADB5BD;font-size:12px;text-align:center;padding:24px 0;">此分類尚無課程</p>'; return; }
      list.forEach(c => {
        const item = el('div', 'fsc-item' + (c.id === this.currentId ? ' active' : ''));
        item.draggable = true;
        item.dataset.id = c.id;
        const img = Store.cardImageOf(c);
        item.innerHTML = `
          <span class="fsc-item-grip" title="拖曳排序"><i class="fa-solid fa-grip-vertical"></i></span>
          <div class="fsc-item-thumb" style="background-image:url('${esc(img)}')"></div>
          <div class="fsc-item-text">
            <p class="fsc-item-title">${esc(c.index ? c.index + '　' : '')}${esc(c.title)}</p>
            <p class="fsc-item-sub">${esc(c.schedule || c.tag || '')}</p>
          </div>
          ${c.featured ? '<span class="fsc-item-star" title="首頁精選"><i class="fa-solid fa-star"></i></span>' : ''}`;
        item.onclick = (e) => { if (e.target.closest('.fsc-item-grip')) return; this.select(c.id); };
        this.attachItemDnD(item);
        wrap.appendChild(item);
      });
    },

    attachItemDnD(item) {
      item.addEventListener('dragstart', (e) => { item.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', item.dataset.id); });
      item.addEventListener('dragend', () => { item.classList.remove('dragging'); this.root.querySelectorAll('.fsc-item').forEach(i => i.classList.remove('drop-above', 'drop-below')); });
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        const r = item.getBoundingClientRect();
        const below = e.clientY > r.top + r.height / 2;
        item.classList.toggle('drop-below', below);
        item.classList.toggle('drop-above', !below);
      });
      item.addEventListener('dragleave', () => item.classList.remove('drop-above', 'drop-below'));
      item.addEventListener('drop', (e) => {
        e.preventDefault();
        const dragId = e.dataTransfer.getData('text/plain');
        const targetId = item.dataset.id;
        if (dragId === targetId) return;
        const below = item.classList.contains('drop-below');
        const ids = this.trackList().map(c => c.id).filter(id => id !== dragId);
        let idx = ids.indexOf(targetId);
        if (below) idx += 1;
        ids.splice(idx, 0, dragId);
        Store.reorder(this.currentTrack, ids);
        this.renderList();
      });
    },

    renderMain() {
      const main = this.root.querySelector('.fsc-main');
      if (!this.draft) {
        main.innerHTML = `<div class="fsc-empty">
          <i class="fa-regular fa-hand-pointer" style="font-size:38px;"></i>
          <h3>選擇左側課程開始編輯</h3>
          <p style="font-size:13px;">或點「新增課程」，在「${esc(Store.TRACKS[this.currentTrack].label)}」建立一門新課。</p>
        </div>`;
        return;
      }
      main.innerHTML = `
        <div class="fsc-main-head">
          <p class="fsc-main-title">${this.currentId ? '編輯課程' : '新增課程'}<span style="font-size:12px;color:#ADB5BD;margin-left:8px;">${esc(Store.TRACKS[this.draft.track].label)}</span></p>
          <label class="fsc-toggle"><input type="checkbox" data-f="featured" ${this.draft.featured ? 'checked' : ''}> 顯示於首頁 PROGRAMS</label>
        </div>
        <div class="fsc-form"></div>
        <div class="fsc-toolbar">
          <button class="fsc-btn fsc-btn-danger" data-act="delete"><i class="fa-solid fa-trash"></i> 刪除</button>
          <div class="fsc-toolbar-spacer"></div>
          <button class="fsc-btn fsc-btn-ghost" data-act="cancel">取消</button>
          <button class="fsc-btn fsc-btn-primary" data-act="save"><i class="fa-solid fa-floppy-disk"></i> 儲存</button>
        </div>`;
      this.renderForm(main.querySelector('.fsc-form'));

      main.querySelector('[data-f="featured"]').onchange = (e) => { this.draft.featured = e.target.checked; this.dirty = true; };
      main.querySelector('[data-act="save"]').onclick = () => this.saveDraft();
      main.querySelector('[data-act="cancel"]').onclick = () => { this.dirty = false; this.select(this.currentId); if (!this.currentId) { this.draft = null; this.renderMain(); } };
      main.querySelector('[data-act="delete"]').onclick = () => this.deleteDraft();
    },

    field(label, inner, hint) {
      return `<div class="fsc-field"><label class="fsc-label">${esc(label)}</label>${inner}${hint ? `<p class="fsc-hint">${esc(hint)}</p>` : ''}</div>`;
    },

    renderForm(form) {
      const d = this.draft;
      form.innerHTML =
        `<div class="fsc-row">
          ${this.field('課程編號', `<input class="fsc-input" data-f="index" value="${esc(d.index)}" placeholder="01">`)}
          ${this.field('分類 Track', `<select class="fsc-select" data-f="track">
            <option value="fulltime" ${d.track === 'fulltime' ? 'selected' : ''}>全職養成</option>
            <option value="online" ${d.track === 'online' ? 'selected' : ''}>線上單元課程</option></select>`)}
        </div>` +
        this.field('課程標題', `<input class="fsc-input" data-f="title" value="${esc(d.title)}" placeholder="課程名稱">`) +
        this.field('副標題', `<input class="fsc-input" data-f="subtitle" value="${esc(d.subtitle)}" placeholder="一句話說明">`) +
        `<div class="fsc-row">
          ${this.field('卡片標籤', `<input class="fsc-input" data-f="tag" value="${esc(d.tag)}" placeholder="入門 / 大師研究">`)}
          ${this.field('上課時段', `<input class="fsc-input" data-f="schedule" value="${esc(d.schedule)}" placeholder="週二 20:00–22:00">`)}
        </div>` +
        this.field('詳情頁英文小標 Kicker', `<input class="fsc-input" data-f="kicker" value="${esc(d.kicker)}" placeholder="Online Module">`) +
        this.field('卡片短描述', `<textarea class="fsc-textarea" data-f="cardDesc" placeholder="總覽卡片上顯示的簡短描述">${esc(d.cardDesc)}</textarea>`) +
        this.imageField('卡片圖片', 'cardImage', d.cardImage) +
        this.imageField('Hero 大圖（詳情頁頂端）', 'heroImage', d.heroImage) +
        this.field('詳情頁導言', `<textarea class="fsc-textarea" data-f="intro" placeholder="Hero 下方的一段導言">${esc(d.intro)}</textarea>`) +
        `<div class="fsc-row">
          ${this.field('報名連結', `<input class="fsc-input" data-f="enrollUrl" value="${esc(d.enrollUrl)}" placeholder="https://…">`)}
          ${this.field('外部連結（選填）', `<input class="fsc-input" data-f="externalUrl" value="${esc(d.externalUrl)}" placeholder="https://…">`, '若填寫，總覽卡片會直接連到此網址（不進詳情頁）。')}
        </div>` +
        `<div class="fsc-section-label">課程內容區塊</div>
         <div class="fsc-blocks"></div>`;

      // 綁定基本欄位
      form.querySelectorAll('[data-f]').forEach(inp => {
        const key = inp.dataset.f;
        const handler = () => {
          this.draft[key] = (inp.type === 'checkbox') ? inp.checked : inp.value;
          this.dirty = true;
          if (key === 'track') { this.renderMain(); }
        };
        inp.addEventListener('input', handler);
        if (inp.tagName === 'SELECT') inp.addEventListener('change', handler);
      });
      // 圖片欄位的檔案 / 預覽
      form.querySelectorAll('[data-imgfield]').forEach(box => this.bindImageField(box));

      this.renderBlocks(form.querySelector('.fsc-blocks'));
    },

    imageField(label, key, val) {
      return `<div class="fsc-field" data-imgfield="${key}">
        <label class="fsc-label">${esc(label)}</label>
        <div class="fsc-image-row">
          <input class="fsc-input" data-imgurl value="${esc(editorPathValue(val))}" placeholder="貼上圖片網址，或選擇本機檔案">
          <button type="button" class="fsc-file-btn"><i class="fa-solid fa-folder-open"></i> 選檔</button>
          <input type="file" accept="image/*" hidden>
        </div>
        <img class="fsc-preview" ${val ? `src="${esc(Store.assetPath(val))}"` : 'style="display:none"'}>
      </div>`;
    },
    bindImageField(box) {
      const key = box.dataset.imgfield;
      const urlInput = box.querySelector('[data-imgurl]');
      const fileBtn = box.querySelector('.fsc-file-btn');
      const fileInput = box.querySelector('input[type="file"]');
      const preview = box.querySelector('.fsc-preview');
      const setVal = (v) => {
        this.draft[key] = v; this.dirty = true;
        if (v) { preview.src = Store.assetPath(v); preview.style.display = 'block'; }
        else preview.style.display = 'none';
      };
      urlInput.addEventListener('input', () => setVal(urlInput.value.trim()));
      fileBtn.onclick = () => fileInput.click();
      fileInput.onchange = () => {
        const f = fileInput.files && fileInput.files[0];
        if (!f) return;
        const path = fileToCourseImagePath(f);
        urlInput.value = path;
        setVal(path);
      };
    },

    /* ---------- Blocks 編輯 ---------- */
    renderBlocks(container) {
      container.innerHTML = '';
      (this.draft.blocks || []).forEach((b, i) => container.appendChild(this.renderBlock(b, i)));
      container.appendChild(this.inserter(this.draft.blocks.length));
    },
    inserter(atIndex) {
      const bar = el('div', 'fsc-inserter');
      Object.keys(BLOCK_META).forEach(type => {
        const m = BLOCK_META[type];
        const btn = el('button', null, `<i class="fa-solid ${m.icon}"></i>${m.label}`);
        btn.onclick = () => {
          this.draft.blocks.splice(atIndex, 0, blankBlock(type));
          this.dirty = true;
          this.renderBlocks(this.root.querySelector('.fsc-blocks'));
        };
        bar.appendChild(btn);
      });
      return bar;
    },
    renderBlock(b, index) {
      const m = BLOCK_META[b.type] || BLOCK_META.paragraph;
      const wrap = el('div', 'fsc-block');
      wrap.draggable = true;
      wrap.dataset.index = index;
      const head = el('div', 'fsc-block-head', `
        <span class="fsc-block-grip"><i class="fa-solid fa-grip-vertical"></i></span>
        <span class="fsc-block-type"><i class="fa-solid ${m.icon}"></i> ${m.label}</span>
        <span class="fsc-block-actions">
          <button data-a="up" title="上移">↑</button>
          <button data-a="down" title="下移">↓</button>
          <button data-a="del" class="danger" title="刪除">✕</button>
        </span>`);
      wrap.appendChild(head);
      const body = el('div', 'fsc-block-body');
      body.appendChild(this.blockBody(b, index));
      wrap.appendChild(body);

      head.querySelector('[data-a="up"]').onclick = () => this.moveBlock(index, -1);
      head.querySelector('[data-a="down"]').onclick = () => this.moveBlock(index, 1);
      head.querySelector('[data-a="del"]').onclick = () => { this.draft.blocks.splice(index, 1); this.dirty = true; this.renderBlocks(this.root.querySelector('.fsc-blocks')); };
      this.attachBlockDnD(wrap, index);
      return wrap;
    },
    moveBlock(index, dir) {
      const arr = this.draft.blocks;
      const j = index + dir;
      if (j < 0 || j >= arr.length) return;
      const t = arr[index]; arr[index] = arr[j]; arr[j] = t;
      this.dirty = true;
      this.renderBlocks(this.root.querySelector('.fsc-blocks'));
    },
    attachBlockDnD(wrap, index) {
      wrap.addEventListener('dragstart', (e) => { if (e.target.closest('input,textarea,select')) { e.preventDefault(); return; } wrap.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(index)); });
      wrap.addEventListener('dragend', () => { wrap.classList.remove('dragging'); this.root.querySelectorAll('.fsc-block').forEach(x => x.classList.remove('drop-above', 'drop-below')); });
      wrap.addEventListener('dragover', (e) => { e.preventDefault(); const r = wrap.getBoundingClientRect(); const below = e.clientY > r.top + r.height / 2; wrap.classList.toggle('drop-below', below); wrap.classList.toggle('drop-above', !below); });
      wrap.addEventListener('dragleave', () => wrap.classList.remove('drop-above', 'drop-below'));
      wrap.addEventListener('drop', (e) => {
        e.preventDefault();
        const from = parseInt(e.dataTransfer.getData('text/plain'), 10);
        let to = index;
        if (wrap.classList.contains('drop-below')) to += 1;
        const arr = this.draft.blocks;
        if (isNaN(from) || from < 0 || from >= arr.length) return;
        const [moved] = arr.splice(from, 1);
        if (from < to) to -= 1;
        arr.splice(to, 0, moved);
        this.dirty = true;
        this.renderBlocks(this.root.querySelector('.fsc-blocks'));
      });
    },

    // 綁定簡單欄位：oninput 直接寫回 block
    bind(node, obj, key, isTextarea) {
      node.addEventListener('input', () => { obj[key] = node.value; this.dirty = true; });
    },

    blockBody(b, blockIndex) {
      const frag = el('div');
      const self = this;
      const addInput = (placeholder, val, onIn) => { const i = el('input'); i.type = 'text'; i.placeholder = placeholder; i.value = val || ''; i.addEventListener('input', () => { onIn(i.value); self.dirty = true; }); frag.appendChild(i); return i; };
      const addTextarea = (placeholder, val, onIn) => { const t = el('textarea'); t.placeholder = placeholder; t.value = val || ''; t.addEventListener('input', () => { onIn(t.value); self.dirty = true; }); frag.appendChild(t); return t; };
      const addSelect = (options, val, onCh) => { const s = el('select'); options.forEach(o => { const op = el('option'); op.value = o.v; op.textContent = o.t; if (o.v === val) op.selected = true; s.appendChild(op); }); s.addEventListener('change', () => { onCh(s.value); self.dirty = true; }); frag.appendChild(s); return s; };

      switch (b.type) {
        case 'heading':
          addInput('標題文字', b.text, v => b.text = v); break;
        case 'paragraph':
          addTextarea('段落內容（可用空行分段；貼上網址會自動變連結）', b.text, v => b.text = v); break;
        case 'quote':
          addTextarea('引言內容', b.text, v => b.text = v);
          addInput('出處（選填）', b.cite, v => b.cite = v); break;
        case 'divider':
          frag.appendChild(el('div', 'fsc-divider-hint', '— 分隔線 —')); break;
        case 'image': {
          const img = el('img', 'fsc-block-img'); if (b.src) img.src = Store.assetPath(b.src); else img.style.display = 'none';
          const row = el('div', 'fsc-image-row');
          const urlI = el('input'); urlI.type = 'text'; urlI.placeholder = '圖片網址或選檔'; urlI.value = editorPathValue(b.src || '');
          const fileBtn = el('button', 'fsc-file-btn', '<i class="fa-solid fa-folder-open"></i> 選檔'); fileBtn.type = 'button';
          const fileIn = el('input'); fileIn.type = 'file'; fileIn.accept = 'image/*'; fileIn.multiple = true; fileIn.hidden = true;
          const setSrc = (v) => { b.src = v; self.dirty = true; if (v) { img.src = Store.assetPath(v); img.style.display = 'block'; } else img.style.display = 'none'; };
          urlI.addEventListener('input', () => setSrc(urlI.value.trim()));
          fileBtn.onclick = () => fileIn.click();
          fileIn.onchange = () => {
            const files = Array.from(fileIn.files || []);
            if (!files.length) return;
            const currentSize = b.size === 'small' ? 'small' : 'large';
            const first = files[0];
            const firstPath = fileToCourseImagePath(first);
            urlI.value = firstPath;
            setSrc(firstPath);
            if (files.length > 1 && Number.isInteger(blockIndex)) {
              const extraBlocks = files.slice(1).map(file => ({
                type: 'image',
                src: fileToCourseImagePath(file),
                size: currentSize,
                caption: file.name || ''
              }));
              this.draft.blocks.splice(blockIndex + 1, 0, ...extraBlocks);
            }
            try { fileIn.value = ''; } catch (_) {}
            this.dirty = true;
            this.renderBlocks(this.root.querySelector('.fsc-blocks'));
          };
          row.appendChild(urlI); row.appendChild(fileBtn); row.appendChild(fileIn);
          frag.appendChild(img); frag.appendChild(row);
          addSelect([{ v: 'large', t: '大圖（滿版）' }, { v: 'small', t: '縮圖（可並排）' }], b.size || 'large', v => b.size = v);
          addInput('圖說（選填）', b.caption, v => b.caption = v);
          frag.appendChild(el('p', 'fsc-hint', '可一次多選圖片，會自動把第一張放進目前區塊，其餘圖片自動新增成下一個圖片區塊。'));
          break;
        }
        case 'info':
          addInput('區塊標題', b.heading, v => b.heading = v);
          this.subItems(frag, b, 'items', (it) => [
            { ph: 'FontAwesome icon（如 fa-regular fa-clock）', key: 'icon' },
            { ph: '欄位名（時間 / 費用…）', key: 'label' },
            { ph: '內容值', key: 'value' }
          ], () => ({ icon: 'fa-solid fa-circle-info', label: '', value: '' }), '新增一列');
          break;
        case 'lessons':
          addInput('區塊標題', b.heading, v => b.heading = v);
          this.lessonItems(frag, b);
          break;
        case 'cards':
          addInput('區塊標題', b.heading, v => b.heading = v);
          addSelect([{ v: 3, t: '每列 3 欄' }, { v: 2, t: '每列 2 欄' }], Number(b.columns) === 2 ? 2 : 3, v => b.columns = Number(v));
          this.subItems(frag, b, 'items', () => [
            { ph: '小標題', key: 'title' },
            { ph: '說明文字', key: 'desc', textarea: true }
          ], () => ({ title: '', desc: '' }), '新增卡片');
          break;
        case 'checklist':
          addInput('區塊標題（選填）', b.heading, v => b.heading = v);
          addTextarea('每行一個項目（可用「文字：網址」建立連結）', (b.items || []).join('\n'), v => b.items = v.split('\n').map(s => s.trim()).filter(Boolean));
          break;
        case 'teacher': {
          addInput('區塊標題', b.heading, v => b.heading = v);
          const preset = el('div'); preset.style.marginBottom = '6px';
          [['吳嘉寶', 'wu'], ['涂煥昌', 'tu']].forEach(([name, k]) => {
            const pb = el('button', 'fsc-mini-add', '＋ ' + name); pb.type = 'button'; pb.style.marginRight = '6px';
            pb.onclick = () => {
              b.items = b.items || [];
              if (k === 'wu') b.items.push({ name: '吳嘉寶', role: '台北視丘攝影藝術學院暨中華攝影教育學會創辦人', photo: '/image/faculty/JIABAO_portraita.webp', link: 'faculty-detail.html?id=wu-chia-pao', badge: '' });
              else b.items.push({ name: '涂煥昌', role: 'PLE 影像風格養成所 日間部 講師', photo: '/image/faculty/涂煥昌00.webp', link: 'faculty-detail.html?id=h-c-tu', badge: '' });
              self.dirty = true; self.renderBlocks(self.root.querySelector('.fsc-blocks'));
            };
            preset.appendChild(pb);
          });
          frag.appendChild(preset);
          this.subItems(frag, b, 'items', () => [
            { ph: '姓名', key: 'name' },
            { ph: '職稱', key: 'role' },
            { ph: '照片網址 / 路徑', key: 'photo' },
            { ph: '連結（faculty-detail.html?id=…）', key: 'link' },
            { ph: '標記（實體班 / 線上班，選填）', key: 'badge' }
          ], () => ({ name: '', role: '', photo: '', link: '', badge: '' }), '新增老師');
          break;
        }
        case 'callout':
          addInput('標題', b.title, v => b.title = v);
          addTextarea('說明文字', b.text, v => b.text = v);
          addInput('按鈕連結', b.url, v => b.url = v);
          addInput('按鈕文字', b.urlLabel, v => b.urlLabel = v);
          break;
        case 'cta':
          addInput('按鈕文字', b.label, v => b.label = v);
          addInput('報名連結', b.url, v => b.url = v);
          break;
      }
      return frag;
    },

    // 通用可增減的子項目編輯器
    subItems(frag, block, arrKey, fieldsFor, blank, addLabel) {
      const self = this;
      block[arrKey] = block[arrKey] || [];
      const list = el('div');
      const rebuild = () => {
        list.innerHTML = '';
        block[arrKey].forEach((it, idx) => {
          const box = el('div', 'fsc-subitem');
          const h = el('div', 'fsc-subitem-head', `<span>#${idx + 1}</span>`);
          const del = el('button', 'fsc-mini-del', '<i class="fa-solid fa-xmark"></i>'); del.type = 'button';
          del.onclick = () => { block[arrKey].splice(idx, 1); self.dirty = true; rebuild(); };
          h.appendChild(del); box.appendChild(h);
          fieldsFor(it).forEach(f => {
            const node = f.textarea ? el('textarea') : el('input');
            if (!f.textarea) node.type = 'text';
            node.placeholder = f.ph; node.value = it[f.key] || '';
            node.addEventListener('input', () => { it[f.key] = node.value; self.dirty = true; });
            box.appendChild(node);
          });
          list.appendChild(box);
        });
      };
      rebuild();
      frag.appendChild(list);
      const add = el('button', 'fsc-mini-add', '＋ ' + (addLabel || '新增')); add.type = 'button';
      add.onclick = () => { block[arrKey].push(blank()); self.dirty = true; rebuild(); };
      frag.appendChild(add);
    },

    // 課程內容（每堂含標題 + 多行）
    lessonItems(frag, block) {
      const self = this;
      block.items = block.items || [];
      const list = el('div');
      const rebuild = () => {
        list.innerHTML = '';
        block.items.forEach((it, idx) => {
          const box = el('div', 'fsc-subitem');
          const h = el('div', 'fsc-subitem-head', `<span>第 ${idx + 1} 堂</span>`);
          const del = el('button', 'fsc-mini-del', '<i class="fa-solid fa-xmark"></i>'); del.type = 'button';
          del.onclick = () => { block.items.splice(idx, 1); self.dirty = true; rebuild(); };
          h.appendChild(del); box.appendChild(h);
          const ti = el('input'); ti.type = 'text'; ti.placeholder = '該堂標題（如：第一堂）'; ti.value = it.title || '';
          ti.addEventListener('input', () => { it.title = ti.value; self.dirty = true; });
          const lines = el('textarea'); lines.placeholder = '每行一個重點'; lines.value = (it.lines || []).join('\n');
          lines.addEventListener('input', () => { it.lines = lines.value.split('\n').map(s => s.trim()).filter(Boolean); self.dirty = true; });
          box.appendChild(ti); box.appendChild(lines);
          list.appendChild(box);
        });
      };
      rebuild();
      frag.appendChild(list);
      const add = el('button', 'fsc-mini-add', '＋ 新增一堂'); add.type = 'button';
      add.onclick = () => { block.items.push({ title: '第 ' + (block.items.length + 1) + ' 堂', lines: [''] }); self.dirty = true; rebuild(); };
      frag.appendChild(add);
    },

    /* ---------- 動作 ---------- */
    async select(id) {
      if (id === this.currentId) return;
      if (!(await this.promptAutosave('尚有未儲存的變更，切換到其他課程前會自動儲存，是否繼續？'))) return;
      const c = Store.getById(id);
      if (!c) { this.currentId = null; this.draft = null; this.renderMain(); this.renderList(); return; }
      this.currentId = id; this.draft = deepClone(c); this.dirty = false;
      this.currentTrack = c.track;
      this.root.querySelectorAll('.fsc-tab').forEach(t => t.classList.toggle('active', t.dataset.track === c.track));
      this.renderList(); this.renderMain();
    },
    async newCourse() {
      if (!(await this.promptAutosave('尚有未儲存的變更，新增課程前會自動儲存目前內容，是否繼續？'))) return;
      this.currentId = null;
      this.draft = {
        id: '', track: this.currentTrack, index: '', title: '', subtitle: '', tag: '', kicker: (this.currentTrack === 'fulltime' ? 'Full-time Program' : 'Online Module'),
        schedule: '', cardImage: '', cardDesc: '', heroImage: '', intro: '', enrollUrl: Store.FORM, externalUrl: '', featured: false,
        blocks: []
      };
      this.dirty = true;
      this.renderList(); this.renderMain();
    },
    saveDraft() {
      if (!this.draft.title.trim()) { toast('請先輸入課程標題'); return false; }
      const saved = Store.save(this.draft);
      this.currentId = saved.id; this.draft = deepClone(saved); this.dirty = false;
      this.renderList(); this.renderMain();
      toast('已儲存並同步到所有頁面');
      return true;
    },
    deleteDraft() {
      if (!this.currentId) { this.draft = null; this.dirty = false; this.renderMain(); return; }
      if (!confirm('確定要刪除「' + this.draft.title + '」？此動作無法復原。')) return;
      Store.remove(this.currentId);
      this.currentId = null; this.draft = null; this.dirty = false;
      this.renderList(); this.renderMain();
      toast('已刪除');
    },
    exportJSON() {
      const blob = new Blob([Store.exportJSON()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = el('a'); a.href = url; a.download = 'courses-data.json'; a.click();
      URL.revokeObjectURL(url);
      toast('已匯出 courses-data.json（上傳到網站根目錄即可部署）');
    },
    importJSON() {
      const input = el('input'); input.type = 'file'; input.accept = 'application/json,.json';
      input.onchange = () => {
        const f = input.files && input.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = () => {
          try { Store.importJSON(r.result, 'replace'); this.currentId = null; this.draft = null; this.dirty = false; this.renderList(); this.renderMain(); toast('匯入成功'); }
          catch (e) { toast('匯入失敗：' + e.message); }
        };
        r.readAsText(f);
      };
      input.click();
    },
    resetAll() {
      if (!confirm('確定要重置為系統預設課程？你目前的所有變更將被覆蓋。')) return;
      Store.reset(); this.currentId = null; this.draft = null; this.dirty = false;
      this.renderList(); this.renderMain();
      toast('已重置為預設');
    }
  };

  /* ---------------- 快捷鍵 ---------------- */
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'e' || e.key === 'E')) {
      e.preventDefault();
      if (Admin.root) Admin.confirmClose(); else Admin.open();
    }
    if (e.key === 'Escape' && Admin.root) Admin.confirmClose();
  });

  window.addEventListener('beforeunload', e => {
    if (!Admin.root || !Admin.dirty) return;
    e.preventDefault();
    e.returnValue = '';
  });

  /* 右下角提示（游標移到右下角時淡入） */
  const hint = el('div'); hint.id = 'fsc-hint'; hint.textContent = '課程管理：⌘/Ctrl + ⇧ + E';
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(hint));
  if (document.body) document.body.appendChild(hint);
  document.addEventListener('mousemove', (e) => {
    const near = e.clientX > window.innerWidth - 220 && e.clientY > window.innerHeight - 80;
    hint.classList.toggle('show', near && !Admin.root);
  });

  window.CoursesAdmin = Admin;
})();

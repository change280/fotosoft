/* ============================================================
 * admin.js — 視丘家族藝廊「隱藏管理系統」
 * ------------------------------------------------------------
 * 觸發：Cmd + Shift + E   (Mac) / Ctrl + Shift + E (Win/Linux)
 * 功能：
 *   1. 開啟浮動管理面板 (Overlay Panel)
 *   2. 列出所有作品，可點擊編輯 / 刪除 / 新增
 *   3. 表單支援：標題、副標、封面、簡介、日期、分類、標籤
 *      + 拖曳排序 & 新增/刪除內頁作品照
 *   4. 圖片：可貼上 URL 或選擇本機檔（自動轉 Base64 存 localStorage）
 *   5. 匯出 JSON (works.json) 與 匯入 JSON
 *   6. 一鍵切換是否置入首頁「視丘藝廊」精選
 *
 * 依賴：window.WorksStore (works-data.js)
 * 樣式：Tailwind CDN（頁面已載入）+ 內建 <style>
 * ============================================================ */

(function () {
  'use strict';

  if (typeof window.WorksStore === 'undefined') {
    console.warn('[admin] 找不到 WorksStore，請先載入 js/works-data.js');
    return;
  }

  /* ---------------------------------------------------------- */
  /* 樣式（僅注入一次）                                          */
  /* ---------------------------------------------------------- */
  const STYLE_ID = 'fotosoft-admin-style';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #fs-admin-root, #fs-admin-root * { box-sizing: border-box; }
      #fs-admin-root {
        position: fixed; inset: 0; z-index: 99999;
        font-family: "Noto Sans TC", system-ui, -apple-system, sans-serif;
        color: #212529;
      }
      #fs-admin-root .fs-backdrop {
        position: absolute; inset: 0;
        background: rgba(15, 23, 42, 0.55);
        backdrop-filter: blur(6px);
      }
      #fs-admin-root .fs-panel {
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: min(1200px, 95vw); height: min(85vh, 900px);
        background: #fff; border-radius: 14px;
        box-shadow: 0 40px 80px -20px rgba(0,0,0,0.35);
        display: flex; overflow: hidden;
      }
      #fs-admin-root .fs-side {
        width: 320px; border-right: 1px solid #E9ECEF;
        display: flex; flex-direction: column; background: #F8F9FA;
      }
      #fs-admin-root .fs-side-head {
        padding: 20px 20px 14px; border-bottom: 1px solid #E9ECEF;
      }
      #fs-admin-root .fs-side-title {
        font-family: "Noto Serif TC", serif; font-size: 20px; font-weight: 700;
        margin: 0 0 4px;
      }
      #fs-admin-root .fs-side-sub {
        font-size: 11px; color: #6C757D; letter-spacing: 0.15em;
        text-transform: uppercase; margin: 0;
      }
      #fs-admin-root .fs-search {
        margin: 12px 20px; padding: 10px 12px;
        border: 1px solid #DEE2E6; border-radius: 8px;
        background: #fff; font-size: 13px; outline: none;
      }
      #fs-admin-root .fs-search:focus { border-color: #212529; }
      #fs-admin-root .fs-list {
        flex: 1; overflow-y: auto; padding: 4px 12px 12px;
      }
      #fs-admin-root .fs-list-item {
        display: flex; gap: 10px; align-items: center;
        padding: 8px; margin-bottom: 4px; border-radius: 8px;
        cursor: pointer; transition: background 0.15s;
      }
      #fs-admin-root .fs-list-item:hover { background: #E9ECEF; }
      #fs-admin-root .fs-list-item.active {
        background: #212529; color: #fff;
      }
      #fs-admin-root .fs-list-item.active .fs-list-sub { color: #ADB5BD; }
      #fs-admin-root .fs-list-thumb {
        width: 48px; height: 48px; border-radius: 6px;
        background: #DEE2E6 center/cover no-repeat; flex-shrink: 0;
      }
      #fs-admin-root .fs-list-text { min-width: 0; flex: 1; }
      #fs-admin-root .fs-list-title {
        font-size: 13px; font-weight: 500; margin: 0 0 2px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      #fs-admin-root .fs-list-sub {
        font-size: 11px; color: #6C757D; margin: 0;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      #fs-admin-root .fs-list-star {
        font-size: 12px; color: #f59e0b;
      }
      #fs-admin-root .fs-side-foot {
        padding: 12px 20px; border-top: 1px solid #E9ECEF;
        display: flex; flex-direction: column; gap: 8px;
      }
      #fs-admin-root .fs-btn {
        padding: 9px 14px; border-radius: 8px; font-size: 13px;
        font-weight: 500; cursor: pointer; border: 1px solid transparent;
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        transition: all 0.15s;
      }
      #fs-admin-root .fs-btn-primary { background: #212529; color: #fff; }
      #fs-admin-root .fs-btn-primary:hover { background: #000; }
      #fs-admin-root .fs-btn-ghost { background: transparent; color: #212529; border-color: #DEE2E6; }
      #fs-admin-root .fs-btn-ghost:hover { background: #E9ECEF; }
      #fs-admin-root .fs-btn-danger { background: #dc2626; color: #fff; }
      #fs-admin-root .fs-btn-danger:hover { background: #b91c1c; }
      #fs-admin-root .fs-btn-sm { padding: 6px 10px; font-size: 12px; }

      #fs-admin-root .fs-main {
        flex: 1; display: flex; flex-direction: column; min-width: 0;
      }
      #fs-admin-root .fs-main-head {
        padding: 16px 24px; border-bottom: 1px solid #E9ECEF;
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
      }
      #fs-admin-root .fs-main-title {
        font-family: "Noto Serif TC", serif; font-size: 18px; font-weight: 700; margin: 0;
      }
      #fs-admin-root .fs-close {
        width: 34px; height: 34px; border-radius: 50%;
        border: 1px solid #DEE2E6; background: #fff;
        cursor: pointer; font-size: 16px; color: #6C757D;
        display: inline-flex; align-items: center; justify-content: center;
      }
      #fs-admin-root .fs-close:hover { background: #F8F9FA; color: #212529; }
      #fs-admin-root .fs-form {
        flex: 1; overflow-y: auto; padding: 20px 24px 24px;
      }
      #fs-admin-root .fs-empty {
        flex: 1; display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        color: #ADB5BD; text-align: center; padding: 40px;
      }
      #fs-admin-root .fs-empty h3 {
        font-family: "Noto Serif TC", serif; font-size: 22px;
        color: #6C757D; margin: 12px 0 6px;
      }
      #fs-admin-root .fs-empty p { margin: 0; font-size: 13px; }

      #fs-admin-root .fs-field { margin-bottom: 18px; }
      #fs-admin-root .fs-label {
        display: block; font-size: 12px; font-weight: 500;
        color: #495057; margin-bottom: 6px; letter-spacing: 0.05em;
      }
      #fs-admin-root .fs-input, #fs-admin-root .fs-textarea, #fs-admin-root .fs-select {
        width: 100%; padding: 9px 12px; border: 1px solid #DEE2E6;
        border-radius: 8px; font-size: 13px; font-family: inherit;
        outline: none; background: #fff; color: #212529;
      }
      #fs-admin-root .fs-input:focus,
      #fs-admin-root .fs-textarea:focus,
      #fs-admin-root .fs-select:focus { border-color: #212529; }
      #fs-admin-root .fs-textarea { min-height: 96px; resize: vertical; line-height: 1.6; }
      #fs-admin-root .fs-row {
        display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
      }
      #fs-admin-root .fs-cover-preview {
        width: 100%; aspect-ratio: 3/2; border-radius: 8px;
        background: #F8F9FA center/cover no-repeat;
        border: 1px dashed #DEE2E6; margin-bottom: 8px;
        display: flex; align-items: center; justify-content: center;
        color: #ADB5BD; font-size: 12px;
      }
      #fs-admin-root .fs-image-row {
        display: flex; gap: 8px; align-items: center;
      }
      #fs-admin-root .fs-image-row .fs-input { flex: 1; }
      #fs-admin-root .fs-file-btn {
        padding: 9px 14px; border-radius: 8px; font-size: 12px;
        background: #F8F9FA; border: 1px solid #DEE2E6; color: #495057;
        cursor: pointer; white-space: nowrap;
      }
      #fs-admin-root .fs-file-btn:hover { background: #E9ECEF; }

      #fs-admin-root .fs-cat-list {
        display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;
      }
      #fs-admin-root .fs-cat-chip {
        padding: 5px 10px; border-radius: 999px; font-size: 11px;
        border: 1px solid #DEE2E6; cursor: pointer; user-select: none;
        color: #6C757D; background: #fff; transition: all 0.15s;
      }
      #fs-admin-root .fs-cat-chip.on {
        background: #212529; color: #fff; border-color: #212529;
      }

      #fs-admin-root .fs-gallery-list {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 10px; margin-top: 6px;
      }
      #fs-admin-root .fs-gallery-item {
        position: relative; aspect-ratio: 1; border-radius: 8px;
        background: #F8F9FA center/cover no-repeat;
        border: 1px solid #DEE2E6; overflow: hidden;
      }
      #fs-admin-root .fs-gallery-item .fs-gallery-actions {
        position: absolute; inset: 0; background: rgba(0,0,0,0.5);
        display: flex; align-items: center; justify-content: center; gap: 8px;
        opacity: 0; transition: opacity 0.15s;
      }
      #fs-admin-root .fs-gallery-item:hover .fs-gallery-actions { opacity: 1; }
      #fs-admin-root .fs-gallery-actions button {
        width: 32px; height: 32px; border-radius: 50%;
        border: none; background: #fff; cursor: pointer;
        color: #212529; font-size: 12px;
      }
      #fs-admin-root .fs-gallery-add {
        aspect-ratio: 1; border-radius: 8px;
        border: 1px dashed #DEE2E6; background: #F8F9FA;
        cursor: pointer; display: flex; flex-direction: column;
        align-items: center; justify-content: center; gap: 6px;
        color: #6C757D; font-size: 12px; padding: 8px;
      }
      #fs-admin-root .fs-gallery-add:hover { border-color: #212529; color: #212529; }

      #fs-admin-root .fs-toolbar {
        display: flex; gap: 8px; padding: 14px 24px;
        border-top: 1px solid #E9ECEF; background: #F8F9FA;
      }
      #fs-admin-root .fs-toolbar-spacer { flex: 1; }
      #fs-admin-root .fs-toggle {
        display: inline-flex; align-items: center; gap: 8px;
        font-size: 13px; color: #495057; cursor: pointer;
      }
      #fs-admin-root .fs-toggle input { accent-color: #212529; }

      #fs-admin-root .fs-toast {
        position: fixed; bottom: 24px; left: 50%;
        transform: translateX(-50%); padding: 12px 20px;
        background: #212529; color: #fff; border-radius: 8px;
        font-size: 13px; z-index: 100000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: fs-toast-in 0.25s ease-out;
      }
      @keyframes fs-toast-in {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to   { opacity: 1; transform: translate(-50%, 0); }
      }

      #fs-admin-root .fs-dialog-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 42, 0.24);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100001;
      }
      #fs-admin-root .fs-dialog {
        width: min(460px, calc(100vw - 32px));
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 30px 80px -28px rgba(0,0,0,0.35);
        overflow: hidden;
      }
      #fs-admin-root .fs-dialog-body {
        padding: 24px 26px 20px;
        font-size: 20px;
        line-height: 1.7;
        color: #212529;
      }
      #fs-admin-root .fs-dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 14px 18px 18px;
        border-top: 1px solid #E9ECEF;
      }

      #fs-admin-hint {
        position: fixed; bottom: 12px; right: 12px;
        z-index: 99998; padding: 6px 10px; border-radius: 6px;
        background: rgba(33, 37, 41, 0.7); color: #fff;
        font-size: 10px; letter-spacing: 0.1em;
        font-family: "Noto Sans TC", sans-serif;
        pointer-events: none; opacity: 0;
        transition: opacity 0.3s;
      }
      #fs-admin-hint.show { opacity: 1; }

      @media (max-width: 820px) {
        #fs-admin-root .fs-panel { width: 100vw; height: 100vh; border-radius: 0; flex-direction: column; }
        #fs-admin-root .fs-side { width: 100%; height: 40%; border-right: none; border-bottom: 1px solid #E9ECEF; }
        #fs-admin-root .fs-row { grid-template-columns: 1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ---------------------------------------------------------- */
  /* State                                                       */
  /* ---------------------------------------------------------- */
  const DRAFT_STORAGE_KEY = 'FOTOSOFT_GALLERY_ADMIN_DRAFT_V1';
  let rootEl = null;
  let selectedId = null;
  let searchTerm = '';
  let dirtyDraft = null; // 未儲存的表單資料
  let allowHistoryExit = false;

  function hasUnsavedDraft() {
    return !!dirtyDraft || !!localStorage.getItem(DRAFT_STORAGE_KEY);
  }
  function clearDraftState() {
    try { localStorage.removeItem(DRAFT_STORAGE_KEY); } catch (_) {}
  }
  function persistDraftState() {
    if (!dirtyDraft) {
      clearDraftState();
      return;
    }
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
        selectedId: selectedId || '',
        searchTerm: searchTerm,
        dirtyDraft: dirtyDraft
      }));
    } catch (_) {}
  }
  function restoreDraftState() {
    let raw = null;
    try { raw = localStorage.getItem(DRAFT_STORAGE_KEY); } catch (_) {}
    if (!raw) return false;
    try {
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== 'object' || !saved.dirtyDraft || typeof saved.dirtyDraft !== 'object') return false;
      selectedId = saved.selectedId || '';
      searchTerm = typeof saved.searchTerm === 'string' ? saved.searchTerm : '';
      dirtyDraft = saved.dirtyDraft;
      return true;
    } catch (_) {
      clearDraftState();
      return false;
    }
  }
  function discardDirtyDraft() {
    dirtyDraft = null;
    clearDraftState();
  }
  function confirmAbandonUnsaved(message) {
    if (!dirtyDraft) return true;
    return confirm(message || '尚有未儲存的變更，確定要放棄嗎？');
  }
  async function resolveUnsavedBeforeContinue(message) {
    if (!dirtyDraft) return true;
    const action = await showSaveDiscardDialog(message || '尚有未儲存的變更，是否繼續？');
    if (action === 'save') {
      return saveDraft();
    }
    discardDirtyDraft();
    return true;
  }
  function showSaveDiscardDialog(message) {
    return new Promise(resolve => {
      if (!rootEl) {
        resolve('discard');
        return;
      }
      const wrap = document.createElement('div');
      wrap.className = 'fs-dialog-backdrop';
      wrap.innerHTML = '' +
        '<div class="fs-dialog" role="alertdialog" aria-modal="true" aria-labelledby="fs-dialog-title">' +
          '<div class="fs-dialog-body" id="fs-dialog-title">' + escapeHtml(message || '尚有未儲存的變更，是否繼續？') + '</div>' +
          '<div class="fs-dialog-actions">' +
            '<button class="fs-btn fs-btn-ghost fs-btn-sm" data-dialog-action="discard">捨棄</button>' +
            '<button class="fs-btn fs-btn-primary fs-btn-sm" data-dialog-action="save">儲存</button>' +
          '</div>' +
        '</div>';

      function cleanup(result) {
        document.removeEventListener('keydown', onKeydown, true);
        wrap.remove();
        resolve(result);
      }
      function onKeydown(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          cleanup('save');
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          cleanup('discard');
        }
      }

      wrap.addEventListener('click', e => {
        const action = e.target && e.target.getAttribute('data-dialog-action');
        if (!action) return;
        cleanup(action);
      });

      rootEl.appendChild(wrap);
      document.addEventListener('keydown', onKeydown, true);
      const primary = wrap.querySelector('[data-dialog-action="save"]');
      if (primary) primary.focus();
    });
  }

  /* ---------------------------------------------------------- */
  /* Toast                                                       */
  /* ---------------------------------------------------------- */
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'fs-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  /* ---------------------------------------------------------- */
  /* Open / Close                                                */
  /* ---------------------------------------------------------- */
  function open() {
    if (rootEl) return;
    const restored = !dirtyDraft && restoreDraftState();
    rootEl = document.createElement('div');
    rootEl.id = 'fs-admin-root';
    document.body.appendChild(rootEl);

    if (!restored) {
      // 預設選第一筆
      const all = WorksStore.getAll();
      selectedId = all.length ? all[0].id : null;
      dirtyDraft = null;
    }
    render();
    if (restored) toast('已還原上次未儲存的編輯');
  }

  async function close() {
    if (!(await resolveUnsavedBeforeContinue('尚有未儲存的變更，關閉前是否先儲存？'))) return;
    if (rootEl) { rootEl.remove(); rootEl = null; }
    discardDirtyDraft();
  }

  /* ---------------------------------------------------------- */
  /* Render                                                      */
  /* ---------------------------------------------------------- */
  function render() {
    if (!rootEl) return;
    const prevForm = rootEl.querySelector('.fs-form');
    const prevList = rootEl.querySelector('.fs-list');
    const savedFormScroll = prevForm ? prevForm.scrollTop : 0;
    const savedListScroll = prevList ? prevList.scrollTop : 0;
    const activeEl = document.activeElement;
    const activeMarker = activeEl && rootEl.contains(activeEl) ? {
      field: activeEl.getAttribute('data-field') || activeEl.getAttribute('data-role'),
      idx: activeEl.getAttribute('data-index'),
      selStart: typeof activeEl.selectionStart === 'number' ? activeEl.selectionStart : null,
      selEnd: typeof activeEl.selectionEnd === 'number' ? activeEl.selectionEnd : null
    } : null;

    const works = WorksStore.getAll();
    const filtered = searchTerm
      ? works.filter(w =>
          (w.title + ' ' + w.subtitle + ' ' + (w.tags || []).join(' '))
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : works;

    const current = works.find(w => w.id === selectedId) || null;
    const draft = dirtyDraft || current;

    rootEl.innerHTML = `
      <div class="fs-backdrop" data-role="close"></div>
      <div class="fs-panel" role="dialog" aria-label="家族藝廊管理">
        <aside class="fs-side">
          <div class="fs-side-head">
            <h2 class="fs-side-title">家族藝廊管理</h2>
            <p class="fs-side-sub">Family Gallery Admin</p>
          </div>
          <input class="fs-search" data-role="search" placeholder="搜尋作品標題／標籤…" value="${escapeAttr(searchTerm)}">
          <div class="fs-list" data-role="list">
            ${filtered.map(w => renderListItem(w)).join('') || '<p style="padding:20px;color:#ADB5BD;font-size:12px;text-align:center;">找不到符合的作品</p>'}
          </div>
          <div class="fs-side-foot">
            <button class="fs-btn fs-btn-primary" data-role="new">
              <span>＋</span> 新增作品
            </button>
            <div style="display:flex;gap:6px;">
              <button class="fs-btn fs-btn-ghost fs-btn-sm" data-role="export" style="flex:1;">匯出 JSON</button>
              <button class="fs-btn fs-btn-ghost fs-btn-sm" data-role="import" style="flex:1;">匯入 JSON</button>
            </div>
            <p style="margin:6px 2px 0;font-size:11px;line-height:1.6;color:#6C757D;">編輯資料先儲存在瀏覽器（localStorage），不會自動寫入網站檔案。若要落地保存，請按「匯出 JSON」。</p>
            <button class="fs-btn fs-btn-ghost fs-btn-sm" data-role="reset" style="color:#dc2626;border-color:#fecaca;">重置為預設資料</button>
          </div>
        </aside>

        <main class="fs-main">
          ${draft ? renderForm(draft, !current) : renderEmpty()}
        </main>
      </div>
    `;
    bindEvents();

    const newForm = rootEl.querySelector('.fs-form');
    const newList = rootEl.querySelector('.fs-list');
    if (newForm) newForm.scrollTop = savedFormScroll;
    if (newList) newList.scrollTop = savedListScroll;

    if (activeMarker && activeMarker.field) {
      let selector = '';
      if (activeMarker.idx != null) {
        selector = '[data-field="' + activeMarker.field + '"][data-index="' + activeMarker.idx + '"]';
      }
      if (!selector) selector = '[data-field="' + activeMarker.field + '"]';
      if (!rootEl.querySelector(selector)) selector = '[data-role="' + activeMarker.field + '"]';
      const target = rootEl.querySelector(selector);
      if (target && typeof target.focus === 'function') {
        try { target.focus({ preventScroll: true }); } catch (_) { target.focus(); }
        if (activeMarker.selStart != null && typeof target.setSelectionRange === 'function') {
          try { target.setSelectionRange(activeMarker.selStart, activeMarker.selEnd != null ? activeMarker.selEnd : activeMarker.selStart); } catch (_) {}
        }
      }
    }
  }

  function renderListItem(w) {
    const active = w.id === selectedId ? 'active' : '';
    const bg = w.coverImage ? `background-image:url('${escapeAttr(w.coverImage)}')` : '';
    return `
      <div class="fs-list-item ${active}" data-role="select" data-id="${escapeAttr(w.id)}">
        <div class="fs-list-thumb" style="${bg}"></div>
        <div class="fs-list-text">
          <p class="fs-list-title">${escapeHtml(w.title)}</p>
          <p class="fs-list-sub">${escapeHtml(w.subtitle || w.categories.join(' · '))}</p>
        </div>
        ${w.featured ? '<span class="fs-list-star" title="首頁精選">★</span>' : ''}
      </div>
    `;
  }

  function renderEmpty() {
    return `
      <div class="fs-empty">
        <div style="font-size:40px;">📸</div>
        <h3>尚無作品</h3>
        <p>點擊左下角「新增作品」開始建立第一件作品。</p>
      </div>
    `;
  }

  function renderForm(w, isNew) {
    const allCats = WorksStore.getAllCategories();
    const currentCats = new Set(w.categories || []);
    return `
      <div class="fs-main-head">
        <h2 class="fs-main-title">${isNew ? '新增作品' : '編輯作品'}</h2>
        <button class="fs-close" data-role="close" title="關閉 (Esc)">×</button>
      </div>
      <div class="fs-form">
        <div class="fs-field">
          <label class="fs-label">封面圖（顯示於家族藝廊圖卡 & 首頁視丘藝廊）</label>
          <div class="fs-cover-preview" style="${w.coverImage ? `background-image:url('${escapeAttr(w.coverImage)}')` : ''}">
            ${w.coverImage ? '' : '尚未設定封面'}
          </div>
          <div class="fs-image-row">
            <input class="fs-input" data-field="coverImage" placeholder="/image/gallery/檔名.jpg 或外部網址" value="${escapeAttr(w.coverImage)}">
            <label class="fs-file-btn">
              選擇檔案
              <input type="file" accept="image/*" hidden data-role="upload-cover">
            </label>
          </div>
        </div>

        <div class="fs-row">
          <div class="fs-field">
            <label class="fs-label">標題 *（例：FST42-郭曉玲）</label>
            <input class="fs-input" data-field="title" value="${escapeAttr(w.title)}" required>
          </div>
          <div class="fs-field">
            <label class="fs-label">副標（例：日間部 第 42 期 / 學員）</label>
            <input class="fs-input" data-field="subtitle" value="${escapeAttr(w.subtitle)}">
          </div>
        </div>

        <div class="fs-row">
          <div class="fs-field">
            <label class="fs-label">展出日期</label>
            <input class="fs-input" data-field="date" type="date" value="${escapeAttr(w.date)}">
          </div>
          <div class="fs-field">
            <label class="fs-label">自訂標籤（以逗號分隔）</label>
            <input class="fs-input" data-field="tags" value="${escapeAttr((w.tags || []).join(', '))}">
          </div>
        </div>

        <div class="fs-field">
          <label class="fs-label">分類（可複選）</label>
          <div class="fs-cat-list">
            ${allCats.map(c => `
              <span class="fs-cat-chip ${currentCats.has(c) ? 'on' : ''}" data-role="toggle-cat" data-cat="${escapeAttr(c)}">${escapeHtml(c)}</span>
            `).join('')}
            <span class="fs-cat-chip" data-role="add-cat" style="border-style:dashed;">＋ 新分類</span>
          </div>
        </div>

        <div class="fs-field">
          <label class="fs-label">作品簡介 / 自述</label>
          <textarea class="fs-textarea" data-field="description" placeholder="描述創作理念、拍攝背景…">${escapeHtml(w.description)}</textarea>
        </div>

        <div class="fs-field">
          <label class="fs-label">內頁作品照（${(w.gallery || []).length} 張）</label>
          <div class="fs-gallery-list" data-role="gallery">
            ${(w.gallery || []).map((g, i) => `
              <div class="fs-gallery-item" style="background-image:url('${escapeAttr(g.src)}')">
                <div class="fs-gallery-actions">
                  <button data-role="edit-gallery" data-index="${i}" title="編輯網址">✎</button>
                  <button data-role="remove-gallery" data-index="${i}" title="刪除">🗑</button>
                </div>
              </div>
            `).join('')}
            <label class="fs-gallery-add">
              <div style="font-size:20px;">＋</div>
              <div>新增照片</div>
              <input type="file" accept="image/*" multiple hidden data-role="upload-gallery">
            </label>
          </div>
          <p style="font-size:11px;color:#ADB5BD;margin:6px 0 0;">選擇本機檔案時會自動填入 /image/gallery/檔名，也可改為外部連結。</p>
        </div>

        <div class="fs-field">
          <label class="fs-toggle">
            <input type="checkbox" data-field="featured" ${w.featured ? 'checked' : ''}>
            置入首頁「視丘藝廊」精選區
          </label>
        </div>
      </div>

      <div class="fs-toolbar">
        ${!isNew ? '<button class="fs-btn fs-btn-danger fs-btn-sm" data-role="delete">刪除此作品</button>' : ''}
        <div class="fs-toolbar-spacer"></div>
        ${!isNew ? `<a class="fs-btn fs-btn-ghost fs-btn-sm" href="work-detail.html?id=${encodeURIComponent(w.id)}" target="_blank">預覽 ↗</a>` : ''}
        <button class="fs-btn fs-btn-ghost fs-btn-sm" data-role="cancel">取消</button>
        <button class="fs-btn fs-btn-primary fs-btn-sm" data-role="save">儲存</button>
      </div>
    `;
  }

  /* ---------------------------------------------------------- */
  /* Events                                                      */
  /* ---------------------------------------------------------- */
  function bindEvents() {
    // 關閉
    rootEl.querySelectorAll('[data-role="close"]').forEach(el =>
      el.addEventListener('click', close)
    );

    // 搜尋
    const search = rootEl.querySelector('[data-role="search"]');
    if (search) {
      search.addEventListener('input', e => {
        searchTerm = e.target.value;
        persistDraftState();
        // 只重繪列表，避免打斷 input focus
        const list = rootEl.querySelector('[data-role="list"]');
        const filtered = WorksStore.getAll().filter(w =>
          (w.title + ' ' + w.subtitle + ' ' + (w.tags || []).join(' '))
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
        list.innerHTML = filtered.map(w => renderListItem(w)).join('') ||
          '<p style="padding:20px;color:#ADB5BD;font-size:12px;text-align:center;">找不到符合的作品</p>';
        bindListItems();
      });
    }
    bindListItems();

    // 新增
    const newBtn = rootEl.querySelector('[data-role="new"]');
    if (newBtn) newBtn.addEventListener('click', async () => {
      if (!(await resolveUnsavedBeforeContinue('尚有未儲存的變更，建立新作品前是否先儲存？'))) return;
      selectedId = null;
      dirtyDraft = {
        id: '',
        title: '',
        subtitle: '',
        coverImage: '',
        description: '',
        date: new Date().toISOString().slice(0, 10),
        categories: [],
        tags: [],
        gallery: [],
        featured: false
      };
      persistDraftState();
      render();
    });

    // 匯出 / 匯入 / 重置
    rootEl.querySelector('[data-role="export"]')
      ?.addEventListener('click', async () => {
        if (!(await resolveUnsavedBeforeContinue('匯出前有未儲存的變更，是否先儲存？'))) return;
        exportJSON();
      });
    rootEl.querySelector('[data-role="import"]')
      ?.addEventListener('click', async () => {
        if (!(await resolveUnsavedBeforeContinue('匯入前有未儲存的變更，是否先儲存？'))) return;
        importJSON();
      });
    rootEl.querySelector('[data-role="reset"]')
      ?.addEventListener('click', async () => {
        if (!(await resolveUnsavedBeforeContinue('重置前有未儲存的變更，是否先儲存？'))) return;
        if (confirm('確定重置為預設 10 筆資料？當前所有變更會遺失。')) {
          WorksStore.reset();
          discardDirtyDraft();
          selectedId = WorksStore.getAll()[0]?.id || null;
          render();
          toast('已重置為預設資料');
        }
      });

    // ===== 表單事件 =====
    rootEl.querySelectorAll('[data-field]').forEach(el => {
      el.addEventListener('input', () => {
        ensureDraft();
        const field = el.getAttribute('data-field');
        if (field === 'featured') {
          dirtyDraft.featured = el.checked;
        } else if (field === 'tags') {
          dirtyDraft.tags = el.value.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          dirtyDraft[field] = el.value;
        }
        persistDraftState();
        if (field === 'coverImage') {
          const preview = rootEl.querySelector('.fs-cover-preview');
          if (preview) {
            preview.style.backgroundImage = el.value ? `url('${el.value}')` : '';
            preview.textContent = el.value ? '' : '尚未設定封面';
          }
        }
      });
    });

    // 分類 chip
    rootEl.querySelectorAll('[data-role="toggle-cat"]').forEach(el =>
      el.addEventListener('click', () => {
        ensureDraft();
        const cat = el.getAttribute('data-cat');
        const set = new Set(dirtyDraft.categories || []);
        if (set.has(cat)) set.delete(cat); else set.add(cat);
        dirtyDraft.categories = Array.from(set);
        persistDraftState();
        el.classList.toggle('on');
      })
    );
    rootEl.querySelector('[data-role="add-cat"]')
      ?.addEventListener('click', () => {
        const name = prompt('請輸入新分類名稱：');
        if (!name) return;
        ensureDraft();
        dirtyDraft.categories = Array.from(new Set([...(dirtyDraft.categories || []), name.trim()]));
        persistDraftState();
        render();
      });

    // 封面上傳
    rootEl.querySelector('[data-role="upload-cover"]')
      ?.addEventListener('change', e => {
        const file = e.target.files?.[0];
        if (!file) return;
        ensureDraft();
        dirtyDraft.coverImage = galleryImagePathFromFile(file);
        persistDraftState();
        toast('已設定封面路徑為 ' + dirtyDraft.coverImage);
        render();
      });

    // 內頁圖 - 新增
    rootEl.querySelector('[data-role="upload-gallery"]')
      ?.addEventListener('change', e => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        ensureDraft();
        dirtyDraft.gallery = Array.isArray(dirtyDraft.gallery) ? dirtyDraft.gallery : [];
        files.forEach(f => {
          dirtyDraft.gallery.push({ src: galleryImagePathFromFile(f), caption: f.name });
        });
        persistDraftState();
        toast('已新增 ' + files.length + ' 張，路徑預設為 /image/gallery/');
        render();
      });

    // 內頁圖 - 編輯 / 刪除
    rootEl.querySelectorAll('[data-role="edit-gallery"]').forEach(el =>
      el.addEventListener('click', () => {
        const idx = Number(el.getAttribute('data-index'));
        ensureDraft();
        const current = dirtyDraft.gallery[idx];
        const next = prompt('請輸入圖片網址：', (current && current.src ? current.src : '/image/gallery/'));
        if (next === null) return;
        if (!next.trim()) return;
        dirtyDraft.gallery[idx] = { ...current, src: next.trim() };
        persistDraftState();
        render();
      })
    );
    rootEl.querySelectorAll('[data-role="remove-gallery"]').forEach(el =>
      el.addEventListener('click', () => {
        const idx = Number(el.getAttribute('data-index'));
        ensureDraft();
        dirtyDraft.gallery.splice(idx, 1);
        persistDraftState();
        render();
      })
    );

    // 底部按鈕
    rootEl.querySelector('[data-role="save"]')
      ?.addEventListener('click', () => {
        if (!saveDraft()) return;
        render();
      });
    rootEl.querySelector('[data-role="cancel"]')
      ?.addEventListener('click', async () => {
        if (!(await resolveUnsavedBeforeContinue('取消編輯前，是否先儲存目前變更？'))) return;
        render();
      });
    rootEl.querySelector('[data-role="delete"]')
      ?.addEventListener('click', () => {
        if (!selectedId) return;
        if (!confirm('確定刪除這件作品？此動作無法復原（但仍保留於已匯出的 JSON 檔）。')) return;
        WorksStore.remove(selectedId);
        discardDirtyDraft();
        selectedId = WorksStore.getAll()[0]?.id || null;
        render();
        toast('已刪除');
      });
  }

  function bindListItems() {
    rootEl.querySelectorAll('[data-role="select"]').forEach(el =>
      el.addEventListener('click', async () => {
        const nextId = el.getAttribute('data-id');
        if (dirtyDraft && nextId !== selectedId) {
          const action = await showSaveDiscardDialog('尚有未儲存的變更，切換作品會放棄目前編輯，是否繼續？');
          if (action === 'save') {
            if (!saveDraft()) return;
          } else {
            discardDirtyDraft();
          }
        }
        selectedId = nextId;
        render();
      })
    );
  }

  function ensureDraft() {
    if (dirtyDraft) return;
    const current = WorksStore.getById(selectedId);
    dirtyDraft = current ? JSON.parse(JSON.stringify(current)) : null;
    persistDraftState();
  }

  function saveDraft() {
    if (!dirtyDraft) return true;
    if (!dirtyDraft.title || !dirtyDraft.title.trim()) {
      alert('請輸入作品標題');
      return false;
    }
    const saved = WorksStore.save(dirtyDraft);
    selectedId = saved.id;
    dirtyDraft = null;
    clearDraftState();
    toast('已儲存');
    return true;
  }

  /* ---------------------------------------------------------- */
  /* Import / Export                                             */
  /* ---------------------------------------------------------- */
  function exportJSON() {
    const blob = new Blob([WorksStore.exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'works.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast('已下載 works.json');
  }

  function importJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = () => {
      const f = input.files?.[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const mode = confirm('按「確定」= 合併（保留現有並更新同 ID）\n按「取消」= 完全取代') ? 'merge' : 'replace';
          WorksStore.importJSON(String(reader.result), mode);
          selectedId = WorksStore.getAll()[0]?.id || null;
          discardDirtyDraft();
          render();
          toast('匯入完成');
        } catch (err) {
          alert('匯入失敗：' + err.message);
        }
      };
      reader.readAsText(f);
    };
    input.click();
  }

  /* ---------------------------------------------------------- */
  /* Helpers                                                     */
  /* ---------------------------------------------------------- */
  function galleryImagePathFromFile(file) {
    const name = String((file && file.name) || '').split(/[\\/]/).pop().trim();
    return name ? '/image/gallery/' + name : '';
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------------------------------------------------------- */
  /* Keyboard shortcut  (Cmd/Ctrl + Shift + E)                   */
  /* ---------------------------------------------------------- */
  document.addEventListener('keydown', e => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const modifier = isMac ? e.metaKey : e.ctrlKey;
    if (modifier && e.shiftKey && (e.key === 'e' || e.key === 'E')) {
      e.preventDefault();
      if (rootEl) close(); else open();
    }
    if (e.key === 'Escape' && rootEl) {
      close();
    }
  });

  window.addEventListener('popstate', () => {
    if (!rootEl || !hasUnsavedDraft()) return;
    if (allowHistoryExit) {
      allowHistoryExit = false;
      return;
    }
    history.pushState({ __fsGalleryAdminDraft: true }, '', location.href);
    resolveUnsavedBeforeContinue('離開頁面前偵測到未儲存編輯，是否先儲存？').then(ok => {
      if (!ok) return;
      allowHistoryExit = true;
      try { history.back(); } catch (_) { allowHistoryExit = false; }
    });
  });

  window.addEventListener('beforeunload', e => {
    if (!hasUnsavedDraft()) return;
    e.preventDefault();
    e.returnValue = '';
  });

  /* ---------------------------------------------------------- */
  /* 顯示極簡提示 (滑鼠移到頁面右下才淡入，避免打擾訪客)             */
  /* ---------------------------------------------------------- */
  const hint = document.createElement('div');
  hint.id = 'fs-admin-hint';
  hint.textContent = '⌘ + ⇧ + E · Admin';
  document.body.appendChild(hint);
  document.addEventListener('mousemove', e => {
    const near = e.clientX > window.innerWidth - 200 && e.clientY > window.innerHeight - 100;
    hint.classList.toggle('show', near);
  });

  // 暴露 API 供除錯
  window.FotoSoftAdmin = { open, close };
})();

/* ============================================================
 * insights-admin.js — 視丘尖端洞察「隱藏管理系統」
 * ------------------------------------------------------------
 * 觸發：Cmd + Shift + E   (Mac) / Ctrl + Shift + E (Win/Linux)
 * 功能：
 *   1. 開啟浮動管理面板（覆蓋於 insights.html / insight-detail.html）
 *   2. 左側列表：所有文章，可新增/刪除/搜尋，拖曳排序
 *   3. 右側表單：標題、副標、作者、日期、封面、分類、標籤、摘要、精選
 *   4. 內容 Blocks：段落 / 標題 / 引言 / 圖片 / 分隔線
 *      - 可拖曳排序、上下移動、隨處插入
 *      - 圖片可貼 URL 或選擇本機檔（預設填入 /image/insight/檔名）
 *   5. 匯出 JSON（insights-data.json） / 匯入 JSON / 重置
 *
 * 依賴：window.InsightsStore (js/insights-data.js)
 * ============================================================ */

(function () {
  'use strict';

  if (typeof window.InsightsStore === 'undefined') {
    console.warn('[insights-admin] 找不到 InsightsStore，請先載入 js/insights-data.js');
    return;
  }

  const STYLE_ID = 'fs-insights-admin-style';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #fsi-admin-root, #fsi-admin-root * { box-sizing: border-box; }
      #fsi-admin-root {
        position: fixed; inset: 0; z-index: 99999;
        font-family: "Noto Sans TC", system-ui, -apple-system, sans-serif;
        color: #212529;
      }
      #fsi-admin-root .fsi-backdrop {
        position: absolute; inset: 0;
        background: rgba(15, 23, 42, 0.55);
        backdrop-filter: blur(6px);
      }
      #fsi-admin-root .fsi-panel {
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: min(1280px, 96vw); height: min(90vh, 960px);
        background: #fff; border-radius: 14px;
        box-shadow: 0 40px 80px -20px rgba(0,0,0,0.35);
        display: flex; overflow: hidden;
      }
      #fsi-admin-root .fsi-side {
        width: 320px; border-right: 1px solid #E9ECEF;
        display: flex; flex-direction: column; background: #F8F9FA;
      }
      #fsi-admin-root .fsi-side-head { padding: 20px 20px 14px; border-bottom: 1px solid #E9ECEF; }
      #fsi-admin-root .fsi-side-title { font-family: "Noto Serif TC", serif; font-size: 20px; font-weight: 700; margin: 0 0 4px; }
      #fsi-admin-root .fsi-side-sub { font-size: 11px; color: #6C757D; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; }
      #fsi-admin-root .fsi-search {
        margin: 12px 20px; padding: 10px 12px;
        border: 1px solid #DEE2E6; border-radius: 8px;
        background: #fff; font-size: 13px; outline: none;
      }
      #fsi-admin-root .fsi-search:focus { border-color: #212529; }
      #fsi-admin-root .fsi-list { flex: 1; overflow-y: auto; padding: 4px 12px 12px; }
      #fsi-admin-root .fsi-list-item {
        display: flex; gap: 10px; align-items: center;
        padding: 8px; margin-bottom: 4px; border-radius: 8px;
        cursor: pointer; transition: background 0.15s;
      }
      #fsi-admin-root .fsi-list-item:hover { background: #E9ECEF; }
      #fsi-admin-root .fsi-list-item.active { background: #212529; color: #fff; }
      #fsi-admin-root .fsi-list-item.active .fsi-list-sub { color: #ADB5BD; }
      #fsi-admin-root .fsi-list-item.dragging { opacity: 0.35; }
      #fsi-admin-root .fsi-list-item.drop-above { box-shadow: inset 0 2px 0 0 #212529; }
      #fsi-admin-root .fsi-list-item.drop-below { box-shadow: inset 0 -2px 0 0 #212529; }
      #fsi-admin-root .fsi-list-thumb {
        width: 48px; height: 48px; border-radius: 6px;
        background: #DEE2E6 center/cover no-repeat; flex-shrink: 0;
      }
      #fsi-admin-root .fsi-list-text { min-width: 0; flex: 1; }
      #fsi-admin-root .fsi-list-title { font-size: 13px; font-weight: 500; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      #fsi-admin-root .fsi-list-sub { font-size: 11px; color: #6C757D; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      #fsi-admin-root .fsi-list-star { font-size: 12px; color: #f59e0b; }
      #fsi-admin-root .fsi-list-grip { color: #ADB5BD; cursor: grab; padding: 2px; font-size: 14px; }
      #fsi-admin-root .fsi-list-grip:active { cursor: grabbing; }

      #fsi-admin-root .fsi-side-foot { padding: 12px 20px; border-top: 1px solid #E9ECEF; display: flex; flex-direction: column; gap: 8px; }
      #fsi-admin-root .fsi-btn { padding: 9px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: 1px solid transparent; display: inline-flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s; }
      #fsi-admin-root .fsi-btn-primary { background: #212529; color: #fff; }
      #fsi-admin-root .fsi-btn-primary:hover { background: #000; }
      #fsi-admin-root .fsi-btn-ghost { background: transparent; color: #212529; border-color: #DEE2E6; }
      #fsi-admin-root .fsi-btn-ghost:hover { background: #E9ECEF; }
      #fsi-admin-root .fsi-btn-danger { background: #dc2626; color: #fff; }
      #fsi-admin-root .fsi-btn-danger:hover { background: #b91c1c; }
      #fsi-admin-root .fsi-btn-sm { padding: 6px 10px; font-size: 12px; }

      #fsi-admin-root .fsi-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
      #fsi-admin-root .fsi-main-head { padding: 16px 24px; border-bottom: 1px solid #E9ECEF; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      #fsi-admin-root .fsi-main-title { font-family: "Noto Serif TC", serif; font-size: 18px; font-weight: 700; margin: 0; }
      #fsi-admin-root .fsi-close { width: 34px; height: 34px; border-radius: 50%; border: 1px solid #DEE2E6; background: #fff; cursor: pointer; font-size: 16px; color: #6C757D; display: inline-flex; align-items: center; justify-content: center; }
      #fsi-admin-root .fsi-close:hover { background: #F8F9FA; color: #212529; }
      #fsi-admin-root .fsi-form { flex: 1; overflow-y: auto; padding: 20px 24px 24px; }
      #fsi-admin-root .fsi-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ADB5BD; text-align: center; padding: 40px; }
      #fsi-admin-root .fsi-empty h3 { font-family: "Noto Serif TC", serif; font-size: 22px; color: #6C757D; margin: 12px 0 6px; }
      #fsi-admin-root .fsi-empty p { margin: 0; font-size: 13px; }

      #fsi-admin-root .fsi-field { margin-bottom: 18px; }
      #fsi-admin-root .fsi-label { display: block; font-size: 12px; font-weight: 600; color: #495057; margin-bottom: 6px; letter-spacing: 0.05em; }
      #fsi-admin-root .fsi-input, #fsi-admin-root .fsi-textarea, #fsi-admin-root .fsi-select {
        width: 100%; padding: 9px 12px; border: 1px solid #DEE2E6;
        border-radius: 8px; font-size: 13px; font-family: inherit;
        outline: none; background: #fff; color: #212529;
      }
      #fsi-admin-root .fsi-input:focus, #fsi-admin-root .fsi-textarea:focus, #fsi-admin-root .fsi-select:focus { border-color: #212529; }
      #fsi-admin-root .fsi-textarea { min-height: 80px; resize: vertical; line-height: 1.7; }
      #fsi-admin-root .fsi-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      #fsi-admin-root .fsi-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
      #fsi-admin-root .fsi-cover-preview {
        width: 100%; aspect-ratio: 3/2; border-radius: 8px;
        background: #F8F9FA center/cover no-repeat;
        border: 1px dashed #DEE2E6; margin-bottom: 8px;
        display: flex; align-items: center; justify-content: center;
        color: #ADB5BD; font-size: 12px;
      }
      #fsi-admin-root .fsi-image-row { display: flex; gap: 8px; align-items: center; }
      #fsi-admin-root .fsi-image-row .fsi-input { flex: 1; }
      #fsi-admin-root .fsi-file-btn { padding: 9px 14px; border-radius: 8px; font-size: 12px; background: #F8F9FA; border: 1px solid #DEE2E6; color: #495057; cursor: pointer; white-space: nowrap; }
      #fsi-admin-root .fsi-file-btn:hover { background: #E9ECEF; }

      #fsi-admin-root .fsi-cat-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
      #fsi-admin-root .fsi-cat-chip { padding: 5px 10px; border-radius: 999px; font-size: 11px; border: 1px solid #DEE2E6; cursor: pointer; user-select: none; color: #6C757D; background: #fff; transition: all 0.15s; }
      #fsi-admin-root .fsi-cat-chip.on { background: #212529; color: #fff; border-color: #212529; }

      /* Blocks 編輯區 */
      #fsi-admin-root .fsi-blocks {
        border: 1px solid #DEE2E6; border-radius: 10px;
        padding: 10px; background: #FAFAFA;
      }
      #fsi-admin-root .fsi-block {
        background: #fff; border: 1px solid #E9ECEF; border-radius: 8px;
        padding: 10px; margin-bottom: 8px; position: relative;
        transition: box-shadow 0.15s;
      }
      #fsi-admin-root .fsi-block.dragging { opacity: 0.35; }
      #fsi-admin-root .fsi-block.drop-above { box-shadow: inset 0 2px 0 0 #212529; }
      #fsi-admin-root .fsi-block.drop-below { box-shadow: inset 0 -2px 0 0 #212529; }
      #fsi-admin-root .fsi-block-head {
        display: flex; align-items: center; gap: 8px;
        font-size: 11px; color: #6C757D; margin-bottom: 6px;
      }
      #fsi-admin-root .fsi-block-type {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 2px 8px; border-radius: 999px;
        background: #E9ECEF; color: #495057; font-weight: 600;
        letter-spacing: 0.06em; text-transform: uppercase;
      }
      #fsi-admin-root .fsi-block-grip { color: #ADB5BD; cursor: grab; padding: 2px 4px; font-size: 14px; user-select: none; }
      #fsi-admin-root .fsi-block-grip:active { cursor: grabbing; }
      #fsi-admin-root .fsi-block-actions { margin-left: auto; display: flex; gap: 4px; }
      #fsi-admin-root .fsi-block-actions button {
        border: 1px solid #DEE2E6; background: #fff; color: #6C757D;
        width: 26px; height: 26px; border-radius: 6px; cursor: pointer;
        font-size: 12px; display: inline-flex; align-items: center; justify-content: center;
      }
      #fsi-admin-root .fsi-block-actions button:hover { background: #F8F9FA; color: #212529; }
      #fsi-admin-root .fsi-block-actions button.danger:hover { background: #FEE2E2; color: #dc2626; border-color: #FCA5A5; }
      #fsi-admin-root .fsi-block-body input[type="text"],
      #fsi-admin-root .fsi-block-body textarea {
        width: 100%; padding: 8px 10px; border: 1px solid #E9ECEF;
        border-radius: 6px; font-size: 13px; font-family: inherit;
        outline: none; background: #fff; color: #212529; margin-bottom: 6px;
      }
      #fsi-admin-root .fsi-block-body input[type="text"]:focus,
      #fsi-admin-root .fsi-block-body textarea:focus { border-color: #212529; }
      #fsi-admin-root .fsi-block-body textarea { min-height: 80px; resize: vertical; line-height: 1.75; }
      #fsi-admin-root .fsi-block-body .fsi-img-preview {
        width: 100%; max-height: 220px; object-fit: contain;
        background: #F8F9FA; border-radius: 6px; margin: 4px 0 6px;
        display: block;
      }
      #fsi-admin-root .fsi-block-body .fsi-divider-hint {
        text-align: center; color: #ADB5BD; font-size: 12px; padding: 8px 0;
        letter-spacing: 0.3em;
      }
      #fsi-admin-root .fsi-block-inserter {
        display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 4px 2px;
        justify-content: center; border-top: 1px dashed #E9ECEF; margin-top: 4px;
      }
      #fsi-admin-root .fsi-block-inserter button {
        padding: 6px 12px; border-radius: 999px; font-size: 12px;
        border: 1px solid #DEE2E6; background: #fff; color: #495057;
        cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
      }
      #fsi-admin-root .fsi-block-inserter button:hover { background: #212529; color: #fff; border-color: #212529; }

      #fsi-admin-root .fsi-toolbar { display: flex; gap: 8px; padding: 14px 24px; border-top: 1px solid #E9ECEF; background: #F8F9FA; align-items: center; }
      #fsi-admin-root .fsi-toolbar-spacer { flex: 1; }
      #fsi-admin-root .fsi-toggle { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #495057; cursor: pointer; }
      #fsi-admin-root .fsi-toggle input { accent-color: #212529; }

      #fsi-admin-root .fsi-toast {
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
        padding: 12px 20px; background: #212529; color: #fff; border-radius: 8px;
        font-size: 13px; z-index: 100000; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: fsi-toast-in 0.25s ease-out;
      }
      @keyframes fsi-toast-in { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }

      #fsi-admin-root .fsi-dialog-backdrop {
        position: absolute; inset: 0; background: rgba(15, 23, 42, 0.24);
        display: flex; align-items: center; justify-content: center; z-index: 100001;
      }
      #fsi-admin-root .fsi-dialog {
        width: min(460px, calc(100vw - 32px));
        background: #fff; border-radius: 16px;
        box-shadow: 0 30px 80px -28px rgba(0,0,0,0.35); overflow: hidden;
      }
      #fsi-admin-root .fsi-dialog-body {
        padding: 24px 26px 20px; font-size: 18px; line-height: 1.7; color: #212529;
      }
      #fsi-admin-root .fsi-dialog-actions {
        display: flex; justify-content: flex-end; gap: 10px;
        padding: 14px 18px 18px; border-top: 1px solid #E9ECEF;
      }

      #fsi-admin-hint {
        position: fixed; bottom: 12px; right: 12px; z-index: 99998;
        padding: 6px 10px; border-radius: 6px; background: rgba(33,37,41,0.7);
        color: #fff; font-size: 10px; letter-spacing: 0.1em;
        font-family: "Noto Sans TC", sans-serif; pointer-events: none;
        opacity: 0; transition: opacity 0.3s;
      }
      #fsi-admin-hint.show { opacity: 1; }

      @media (max-width: 900px) {
        #fsi-admin-root .fsi-panel { width: 100vw; height: 100vh; border-radius: 0; flex-direction: column; }
        #fsi-admin-root .fsi-side { width: 100%; height: 40%; border-right: none; border-bottom: 1px solid #E9ECEF; }
        #fsi-admin-root .fsi-row, #fsi-admin-root .fsi-row-3 { grid-template-columns: 1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ---------- State ---------- */
  const DRAFT_STORAGE_KEY = 'FOTOSOFT_INSIGHTS_ADMIN_DRAFT_V1';
  let rootEl = null;
  let selectedId = null;
  let searchTerm = '';
  let dirtyDraft = null;
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

  function showSaveDiscardDialog(message) {
    return new Promise(resolve => {
      if (!rootEl) {
        resolve('discard');
        return;
      }
      const wrap = document.createElement('div');
      wrap.className = 'fsi-dialog-backdrop';
      wrap.innerHTML = '' +
        '<div class="fsi-dialog" role="alertdialog" aria-modal="true" aria-labelledby="fsi-dialog-title">' +
          '<div class="fsi-dialog-body" id="fsi-dialog-title">' + escapeHtml(message || '尚有未儲存的變更，是否繼續？') + '</div>' +
          '<div class="fsi-dialog-actions">' +
            '<button class="fsi-btn fsi-btn-ghost fsi-btn-sm" data-dialog-action="discard">捨棄</button>' +
            '<button class="fsi-btn fsi-btn-primary fsi-btn-sm" data-dialog-action="save">儲存</button>' +
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

  async function resolveUnsavedBeforeContinue(message) {
    if (!dirtyDraft) return true;
    const action = await showSaveDiscardDialog(message || '尚有未儲存的變更，是否繼續？');
    if (action === 'save') return saveDraft();
    discardDirtyDraft();
    return true;
  }

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'fsi-toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  /* ---------- Open / Close ---------- */
  function open() {
    if (rootEl) return;
    const restored = !dirtyDraft && restoreDraftState();
    rootEl = document.createElement('div');
    rootEl.id = 'fsi-admin-root';
    document.body.appendChild(rootEl);
    if (!restored) {
      const all = InsightsStore.getAll();
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

  /* ---------- Render ---------- */
  function render() {
    if (!rootEl) return;

    // 保留滾動位置，避免每次 render 都跳回頂端
    const prevForm = rootEl.querySelector('.fsi-form');
    const prevList = rootEl.querySelector('.fsi-list');
    const savedFormScroll = prevForm ? prevForm.scrollTop : 0;
    const savedListScroll = prevList ? prevList.scrollTop : 0;
    const activeEl = document.activeElement;
    const activeMarker = activeEl && rootEl.contains(activeEl)
      ? {
          field: activeEl.getAttribute('data-block-field') || activeEl.getAttribute('data-field') || activeEl.getAttribute('data-role'),
          idx: activeEl.getAttribute('data-idx'),
          selStart: typeof activeEl.selectionStart === 'number' ? activeEl.selectionStart : null,
          selEnd: typeof activeEl.selectionEnd === 'number' ? activeEl.selectionEnd : null
        }
      : null;

    const all = InsightsStore.getAll();
    const filtered = searchTerm
      ? all.filter(p =>
          (p.title + ' ' + (p.subtitle || '') + ' ' + (p.author || '') + ' ' + (p.tags || []).join(' '))
            .toLowerCase().includes(searchTerm.toLowerCase())
        )
      : all;
    const current = all.find(p => p.id === selectedId) || null;
    const draft = dirtyDraft || current;

    rootEl.innerHTML = `
      <div class="fsi-backdrop" data-role="close"></div>
      <div class="fsi-panel" role="dialog" aria-label="尖端洞察管理">
        <aside class="fsi-side">
          <div class="fsi-side-head">
            <h2 class="fsi-side-title">尖端洞察管理</h2>
            <p class="fsi-side-sub">Insights Admin</p>
          </div>
          <input class="fsi-search" data-role="search" placeholder="搜尋標題／作者／標籤…" value="${escapeAttr(searchTerm)}">
          <div class="fsi-list" data-role="list">
            ${filtered.map(p => renderListItem(p)).join('') || '<p style="padding:20px;color:#ADB5BD;font-size:12px;text-align:center;">找不到符合的文章</p>'}
          </div>
          <div class="fsi-side-foot">
            <button class="fsi-btn fsi-btn-primary" data-role="new"><span>＋</span> 新增文章</button>
            <div style="display:flex;gap:6px;">
              <button class="fsi-btn fsi-btn-ghost fsi-btn-sm" data-role="export" style="flex:1;">匯出 JSON</button>
              <button class="fsi-btn fsi-btn-ghost fsi-btn-sm" data-role="import" style="flex:1;">匯入 JSON</button>
            </div>
            <p style="margin:6px 2px 0;font-size:11px;line-height:1.6;color:#6C757D;">編輯資料先儲存在瀏覽器（localStorage），不會自動寫入網站檔案。若要落地保存，請按「匯出 JSON」。</p>
            <button class="fsi-btn fsi-btn-ghost fsi-btn-sm" data-role="reset" style="color:#dc2626;border-color:#fecaca;">重置為預設資料</button>
          </div>
        </aside>
        <main class="fsi-main">
          ${draft ? renderForm(draft, !current) : renderEmpty()}
        </main>
      </div>
    `;
    bindEvents();

    // 還原滾動位置
    const newForm = rootEl.querySelector('.fsi-form');
    const newList = rootEl.querySelector('.fsi-list');
    if (newForm) newForm.scrollTop = savedFormScroll;
    if (newList) newList.scrollTop = savedListScroll;

    // 嘗試把焦點還給剛才在編輯的欄位
    if (activeMarker && (activeMarker.field || activeMarker.idx)) {
      let selector = '';
      if (activeMarker.field && activeMarker.idx != null) {
        selector = '[data-block-field="' + activeMarker.field + '"][data-idx="' + activeMarker.idx + '"]';
      } else if (activeMarker.field) {
        selector = '[data-field="' + activeMarker.field + '"], [data-role="' + activeMarker.field + '"]';
      }
      if (selector) {
        const el = rootEl.querySelector(selector);
        if (el && typeof el.focus === 'function') {
          try { el.focus({ preventScroll: true }); } catch (_) { el.focus(); }
          if (activeMarker.selStart != null && typeof el.setSelectionRange === 'function') {
            try { el.setSelectionRange(activeMarker.selStart, activeMarker.selEnd != null ? activeMarker.selEnd : activeMarker.selStart); } catch (_) {}
          }
        }
      }
    }
  }

  function renderListItem(p) {
    const active = p.id === selectedId ? 'active' : '';
    const cover = InsightsStore.coverOf(p);
    const bg = cover ? `background-image:url('${escapeAttr(cover)}')` : '';
    return `
      <div class="fsi-list-item ${active}" data-role="select" data-id="${escapeAttr(p.id)}" draggable="true">
        <span class="fsi-list-grip" title="拖曳排序">⋮⋮</span>
        <div class="fsi-list-thumb" style="${bg}"></div>
        <div class="fsi-list-text">
          <p class="fsi-list-title">${escapeHtml(p.title)}</p>
          <p class="fsi-list-sub">${escapeHtml(p.publishedDate || '')} · ${escapeHtml(p.author || '—')}</p>
        </div>
        ${p.featured ? '<span class="fsi-list-star" title="首頁精選">★</span>' : ''}
      </div>
    `;
  }

  function renderEmpty() {
    return `
      <div class="fsi-empty">
        <div style="font-size:40px;">📝</div>
        <h3>尚無文章</h3>
        <p>點擊左下角「新增文章」開始撰寫第一篇尖端洞察。</p>
      </div>
    `;
  }

  function renderForm(p, isNew) {
    const allCats = InsightsStore.getAllCategories();
    const currentCats = new Set(p.categories || []);
    const cover = p.coverImage || '';
    return `
      <div class="fsi-main-head">
        <h2 class="fsi-main-title">${isNew ? '新增文章' : '編輯文章'}</h2>
        <button class="fsi-close" data-role="close" title="關閉 (Esc)">×</button>
      </div>
      <div class="fsi-form">
        <div class="fsi-field">
          <label class="fsi-label">封面圖（用於文章卡片、詳細頁 Hero、首頁精選）</label>
          <div class="fsi-cover-preview" style="${cover ? `background-image:url('${escapeAttr(cover)}')` : ''}">
            ${cover ? '' : '未設定封面（會自動套用圖庫）'}
          </div>
          <div class="fsi-image-row">
            <input class="fsi-input" data-field="coverImage" placeholder="/image/insight/檔名.webp 或外部網址" value="${escapeAttr(cover)}">
            <label class="fsi-file-btn">
              選擇檔案
              <input type="file" accept="image/*" hidden data-role="upload-cover">
            </label>
          </div>
          <p style="font-size:11px;color:#ADB5BD;margin:6px 0 0;">封面圖片請歸檔於 <strong>image/insight</strong>，選擇檔案後會自動填入對應路徑。</p>
        </div>

        <div class="fsi-field">
          <label class="fsi-label">標題 *</label>
          <input class="fsi-input" data-field="title" value="${escapeAttr(p.title)}" required>
        </div>

        <div class="fsi-row">
          <div class="fsi-field">
            <label class="fsi-label">副標</label>
            <input class="fsi-input" data-field="subtitle" value="${escapeAttr(p.subtitle || '')}">
          </div>
          <div class="fsi-field">
            <label class="fsi-label">作者</label>
            <input class="fsi-input" data-field="author" value="${escapeAttr(p.author || '')}">
          </div>
        </div>

        <div class="fsi-row-3">
          <div class="fsi-field">
            <label class="fsi-label">發布日期</label>
            <input class="fsi-input" data-field="publishedDate" type="date" value="${escapeAttr(p.publishedDate || '')}">
          </div>
          <div class="fsi-field">
            <label class="fsi-label">標籤（逗號分隔）</label>
            <input class="fsi-input" data-field="tags" value="${escapeAttr((p.tags || []).join(', '))}">
          </div>
          <div class="fsi-field" style="display:flex;align-items:flex-end;">
            <label class="fsi-toggle">
              <input type="checkbox" data-field="featured" ${p.featured ? 'checked' : ''}>
              置頂到首頁「尖端洞察」精選
            </label>
          </div>
        </div>

        <div class="fsi-field">
          <label class="fsi-label">分類（可複選）</label>
          <div class="fsi-cat-list">
            ${allCats.map(c => `
              <span class="fsi-cat-chip ${currentCats.has(c) ? 'on' : ''}" data-role="toggle-cat" data-cat="${escapeAttr(c)}">${escapeHtml(c)}</span>
            `).join('')}
            <span class="fsi-cat-chip" data-role="add-cat" style="border-style:dashed;">＋ 新分類</span>
          </div>
        </div>

        <div class="fsi-field">
          <label class="fsi-label">摘要（卡片與詳細頁前導；留空會自動抓內文首段）</label>
          <textarea class="fsi-textarea" data-field="summary" placeholder="一段簡短的摘要…">${escapeHtml(p.summary || '')}</textarea>
        </div>

        <div class="fsi-field">
          <label class="fsi-label">內文區塊（可自由穿插文字與圖片，拖曳排序）</label>
          <div class="fsi-blocks" data-role="blocks">
            ${(p.blocks || []).map((b, i) => renderBlock(b, i)).join('')}
            ${renderInserter((p.blocks || []).length)}
          </div>
        </div>
      </div>

      <div class="fsi-toolbar">
        ${!isNew ? '<button class="fsi-btn fsi-btn-danger fsi-btn-sm" data-role="delete">刪除此文章</button>' : ''}
        <div class="fsi-toolbar-spacer"></div>
        ${!isNew ? `<a class="fsi-btn fsi-btn-ghost fsi-btn-sm" href="insight-detail.html?id=${encodeURIComponent(p.id)}" target="_blank">預覽 ↗</a>` : ''}
        <button class="fsi-btn fsi-btn-ghost fsi-btn-sm" data-role="cancel">取消</button>
        <button class="fsi-btn fsi-btn-primary fsi-btn-sm" data-role="save">儲存</button>
      </div>
    `;
  }

  const BLOCK_LABELS = {
    heading:   '標題',
    paragraph: '段落',
    quote:     '引言',
    image:     '圖片',
    divider:   '分隔線'
  };

  function renderTextSwitcher(b, i) {
    return `
      <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;">
        <span style="font-size:11px;color:#6C757D;letter-spacing:0.06em;flex-shrink:0;">文字類型</span>
        <select data-role="switch-text-type" data-idx="${i}" class="fsi-input" style="max-width:220px;">
          <option value="paragraph" ${b.type === 'paragraph' ? 'selected' : ''}>內文（段落）</option>
          <option value="heading-2" ${b.type === 'heading' && (b.level || 2) === 2 ? 'selected' : ''}>H2 · 章節標題</option>
          <option value="heading-3" ${b.type === 'heading' && b.level === 3 ? 'selected' : ''}>H3 · 小節標題</option>
          <option value="quote" ${b.type === 'quote' ? 'selected' : ''}>引言</option>
        </select>
      </div>
    `;
  }

  function renderTextToolbar(i) {
    return `
      <div class="fsi-para-toolbar" style="display:flex;gap:6px;margin-bottom:6px;flex-wrap:wrap;">
        <button type="button" data-role="insert-img-at-cursor" data-idx="${i}" title="在游標閃爍處插入圖片，並自動將游標後方文字切成下一段"
          style="padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid #DEE2E6;background:#fff;color:#495057;display:inline-flex;align-items:center;gap:5px;">
          <span style="font-size:12px;">🖼</span> 在游標處插入圖片
        </button>
        <button type="button" data-role="split-at-cursor" data-idx="${i}" title="在游標閃爍處將文字切成兩段"
          style="padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid #DEE2E6;background:#fff;color:#495057;display:inline-flex;align-items:center;gap:5px;">
          <span style="font-size:12px;">✂</span> 在游標處切分文字
        </button>
      </div>
    `;
  }

  function renderBlock(b, i) {
    const label = BLOCK_LABELS[b.type] || b.type;
    let body = '';
    if (b.type === 'heading') {
      body = renderTextSwitcher(b, i) + renderTextToolbar(i) + `
        <input type="text" data-block-field="text" data-idx="${i}" value="${escapeAttr(b.text || '')}" placeholder="標題文字…">
      `;
    } else if (b.type === 'paragraph') {
      body = renderTextSwitcher(b, i) + renderTextToolbar(i) + `
        <textarea data-block-field="text" data-idx="${i}" placeholder="段落內容… （可用空行 \\n\\n 分段）">${escapeHtml(b.text || '')}</textarea>
      `;
    } else if (b.type === 'quote') {
      body = renderTextSwitcher(b, i) + renderTextToolbar(i) + `
        <textarea data-block-field="text" data-idx="${i}" placeholder="引言內容…">${escapeHtml(b.text || '')}</textarea>
        <input type="text" data-block-field="cite" data-idx="${i}" value="${escapeAttr(b.cite || '')}" placeholder="出處／作者（選填）">
      `;
    } else if (b.type === 'image') {
      const size = b.size === 'small' ? 'small' : 'large';
      body = `
        <div class="fsi-img-size-row" style="display:flex;gap:6px;margin-bottom:8px;align-items:center;">
          <span style="font-size:11px;color:#6C757D;letter-spacing:0.06em;">尺寸</span>
          <button type="button" data-role="set-img-size" data-idx="${i}" data-size="large"
            style="padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid ${size === 'large' ? '#212529' : '#DEE2E6'};background:${size === 'large' ? '#212529' : '#fff'};color:${size === 'large' ? '#fff' : '#495057'};">大圖（滿版）</button>
          <button type="button" data-role="set-img-size" data-idx="${i}" data-size="small"
            style="padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid ${size === 'small' ? '#212529' : '#DEE2E6'};background:${size === 'small' ? '#212529' : '#fff'};color:${size === 'small' ? '#fff' : '#495057'};">縮圖（≈ 1/3）</button>
        </div>
        ${b.src ? `<img class="fsi-img-preview" src="${escapeAttr(b.src)}" alt="" style="${size === 'small' ? 'max-width:33%;margin:4px auto 6px;' : ''}">` : `<div class="fsi-divider-hint">— 尚未設定圖片 —</div>`}
        <div class="fsi-image-row">
          <input type="text" data-block-field="src" data-idx="${i}" value="${escapeAttr(b.src || '')}" placeholder="/image/insight/檔名.webp 或外部網址">
          <label class="fsi-file-btn">
            選擇檔案
            <input type="file" accept="image/*" multiple hidden data-role="upload-block-image" data-idx="${i}">
          </label>
        </div>
        <p style="font-size:11px;color:#ADB5BD;margin:6px 0 0;">圖片請歸檔於 <strong>image/insight</strong>；可一次多選，系統會自動建立多個圖片區塊。</p>
        <input type="text" data-block-field="caption" data-idx="${i}" value="${escapeAttr(b.caption || '')}" placeholder="圖說（選填）">
        <input type="text" data-block-field="alt" data-idx="${i}" value="${escapeAttr(b.alt || '')}" placeholder="替代文字 alt（選填，SEO 用）">
      `;
    } else if (b.type === 'divider') {
      body = `<div class="fsi-divider-hint">— — — 分 隔 線 — — —</div>`;
    }
    return `
      <div class="fsi-block" data-role="block" data-idx="${i}" draggable="true">
        <div class="fsi-block-head">
          <span class="fsi-block-grip" title="拖曳排序">⋮⋮</span>
          <span class="fsi-block-type">${escapeHtml(label)}</span>
          <div class="fsi-block-actions">
            <button data-role="move-up" data-idx="${i}" title="上移">▲</button>
            <button data-role="move-down" data-idx="${i}" title="下移">▼</button>
            <button data-role="dup-block" data-idx="${i}" title="複製">⎘</button>
            <button data-role="remove-block" data-idx="${i}" title="刪除" class="danger">×</button>
          </div>
        </div>
        <div class="fsi-block-body">${body}</div>
        ${renderInserter(i + 1)}
      </div>
    `;
  }

  function renderInserter(insertAt) {
    return `
      <div class="fsi-block-inserter">
        <button data-role="insert-block" data-type="paragraph" data-at="${insertAt}">＋ 文字</button>
        <button data-role="insert-block" data-type="image" data-at="${insertAt}">＋ 圖片</button>
        <button data-role="insert-block" data-type="divider" data-at="${insertAt}">＋ 分隔線</button>
      </div>
    `;
  }

  /* ---------- Events ---------- */
  function bindEvents() {
    rootEl.querySelectorAll('[data-role="close"]').forEach(el => el.addEventListener('click', close));

    const search = rootEl.querySelector('[data-role="search"]');
    if (search) {
      search.addEventListener('input', e => {
        searchTerm = e.target.value;
        persistDraftState();
        const list = rootEl.querySelector('[data-role="list"]');
        const filtered = InsightsStore.getAll().filter(p =>
          (p.title + ' ' + (p.subtitle || '') + ' ' + (p.author || '') + ' ' + (p.tags || []).join(' '))
            .toLowerCase().includes(searchTerm.toLowerCase())
        );
        list.innerHTML = filtered.map(p => renderListItem(p)).join('') ||
          '<p style="padding:20px;color:#ADB5BD;font-size:12px;text-align:center;">找不到符合的文章</p>';
        bindListItems();
      });
    }
    bindListItems();

    rootEl.querySelector('[data-role="new"]')?.addEventListener('click', async () => {
      if (!(await resolveUnsavedBeforeContinue('尚有未儲存的變更，建立新文章前是否先儲存？'))) return;
      selectedId = null;
      dirtyDraft = {
        id: '', title: '', subtitle: '', author: '',
        publishedDate: new Date().toISOString().slice(0, 10),
        coverImage: '', categories: [], tags: [], summary: '',
        featured: false,
        blocks: [{ type: 'paragraph', text: '' }]
      };
      persistDraftState();
      render();
    });

    rootEl.querySelector('[data-role="export"]')?.addEventListener('click', async () => {
      if (!(await resolveUnsavedBeforeContinue('匯出前有未儲存的變更，是否先儲存？'))) return;
      exportJSON();
    });
    rootEl.querySelector('[data-role="import"]')?.addEventListener('click', async () => {
      if (!(await resolveUnsavedBeforeContinue('匯入前有未儲存的變更，是否先儲存？'))) return;
      importJSON();
    });
    rootEl.querySelector('[data-role="reset"]')?.addEventListener('click', async () => {
      if (!(await resolveUnsavedBeforeContinue('重置前有未儲存的變更，是否先儲存？'))) return;
      if (confirm('確定重置為預設資料？當前所有變更會遺失。')) {
        InsightsStore.reset();
        discardDirtyDraft();
        selectedId = InsightsStore.getAll()[0]?.id || null;
        render();
        toast('已重置為預設資料');
      }
    });

    // 表單欄位
    rootEl.querySelectorAll('[data-field]').forEach(el => {
      el.addEventListener('input', () => {
        ensureDraft();
        const f = el.getAttribute('data-field');
        if (f === 'featured') dirtyDraft.featured = el.checked;
        else if (f === 'tags') dirtyDraft.tags = el.value.split(',').map(s => s.trim()).filter(Boolean);
        else dirtyDraft[f] = el.value;
        persistDraftState();
        if (f === 'coverImage') {
          const pv = rootEl.querySelector('.fsi-cover-preview');
          if (pv) {
            pv.style.backgroundImage = el.value ? `url('${el.value}')` : '';
            pv.textContent = el.value ? '' : '未設定封面（會自動套用圖庫）';
          }
        }
      });
    });

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
    rootEl.querySelector('[data-role="add-cat"]')?.addEventListener('click', () => {
      const name = prompt('新分類名稱：');
      if (!name) return;
      ensureDraft();
      dirtyDraft.categories = Array.from(new Set([...(dirtyDraft.categories || []), name.trim()]));
      persistDraftState();
      render();
    });

    // 封面上傳
    rootEl.querySelector('[data-role="upload-cover"]')?.addEventListener('change', e => {
      const file = e.target.files?.[0]; if (!file) return;
      ensureDraft();
      dirtyDraft.coverImage = insightImagePathFromFile(file);
      persistDraftState();
      toast('已設定封面路徑為 ' + dirtyDraft.coverImage);
      render();
    });

    // Blocks 欄位輸入
    rootEl.querySelectorAll('[data-block-field]').forEach(el => {
      el.addEventListener('input', () => {
        ensureDraft();
        const idx = Number(el.getAttribute('data-idx'));
        const field = el.getAttribute('data-block-field');
        if (!dirtyDraft.blocks[idx]) return;
        if (field === 'level') dirtyDraft.blocks[idx].level = Number(el.value) || 2;
        else dirtyDraft.blocks[idx][field] = el.value;
        persistDraftState();
      });
    });

    // 文字類型切換（段落 / 標題 / 引言）
    rootEl.querySelectorAll('[data-role="switch-text-type"]').forEach(el => {
      el.addEventListener('change', () => {
        ensureDraft();
        const idx = Number(el.getAttribute('data-idx'));
        const block = dirtyDraft.blocks[idx];
        if (!block) return;
        // 同步目前 DOM 的文字内容（避免未觸發 input 而遗失）
        const ta = rootEl.querySelector('[data-block-field="text"][data-idx="' + idx + '"]');
        if (ta) block.text = ta.value;
        const citeEl = rootEl.querySelector('[data-block-field="cite"][data-idx="' + idx + '"]');
        if (citeEl) block.cite = citeEl.value;
        const text = block.text || '';
        const value = el.value;
        if (value.indexOf('heading') === 0) {
          const level = value === 'heading-3' ? 3 : 2;
          dirtyDraft.blocks[idx] = { type: 'heading', level: level, text: text };
        } else if (value === 'quote') {
          dirtyDraft.blocks[idx] = { type: 'quote', text: text, cite: block.cite || '' };
        } else {
          dirtyDraft.blocks[idx] = { type: 'paragraph', text: text };
        }
        persistDraftState();
        render();
      });
    });

    // 在文字區塊游標處插入圖片：分割文字 + 中間插入圖片 block（支援 段落 / 標題 / 引言）
    rootEl.querySelectorAll('[data-role="insert-img-at-cursor"]').forEach(el => {
      // 在按鈕取走焦點前先記下游標位置
      el.addEventListener('mousedown', () => {
        const idx = Number(el.getAttribute('data-idx'));
        const field = rootEl.querySelector('[data-block-field="text"][data-idx="' + idx + '"]');
        if (field && typeof field.selectionStart === 'number') {
          el.dataset.pos = String(field.selectionStart);
        }
      });
      el.addEventListener('click', ev => {
        ev.preventDefault();
        ensureDraft();
        const idx = Number(el.getAttribute('data-idx'));
        const block = dirtyDraft.blocks[idx];
        if (!block || (block.type !== 'paragraph' && block.type !== 'heading' && block.type !== 'quote')) return;
        const field = rootEl.querySelector('[data-block-field="text"][data-idx="' + idx + '"]');
        const full = field ? field.value : (block.text || '');
        block.text = full;
        let pos = Number(el.dataset.pos);
        if (!Number.isFinite(pos)) pos = field && typeof field.selectionStart === 'number' ? field.selectionStart : full.length;
        pos = Math.max(0, Math.min(full.length, pos));
        const before = full.slice(0, pos);
        const after = full.slice(pos);
        block.text = before;
        const imgBlock = { type: 'image', src: '', caption: '', alt: '', size: 'large' };
        const afterBlock = makeAfterBlock(block, after);
        dirtyDraft.blocks.splice(idx + 1, 0, imgBlock, afterBlock);
        persistDraftState();
        render();
        setTimeout(() => {
          const newImgInput = rootEl.querySelector('input[data-block-field="src"][data-idx="' + (idx + 1) + '"]');
          if (newImgInput) { newImgInput.focus(); newImgInput.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
        }, 0);
      });
    });

    // 在文字區塊游標處切分文字：兩段同型別（標題→標題、段落→段落、引言→引言）
    rootEl.querySelectorAll('[data-role="split-at-cursor"]').forEach(el => {
      el.addEventListener('mousedown', () => {
        const idx = Number(el.getAttribute('data-idx'));
        const field = rootEl.querySelector('[data-block-field="text"][data-idx="' + idx + '"]');
        if (field && typeof field.selectionStart === 'number') el.dataset.pos = String(field.selectionStart);
      });
      el.addEventListener('click', ev => {
        ev.preventDefault();
        ensureDraft();
        const idx = Number(el.getAttribute('data-idx'));
        const block = dirtyDraft.blocks[idx];
        if (!block || (block.type !== 'paragraph' && block.type !== 'heading' && block.type !== 'quote')) return;
        const field = rootEl.querySelector('[data-block-field="text"][data-idx="' + idx + '"]');
        const full = field ? field.value : (block.text || '');
        block.text = full;
        let pos = Number(el.dataset.pos);
        if (!Number.isFinite(pos)) pos = field && typeof field.selectionStart === 'number' ? field.selectionStart : full.length;
        pos = Math.max(0, Math.min(full.length, pos));
        const before = full.slice(0, pos);
        const after = full.slice(pos);
        block.text = before;
        const afterBlock = makeAfterBlock(block, after);
        dirtyDraft.blocks.splice(idx + 1, 0, afterBlock);
        persistDraftState();
        render();
        setTimeout(() => {
          const newField = rootEl.querySelector('[data-block-field="text"][data-idx="' + (idx + 1) + '"]');
          if (newField) {
            newField.focus();
            try { newField.setSelectionRange(0, 0); } catch (_) {}
            newField.scrollIntoView({ block: 'center', behavior: 'smooth' });
          }
        }, 0);
      });
    });

    // Block 圖片尺寸切換（大圖 / 縮圖）
    rootEl.querySelectorAll('[data-role="set-img-size"]').forEach(el => {
      el.addEventListener('click', () => {
        ensureDraft();
        const idx = Number(el.getAttribute('data-idx'));
        const size = el.getAttribute('data-size') === 'small' ? 'small' : 'large';
        if (!dirtyDraft.blocks[idx]) return;
        dirtyDraft.blocks[idx].size = size;
        persistDraftState();
        render();
      });
    });

    // Block 圖片上傳
    rootEl.querySelectorAll('[data-role="upload-block-image"]').forEach(el => {
      el.addEventListener('change', e => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const idx = Number(el.getAttribute('data-idx'));
        ensureDraft();
        const current = dirtyDraft.blocks[idx];
        if (!current || current.type !== 'image') return;

        const first = files[0];
        current.src = insightImagePathFromFile(first);
        if (!current.caption) current.caption = first.name || '';

        const currentSize = current.size === 'small' ? 'small' : 'large';
        const extraBlocks = files.slice(1).map(file => ({
          type: 'image',
          src: insightImagePathFromFile(file),
          caption: file.name || '',
          alt: '',
          size: currentSize
        }));
        if (extraBlocks.length) {
          dirtyDraft.blocks.splice(idx + 1, 0, ...extraBlocks);
        }

        try { e.target.value = ''; } catch (_) {}
        persistDraftState();
        toast(files.length > 1
          ? '已新增 ' + files.length + ' 張圖片，路徑預設為 /image/insight/'
          : '已設定圖片路徑為 ' + current.src);
        render();
      });
    });

    // Block 動作：新增/刪除/複製/上下移
    rootEl.querySelectorAll('[data-role="insert-block"]').forEach(el => {
      el.addEventListener('click', () => {
        ensureDraft();
        const at = Number(el.getAttribute('data-at'));
        const type = el.getAttribute('data-type');
        const nb = newBlock(type);
        dirtyDraft.blocks.splice(at, 0, nb);
        persistDraftState();
        render();
      });
    });
    rootEl.querySelectorAll('[data-role="remove-block"]').forEach(el => {
      el.addEventListener('click', () => {
        ensureDraft();
        const idx = Number(el.getAttribute('data-idx'));
        dirtyDraft.blocks.splice(idx, 1);
        persistDraftState();
        render();
      });
    });
    rootEl.querySelectorAll('[data-role="dup-block"]').forEach(el => {
      el.addEventListener('click', () => {
        ensureDraft();
        const idx = Number(el.getAttribute('data-idx'));
        const copy = JSON.parse(JSON.stringify(dirtyDraft.blocks[idx]));
        dirtyDraft.blocks.splice(idx + 1, 0, copy);
        persistDraftState();
        render();
      });
    });
    rootEl.querySelectorAll('[data-role="move-up"]').forEach(el => {
      el.addEventListener('click', () => {
        ensureDraft();
        const i = Number(el.getAttribute('data-idx'));
        if (i <= 0) return;
        const arr = dirtyDraft.blocks;
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        persistDraftState();
        render();
      });
    });
    rootEl.querySelectorAll('[data-role="move-down"]').forEach(el => {
      el.addEventListener('click', () => {
        ensureDraft();
        const i = Number(el.getAttribute('data-idx'));
        const arr = dirtyDraft.blocks;
        if (i >= arr.length - 1) return;
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        persistDraftState();
        render();
      });
    });

    // Block 拖曳排序
    let dragBlockIdx = null;
    rootEl.querySelectorAll('[data-role="block"]').forEach(el => {
      el.addEventListener('dragstart', e => {
        dragBlockIdx = Number(el.getAttribute('data-idx'));
        el.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', String(dragBlockIdx)); } catch (_) {}
      });
      el.addEventListener('dragend', () => {
        el.classList.remove('dragging');
        rootEl.querySelectorAll('[data-role="block"]').forEach(x => x.classList.remove('drop-above', 'drop-below'));
      });
      el.addEventListener('dragover', e => {
        e.preventDefault();
        const rect = el.getBoundingClientRect();
        const before = (e.clientY - rect.top) < rect.height / 2;
        el.classList.toggle('drop-above', before);
        el.classList.toggle('drop-below', !before);
      });
      el.addEventListener('dragleave', () => el.classList.remove('drop-above', 'drop-below'));
      el.addEventListener('drop', e => {
        e.preventDefault();
        const targetIdx = Number(el.getAttribute('data-idx'));
        if (dragBlockIdx === null || dragBlockIdx === targetIdx) return;
        ensureDraft();
        const arr = dirtyDraft.blocks;
        const rect = el.getBoundingClientRect();
        const before = (e.clientY - rect.top) < rect.height / 2;
        const [moved] = arr.splice(dragBlockIdx, 1);
        let newIdx = targetIdx;
        if (dragBlockIdx < targetIdx) newIdx -= 1;
        arr.splice(before ? newIdx : newIdx + 1, 0, moved);
        dragBlockIdx = null;
        persistDraftState();
        render();
      });
    });

    // 底部按鈕
    rootEl.querySelector('[data-role="save"]')?.addEventListener('click', () => {
      if (!saveDraft()) return;
      render();
    });
    rootEl.querySelector('[data-role="cancel"]')?.addEventListener('click', async () => {
      if (!(await resolveUnsavedBeforeContinue('取消編輯前，是否先儲存目前變更？'))) return;
      render();
    });
    rootEl.querySelector('[data-role="delete"]')?.addEventListener('click', () => {
      if (!selectedId) return;
      if (!confirm('確定刪除這篇文章？此動作無法復原（但仍保留於已匯出的 JSON 檔）。')) return;
      InsightsStore.remove(selectedId);
      discardDirtyDraft();
      selectedId = InsightsStore.getAll()[0]?.id || null;
      render();
      toast('已刪除');
    });
  }

  function bindListItems() {
    let dragListId = null;
    rootEl.querySelectorAll('[data-role="select"]').forEach(el => {
      el.addEventListener('click', async () => {
        if (!(await resolveUnsavedBeforeContinue('尚有未儲存的變更，切換文章前是否先儲存？'))) return;
        selectedId = el.getAttribute('data-id');
        render();
      });
      // 拖曳排序（改變 createdAt 微調實現順序）
      el.addEventListener('dragstart', e => {
        dragListId = el.getAttribute('data-id');
        el.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', dragListId); } catch (_) {}
      });
      el.addEventListener('dragend', () => {
        el.classList.remove('dragging');
        rootEl.querySelectorAll('.fsi-list-item').forEach(x => x.classList.remove('drop-above', 'drop-below'));
      });
      el.addEventListener('dragover', e => {
        e.preventDefault();
        const rect = el.getBoundingClientRect();
        const before = (e.clientY - rect.top) < rect.height / 2;
        el.classList.toggle('drop-above', before);
        el.classList.toggle('drop-below', !before);
      });
      el.addEventListener('dragleave', () => el.classList.remove('drop-above', 'drop-below'));
      el.addEventListener('drop', e => {
        e.preventDefault();
        const targetId = el.getAttribute('data-id');
        if (!dragListId || dragListId === targetId) return;
        const rect = el.getBoundingClientRect();
        const before = (e.clientY - rect.top) < rect.height / 2;
        reorderList(dragListId, targetId, before);
        dragListId = null;
      });
    });
  }

  /* 透過覆蓋 publishedDate 微秒級調整達到排序（因 getAll 依日期新到舊排） */
  function reorderList(fromId, targetId, placeBefore) {
    const all = InsightsStore.getAll();
    const from = all.find(x => x.id === fromId);
    const target = all.find(x => x.id === targetId);
    if (!from || !target) return;
    // 直接用陣列重排 → 依新順序重寫 createdAt & publishedDate 排序權重（僅覆寫排序 tie-break 用的 createdAt）
    const filtered = all.filter(x => x.id !== fromId);
    const targetIdx = filtered.findIndex(x => x.id === targetId);
    const insertAt = placeBefore ? targetIdx : targetIdx + 1;
    filtered.splice(insertAt, 0, from);
    // 反向指派 createdAt（越前面越大）以維持新到舊排序
    const now = Date.now();
    filtered.forEach((item, i) => { item.createdAt = now - i; });
    // publishedDate 若都相同會被 createdAt 影響到 tie-break
    localStorage.setItem(InsightsStore.STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent(InsightsStore.EVENT_NAME));
    render();
  }

  function ensureDraft() {
    if (dirtyDraft) return;
    const cur = InsightsStore.getById(selectedId);
    dirtyDraft = cur ? JSON.parse(JSON.stringify(cur)) : null;
    persistDraftState();
  }

  function saveDraft() {
    if (!dirtyDraft) return true;
    if (!dirtyDraft.title || !dirtyDraft.title.trim()) { alert('請輸入文章標題'); return false; }
    const saved = InsightsStore.save(dirtyDraft);
    selectedId = saved.id;
    dirtyDraft = null;
    clearDraftState();
    toast('已儲存');
    return true;
  }

  function newBlock(type) {
    switch (type) {
      case 'heading':   return { type: 'heading', level: 2, text: '' };
      case 'paragraph': return { type: 'paragraph', text: '' };
      case 'quote':     return { type: 'quote', text: '', cite: '' };
      case 'image':     return { type: 'image', src: '', caption: '', alt: '', size: 'large' };
      case 'divider':   return { type: 'divider' };
      default:          return { type: 'paragraph', text: '' };
    }
  }

  // 切分時依來源區塊型別，建立後半區塊（保留型別與 level）
  function makeAfterBlock(sourceBlock, text) {
    if (!sourceBlock) return { type: 'paragraph', text: text || '' };
    if (sourceBlock.type === 'heading') {
      return { type: 'heading', level: sourceBlock.level || 2, text: text || '' };
    }
    if (sourceBlock.type === 'quote') {
      // cite 留在原區塊，新區塊 cite 空
      return { type: 'quote', text: text || '', cite: '' };
    }
    return { type: 'paragraph', text: text || '' };
  }

  /* ---------- Import / Export ---------- */
  function exportJSON() {
    const blob = new Blob([InsightsStore.exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'insights-data.json';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast('已下載 insights-data.json');
    alert('請上傳此檔至網站根目錄（與 insights.html 同層），取代舊檔後所有訪客即會看到最新內容。\n圖片檔請歸檔於 image/insight，並維持欄位中的路徑一致。');
  }

  function importJSON() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'application/json,.json';
    input.onchange = () => {
      const f = input.files?.[0]; if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const mode = confirm('按「確定」= 合併（保留現有並更新同 ID）\n按「取消」= 完全取代') ? 'merge' : 'replace';
          InsightsStore.importJSON(String(reader.result), mode);
          selectedId = InsightsStore.getAll()[0]?.id || null;
          discardDirtyDraft();
          render();
          toast('匯入完成');
        } catch (err) { alert('匯入失敗：' + err.message); }
      };
      reader.readAsText(f);
    };
    input.click();
  }

  /* ---------- Helpers ---------- */
  function insightImagePathFromFile(file) {
    const name = String((file && file.name) || '').split(/[\\/]/).pop().trim();
    return name ? '/image/insight/' + name : '';
  }
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------- Keyboard shortcut ---------- */
  document.addEventListener('keydown', e => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const modifier = isMac ? e.metaKey : e.ctrlKey;
    if (modifier && e.shiftKey && (e.key === 'e' || e.key === 'E')) {
      e.preventDefault();
      if (rootEl) close(); else open();
    }
    if (e.key === 'Escape' && rootEl) close();
  });

  window.addEventListener('beforeunload', e => {
    if (!hasUnsavedDraft()) return;
    e.preventDefault();
    e.returnValue = '';
  });

  window.addEventListener('popstate', () => {
    if (!rootEl || !hasUnsavedDraft()) return;
    if (allowHistoryExit) {
      allowHistoryExit = false;
      return;
    }
    history.pushState({ __fsiInsightDraft: true }, '', location.href);
    resolveUnsavedBeforeContinue('離開頁面前偵測到未儲存編輯，是否先儲存？').then(ok => {
      if (!ok) return;
      allowHistoryExit = true;
      try { history.back(); } catch (_) { allowHistoryExit = false; }
    });
  });

  /* 右下角極簡提示 */
  const hint = document.createElement('div');
  hint.id = 'fsi-admin-hint';
  hint.textContent = '⌘ + ⇧ + E · Insights Admin';
  document.body.appendChild(hint);
  document.addEventListener('mousemove', e => {
    const near = e.clientX > window.innerWidth - 240 && e.clientY > window.innerHeight - 100;
    hint.classList.toggle('show', near);
  });

  window.FotoSoftInsightsAdmin = { open, close };
})();

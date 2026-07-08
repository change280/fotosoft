/* faculty-admin.js — 視丘「師資團隊」隱藏管理系統 */
(function () {
  'use strict';
  if (typeof window.FacultyStore === 'undefined') {
    console.warn('[faculty-admin] 找不到 FacultyStore');
    return;
  }

  const STYLE_ID = 'fs-faculty-admin-style';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #fsf-admin-root, #fsf-admin-root * { box-sizing: border-box; }
      #fsf-admin-root { position: fixed; inset: 0; z-index: 99999; font-family: "Noto Sans TC", system-ui, -apple-system, sans-serif; color: #212529; }
      #fsf-admin-root .fsf-backdrop { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.55); backdrop-filter: blur(6px); }
      #fsf-admin-root .fsf-panel { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(1280px, 96vw); height: min(90vh, 960px); background: #fff; border-radius: 14px; box-shadow: 0 40px 80px -20px rgba(0,0,0,0.35); display: flex; overflow: hidden; }
      #fsf-admin-root .fsf-side { width: 340px; border-right: 1px solid #E9ECEF; display: flex; flex-direction: column; background: #F8F9FA; }
      #fsf-admin-root .fsf-side-head { padding: 20px 20px 14px; border-bottom: 1px solid #E9ECEF; }
      #fsf-admin-root .fsf-side-title { font-family: "Noto Serif TC", serif; font-size: 20px; font-weight: 700; margin: 0 0 4px; }
      #fsf-admin-root .fsf-side-sub { font-size: 11px; color: #6C757D; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; }
      #fsf-admin-root .fsf-tabs { display: flex; gap: 4px; margin: 12px 20px 0; }
      #fsf-admin-root .fsf-tab { flex: 1; padding: 8px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; text-align: center; background: #fff; border: 1px solid #DEE2E6; color: #495057; }
      #fsf-admin-root .fsf-tab.active { background: #212529; color: #fff; border-color: #212529; }
      #fsf-admin-root .fsf-search { margin: 10px 20px; padding: 9px 12px; border: 1px solid #DEE2E6; border-radius: 8px; background: #fff; font-size: 13px; outline: none; }
      #fsf-admin-root .fsf-search:focus { border-color: #212529; }
      #fsf-admin-root .fsf-list { flex: 1; overflow-y: auto; padding: 4px 12px 12px; }
      #fsf-admin-root .fsf-list-item { display: flex; gap: 10px; align-items: center; padding: 8px; margin-bottom: 4px; border-radius: 8px; cursor: pointer; transition: background 0.15s; }
      #fsf-admin-root .fsf-list-item:hover { background: #E9ECEF; }
      #fsf-admin-root .fsf-list-item.active { background: #212529; color: #fff; }
      #fsf-admin-root .fsf-list-item.active .fsf-list-sub { color: #ADB5BD; }
      #fsf-admin-root .fsf-list-item.dragging { opacity: 0.35; }
      #fsf-admin-root .fsf-list-item.drop-above { box-shadow: inset 0 2px 0 0 #212529; }
      #fsf-admin-root .fsf-list-item.drop-below { box-shadow: inset 0 -2px 0 0 #212529; }
      #fsf-admin-root .fsf-list-thumb { width: 44px; height: 44px; border-radius: 50%; background: #DEE2E6 center/cover no-repeat; flex-shrink: 0; }
      #fsf-admin-root .fsf-list-text { min-width: 0; flex: 1; }
      #fsf-admin-root .fsf-list-title { font-size: 13px; font-weight: 600; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      #fsf-admin-root .fsf-list-sub { font-size: 11px; color: #6C757D; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      #fsf-admin-root .fsf-list-pin { font-size: 12px; color: #f59e0b; }
      #fsf-admin-root .fsf-list-grip { color: #ADB5BD; cursor: grab; padding: 2px; font-size: 14px; }
      #fsf-admin-root .fsf-side-foot { padding: 12px 20px; border-top: 1px solid #E9ECEF; display: flex; flex-direction: column; gap: 8px; }
      #fsf-admin-root .fsf-btn { padding: 9px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: 1px solid transparent; display: inline-flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s; }
      #fsf-admin-root .fsf-btn-primary { background: #212529; color: #fff; }
      #fsf-admin-root .fsf-btn-primary:hover { background: #000; }
      #fsf-admin-root .fsf-btn-ghost { background: transparent; color: #212529; border-color: #DEE2E6; }
      #fsf-admin-root .fsf-btn-ghost:hover { background: #E9ECEF; }
      #fsf-admin-root .fsf-btn-sm { padding: 6px 10px; font-size: 12px; }
      #fsf-admin-root .fsf-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
      #fsf-admin-root .fsf-main-head { padding: 16px 24px; border-bottom: 1px solid #E9ECEF; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      #fsf-admin-root .fsf-main-title { font-family: "Noto Serif TC", serif; font-size: 18px; font-weight: 700; margin: 0; }
      #fsf-admin-root .fsf-close { width: 34px; height: 34px; border-radius: 50%; border: 1px solid #DEE2E6; background: #fff; cursor: pointer; font-size: 16px; color: #6C757D; display: inline-flex; align-items: center; justify-content: center; }
      #fsf-admin-root .fsf-close:hover { background: #F8F9FA; color: #212529; }
      #fsf-admin-root .fsf-form { flex: 1; overflow-y: auto; padding: 20px 24px 24px; }
      #fsf-admin-root .fsf-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ADB5BD; text-align: center; padding: 40px; }
      #fsf-admin-root .fsf-field { margin-bottom: 18px; }
      #fsf-admin-root .fsf-label { display: block; font-size: 12px; font-weight: 600; color: #495057; margin-bottom: 6px; letter-spacing: 0.05em; }
      #fsf-admin-root .fsf-input, #fsf-admin-root .fsf-textarea, #fsf-admin-root .fsf-select { width: 100%; padding: 9px 12px; border: 1px solid #DEE2E6; border-radius: 8px; font-size: 13px; font-family: inherit; outline: none; background: #fff; color: #212529; }
      #fsf-admin-root .fsf-input:focus, #fsf-admin-root .fsf-textarea:focus, #fsf-admin-root .fsf-select:focus { border-color: #212529; }
      #fsf-admin-root .fsf-textarea { min-height: 80px; resize: vertical; line-height: 1.7; }
      #fsf-admin-root .fsf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      #fsf-admin-root .fsf-photo-preview { width: 140px; height: 140px; border-radius: 50%; background: #F8F9FA center/cover no-repeat; border: 1px dashed #DEE2E6; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; color: #ADB5BD; font-size: 11px; }
      #fsf-admin-root .fsf-image-row { display: flex; gap: 8px; }
      #fsf-admin-root .fsf-image-row .fsf-input { flex: 1; }
      #fsf-admin-root .fsf-file-btn { display: inline-flex; align-items: center; padding: 9px 14px; border: 1px solid #DEE2E6; border-radius: 8px; cursor: pointer; font-size: 12px; background: #fff; color: #495057; white-space: nowrap; }
      #fsf-admin-root .fsf-check { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #495057; cursor: pointer; }
      #fsf-admin-root .fsf-actions { display: flex; gap: 8px; flex-wrap: wrap; }
      #fsf-admin-root .fsf-gallery-grid, #fsf-admin-root .fsf-link-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
      #fsf-admin-root .fsf-gallery-item, #fsf-admin-root .fsf-link-item, #fsf-admin-root .fsf-sec-item { border: 1px solid #E9ECEF; border-radius: 10px; background: #fff; overflow: hidden; }
      #fsf-admin-root .fsf-gallery-thumb { width: 100%; aspect-ratio: 1/1; background: #F8F9FA center/cover no-repeat; display: flex; align-items: center; justify-content: center; color: #ADB5BD; font-size: 11px; }
      #fsf-admin-root .fsf-gallery-body, #fsf-admin-root .fsf-link-body, #fsf-admin-root .fsf-sec-body { padding: 10px; display: flex; flex-direction: column; gap: 6px; }
      #fsf-admin-root .fsf-gallery-actions, #fsf-admin-root .fsf-link-actions, #fsf-admin-root .fsf-sec-actions { display: flex; gap: 4px; justify-content: flex-end; }
      #fsf-admin-root .fsf-sec-head { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #F8F9FA; border-bottom: 1px solid #E9ECEF; }
      #fsf-admin-root .fsf-sec-tag { font-size: 11px; padding: 3px 8px; border-radius: 4px; background: #E9ECEF; color: #495057; font-weight: 600; }
      #fsf-admin-root .fsf-icon-btn { width: 26px; height: 26px; border-radius: 5px; border: 1px solid #DEE2E6; background: #fff; cursor: pointer; color: #495057; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }
      #fsf-admin-root .fsf-icon-btn:hover { background: #F8F9FA; }
      #fsf-admin-root .fsf-icon-btn.danger { color: #dc2626; border-color: #fecaca; }
      #fsf-admin-root .fsf-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #212529; color: #fff; padding: 10px 18px; border-radius: 999px; font-size: 12px; z-index: 100000; opacity: 0; transition: opacity 0.25s; pointer-events: none; }
      #fsf-admin-root .fsf-toast.show { opacity: 1; }
      #fsf-admin-root .fsf-form-foot { display: flex; gap: 8px; justify-content: space-between; padding: 14px 24px; border-top: 1px solid #E9ECEF; background: #FAFBFC; }
      #fsf-admin-root .fsf-dialog-backdrop { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.2); display: flex; align-items: center; justify-content: center; z-index: 100001; }
      #fsf-admin-root .fsf-dialog { width: min(420px, calc(100vw - 32px)); background: #fff; border-radius: 16px; box-shadow: 0 30px 80px -28px rgba(0,0,0,0.35); overflow: hidden; }
      #fsf-admin-root .fsf-dialog-body { padding: 26px 28px 22px; font-size: 16px; line-height: 1.7; color: #212529; }
      #fsf-admin-root .fsf-dialog-actions { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 20px 20px; border-top: 1px solid #E9ECEF; }
    `;
    document.head.appendChild(style);
  }

  const DRAFT_STORAGE_KEY = 'FOTOSOFT_FACULTY_ADMIN_DRAFT_V1';
  const HISTORY_SENTINEL_KEY = '__fsfFacultyAdminDraft';
  let rootEl = null, selectedId = null, searchTerm = '', dirtyDraft = null, currentTab = 'current', dragId = null;
  let allowHistoryExit = false;
  let profileEditLang = 'zh';
  const PROFILE_LANGS = [
    { key: 'zh', label: '中文' },
    { key: 'ja', label: '日本語' },
    { key: 'en', label: 'English' }
  ];

  function escapeHtml(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]; }); }
  function escapeAttr(s) { return escapeHtml(s); }
  function hasUnsavedDraft() { return !!dirtyDraft || !!localStorage.getItem(DRAFT_STORAGE_KEY); }
  function clearDraftState() {
    try { localStorage.removeItem(DRAFT_STORAGE_KEY); } catch (_) {}
  }
  function persistDraftState() {
    if (!dirtyDraft) { clearDraftState(); return; }
    try { history.pushState({ [HISTORY_SENTINEL_KEY]: true }, '', location.href); } catch (_) {}
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
        selectedId: selectedId || '',
        currentTab: currentTab,
        searchTerm: searchTerm,
        dirtyDraft: dirtyDraft
      }));
    } catch (_) {}
  }
  function commitDirtyDraft(options) {
    const shouldExport = !options || options.exportAfterSave !== false;
    if (!dirtyDraft) return true;
    if (!dirtyDraft.name || !dirtyDraft.name.trim()) { alert('姓名為必填'); return false; }
    const saved = FacultyStore.save(dirtyDraft);
    selectedId = saved.id;
    dirtyDraft = null;
    clearDraftState();
    if (shouldExport) exportFacultyJSONFile();
    toast('已儲存');
    return true;
  }
  function restoreDraftState() {
    let raw = null;
    try { raw = localStorage.getItem(DRAFT_STORAGE_KEY); } catch (_) {}
    if (!raw) return false;
    try {
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== 'object' || !saved.dirtyDraft || typeof saved.dirtyDraft !== 'object') return false;
      selectedId = saved.selectedId || '';
      currentTab = saved.currentTab === 'previous' ? 'previous' : 'current';
      searchTerm = typeof saved.searchTerm === 'string' ? saved.searchTerm : '';
      dirtyDraft = saved.dirtyDraft;
      return true;
    } catch (_) {
      clearDraftState();
      return false;
    }
  }
  function toast(msg) {
    if (!rootEl) return;
    let el = rootEl.querySelector('.fsf-toast');
    if (!el) { el = document.createElement('div'); el.className = 'fsf-toast'; rootEl.appendChild(el); }
    el.textContent = msg; el.classList.add('show');
    setTimeout(function () { el.classList.remove('show'); }, 1600);
  }
  function exportFacultyJSONFile() {
    const blob = new Blob([FacultyStore.exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faculty-data.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 0);
  }
  function showSaveDiscardDialog(message) {
    return new Promise(function (resolve) {
      if (!rootEl) { resolve('discard'); return; }
      const wrap = document.createElement('div');
      wrap.className = 'fsf-dialog-backdrop';
      wrap.innerHTML = '' +
        '<div class="fsf-dialog" role="alertdialog" aria-modal="true" aria-labelledby="fsf-dialog-title">' +
          '<div class="fsf-dialog-body" id="fsf-dialog-title">' + escapeHtml(message) + '</div>' +
          '<div class="fsf-dialog-actions">' +
            '<button class="fsf-btn fsf-btn-ghost" data-dialog-action="discard">捨棄</button>' +
            '<button class="fsf-btn fsf-btn-primary" data-dialog-action="save">儲存</button>' +
          '</div>' +
        '</div>';
      function cleanup(result) {
        document.removeEventListener('keydown', onKeydown, true);
        wrap.remove();
        resolve(result);
      }
      function onKeydown(e) {
        if (e.key === 'Enter') { e.preventDefault(); cleanup('save'); }
        if (e.key === 'Escape') { e.preventDefault(); cleanup('discard'); }
      }
      wrap.addEventListener('click', function (e) {
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
  function showUnsavedSwitchDialog() {
    return showSaveDiscardDialog('離開網頁即使已儲存，也可能遺失編輯進度，系統會自動匯出 json 檔案，未來可自行重新匯入。切換將放棄未儲存的變更，是否先儲存？');
  }
  function showUnsavedExportDialog() {
    return showSaveDiscardDialog('匯出前發現有未儲存的變更，是否先儲存後再匯出 json？');
  }
  function handleLeaveWithUnsavedDraft() {
    if (!rootEl || !hasUnsavedDraft()) return;
    if (allowHistoryExit) {
      allowHistoryExit = false;
      return;
    }
    history.pushState({ [HISTORY_SENTINEL_KEY]: true }, '', location.href);
    showUnsavedSwitchDialog().then(function (action) {
      if (action === 'save') {
        if (!commitDirtyDraft()) return;
      } else {
        dirtyDraft = null;
        clearDraftState();
      }
      allowHistoryExit = true;
      try { history.back(); } catch (_) { allowHistoryExit = false; }
    });
  }
  function fileToDataURL(file) {
    return new Promise(function (resolve, reject) {
      const r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.onerror = reject; r.readAsDataURL(file);
    });
  }
  function facultyImagePathFromFile(file) {
    const name = String((file && file.name) || '').split(/[\\/]/).pop().trim();
    return name ? '/image/faculty/' + name : '';
  }

  function open() {
    if (rootEl) return;
    const restored = !dirtyDraft && restoreDraftState();
    rootEl = document.createElement('div'); rootEl.id = 'fsf-admin-root';
    document.body.appendChild(rootEl); render();
    if (restored) toast('已還原上次未儲存的編輯');
    document.addEventListener('keydown', escToClose);
  }
  function close() {
    if (dirtyDraft && !confirm('尚有未儲存的變更，確定要關閉嗎？')) return;
    if (rootEl) { rootEl.remove(); rootEl = null; }
    dirtyDraft = null;
    document.removeEventListener('keydown', escToClose);
  }
  function escToClose(e) { if (e.key === 'Escape' && rootEl) close(); }

  function render() {
    if (!rootEl) return;
    const prevForm = rootEl.querySelector('.fsf-form');
    const prevList = rootEl.querySelector('.fsf-list');
    const savedFormScroll = prevForm ? prevForm.scrollTop : 0;
    const savedListScroll = prevList ? prevList.scrollTop : 0;
    const activeEl = document.activeElement;
    const activeMarker = activeEl && rootEl.contains(activeEl) ? {
      field: activeEl.getAttribute('data-sec-field') || activeEl.getAttribute('data-gallery-field') || activeEl.getAttribute('data-link-field') || activeEl.getAttribute('data-field') || activeEl.getAttribute('data-role'),
      idx: activeEl.getAttribute('data-sec-idx') || activeEl.getAttribute('data-gallery-idx') || activeEl.getAttribute('data-link-idx'),
      selStart: typeof activeEl.selectionStart === 'number' ? activeEl.selectionStart : null,
      selEnd: typeof activeEl.selectionEnd === 'number' ? activeEl.selectionEnd : null
    } : null;

    const all = FacultyStore.getAll();
    const scope = currentTab === 'previous' ? all.filter(function (p) { return p.status === 'previous'; }) : all.filter(function (p) { return p.status !== 'previous'; });
    const filtered = searchTerm ? scope.filter(function (p) {
      return (p.name + ' ' + (p.englishName || '') + ' ' + (p.title || '') + ' ' + (p.courses || '')).toLowerCase().includes(searchTerm.toLowerCase());
    }) : scope;
    const current = all.find(function (p) { return p.id === selectedId; }) || null;
    const draft = dirtyDraft || current;

    rootEl.innerHTML = `
      <div class="fsf-backdrop" data-role="close"></div>
      <div class="fsf-panel" role="dialog">
        <aside class="fsf-side">
          <div class="fsf-side-head"><h2 class="fsf-side-title">師資團隊管理</h2><p class="fsf-side-sub">Faculty Admin</p></div>
          <div class="fsf-tabs">
            <div class="fsf-tab ${currentTab === 'current' ? 'active' : ''}" data-role="tab" data-tab="current">現任師資</div>
            <div class="fsf-tab ${currentTab === 'previous' ? 'active' : ''}" data-role="tab" data-tab="previous">曾任師資</div>
          </div>
          <input class="fsf-search" data-role="search" placeholder="搜尋姓名／課程…" value="${escapeAttr(searchTerm)}">
          <div class="fsf-list" data-role="list">
            ${filtered.map(renderListItem).join('') || '<p style="padding:20px;color:#ADB5BD;font-size:12px;text-align:center;">目前沒有資料</p>'}
          </div>
          <div class="fsf-side-foot">
            <button class="fsf-btn fsf-btn-primary" data-role="new"><span>＋</span> 新增師資</button>
            <div style="display:flex;gap:6px;">
              <button class="fsf-btn fsf-btn-ghost fsf-btn-sm" data-role="export" style="flex:1;">匯出 JSON</button>
              <button class="fsf-btn fsf-btn-ghost fsf-btn-sm" data-role="import" style="flex:1;">匯入 JSON</button>
            </div>
            <button class="fsf-btn fsf-btn-ghost fsf-btn-sm" data-role="reload-remote">以 faculty-data.json 為準（強制重新載入）</button>
            <p style="margin:6px 2px 0;font-size:11px;line-height:1.6;color:#6C757D;">「匯出 JSON」只會下載檔案到你的電腦，請把下載的 <b>faculty-data.json</b> 覆蓋到網站根目錄後，其他瀏覽器打開時才會看到最新資料。</p>
            <button class="fsf-btn fsf-btn-ghost fsf-btn-sm" data-role="reset" style="color:#dc2626;border-color:#fecaca;">重置為預設資料</button>
          </div>
        </aside>
        <main class="fsf-main">${draft ? renderForm(draft, !current) : renderEmpty()}</main>
      </div>
    `;
    bindEvents();

    const newForm = rootEl.querySelector('.fsf-form');
    const newList = rootEl.querySelector('.fsf-list');
    if (newForm) newForm.scrollTop = savedFormScroll;
    if (newList) newList.scrollTop = savedListScroll;
    if (activeMarker && (activeMarker.field || activeMarker.idx)) {
      let selector = '';
      if (activeMarker.field && activeMarker.idx != null) {
        selector = '[data-sec-field="' + activeMarker.field + '"][data-sec-idx="' + activeMarker.idx + '"], [data-gallery-field="' + activeMarker.field + '"][data-gallery-idx="' + activeMarker.idx + '"], [data-link-field="' + activeMarker.field + '"][data-link-idx="' + activeMarker.idx + '"]';
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
    const photo = FacultyStore.photoOf(p);
    const bg = photo ? "background-image:url('" + escapeAttr(photo) + "')" : '';
    return `<div class="fsf-list-item ${active}" data-role="select" data-id="${escapeAttr(p.id)}" draggable="true"><span class="fsf-list-grip">⋮⋮</span><div class="fsf-list-thumb" style="${bg}"></div><div class="fsf-list-text"><p class="fsf-list-title">${escapeHtml(p.name)}</p><p class="fsf-list-sub">${escapeHtml(p.title || '')}</p></div>${p.pinned ? '<span class="fsf-list-pin">★</span>' : ''}</div>`;
  }

  function renderEmpty() {
    return `<div class="fsf-empty"><div style="font-size:40px;">👤</div><h3 style="font-family:Noto Serif TC,serif;font-size:22px;color:#6C757D;margin:12px 0 6px;">尚未選取</h3><p style="margin:0;font-size:13px;">從左側選擇一位師資編輯，或點擊「新增師資」。</p></div>`;
  }

  function renderGalleryItem(item, i) {
    const src = item && item.src ? item.src : '';
    return `<div class="fsf-gallery-item"><div class="fsf-gallery-thumb" style="${src ? "background-image:url('" + escapeAttr(src) + "')" : ''}">${src ? '' : '未設定圖片'}</div><div class="fsf-gallery-body"><div class="fsf-image-row"><input class="fsf-input" data-gallery-field="src" data-gallery-idx="${i}" value="${escapeAttr(src)}" placeholder="圖片網址…"><label class="fsf-file-btn">上傳<input type="file" accept="image/*" hidden data-role="upload-gallery" data-gallery-idx="${i}"></label></div><input class="fsf-input" data-gallery-field="caption" data-gallery-idx="${i}" value="${escapeAttr(item.caption || '')}" placeholder="圖說（選填）"><input class="fsf-input" data-gallery-field="alt" data-gallery-idx="${i}" value="${escapeAttr(item.alt || '')}" placeholder="alt（選填）"><div class="fsf-gallery-actions"><button class="fsf-icon-btn" data-role="gallery-up" data-gallery-idx="${i}">↑</button><button class="fsf-icon-btn" data-role="gallery-down" data-gallery-idx="${i}">↓</button><button class="fsf-icon-btn danger" data-role="gallery-remove" data-gallery-idx="${i}">×</button></div></div></div>`;
  }

  function renderLinkItem(item, i) {
    return `<div class="fsf-link-item"><div class="fsf-link-body"><input class="fsf-input" data-link-field="label" data-link-idx="${i}" value="${escapeAttr(item.label || '')}" placeholder="連結名稱（例：個人部落格）"><input class="fsf-input" data-link-field="url" data-link-idx="${i}" value="${escapeAttr(item.url || '')}" placeholder="https://..."><div class="fsf-link-actions"><button class="fsf-icon-btn" data-role="link-up" data-link-idx="${i}">↑</button><button class="fsf-icon-btn" data-role="link-down" data-link-idx="${i}">↓</button><button class="fsf-icon-btn danger" data-role="link-remove" data-link-idx="${i}">×</button></div></div></div>`;
  }

  function renderSectionItem(item, i) {
    return `<div class="fsf-sec-item" style="margin-bottom:10px;"><div class="fsf-sec-head"><span class="fsf-sec-tag">區塊 ${i + 1}</span><div style="margin-left:auto;display:flex;gap:4px;"><button class="fsf-icon-btn" data-role="sec-up" data-sec-idx="${i}" title="上移">↑</button><button class="fsf-icon-btn" data-role="sec-down" data-sec-idx="${i}" title="下移">↓</button><button class="fsf-icon-btn danger" data-role="sec-remove" data-sec-idx="${i}" title="刪除">×</button></div></div><div class="fsf-sec-body"><input class="fsf-input" data-sec-field="title" data-sec-idx="${i}" value="${escapeAttr(item.title || '')}" placeholder="區塊標題（例：學歷、曾任、獲獎…）"><textarea class="fsf-textarea" data-sec-field="body" data-sec-idx="${i}" style="min-height:120px;" placeholder="區塊內文（空一行換段落）">${escapeHtml(item.body || '')}</textarea></div></div>`;
  }

  function ensureProfileI18nDraft(draft) {
    if (!draft) return;
    if (!draft.profileI18n || typeof draft.profileI18n !== 'object') draft.profileI18n = {};
    PROFILE_LANGS.forEach(function (lang) {
      if (!Array.isArray(draft.profileI18n[lang.key])) draft.profileI18n[lang.key] = [];
    });
    if (!draft.profileI18n.zh.length && Array.isArray(draft.sections) && draft.sections.length) {
      draft.profileI18n.zh = draft.sections.map(function (item) {
        return { title: item && item.title ? item.title : '', body: item && item.body ? item.body : '' };
      });
    }
    draft.sections = Array.isArray(draft.profileI18n.zh) ? draft.profileI18n.zh : [];
  }

  function getSectionsByEditLang(draft) {
    ensureProfileI18nDraft(draft);
    return draft.profileI18n[profileEditLang];
  }

  function renderForm(p, isNew) {
    const photo = p.photo || '';
    ensureProfileI18nDraft(p);
    const sectionsForEdit = getSectionsByEditLang(p);
    const langTabs = PROFILE_LANGS.map(function (lang) {
      const active = lang.key === profileEditLang ? 'fsf-tab active' : 'fsf-tab';
      return '<button type="button" class="' + active + '" data-role="profile-lang-tab" data-profile-lang="' + lang.key + '" style="min-width:90px;">' + lang.label + '</button>';
    }).join('');
    return `
      <div class="fsf-main-head"><h2 class="fsf-main-title">${isNew ? '新增師資' : '編輯師資'}</h2><button class="fsf-close" data-role="close">×</button></div>
      <div class="fsf-form">
        <div class="fsf-field" style="display:flex;gap:20px;align-items:flex-start;"><div><label class="fsf-label">個人照</label><div class="fsf-photo-preview" style="${photo ? "background-image:url('" + escapeAttr(photo) + "')" : ''}">${photo ? '' : '未設定'}</div></div><div style="flex:1;"><label class="fsf-label">照片來源</label><div class="fsf-image-row" style="margin-bottom:8px;"><input class="fsf-input" data-field="photo" placeholder="/image/faculty/圖片檔名.jpg" value="${escapeAttr(photo)}"><label class="fsf-file-btn">選擇檔案<input type="file" accept="image/*" hidden data-role="upload-photo"></label></div></div></div>
        <div class="fsf-row"><div class="fsf-field"><label class="fsf-label">姓名 *</label><input class="fsf-input" data-field="name" value="${escapeAttr(p.name)}"></div><div class="fsf-field"><label class="fsf-label">英文名</label><input class="fsf-input" data-field="englishName" value="${escapeAttr(p.englishName || '')}"></div></div>
        <div class="fsf-field"><label class="fsf-label">頭銜 / 職稱</label><input class="fsf-input" data-field="title" value="${escapeAttr(p.title || '')}" placeholder="例：現任講師、客座講師…"></div>
        <div class="fsf-field"><label class="fsf-label">授課課程（顯示於 meta 列 · 教授課程 ｜ …）</label><input class="fsf-input" data-field="courses" value="${escapeAttr(p.courses || '')}" placeholder="以頓號或逗號分隔"></div>
        <div class="fsf-field"><label class="fsf-label">一句話簡介（列表卡片用）</label><textarea class="fsf-textarea" data-field="summary" style="min-height:60px;">${escapeHtml(p.summary || '')}</textarea></div>
        <div class="fsf-field"><label class="fsf-label">Hero 大標語（襯線體，一至兩句話）</label><textarea class="fsf-textarea" data-field="tagline" style="min-height:60px;">${escapeHtml(p.tagline || '')}</textarea></div>

        <div class="fsf-field">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;">
            <label class="fsf-label" style="margin-bottom:0;">老師相關網站連結（會顯示於 Profile 區上方 meta 列）</label>
            <button class="fsf-btn fsf-btn-ghost fsf-btn-sm" data-role="link-add">＋ 新增連結</button>
          </div>
          <div class="fsf-link-grid">${(p.links || []).map(renderLinkItem).join('') || '<p style="grid-column:1/-1;text-align:center;color:#ADB5BD;font-size:12px;padding:18px;border:1px dashed #DEE2E6;border-radius:10px;background:#fff;">尚未新增外部連結</p>'}</div>
        </div>

        <div class="fsf-field">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;">
            <label class="fsf-label" style="margin-bottom:0;">Profile 內容區塊（每個區塊 = 一個標題 + 內文，也會自動成為 Page Index 項目）</label>
            <button class="fsf-btn fsf-btn-ghost fsf-btn-sm" data-role="sec-add">＋ 新增區塊</button>
          </div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">${langTabs}</div>
          <div>${(sectionsForEdit || []).map(renderSectionItem).join('') || '<p style="text-align:center;color:#ADB5BD;font-size:12px;padding:18px;border:1px dashed #DEE2E6;border-radius:10px;background:#fff;">此語言尚未新增內容區塊</p>'}</div>
        </div>

        <div class="fsf-field">
          <label class="fsf-label">嵌入影片（網址或檔案路徑）</label>
          <textarea class="fsf-textarea" data-field="video" style="min-height:90px;" placeholder="每行一部影片\nhttps://www.youtube.com/watch?v=...\n/image/faculty/demo.mp4">${escapeHtml(Array.isArray(p.videos) && p.videos.length ? p.videos.join('\n') : (p.video || ''))}</textarea>
          <p style="margin:6px 0 0;font-size:12px;color:#6C757D;">支援每行一部影片；前台先顯示第一部，其他可展開瀏覽。</p>
        </div>

        <div class="fsf-field">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;">
            <label class="fsf-label" style="margin-bottom:0;">多張照片相簿（縮圖列 / 點擊燈箱瀏覽）</label>
            <button class="fsf-btn fsf-btn-ghost fsf-btn-sm" data-role="gallery-add">＋ 新增照片</button>
          </div>
          <div class="fsf-gallery-grid">${(p.gallery || []).map(renderGalleryItem).join('') || '<p style="grid-column:1/-1;text-align:center;color:#ADB5BD;font-size:12px;padding:18px;border:1px dashed #DEE2E6;border-radius:10px;background:#fff;">尚未新增相簿照片</p>'}</div>
        </div>

        <div class="fsf-row"><div class="fsf-field"><label class="fsf-label">狀態</label><select class="fsf-select" data-field="status"><option value="current" ${p.status !== 'previous' ? 'selected' : ''}>現任師資</option><option value="previous" ${p.status === 'previous' ? 'selected' : ''}>曾任師資</option></select></div><div class="fsf-field" style="display:flex;align-items:flex-end;"><label class="fsf-check"><input type="checkbox" data-field="pinned" ${p.pinned ? 'checked' : ''}>置頂顯示（例：創辦人）</label></div></div>
      </div>
      <div class="fsf-form-foot"><div class="fsf-actions">${!isNew ? `<button class="fsf-btn fsf-btn-ghost fsf-btn-sm" data-role="toggle-status">${p.status === 'previous' ? '⬆ 移到現任' : '⬇ 移到曾任'}</button><button class="fsf-btn fsf-btn-ghost fsf-btn-sm" data-role="delete" style="color:#dc2626;border-color:#fecaca;">刪除</button>` : ''}</div><div class="fsf-actions"><button class="fsf-btn fsf-btn-ghost fsf-btn-sm" data-role="cancel">取消</button><button class="fsf-btn fsf-btn-primary" data-role="save">${isNew ? '建立' : '儲存變更'}</button></div></div>
    `;
  }

  function bindEvents() {
    if (!rootEl) return;
    const $ = function (s) { return rootEl.querySelector(s); };
    const $$ = function (s) { return Array.prototype.slice.call(rootEl.querySelectorAll(s)); };

    $$('[data-role="close"]').forEach(function (el) { el.addEventListener('click', close); });
    $$('[data-role="tab"]').forEach(function (el) { el.addEventListener('click', function () { currentTab = el.getAttribute('data-tab'); searchTerm = ''; persistDraftState(); render(); }); });
    const searchEl = $('[data-role="search"]');
    if (searchEl) searchEl.addEventListener('input', function (e) { searchTerm = e.target.value; persistDraftState(); render(); });
    $$('[data-role="select"]').forEach(function (el) { el.addEventListener('click', async function () {
      const id = el.getAttribute('data-id');
      if (dirtyDraft && dirtyDraft.id !== id) {
        const action = await showUnsavedSwitchDialog();
        if (action === 'save') {
          if (!commitDirtyDraft({ exportAfterSave: false })) return;
        } else {
          dirtyDraft = null;
          clearDraftState();
        }
      }
      selectedId = id;
      render();
    }); });

    $$('.fsf-list-item').forEach(function (el) {
      el.addEventListener('dragstart', function (e) { dragId = el.getAttribute('data-id'); el.classList.add('dragging'); try { e.dataTransfer.effectAllowed = 'move'; } catch (_) {} });
      el.addEventListener('dragend', function () { el.classList.remove('dragging'); $$('.fsf-list-item').forEach(function (x) { x.classList.remove('drop-above', 'drop-below'); }); dragId = null; });
      el.addEventListener('dragover', function (e) { e.preventDefault(); if (!dragId || dragId === el.getAttribute('data-id')) return; const rect = el.getBoundingClientRect(); const before = (e.clientY - rect.top) < rect.height / 2; el.classList.toggle('drop-above', before); el.classList.toggle('drop-below', !before); });
      el.addEventListener('dragleave', function () { el.classList.remove('drop-above', 'drop-below'); });
      el.addEventListener('drop', function (e) {
        e.preventDefault(); if (!dragId) return;
        const targetId = el.getAttribute('data-id'); if (targetId === dragId) return;
        const rect = el.getBoundingClientRect(); const before = (e.clientY - rect.top) < rect.height / 2;
        const all = FacultyStore.getAll();
        const inScope = all.filter(function (p) { return (currentTab === 'previous') === (p.status === 'previous'); }).map(function (p) { return p.id; });
        const outScope = all.filter(function (p) { return (currentTab === 'previous') !== (p.status === 'previous'); }).map(function (p) { return p.id; });
        const withoutDrag = inScope.filter(function (id) { return id !== dragId; });
        const targetIdx = withoutDrag.indexOf(targetId);
        withoutDrag.splice(before ? targetIdx : targetIdx + 1, 0, dragId);
        FacultyStore.reorder(outScope.concat(withoutDrag));
        render();
      });
    });

    const newBtn = $('[data-role="new"]');
    if (newBtn) newBtn.addEventListener('click', function () {
      if (dirtyDraft && !confirm('放棄未儲存的變更？')) return;
      selectedId = null;
      dirtyDraft = { id: '', name: '', englishName: '', title: currentTab === 'previous' ? '曾任師資' : '', courses: '', photo: '', video: '', gallery: [], links: [], status: currentTab === 'previous' ? 'previous' : 'current', pinned: false, order: 999, summary: '', tagline: '', intro: '', sections: [], profileI18n: { zh: [], ja: [], en: [] }, blocks: [] };
      persistDraftState();
      render();
    });

    const exportBtn = $('[data-role="export"]');
    if (exportBtn) exportBtn.addEventListener('click', async function () {
      if (dirtyDraft) {
        const action = await showUnsavedExportDialog();
        if (action === 'save') {
          if (!commitDirtyDraft({ exportAfterSave: false })) return;
        } else {
          dirtyDraft = null;
          clearDraftState();
        }
      }
      exportFacultyJSONFile();
      toast('已下載');
    });
    const importBtn = $('[data-role="import"]');
    if (importBtn) importBtn.addEventListener('click', function () { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'application/json'; inp.onchange = function () { const f = inp.files && inp.files[0]; if (!f) return; const r = new FileReader(); r.onload = function () { try { const mode = confirm('按「確定」→ 合併；按「取消」→ 覆蓋') ? 'merge' : 'replace'; FacultyStore.importJSON(String(r.result), mode); selectedId = null; dirtyDraft = null; clearDraftState(); toast('已匯入'); render(); } catch (e) { alert('匯入失敗：' + e.message); } }; r.readAsText(f); }; inp.click(); });
    const resetBtn = $('[data-role="reset"]');
    if (resetBtn) resetBtn.addEventListener('click', function () { if (!confirm('確定重置？')) return; FacultyStore.reset(); selectedId = null; dirtyDraft = null; clearDraftState(); toast('已重置'); render(); });
    const reloadBtn = $('[data-role="reload-remote"]');
    if (reloadBtn) reloadBtn.addEventListener('click', function () {
      if (!confirm('這會用網站根目錄的 faculty-data.json 覆蓋你目前在瀏覽器中所做的所有編輯，確定要繼續？')) return;
      if (typeof FacultyStore.forceReloadFromRemote !== 'function') { alert('目前版本不支援強制重新載入。'); return; }
      FacultyStore.forceReloadFromRemote().then(function (ok) {
        if (ok) { selectedId = null; dirtyDraft = null; clearDraftState(); toast('已以 faculty-data.json 重新載入'); render(); }
        else { alert('無法讀取 faculty-data.json（找不到檔案或格式錯誤）。'); }
      });
    });

    $$('[data-field]').forEach(function (el) {
      const evt = (el.tagName === 'SELECT' || el.type === 'checkbox') ? 'change' : 'input';
      el.addEventListener(evt, function () {
        ensureDraft();
        const field = el.getAttribute('data-field');
        const val = el.type === 'checkbox' ? el.checked : el.value;
        dirtyDraft[field] = val;
        persistDraftState();
        if (field === 'photo') {
          const preview = rootEl.querySelector('.fsf-photo-preview');
          if (preview) { preview.style.backgroundImage = val ? "url('" + val + "')" : ''; preview.textContent = val ? '' : '未設定'; }
        }
      });
    });

    const uploadPhoto = $('[data-role="upload-photo"]');
    if (uploadPhoto) uploadPhoto.addEventListener('change', function () {
      const f = uploadPhoto.files && uploadPhoto.files[0];
      if (!f) return;
      const path = facultyImagePathFromFile(f);
      ensureDraft();
      dirtyDraft.photo = path;
      persistDraftState();
      toast('已設定照片路徑為 ' + path);
      render();
    });

    // Links
    const linkAdd = $('[data-role="link-add"]');
    if (linkAdd) linkAdd.addEventListener('click', function () { ensureDraft(); dirtyDraft.links = Array.isArray(dirtyDraft.links) ? dirtyDraft.links : []; dirtyDraft.links.push({ label: '', url: '' }); persistDraftState(); render(); });
    $$('[data-link-field]').forEach(function (el) { el.addEventListener('input', function () { ensureDraft(); dirtyDraft.links = Array.isArray(dirtyDraft.links) ? dirtyDraft.links : []; const idx = Number(el.getAttribute('data-link-idx')); const field = el.getAttribute('data-link-field'); if (!dirtyDraft.links[idx]) return; dirtyDraft.links[idx][field] = el.value; persistDraftState(); }); });
    $$('[data-role="link-up"]').forEach(function (el) { el.addEventListener('click', function () { ensureDraft(); const i = Number(el.getAttribute('data-link-idx')); if (i <= 0) return; const a = dirtyDraft.links || []; const t = a[i - 1]; a[i - 1] = a[i]; a[i] = t; persistDraftState(); render(); }); });
    $$('[data-role="link-down"]').forEach(function (el) { el.addEventListener('click', function () { ensureDraft(); const i = Number(el.getAttribute('data-link-idx')); const a = dirtyDraft.links || []; if (i >= a.length - 1) return; const t = a[i + 1]; a[i + 1] = a[i]; a[i] = t; persistDraftState(); render(); }); });
    $$('[data-role="link-remove"]').forEach(function (el) { el.addEventListener('click', function () { ensureDraft(); const i = Number(el.getAttribute('data-link-idx')); dirtyDraft.links.splice(i, 1); persistDraftState(); render(); }); });

    $$('[data-role="profile-lang-tab"]').forEach(function (el) {
      el.addEventListener('click', function () {
        const next = el.getAttribute('data-profile-lang');
        if (!next || next === profileEditLang) return;
        profileEditLang = next;
        persistDraftState();
        render();
      });
    });

    // Sections
    const secAdd = $('[data-role="sec-add"]');
    if (secAdd) secAdd.addEventListener('click', function () { ensureDraft(); const arr = getSectionsByEditLang(dirtyDraft); arr.push({ title: '', body: '' }); persistDraftState(); render(); });
    $$('[data-sec-field]').forEach(function (el) { el.addEventListener('input', function () { ensureDraft(); const arr = getSectionsByEditLang(dirtyDraft); const idx = Number(el.getAttribute('data-sec-idx')); const field = el.getAttribute('data-sec-field'); if (!arr[idx]) return; arr[idx][field] = el.value; persistDraftState(); }); });
    $$('[data-role="sec-up"]').forEach(function (el) { el.addEventListener('click', function () { ensureDraft(); const i = Number(el.getAttribute('data-sec-idx')); if (i <= 0) return; const a = getSectionsByEditLang(dirtyDraft); const t = a[i - 1]; a[i - 1] = a[i]; a[i] = t; persistDraftState(); render(); }); });
    $$('[data-role="sec-down"]').forEach(function (el) { el.addEventListener('click', function () { ensureDraft(); const i = Number(el.getAttribute('data-sec-idx')); const a = getSectionsByEditLang(dirtyDraft); if (i >= a.length - 1) return; const t = a[i + 1]; a[i + 1] = a[i]; a[i] = t; persistDraftState(); render(); }); });
    $$('[data-role="sec-remove"]').forEach(function (el) { el.addEventListener('click', function () { ensureDraft(); const i = Number(el.getAttribute('data-sec-idx')); const a = getSectionsByEditLang(dirtyDraft); a.splice(i, 1); persistDraftState(); render(); }); });

    // Gallery
    const galleryAdd = $('[data-role="gallery-add"]');
    if (galleryAdd) galleryAdd.addEventListener('click', function () { ensureDraft(); dirtyDraft.gallery = Array.isArray(dirtyDraft.gallery) ? dirtyDraft.gallery : []; dirtyDraft.gallery.push({ src: '', alt: '', caption: '' }); persistDraftState(); render(); });
    $$('[data-gallery-field]').forEach(function (el) { const evt = el.tagName === 'SELECT' ? 'change' : 'input'; el.addEventListener(evt, function () { ensureDraft(); dirtyDraft.gallery = Array.isArray(dirtyDraft.gallery) ? dirtyDraft.gallery : []; const idx = Number(el.getAttribute('data-gallery-idx')); const field = el.getAttribute('data-gallery-field'); if (!dirtyDraft.gallery[idx]) return; dirtyDraft.gallery[idx][field] = el.value; persistDraftState(); }); });
    $$('[data-role="upload-gallery"]').forEach(function (el) { el.addEventListener('change', function () { const f = el.files && el.files[0]; if (!f) return; const path = facultyImagePathFromFile(f); ensureDraft(); dirtyDraft.gallery = Array.isArray(dirtyDraft.gallery) ? dirtyDraft.gallery : []; const idx = Number(el.getAttribute('data-gallery-idx')); if (dirtyDraft.gallery[idx]) dirtyDraft.gallery[idx].src = path; persistDraftState(); toast('已設定相簿圖片路徑為 ' + path); render(); }); });
    $$('[data-role="gallery-up"]').forEach(function (el) { el.addEventListener('click', function () { ensureDraft(); const i = Number(el.getAttribute('data-gallery-idx')); if (i <= 0) return; const a = dirtyDraft.gallery || []; const t = a[i - 1]; a[i - 1] = a[i]; a[i] = t; persistDraftState(); render(); }); });
    $$('[data-role="gallery-down"]').forEach(function (el) { el.addEventListener('click', function () { ensureDraft(); const i = Number(el.getAttribute('data-gallery-idx')); const a = dirtyDraft.gallery || []; if (i >= a.length - 1) return; const t = a[i + 1]; a[i + 1] = a[i]; a[i] = t; persistDraftState(); render(); }); });
    $$('[data-role="gallery-remove"]').forEach(function (el) { el.addEventListener('click', function () { ensureDraft(); const i = Number(el.getAttribute('data-gallery-idx')); dirtyDraft.gallery.splice(i, 1); persistDraftState(); render(); }); });

    const saveBtn = $('[data-role="save"]');
    if (saveBtn) saveBtn.addEventListener('click', function () { if (!commitDirtyDraft()) return; render(); });
    const cancelBtn = $('[data-role="cancel"]');
    if (cancelBtn) cancelBtn.addEventListener('click', function () { if (dirtyDraft && !confirm('放棄變更？')) return; dirtyDraft = null; clearDraftState(); render(); });
    const delBtn = $('[data-role="delete"]');
    if (delBtn) delBtn.addEventListener('click', function () { const id = selectedId; if (!id) return; if (!confirm('確定刪除？')) return; FacultyStore.remove(id); selectedId = null; dirtyDraft = null; clearDraftState(); toast('已刪除'); render(); });
    const toggleBtn = $('[data-role="toggle-status"]');
    if (toggleBtn) toggleBtn.addEventListener('click', function () { if (!selectedId) return; const p = FacultyStore.getById(selectedId); if (!p) return; const target = p.status === 'previous' ? 'current' : 'previous'; FacultyStore.moveTo(selectedId, target); currentTab = target; dirtyDraft = null; clearDraftState(); render(); });
  }

  function ensureDraft() { if (dirtyDraft) return; const p = FacultyStore.getById(selectedId); dirtyDraft = p ? JSON.parse(JSON.stringify(p)) : null; ensureProfileI18nDraft(dirtyDraft); persistDraftState(); }

  window.addEventListener('popstate', handleLeaveWithUnsavedDraft);
  window.addEventListener('beforeunload', function (e) {
    if (!hasUnsavedDraft()) return;
    e.preventDefault();
    e.returnValue = '';
  });

  document.addEventListener('keydown', function (e) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const metaOk = isMac ? e.metaKey : e.ctrlKey;
    if (metaOk && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
      e.preventDefault();
      if (rootEl) close(); else open();
    }
  });

  window.FacultyAdmin = { open, close };
})();

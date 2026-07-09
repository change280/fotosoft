/* ============================================================
 * works-data.js
 * ------------------------------------------------------------
 * 視丘家族藝廊 — 共用資料層
 *
 * 職責：
 *   1. 定義預設作品資料 (DEFAULT_WORKS) — 首次載入或重置時使用
 *   2. 提供 WorksStore 介面 — CRUD、匯入/匯出、事件廣播
 *   3. 資料實際儲存於 localStorage (key: FOTOSOFT_WORKS_V1)
 *
 * 頁面使用方式 (index.html / gallery.html / work-detail.html)：
 *   <script src="js/works-data.js"></script>
 *   const works = WorksStore.getAll();
 *   const work  = WorksStore.getById('fst42');
 *
 * 資料模型 (Work)：
 *   {
 *     id:          string   // URL slug，唯一識別 (例: 'fst42-guo-siao-ling')
 *     title:       string   // 顯示標題       (例: 'FST42-郭曉玲')
 *     subtitle:    string   // 副標 / 學員身份 (例: '日間部 第 42 期 / 學員')
 *     coverImage:  string   // 封面圖 URL (家族藝廊圖卡 & 首頁藝廊卡片)
 *     description: string   // 作品自述 / 簡介 (支援換行)
 *     date:        string   // 展出日期 (例: '2020-09-18')
 *     categories:  string[] // 分類 (預設清單擇一或多)
 *     tags:        string[] // 自訂標籤
 *     gallery:     [{ src: string, caption?: string }]  // 內頁多張作品照
 *     featured:    boolean  // 是否置入首頁「視丘藝廊」精選區
 *     createdAt:   number   // Date.now()
 *     updatedAt:   number
 *   }
 * ============================================================ */

(function (global) {
  'use strict';

  const STORAGE_KEY = 'FOTOSOFT_WORKS_V1';
  const EVENT_NAME = 'fotosoft:works-updated';

  /* ---------- 預設分類（對應舊版 fotosoft.com.tw/art-museum） ---------- */
  const DEFAULT_CATEGORIES = [
    'PLE-影像中的視覺元素',
    '影像散文-Photo-Essay',
    '影像詩作品',
    '影像中的視覺語言及其架構',
    '學生作品',
    '老師作品'
  ];

  /* ---------- 預設種子資料（沿用舊版家族藝廊前 10 位） ---------- */
  const DEFAULT_WORKS = [
    {
      id: 'fst42-guo-siao-ling',
      title: 'FST42-郭曉玲',
      subtitle: 'PLE 影像訊息書寫教育 / 學員',
      coverImage: 'https://www.fotosoft.com.tw/images/spsimpleportfolio/fst42-%E9%83%AD%E6%9B%89%E7%8E%B2/work03_600x400.webp',
      description: '透過 PLE 影像訊息書寫教育，探索影像中的視覺元素與敘事語彙。',
      date: '2020-09-18',
      categories: ['PLE-影像中的視覺元素', '學生作品'],
      tags: [],
      gallery: [
        { src: 'https://www.fotosoft.com.tw/images/student/GUO-SIAO-LING/work01.webp', caption: 'work01' },
        { src: 'https://www.fotosoft.com.tw/images/student/GUO-SIAO-LING/work02.webp', caption: 'work02' },
        { src: 'https://www.fotosoft.com.tw/images/student/GUO-SIAO-LING/work03.webp', caption: 'work03' }
      ],
      featured: true,
      createdAt: 1600387200000,
      updatedAt: 1600387200000
    },
    {
      id: 'fst40-shih-yun-you',
      title: 'FST40-施昀佑',
      subtitle: 'PLE 影像訊息書寫教育 / 學員',
      coverImage: 'https://www.fotosoft.com.tw/images/spsimpleportfolio/fst40-%E6%96%BD%E6%98%80%E4%BD%91/work-3_600x400.webp',
      description: '以視覺元素解構日常景象。',
      date: '2020-09-18',
      categories: ['PLE-影像中的視覺元素', '學生作品'],
      tags: [],
      gallery: [
        { src: 'https://www.fotosoft.com.tw/images/student/SHIH-YUN-YOU/work-3.webp' }
      ],
      featured: true,
      createdAt: 1600387200001,
      updatedAt: 1600387200001
    },
    {
      id: 'fst44-wang-shu-chun',
      title: 'FST44-王書駿',
      subtitle: 'PLE 影像訊息書寫教育 / 學員',
      coverImage: 'https://www.fotosoft.com.tw/images/spsimpleportfolio/fst44-%E7%8E%8B%E6%9B%B8%E9%A7%BF/Portrait-13_600x400.webp',
      description: '肖像影像的凝視與距離。',
      date: '2020-09-18',
      categories: ['PLE-影像中的視覺元素', '老師作品'],
      tags: [],
      gallery: [
        { src: 'https://www.fotosoft.com.tw/images/student/WANG-SHU-CHUN/Portrait-13.webp' }
      ],
      featured: true,
      createdAt: 1600387200002,
      updatedAt: 1600387200002
    },
    {
      id: 'fst49-tu-huan-chang',
      title: 'FST49-涂煥昌',
      subtitle: '影像散文 / 老師',
      coverImage: 'https://www.fotosoft.com.tw/images/spsimpleportfolio/fst49-%E6%B6%82%E7%85%A5%E6%98%8C/final1_600x400.webp',
      description: '影像散文的長期紀實實踐。',
      date: '2020-09-18',
      categories: ['影像散文-Photo-Essay', '老師作品'],
      tags: [],
      gallery: [
        { src: 'https://www.fotosoft.com.tw/images/H-C-TU/final1.webp' }
      ],
      featured: true,
      createdAt: 1600387200003,
      updatedAt: 1600387200003
    },
    {
      id: 'ple2-weekend-class',
      title: 'PLE2 假日專修班',
      subtitle: '聯合創作 / 學員',
      coverImage: 'https://www.fotosoft.com.tw/images/spsimpleportfolio/ple2_%E5%81%87%E6%97%A5%E5%B0%88%E4%BF%AE%E7%8F%AD/PLE2-Joint-work_600x400.webp',
      description: '假日專修班學員聯合創作。',
      date: '2020-09-18',
      categories: ['影像詩作品', '學生作品'],
      tags: [],
      gallery: [
        { src: 'https://www.fotosoft.com.tw/images/student/PLE2/PLE2-Joint-work.webp' }
      ],
      featured: false,
      createdAt: 1600387200004,
      updatedAt: 1600387200004
    },
    {
      id: 'visual-language-fst57-gwen',
      title: '影像中的視覺語言及其架構 / FST57-Gwen',
      subtitle: '視覺語言 / 學員',
      coverImage: 'https://www.fotosoft.com.tw/images/spsimpleportfolio/%E5%BD%B1%E5%83%8F%E4%B8%AD%E7%9A%84%E8%A6%96%E8%A6%BA%E8%AA%9E%E8%A8%80%E5%8F%8A%E5%85%B6%E6%9E%B6%E6%A7%8B/FST57-Gwen_600x400.webp',
      description: '影像結構、語法與意義的實驗性作品。',
      date: '2020-09-18',
      categories: ['影像中的視覺語言及其架構', '學生作品'],
      tags: [],
      gallery: [
        { src: 'https://www.fotosoft.com.tw/images/student/visual-language/FST57-Gwen.webp' }
      ],
      featured: false,
      createdAt: 1600387200005,
      updatedAt: 1600387200005
    },
    {
      id: 'fst62-lin-hsin-chih',
      title: 'FST62-林信志',
      subtitle: 'PLE 影像訊息書寫教育 / 學員',
      coverImage: 'https://www.fotosoft.com.tw/images/spsimpleportfolio/fst62-%E6%9E%97%E4%BF%A1%E5%BF%97/FST62-Billy-1_600x400.webp',
      description: '光線與空間的細節書寫。',
      date: '2020-09-18',
      categories: ['PLE-影像中的視覺元素', '學生作品'],
      tags: [],
      gallery: [
        { src: 'https://www.fotosoft.com.tw/images/student/LIN-HSIN-CHIH/FST62-Billy-1.webp' }
      ],
      featured: false,
      createdAt: 1600387200006,
      updatedAt: 1600387200006
    },
    {
      id: 'fst49-tu-huan-chang-2',
      title: 'FST49-涂煥昌（PLE 系列）',
      subtitle: 'PLE 影像訊息書寫教育 / 老師',
      coverImage: 'https://www.fotosoft.com.tw/images/spsimpleportfolio/fst49%E6%B6%82%E7%85%A5%E6%98%8C/TU-2_600x400.webp',
      description: '影像訊息書寫教育中的示範作品。',
      date: '2020-09-18',
      categories: ['PLE-影像中的視覺元素', '老師作品'],
      tags: [],
      gallery: [
        { src: 'https://www.fotosoft.com.tw/images/student/TU-HUAN-CHANG/TU-2.webp' }
      ],
      featured: false,
      createdAt: 1600387200007,
      updatedAt: 1600387200007
    },
    {
      id: 'fst59-chen-tien-chien',
      title: 'FST59-陳天健',
      subtitle: 'PLE 影像訊息書寫教育 / 老師',
      coverImage: 'https://www.fotosoft.com.tw/images/spsimpleportfolio/fst59-%E9%99%B3%E5%A4%A9%E5%81%A5/CHEN-TIEN-CHIEN-1_600x400.webp',
      description: '影像與時間的凝結。',
      date: '2020-09-18',
      categories: ['PLE-影像中的視覺元素', '老師作品'],
      tags: [],
      gallery: [
        { src: 'https://www.fotosoft.com.tw/images/student/CHEN-TIEN-CHIEN/CHEN-TIEN-CHIEN-1.webp' }
      ],
      featured: false,
      createdAt: 1600387200008,
      updatedAt: 1600387200008
    },
    {
      id: 'fst55-hsiao-wan-chen',
      title: 'FST55-蕭琬臻',
      subtitle: 'PLE 影像訊息書寫教育 / 老師',
      coverImage: 'https://www.fotosoft.com.tw/images/spsimpleportfolio/fst55-%E8%95%AD%E7%90%AC%E8%87%BB/CH-1_600x400.webp',
      description: '色彩與構圖的個人詮釋。',
      date: '2020-09-18',
      categories: ['PLE-影像中的視覺元素', '老師作品'],
      tags: [],
      gallery: [
        { src: 'https://www.fotosoft.com.tw/images/student/HSIAO-WAN-CHEN/CH-1.webp' }
      ],
      featured: false,
      createdAt: 1600387200009,
      updatedAt: 1600387200009
    }
  ];

  /* ---------------------------------------------------------- */
  /* Utility                                                     */
  /* ---------------------------------------------------------- */

  function safeParse(json) {
    try { return JSON.parse(json); } catch (_) { return null; }
  }

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u4e00-\u9fa5-]/g, '')
      .replace(/-+/g, '-')
      .slice(0, 60) || 'work-' + Date.now();
  }

  function broadcast() {
    try {
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    } catch (_) { /* noop */ }
  }

  function resolveAssetPath(path) {
    const src = String(path || '').trim();
    if (!src) return '';
    if (/^(?:https?:)?\/\//i.test(src) || /^data:/i.test(src)) return src;
    if (!src.startsWith('/')) return src;

    const repoPrefix = '/fotosoft';
    if (src === repoPrefix || src.startsWith(repoPrefix + '/')) return src;

    const host = (typeof location !== 'undefined' && location.hostname) ? location.hostname : '';
    const pathname = (typeof location !== 'undefined' && location.pathname) ? location.pathname : '/';
    const isGitHubPages = /github\.io$/i.test(host);
    const underRepoPath = pathname === repoPrefix || pathname.startsWith(repoPrefix + '/');
    if (!isGitHubPages && !underRepoPath) return src;

    return repoPrefix + src;
  }

  /* ---------------------------------------------------------- */
  /* Store                                                       */
  /* ---------------------------------------------------------- */

  const WorksStore = {
    STORAGE_KEY,
    EVENT_NAME,
    DEFAULT_CATEGORIES,

    /** 首次載入時寫入預設資料 */
    _seedIfEmpty() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_WORKS));
      }
    },

    /** 取得全部作品（依 createdAt 遞增排序 = 舊版顯示順序） */
    getAll() {
      this._seedIfEmpty();
      const data = safeParse(localStorage.getItem(STORAGE_KEY)) || [];
      return data.slice().sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    },

    getById(id) {
      return this.getAll().find(w => w.id === id) || null;
    },

    /** 取得首頁「視丘藝廊」精選（featured=true） */
    getFeatured() {
      return this.getAll().filter(w => w.featured);
    },

    /** 取得所有出現過的分類（預設 + 自訂） */
    getAllCategories() {
      const set = new Set(DEFAULT_CATEGORIES);
      this.getAll().forEach(w => (w.categories || []).forEach(c => set.add(c)));
      return Array.from(set);
    },

    coverOf(work) {
      if (!work) return '';
      return resolveAssetPath(work.coverImage || '');
    },

    galleryOf(work) {
      if (!work || !Array.isArray(work.gallery)) return [];
      return work.gallery
        .filter(g => g && g.src)
        .map(g => ({
          src: resolveAssetPath(g.src),
          caption: g.caption || '',
          alt: g.alt || ''
        }));
    },

    assetPath(path) {
      return resolveAssetPath(path);
    },

    /** 新增 / 更新 (upsert) */
    save(work) {
      const list = this.getAll();
      const now = Date.now();
      const isNew = !work.id || !list.some(w => w.id === work.id);

      const normalized = {
        id: work.id || slugify(work.title) + '-' + now.toString(36),
        title: (work.title || '未命名作品').trim(),
        subtitle: (work.subtitle || '').trim(),
        coverImage: (work.coverImage || '').trim(),
        description: (work.description || '').trim(),
        date: work.date || new Date(now).toISOString().slice(0, 10),
        categories: Array.isArray(work.categories) ? work.categories.filter(Boolean) : [],
        tags: Array.isArray(work.tags) ? work.tags.filter(Boolean) : [],
        gallery: Array.isArray(work.gallery) ? work.gallery.filter(g => g && g.src) : [],
        featured: !!work.featured,
        createdAt: work.createdAt || now,
        updatedAt: now
      };

      const next = isNew
        ? list.concat([normalized])
        : list.map(w => (w.id === normalized.id ? normalized : w));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      broadcast();
      return normalized;
    },

    /** 刪除 */
    remove(id) {
      const next = this.getAll().filter(w => w.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      broadcast();
    },

    /** 重置為預設資料 */
    reset() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_WORKS));
      broadcast();
    },

    /** 匯出成 JSON 字串（供下載 works.json） */
    exportJSON() {
      return JSON.stringify(this.getAll(), null, 2);
    },

    /** 匯入 JSON（陣列） */
    importJSON(jsonString, mode) {
      const data = typeof jsonString === 'string' ? safeParse(jsonString) : jsonString;
      if (!Array.isArray(data)) throw new Error('匯入資料格式錯誤：必須為陣列');

      if (mode === 'merge') {
        const map = new Map(this.getAll().map(w => [w.id, w]));
        data.forEach(w => { if (w && w.id) map.set(w.id, w); });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(map.values())));
      } else {
        // 預設為 replace
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      broadcast();
    },

    /** 訂閱資料變更 (跨頁籤同步 + 同頁 CRUD) */
    subscribe(callback) {
      const handler = () => callback();
      window.addEventListener(EVENT_NAME, handler);
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) callback();
      });
      return () => window.removeEventListener(EVENT_NAME, handler);
    },

    /** slug helper 供 admin 使用 */
    slugify
  };

  global.WorksStore = WorksStore;
})(window);

/* ============================================================
 * insights-data.js
 * ------------------------------------------------------------
 * 視丘尖端洞察（Insights） — 共用資料層
 *
 * 頁面使用：
 *   <script src="js/insights-data.js"></script>
 *   const list = InsightsStore.getAll();
 *   const post = InsightsStore.getById('ernst-haas-birthday');
 *
 * 資料模型 (Insight)：
 *   {
 *     id:            string   // URL slug，唯一識別
 *     title:         string
 *     subtitle:      string
 *     author:        string   // 例：吳嘉寶 / Chia-Pao Wu
 *     publishedDate: string   // 'YYYY-MM-DD'
 *     coverImage:    string   // 卡片封面 + 詳細頁 hero；未填會 fallback 到圖庫
 *     categories:    string[] // 例：['專欄','攝影史']
 *     tags:          string[]
 *     summary:       string   // 卡片摘要（若空會自動由 blocks 抽首段）
 *     featured:      boolean  // 是否置入首頁「尖端洞察」精選（首頁只取 1 篇最新精選）
 *     blocks: Block[]         // 內文區塊，順序即呈現順序
 *     createdAt:     number
 *     updatedAt:     number
 *   }
 *
 * Block（自由穿插的內文區塊）：
 *   { type: 'heading',   level: 2|3,      text: string }
 *   { type: 'paragraph', text: string }                 // 允許 \n\n 分段
 *   { type: 'quote',     text: string,    cite?: string }
 *   { type: 'image',     src: string,     caption?: string, alt?: string, size?: 'large'|'small' }
 *   { type: 'divider' }
 *
 *   image.size：
 *     'large'（預設）→ 大圖，寬度佔滿內文欄寬。
 *     'small'        → 縮圖，最長邊約為大圖最長邊的 1/3。
 * ============================================================ */

(function (global) {
  'use strict';

  const STORAGE_KEY = 'FOTOSOFT_INSIGHTS_V1';
  const EVENT_NAME  = 'fotosoft:insights-updated';
  const REMOTE_JSON = 'insights-data.json';

  /* 圖庫：未指定封面時，用 id 做雜湊挑一張作為 fallback */
  const FALLBACK_COVERS = [
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519183071298-a2962feb14f4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526481280695-3c4696237c00?q=80&w=1200&auto=format&fit=crop'
  ];

  const DEFAULT_CATEGORIES = [
    '專欄','攝影史','影像理論','視覺心理','教育觀察','時事評論','人物紀念'
  ];

  /* ---------- 預設種子資料（示範文章） ---------- */
  const DEFAULT_INSIGHTS = [
    {
      id: 'ernst-haas-birthday',
      title: 'Ernst Haas 生日快樂！',
      subtitle: '紀念一位讓彩色攝影登堂入室的大師',
      author: '吳嘉寶',
      publishedDate: '2020-03-02',
      coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
      categories: ['專欄','攝影史','人物紀念'],
      tags: ['Ernst Haas','彩色攝影','Magnum'],
      summary: 'Ernst Haas 於 1921 年 3 月 2 日在奧地利維也納出生。他是史上第一位在紐約 MoMA 舉辦彩色攝影個展的攝影家。',
      featured: true,
      blocks: [
        { type: 'paragraph', text: 'Ernst Haas 於 1921 年 3 月 2 日在奧地利維也納出生，1986 年 9 月 12 日於美國紐約辭世，享年 65 歲。他是史上第一位在紐約現代美術館 MoMA 舉辦彩色攝影個展的攝影家（1962 年），也是 Magnum 早期最重要的成員之一。' },
        { type: 'heading', level: 2, text: '色彩，攝影的新語言' },
        { type: 'paragraph', text: 'Haas 在戰後的維也納街頭拍下無數黑白影像，但真正讓他成為傳奇的，是他敢在 1950 年代末期就以柯達克羅姆彩色片深入紐約街頭、賽事現場與抽象光影。當時彩色攝影仍被視為「商業」而非「藝術」，Haas 是最早以彩色影像進行嚴肅創作論述的少數。' },
        { type: 'image', src: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1400&auto=format&fit=crop', caption: '紐約街頭的光與色 — Haas 常用慢速快門在移動中捕捉抽象色彩。' },
        { type: 'quote', text: '重要的不是你看到什麼，而是你如何看見它。', cite: 'Ernst Haas' },
        { type: 'heading', level: 2, text: '從新聞攝影到抽象視覺詩' },
        { type: 'paragraph', text: '1949 年，Robert Capa 邀請 Haas 加入 Magnum。他從報導攝影出發，卻在 1950 年代初期完成了他最具代表性的作品《Homecoming》— 記錄戰後戰俘回到維也納火車站的動人瞬間，這組作品讓 LIFE 雜誌以史無前例的 24 頁彩色跨頁刊登。' },
        { type: 'paragraph', text: '此後 Haas 的工作愈來愈朝向抽象，他把運動、跳躍、水花、色塊、倒影都當作「視覺的音符」。他在 1971 年出版的《The Creation》以攝影重新演繹《創世紀》，是彩色攝影書史上的里程碑。' },
        { type: 'divider' },
        { type: 'paragraph', text: '「視丘攝影圖書館」典藏多本 Haas 的重要作品集，歡迎有興趣的朋友到館參閱。攝影史不只是知識，更是我們理解「觀看」這件事的長線索引。' }
      ]
    },
    {
      id: 'why-photography-literacy',
      title: '為什麼在 AI 時代，我們更需要學習「影像讀寫」？',
      subtitle: 'PLE 影像訊息讀寫教育的當代必要性',
      author: '吳嘉寶',
      publishedDate: '2024-05-20',
      coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
      categories: ['專欄','影像理論','教育觀察'],
      tags: ['AI','PLE','影像讀寫'],
      summary: 'AI 可以生成完美的像素，但無法取代人類觀看世界的獨特視角。在演算技術爆發的年代，創作者的核心競爭力將回歸到最根本的美學涵養與視覺論述能力。',
      featured: true,
      blocks: [
        { type: 'paragraph', text: '2023 年之後，生成式 AI 讓「產出一張像模像樣的照片」變得幾乎零門檻。這件事對攝影教育提出了一個尖銳的問題：既然機器能生成，人還要學什麼？' },
        { type: 'heading', level: 2, text: '技術會過時，讀寫能力不會' },
        { type: 'paragraph', text: '相機的操作、後製的技法、甚至構圖法則，都是「工具層」的知識。它們會隨著設備與軟體更新而不斷改寫。但一張影像為什麼「打動人」— 這是屬於視覺心理學、藝術史與符號學的問題，是任何演算法都無法自動給出的答案。' },
        { type: 'image', src: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1400&auto=format&fit=crop', caption: 'AI 可以生成無數張技術完美的影像，但「意義」仍需要人來賦予。' },
        { type: 'heading', level: 2, text: 'PLE：Photo Literacy Education' },
        { type: 'paragraph', text: '視丘自 1985 年創校起提倡的「PLE 影像訊息讀寫教育」，正是為了培養「能讀懂影像、也能用影像書寫」的當代創作者。它包含三個層次：\n\n1. Read — 拆解一張影像的視覺元素、符號與文化脈絡\n2. Write — 用影像作為主要語言表達思想\n3. Edit — 在多影像的序列中建構論述與敘事' },
        { type: 'quote', text: '攝影不是一項技藝，而是理解世界的一種語言。', cite: '視丘教育理念' }
      ]
    },
    {
      id: 'seeing-is-not-looking',
      title: '看見（Seeing）不等於觀看（Looking）',
      subtitle: '視覺心理學給攝影家的第一堂課',
      author: '吳嘉寶',
      publishedDate: '2023-11-10',
      coverImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1200&auto=format&fit=crop',
      categories: ['專欄','視覺心理'],
      tags: ['視覺心理','認知','觀看'],
      summary: '眼睛接收光線，但真正「看見」發生在大腦。攝影家若不理解這件事，就只能拍出「拍到什麼」，而無法拍出「想讓別人看見什麼」。',
      featured: false,
      blocks: [
        { type: 'paragraph', text: '在視覺心理學中，「Looking」是眼球接收光線的生理過程；「Seeing」則是大腦對這些訊號進行辨識、篩選、賦予意義的認知過程。兩者相差的，是整個文化與經驗的厚度。' },
        { type: 'heading', level: 2, text: '為什麼兩個人看同一個場景會拍出不同照片？' },
        { type: 'paragraph', text: '答案在於「注意力」。人眼一次只能高解析度地看清楚視野中約 2 度的範圍，其餘都是低解析度的邊視。我們以為自己「看到全景」，其實是大腦快速跳視（saccade）後拼貼出來的錯覺。' },
        { type: 'image', src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1400&auto=format&fit=crop', caption: '眼動實驗顯示：人在觀看肖像時，注意力會反覆停留在眼睛與嘴巴。' },
        { type: 'paragraph', text: '所以「拍照」這件事，某種程度上就是「凍結你選擇注意的東西」。這也是為什麼視丘的課程從一開始就強調視覺心理學 — 沒有這層自覺，攝影家就會停留在「拍到什麼」的層次。' }
      ]
    }
  ];

  /* ---------- Utility ---------- */
  function safeParse(s) { try { return JSON.parse(s); } catch (_) { return null; } }
  function slugify(text) {
    return String(text || '')
      .toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u4e00-\u9fa5-]/g, '')
      .replace(/-+/g, '-')
      .slice(0, 60) || 'insight-' + Date.now();
  }
  function broadcast() {
    try { window.dispatchEvent(new CustomEvent(EVENT_NAME)); } catch (_) {}
  }
  function stableHash(s) {
    let h = 0;
    s = String(s || '');
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }

  /* ---------- Store ---------- */
  const InsightsStore = {
    STORAGE_KEY, EVENT_NAME, DEFAULT_CATEGORIES, FALLBACK_COVERS,

    _seedIfEmpty() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INSIGHTS));
    },

    /** 新到舊排序 */
    getAll() {
      this._seedIfEmpty();
      const data = safeParse(localStorage.getItem(STORAGE_KEY)) || [];
      return data.slice().sort((a, b) => {
        const ta = Date.parse(a.publishedDate || '') || (a.createdAt || 0);
        const tb = Date.parse(b.publishedDate || '') || (b.createdAt || 0);
        return tb - ta;
      });
    },

    getById(id) {
      return this.getAll().find(i => i.id === id) || null;
    },

    /** 首頁精選（最新的 featured 一篇） */
    getFeatured(limit) {
      const arr = this.getAll().filter(i => i.featured);
      return typeof limit === 'number' ? arr.slice(0, limit) : arr;
    },

    getAllCategories() {
      const set = new Set(DEFAULT_CATEGORIES);
      this.getAll().forEach(i => (i.categories || []).forEach(c => c && set.add(c)));
      return Array.from(set);
    },

    /** 依 id 產生穩定 fallback 封面 */
    pickFallbackCover(id) {
      return FALLBACK_COVERS[stableHash(id) % FALLBACK_COVERS.length];
    },

    coverOf(post) {
      if (!post) return '';
      return (post.coverImage && post.coverImage.trim()) || this.pickFallbackCover(post.id);
    },

    /** 由 blocks 抽首段當摘要（若原 summary 為空） */
    summaryOf(post, maxLen) {
      if (!post) return '';
      if (post.summary && post.summary.trim()) return post.summary.trim();
      const first = (post.blocks || []).find(b => b && b.type === 'paragraph' && b.text);
      const raw = first ? String(first.text).replace(/\s+/g, ' ').trim() : '';
      const max = maxLen || 100;
      return raw.length > max ? raw.slice(0, max) + '…' : raw;
    },

    save(post) {
      const list = this.getAll();
      const now = Date.now();
      const isNew = !post.id || !list.some(i => i.id === post.id);
      const normalized = {
        id: post.id || (slugify(post.title) + '-' + now.toString(36)),
        title: (post.title || '未命名文章').trim(),
        subtitle: (post.subtitle || '').trim(),
        author: (post.author || '').trim(),
        publishedDate: post.publishedDate || new Date(now).toISOString().slice(0, 10),
        coverImage: (post.coverImage || '').trim(),
        categories: Array.isArray(post.categories) ? post.categories.filter(Boolean) : [],
        tags: Array.isArray(post.tags) ? post.tags.filter(Boolean) : [],
        summary: (post.summary || '').trim(),
        featured: !!post.featured,
        blocks: Array.isArray(post.blocks) ? post.blocks.filter(b => b && b.type) : [],
        createdAt: post.createdAt || now,
        updatedAt: now
      };
      const next = isNew
        ? list.concat([normalized])
        : list.map(i => (i.id === normalized.id ? normalized : i));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) { console.warn('[insights] quota', e); }
      broadcast();
      return normalized;
    },

    remove(id) {
      const next = this.getAll().filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      broadcast();
    },

    reset() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INSIGHTS));
      broadcast();
    },

    exportJSON() {
      return JSON.stringify(this.getAll(), null, 2);
    },

    importJSON(jsonString, mode) {
      const data = typeof jsonString === 'string' ? safeParse(jsonString) : jsonString;
      if (!Array.isArray(data)) throw new Error('匯入資料格式錯誤：必須為陣列');
      if (mode === 'merge') {
        const map = new Map(this.getAll().map(i => [i.id, i]));
        data.forEach(i => { if (i && i.id) map.set(i.id, i); });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(map.values())));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      broadcast();
    },

    /** 嘗試從 insights-data.json 拉最新資料覆蓋（用於部署後同步） */
    refreshFromRemote() {
      return fetch(REMOTE_JSON + '?t=' + Date.now(), { cache: 'no-store' })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!Array.isArray(data)) return false;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          broadcast();
          return true;
        })
        .catch(() => false);
    },

    subscribe(callback) {
      const handler = () => callback();
      window.addEventListener(EVENT_NAME, handler);
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) callback();
      });
      return () => window.removeEventListener(EVENT_NAME, handler);
    },

    slugify
  };

  global.InsightsStore = InsightsStore;
})(window);

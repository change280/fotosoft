/* ============================================================
 * courses-data.js
 * ------------------------------------------------------------
 * 視丘招生課程 — 共用資料層（兩套：全職養成 / 線上單元課程）
 *
 * 頁面使用：
 *   <script src="js/courses-data.js"></script>
 *   const list = CoursesStore.getByTrack('online');
 *   const c = CoursesStore.getById('visual-language');
 *
 * 資料模型 (Course)：
 *   {
 *     id:         string    // URL slug，唯一
 *     track:      'fulltime' | 'online'   // 全職養成 / 線上單元課程
 *     index:      string     // 卡片編號顯示（如 '01'）
 *     title:      string
 *     subtitle:   string
 *     tag:        string     // 卡片標籤（如 '入門'、'大師研究'）
 *     kicker:     string     // 詳情頁英文小標
 *     schedule:   string     // 上課時段（如 '週二 20:00–22:00'）
 *     cardImage:  string     // 總覽卡片圖
 *     cardDesc:   string     // 總覽卡片短描述
 *     heroImage:  string     // 詳情頁 hero 背景圖
 *     intro:      string     // 詳情頁 hero 下方導言
 *     enrollUrl:  string     // 報名連結
 *     externalUrl:string     // 若填寫，總覽卡片直接連到外部（如只有報名表單的課程）
 *     featured:   boolean    // 是否顯示於首頁 PROGRAMS
 *     blocks:     Block[]    // 詳情頁內容區塊（順序即呈現順序）
 *     order, createdAt, updatedAt
 *   }
 *
 * Block（自由穿插）：
 *   { type:'heading',   text, level? }
 *   { type:'paragraph', text }                       // 允許 \n\n 分段
 *   { type:'quote',     text, cite? }
 *   { type:'image',     src, caption?, alt?, size?:'large'|'small' }
 *   { type:'divider' }
 *   { type:'info',      heading?, items:[{icon?,label,value}] }        // 課程資訊列
 *   { type:'lessons',   heading?, items:[{title, lines:[string]}] }    // 課程內容分堂
 *   { type:'cards',     heading?, columns?:2|3, items:[{title,desc}] } // 誰適合 / 學到 / 九大 / 五階段
 *   { type:'checklist', heading?, items:[string] }                     // 條列（誰適合簡列 / 課前準備）
 *   { type:'teacher',   heading?, items:[{name,role,photo,link,badge?}] }
 *   { type:'callout',   title, text, url?, urlLabel? }                 // 深色資訊框（說明會）
 *   { type:'cta',       label, url }                                   // 報名按鈕
 * ============================================================ */

(function (global) {
  'use strict';

  const STORAGE_KEY = 'FOTOSOFT_COURSES_V1';
  const EDITED_KEY  = 'FOTOSOFT_COURSES_EDITED';
  const EVENT_NAME  = 'fotosoft:courses-updated';
  const REMOTE_JSON = 'courses-data.json';

  const FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSdo6N37HiASv1EBmmRQnyvXPiH3sDAv7fjKVP9GPe7sMh0VQQ/viewform?usp=sf_link';
  const INFO_SESSION = 'https://docs.google.com/forms/d/e/1FAIpQLSdXoaP2utrgzwpUxV0wlWlWd8ecpb2roEUtXjubq0WSN7H0cA/viewform';

  const TRACKS = {
    fulltime: { key: 'fulltime', label: '全職養成', en: 'Full-time Program', page: 'fulltime-detail.html' },
    online:   { key: 'online',   label: '線上單元課程', en: 'Online Module', page: 'online-detail.html' }
  };

  const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519183071298-a2962feb14f4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526481280695-3c4696237c00?q=80&w=1200&auto=format&fit=crop'
  ];

  /* ---------- Block factory helpers（僅用於種子資料，讓內容更好讀） ---------- */
  const H  = (text) => ({ type: 'heading', text });
  const P  = (text) => ({ type: 'paragraph', text });
  const IMG = (src, size, caption) => ({ type: 'image', src, size: size || 'large', caption: caption || '' });
  const QUOTE = (text, cite) => ({ type: 'quote', text, cite: cite || '' });
  const DIV = () => ({ type: 'divider' });
  const INFO = (items, heading) => ({ type: 'info', heading: heading || '課程資訊', items });
  const LESSONS = (items, heading) => ({ type: 'lessons', heading: heading || '課程內容', items });
  const CARDS = (heading, columns, items) => ({ type: 'cards', heading, columns: columns || 3, items });
  const CHECK = (heading, items) => ({ type: 'checklist', heading, items });
  const TEACHER = (items, heading) => ({ type: 'teacher', heading: heading || '老師介紹', items });
  const CALLOUT = (title, text, url, urlLabel) => ({ type: 'callout', title, text, url: url || '', urlLabel: urlLabel || '' });
  const CTA = (label, url) => ({ type: 'cta', label: label || '點我報名', url: url || FORM });
  const NOTES = () => CHECK('備註', [
    '課程需完成繳費始完成報名。',
    '為維持課程內容的最新、最完整，視丘保持隨時修改課程內容的權利。',
    '課程設計著作權為吳嘉寶所有，任何形式的複製均應事前徵得作者的書面同意。'
  ]);

  const T_WU = { name: '吳嘉寶', role: '台北視丘攝影藝術學院暨中華攝影教育學會創辦人', photo: '/image/faculty/JIABAO_portraita.webp', link: 'faculty-detail.html?id=wu-chia-pao' };
  const T_TU = { name: '涂煥昌', role: 'PLE 影像風格養成所 日間部 講師', photo: '/image/faculty/涂煥昌00.webp', link: 'faculty-detail.html?id=h-c-tu' };

  /* ============================================================
   * 預設種子資料
   * ============================================================ */
  const DEFAULT_COURSES = [

    /* ---------- 全職養成 ---------- */
    {
      id: 'ple', track: 'fulltime', index: '01',
      title: 'PLE 影像風格養成所 日間部',
      subtitle: '原日間部・一年制系統課程｜總體說明',
      tag: '一年制系統', kicker: 'Full-time Program',
      schedule: '採線上一對一 / 一對多說明會',
      cardImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1200&auto=format&fit=crop',
      cardDesc: '涵蓋「視覺、影像、攝影、藝術創作、訊息傳播」五大面向的全備理論系統，培養攝影 4.0 時代的影像傳播專業人才。',
      heroImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1600&auto=format&fit=crop',
      intro: '以「影像當文字使用」的 PLE 影像訊息讀寫教育為核心，結構嚴謹、理論全備的一年制系統課程。',
      enrollUrl: INFO_SESSION, externalUrl: '', featured: true,
      blocks: [
        H('課程簡介'),
        P('「影像風格養成所」，顧名思義就是訓練年輕一代既能隨心所欲地創造影像、用影像表達自我，更能讓自己創造的影像具備獨特風格，讓觀者印象深刻的能力，讓自己成為影像傳播時代的影像專業人才。'),
        P('PLE 是「Photo Literacy Education 影像訊息讀寫教育」的縮寫，顧名思義就是：訓練同學能夠把「影像當文字使用」的教育。2010 年起世界攝影已進入「攝影 4.0 版時代」，影像早已取代文字，成為新世代表達自我的主要工具。'),
        P('面對影像無所不在、傳媒中「影像驅逐文字」的攝影 4.0 版時代，人人都應該學習認識影像，更何況是想要借用影像主動傳遞訊息的專業攝影人員。「視丘 PLE 影像風格養成所」是一套結構嚴謹、理論全備的攝影知識系統，整套課程涵蓋攝影 4.0 版時代影像傳播專業人才所需的「視覺、影像、攝影、藝術創作、訊息傳播」五大面向的全備理論系統。'),
        CARDS('總體教育目標｜九大攝影軟實力 Photo Smart Power', 2, [
          { title: '掌握「優勢鏡位 Vantage Point」', desc: '使用影像精準敘事、圖像敘事口條清晰的能力' },
          { title: '運用「視覺語言與其結構 Visual Language」', desc: '經營影像美感內容，豐富影像感受性訊息' },
          { title: '經營「視覺動力 Visual Dynamics」', desc: '賦予影像整體豐富生機與能量' },
          { title: '運用「影子的語言 Language of Cast Shadow」', desc: '豐富視覺虛實平衡與辯證思考訊息' },
          { title: '運用「影像媒體語言 Media Language」', desc: '強化影像軟媒特質、豐富影像感受性訊息' },
          { title: '運用「影像語意 Semantic Meaning」', desc: '擴散並增強單一影像訊息厚度、賦予形而上訊息' },
          { title: '運用「影像間脈絡性訊息 Contextual Meaning」', desc: '在影像群中把對的影像放在對的地方，利於精準長篇敘事' },
          { title: '運用圖像經典「引經據典 Allusive Style」', desc: '以圖像結構暗喻藝術史經典，擴增並強化訊息厚度' },
          { title: '「多元解讀影像 Multiple Interpretation」', desc: '強化精準挑選「合目的」影像的能力，為影像書寫形上內容的重要基礎' }
        ]),
        H('教育哲學'),
        P('繼承現代藝術教育典範包浩斯 Bauhaus 精神，以「Learning by Doing 做中學」與「Practice before Theory 用理論解釋同學的作業」兩大主軸的實戰教育理念，循序漸進地訓練學生的感受力、想像力、理解力、思考力與融合力。'),
        CHECK('Learning by Doing 做中學：學習生活的八大部分', [
          '依照指定進度製作作業', '策劃並執行個展或月評審展覽創作', '觀賞同學個展或美術館著名展覽', '思考並書寫觀展與上課心得',
          '依進度研究並思考史上重要大師作品集', '依進度研究並思考史上重要藝術電影', '思考並臨摹著名大師重要作品', '上課與同學老師一起討論評價作業'
        ]),
        P('Practice before Theory：同學先依進度做作業，老師再與同學一起討論每一張作業。討論時以視覺藝術相關的各種「學術理論」與大師作品為基礎評論，同學將學到：視覺心理學、認知心理學、Alfred L. Yarbus 眼動追蹤、David Marr 視覺理論、Bauhaus 圖像理論、當代藝術理論、影像傳播理論等，以及西洋藝術史、電影史、攝影史等歷史源流，最終具備面對時代更迭所需的 Unlearn 與 Relearn 能力。'),
        CARDS('學習架構｜五階段循序漸進', 2, [
          { title: '一、影像識字', desc: '學習用「影像中的視覺語言及其架構」觀看世界與單字型影像書寫。' },
          { title: '二、影像書法', desc: '影像美學的普世價值與個人影像風格的建立。' },
          { title: '三、影像造詞', desc: '影像與文字、影像拼貼、三聯作。' },
          { title: '四、影像散文', desc: '短小精練的影像詩歌。' },
          { title: '五、影像小說、影像裝置展與影像劇場', desc: '書寫深刻動人的影像文學作品。' }
        ]),
        CALLOUT('PLE 影像風格養成所 · 線上即時視訊招生說明會',
          '由視丘創辦人吳嘉寶老師親自講解、親自 Q&A 回應的 Zoom 線上一對一或一對多說明會。內容包括：世界攝影發展的最新狀況與未來趨勢、攝影進化五時代的斷代、攝影 5.0 時代如何學好紮實的攝影觀念與技術、為期一年的課程系統結構介紹，以及畢業學長姐作業與作品分享。',
          INFO_SESSION, '預約說明會報名表單'),
        TEACHER([T_WU])
      ]
    },

    /* ---------- 線上單元課程 ---------- */
    {
      id: 'visual-language', track: 'online', index: '02',
      title: '影像解讀：視覺語言入門班',
      subtitle: '用世界通行的視覺語言，讓照片言之有物',
      tag: '入門', kicker: 'Online Module',
      schedule: '週二 20:00–22:00',
      cardImage: 'https://images.unsplash.com/photo-1519183071298-a2962feb14f4?q=80&w=1200&auto=format&fit=crop',
      cardDesc: '認識影像承載的三層訊息，學會用世界通行的「視覺語言」讓照片言之有物。',
      heroImage: 'https://images.unsplash.com/photo-1519183071298-a2962feb14f4?q=80&w=1600&auto=format&fit=crop',
      intro: '本課程培養學員能夠用世界通行的「專業與藝術圖像專用的視覺語言」，用影像媒體表達自己的感受與想法。',
      enrollUrl: FORM, externalUrl: '', featured: true,
      blocks: [
        INFO([
          { icon: 'fa-solid fa-desktop', label: '班別', value: '線上班' },
          { icon: 'fa-regular fa-calendar', label: '堂數', value: '5 堂（共 10 小時）' },
          { icon: 'fa-regular fa-clock', label: '時間', value: '每週二 20:00–22:00' },
          { icon: 'fa-solid fa-location-dot', label: '上課地點', value: '線上授課' },
          { icon: 'fa-solid fa-tag', label: '費用', value: '體驗價 NT$ 4,000（原價 NT$ 6,200）' }
        ]),
        LESSONS([
          { title: '第一堂', lines: ['單張影像承載的三層訊息', '攝影的真相', '影像訊息傳播的結構'] },
          { title: '第二堂', lines: ['影像中的視覺元素：造形之造形家族'] },
          { title: '第三堂', lines: ['影像中的視覺元素：造形之線條'] },
          { title: '第四堂', lines: ['影像中的視覺元素：影調'] },
          { title: '第五堂', lines: ['影像中的視覺元素：色彩'] }
        ]),
        CHECK('誰適合這堂課', [
          '喜歡攝影，希望自己拍的照片「言之有物」的人', '網路媒體小編，想拍出好照片、挑對好照片的人', '想斜槓兼差接案當專業攝影師的人',
          '希望照片能精準表達自己想法或感受的人', '想學會欣賞攝影藝術、一窺影像堂奧的人', '想用手機也能拍出作品等級照片的人'
        ]),
        H('課程說明'),
        P('國際知名美國攝影家 Philip-Lorca diCorcia 說得好：「攝影是每個人都認為他自己也能說的外語。」在專業與藝術圖像的世界裡通行的「視覺語言」，對一般人而言其實有如外國話一樣難懂。'),
        P('視丘積累 38 年專業攝影教育經驗告訴我們，一張影像承載的訊息共有三層：第一層是「生物生存本能所需的訊息」，視丘稱為「蛋殼性訊息」；第二層是圖像藝術專屬、全世界通行、能產生美感感受的「視覺語言及其結構」，視丘稱為「蛋白性訊息」，是人人易懂易學的「影像白話文」；第三層是能讓觀者進入聯想、解讀，甚至影像文學層次的「影像語意 semantic meaning」，視丘稱為「蛋黃性訊息」，是高層次影像的精華所在。'),
        P('本課程的教學目標，就是讓所有學員透過五堂課認識基礎性的「影像中的視覺語言及其結構」，讓觀者能夠從你拍的或挑選的影像裡看到影像自己講的白話文。'),
        TEACHER([T_TU]),
        NOTES(),
        CTA('點我報名', FORM)
      ]
    },
    {
      id: 'collage', track: 'online', index: '03',
      title: '影像創作班｜主題一：拼貼',
      subtitle: '以攝影拼貼掌握影像語意與圖像構成',
      tag: '影像創作', kicker: 'Online Module',
      schedule: '週一 20:00–22:00',
      cardImage: 'https://images.unsplash.com/photo-1526481280695-3c4696237c00?q=80&w=1200&auto=format&fit=crop',
      cardDesc: '透過攝影拼貼掌握「影像語意」，練習視覺平衡、群化與視覺動力等圖像構成技巧。',
      heroImage: 'https://images.unsplash.com/photo-1526481280695-3c4696237c00?q=80&w=1600&auto=format&fit=crop',
      intro: '藉由介紹攝影拼貼作品與實作練習，認識並掌握運用圖像傳遞第三層訊息：「影像的語意 Semantic Meaning」的能力，同時掌握控制圖像整體視覺平衡並賦予視覺動力等基本圖像構成技巧。',
      enrollUrl: FORM, externalUrl: '', featured: true,
      blocks: [
        INFO([
          { icon: 'fa-solid fa-desktop', label: '班別', value: '線上班' },
          { icon: 'fa-regular fa-calendar-check', label: '預定上課日', value: '採預約報名（招生滿 6 位即開課）' },
          { icon: 'fa-regular fa-calendar', label: '堂數', value: '5 堂（共 10 小時）' },
          { icon: 'fa-regular fa-clock', label: '時間', value: '每週一 20:00–22:00' },
          { icon: 'fa-solid fa-tag', label: '費用', value: '體驗價 NT$ 4,000（原價 NT$ 6,200）' }
        ]),
        LESSONS([
          { title: '第一堂：了解攝影拼貼 Photo Collage', lines: ['攝影拼貼是什麼？攝影拼貼的歷史沿革', '世界攝影藝術史殿堂級大師經典攝影拼貼作品介紹', '製作攝影拼貼的方法'] },
          { title: '第二堂', lines: ['視覺美感的基本原則', '同學作業討論'] },
          { title: '第三堂', lines: ['從比例而來的美感與群化', '同學作業討論'] },
          { title: '第四堂', lines: ['視覺動力', '同學作業討論'] },
          { title: '第五堂', lines: ['空間感', '同學作業討論'] }
        ]),
        CARDS('誰適合這堂課', 2, [
          { title: '好奇心旺盛，看膩了平庸圖片的人', desc: '拍不出來的腦洞，用拼貼建構腦海的世界。' },
          { title: '視覺工作者', desc: '平面設計師、接案攝影師、媒體小編或中小企業主，學會精準打動人心的專業視覺語彙。' },
          { title: '對手作有興趣的人', desc: '喜歡用手工親手創作新奇事物的人。' },
          { title: '入門體驗者', desc: '想藉由攝影拼貼的實作與視覺理論探討，一窺視覺藝術堂奧的人。' }
        ]),
        CARDS('這堂課你會學到', 3, [
          { title: '視覺語言', desc: '學習在視覺敘事與表達上運用萬國通用的視覺語言基礎應用。' },
          { title: '圖像語言', desc: '理解在視框所限的平面靜態空間裡，觀者與攝影者觀看的差異。' },
          { title: '視覺美感', desc: '大幅提升你對圖像特有的視覺美感的感受力。' }
        ]),
        CHECK('課前準備', [
          '上網購買大型視覺雜誌（LIFE、GEO、Vogue 等），用美工刀沿輪廓剪下網點照片備用',
          '製作作品時當襯底的厚紙板',
          '可反覆撕貼、不會太黏的膠水'
        ]),
        TEACHER([
          Object.assign({ badge: '實體班' }, T_TU),
          Object.assign({ badge: '線上班' }, T_WU)
        ]),
        NOTES(),
        CTA('點我報名', FORM)
      ]
    },
    {
      id: 'triptych', track: 'online', index: '04',
      title: '影像創作班｜主題二：三張照片的影像故事',
      subtitle: '從三聯作 Triptych 開始書寫影像文學',
      tag: '影像創作', kicker: 'Online Module',
      schedule: '週一 20:00–22:00',
      cardImage: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop',
      cardDesc: '從「三聯作 Triptych」開始，學習把對的影像放在對的地方，書寫影像文學。',
      heroImage: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop',
      intro: '培養學員能夠精準挑選「合目的」的影像，並使用適當的形式將對的影像放在對的地方，在作品整體的影像群之間共鳴出某種「形而上內容」的高級影像創作能力。從「三聯作 Triptych」的練習開始，訓練學員拿影像當文字使用、書寫影像小說的能力。',
      enrollUrl: FORM, externalUrl: '', featured: false,
      blocks: [
        INFO([
          { icon: 'fa-solid fa-desktop', label: '班別', value: '線上班' },
          { icon: 'fa-regular fa-calendar-check', label: '預定上課日', value: '採預約報名（招生滿 6 位即開課）' },
          { icon: 'fa-regular fa-calendar', label: '堂數', value: '5 堂（2 小時／堂，共 10 小時）' },
          { icon: 'fa-regular fa-clock', label: '時間', value: '每週一 20:00–22:00' },
          { icon: 'fa-solid fa-tag', label: '費用', value: '體驗價 NT$ 4,000（原價 NT$ 6,200）' }
        ]),
        LESSONS([
          { title: '第一堂', lines: ['世界攝影史上影像文學經典範例介紹與分析', '三聯作作業製作方式與規格介紹'] },
          { title: '第二堂', lines: ['同學三聯作作業討論與建議'] },
          { title: '第三堂', lines: ['同學三聯作作業討論與建議'] },
          { title: '第四堂', lines: ['同學三聯作作業討論與建議'] },
          { title: '第五堂', lines: ['同學三聯作作業討論與建議'] }
        ]),
        CHECK('誰適合這堂課', [
          '想用複數影像群創作，參加國內外攝影比賽的人', '想製作 Photobook 影像長篇小說的人', '想舉辦個展、學習非線性布展方式的人',
          '想學會精準挑選「合目的」影像來使用的人', '想迎頭趕上攝影 4.0 時代精神進行影像文學創作的人', '想藉由 Photo Installation 影像裝置展進行創作的人'
        ]),
        CHECK('課前準備', [
          '整理好過去拍過的照片資料庫，總數最好在 8,000 張以上',
          '備有桌機或筆電，最好安裝 Adobe Creative Suite 影像處理軟體',
          '製作作業時，請務必使用 Illustrator 製作'
        ]),
        TEACHER([T_WU]),
        NOTES(),
        CTA('點我報名', FORM)
      ]
    },
    {
      id: 'curators', track: 'online', index: '05',
      title: '國際攝影策展人培育工作坊',
      subtitle: '培養策展思維與實務執行能力',
      tag: '工作坊', kicker: 'Online Module',
      schedule: '週二 20:00–22:30',
      cardImage: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1200&auto=format&fit=crop',
      cardDesc: '為有志於影像策展的學員量身打造，培養策展思維與實務執行能力。',
      heroImage: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1600&auto=format&fit=crop',
      intro: '為有志於影像策展的學員量身打造，培養策展思維與實務執行能力。',
      enrollUrl: FORM, externalUrl: FORM, featured: false,
      blocks: [
        INFO([
          { icon: 'fa-solid fa-desktop', label: '班別', value: '線上班' },
          { icon: 'fa-regular fa-clock', label: '時間', value: '每週二 20:00–22:30' },
          { icon: 'fa-solid fa-location-dot', label: '上課地點', value: '線上授課' }
        ]),
        P('為有志於影像策展的學員量身打造，從策展概念、選件邏輯到展覽執行，培養完整的策展思維與實務執行能力。詳細課程內容與開課資訊，歡迎透過報名表單洽詢。'),
        TEACHER([T_WU]),
        NOTES(),
        CTA('預約報名', FORM)
      ]
    },
    {
      id: 'ai', track: 'online', index: '06',
      title: '從零開始探索 AI 圖像生成的奇妙世界',
      subtitle: '踏入生成式 AI 影像的大門',
      tag: 'AI 圖像', kicker: 'Online Module',
      schedule: '週四 20:00–22:00',
      cardImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop',
      cardDesc: '帶你踏入生成式 AI 影像的大門，從零開始掌握 AI 圖像創作的觀念與工具。',
      heroImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop',
      intro: '帶你踏入生成式 AI 影像的大門，從零開始掌握 AI 圖像創作的觀念與工具。',
      enrollUrl: FORM, externalUrl: FORM, featured: false,
      blocks: [
        INFO([
          { icon: 'fa-solid fa-desktop', label: '班別', value: '線上班' },
          { icon: 'fa-regular fa-clock', label: '時間', value: '每週四 20:00–22:00' },
          { icon: 'fa-solid fa-location-dot', label: '上課地點', value: '線上授課' }
        ]),
        P('從零開始，帶你認識生成式 AI 影像的原理、工具與創作方法，並從視覺美學的角度思考如何駕馭 AI，讓 AI 成為你影像創作的助力。詳細課程內容與開課資訊，歡迎透過報名表單洽詢。'),
        TEACHER([T_WU]),
        NOTES(),
        CTA('預約報名', FORM)
      ]
    },
    {
      id: 'live', track: 'online', index: '07',
      title: '視丘影像美學 LIVE 線上課程',
      subtitle: '華語教學，誠摯歡迎全球華人選修',
      tag: 'LIVE', kicker: 'Online Module',
      schedule: '週三 20:00–22:00',
      cardImage: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=1200&auto=format&fit=crop',
      cardDesc: '華語教學、歡迎全球華人選修，隨時插班上課的影像美學即時線上課程。',
      heroImage: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=1600&auto=format&fit=crop',
      intro: '華語教學，誠摯歡迎全球華人選修。歡迎隨時插班上課，也歡迎預約旁聽。',
      enrollUrl: FORM, externalUrl: '', featured: true,
      blocks: [
        INFO([
          { icon: 'fa-regular fa-calendar', label: '堂數', value: '每期共 5 堂課' },
          { icon: 'fa-regular fa-clock', label: '時間', value: '每週三 20:00–22:00' },
          { icon: 'fa-solid fa-location-dot', label: '上課地點', value: '線上授課' },
          { icon: 'fa-solid fa-tag', label: '費用', value: '原價 NT$ 5,900（本課程不適用任何優惠方案）' },
          { icon: 'fa-solid fa-plus', label: '彈性選修', value: '歡迎隨時插班上課、歡迎預約旁聽' }
        ]),
        H('課程介紹下載'),
        CHECK('', [
          '關於「如何觀賞藝術展覽」的視丘觀賞指南：https://www.fotosoft.com.tw/images/onlineclass/Introduction1.pdf',
          '課程內容的 10 個層次：https://www.fotosoft.com.tw/images/onlineclass/Introduction8.pdf',
          '課程的教育理念：https://www.fotosoft.com.tw/images/onlineclass/Introduction6.pdf',
          '課程的上課方式：https://www.fotosoft.com.tw/images/onlineclass/15-Introduction.pdf'
        ]),
        P('同學上課心得分享 — 佳評如潮：「視丘影像美學 LIVE 線上學習」第一屆同學上課心得回饋，詳見 https://www.fotosoft.com.tw/class/online/experience.html 。'),
        TEACHER([T_WU]),
        NOTES(),
        CTA('點我報名', FORM)
      ]
    },
    {
      id: 'kertesz', track: 'online', index: '08',
      title: '站在巨人的肩膀上：Andre Kertesz 篇',
      subtitle: '殿堂級大師作品研究',
      tag: '大師研究', kicker: 'Master Study',
      schedule: '週一 20:00–22:00',
      cardImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
      cardDesc: '解構 20 世紀最重要攝影大師 Andre Kertesz 的生平重要作品與影像思考方法。',
      heroImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop',
      intro: '透過有 20 世紀最重要攝影大師美譽的 Andre Kertesz 生平重要作品的解構與分析，學習攝影大師的影像思考方法。',
      enrollUrl: FORM, externalUrl: '', featured: false,
      blocks: [
        INFO([
          { icon: 'fa-solid fa-desktop', label: '班別', value: '線上班' },
          { icon: 'fa-regular fa-calendar-check', label: '預定上課日', value: '採預約報名（招生滿 6 位即開課）' },
          { icon: 'fa-regular fa-calendar', label: '堂數', value: '5 堂（共 10 小時）' },
          { icon: 'fa-regular fa-clock', label: '時間', value: '每週一 20:00–22:00' },
          { icon: 'fa-solid fa-tag', label: '費用', value: '體驗價 NT$ 4,000（原價 NT$ 6,200）' }
        ]),
        LESSONS([
          { title: '第一堂', lines: ['Andre Kertesz 的生平介紹'] },
          { title: '第二堂', lines: ['Andre Kertesz 重要作品分析'] },
          { title: '第三堂', lines: ['Andre Kertesz 的圖像思考術'] },
          { title: '第四堂', lines: ['Andre Kertesz 如何剪裁照片'] },
          { title: '第五堂', lines: ['Andre Kertesz 與我'] }
        ]),
        CARDS('誰適合這堂課', 3, [
          { title: '視覺工作者', desc: '平面設計師、接案攝影師、媒體小編或中小企業主，學會精準打動人心的專業視覺語彙。' },
          { title: '想提升作品層次的人', desc: '不滿現狀、想讓作品更耐人尋味的攝影愛好者。' },
          { title: '手機攝影入門者', desc: '想從殿堂級大師作品中偷學影像思考竅門的人。' }
        ]),
        CARDS('這堂課你會學到', 3, [
          { title: '大師的攝影手法', desc: '學習如何將眼前的視覺像轉化成圖像上的視覺與圖像語言。' },
          { title: '大師的構圖方式', desc: '從大師的裁切中，學習如何將平庸作品轉化成世界名作。' },
          { title: '歷久彌新的視覺美感', desc: '從反覆觀看與辯證分析中提升自己的視覺美感。' }
        ]),
        TEACHER([T_WU]),
        NOTES(),
        CTA('點我報名', FORM)
      ]
    },
    {
      id: 'callahan', track: 'online', index: '09',
      title: '站在巨人的肩膀上：Harry Callahan 篇',
      subtitle: '殿堂級大師作品研究',
      tag: '大師研究', kicker: 'Master Study',
      schedule: '週一 20:00–22:00',
      cardImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop',
      cardDesc: '解析 New Bauhaus 名師 Harry Callahan 作品，學習教出無數大師的影像思考法。',
      heroImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop',
      intro: '透過在美國芝加哥 New Bauhaus 任教、孕育出無數東西方攝影大師的 Harry Callahan 生平重要作品的解構與分析，學習教出無數攝影大師的老師獨特的影像思考方法。',
      enrollUrl: FORM, externalUrl: '', featured: false,
      blocks: [
        INFO([
          { icon: 'fa-solid fa-desktop', label: '班別', value: '線上班' },
          { icon: 'fa-regular fa-calendar-check', label: '預定上課日', value: '採預約報名（招生滿 6 位即開課）' },
          { icon: 'fa-regular fa-calendar', label: '堂數', value: '5 堂（共 10 小時）' },
          { icon: 'fa-regular fa-clock', label: '時間', value: '每週一 20:00–22:00' },
          { icon: 'fa-solid fa-tag', label: '費用', value: '體驗價 NT$ 4,000（原價 NT$ 6,200）' }
        ]),
        LESSONS([
          { title: '第一堂', lines: ['Harry Callahan 的生平介紹'] },
          { title: '第二堂', lines: ['Harry Callahan：Eleanor and Barbara 系列'] },
          { title: '第三堂', lines: ['Harry Callahan 重要作品分析'] },
          { title: '第四堂', lines: ['Harry Callahan 的圖像思考術'] },
          { title: '第五堂', lines: ['Harry Callahan 與我'] }
        ]),
        CARDS('誰適合這堂課', 3, [
          { title: '視覺工作者', desc: '平面設計師、接案攝影師、媒體小編或中小企業主，學會精準打動人心的專業視覺語彙。' },
          { title: '想提升作品層次的人', desc: '不滿現狀、想讓作品更耐人尋味的攝影愛好者。' },
          { title: '手機攝影入門者', desc: '想從殿堂級大師作品中偷學影像思考竅門的人。' }
        ]),
        CARDS('這堂課你會學到', 2, [
          { title: '大師的攝影手法', desc: '學習在攝影現場如何與眼前的事物狀態對決。' },
          { title: '大師影像創作思考方式', desc: '學習如何將眼前的視覺像轉化成圖像上的視覺與圖像語言。' },
          { title: '大師的構圖方式', desc: '從大師的裁切中，學習如何將平庸作品轉化成世界名作。' },
          { title: '歷久彌新的視覺美感', desc: '從反覆觀看與辯證分析中提升自己的視覺美感。' }
        ]),
        TEACHER([T_WU]),
        NOTES(),
        CTA('點我報名', FORM)
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
      .slice(0, 60) || 'course-' + Date.now();
  }
  function broadcast() { try { window.dispatchEvent(new CustomEvent(EVENT_NAME)); } catch (_) {} }
  function stableHash(s) {
    let h = 0; s = String(s || '');
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }
  function resolveAssetPath(path) {
    const src = String(path || '').trim();
    if (!src) return '';
    if (/^(?:https?:)?\/\//i.test(src) || /^data:/i.test(src)) return src;
    const host = (typeof location !== 'undefined' && location.hostname) ? location.hostname : '';
    const isGithubPages = /github\.io$/i.test(host);
    if (!src.startsWith('/')) {
      if (isGithubPages && src.startsWith('image/')) return '/fotosoft/' + src;
      return src;
    }
    if (!isGithubPages) return src;
    if (src === '/fotosoft' || src.startsWith('/fotosoft/')) return src;
    return '/fotosoft' + src;
  }

  /* ---------- Store ---------- */
  const CoursesStore = {
    STORAGE_KEY, EVENT_NAME, TRACKS, FORM, INFO_SESSION, FALLBACK_IMAGES,

    _seedIfEmpty() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COURSES));
    },

    getAll() {
      this._seedIfEmpty();
      const data = safeParse(localStorage.getItem(STORAGE_KEY)) || [];
      return data.slice().sort((a, b) => {
        const oa = (a.order != null ? a.order : 999);
        const ob = (b.order != null ? b.order : 999);
        if (oa !== ob) return oa - ob;
        return String(a.index || '').localeCompare(String(b.index || ''));
      });
    },

    getByTrack(track) { return this.getAll().filter(c => c.track === track); },
    getById(id) { return this.getAll().find(c => c.id === id) || null; },
    getFeatured(limit) {
      const arr = this.getAll().filter(c => c.featured);
      return typeof limit === 'number' ? arr.slice(0, limit) : arr;
    },

    trackOf(course) { return (course && TRACKS[course.track]) ? TRACKS[course.track] : TRACKS.online; },
    detailUrl(course) {
      if (!course) return '#';
      const page = this.trackOf(course).page;
      return page + '?id=' + encodeURIComponent(course.id);
    },
    pickFallbackImage(id) { return FALLBACK_IMAGES[stableHash(id) % FALLBACK_IMAGES.length]; },
    cardImageOf(course) {
      if (!course) return '';
      return resolveAssetPath((course.cardImage && course.cardImage.trim()) || course.heroImage || this.pickFallbackImage(course.id));
    },
    heroImageOf(course) {
      if (!course) return '';
      return resolveAssetPath((course.heroImage && course.heroImage.trim()) || course.cardImage || this.pickFallbackImage(course.id));
    },
    assetPath(path) { return resolveAssetPath(path); },

    save(course) {
      const list = this.getAll();
      const now = Date.now();
      const isNew = !course.id || !list.some(c => c.id === course.id);
      const normalized = {
        id: course.id || (slugify(course.title) + '-' + now.toString(36)),
        track: course.track === 'fulltime' ? 'fulltime' : 'online',
        index: (course.index || '').toString().trim(),
        title: (course.title || '未命名課程').trim(),
        subtitle: (course.subtitle || '').trim(),
        tag: (course.tag || '').trim(),
        kicker: (course.kicker || '').trim(),
        schedule: (course.schedule || '').trim(),
        cardImage: (course.cardImage || '').trim(),
        cardDesc: (course.cardDesc || '').trim(),
        heroImage: (course.heroImage || '').trim(),
        intro: (course.intro || '').trim(),
        enrollUrl: (course.enrollUrl || '').trim(),
        externalUrl: (course.externalUrl || '').trim(),
        featured: !!course.featured,
        blocks: Array.isArray(course.blocks) ? course.blocks.filter(b => b && b.type) : [],
        order: (course.order != null ? course.order : (isNew ? list.length : 999)),
        createdAt: course.createdAt || now,
        updatedAt: now
      };
      const next = isNew ? list.concat([normalized]) : list.map(c => (c.id === normalized.id ? normalized : c));
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); localStorage.setItem(EDITED_KEY, '1'); }
      catch (e) { console.warn('[courses] quota', e); }
      broadcast();
      return normalized;
    },

    remove(id) {
      const next = this.getAll().filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      localStorage.setItem(EDITED_KEY, '1');
      broadcast();
    },

    reorder(track, orderedIds) {
      const list = this.getAll();
      const byId = new Map(list.map(c => [c.id, c]));
      let i = 0;
      orderedIds.forEach(id => { const c = byId.get(id); if (c) c.order = i++; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      localStorage.setItem(EDITED_KEY, '1');
      broadcast();
    },

    reset() { localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COURSES)); localStorage.removeItem(EDITED_KEY); broadcast(); },
    exportJSON() { return JSON.stringify(this.getAll(), null, 2); },
    importJSON(jsonString, mode) {
      const data = typeof jsonString === 'string' ? safeParse(jsonString) : jsonString;
      if (!Array.isArray(data)) throw new Error('匯入資料格式錯誤：必須為陣列');
      if (mode === 'merge') {
        const map = new Map(this.getAll().map(c => [c.id, c]));
        data.forEach(c => { if (c && c.id) map.set(c.id, c); });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(map.values())));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      localStorage.setItem(EDITED_KEY, '1');
      broadcast();
    },
    refreshFromRemote() {
      // 若本機已有管理者編輯，不用遠端覆蓋，避免蓋掉本機變更
      if (localStorage.getItem(EDITED_KEY)) return Promise.resolve(false);
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
      window.addEventListener('storage', (e) => { if (e.key === STORAGE_KEY) callback(); });
      return () => window.removeEventListener(EVENT_NAME, handler);
    },
    slugify
  };

  global.CoursesStore = CoursesStore;
})(window);

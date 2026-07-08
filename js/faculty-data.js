/* ============================================================
 * faculty-data.js
 * 視丘師資團隊（Faculty） — 共用資料層
 * ============================================================ */

(function (global) {
  'use strict';

  const SCRIPT_VERSION = '20260707a';
  console.info('[faculty] faculty-data.js loaded, version=' + SCRIPT_VERSION);

  const STORAGE_KEY = 'FOTOSOFT_FACULTY_V1';
  const DIRTY_KEY = 'FOTOSOFT_FACULTY_USER_DIRTY';
  const REMOTE_HASH_KEY = 'FOTOSOFT_FACULTY_REMOTE_HASH';
  const EVENT_NAME = 'fotosoft:faculty-updated';
  const REMOTE_JSON = 'faculty-data.json';

  const FALLBACK_PHOTOS = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop'
  ];

  const CURRENT_FACULTY_SEEDS = JSON.parse(String.raw`
[
  {
    "id": "h-c-tu",
    "name": "涂煥昌",
    "englishName": "Huan-Chang Tu",
    "title": "PLE 影像風格養成所 日間部 講師",
    "course": "PLE 影像風格養成所 日間部",
    "courses": "PLE 影像風格養成所 日間部",
    "photo": "https://www.fotosoft.com.tw/images/H-C-TU/final2.jpg",
    "image": "https://www.fotosoft.com.tw/images/H-C-TU/final2.jpg",
    "gallery": [],
    "links": [
      {
        "label": "個人網站",
        "url": "https://www.fotosoft.com.tw/class/faculty/current-faculty/154-h-c-tu.html"
      }
    ],
    "status": "current",
    "pinned": false,
    "order": 61,
    "summary": "2014 視丘攝影藝術學院日間部全能專業攝影師培訓班第49屆畢業；2002 國立中央大學大氣物理研究所碩士。",
    "tagline": "PLE 影像風格養成所 日間部 講師",
    "quote": "讓影像訓練回到風格、結構與觀看意識的養成。",
    "intro": "",
    "filters": [
      "ple"
    ],
    "tags": [
      "PLE",
      "影像風格",
      "視丘日間部"
    ],
    "detail": [
      "2014 視丘攝影藝術學院日間部全能專業攝影師培訓班第49屆畢業",
      "2002 國立中央大學大氣物理研究所碩士",
      "PLE 影像風格養成所 日間部 講師"
    ],
    "sections": [
      {
        "title": "學歷",
        "body": "2014 視丘攝影藝術學院 日間部全能專業攝影師培訓班第49屆畢業\n2002 國立中央大學大氣物理研究所碩士"
      },
      {
        "title": "現任",
        "body": "PLE 影像風格養成所 日間部 講師"
      }
    ],
    "blocks": [],
    "createdAt": 1783419711250
  },
  {
    "id": "tien-chien-chen",
    "name": "陳天健",
    "englishName": "Tien-Chien Chen",
    "title": "PLE 影像風格養成所 日間部 講師",
    "course": "PLE 影像風格養成所 日間部",
    "courses": "PLE 影像風格養成所 日間部",
    "photo": "https://www.fotosoft.com.tw/images/Tien-Chien-Chen/Tien-Chien-Chen.jpg",
    "image": "https://www.fotosoft.com.tw/images/Tien-Chien-Chen/Tien-Chien-Chen.jpg",
    "gallery": [],
    "links": [
      {
        "label": "個人網站",
        "url": "https://www.fotosoft.com.tw/class/faculty/current-faculty/152-tien-chien-chen.html"
      }
    ],
    "status": "current",
    "pinned": false,
    "order": 62,
    "summary": "2019 視丘攝影藝術學院日間部全能專業攝影師培訓班第59屆畢業，2000 美國紐約州康乃爾大學電機系碩士；現任 PLE 影像風格養成所 日間部 講師。",
    "tagline": "PLE 影像風格養成所 日間部 講師",
    "quote": "以理性結構與影像觀察，協助學生建立可延伸的影像風格。",
    "intro": "",
    "filters": [
      "ple"
    ],
    "tags": [
      "PLE",
      "視覺風格",
      "自然觀察"
    ],
    "detail": [
      "2019 視丘攝影藝術學院 日間部全能專業攝影師培訓班第59屆畢業",
      "2000 美國紐約州康乃爾大學電機系碩士",
      "2017 Four Honorable Mentions, IPA Professional Category",
      "2017 Editor’s Choice, International Travel Photographer Society Award"
    ],
    "sections": [
      {
        "title": "學歷",
        "body": "2019 視丘攝影藝術學院 日間部全能專業攝影師培訓班第59屆畢業\n2000 美國紐約州康乃爾大學電機系碩士"
      },
      {
        "title": "現任",
        "body": "PLE 影像風格養成所 日間部 講師"
      },
      {
        "title": "獲獎",
        "body": "2017 Four Honorable Mentions, IPA Professional Category\n2017 Editor’s Choice, International Travel Photographer Society Award"
      },
      {
        "title": "展覽",
        "body": "Travel Photographer Society 2017 Award 聯展 2017 G2, PUBLIKA, Kuala Lumpur\n2015 National Geographic “View from Above” 聯展, Chicago O'Hare International Airport\n2008 “Seasons of Light” 個展，高雄義守大學醫院"
      }
    ],
    "blocks": [],
    "createdAt": 1783419711250
  },
  {
    "id": "shu-jun-wang",
    "name": "王書駿",
    "englishName": "Shu-Jun Wang",
    "title": "商業人像・靜物・動態影像",
    "course": "林布蘭與現代商業人像採光：基礎人像攝影班",
    "courses": "林布蘭與現代商業人像採光：基礎人像攝影班",
    "photo": "https://www.fotosoft.com.tw/images/com_hikashop/upload/teacher-cv/SHU-JUN-WANG/_DSC3103.jpg",
    "image": "https://www.fotosoft.com.tw/images/com_hikashop/upload/teacher-cv/SHU-JUN-WANG/_DSC3103.jpg",
    "gallery": [],
    "links": [
      {
        "label": "個人網站",
        "url": "https://www.fotosoft.com.tw/class/faculty/current-faculty/137-shu-jun-wang.html"
      }
    ],
    "status": "current",
    "pinned": false,
    "order": 63,
    "summary": "現為自由商業攝影師，擅長拍攝肖像與靜物，同時跨足平面與動態影像製作，亦投入影像教學與企業內訓顧問。",
    "tagline": "早期擅長捕捉光影與人體線條，近年以商業攝影與教學並行，延伸沉靜且古典的視覺語彙。",
    "quote": "從古典光線到現代商業影像，建立可被市場理解的個人風格。",
    "intro": "",
    "filters": [
      "commercial",
      "art"
    ],
    "tags": [
      "人像採光",
      "靜物攝影",
      "動態影像"
    ],
    "detail": [
      "2011 視丘攝影藝術學院日間部第44屆畢業",
      "2005 中央大學化學工程與材料工程研究所畢業",
      "2003 中央大學化學工程與材料工程系畢業"
    ],
    "sections": [
      {
        "title": "簡介",
        "body": "早期擅長捕捉光影與人體線條等外在形式美感，之後拍攝題材轉向探討內在情感與生死議題，其視覺風格帶著沉靜與古典之美，並擅於表現抽象題材。\n\n創作概念上常使用二元論、矛盾修辭以及影像的弔詭特性來賦予作品生命力與藝術價值。\n\n現為自由商業攝影師，擅長拍攝肖像與靜物，同時跨足平面與動態影像製作。\n\n職業生涯經歷過細膩的廣告拍攝，也參與過以觸及為目的的內容行銷。\n\n近年除了持續商業攝影與個人創作外，也投身影像教學與企業內訓顧問的角色。"
      },
      {
        "title": "學歷",
        "body": "2011 視丘攝影藝術學院日間部第44屆畢業\n2005 中央大學 化學工程與材料工程研究所畢業\n2003 中央大學 化學工程與材料工程系畢業"
      },
      {
        "title": "現任",
        "body": "視丘攝影藝術學院《林布蘭與現代商業人像採光：基礎人像攝影班》講師\n2019至今 自由接案攝影師"
      },
      {
        "title": "曾任",
        "body": "2018-2019 《8THNS》雜誌電商 動態/平面攝影師\n2012-2017 《DCFilms》攝影指導/共同創辦人\n2012-2015 伯豐影像製作有限公司 平面攝影師"
      },
      {
        "title": "獲獎",
        "body": "2005 Fnac《24小時城市數位攝影馬拉松》攝影比賽 北區首獎\n2005《中大之美》攝影比賽 首獎"
      },
      {
        "title": "聯展",
        "body": "2005 Fnac《24小時城市數位攝影馬拉松》, Fnac藝廊\n2000《毒影》, 中央大學藝文中心"
      },
      {
        "title": "教學經歷",
        "body": "2017《愛料理》食譜影片 技術顧問\n2015-2017 視丘攝影藝術學院日間部《動態影像》課程講師\n2013 國立中央大學《創意學程》外聘講師"
      }
    ],
    "blocks": [],
    "createdAt": 1783419711250
  },
  {
    "id": "shun-long-jhong",
    "name": "鍾順龍",
    "englishName": "Shun-Long Jhong",
    "title": "自由攝影・視覺藝術創作",
    "course": "日間部「大外拍」",
    "courses": "日間部「大外拍」",
    "photo": "https://www.fotosoft.com.tw/images/com_hikashop/upload/teacher-cv/soon-long-chung/_.jpg",
    "image": "https://www.fotosoft.com.tw/images/com_hikashop/upload/teacher-cv/soon-long-chung/_.jpg",
    "gallery": [],
    "links": [
      {
        "label": "個人網站",
        "url": "https://www.fotosoft.com.tw/class/faculty/current-faculty/41-shun-long-jhong.html"
      }
    ],
    "status": "current",
    "pinned": false,
    "order": 64,
    "summary": "1974年出生於台灣花蓮，視丘攝影藝術學院畢業、倫敦大學金匠學院影像與傳達碩士，現為自由攝影及視覺藝術創作。",
    "tagline": "教授課程｜日間部「大外拍」",
    "quote": "以觀看現場與影像傳達，帶學生理解攝影作為藝術創作的方法。",
    "intro": "",
    "filters": [
      "ple",
      "documentary",
      "art"
    ],
    "tags": [
      "大外拍",
      "當代影像",
      "視覺傳達"
    ],
    "detail": [
      "London University of Goldsmiths College, MA Image & Communication",
      "曾任蘋果日報攝影中心攝影記者（2003-2005）",
      "作品【目擊現場】獲2002年台北美術獎優選；【黑暗之光】獲2003年高雄美術獎高雄獎"
    ],
    "sections": [
      {
        "title": "簡介",
        "body": "1974年出生於台灣花蓮，視丘攝影藝術學院畢業、倫敦大學哥金匠學院（London University of Goldsmiths College）影像與傳達碩士。曾任良遠藝術工坊學習影像耐久保存、蘋果日報攝影中心攝影記者（2003-2005）、董氏基金會攝影志工、國立臺灣藝術大學多媒體動畫藝術學系、視覺傳達設計系兼任講師（2006-2009）。現為自由攝影及視覺藝術創作。作品【目擊現場】獲2002年台北美術獎優選獎，及【黑暗之光】獲2003年高雄美術獎高雄獎。"
      },
      {
        "title": "學歷",
        "body": "2002 倫敦大學金匠學院視覺傳播系藝術碩士 London University of Goldsmiths College, MA Image & Communication\n2001 倫敦大學金匠學院藝術系研究班 London University of Goldsmiths College, Certificate for Postgraduate Study In Fine Art\n1996 龍華技術學院 電子工程科 計算機工程組\n1994 視丘攝影藝術學院 專業攝影師全修班第十屆"
      },
      {
        "title": "經歷",
        "body": "2005- 自由攝影及視覺藝術創作\n2003-2005 蘋果日報攝影中心攝影記者\n1998-2009 董氏基金會攝影志工\n1994-1996 良遠藝術工坊"
      },
      {
        "title": "參展經歷",
        "body": "2011 「文明風景-里程碑」個展，海馬廻光畫館，台南\n2010 出社會:1990年代之後的台灣批判寫實攝影，台灣攝影博物館預備館（平面攝影作品-「文明風景-里程碑」）\n2010 第二屆大理國際攝影節，中國．雲南．大理（平面攝影作品-「文明風景-里程碑」）\n2008 「趨近」當代藝術展，台北忠泰生活MOT/ART，台北\n2008 「解構建築」，TIVAC(台灣國際視覺藝術中心)，台北\n2008 「星雨」個展，鳳甲美術館，台北\n2008 「既視之方」，台北忠泰生活MOT/ART，台北\n2007 嘉義2007北廻歸線環境藝術行動計劃駐村藝術家\n2006 山東24小時—兩岸百名攝影家合拍\n2004 第四屆國際平遙攝影節\n2003 夜視．台北-國際錄影藝術展，台北誠品書店（錄像作品—「操場」（Playground））\n2003 高雄獎暨第20屆高雄美術展覽會，高雄市立美術館（平面攝影作品—「黑暗之光」(From the Dark)）\n2002 「Random-ize Video& Film Festival」，倫敦\n2002 「酷閉了(Be Cool)」，高雄新濱碼頭（平面攝影作品—「目擊現場」(What Happened?)）\n2002 「Seeing is Believing（眼見為憑）」，希臘雅典Gazon Rouge（平面攝影作品—「新秩序」（New Order））"
      },
      {
        "title": "獲獎紀錄",
        "body": "2006 國家文化藝術基金會95-2期美術創作類補助申請案\n2003 高雄美術獎 高雄獎，平面攝影作品—黑暗之光（From the Dark）\n2002 台北美術獎 優選，平面攝影作品—目擊現場（What Happened?）"
      },
      {
        "title": "收藏",
        "body": "2008 星雨No.05, No.06, No.17 鳳甲美術館"
      },
      {
        "title": "教職",
        "body": "2006-2010 國立台灣藝術大學多媒體動畫藝術學系、視覺傳達設計系兼任講師\n2012-2016 慈濟大學傳播學系兼任講師"
      }
    ],
    "blocks": [],
    "createdAt": 1783419711250
  },
  {
    "id": "meng-yu-wu",
    "name": "吳孟宇",
    "englishName": "Meng-Yu Wu",
    "title": "現任講師 · 視丘攝影藝術學院",
    "courses": "專修班「數位攝影入門班」、「商業閃燈應用班」",
    "photo": "https://www.fotosoft.com.tw/images/com_hikashop/upload/teacher-cv/meng-yu-wu/DSC_2603-2.jpg",
    "gallery": [
      {
        "src": "https://www.fotosoft.com.tw/images/meng-yu-wu_work/09-0529-0070-17.jpg",
        "alt": "吳孟宇作品 09-0529-0070-17",
        "caption": "作品｜09-0529-0070-17"
      },
      {
        "src": "https://www.fotosoft.com.tw/images/meng-yu-wu_work/DSC_2516.jpg",
        "alt": "吳孟宇作品 DSC_2516",
        "caption": "作品｜DSC_2516"
      },
      {
        "src": "https://www.fotosoft.com.tw/images/meng-yu-wu_work/DSC_8018.jpg",
        "alt": "吳孟宇作品 DSC_8018",
        "caption": "作品｜DSC_8018"
      }
    ],
    "links": [
      {
        "label": "個人部落格",
        "url": "http://yunnia.blogspot.tw"
      },
      {
        "label": "教學部落格",
        "url": "http://artliketravel.blogspot.tw/"
      }
    ],
    "status": "current",
    "pinned": false,
    "order": 65,
    "summary": "1982 出生於新竹市，專長人像與商業閃燈訓練，現任視丘攝影藝術學院講師。",
    "tagline": "教授課程｜專修班「數位攝影入門班」、「商業閃燈應用班」",
    "intro": "吳孟宇老師的專業橫跨人像攝影、商業閃燈、品牌形象與活動現場攝影，能把學生從器材操作與光線控制，帶進真實拍攝工作的節奏與判斷。\n\n在視丘的課程脈絡中，他不只教授技術，更強調攝影師在面對人物、品牌與現場時，如何建立溝通、反應與整體執行能力，讓學習與實務能夠真正接軌。",
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "教授課程"
      },
      {
        "type": "paragraph",
        "text": "專修班「數位攝影入門班」、「商業閃燈應用班」。"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "專業經歷"
      },
      {
        "type": "paragraph",
        "text": "1982 出生於新竹市。\n\n台北市政府專業形象攝影師、國內專業人像攝影界知名攝影大師；並曾擔任各大時尚品牌「GOZO、本真一衣、團團、KENZO」指定攝影師。"
      },
      {
        "type": "paragraph",
        "text": "蔡琴演唱會攝影師、美國樂手 Neil Zaza 指定在台攝影師、永齡基金會慈善列車隨團攝影師、鴻海企業活動及尾牙攝影師、2010 臺北國際花卉博覽會專任攝影師。"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "學歷與作品"
      },
      {
        "type": "paragraph",
        "text": "2007 中國文化大學畢業。\n\n作品包括《存在論 / About Existence》（2009）、《暗流 / Dark Flow》（2009）、《幻象與記憶 / Illusions X Memories》（2010）。"
      },
      {
        "type": "quote",
        "text": "在人物與現場之間，光線不是附屬條件，而是攝影師建構畫面與關係的主動語言。",
        "cite": "示範資料整理"
      }
    ],
    "createdAt": 1783413852966,
    "course": "專修班「數位攝影入門班」、「商業閃燈應用班」",
    "image": "https://www.fotosoft.com.tw/images/com_hikashop/upload/teacher-cv/meng-yu-wu/DSC_2603-2.jpg",
    "quote": "以人像與商業閃燈訓練，銜接拍攝現場的專業判斷。",
    "filters": [
      "commercial",
      "ple"
    ],
    "tags": [
      "人像攝影",
      "商業閃燈",
      "數位攝影"
    ],
    "detail": [
      "台北市政府專業形象攝影師",
      "各大時尚品牌指定攝影師",
      "2010 臺北國際花卉博覽會專任攝影師"
    ],
    "sections": [
      {
        "title": "簡介",
        "body": "1982 出生於新竹市 / born in Hsin-Chu\n\n台北市政府專業形象攝影師\n國內專業人像攝影界知名攝影大師\n各大時尚品牌「GOZO、本真一衣、團團、KENZO」指定攝影師\n蔡琴演唱會攝影師\n美國樂手NEIL ZAZA 指定在台攝影師\n永齡基金會慈善列車隨團攝影師\n鴻海企業活動及尾牙攝影師\n2010臺北國際花卉博覽會專任攝影師"
      },
      {
        "title": "學歷",
        "body": "2007 中國文化大學畢業 Graduated from PCCU(Taiwan)"
      },
      {
        "title": "作品",
        "body": "2009 存在論 / About Existence\n2009 暗流 / Dark Flow\n2010 幻象與記憶 / Illusions X Memories"
      },
      {
        "title": "展覽",
        "body": "城市客廳 跨域創作展（2012 台北 西園29服飾創作基地）"
      },
      {
        "title": "現任",
        "body": "視丘攝影藝術學院講師"
      }
    ]
  },
  {
    "id": "ho-ho-tai",
    "name": "何經泰",
    "englishName": "Ho-Ho Tai",
    "title": "紀實攝影・新聞影像・大師講座",
    "course": "日間部「大師講座」",
    "courses": "日間部「大師講座」",
    "photo": "https://www.fotosoft.com.tw/images/com_hikashop/upload/teacher-cv/Hohotai/hohotai_square.jpg",
    "image": "https://www.fotosoft.com.tw/images/com_hikashop/upload/teacher-cv/Hohotai/hohotai_square.jpg",
    "gallery": [],
    "links": [
      {
        "label": "個人網站",
        "url": "https://www.fotosoft.com.tw/class/faculty/current-faculty/34-hohotai.html"
      }
    ],
    "status": "current",
    "pinned": false,
    "order": 66,
    "summary": "1956年出生於韓國釜山，政大哲學系畢業，長期從事紀實攝影與新聞影像工作，2003 年榮獲第7屆台北文化獎。",
    "tagline": "教授課程｜日間部「大師講座」",
    "quote": "用紀實影像面向社會現場，讓攝影成為理解現實的入口。",
    "intro": "",
    "filters": [
      "documentary"
    ],
    "tags": [
      "大師講座",
      "紀實攝影",
      "新聞攝影"
    ],
    "detail": [
      "2003 年榮獲第7屆台北文化獎",
      "「何創影像工作室」負責人",
      "著有《都市底層》《白色檔案》《木棉的顏色》"
    ],
    "sections": [
      {
        "title": "簡介",
        "body": "1956年出生於韓國釜山，政大哲學系畢業。曾任天下雜誌、時報周刊、民生報、自立早晚報、時報新聞刊、工商時報等攝影記者、Playboy中文版攝影指導、Smart智富月刊攝影主編、非凡新聞e周刊攝影主任、明報週刊副總編輯。1990年，於廈門攝影藝廊展出「都市底層」，並出版同名攝影集。1991年，於台北爵士藝廊展出「白色檔案」，並出版同名攝影集。1995年，於誠品書店及台北攝影藝廊展出「工傷顯影」；並參加布魯賽爾國際藝術節。2003 台北NGO會館展出「工殤顯影II –家族陰影」並出版攝影集「木棉的顏色」。2003年，榮獲第7屆台北文化獎。"
      },
      {
        "title": "現任",
        "body": "「何創影像工作室」負責人"
      },
      {
        "title": "經歷",
        "body": "1956 年生於韓國釜山\n1982 年政大哲學系畢業"
      },
      {
        "title": "曾任",
        "body": "天下雜誌、時報週刊、民生報、自立早晚報、時報新聞週刊等攝影記者\n工商時報攝影記者\n現任 Playboy 中文版攝影指導"
      },
      {
        "title": "展覽",
        "body": "2017 「微光闇影」，臺北市立美術館，臺北，臺灣\n2009「2009臺北/平遙攝影文化交流展」，臺北，臺灣\n2009「作食人」聯展，新港文化館\n2003 「工殤顯影II –家族陰影」，台北NGO會館，臺北，臺灣\n2003「勞動群像」聯展，高雄，臺灣\n2002「期許、批判與宣洩－台灣政治藝術聯展」，觀想藝術中心，臺北，臺灣\n2001「台灣攝影家五人聯展」，平遙國際攝影節，平遙，中國\n1999「台灣現代影像藝術展1990-1999」，郭木生美術中心，臺北，臺灣\n1998「台灣當代攝影1998」，OP polo gallery , 香港\n1997 「台灣攝影家」，巴黎華文中心\n1996 「台灣攝影新世紀」8 人展，東京守護神花園藝廊，日本\n1995「工傷顯影」，誠品書店，臺北，臺灣\n1995「工傷顯影」，台北攝影藝廊，臺北，臺灣\n1994「中港台當代攝影展」，香港藝術中心\n1993布魯塞爾國際藝術節，布魯塞爾，比利時\n1992 「白色檔案」、「都市底層」，香港\n1991「白色檔案」，高雄串門藝廊，高雄，臺灣\n1991「白色檔案」，台北爵士藝廊，臺灣\n1990「都市底層」，高雄串門，臺灣\n1990「都市底層」，夏門攝影藝廊\n1982「我的感覺」，美國文化中心"
      },
      {
        "title": "獲獎",
        "body": "2003獲獎 第7屆台北文化獎"
      },
      {
        "title": "出版",
        "body": "2003書籍／木棉的顏色，大塊文化\n1991書籍／白色檔案，時報文化\n1990書籍／都市底層，時報出版"
      }
    ],
    "blocks": [],
    "createdAt": 1783419711250
  },
  {
    "id": "yunnia-yang",
    "name": "楊衍畇",
    "englishName": "Yunnia Yang",
    "title": "策展人・藝術史學者・藝評人",
    "course": "日間部「藝術史」",
    "courses": "日間部「藝術史」",
    "photo": "https://www.fotosoft.com.tw/images/com_hikashop/upload/teacher-cv/Yunnia-Yang/Yunnia_photo-2.jpg",
    "image": "https://www.fotosoft.com.tw/images/com_hikashop/upload/teacher-cv/Yunnia-Yang/Yunnia_photo-2.jpg",
    "gallery": [],
    "links": [
      {
        "label": "個人網站",
        "url": "https://www.fotosoft.com.tw/class/faculty/current-faculty/33-yunnia-yang.html"
      }
    ],
    "status": "current",
    "pinned": false,
    "order": 67,
    "summary": "策展人、藝術史學者與藝評人，長期專注超現實主義研究與跨領域藝術實驗。",
    "tagline": "把攝影放進藝術史與當代策展脈絡，打開跨領域觀看。",
    "quote": "把攝影放進藝術史與當代策展脈絡，打開跨領域觀看。",
    "intro": "",
    "filters": [
      "art"
    ],
    "tags": [
      "藝術史",
      "策展研究",
      "跨領域藝術"
    ],
    "detail": [
      "國立台灣藝術大學雕塑系兼任助理教授",
      "國立臺灣師範大學美術研究所博士",
      "長期策劃跨國當代藝術研究計畫"
    ],
    "sections": [],
    "blocks": [],
    "createdAt": 1783419711250
  },
  {
    "id": "chao-liang-shen",
    "name": "沈昭良",
    "englishName": "Chao-Liang Shen",
    "title": "現任講師 · 視丘攝影藝術學院",
    "courses": "日間部「大師講座」",
    "photo": "https://www.fotosoft.com.tw/images/com_hikashop/upload/teacher-cv/chao-liang-shen/photo.jpg",
    "gallery": [],
    "links": [
      {
        "label": "個人網站",
        "url": "http://www.shenchaoliang.com/index.htm"
      }
    ],
    "status": "current",
    "pinned": false,
    "order": 68,
    "summary": "長期關注台灣社會與文化現場的紀實／專題攝影家，曾多次獲得金鼎獎與國際攝影獎項。",
    "tagline": "以長期專題與紀實影像，凝視台灣的社會與文化現場。",
    "intro": "",
    "sections": [
      {
        "title": "簡介",
        "body": "1968 年生於台灣台南，畢業於台灣藝術大學應用媒體藝術研究所。歷任報社攝影記者與副召集人，於 2000、2002 年獲頒行政院新聞局雜誌攝影類金鼎獎。\n\n其專題攝影作品《映像南方澳》及《台灣綜藝團》系列，分別於日本（2004）、韓國（2006）獲頒亞洲獎與最佳外國人攝影家獎，作品廣泛發表於國內外刊物，並多次受邀在台灣、日本、韓國、中國大陸等地展出。\n\n著有《玉蘭》、《映像南方澳》及《BRAND 9─全球九大暢銷品牌創意解析》。目前從事專題影像創作、評述與研究，並兼任教職於多所大學。"
      },
      {
        "title": "學歷",
        "body": "2005　台灣藝術大學應用媒體藝術研究所畢業，台北，台灣\n1995　日本工學院專門學校映像科畢業，東京，日本\n1989　世界新聞專科學校三專電影科編導組畢業，台北，台灣"
      },
      {
        "title": "曾任",
        "body": "2003.7 – 2008.4　自由時報攝影副召集人\n1996.3 – 2003.7　自由時報攝影記者"
      },
      {
        "title": "獲獎",
        "body": "2006　韓國東江國際攝影節，最佳外國人攝影家獎，寧越郡，江原道，韓國\n2004　日本相模原攝影亞洲獎，相模原市，日本\n2002　行政院新聞局雜誌影像類金鼎獎，台北，台灣\n2001　台北市新聞記者公會社會光明面新聞攝影報導獎，台北，台灣\n2000　行政院新聞局雜誌攝影類金鼎獎，台北，台灣"
      },
      {
        "title": "個展",
        "body": "2008　《玉蘭》，台灣國際視覺藝術中心（TIVAC），台北，台灣\n2006　《台灣綜藝團》，東江攝影博物館，江原道寧越郡，韓國\n2006　《映像南方澳》，宜蘭國際綠色影展，紅磚屋迎賓客廳，宜蘭，台灣\n2004　《映像南方澳》，台灣國際視覺藝術中心 TIVAC，台北，台灣\n1999　《築地魚市場、淺草的人跟神》，FNAC 南京店攝影走廊，台北，台灣"
      },
      {
        "title": "出版品",
        "body": "2008　《玉蘭》，沈昭良著，台灣\n2007　《南方澳大戲院興亡史》，邱坤良著、沈昭良攝影，INK 印刻，台灣\n2001　《映像南方澳》，大地地理，台灣\n1997　《BRAND 9─全球九大暢銷品牌創意解析》，滾石文化，台灣"
      }
    ],
    "blocks": [],
    "createdAt": 1783416701412,
    "course": "日間部「大師講座」",
    "image": "https://next-art.tainan.gov.tw/upload/artist_manager/05_Shen.jpg",
    "quote": "以長期專題與地方觀察，拓展攝影與社會、歷史、文化的關係。",
    "filters": [
      "documentary",
      "art"
    ],
    "tags": [
      "大師講座",
      "專題攝影",
      "影像研究"
    ],
    "detail": [
      "著有《玉蘭》、《映像南方澳》、《BRAND 9》等",
      "曾獲行政院新聞局雜誌攝影類金鼎獎",
      "目前從事專題影像創作、評述與研究"
    ]
  },
  {
    "id": "ren-jye-wang",
    "name": "王仁傑",
    "englishName": "Ren-Jye Wang",
    "title": "自由創作者・精密素描",
    "course": "日間部「精密素描」",
    "courses": "日間部「精密素描」",
    "photo": "https://www.fotosoft.com.tw/images/com_hikashop/upload/teacher-cv/Ren-Jye-WANG/18159266_10207209656360006_577304640_o.jpg",
    "image": "https://www.fotosoft.com.tw/images/com_hikashop/upload/teacher-cv/Ren-Jye-WANG/18159266_10207209656360006_577304640_o.jpg",
    "gallery": [],
    "links": [
      {
        "label": "個人網站",
        "url": "https://www.fotosoft.com.tw/class/faculty/current-faculty/29-ren-jye-wang.html"
      }
    ],
    "status": "current",
    "pinned": false,
    "order": 69,
    "summary": "1962 年生於台中，文化大學美術系西畫組畢業，現為自由創作者與視丘攝影藝術學院專任講師。",
    "tagline": "從素描與造型訓練進入影像，強化觀看、結構與畫面控制。",
    "quote": "從素描與造型訓練進入影像，強化觀看、結構與畫面控制。",
    "intro": "",
    "filters": [
      "art"
    ],
    "tags": [
      "精密素描",
      "跨域藝術",
      "造型基礎"
    ],
    "detail": [
      "視丘攝影藝術學院專任講師",
      "早期以照相寫實活躍於台灣藝壇",
      "創作兼蓄東西方美學底蘊"
    ],
    "sections": [],
    "blocks": [],
    "createdAt": 1783419711250
  }
]
`);

  const DEFAULT_FACULTY = [
    {
      id: 'wu-chia-pao',
      name: '吳嘉寶', englishName: 'Chia-Pao Wu',
      title: '創辦人 · 視丘攝影藝術學院',
      courses: '影像理論、視覺心理學、世界攝影史、台灣攝影史、Photobook 製作、攝影專題',
      photo: 'JIABAO_portraita.jpg',
      gallery: [], links: [],
      status: 'current', pinned: true, order: 0,
      summary: '1985 年創立視丘攝影藝術學院，長期推動台灣攝影教育與影像訊息讀寫能力。',
      tagline: '以理論、方法、書寫，鑿出台灣攝影教育的一條山路。',
      intro: '',
      sections: [
        { title: '簡介', body: '吳嘉寶老師自 1973 年於日本大學藝術學院攝影系專攻攝影理論與技術，隨後在日本大學研究所以「攝影教育」為主軌，是台灣第一位以學術方法系統推動「影像訊息讀寫教育（PLE）」的攝影教育工作者。\n\n1985 年創立視丘攝影藝術學院，將「攝影是一座山」的觀念帶進教學：從技術、美學、視覺心理學、攝影史到寫作，讓學生在畢業後仍能自力面對創作與職涯中源源不斷的問題。' },
        { title: '教學專長', body: '影像理論・視覺心理學・世界攝影史・台灣攝影史・Photobook 製作・作品集指導・攝影專題研究。' }
      ],
      blocks: []
    },
    ...CURRENT_FACULTY_SEEDS
  ];

  const DEFAULT_PREVIOUS = [
    { name: '吳文富', courses: '高級暗房班' }, { name: '吳洪銘', courses: '高級人像' }, { name: '宋　珮', courses: '藝術史班' },
    { name: '李旭彬', courses: '影像數位化理論系統' }, { name: '李美蓉', courses: '西洋藝術史班' }, { name: '杜宗尚', courses: '基礎暗房班' },
    { name: '林宜賢', courses: '影像數位化理論系統' }, { name: '林柏樑', courses: '攝影大師講座班' }, { name: '林家聲', courses: '個人寫真班' },
    { name: '邱奕堅', courses: 'Zone System 研究班' }, { name: '金明隆', courses: '婚紗攝影' }, { name: '姚瑞中', courses: '藝術史' },
    { name: '馬騰嶽', courses: '紀實攝影班' }, { name: '高重黎', courses: '攝影大師講座班' }, { name: '張美陵', courses: '西方現代攝影思潮史' },
    { name: '張晴雯', courses: '藝術史班' }, { name: '曹良賓', courses: '數位攝影技術班、大師講座、專題攝影' }, { name: '章光和', courses: '觀念攝影班' },
    { name: '許恆嘉', courses: '攝影初級班' }, { name: '許均仰', courses: '數位輸出理論' }, { name: '陳順築', courses: '大師講座' },
    { name: '陳春祿', courses: '基礎暗房班' }, { name: '陳贊雲', courses: '視覺藝術概論班' }, { name: '陳敏佳', courses: '數位影像後製與應用' },
    { name: '麥燦文', courses: '婚紗市場經營與管理' }, { name: '游本寬', courses: '視覺藝術概論班' }, { name: '黃子明', courses: '報導攝影' },
    { name: '黃明川', courses: '靜物攝影班' }, { name: '黃芳惠', courses: '色彩學研究班' }, { name: '黃建亮', courses: '影像美學與思考班' },
    { name: '黃書倩', courses: '藝術史班' }, { name: '楊峰榮', courses: '軟媒復合化多媒體視聽簡報' }, { name: '楊川宏', courses: '光線寫作' },
    { name: '廖鴻鵬', courses: '婚紗攝影' }, { name: '廖瑞德', courses: '新媒體藝術創作訓練、網頁設計、PHOTOSHOP 數位影像處理' }, { name: '蔡芷芬', courses: '藝術史班' },
    { name: '蔡永和', courses: '婚紗市場經營與管理' }, { name: '蔣載榮', courses: 'Zone System 研究班' }, { name: '鄧詩芳', courses: '攝影技術、高階攝影實戰研究、數位影像創作、廣告攝影實戰研究' },
    { name: '鄭桑溪', courses: '親炙大師講座' }, { name: '鄭維瑋', courses: '服飾攝影班、PhotoShop 表現技巧研究班' }, { name: '謝明順', courses: '攝影初級班' },
    { name: '王維明', courses: '攝影技術、大月評審、小外拍' }, { name: '磨強生', courses: '大型相機操作與商品攝影、建築與室內設計攝影' }, { name: '張緯宇', courses: '高級人像' },
    { name: '賴岳忠', courses: '婚紗攝影、婚紗市場經營與管理' }, { name: '蔡岳峻', courses: '動態影像拍攝' }, { name: '蔡仲誠', courses: '動態影像剪輯' },
    { name: '徐榕志', courses: '食品攝影' }, { name: '張金日', courses: '黑白基礎暗房、黑白高級暗房、基礎人像攝影' }
  ];

  DEFAULT_PREVIOUS.forEach(function (p, i) {
    DEFAULT_FACULTY.push({
      id: slugify(p.name) || 'previous-' + i,
      name: p.name.replace(/\s+/g, ''), englishName: '', title: '曾任師資', courses: p.courses,
      photo: '', gallery: [], links: [], status: 'previous', pinned: false, order: 100 + i,
      summary: p.courses, tagline: '', intro: '',
      sections: [{ title: '授課課程', body: p.courses }],
      blocks: []
    });
  });

  function safeParse(s) { try { return JSON.parse(s); } catch (_) { return null; } }
  function slugify(text) {
    return String(text || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '').replace(/-+/g, '-').slice(0, 60) || 'faculty-' + Date.now();
  }
  function broadcast() { try { window.dispatchEvent(new CustomEvent(EVENT_NAME)); } catch (_) {} }
  function stableHash(s) {
    let h = 0; s = String(s || '');
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }
  function normalizeGallery(list) {
    if (!Array.isArray(list)) return [];
    return list.map(function (item) {
      if (!item) return null;
      return { src: String(item.src || '').trim(), alt: String(item.alt || '').trim(), caption: String(item.caption || '').trim() };
    }).filter(function (item) { return item && item.src; });
  }
  function normalizeLinks(list) {
    if (!Array.isArray(list)) return [];
    return list.map(function (item) {
      if (!item) return null;
      return { label: String(item.label || '').trim(), url: String(item.url || '').trim() };
    }).filter(function (item) { return item && item.label && item.url; });
  }
  function normalizeDetail(list) {
    if (!Array.isArray(list)) return [];
    return list.map(function (item) { return String(item || '').trim(); }).filter(Boolean);
  }
  function normalizeSections(list) {
    if (!Array.isArray(list)) return [];
    return list.map(function (item) {
      if (!item) return null;
      return { title: String(item.title || '').trim(), body: String(item.body || '').trim() };
    }).filter(function (item) { return item && (item.title || item.body); });
  }
  function normalizeProfileI18n(raw, fallbackSections) {
    var src = raw && typeof raw === 'object' ? raw : {};
    var zh = normalizeSections(src.zh);
    var ja = normalizeSections(src.ja);
    var en = normalizeSections(src.en);
    if (!zh.length) zh = normalizeSections(fallbackSections);
    return { zh: zh, ja: ja, en: en };
  }
  function normalizeVideo(value) {
    return String(value || '').trim();
  }
  function normalizeVideos(value, list) {
    var items = [];
    if (typeof value === 'string') {
      items = value.trim() ? value.split(/\r?\n+/) : [];
    } else if (Array.isArray(list)) {
      items = list.slice();
    }
    var seen = new Set();
    return items.map(function (item) { return String(item || '').trim(); }).filter(function (item) {
      if (!item || seen.has(item)) return false;
      seen.add(item);
      return true;
    });
  }
  function normalizeOne(p, now) {
    const links = normalizeLinks(p.links);
    const externalLink = String(p.link || '').trim();
    if (externalLink && !links.some(function (item) { return item.url === externalLink; })) {
      links.push({ label: '個人網站', url: externalLink });
    }
    const detail = normalizeDetail(p.detail);
    var videos = normalizeVideos(p.video || p.videoUrl || '', p.videos);
    var primaryVideo = videos.length ? videos[0] : '';
    var profileI18n = normalizeProfileI18n(p.profileI18n, p.sections);
    return {
      id: p.id || (slugify(p.name) + '-' + now.toString(36)),
      name: (p.name || '未命名').trim(), englishName: (p.englishName || '').trim(), title: (p.title || '').trim(),
      course: (p.course || p.courses || '').trim(), courses: (p.courses || p.course || '').trim(),
      photo: (p.photo || p.image || '').trim(), image: (p.image || p.photo || '').trim(),
      video: primaryVideo,
      videos: videos,
      gallery: normalizeGallery(p.gallery), links: links,
      status: p.status === 'previous' ? 'previous' : 'current',
      pinned: !!p.pinned, order: typeof p.order === 'number' ? p.order : 999,
      summary: (p.summary || '').trim(), tagline: (p.tagline || p.quote || '').trim(), quote: (p.quote || '').trim(), intro: (p.intro || '').trim(),
      filters: Array.isArray(p.filters) ? p.filters.map(function (item) { return String(item || '').trim(); }).filter(Boolean) : [],
      tags: Array.isArray(p.tags) ? p.tags.map(function (item) { return String(item || '').trim(); }).filter(Boolean) : [],
      detail: detail,
      sections: profileI18n.zh,
      profileI18n: profileI18n,
      blocks: Array.isArray(p.blocks) ? p.blocks.filter(function (b) { return b && b.type; }) : [],
      createdAt: p.createdAt || now, updatedAt: now
    };
  }
  function ensureRequiredSeeds(list) {
    const required = CURRENT_FACULTY_SEEDS;
    const ids = new Set(list.map(function (item) { return item.id; }));
    let changed = false;
    required.forEach(function (seed) {
      const existing = list.find(function (item) { return item && item.id === seed.id; });
      if (!existing) {
        list.push(normalizeOne(seed, Date.now()));
        changed = true;
        return;
      }
      const normalizedSeed = normalizeOne(seed, Date.now());
      Object.keys(normalizedSeed).forEach(function (key) {
        const value = normalizedSeed[key];
        const current = existing[key];
        const isMissing = current == null || current === '' || (Array.isArray(current) && current.length === 0);
        if (isMissing && value != null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
          existing[key] = Array.isArray(value) ? value.slice() : value;
          changed = true;
        }
      });
    });
    return changed;
  }

  const FacultyStore = {
    STORAGE_KEY, EVENT_NAME, FALLBACK_PHOTOS,
    _seedIfEmpty() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FACULTY)); return; }
      const data = safeParse(raw);
      if (!Array.isArray(data)) { localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FACULTY)); return; }
      // 只在真的空的時候補預設；不再把 CURRENT_FACULTY_SEEDS 硬塞進使用者已有的資料，
      // 以免 faculty-data.json 裡沒有的老師被 seed 又補回、或欄位被 seed 蓋掉。
    },
    getAll() {
      this._seedIfEmpty();
      const data = safeParse(localStorage.getItem(STORAGE_KEY)) || [];
      return data.slice().sort(function (a, b) {
        if (!!b.pinned - !!a.pinned) return (!!b.pinned) - (!!a.pinned);
        const oa = typeof a.order === 'number' ? a.order : 999;
        const ob = typeof b.order === 'number' ? b.order : 999;
        if (oa !== ob) return oa - ob;
        return (a.createdAt || 0) - (b.createdAt || 0);
      });
    },
    getCurrent() { return this.getAll().filter(function (p) { return p.status !== 'previous'; }); },
    getPrevious() { return this.getAll().filter(function (p) { return p.status === 'previous'; }); },
    getById(id) { return this.getAll().find(function (p) { return p.id === id; }) || null; },
    photoOf(p) {
      if (!p) return '';
      if (p.photo && p.photo.trim()) return p.photo;
      if (p.image && p.image.trim()) return p.image;
      return FALLBACK_PHOTOS[stableHash(p.id) % FALLBACK_PHOTOS.length];
    },
    save(person) {
      const list = this.getAll();
      const now = Date.now();
      const isNew = !person.id || !list.some(function (i) { return i.id === person.id; });
      const normalized = normalizeOne(person, now);
      const next = isNew ? list.concat([normalized]) : list.map(function (i) { return i.id === normalized.id ? normalized : i; });
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) { console.warn('[faculty] quota', e); }
      try { localStorage.setItem(DIRTY_KEY, '1'); } catch (_) {}
      broadcast();
      return normalized;
    },
    remove(id) {
      const next = this.getAll().filter(function (i) { return i.id !== id; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      try { localStorage.setItem(DIRTY_KEY, '1'); } catch (_) {}
      broadcast();
    },
    moveTo(id, status) {
      const target = this.getById(id); if (!target) return;
      target.status = status === 'previous' ? 'previous' : 'current';
      this.save(target);
    },
    reorder(idList) {
      const map = new Map(this.getAll().map(function (p) { return [p.id, p]; }));
      const now = Date.now();
      idList.forEach(function (id, i) {
        const p = map.get(id); if (!p) return;
        if (!p.pinned) p.order = 10 + i;
        p.updatedAt = now;
      });
      const next = Array.from(map.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      try { localStorage.setItem(DIRTY_KEY, '1'); } catch (_) {}
      broadcast();
    },
    reset() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FACULTY));
      try { localStorage.removeItem(DIRTY_KEY); localStorage.removeItem(REMOTE_HASH_KEY); } catch (_) {}
      broadcast();
    },
    exportJSON() { return JSON.stringify(this.getAll(), null, 2); },
    importJSON(jsonString, mode) {
      const data = typeof jsonString === 'string' ? safeParse(jsonString) : jsonString;
      if (!Array.isArray(data)) throw new Error('匯入資料格式錯誤：必須為陣列');
      if (mode === 'merge') {
        const map = new Map(this.getAll().map(function (i) { return [i.id, i]; }));
        data.forEach(function (i) { if (i && i.id) map.set(i.id, i); });
        const merged = Array.from(map.values());
        ensureRequiredSeeds(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } else {
        ensureRequiredSeeds(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      try { localStorage.setItem(DIRTY_KEY, '1'); } catch (_) {}
      broadcast();
    },
    isUserDirty() {
      try { return localStorage.getItem(DIRTY_KEY) === '1'; } catch (_) { return false; }
    },
    clearUserDirty() {
      try { localStorage.removeItem(DIRTY_KEY); } catch (_) {}
    },
    _maxUpdatedAt(list) {
      if (!Array.isArray(list) || !list.length) return 0;
      return list.reduce(function (m, item) {
        const t = item && typeof item.updatedAt === 'number' ? item.updatedAt : 0;
        return t > m ? t : m;
      }, 0);
    },
    /**
     * 從 faculty-data.json 讀取資料。
     * 規則：只要成功讀到檔案（HTTP 200、格式正確），就以檔案為準覆蓋 localStorage，
     *   並清掉本機的 dirty / hash 旗標。抓不到（404、離線、格式錯誤）才會保留本機資料。
     * options.force 目前僅保留相容性，行為與預設一致。
     */
    refreshFromRemote(options) {
      const self = this;
      const url = REMOTE_JSON + '?t=' + Date.now();
      return fetch(url, { cache: 'no-store' })
        .then(function (r) {
          if (!r.ok) {
            console.warn('[faculty] refreshFromRemote: HTTP ' + r.status + ' 讀不到 ' + REMOTE_JSON + '，維持本機資料');
            return null;
          }
          return r.text();
        })
        .then(function (text) {
          if (!text) return false;
          const data = safeParse(text);
          if (!Array.isArray(data)) {
            console.warn('[faculty] refreshFromRemote: faculty-data.json 不是陣列，維持本機資料');
            return false;
          }
          // 完全以檔案為準：不再呼叫 ensureRequiredSeeds()，避免把 JS 內的 seed 塞回檔案未列的老師，
          // 或把檔案中被清空的欄位又補上 seed 值。
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          try {
            localStorage.setItem(REMOTE_HASH_KEY, String(stableHash(text)));
            localStorage.removeItem(DIRTY_KEY);
          } catch (_) {}
          console.info('[faculty] refreshFromRemote: 已以 ' + REMOTE_JSON + ' 覆蓋本機資料，共 ' + data.length + ' 筆');
          broadcast();
          return true;
        }).catch(function (err) {
          console.warn('[faculty] refreshFromRemote: 讀取失敗', err);
          return false;
        });
    },
    forceReloadFromRemote() {
      return this.refreshFromRemote({ force: true });
    },
    subscribe(callback) {
      const handler = function () { callback(); };
      window.addEventListener(EVENT_NAME, handler);
      window.addEventListener('storage', function (e) { if (e.key === STORAGE_KEY) callback(); });
      return function () { window.removeEventListener(EVENT_NAME, handler); };
    },
    slugify
  };

  global.FacultyStore = FacultyStore;
})(window);

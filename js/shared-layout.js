/* Shared layout blocks for gallery/work-detail pages.
 * Source of design: index.html
 */
(function (global) {
  'use strict';

  function injectStyleOnce() {
    if (document.getElementById('shared-layout-style')) return;
    var style = document.createElement('style');
    style.id = 'shared-layout-style';
    style.textContent = [
      '@keyframes slowDrift {',
      '  0% { transform: translate(0, 0) scale(1); opacity: 0.3; }',
      '  50% { transform: translate(2vw, 2vh) scale(1.05); opacity: 0.6; }',
      '  100% { transform: translate(0, 0) scale(1); opacity: 0.3; }',
      '}',
      '.glass-card {',
      '  background: rgba(255, 255, 255, 0.55);',
      '  backdrop-filter: blur(20px);',
      '  -webkit-backdrop-filter: blur(20px);',
      '  border: 1px solid rgba(255, 255, 255, 0.9);',
      '  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);',
      '}',
      '#navbar {',
      '  position: fixed !important;',
      '  top: 0; left: 0; right: 0;',
      '  transition: transform 0.35s ease, opacity 0.35s ease;',
      '  will-change: transform;',
      '}',
      '#navbar.nav-hidden {',
      '  transform: translateY(-120%);',
      '  opacity: 0.98;',
      '}',
      'body.shared-header-mounted {',
      '  padding-top: var(--shared-header-height, 76px);',
      '}',
      '.shared-submenu-link {',
      '  position: relative;',
      '  display: block;',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 0.55rem;',
      '  padding: 0.68rem 0.9rem 0.68rem 1rem;',
      '  font-size: 0.82rem;',
      '  letter-spacing: 0.2em;',
      '  color: #6C757D;',
      '  transition: color 0.2s ease, background-color 0.2s ease, padding-left 0.2s ease;',
      '  white-space: nowrap;',
      '}',
      '.shared-submenu-link-icon {',
      '  width: 0.95rem;',
      '  text-align: center;',
      '  font-size: 0.82rem;',
      '  color: #ADB5BD;',
      '  transform: translateX(-6px) scale(0.88);',
      '  opacity: 0;',
      '  transition: transform 0.2s ease, opacity 0.2s ease, color 0.2s ease;',
      '}',
      '.shared-submenu-link-label {',
      '  flex: 0 0 auto;',
      '}',
      '.shared-submenu-link:hover {',
      '  color: #212529;',
      '  background: rgba(233, 236, 239, 0.75);',
      '  padding-left: 1.1rem;',
      '}',
      '.shared-submenu-link:hover .shared-submenu-link-icon {',
      '  opacity: 1;',
      '  transform: translateX(0) scale(1);',
      '  color: #343A40;',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function setupHeaderScrollBehavior() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    // Avoid duplicate listeners when pages re-mount shared layout.
    if (navbar.dataset.scrollBehaviorBound === '1') return;
    navbar.dataset.scrollBehaviorBound = '1';

    // Reserve space so fixed header doesn't overlap page content.
    document.body.classList.add('shared-header-mounted');
    function updateHeaderHeight() {
      var h = navbar.offsetHeight || 76;
      document.body.style.setProperty('--shared-header-height', h + 'px');
    }
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    var lastScroll = window.scrollY || 0;

    function onScroll() {
      var current = window.scrollY || 0;
      var scrolledDown = current > lastScroll + 6;
      // Any upward movement should bring header back immediately.
      var scrolledUp = current < lastScroll;

      if (current <= 40 || scrolledUp) {
        navbar.classList.remove('nav-hidden');
      } else if (current > 140 && scrolledDown) {
        navbar.classList.add('nav-hidden');
      }

      lastScroll = current;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function renderHeader(activeNav, options) {
    var opts = options || {};
    var onIndex = !!opts.onIndex;
    var logoHref = onIndex ? '#' : 'index.html';
    var philosophyHref = 'about.html';
    var coursesHref = onIndex ? '#courses' : 'index.html#courses';
    var insightsHref = onIndex ? '#insights' : 'index.html#insights';

    function navClass(name) {
      var isActive = activeNav === name;
      var base = 'transition-colors relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[1px] after:bg-gallery-900 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left';
      return (isActive ? 'text-gallery-900 ' : 'text-gallery-500 hover:text-gallery-900 ') + base;
    }

    // 「關於視丘」下拉子選單（對應 about.html 的各區塊 anchor）
    var aboutSubmenu = [
      { label: 'LOGO',   hash: '#logo',         icon: 'fa-infinity' },
      { label: '願景與使命',   hash: '#vision',       icon: 'fa-bullseye' },
      { label: '視丘是什麼',   hash: '#thalamus',     icon: 'fa-brain' },
      { label: '教育哲學',     hash: '#philosophy',   icon: 'fa-book-open' },
      { label: '學院特色',     hash: '#features',     icon: 'fa-building-columns' },
      { label: '成績單',       hash: '#achievements', icon: 'fa-award' },
      { label: '畢業校友',     hash: '#alumni',       icon: 'fa-user-graduate' }
    ];

    var aboutMenuItemsHTML = aboutSubmenu.map(function (item) {
      return '<a href="about.html' + item.hash + '" ' +
             'class="shared-submenu-link">' +
             '<span class="shared-submenu-link-icon"><i class="fa-solid ' + item.icon + '"></i></span>' +
             '<span class="shared-submenu-link-label">' + item.label + '</span></a>';
    }).join('');

    var aboutDropdownHTML =
      '<div class="relative group">' +
      '  <a href="' + philosophyHref + '" class="' + navClass('philosophy') + '">' +
      '    關於視丘' +
      '  </a>' +
      '  <div class="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">' +
            '    <div class="inline-block w-max min-w-0 bg-white/95 backdrop-blur-lg border border-gallery-200 shadow-xl rounded-xl py-3 overflow-hidden">' +
             aboutMenuItemsHTML +
      '    </div>' +
      '  </div>' +
      '</div>';

    return '' +
      '<header id="navbar" class="sticky w-full top-0 z-50 py-4 px-6 md:px-12 bg-white/95 backdrop-blur-lg text-gallery-900 border-b border-gallery-200 shadow-sm">' +
      '  <div class="max-w-7xl mx-auto flex justify-between items-center">' +
      '    <a href="' + logoHref + '" class="font-serif text-2xl font-bold tracking-widest flex items-center gap-3 group">' +
      '      <img src="logo.webp" alt="視丘 Logo" class="h-9 w-auto object-contain">' +
      '      <span>視丘 <span class="font-display text-sm font-light tracking-widest uppercase text-gallery-400 group-hover:text-gallery-900 transition-colors">Fotosoft</span></span>' +
      '    </a>' +
      '    <nav class="hidden lg:flex items-center gap-10 text-sm tracking-[0.2em] font-bold">' +
             aboutDropdownHTML +
      '      <a href="' + coursesHref + '" class="' + navClass('courses') + '">課程總覽</a>' +
      '      <a href="gallery.html" class="' + navClass('gallery') + '">家族藝廊</a>' +
      '      <a href="' + insightsHref + '" class="' + navClass('insights') + '">尖端洞察</a>' +
      '    </nav>' +
      '    <div class="hidden lg:block">' +
      '      <a href="#" class="border border-gallery-800 text-gallery-900 px-6 py-2.5 text-xs tracking-[0.2em] font-bold hover:bg-gallery-900 hover:text-white transition-all duration-300 rounded-full bg-white/50 backdrop-blur-sm">' +
      '        預約免費旁聽' +
      '      </a>' +
      '    </div>' +
      '    <button class="lg:hidden text-2xl text-gallery-800" aria-label="開啟選單">' +
      '      <i class="fa-solid fa-bars"></i>' +
      '    </button>' +
      '  </div>' +
      '</header>';
  }

  function renderGlobalBackground() {
    return '' +
      '<div class="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-gallery-100">' +
      '  <img src="back.png" alt="背景紋理" class="absolute inset-0 w-full h-full object-cover grayscale opacity-[0.6] mix-blend-multiply object-[center_30%]">' +
      '  <div class="absolute inset-0 bg-[url(\'https://www.transparenttextures.com/patterns/cream-paper.png\')] opacity-80 mix-blend-multiply"></div>' +
      '  <div class="absolute top-0 left-0 w-full h-[25vh] bg-gradient-to-b from-white/60 to-transparent"></div>' +
      '  <div class="absolute bottom-0 left-0 w-full h-[25vh] bg-gradient-to-t from-[#F8F9FA]/60 to-transparent"></div>' +
      '  <div class="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-white blur-[120px] animate-[slowDrift_20s_infinite_alternate]" style="animation-delay:-5s;"></div>' +
      '  <div class="absolute top-[50%] -left-[15%] w-[40vw] h-[40vw] rounded-full bg-white blur-[100px] animate-[slowDrift_25s_infinite_alternate_reverse]"></div>' +
      '</div>';
  }

  function renderCTA() {
    return '' +
      '<section class="py-8 md:py-12 text-gallery-900 text-center px-6 relative z-10 overflow-hidden">' +
      '  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-4xl max-h-4xl bg-white rounded-full blur-[120px] pointer-events-none -z-10 opacity-70"></div>' +
      '  <div class="max-w-3xl mx-auto p-12 md:p-24 relative group">' +
      '    <div class="absolute top-0 left-0 w-6 h-[1px] bg-gallery-400"></div>' +
      '    <div class="absolute top-0 left-0 w-[1px] h-6 bg-gallery-400"></div>' +
      '    <div class="absolute bottom-0 right-0 w-6 h-[1px] bg-gallery-400"></div>' +
      '    <div class="absolute bottom-0 right-0 w-[1px] h-6 bg-gallery-400"></div>' +
      '    <h2 class="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">準備好重新認識<br><span class="italic font-light text-gallery-500">影像</span>了嗎？</h2>' +
      '    <p class="text-gallery-500 font-medium text-sm tracking-widest mb-16">加入視丘，開啟你的影像創作旅程。</p>' +
      '    <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">' +
      '      <a href="#" class="bg-gallery-900 text-white rounded-full px-10 py-4 text-sm font-bold tracking-[0.2em] hover:bg-gallery-800 transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-1">填寫諮詢表單</a>' +
      '      <a href="#" class="glass-card text-gallery-900 rounded-full px-10 py-4 text-sm font-bold tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white transition-all duration-300 w-full sm:w-auto hover:-translate-y-1">' +
      '        <i class="fa-brands fa-line text-lg text-[#00B900]"></i> 官方 LINE 諮詢' +
      '      </a>' +
      '    </div>' +
      '  </div>' +
      '</section>';
  }

  function renderFooter() {
    return '' +
      '<footer class="border-t border-gallery-300 pt-20 pb-12 px-6 md:px-12 text-xs font-medium text-gallery-500 relative z-10 glass-card rounded-none border-x-0 border-b-0">' +
      '  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">' +
      '    <div class="col-span-1 md:col-span-2 lg:col-span-1">' +
      '      <a href="index.html" class="font-serif text-2xl font-bold tracking-widest flex items-center gap-3 text-gallery-900 mb-6">' +
      '        <img src="logo.webp" alt="視丘 Logo" class="h-10 w-auto object-contain">' +
      '        <span>視丘 <span class="font-display text-sm font-light tracking-widest uppercase text-gallery-400">Fotosoft</span></span>' +
      '      </a>' +
      '      <p class="leading-relaxed tracking-wider mb-8">台灣唯一專業攝影私塾大學<br>自 1987 年起，致力於 PLE 影像訊息讀寫教育。</p>' +
      '      <div class="flex gap-4">' +
      '        <a href="#" class="w-10 h-10 rounded-full border border-gallery-300 bg-white/50 flex items-center justify-center hover:bg-gallery-900 hover:text-white hover:border-gallery-900 transition-all duration-300 text-sm text-gallery-800 shadow-sm"><i class="fa-brands fa-facebook-f"></i></a>' +
      '        <a href="#" class="w-10 h-10 rounded-full border border-gallery-300 bg-white/50 flex items-center justify-center hover:bg-gallery-900 hover:text-white hover:border-gallery-900 transition-all duration-300 text-sm text-gallery-800 shadow-sm"><i class="fa-brands fa-instagram"></i></a>' +
      '        <a href="#" class="w-10 h-10 rounded-full border border-gallery-300 bg-white/50 flex items-center justify-center hover:bg-gallery-900 hover:text-white hover:border-gallery-900 transition-all duration-300 text-sm text-gallery-800 shadow-sm"><i class="fa-brands fa-youtube"></i></a>' +
      '      </div>' +
      '    </div>' +
      '    <div>' +
      '      <h4 class="text-gallery-900 font-display font-bold tracking-[0.2em] uppercase mb-8">About</h4>' +
      '      <ul class="space-y-4 tracking-widest">' +
      '        <li><a href="about.html#features" class="hover:text-gallery-900 transition-colors">學院特色</a></li>' +
      '        <li><a href="#" class="hover:text-gallery-900 transition-colors">師資陣容</a></li>' +
      '        <li><a href="gallery.html" class="hover:text-gallery-900 transition-colors">視丘藝廊</a></li>' +
      '        <li><a href="#" class="hover:text-gallery-900 transition-colors">交通資訊</a></li>' +
      '      </ul>' +
      '    </div>' +
      '    <div>' +
      '      <h4 class="text-gallery-900 font-display font-bold tracking-[0.2em] uppercase mb-8">Programs</h4>' +
      '      <ul class="space-y-4 tracking-widest">' +
      '        <li><a href="index.html#courses" class="hover:text-gallery-900 transition-colors">日間部 全職養成</a></li>' +
      '        <li><a href="index.html#courses" class="hover:text-gallery-900 transition-colors">夜間部 在職進修</a></li>' +
      '        <li><a href="index.html#courses" class="hover:text-gallery-900 transition-colors">動態影像 攝影指導</a></li>' +
      '        <li><a href="#" class="hover:text-gallery-900 transition-colors">企業包班</a></li>' +
      '      </ul>' +
      '    </div>' +
      '    <div>' +
      '      <h4 class="text-gallery-900 font-display font-bold tracking-[0.2em] uppercase mb-8">Contact</h4>' +
      '      <ul class="space-y-4 tracking-wider font-sans">' +
      '        <li>台北市松山區八德路三段...</li>' +
      '        <li>Tel: (02) 2773-5258</li>' +
      '        <li>Email: info@fotosoft.com.tw</li>' +
      '      </ul>' +
      '    </div>' +
      '  </div>' +
      '  <div class="max-w-7xl mx-auto pt-8 border-t border-gallery-300 flex flex-col md:flex-row justify-between items-center gap-4 tracking-widest">' +
      '    <p>&copy; 2026 Fotosoft. All rights reserved.</p>' +
      '    <div class="flex gap-8">' +
      '      <a href="#" class="hover:text-gallery-900 transition-colors">隱私權政策</a>' +
      '      <a href="#" class="hover:text-gallery-900 transition-colors">服務條款</a>' +
      '    </div>' +
      '  </div>' +
      '</footer>';
  }

  function mount(options) {
    var opts = options || {};
    injectStyleOnce();

    var bg = document.getElementById('shared-global-bg');
    if (bg) bg.innerHTML = renderGlobalBackground();

    var header = document.getElementById('shared-header');
    if (header) {
      header.innerHTML = renderHeader(opts.activeNav || '', opts);
      setupHeaderScrollBehavior();
    }

    var cta = document.getElementById('shared-cta');
    if (cta) cta.innerHTML = renderCTA();

    var footer = document.getElementById('shared-footer');
    if (footer) footer.innerHTML = renderFooter();
  }

  global.SharedLayout = { mount: mount };
})(window);

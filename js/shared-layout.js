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
      '}',
      '#shared-mobile-menu {',
      '  transition: opacity 0.35s ease;',
      '}',
      '.shared-mm-dots {',
      '  background-image: radial-gradient(#343A40 1px, transparent 1px);',
      '  background-size: 16px 16px;',
      '  opacity: 0.06;',
      '}',
      '.shared-mm-decor {',
      '  position: absolute; left: -3rem; bottom: -2.5rem;',
      '  font-size: 17rem; color: rgba(33, 37, 41, 0.035);',
      '  pointer-events: none; transform: rotate(-12deg);',
      '}',
      '.shared-mm-link {',
      '  display: block; text-align: right; position: relative;',
      '  cursor: pointer; background: transparent; border: 0;',
      '}',
      '.shared-mm-main {',
      '  display: block; font-family: "Noto Serif TC", serif; font-weight: 700;',
      '  font-size: 1.75rem; line-height: 1.15; color: #212529;',
      '  transition: color 0.3s ease;',
      '}',
      '.shared-mm-link:hover .shared-mm-main,',
      '.shared-mm-link.active .shared-mm-main { color: #6C757D; }',
      '.shared-mm-sub {',
      '  display: block; font-family: "Roboto", sans-serif; font-size: 0.6rem;',
      '  letter-spacing: 0.3em; text-transform: uppercase; color: #ADB5BD;',
      '  margin-top: 0.35rem; transition: color 0.3s ease;',
      '}',
      '.shared-mm-link:hover .shared-mm-sub,',
      '.shared-mm-link.active .shared-mm-sub { color: #6C757D; }',
      '.shared-mm-chevron {',
      '  font-size: 0.72rem; color: #ADB5BD; margin-right: 0.55rem;',
      '  display: inline-block; transition: transform 0.3s ease, color 0.3s ease;',
      '}',
      '.shared-mm-link.active .shared-mm-chevron { transform: rotate(90deg); color: #212529; }',
      '.shared-mm-panel { display: none; width: 100%; }',
      '.shared-mm-panel.active { display: block; }',
      '.shared-mm-panel-eyebrow {',
      '  font-family: "Roboto", sans-serif; font-size: 0.6rem; letter-spacing: 0.3em;',
      '  text-transform: uppercase; color: #ADB5BD; margin-bottom: 1rem;',
      '}',
      '.shared-mm-panel-link {',
      '  display: block; font-family: "Noto Serif TC", serif; font-size: 1.05rem;',
      '  color: #343A40; padding: 0.5rem 0; opacity: 0;',
      '  animation: sharedMmFade 0.45s ease-out forwards;',
      '  transition: color 0.2s ease;',
      '}',
      '.shared-mm-panel-link:hover { color: #6C757D; }',
      '@keyframes sharedMmFade {',
      '  from { opacity: 0; transform: translateY(10px); }',
      '  to { opacity: 1; transform: translateY(0); }',
      '}',
      '.shared-cta-wrap {',
      '  overflow: visible !important;',
      '  margin-top: clamp(76px, 9vw, 110px);',
      '  background-image: url("image/cta網點.webp");',
      '  background-repeat: no-repeat;',
      '  background-position: center bottom;',
      '  background-size: cover;',
      '}',
      '.shared-cta-bridge {',
      '  position: absolute;',
      '  left: 50%;',
      '  top: -72px;',
      '  transform: translateX(-50%);',
      '  width: min(320px, 34vw);',
      '  height: 150px;',
      '  pointer-events: none;',
      '  z-index: 0;',
      '}',
      '.shared-cta-bridge-line {',
      '  position: absolute;',
      '  left: 50%;',
      '  top: 0;',
      '  width: 1px;',
      '  height: 200px;',
      '  transform: translateX(-50%);',
      '  background: linear-gradient(to bottom, rgba(173,181,189,0), rgba(173,181,189,0.66) 36%, rgba(173,181,189,0.45) 74%, rgba(173,181,189,0.16) 92%, rgba(173,181,189,0));',
      '}',
      '.shared-cta-bridge-noise {',
      '  position: absolute;',
      '  left: 50%;',
      '  top: 24px;',
      '  width: 120px;',
      '  height: 46px;',
      '  transform: translateX(-50%);',
      '  background-image: radial-gradient(rgba(173,181,189,0.5) 0.8px, transparent 0.9px);',
      '  background-size: 9px 9px;',
      '  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);',
      '  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);',
      '  opacity: 0.38;',
      '}',
      '.shared-cta-kicker {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 0.58rem;',
      '  font-family: "Roboto", sans-serif;',
      '  font-size: 0.66rem;',
      '  font-weight: 800;',
      '  letter-spacing: 0.34em;',
      '  text-transform: uppercase;',
      '  color: #ADB5BD;',
      '  margin-bottom: 1.5rem;',
      '}',
      '.shared-cta-kicker-dot {',
      '  width: 0.3rem;',
      '  height: 0.3rem;',
      '  border-radius: 999px;',
      '  background: #ADB5BD;',
      '  opacity: 0.9;',
      '}',
      '.closing-fx {',
      '  overflow: visible !important;',
      '}',
      '.closing-fx .closing-glow {',
      '  position: absolute;',
      '  left: 50%;',
      '  top: calc(100% + 106px);',
      '  width: min(1080px, 88vw);',
      '  height: clamp(240px, 34vh, 380px);',
      '  transform: translateX(-50%);',
      '  background: radial-gradient(ellipse at top, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 28%, rgba(255,255,255,0.36) 58%, rgba(255,255,255,0.12) 76%, transparent 100%);',
      '  filter: blur(58px);',
      '}',
      '@media (max-width: 767px) {',
      '  .shared-cta-wrap { margin-top: clamp(64px, 12vw, 88px); }',
      '  .shared-cta-bridge { top: -60px; height: 132px; }',
      '  .shared-cta-bridge-line { height: 136px; }',
      '  .closing-fx .closing-glow { top: calc(100% + 52px); height: clamp(180px, 24vh, 280px); filter: blur(44px); }',
      '  .shared-cta-kicker { font-size: 0.6rem; letter-spacing: 0.28em; margin-bottom: 1.2rem; }',
      '}',
      '.shared-fab-wrap {',
      '  position: fixed;',
      '  right: 1rem;',
      '  bottom: 1rem;',
      '  z-index: 65;',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 0.72rem;',
      '  pointer-events: none;',
      '}',
      '.shared-fab-btn {',
      '  pointer-events: auto;',
      '  width: 3.25rem;',
      '  height: 3.25rem;',
      '  position: relative;',
      '  border-radius: 999px;',
      '  display: inline-flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  border: 0.8px solid var(--fab-ring-border, rgba(40, 46, 135, 0.28));',
      '  background: var(--fab-ring, #ffffff);',
      '  color: var(--fab-icon, #282E87);',
      '  box-shadow: 0 10px 24px rgba(31, 41, 55, 0.2);',
      '  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, opacity 0.25s ease;',
      '}',
      '.shared-fab-btn::before {',
      '  content: "";',
      '  position: absolute;',
      '  inset: 0.14rem;',
      '  border-radius: 999px;',
      '  background: var(--fab-fill, #ffffff);',
      '  border: 0.8px solid var(--fab-fill-border, transparent);',
      '}',
      '.shared-fab-btn > i {',
      '  position: relative;',
      '  z-index: 1;',
      '}',
      '.shared-fab-btn:hover {',
      '  transform: translateY(-2px) scale(1.04);',
      '}',
      '.shared-fab-btn--fb {',
      '  --fab-ring: linear-gradient(180deg, #6674B2, #4E5C9F);',
      '  --fab-ring-border: rgba(78, 92, 159, 0.84);',
      '  --fab-fill: #ffffff;',
      '  --fab-fill-border: rgba(78, 92, 159, 0.24);',
      '  --fab-icon: #4E5C9F;',
      '}',
      '.shared-fab-btn--fb:hover {',
      '  box-shadow: 0 14px 30px rgba(78, 92, 159, 0.36);',
      '}',
      '.shared-fab-btn--contact {',
      '  --fab-ring: #ffffff;',
      '  --fab-ring-border: rgba(78, 92, 159, 0.45);',
      '  --fab-fill: linear-gradient(180deg, #6270AD, #4B599A);',
      '  --fab-fill-border: rgba(78, 92, 159, 0.74);',
      '  --fab-icon: #ffffff;',
      '  backdrop-filter: blur(10px);',
      '  -webkit-backdrop-filter: blur(10px);',
      '}',
      '.shared-fab-btn--contact:hover {',
      '  --fab-ring-border: rgba(78, 92, 159, 0.74);',
      '  --fab-fill: linear-gradient(180deg, #6B79B7, #5361A2);',
      '  box-shadow: 0 14px 30px rgba(78, 92, 159, 0.28);',
      '}',
      '.shared-fab-btn--top {',
      '  --fab-ring: linear-gradient(180deg, #6674B2, #4E5C9F);',
      '  --fab-ring-border: rgba(92, 106, 176, 0.64);',
      '  --fab-fill: #43508A;',
      '  --fab-fill-border: rgba(255, 255, 255, 0.75);',
      '  --fab-icon: #EEF0FF;',
      '  opacity: 0;',
      '  transform: translateY(12px);',
      '  pointer-events: none;',
      '}',
      '.shared-fab-btn--top.is-visible {',
      '  opacity: 1;',
      '  transform: translateY(0);',
      '  pointer-events: auto;',
      '}',
      '.shared-fab-btn--top:hover {',
      '  --fab-ring-border: rgba(97, 112, 186, 0.86);',
      '  --fab-fill-border: rgba(255, 255, 255, 0.9);',
      '  box-shadow: 0 14px 30px rgba(67, 80, 138, 0.4);',
      '}',
      '.shared-fab-tip {',
      '  position: absolute;',
      '  right: calc(100% + 0.65rem);',
      '  padding: 0.38rem 0.62rem;',
      '  border-radius: 0.55rem;',
      '  background: rgba(71, 84, 136, 0.9);',
      '  color: #F8FAFC;',
      '  font-size: 0.62rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.12em;',
      '  white-space: nowrap;',
      '  opacity: 0;',
      '  transform: translateX(6px);',
      '  transition: opacity 0.2s ease, transform 0.2s ease;',
      '  pointer-events: none;',
      '}',
      '.shared-fab-btn:hover .shared-fab-tip {',
      '  opacity: 1;',
      '  transform: translateX(0);',
      '}',
      '.shared-footer-sitemap-head {',
      '  display: grid;',
      '  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);',
      '  column-gap: 2rem;',
      '  align-items: end;',
      '  margin-bottom: 1.85rem;',
      '}',
      '.shared-footer-sitemap-head > :first-child {',
      '  text-align: right;',
      '}',
      '.shared-footer-sitemap-body {',
      '  display: grid;',
      '  grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr);',
      '  column-gap: 1.45rem;',
      '  align-items: start;',
      '}',
      '.shared-footer-sitemap-divider {',
      '  align-self: stretch;',
      '  background: linear-gradient(to bottom, rgba(173,181,189,0), rgba(173,181,189,0.85) 12%, rgba(173,181,189,0.85) 88%, rgba(173,181,189,0));',
      '}',
      '.shared-footer-sitemap-list {',
      '  font-size: 1.02rem;',
      '  letter-spacing: 0.16em;',
      '}',
      '.shared-footer-sitemap-list li + li {',
      '  margin-top: 1rem;',
      '}',
      '.shared-footer-sitemap-list a {',
      '  color: #6C757D;',
      '}',
      '.shared-footer-sitemap-list a:hover {',
      '  color: #212529;',
      '}',
      '.shared-footer-sitemap-list--left {',
      '  text-align: right;',
      '}',
      '@media (min-width: 768px) {',
      '  .shared-fab-wrap { right: 1.35rem; bottom: 1.35rem; }',
      '}',
      '@media (max-width: 767px) {',
      '  .shared-footer-sitemap-head { display: none; }',
      '  .shared-footer-sitemap-body {',
      '    grid-template-columns: 1fr;',
      '    row-gap: 1rem;',
      '  }',
      '  .shared-footer-sitemap-divider { display: none; }',
      '  .shared-footer-sitemap-body > :nth-child(1),',
      '  .shared-footer-sitemap-body > :nth-child(3) { padding-top: 0.35rem; }',
      '  .shared-footer-sitemap-body > :nth-child(1)::before,',
      '  .shared-footer-sitemap-body > :nth-child(3)::before {',
      '    display: block;',
      '    margin-bottom: 1rem;',
      '    font-family: "Noto Sans TC", sans-serif;',
      '    font-size: 0.75rem;',
      '    font-weight: 700;',
      '    letter-spacing: 0.2em;',
      '    line-height: 1;',
      '    color: #212529;',
      '  }',
      '  .shared-footer-sitemap-body > :nth-child(1)::before { content: "全站快速導覽"; }',
      '  .shared-footer-sitemap-body > :nth-child(3)::before { content: "PROGRAMS"; }',
      '  .shared-footer-sitemap-list--left { text-align: left; }',
      '  .shared-footer-sitemap-list { font-size: 0.95rem; letter-spacing: 0.12em; }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function renderFloatingActions() {
    return '' +
      '<div id="shared-floating-actions" class="shared-fab-wrap" aria-label="快捷操作按鍵">' +
      '  <a href="https://www.facebook.com/Fotosoft" target="_blank" rel="noopener" class="shared-fab-btn shared-fab-btn--fb" aria-label="前往 Facebook 粉絲專頁">' +
      '    <i class="fa-brands fa-facebook-f"></i>' +
      '    <span class="shared-fab-tip">Facebook</span>' +
      '  </a>' +
      '  <button id="shared-fab-contact" type="button" class="shared-fab-btn shared-fab-btn--contact" aria-label="聯絡我們">' +
      '    <i class="fa-solid fa-phone"></i>' +
      '    <span class="shared-fab-tip">聯絡我們</span>' +
      '  </button>' +
      '  <button id="shared-fab-top" type="button" class="shared-fab-btn shared-fab-btn--top" aria-label="回到頂端">' +
      '    <i class="fa-solid fa-arrow-up"></i>' +
      '    <span class="shared-fab-tip">回到頂端</span>' +
      '  </button>' +
      '</div>';
  }

  function setupFloatingActions() {
    var wrap = document.getElementById('shared-floating-actions');
    if (!wrap || wrap.dataset.bound === '1') return;
    wrap.dataset.bound = '1';

    var contactBtn = document.getElementById('shared-fab-contact');
    var topBtn = document.getElementById('shared-fab-top');
    var topThreshold = 280;

    function updateTopButton() {
      if (!topBtn) return;
      if ((window.scrollY || 0) > topThreshold) topBtn.classList.add('is-visible');
      else topBtn.classList.remove('is-visible');
    }

    if (contactBtn) {
      contactBtn.addEventListener('click', function () {
        var target = document.getElementById('shared-cta') || document.getElementById('shared-footer');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    if (topBtn) {
      topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    window.addEventListener('scroll', updateTopButton, { passive: true });
    updateTopButton();
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
      // Guard against occasional abnormal measurements that can create large top gaps.
      var raw = navbar.getBoundingClientRect().height || navbar.offsetHeight || 76;
      var h = Math.max(60, Math.min(120, Math.round(raw)));
      document.body.style.setProperty('--shared-header-height', h + 'px');
    }
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('load', updateHeaderHeight);
    window.addEventListener('pageshow', updateHeaderHeight);

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

  function setupMobileMenu() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    if (navbar.dataset.mobileMenuBound === '1') return;
    navbar.dataset.mobileMenuBound = '1';

    var menu = document.getElementById('shared-mobile-menu');
    var toggle = document.getElementById('shared-mobile-menu-toggle');
    var closeBtn = document.getElementById('shared-mobile-menu-close');
    var backdrop = document.getElementById('shared-mobile-menu-backdrop');
    if (!menu || !toggle || !closeBtn) return;

    function clearSubmenus() {
      menu.querySelectorAll('.shared-mm-link.active').forEach(function (b) { b.classList.remove('active'); });
      menu.querySelectorAll('.shared-mm-panel.active').forEach(function (p) { p.classList.remove('active'); });
    }

    function openMenu() {
      menu.classList.remove('hidden');
      requestAnimationFrame(function () { menu.style.opacity = '1'; });
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      menu.style.opacity = '0';
      setTimeout(function () { menu.classList.add('hidden'); clearSubmenus(); }, 350);
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    }

    // 點第一次展開左側子選單，點第二次直接前往該主頁面
    function toggleSubmenu(key, btn) {
      var panel = menu.querySelector('.shared-mm-panel[data-panel="' + key + '"]');
      var wasActive = btn.classList.contains('active');
      clearSubmenus();
      if (wasActive) {
        var href = btn.getAttribute('data-href');
        if (href) { window.location.href = href; }
        return;
      }
      btn.classList.add('active');
      if (panel) panel.classList.add('active');
    }

    toggle.addEventListener('click', function () {
      if (menu.classList.contains('hidden')) openMenu();
      else closeMenu();
    });
    closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    menu.querySelectorAll('[data-submenu]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        toggleSubmenu(btn.getAttribute('data-submenu'), btn);
      });
    });

    menu.querySelectorAll('[data-mm-nav]').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    menu.querySelectorAll('.shared-mm-panel-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) closeMenu();
    });
  }

  function renderHeader(activeNav, options) {
    var opts = options || {};
    var onIndex = !!opts.onIndex;
    var logoHref = 'index.html';
    var philosophyHref = 'about.html';
    var coursesHref = 'courses.html';
    var insightsHref = 'insights.html';

    function navClass(name) {
      var isActive = activeNav === name;
      var base = 'transition-colors relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[1px] after:bg-gallery-900 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left';
      return (isActive ? 'text-gallery-900 ' : 'text-gallery-500 hover:text-gallery-900 ') + base;
    }

    // 「關於視丘」下拉子選單（對應 about.html 的各區塊 anchor + 師資團隊）
    var aboutSubmenu = [
      { label: 'LOGO',   href: 'about.html#logo',         icon: 'fa-infinity' },
      { label: '願景與使命',   href: 'about.html#vision',       icon: 'fa-bullseye' },
      { label: '視丘是什麼',   href: 'about.html#thalamus',     icon: 'fa-brain' },
      { label: '教育哲學',     href: 'about.html#philosophy',   icon: 'fa-book-open' },
      { label: '學院特色',     href: 'about.html#features',     icon: 'fa-building-columns' },
      { label: '成績單',       href: 'about.html#achievements', icon: 'fa-award' },
      { label: '畢業校友',     href: 'about.html#alumni',       icon: 'fa-user-graduate' }
    ];

    var aboutMenuItemsHTML = aboutSubmenu.map(function (item) {
      return '<a href="' + item.href + '" ' +
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

    var facultySubmenu = [
      { label: '創辦人｜吳嘉寶', href: 'faculty.html#founder-section', icon: 'fa-crown' },
      { label: '現任師資', href: 'faculty.html#current-faculty-section', icon: 'fa-user-group' },
      { label: '曾任師資', href: 'faculty.html#previous-faculty-section', icon: 'fa-users' }
    ];

    var facultyMenuItemsHTML = facultySubmenu.map(function (item) {
      return '<a href="' + item.href + '" ' +
             'class="shared-submenu-link">' +
             '<span class="shared-submenu-link-icon"><i class="fa-solid ' + item.icon + '"></i></span>' +
             '<span class="shared-submenu-link-label">' + item.label + '</span></a>';
    }).join('');

    var facultyDropdownHTML =
      '<div class="relative group">' +
      '  <a href="faculty.html" class="' + navClass('faculty') + '">' +
      '    師資團隊' +
      '  </a>' +
      '  <div class="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">' +
            '    <div class="inline-block w-max min-w-0 bg-white/95 backdrop-blur-lg border border-gallery-200 shadow-xl rounded-xl py-3 overflow-hidden">' +
             facultyMenuItemsHTML +
      '    </div>' +
      '  </div>' +
      '</div>';

    var coursesSubmenu = [
      { label: '日間部・全職養成', href: 'fulltime-detail.html?id=ple', icon: 'fa-graduation-cap' },
      { label: '線上單元課程', href: 'courses.html#online-grid', icon: 'fa-desktop' },
      { label: '學員心得', href: 'courses.html#testimonials', icon: 'fa-comments' },
      { label: '課程 FAQ', href: 'courses.html#faq', icon: 'fa-circle-question' }
    ];

    var coursesMenuItemsHTML = coursesSubmenu.map(function (item) {
      var target = /^https?:\/\//.test(item.href) ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + item.href + '"' + target +
             ' class="shared-submenu-link">' +
             '<span class="shared-submenu-link-icon"><i class="fa-solid ' + item.icon + '"></i></span>' +
             '<span class="shared-submenu-link-label">' + item.label + '</span></a>';
    }).join('');

    var coursesDropdownHTML =
      '<div class="relative group">' +
      '  <a href="' + coursesHref + '" class="' + navClass('courses') + '">' +
      '    課程總覽' +
      '  </a>' +
      '  <div class="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">' +
            '    <div class="inline-block w-max min-w-0 bg-white/95 backdrop-blur-lg border border-gallery-200 shadow-xl rounded-xl py-3 overflow-hidden">' +
             coursesMenuItemsHTML +
      '    </div>' +
      '  </div>' +
      '</div>';

    function mmPanelLinks(items) {
      return items.map(function (item, i) {
        var target = /^https?:\/\//.test(item.href) ? ' target="_blank" rel="noopener"' : '';
        return '<a href="' + item.href + '"' + target + ' class="shared-mm-panel-link" style="animation-delay:' + (0.05 * (i + 1)) + 's;">' + item.label + '</a>';
      }).join('');
    }

    var mmPanelsHTML =
      '<div class="shared-mm-panel" data-panel="about"><div class="shared-mm-panel-eyebrow">About Us</div>' + mmPanelLinks(aboutSubmenu) + '</div>' +
      '<div class="shared-mm-panel" data-panel="courses"><div class="shared-mm-panel-eyebrow">Courses</div>' + mmPanelLinks(coursesSubmenu) + '</div>' +
      '<div class="shared-mm-panel" data-panel="faculty"><div class="shared-mm-panel-eyebrow">Faculty</div>' + mmPanelLinks(facultySubmenu) + '</div>';

    var mmMainListHTML =
      '<a href="index.html" data-mm-nav class="shared-mm-link"><span class="shared-mm-main">首頁</span><span class="shared-mm-sub">Home</span></a>' +
      '<button type="button" data-submenu="about" data-href="about.html" class="shared-mm-link focus:outline-none"><span class="shared-mm-main"><i class="fa-solid fa-chevron-right shared-mm-chevron"></i>關於視丘</span><span class="shared-mm-sub">About</span></button>' +
      '<button type="button" data-submenu="courses" data-href="courses.html" class="shared-mm-link focus:outline-none"><span class="shared-mm-main"><i class="fa-solid fa-chevron-right shared-mm-chevron"></i>課程總覽</span><span class="shared-mm-sub">Courses</span></button>' +
      '<button type="button" data-submenu="faculty" data-href="faculty.html" class="shared-mm-link focus:outline-none"><span class="shared-mm-main"><i class="fa-solid fa-chevron-right shared-mm-chevron"></i>師資團隊</span><span class="shared-mm-sub">Faculty</span></button>' +
      '<a href="gallery.html" data-mm-nav class="shared-mm-link"><span class="shared-mm-main">家族藝廊</span><span class="shared-mm-sub">Gallery</span></a>' +
      '<a href="insights.html" data-mm-nav class="shared-mm-link"><span class="shared-mm-main">尖端洞察</span><span class="shared-mm-sub">Insights</span></a>';

    return '' +
      '<header id="navbar" class="sticky w-full top-0 z-50 py-4 px-6 md:px-12 bg-white/95 backdrop-blur-lg text-gallery-900 border-b border-gallery-200 shadow-sm">' +
      '  <div class="max-w-7xl mx-auto flex justify-between items-center">' +
      '    <a href="' + logoHref + '" class="font-serif text-2xl font-bold tracking-widest flex items-center gap-3 group">' +
      '      <img src="logo.webp" alt="視丘 Logo" class="h-9 w-auto object-contain">' +
      '      <span>視丘 <span class="font-display text-sm font-light tracking-widest uppercase text-gallery-400 group-hover:text-gallery-900 transition-colors">Fotosoft</span></span>' +
      '    </a>' +
      '    <nav class="hidden lg:flex items-center gap-10 text-sm tracking-[0.2em] font-bold">' +
             aboutDropdownHTML +
              coursesDropdownHTML +
              facultyDropdownHTML +
      '      <a href="gallery.html" class="' + navClass('gallery') + '">家族藝廊</a>' +
      '      <a href="' + insightsHref + '" class="' + navClass('insights') + '">尖端洞察</a>' +
      '    </nav>' +
      '    <div class="hidden lg:block">' +
      '      <a href="#shared-cta" class="border border-gallery-800 text-gallery-900 px-6 py-2.5 text-xs tracking-[0.2em] font-bold hover:bg-gallery-900 hover:text-white transition-all duration-300 rounded-full bg-white/50 backdrop-blur-sm">' +
      '        預約免費旁聽' +
      '      </a>' +
      '    </div>' +
        '    <button id="shared-mobile-menu-toggle" class="lg:hidden text-2xl text-gallery-800" aria-label="開啟選單" aria-expanded="false">' +
      '      <i class="fa-solid fa-bars"></i>' +
      '    </button>' +
      '  </div>' +
        '  <div id="shared-mobile-menu" class="hidden lg:hidden fixed top-0 left-0 w-screen h-screen z-[70]" style="opacity:0;">' +
        '    <div id="shared-mobile-menu-backdrop" class="absolute inset-0 bg-white/95 backdrop-blur-xl"></div>' +
        '    <div class="shared-mm-dots absolute inset-0"></div>' +
        '    <i class="fa-solid fa-camera-retro shared-mm-decor"></i>' +
        '    <div class="relative z-10 h-full flex flex-col">' +
        '      <div class="flex items-center justify-between px-6 py-5">' +
        '        <a href="index.html" data-mm-nav class="flex items-center gap-2">' +
        '          <img src="logo.webp" alt="視丘 Logo" class="h-8 w-auto object-contain">' +
        '          <span class="font-serif font-bold tracking-widest text-gallery-900">視丘 <span class="font-display text-xs font-light uppercase tracking-widest text-gallery-400">Fotosoft</span></span>' +
        '        </a>' +
        '        <button id="shared-mobile-menu-close" class="w-11 h-11 rounded-full border border-gallery-300 bg-white text-gallery-700 hover:bg-gallery-900 hover:text-white hover:border-gallery-900 hover:rotate-90 transition-all duration-300 flex items-center justify-center" aria-label="關閉選單"><i class="fa-solid fa-xmark text-lg"></i></button>' +
        '      </div>' +
        '      <div class="flex-1 flex flex-row overflow-hidden">' +
        '        <div id="shared-mm-submenu-area" class="flex-1 flex flex-col justify-center items-start pl-8 md:pl-16 pr-4 overflow-y-auto">' +
                    mmPanelsHTML +
        '        </div>' +
        '        <div class="flex-none flex flex-col justify-center items-end gap-7 pr-8 md:pr-16 pb-16 min-w-[190px]">' +
                    mmMainListHTML +
        '          <a href="#shared-cta" data-mm-nav class="mt-3 inline-flex items-center justify-center border border-gallery-800 text-gallery-900 px-6 py-3 text-[11px] tracking-[0.2em] font-bold hover:bg-gallery-900 hover:text-white transition-all duration-300 rounded-full">預約免費旁聽</a>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
      '</header>';
  }

  function renderGlobalBackground() {
    return '' +
      '<div class="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-gallery-100">' +
      '  <img src="back.webp" alt="背景紋理" class="absolute inset-0 w-full h-full object-cover grayscale opacity-[0.6] mix-blend-multiply object-[center_30%]">' +
      '  <div class="absolute inset-0 bg-[url(\'https://www.transparenttextures.com/patterns/cream-paper.png\')] opacity-80 mix-blend-multiply"></div>' +
      '  <div class="absolute top-0 left-0 w-full h-[25vh] bg-gradient-to-b from-white/60 to-transparent"></div>' +
      '  <div class="absolute bottom-0 left-0 w-full h-[25vh] bg-gradient-to-t from-[#F8F9FA]/60 to-transparent"></div>' +
      '  <div class="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-white blur-[120px] animate-[slowDrift_20s_infinite_alternate]" style="animation-delay:-5s;"></div>' +
      '  <div class="absolute top-[50%] -left-[15%] w-[40vw] h-[40vw] rounded-full bg-white blur-[100px] animate-[slowDrift_25s_infinite_alternate_reverse]"></div>' +
      '</div>';
  }

  function renderCTA() {
    return '' +
      '<section class="shared-cta-wrap py-8 md:py-12 text-gallery-900 text-center px-6 relative z-10">' +
      '  <div class="shared-cta-bridge" aria-hidden="true">' +
      '    <div class="shared-cta-bridge-line"></div>' +
      '    <div class="shared-cta-bridge-noise"></div>' +
      '  </div>' +
      '  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-4xl max-h-4xl bg-white rounded-full blur-[120px] pointer-events-none -z-10 opacity-40"></div>' +
      '  <div class="max-w-3xl mx-auto p-12 md:p-24 relative z-10 group">' +
      '    <div class="absolute top-0 left-0 w-6 h-[1px] bg-gallery-400"></div>' +
      '    <div class="absolute top-0 left-0 w-[1px] h-6 bg-gallery-400"></div>' +
      '    <div class="absolute bottom-0 right-0 w-6 h-[1px] bg-gallery-400"></div>' +
      '    <div class="absolute bottom-0 right-0 w-[1px] h-6 bg-gallery-400"></div>' +
      '    <div class="shared-cta-kicker"><span class="shared-cta-kicker-dot"></span><span>Join Fotosoft</span></div>' +
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
      '        <a href="https://www.facebook.com/Fotosoft" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full border border-gallery-300 bg-white/50 flex items-center justify-center hover:bg-gallery-900 hover:text-white hover:border-gallery-900 transition-all duration-300 text-sm text-gallery-800 shadow-sm"><i class="fa-brands fa-facebook-f"></i></a>' +
      '        <a href="https://www.instagram.com/fotosoft__/" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full border border-gallery-300 bg-white/50 flex items-center justify-center hover:bg-gallery-900 hover:text-white hover:border-gallery-900 transition-all duration-300 text-sm text-gallery-800 shadow-sm"><i class="fa-brands fa-instagram"></i></a>' +
      '        <a href="https://www.youtube.com/@tofotosoft" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full border border-gallery-300 bg-white/50 flex items-center justify-center hover:bg-gallery-900 hover:text-white hover:border-gallery-900 transition-all duration-300 text-sm text-gallery-800 shadow-sm"><i class="fa-brands fa-youtube"></i></a>' +
      '      </div>' +
      '    </div>' +
      '    <div class="col-span-1 md:col-span-2 lg:col-span-2">' +
      '      <div class="shared-footer-sitemap-head">' +
      '        <h4 class="text-gallery-900 font-display font-bold tracking-[0.2em] mb-0">全站快速導覽</h4>' +
      '        <h4 class="text-gallery-900 font-display font-bold tracking-[0.2em] uppercase mb-0">Programs</h4>' +
      '      </div>' +
      '      <div class="shared-footer-sitemap-body">' +
      '        <ul class="shared-footer-sitemap-list shared-footer-sitemap-list--left">' +
      '          <li><a href="index.html" class="transition-colors">首頁</a></li>' +
      '          <li><a href="about.html" class="transition-colors">關於視丘</a></li>' +
      '          <li><a href="courses.html" class="transition-colors">課程總覽</a></li>' +
      '          <li><a href="faculty.html" class="transition-colors">師資團隊</a></li>' +
      '          <li><a href="gallery.html" class="transition-colors">家族藝廊</a></li>' +
      '          <li><a href="insights.html" class="transition-colors">尖端洞察</a></li>' +
      '        </ul>' +
      '        <div class="shared-footer-sitemap-divider" aria-hidden="true"></div>' +
      '        <ul class="shared-footer-sitemap-list">' +
      '          <li><a href="fulltime-detail.html?id=ple" class="transition-colors">日間部・全職養成</a></li>' +
      '          <li><a href="courses.html#online-grid" class="transition-colors">線上單元課程</a></li>' +
      '          <li><a href="courses.html#testimonials" class="transition-colors">學員心得</a></li>' +
      '          <li><a href="courses.html#faq" class="transition-colors">課程 FAQ</a></li>' +
      '        </ul>' +
      '      </div>' +
      '    </div>' +
      '    <div>' +
      '      <h4 class="text-gallery-900 font-display font-bold tracking-[0.2em] uppercase mb-8">Contact</h4>' +
      '      <ul class="space-y-4 tracking-wider font-sans">' +
      '        <li>111臺北市士林區天母里天母北路101巷13號2樓</li>' +
      '        <li>Tel: 0952-073-849</li>' +
      '        <li>Email: fotosoftinstitu@gmail.com</li>' +
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

  function ensureIndexClosingFx() {
    var insights = document.getElementById('insights');
    if (!insights) return;
    if (insights.querySelector('.closing-fx')) return;

    var fx = document.createElement('div');
    fx.className = 'closing-fx';
    fx.setAttribute('aria-hidden', 'true');
    fx.innerHTML = '<div class="closing-texture"></div><div class="closing-glow"></div>';

    insights.insertBefore(fx, insights.firstChild);
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
      setupMobileMenu();
    }

    var cta = document.getElementById('shared-cta');
    if (cta) cta.innerHTML = renderCTA();

    ensureIndexClosingFx();

    var footer = document.getElementById('shared-footer');
    if (footer) footer.innerHTML = renderFooter();

    if (!document.getElementById('shared-floating-actions')) {
      document.body.insertAdjacentHTML('beforeend', renderFloatingActions());
    }
    setupFloatingActions();
  }

  global.SharedLayout = { mount: mount };
})(window);

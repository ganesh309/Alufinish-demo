/* Italtecno India — demo site behaviour (no dependencies) */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------------------------------------------------------------------
     Header: shadow on scroll
     --------------------------------------------------------------------- */
  const header = $('#header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------------------------------------
     Mobile menu
     --------------------------------------------------------------------- */
  const burger = $('.hamburger');
  const menu = $('#mobile-menu');
  const backdrop = $('#mobile-backdrop');

  const setMenu = (open) => {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('open', open);
    backdrop && backdrop.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  };
  burger && burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  backdrop && backdrop.addEventListener('click', () => setMenu(false));
  menu && $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setMenu(false); closeSubs(); } });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------------------------------------------------------------------
     Desktop dropdowns (click / keyboard; hover handled in CSS)
     --------------------------------------------------------------------- */
  const subs = $$('.has-sub');
  const closeSubs = (except) => subs.forEach((li) => {
    if (li === except) return;
    li.classList.remove('open');
    const b = $('.nav-btn', li); b && b.setAttribute('aria-expanded', 'false');
  });
  subs.forEach((li) => {
    const btn = $('.nav-btn', li);
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !li.classList.contains('open');
      closeSubs(li);
      li.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.has-sub')) closeSubs(); });

  /* ---------------------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------------------- */
  const animEls = $$('.anim');
  if ('IntersectionObserver' in window && animEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    animEls.forEach((el) => io.observe(el));
  } else {
    animEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------------------------------------------------------------------
     Sub-navigation active state (anchor pages)
     --------------------------------------------------------------------- */
  const subnavLinks = $$('.subnav a[href^="#"]');
  if (subnavLinks.length && 'IntersectionObserver' in window) {
    const targets = subnavLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        subnavLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    targets.forEach((t) => spy.observe(t));
  }

  /* ---------------------------------------------------------------------
     Product-group filter (anodizing / pre-treatment pages)
     --------------------------------------------------------------------- */
  const filterBar = $('[data-filter-bar]');
  if (filterBar) {
    const pills = $$('.filter-pill', filterBar);
    const groups = $$('[data-group]');
    const grid = groups.length ? groups[0].parentElement : null;
    const apply = (key) => {
      pills.forEach((p) => p.setAttribute('aria-pressed', String(p.dataset.filter === key)));
      groups.forEach((g) => g.classList.toggle('is-hidden', key !== 'all' && g.dataset.group !== key));
      grid && grid.classList.toggle('is-filtered', key !== 'all');
    };
    pills.forEach((p) => p.addEventListener('click', () => {
      apply(p.dataset.filter);
      p.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      if (p.dataset.filter !== 'all') {
        const first = $(`[data-group="${p.dataset.filter}"]`);
        first && first.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }));
    const hash = location.hash.replace('#', '');
    if (hash && groups.some((g) => g.dataset.group === hash)) apply(hash);
  }

  /* ---------------------------------------------------------------------
     Product finder (home)
     --------------------------------------------------------------------- */
  const FINDER = {
    anodizing: {
      label: 'Anodizing',
      page: 'anodizing-chemicals.html',
      steps: [
        { id: 'degreasing', name: 'Degreasing', products: ['MG 19 PA', 'MG 19 L', 'MG 19 NB4', 'Tecnoclean SA'] },
        { id: 'acid-etching', name: 'Acid etching', products: ['BE 11 L', 'BE 12'] },
        { id: 'alkaline-etching', name: 'Alkaline etching', products: ['MG 32', 'MG 39'] },
        { id: 'desmutting', name: 'Desmutting', products: ['Neutron 187 C', 'Neutron 190'] },
        { id: 'anodizing', name: 'Anodizing', products: ['WM 80 L', 'AOX 300'] },
        { id: 'electrocolouring', name: 'Electrocolouring', products: ['Tin Sulphate', 'Salmix NF 40', 'Salmix NF P'] },
        { id: 'special-electrocolouring', name: 'Special electrocolouring', products: ['Salkorall', 'Warmall 1 & 2', 'Tecnostab'] },
        { id: 'dye-colours', name: 'Dye colours', products: ['Orfix', 'Yellow AGR', 'Rose Gold 2BR', 'Black WH'] },
        { id: 'sealing', name: 'Sealing', products: ['Hardwall 3CB1', 'Pre-Fix Seal', 'Hardwall MTS', 'MG Seal TZ', 'MG 11', 'Superseal 2S'] },
        { id: 'additives', name: 'Special additives', products: ['MG 160', 'Stab F63', 'GR 20 L', 'MG 21'] },
      ],
    },
    pretreatment: {
      label: 'Pre-treatment before powder coating',
      page: 'pretreatment-chemicals.html',
      steps: [
        { id: 'alkaline-degreasing', name: 'Alkaline degreasing', products: ['Itaclean 113', 'Itaclean 118'] },
        { id: 'acid-degreasing', name: 'Acid degreasing', products: ['Itadox 161 AB', 'Itaclean IP 4000'] },
        { id: 'two-in-one', name: '2 in 1 — degreasing + deoxidizing', products: ['Itaclean 211', 'Itadox 307 NT'] },
        { id: 'desmutting', name: 'Desmutting / acid deoxidizing', products: ['Desmut A30', 'Itadox 302'] },
        { id: 'conversion', name: 'Chrome & chrome-free conversion', products: ['Cover Gold 50R', 'Alugold SCR'] },
      ],
    },
  };

  const finder = $('#finder-widget');
  if (finder) {
    const tiles = $$('.option-tile', finder);
    const stepWrap = $('[data-step="2"]', finder);
    const pillsWrap = $('.step-pills', finder);
    const result = $('.finder-result', finder);
    const email = 'info@italtecnoindia.com';
    let process = null;
    let step = null;

    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

    const renderEmpty = (msg) => {
      result.innerHTML = `
        <div class="result-empty">
          <svg class="ico" viewBox="0 0 24 24"><path d="M10 2v7.5L4.6 19a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3L14 9.5V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>
          <p>${msg}</p>
        </div>`;
    };

    const renderResult = () => {
      const p = FINDER[process];
      const s = p.steps.find((x) => x.id === step);
      const subject = (prod) => encodeURIComponent(`Technical data sheet request: ${prod} (${s.name})`);
      result.innerHTML = `
        <span class="result-kicker">${esc(p.label)} · ${esc(s.name)}</span>
        <div class="result-title">${s.products.length} matching product${s.products.length > 1 ? 's' : ''}</div>
        <p class="result-sub">Products from the Italtecno India range for this process step. Request the technical data sheet or talk to our team.</p>
        <ul class="result-list">
          ${s.products.map((prod) => `
            <li class="result-item"><strong>${esc(prod)}</strong>
              <a href="mailto:${email}?subject=${subject(prod)}">Request TDS</a></li>`).join('')}
        </ul>
        <div class="result-actions">
          <a class="btn btn-primary btn-sm" href="${p.page}#${s.id}">View full ${esc(p.label.toLowerCase())} range
            <svg class="ico" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
          <a class="btn btn-outline btn-sm" href="contact.html">Ask our technical team</a>
        </div>`;
    };

    const renderPills = () => {
      pillsWrap.innerHTML = FINDER[process].steps.map((s) =>
        `<button type="button" class="pill" data-step-id="${s.id}" aria-pressed="false">${esc(s.name)}</button>`).join('');
      $$('.pill', pillsWrap).forEach((b) => b.addEventListener('click', () => {
        step = b.dataset.stepId;
        $$('.pill', pillsWrap).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        renderResult();
      }));
    };

    tiles.forEach((t) => t.addEventListener('click', () => {
      process = t.dataset.process;
      step = null;
      tiles.forEach((x) => x.setAttribute('aria-pressed', String(x === t)));
      stepWrap.classList.remove('is-disabled');
      renderPills();
      renderEmpty('Now pick the process step you want to improve.');
    }));

    renderEmpty('Choose a process and a step — the matching Italtecno products appear here.');
  }

  /* ---------------------------------------------------------------------
     Contact form (demo — no backend). Builds a mailto as fallback.
     --------------------------------------------------------------------- */
  const form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const body = [
        `Name: ${data.get('name')}`,
        `Company: ${data.get('company')}`,
        `Email: ${data.get('email')}`,
        `Phone: ${data.get('phone') || '-'}`,
        `Topic: ${data.get('topic')}`,
        '',
        data.get('message'),
      ].join('\n');
      const mailto = `mailto:info@italtecnoindia.com?subject=${encodeURIComponent('Website enquiry: ' + data.get('topic'))}&body=${encodeURIComponent(body)}`;
      const ok = $('#form-success');
      if (ok) {
        ok.innerHTML = `<strong>Thank you — your message is ready.</strong><br>This demo has no mail server. <a href="${mailto}" style="text-decoration:underline">Open it in your email app</a> to send it to info@italtecnoindia.com.`;
        ok.classList.add('show');
        ok.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
    });
  }

  /* ---------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */
  const y = $('#year'); if (y) y.textContent = String(new Date().getFullYear());
})();

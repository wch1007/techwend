(function () {
  'use strict';
  const root = document.documentElement;
  if (!root.classList.contains('element-motion-ready')) return;
  window.elementMotionLoaded = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 768px)');
  // Kept in sync with the pre-paint selectors in element-motion.css.
  const selector = [
    '.feedback-value__media', '.feedback-value__copy > .eyebrow',
    '.feedback-value__copy > h2', '.value-feature', '.stat-panel',
    '.explore-showcase', '.era-timeline__head', '.era-item',
    '.pr-layers__head', '.pr-layers__stage', '.pr-layers__rail', '.scn-immersive__dock',
    '.about-hero__visual', '.about-cred-card', '.about-photo-stream',
    '.jobs-section .section-title', '.jobs-section .container',
    '.footer-brand-card', '.footer-main',
    '.m-gallery-card', '.m-scene', '.m-product-intro > h1', '.m-product-intro > p',
    '.m-product-visual', '.m-product-metrics', '.m-model-tabs', '.m-spec-panel',
    '.err-code', '.err-title', '.err-sub', '.err-links'
  ].join(',');
  const records = new Map();
  const groups = new Map();
  const active = new Set();
  let frame = 0;
  let scanFrame = 0;

  function enter(record) {
    record.element.classList.add('element-entered');
    active.add(record);
    requestPaint();
  }

  function reset(record) {
    active.delete(record);
    record.element.classList.remove('element-entered');
    record.element.classList.remove('element-focus-visible');
    record.element.style.removeProperty('--element-drift');
  }

  function paint() {
    frame = 0;
    if (reduced.matches) return;
    const height = innerHeight || 1;
    const positions = new Map();
    active.forEach(record => {
      if (!positions.has(record.section)) positions.set(record.section, record.section.getBoundingClientRect());
    });
    active.forEach(record => {
      const box = positions.get(record.section);
      const progress = Math.max(-1, Math.min(1, (box.top + box.height / 2 - height / 2) / height));
      const shift = mobile.matches ? 0 : progress * 12;
      record.element.style.setProperty('--element-drift', shift.toFixed(2) + 'px');
    });
  }

  function requestPaint() {
    if (!frame && !reduced.matches) frame = requestAnimationFrame(paint);
  }

  const itemObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const record = records.get(entry.target);
      if (!record || (record.valueSection && !mobile.matches)) return;
      if (entry.isIntersecting && entry.intersectionRatio >= .08) enter(record);
      else active.delete(record);
    });
  }, { threshold: [0, .08], rootMargin: '0px' });

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const group = groups.get(entry.target);
      if (!group) return;
      // The unanimated section controls resets, so a translated child cannot
      // repeatedly cross its observer boundary and flash near a viewport edge.
      if (entry.intersectionRatio >= .55 && !mobile.matches) {
        group.filter(record => record.valueSection).forEach(enter);
      }
      else if (!entry.isIntersecting || entry.intersectionRatio === 0) group.forEach(reset);
    });
  }, { threshold: [0, .55] });

  function scan() {
    scanFrame = 0;
    document.querySelectorAll(selector).forEach(element => {
      if (records.has(element)) return;
      const valueSection = element.closest('.feedback-value');
      const section = valueSection || element.closest('.panel, .last-page-shell, .contact-shell, .snap-group, .err-page') || element;
      const record = { element, section, valueSection };
      records.set(element, record);
      element.dataset.elementMotion = '';
      if (!groups.has(section)) {
        groups.set(section, []);
        sectionObserver.observe(section);
      }
      groups.get(section).push(record);
      let delay = 0;
      if (valueSection) {
        if (element.matches('.feedback-value__media')) {
          element.style.setProperty('--element-rise', '42px');
          element.style.setProperty('--element-duration', '1100ms');
        } else if (element.matches('.eyebrow')) delay = 100;
        else if (element.matches('h2')) delay = 180;
        else delay = 260 + Array.from(element.parentElement.children).indexOf(element) * 85;
      } else {
        const siblings = Array.from(element.parentElement.children).filter(node => node.matches(selector));
        delay = Math.min(siblings.indexOf(element) * 80, 240);
      }
      element.style.setProperty('--element-delay', delay + 'ms');
      itemObserver.observe(element);
    });
  }

  scan();
  new MutationObserver(mutations => {
    if (mutations.some(mutation => mutation.addedNodes.length) && !scanFrame) scanFrame = requestAnimationFrame(scan);
  }).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('scroll', requestPaint, { passive: true });
  window.addEventListener('resize', requestPaint, { passive: true });
  mobile.addEventListener('change', () => {
    records.forEach(record => { itemObserver.unobserve(record.element); itemObserver.observe(record.element); });
    groups.forEach((_, section) => { sectionObserver.unobserve(section); sectionObserver.observe(section); });
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) records.forEach(record => record.element.style.removeProperty('--element-drift'));
    else requestPaint();
  });
  document.addEventListener('focusin', event => {
    records.forEach(record => {
      if (record.element.contains(event.target)) {
        enter(record);
        record.element.classList.add('element-focus-visible');
      }
    });
  });
})();

(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width:768px)');

  function formatEcosystemTitle() {
    const title = document.querySelector('#value-eco h2');
    if (!title || document.documentElement.dataset.lang === 'en') return;
    title.innerHTML = '基于终端技术底座，<br>让能力持续生长';
  }

  formatEcosystemTitle();
  new MutationObserver(formatEcosystemTitle).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-lang']
  });

  document.querySelectorAll('.feedback-value').forEach(section => {
    const frame = section.querySelector('.value-features');
    const items = [...section.querySelectorAll('.value-feature')];
    if (!frame || items.length < 2) return;

    let active = Math.max(0, items.findIndex(item => item.open));
    let timer = 0;
    let inView = false;
    let hovered = false;

    function activate(index) {
      active = (index + items.length) % items.length;
      items.forEach((item, itemIndex) => {
        const open = itemIndex === active;
        item.open = open;
        item.querySelector('summary')?.setAttribute('aria-expanded', String(open));
      });
    }

    function stop() {
      clearTimeout(timer);
      timer = 0;
    }

    function schedule() {
      stop();
      if (!inView || hovered || reducedMotion || mobile.matches || document.hidden) return;
      timer = setTimeout(() => {
        activate(active + 1);
        schedule();
      }, 4200);
    }

    items.forEach((item, index) => {
      const summary = item.querySelector('summary');
      item.addEventListener('pointerenter', () => {
        if (mobile.matches) return;
        hovered = true;
        stop();
        activate(index);
      });
      summary?.addEventListener('click', event => {
        event.preventDefault();
        if (mobile.matches && item.open) {
          item.open=false; summary.setAttribute('aria-expanded','false'); stop(); return;
        }
        activate(index);
        schedule();
      });
      summary?.addEventListener('focus', () => { if(!mobile.matches) activate(index); });
    });

    frame.addEventListener('pointerleave', () => {
      hovered = false;
      schedule();
    });

    new IntersectionObserver(entries => {
      inView = Boolean(entries[0]?.isIntersecting && entries[0].intersectionRatio >= .45);
      schedule();
    }, { threshold: [.45] }).observe(section);

    document.addEventListener('visibilitychange', schedule);
    mobile.addEventListener('change', schedule);
    activate(active);
  });
})();

(function () {
  'use strict';

  /* The partnership page already ships this same one-panel-per-wheel motion. */
  if (document.documentElement.classList.contains('partnership-final')) return;

  const desktopSnap = window.matchMedia('(min-width: 769px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let snapLocked = false;
  let internalScrollAt = 0;

  function isVisible(element) {
    if (!(element instanceof HTMLElement)) return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && element.getBoundingClientRect().height > 2;
  }

  function getSnapTargets() {
    const selectors = [
      'body > .panel',
      'body > .career_hero',
      'body > .snap-group',
      'body > .last-page-shell',
      'body > .contact-shell',
      'body > .err-page',
      'main > .panel',
      'main > .pf-panel',
      'main > .snap-group',
      'main + .snap-group'
    ];
    const seen = new Set();
    const targets = [];

    document.querySelectorAll(selectors.join(',')).forEach(function (element) {
      if (seen.has(element) || !isVisible(element)) return;
      seen.add(element);
      targets.push(element);
    });

    return targets.sort(function (a, b) {
      return a.offsetTop - b.offsetTop;
    });
  }

  function hasOpenOverlay(target) {
    if (!(target instanceof Element)) return false;
    const overlay = target.closest('[role="dialog"], dialog, .modal-overlay, #jdModal');
    if (!overlay) return false;
    return window.getComputedStyle(overlay).display !== 'none';
  }

  function canScrollInDirection(target, deltaY) {
    let node = target instanceof Element ? target : null;
    while (node && node !== document.body && node !== document.documentElement) {
      const style = window.getComputedStyle(node);
      const scrollable = /(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 2;
      if (scrollable) {
        const maxScroll = node.scrollHeight - node.clientHeight;
        if ((deltaY > 0 && node.scrollTop < maxScroll - 2) || (deltaY < 0 && node.scrollTop > 2)) {
          return true;
        }
      }
      node = node.parentElement;
    }
    return false;
  }

  function closestTarget(targets) {
    return targets.reduce(function (best, target, index) {
      const distance = Math.abs(target.offsetTop - window.scrollY);
      return distance < best.distance ? { index: index, target: target, distance: distance } : best;
    }, { index: 0, target: targets[0], distance: Infinity });
  }

  window.addEventListener('wheel', function (event) {
    const scale = event.deltaMode === 1 ? 16 : (event.deltaMode === 2 ? window.innerHeight : 1);
    const deltaY = event.deltaY * scale;
    const deltaX = event.deltaX * scale;
    const formControl = event.target instanceof Element && event.target.closest('input, textarea, select, option');

    if (!desktopSnap.matches || event.ctrlKey || Math.abs(deltaY) < 8 || Math.abs(deltaX) > Math.abs(deltaY)) return;
    if (formControl || hasOpenOverlay(event.target)) return;
    if (canScrollInDirection(event.target, deltaY)) {
      internalScrollAt = Date.now();
      return;
    }

    const targets = getSnapTargets();
    if (targets.length < 2) return;

    event.preventDefault();
    if (snapLocked) return;

    const current = closestTarget(targets);
    const direction = deltaY > 0 ? 1 : -1;
    const nextIndex = Math.max(0, Math.min(targets.length - 1, current.index + direction));
    if (nextIndex === current.index && current.distance < 2) return;

    snapLocked = true;
    targets[nextIndex].scrollIntoView({
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
      block: 'start'
    });
    window.setTimeout(function () {
      snapLocked = false;
    }, reduceMotion.matches ? 120 : 920);
  }, { passive: false });

  window.addEventListener('scrollend', function () {
    if (!desktopSnap.matches || snapLocked || Date.now() - internalScrollAt < 180) return;
    const targets = getSnapTargets();
    if (targets.length < 2) return;
    const closest = closestTarget(targets);
    if (closest.distance > 2) {
      closest.target.scrollIntoView({
        behavior: reduceMotion.matches ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  });
})();

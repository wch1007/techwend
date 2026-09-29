(function () {
  'use strict';

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const desktopSnap = window.matchMedia('(min-width: 769px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sceneCards = Array.from(document.querySelectorAll('[data-pf-scene]'));

  function closeScene(card) {
    card.classList.remove('is-expanded');
    card.setAttribute('aria-expanded', 'false');
  }

  function openScene(card) {
    sceneCards.forEach(function (other) {
      if (other !== card) closeScene(other);
    });
    card.classList.add('is-expanded');
    card.setAttribute('aria-expanded', 'true');
  }

  sceneCards.forEach(function (card) {
    card.setAttribute('aria-expanded', 'false');

    card.addEventListener('pointerenter', function () {
      if (!finePointer.matches) return;
      openScene(card);
    });

    card.addEventListener('pointerleave', function () {
      if (!finePointer.matches) return;
      closeScene(card);
    });

    card.addEventListener('focusin', function () { openScene(card); });
    card.addEventListener('focusout', function () { closeScene(card); });
    card.addEventListener('click', function () {
      if (finePointer.matches) return;
      if (card.classList.contains('is-expanded')) closeScene(card);
      else openScene(card);
    });
  });

  function bindTilt(card, mode) {
    card.addEventListener('pointermove', function (event) {
      if (!finePointer.matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rx = ((.5 - y) * (mode ? 7 : 4)).toFixed(2) + 'deg';
      const ry = ((x - .5) * (mode ? 8 : 5)).toFixed(2) + 'deg';
      card.style.setProperty(mode ? '--mode-rx' : '--tilt-x', rx);
      card.style.setProperty(mode ? '--mode-ry' : '--tilt-y', ry);
      card.style.setProperty('--glow-x', (x * 100).toFixed(1) + '%');
      card.style.setProperty('--glow-y', (y * 100).toFixed(1) + '%');
    });

    card.addEventListener('pointerleave', function () {
      card.style.removeProperty(mode ? '--mode-rx' : '--tilt-x');
      card.style.removeProperty(mode ? '--mode-ry' : '--tilt-y');
      card.style.removeProperty('--glow-x');
      card.style.removeProperty('--glow-y');
    });
  }

  document.querySelectorAll('[data-pf-value-card]').forEach(function (card) { bindTilt(card, false); });
  document.querySelectorAll('[data-pf-mode-card]').forEach(function (card) { bindTilt(card, true); });

  let snapLocked = false;

  function getSnapTargets() {
    return Array.from(document.querySelectorAll('main > .pf-panel, #partnership-shared-tail > .snap-group'));
  }

  function hasScrollableParent(target) {
    let node = target instanceof Element ? target : null;
    while (node && node !== document.body) {
      const style = window.getComputedStyle(node);
      if (/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 2) return true;
      node = node.parentElement;
    }
    return false;
  }

  window.addEventListener('wheel', function (event) {
    if (!desktopSnap.matches || event.ctrlKey || Math.abs(event.deltaY) < 8) return;
    if ((event.target instanceof Element && event.target.closest('input, textarea, select, option')) || hasScrollableParent(event.target)) return;

    event.preventDefault();
    if (snapLocked) return;

    const targets = getSnapTargets();
    if (!targets.length) return;
    const current = targets.reduce(function (best, target, index) {
      const distance = Math.abs(target.offsetTop - window.scrollY);
      return distance < best.distance ? { index: index, distance: distance } : best;
    }, { index: 0, distance: Infinity }).index;
    const direction = event.deltaY > 0 ? 1 : -1;
    const next = Math.max(0, Math.min(targets.length - 1, current + direction));
    if (next === current && Math.abs(targets[current].offsetTop - window.scrollY) < 2) return;

    snapLocked = true;
    targets[next].scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(function () { snapLocked = false; }, reduceMotion.matches ? 120 : 920);
  }, { passive: false });

  window.addEventListener('scrollend', function () {
    if (!desktopSnap.matches || snapLocked) return;
    const targets = getSnapTargets();
    if (!targets.length) return;
    const closest = targets.reduce(function (best, target) {
      const distance = Math.abs(target.offsetTop - window.scrollY);
      return distance < best.distance ? { target: target, distance: distance } : best;
    }, { target: targets[0], distance: Infinity });
    if (closest.distance > 2) closest.target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
  });
})();

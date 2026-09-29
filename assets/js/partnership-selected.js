(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function activateGroup(items, current, className = 'is-active') {
    items.forEach(item => item.classList.toggle(className, item === current));
  }

  const valueItems = $$('[data-value-item]');
  valueItems.forEach(item => {
    const activate = () => activateGroup(valueItems, item);
    item.addEventListener('mouseenter', activate);
    item.addEventListener('focus', activate);
    item.addEventListener('click', activate);
  });

  const sceneTriggers = $$('[data-scene-trigger]');
  const sceneShots = $$('[data-scene-shot]');
  const sceneCurrent = $('[data-scene-current]');
  const sceneTitle = $('[data-scene-detail-title]');
  const sceneTech = $('[data-scene-detail-tech]');
  const sceneDesc = $('[data-scene-detail-desc]');
  const scenePartner = $('[data-scene-detail-partner]');
  let activeScene = 0;

  function currentLanguage() {
    return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'zh';
  }

  function updateScene(index) {
    const trigger = sceneTriggers[index];
    if (!trigger) return;
    activeScene = index;
    const lang = currentLanguage();
    sceneTriggers.forEach((item, itemIndex) => {
      const active = itemIndex === index;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    sceneShots.forEach((shot, itemIndex) => shot.classList.toggle('is-active', itemIndex === index));
    if (sceneCurrent) sceneCurrent.textContent = String(index + 1).padStart(2, '0');
    if (sceneTitle) sceneTitle.textContent = trigger.dataset[`title${lang === 'zh' ? 'Zh' : 'En'}`] || '';
    if (sceneTech) sceneTech.textContent = trigger.dataset[`tech${lang === 'zh' ? 'Zh' : 'En'}`] || '';
    if (sceneDesc) sceneDesc.textContent = trigger.dataset[`desc${lang === 'zh' ? 'Zh' : 'En'}`] || '';
    if (scenePartner) scenePartner.textContent = trigger.dataset[`partner${lang === 'zh' ? 'Zh' : 'En'}`] || '';
  }

  sceneTriggers.forEach((trigger, index) => {
    trigger.addEventListener('mouseenter', () => updateScene(index));
    trigger.addEventListener('focus', () => updateScene(index));
    trigger.addEventListener('click', () => updateScene(index));
  });

  const langButton = $('#lang-btn');
  langButton?.addEventListener('click', () => requestAnimationFrame(() => updateScene(activeScene)));

  const modeSteps = $$('[data-mode-step]');
  const modeProgress = $('.mode-line i');
  modeSteps.forEach((step, index) => {
    const activate = () => {
      activateGroup(modeSteps, step);
      if (modeProgress) modeProgress.style.transform = `scaleX(${(index + 1) / modeSteps.length})`;
    };
    step.addEventListener('mouseenter', activate);
    step.addEventListener('focus', activate);
    step.addEventListener('click', activate);
  });

  const tiltRoot = $('[data-tilt-root]');
  const tiltFigure = $('[data-tilt-figure]');
  if (tiltRoot && tiltFigure && !reducedMotion) {
    tiltRoot.addEventListener('pointermove', event => {
      const box = tiltRoot.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width - .5) * 14;
      const y = ((event.clientY - box.top) / box.height - .5) * 10;
      tiltFigure.style.setProperty('--tilt-x', `${x.toFixed(2)}px`);
      tiltFigure.style.setProperty('--tilt-y', `${y.toFixed(2)}px`);
    }, { passive: true });
    tiltRoot.addEventListener('pointerleave', () => {
      tiltFigure.style.setProperty('--tilt-x', '0px');
      tiltFigure.style.setProperty('--tilt-y', '0px');
    });
  }

  $$('.faq-list details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      $$('.faq-list details').forEach(other => {
        if (other !== detail) other.open = false;
      });
    });
  });

  const form = $('#partnership-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const lang = currentLanguage();
    const company = $('#co-name')?.value.trim() || '';
    const contact = $('#co-contact')?.value.trim() || '';
    const type = $('#co-type')?.value || '';
    const scene = $('#co-scene')?.value || '';
    const description = $('#co-desc')?.value.trim() || '';
    const subject = lang === 'zh' ? `商务合作意向｜${company}` : `Partnership inquiry | ${company}`;
    const body = lang === 'zh'
      ? `公司 / 机构：${company}\n联系方式：${contact}\n合作类型：${type}\n应用场景：${scene}\n\n需求描述：\n${description}`
      : `Company / Organization: ${company}\nContact: ${contact}\nPartnership type: ${type}\nScenario: ${scene}\n\nRequirements:\n${description}`;
    window.location.href = `mailto:sunxy@techvoyage.site?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();

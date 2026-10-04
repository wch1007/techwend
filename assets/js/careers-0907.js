(function () {
  'use strict';
  const data = window.TECHWEND_JOBS;
  const grid = document.getElementById('jobGrid');
  if (!data || !grid) return;
  const filters = document.getElementById('jobFilters');
  const modal = document.getElementById('jdModal');
  const close = modal.querySelector('.close-btn');
  const content = modal.querySelector('.modal-content');
  const language = () => document.documentElement.dataset.lang === 'en' ? 'en' : 'zh';
  let category = 'all', activeJob = null, opener = null, previousOverflow = '';
  function text(tag, value, cls) {
    const el = document.createElement(tag);
    el.textContent = value;
    if (cls) el.className = cls;
    return el;
  }
  function render() {
    const en = language() === 'en';
    filters.replaceChildren();
    [{id:'all',zh:'全部岗位',en:'All roles'}, ...data.categories].forEach(cat => {
      const button = text('button', cat[language()], 'job-filter');
      button.type = 'button'; button.dataset.category = cat.id;
      button.setAttribute('aria-pressed', String(category === cat.id));
      button.addEventListener('click', () => {
        category = cat.id; render();
        filters.querySelector(`[data-category="${cat.id}"]`).focus({preventScroll:true});
      });
      filters.append(button);
    });
    grid.replaceChildren();
    grid.scrollTop = 0;
    const shown = data.jobs.filter(job => category === 'all' || job.category === category);
    document.getElementById('jobCount').textContent = en ? `${shown.length} open positions` : `共 ${shown.length} 个在招岗位`;
    shown.forEach(job => {
      const cat = data.categories.find(c => c.id === job.category);
      const card = text('button', '', 'job-card');
      card.type = 'button'; card.dataset.jobId = job.id;
      card.setAttribute('aria-haspopup', 'dialog');
      card.append(text('span', cat[language()], 'job-category'), text('span', en ? job.titleEn : job.title, 'job-title'), text('span', en ? 'View role and apply →' : '查看岗位与投递 →', 'job-card__action'));
      card.addEventListener('click', () => openModal(job, card));
      grid.append(card);
    });
  }
  function renderModal() {
    if (!activeJob) return;
    const job = activeJob, en = language() === 'en';
    document.getElementById('modalTitle').textContent = en ? job.titleEn : job.title;
    document.getElementById('modalMeta').textContent = data.categories.find(c => c.id === job.category)[language()];
    // Dynamic fields are rendered here so the global language switch cannot overwrite them.
    ['modalTitle','modalMeta','modalJD'].forEach(id => {
      document.getElementById(id).removeAttribute('data-zh');
      document.getElementById(id).removeAttribute('data-en');
    });
    const jd = document.getElementById('modalJD'); jd.replaceChildren();
    const copy = en && job.english ? job.english : job;
    if (en && !job.english) jd.append(text('p', 'Full role description (Chinese)', 'job-language-note'));
    if (copy.intro) jd.append(text('p', copy.intro, 'job-intro'));
    copy.sections.forEach(section => {
      const block = document.createElement('section'); block.className = 'job-jd-section';
      block.append(text('h3', section.title));
      const list = document.createElement('ul');
      section.items.forEach(item => list.append(text('li', item)));
      block.append(list); jd.append(block);
    });
    const title = en ? job.titleEn : job.title;
    const subject = encodeURIComponent(en ? `[Application] ${title} - Candidate name` : `【应聘】${title} - 候选人姓名`);
    const body = encodeURIComponent(en ? `Hello,\n\nI would like to apply for the ${title} role.\n\nName:\nContact details:\nPortfolio (if applicable):\n\nPlease attach your resume before sending.` : `您好，\n\n我希望申请【${title}】职位。\n\n姓名：\n联系方式：\n作品集（如适用）：\n\n请在发送前附上简历。`);
    document.getElementById('modalApplyBtn').href = `mailto:sunxy@techvoyage.site?subject=${subject}&body=${body}`;
    close.setAttribute('aria-label', en ? 'Close role details' : '关闭职位详情');
  }
  function openModal(job, trigger) {
    activeJob = job; opener = trigger;
    previousOverflow = document.body.style.overflow;
    renderModal(); modal.style.display = 'flex'; document.body.style.overflow = 'hidden';
    content.scrollTop = 0; close.focus({preventScroll:true});
  }
  function closeModal() {
    const jobId = activeJob?.id;
    modal.style.display = 'none'; document.body.style.overflow = previousOverflow;
    activeJob = null;
    const target = opener?.isConnected ? opener : grid.querySelector(`[data-job-id="${jobId}"]`);
    target?.focus({preventScroll:true});
  }
  close.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (!activeJob) return;
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
    if (e.key === 'Tab') {
      const targets = [...modal.querySelectorAll('button,a[href],input,select,textarea,[tabindex="0"]')].filter(el => el.getClientRects().length);
      const first = targets[0], last = targets.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  new MutationObserver(() => { render(); renderModal(); }).observe(document.documentElement,{attributes:true,attributeFilter:['data-lang']});
  window.closeModal = closeModal;
  render();
})();

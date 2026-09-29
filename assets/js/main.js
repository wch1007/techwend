(function(){
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
  const navEl = $('#nav');
  const navLinks = $('#nav-links');
  const burger = $('#burger');
  const langBtn = $('#lang-btn');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setNavState(){ if(navEl) navEl.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', setNavState, {passive:true}); setNavState();

  function closeMenu(){ navLinks?.classList.remove('open'); burger?.classList.remove('is-open'); burger?.setAttribute('aria-expanded','false'); }
  function toggleMenu(){ const open = !navLinks?.classList.contains('open'); navLinks?.classList.toggle('open', open); burger?.classList.toggle('is-open', open); burger?.setAttribute('aria-expanded', String(open)); }
  burger?.addEventListener('click', (e)=>{ e.stopPropagation(); toggleMenu(); });
  $$('.nav__links a').forEach(a=>a.addEventListener('click', closeMenu));
  document.addEventListener('click', e=>{ if(navEl && !navEl.contains(e.target)) closeMenu(); });

  const revObs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('visible'); revObs.unobserve(entry.target); }
    });
  }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
  $$('[data-reveal]').forEach(el=>revObs.observe(el));

  const showcases = $$('.showcase');
  let ticking = false;
  function updateShowcaseMotion(){
    ticking = false;
    if(reduceMotion) return;
    const vh = window.innerHeight || 1;
    showcases.forEach(sc=>{
      const img = $('.sc-img', sc);
      if(!img) return;
      const r = sc.getBoundingClientRect();
      if(r.bottom < 0 || r.top > vh) return;
      const progress = (r.top + r.height/2 - vh/2) / vh;
      const y = Math.max(-28, Math.min(28, progress * -42));
      const x = sc.classList.contains('sc-left') ? Math.max(-12, Math.min(12, progress * 12)) : Math.max(-12, Math.min(12, progress * -12));
      img.style.setProperty('--py', y.toFixed(2) + 'px');
      img.style.setProperty('--px', x.toFixed(2) + 'px');
    });
  }
  function requestMotion(){ if(!ticking){ ticking = true; requestAnimationFrame(updateShowcaseMotion); } }
  window.addEventListener('scroll', requestMotion, {passive:true});
  window.addEventListener('resize', requestMotion, {passive:true});
  requestMotion();

  showcases.forEach(sc=>{
    sc.addEventListener('pointermove', e=>{
      if(reduceMotion) return;
      const r = sc.getBoundingClientRect();
      const mx = ((e.clientX-r.left)/r.width*100).toFixed(1)+'%';
      const my = ((e.clientY-r.top)/r.height*100).toFixed(1)+'%';
      sc.style.setProperty('--mx', mx); sc.style.setProperty('--my', my);
    }, {passive:true});
  });

  const statPanels = $$('.stat-panel');
  const statDots = $$('.stat-dot');
  let statIdx = 0, statTimer = null;
  function goStat(idx){
    statIdx = idx;
    statPanels.forEach((p,i)=>p.classList.toggle('active', i===idx));
    statDots.forEach((d,i)=>d.classList.toggle('active', i===idx));
  }
  function startStatTimer(){ clearInterval(statTimer); statTimer = setInterval(()=>goStat((statIdx+1)%statPanels.length), 4000); }
  statPanels.forEach((p,i)=>{ p.addEventListener('mouseenter',()=>{clearInterval(statTimer);goStat(i)}); p.addEventListener('mouseleave',startStatTimer); p.addEventListener('click',()=>goStat(i)); });
  statDots.forEach((d, i)=>d.addEventListener('click',()=>{
    const parsed = parseInt(d.dataset.stat, 10);
    goStat(Number.isFinite(parsed) ? parsed : i);
  }));
  const stats = $('#stats');
  if(stats){ new IntersectionObserver(entries=>{ entries[0].isIntersecting ? startStatTimer() : clearInterval(statTimer); }, {threshold:.3}).observe(stats); }

  function runCounters(){
    $$('.stat-panel__num[data-target]').forEach(el=>{
      const target = parseInt(el.dataset.target,10) || 0;
      const sfx = el.dataset.suffix || '';
      let t0 = null;
      const tick = ts=>{
        if(!t0) t0 = ts;
        const p = Math.min((ts-t0)/1400, 1);
        const eased = 1 - Math.pow(1-p, 3);
        el.textContent = Math.round(eased*target) + sfx;
        if(p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }
  let countRan = false;
  if(stats){ new IntersectionObserver(entries=>{ if(entries[0].isIntersecting && !countRan){ countRan = true; runCounters(); } }, {threshold:.2}).observe(stats); }

  /* Explore more compact slide carousel: scroll + hover expand */
  function initG22Carousel(){
    document.querySelectorAll('[data-carousel]').forEach(carousel => {
      const track = carousel.querySelector('.g22');
      const cards = Array.from(carousel.querySelectorAll('.g22-card'));
      const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
      if(!track || !cards.length) return;

      let active = 0;
      let scrollRaf = 0;
      let scrollEndTimer = null;
      const canHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

      const maxIndex = () => Math.max(0, cards.length - 1);
      const clamp = idx => Math.max(0, Math.min(idx, maxIndex()));
      const getStep = () => cards[0]?.getBoundingClientRect().width || track.clientWidth || 1;

      const setExpanded = (card, expanded) => {
        card.classList.toggle('is-expanded', expanded);
        card.setAttribute('aria-expanded', String(expanded));
      };

      const closeExpanded = except => {
        cards.forEach(card => {
          if(card !== except) setExpanded(card, false);
        });
      };

      const update = idx => {
        active = clamp(idx);
        cards.forEach((card, i) => {
          const isActive = i === active;
          card.classList.toggle('is-active', isActive);
          card.setAttribute('aria-hidden', String(!isActive));
          if(!isActive) setExpanded(card, false);
        });
        dots.forEach((dot, i) => {
          const isActive = i === active;
          dot.classList.toggle('active', isActive);
          dot.setAttribute('aria-selected', String(isActive));
        });
        if (prevBtn) prevBtn.disabled = active === 0;
        if (nextBtn) nextBtn.disabled = active === maxIndex();
      };

      const go = idx => {
        closeExpanded();
        update(idx);
        track.scrollTo({ left: getStep() * active, behavior: reduceMotion ? 'auto' : 'smooth' });
      };

      dots.forEach((dot, i) => dot.addEventListener('click', () => {
        const parsed = parseInt(dot.dataset.carouselDot, 10);
        go(Number.isFinite(parsed) ? parsed : i);
      }));

      const prevBtn = carousel.querySelector('.g22-carousel__btn--prev');
      const nextBtn = carousel.querySelector('.g22-carousel__btn--next');

      const pressBtn = btn => {
        if (!btn) return;
        btn.classList.add('is-pressed');
        setTimeout(() => btn.classList.remove('is-pressed'), 320);
      };

      if (prevBtn) prevBtn.addEventListener('click', () => { pressBtn(prevBtn); go(active - 1); });
      if (nextBtn) nextBtn.addEventListener('click', () => { pressBtn(nextBtn); go(active + 1); });

      cards.forEach((card, i) => {
        card.addEventListener('pointerenter', () => {
          if(!canHover) return;
          if(i !== active) return;
          closeExpanded(card);
          setExpanded(card, true);
        });
        card.addEventListener('pointerleave', () => {
          if(!canHover) return;
          setExpanded(card, false);
        });
        card.addEventListener('focusin', () => {
          if(i !== active) go(i);
          closeExpanded(card);
          setExpanded(card, true);
        });
        card.addEventListener('focusout', e => {
          if(!card.contains(e.relatedTarget)) setExpanded(card, false);
        });
        card.addEventListener('click', () => {
          if(i !== active){ go(i); return; }
          if(canHover) return;
          const willExpand = !card.classList.contains('is-expanded');
          closeExpanded(card);
          setExpanded(card, willExpand);
        });
      });

      track.addEventListener('keydown', e => {
        if(e.key === 'ArrowLeft'){
          e.preventDefault();
          go(active - 1);
        }
        if(e.key === 'ArrowRight'){
          e.preventDefault();
          go(active + 1);
        }
        if(e.key === 'Escape'){
          closeExpanded();
        }
      });

      // 用户开始滑动时自动收起已展开内容，避免高度跳动
      ['pointerdown', 'touchstart', 'wheel'].forEach(type => {
        track.addEventListener(type, () => closeExpanded(), {passive:true});
      });

      track.addEventListener('scroll', () => {
        if(scrollRaf) cancelAnimationFrame(scrollRaf);
        scrollRaf = requestAnimationFrame(() => update(Math.round(track.scrollLeft / getStep())));
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => update(Math.round(track.scrollLeft / getStep())), 90);
      }, { passive:true });

      window.addEventListener('resize', () => go(active), { passive:true });
      update(0);
    });
  }
  initG22Carousel();

  /* Explore 3D carousel (#grid) */
  function initExploreCarousel() {
    const root = document.querySelector('[data-explore-carousel]');
    if (!root) return;

    const cards = Array.from(root.querySelectorAll('.explore-card'));
    const prev = root.querySelector('.explore-showcase__btn--prev');
    const next = root.querySelector('.explore-showcase__btn--next');
    const dots = Array.from(root.querySelectorAll('[data-explore-dot]'));
    const stage = root.querySelector('.explore-showcase__stage');
    let active = 0;

    /* Center card always uses full size; side cards stay recessed */
    const layoutMap = {
      0:  { x: 0,    s: 1,    ry: 0,   rz: 0,    o: 1,    z: 10 },
      1:  { x: 520,  s: .7,   ry: -22, rz: 3,    o: .52,  z: 6 },
      2:  { x: 860,  s: .54,  ry: -32, rz: 5,    o: .24,  z: 2 },
      '-1': { x: -520, s: .7,  ry: 22,  rz: -3,   o: .52,  z: 6 },
      '-2': { x: -860, s: .54, ry: 32,  rz: -5,   o: .24,  z: 2 }
    };

    function normalizeOffset(index, activeIndex, length) {
      let offset = index - activeIndex;
      if (offset > length / 2) offset -= length;
      if (offset < -length / 2) offset += length;
      return offset;
    }

    function render() {
      cards.forEach((card, index) => {
        const rawOffset = normalizeOffset(index, active, cards.length);
        const offset = Math.max(-2, Math.min(2, rawOffset));
        const cfg = layoutMap[offset] || layoutMap[2];

        card.classList.toggle('is-active', index === active);
        card.setAttribute('aria-current', index === active ? 'true' : 'false');

        card.style.setProperty('--x', `${cfg.x}px`);
        card.style.setProperty('--s', cfg.s);
        card.style.setProperty('--ry', `${cfg.ry}deg`);
        card.style.setProperty('--rz', `${cfg.rz}deg`);
        card.style.setProperty('--o', cfg.o);
        card.style.setProperty('--z', cfg.z);
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === active);
        dot.setAttribute('aria-label', `查看第 ${index + 1} 张`);
      });
    }

    function go(delta) {
      active = (active + delta + cards.length) % cards.length;
      render();
    }

    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        active = index;
        render();
      });
    });

    cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        if (index === active) return;
        active = index;
        render();
      });
    });

    stage?.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });

    render();
  }
  initExploreCarousel();

  /* Prototype photos + gen4 video (products #prototypes) */
  function initProtoMedia() {
    document.querySelectorAll('[data-proto-video]').forEach(wrap => {
      const video = wrap.querySelector('video');
      if (!video) return;

      const play = () => {
        video.play().catch(() => {});
      };
      const pause = () => {
        video.pause();
        try { video.currentTime = 0; } catch (e) {}
      };

      wrap.addEventListener('mouseenter', play);
      wrap.addEventListener('mouseleave', pause);
      wrap.addEventListener('focusin', play);
      wrap.addEventListener('focusout', pause);

      wrap.addEventListener('touchstart', () => {
        if (video.paused) play();
        else pause();
      }, { passive: true });
    });
  }
  initProtoMedia();

  let lang = 'zh';
  function toggleLang(){
    lang = lang === 'zh' ? 'en' : 'zh';
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    if(langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    document.title = lang === 'zh' ? '汤问致新 Techvoyage' : 'Techvoyage';
    $$('[data-zh]').forEach(el=>{ const v = el.getAttribute('data-'+lang); if(v !== null) el.innerHTML = v; });
    $$('[data-ph-zh]').forEach(el=>{ el.placeholder = el.getAttribute('data-ph-'+lang) || ''; });
  }
  langBtn?.addEventListener('click', toggleLang);

  $('.subscribe')?.addEventListener('submit', e=>e.preventDefault());

  window.addEventListener('message', e=>{
    if(e.data?.type === '__activate_edit_mode') $('#tweaks-panel')?.classList.add('open');
    if(e.data?.type === '__deactivate_edit_mode') $('#tweaks-panel')?.classList.remove('open');
  });
  try{ window.parent.postMessage({type:'__edit_mode_available'}, '*'); }catch(e){}

  function setAccentFromSwatch(btn){
    $$('.tw-swatch').forEach(s=>s.classList.remove('active'));
    btn.classList.add('active');
    const c = btn.dataset.color;
    document.documentElement.style.setProperty('--red', c);
    document.documentElement.style.setProperty('--red-dim', c+'22');
    try{ window.parent.postMessage({type:'__edit_mode_set_keys', edits:{accentColor:c}}, '*'); }catch(e){}
  }
  $$('.tw-swatch').forEach(btn=>{
    btn.addEventListener('click', ()=>setAccentFromSwatch(btn));
    btn.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        setAccentFromSwatch(btn);
      }
    });
  });
  $('#bg-select')?.addEventListener('change', e=>{
    const v = e.target.value;
    const l = v === '#F5F5F5';
    document.documentElement.style.setProperty('--bg', v);
    document.documentElement.style.setProperty('--bg2', l ? '#EBEBEB' : '#111111');
    document.documentElement.style.setProperty('--bg3', l ? '#E0E0E0' : '#161616');
    document.documentElement.style.setProperty('--white', l ? '#1a1a1a' : '#F2F0EC');
    document.documentElement.style.setProperty('--gray2', l ? 'rgba(0,0,0,.55)' : 'rgba(242,240,236,.72)');
    document.documentElement.style.setProperty('--gray3', l ? 'rgba(0,0,0,.32)' : 'rgba(242,240,236,.18)');
    document.documentElement.style.setProperty('--bd', l ? 'rgba(0,0,0,.1)' : 'rgba(255,255,255,.09)');
  });
  $('#radius-range')?.addEventListener('input', e=>{
    $$('.c3-card,.g22-card').forEach(el=>el.style.borderRadius = e.target.value + 'px');
  });

  /* Terminal compare: the curve draws first, then each era climbs into place. */
  (function initEraTimeline(){
    const root = document.querySelector('[data-era-timeline]');
    if (!root) return;
    const concepts = {
      flux: { zh: '能量跃迁', en: 'ENERGY SHIFT' },
      slices: { zh: '时间切片', en: 'TIME SLICES' },
      portal: { zh: '时空虫洞', en: 'EVOLUTION PORTALS' },
      'portal-dark': { zh: '时空虫洞 · 黑色原版', en: 'EVOLUTION PORTALS · DARK' }
    };
    const requestedConcept = new URLSearchParams(window.location.search).get('terminal');
    const concept = concepts[requestedConcept] ? requestedConcept : 'portal';
    root.dataset.concept = concept;
    const conceptName = root.querySelector('[data-concept-name]');
    if (conceptName) {
      conceptName.textContent = concepts[concept][document.documentElement.dataset.lang === 'en' ? 'en' : 'zh'];
      conceptName.dataset.zh = concepts[concept].zh;
      conceptName.dataset.en = concepts[concept].en;
    }
    const items = Array.from(root.querySelectorAll('.era-item'));
    if (!items.length) return;
    let timers = [];
    const FLOW_LEAD = 180;
    const STEP = 620;
    const stateClasses = items.map((_, i) => `has-era-${i}`);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function clearTimers(){
      timers.forEach(id => clearTimeout(id));
      timers = [];
    }

    function play(){
      clearTimers();
      root.classList.remove('is-playing', ...stateClasses);
      items.forEach(item => item.classList.remove('is-in', 'is-past'));
      void root.offsetWidth;
      root.classList.add('is-playing');

      if (reduceMotion) {
        items.forEach(item => item.classList.add('is-in'));
        root.classList.add(...stateClasses);
        return;
      }

      items.forEach((item, i) => {
        timers.push(setTimeout(() => {
          item.classList.add('is-in');
          root.classList.add(stateClasses[i]);
          // Prior eras recede — evolution settles toward the robot
          if (i > 0) {
            for (let j = 0; j < i; j++) items[j].classList.add('is-past');
          }
        }, FLOW_LEAD + i * STEP));
      });
    }

    function reset(){
      clearTimers();
      root.classList.remove('is-playing', ...stateClasses);
      items.forEach(item => item.classList.remove('is-in', 'is-past'));
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) play();
        else reset();
      });
    }, { threshold: 0.28 });
    io.observe(root);
  })();

  /* Hero: play once and hold on the final frame */
  (function initHeroVideo(){
    const hero = $('#hero');
    const video = hero && $('.hero__video', hero);
    if (!hero || !video) return;
    let copyVisible = false;

    function revealCopy(){
      if (copyVisible) return;
      copyVisible = true;
      hero.classList.add('is-copy-visible');
    }

    function playVideo(){
      if (video.ended) return;
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }

    video.loop = false;
    video.removeAttribute('loop');
    video.addEventListener('ended', () => {
      video.pause();
      hero.classList.add('is-complete');
      revealCopy();
    });

    video.addEventListener('timeupdate', () => {
      if (video.currentTime >= 12) revealCopy();
    });

    video.addEventListener('play', () => hero.classList.remove('is-complete'));

    video.addEventListener('error', () => {
      hero.classList.add('is-complete');
      revealCopy();
    });

    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener('loadeddata', playVideo, { once: true });
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        video.pause();
      } else if (video.paused && !video.ended) {
        playVideo();
      }
    });
  })();

  window.goStat = goStat;
  window.toggleLang = toggleLang;
})();

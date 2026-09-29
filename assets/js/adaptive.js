(function(){
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

  function initHeader(){
    const nav = $('#nav');
    if(!nav) return;
    let lastY = window.scrollY;
    let forcedTimer = 0;
    let idleTimer = 0;
    const atEdge = () => window.scrollY < window.innerHeight * .72 ||
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - window.innerHeight * .35;
    const setVisible = visible => {
      nav.classList.toggle('is-hidden', !visible);
      nav.classList.toggle('is-visible', visible);
      if(!visible) nav.classList.remove('is-idle');
    };
    const wakeHeader = () => {
      clearTimeout(idleTimer);
      nav.classList.remove('is-idle');
      idleTimer = setTimeout(() => {
        if(!nav.matches(':hover') && !nav.contains(document.activeElement) && !nav.classList.contains('is-hidden')) {
          nav.classList.add('is-idle');
        }
      }, 2800);
    };
    const evaluatePointer = y => {
      if(atEdge()) { setVisible(true); return; }
      setVisible(y <= window.innerHeight / 3);
    };
    window.addEventListener('pointermove', e => { evaluatePointer(e.clientY); wakeHeader(); }, {passive:true});
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if(atEdge()) setVisible(true);
      else if(matchMedia('(hover:none)').matches) setVisible(y < lastY);
      lastY = y;
      wakeHeader();
    }, {passive:true});
    nav.addEventListener('focusin', () => { setVisible(true); wakeHeader(); });
    nav.addEventListener('mouseenter', () => { setVisible(true); wakeHeader(); });
    document.addEventListener('keydown', e => {
      if(e.key === 'Tab') {
        clearTimeout(forcedTimer); setVisible(true);
        forcedTimer = setTimeout(() => { if(!atEdge() && !nav.contains(document.activeElement)) setVisible(false); }, 4000);
      }
    });
    setVisible(true);
    wakeHeader();
  }

  function buildFooter(){
    $$('.site-footer').forEach(footer => {
      footer.innerHTML = `
        <div class="footer-shell">
          <section class="footer-brand-card">
            <h2><span class="footer-brand-primary" data-zh="汤问致新" data-en="TechWend">汤问致新</span><span data-zh="（北京）机器人科技有限公司" data-en=" (Beijing) Robotics Technology Co., Ltd.">（北京）机器人科技有限公司</span></h2>
            <p data-zh="致力于打造新一代最还原、最智能的消费级具身伙伴机器人终端，<br>让科技拥有温度。" data-en="Building authentic, intelligent next-generation consumer companion robots,<br>with warmth.">致力于打造新一代最还原、最智能的消费级具身伙伴机器人终端，<br>让科技拥有温度。</p>
          </section>
          <section class="footer-main">
            <div class="footer-main__top">
              <div class="footer-column footer-column--address"><h3 data-zh="地址" data-en="Address">地址</h3><p data-zh="黑龙江省哈尔滨市南岗区邮政街副434号<br>哈工大国家大学科技园 412" data-en="HIT National University Science Park 412,<br>Youzheng St, Nangang, Harbin">黑龙江省哈尔滨市南岗区邮政街副434号<br>哈工大国家大学科技园 412</p></div>
              <div class="footer-column"><h3 data-zh="电话" data-en="Phone">电话</h3><a href="tel:+8618661996738">+86 186 6199 6738</a></div>
              <div class="footer-column"><h3 data-zh="邮箱" data-en="Email">邮箱</h3><a href="mailto:sunxy@techvoyage.site">sunxy@techvoyage.site</a></div>
              <div class="footer-column footer-column--social"><h3 data-zh="关注我们" data-en="Follow us">关注我们</h3><div class="footer-social-links" aria-label="关注我们"><a class="footer-social-link" href="https://mp.weixin.qq.com/s/QoGUwUhKi5REB0D-KASvrg" target="_blank" rel="noopener noreferrer" aria-label="微信公众号"><span class="footer-social-icon footer-social-icon--wechat" aria-hidden="true"><img src="image/social/wechat.svg" alt=""></span><span data-zh="公众号" data-en="WeChat">公众号</span></a><a class="footer-social-link" href="https://xhslink.cn/m/2u61NjqeMcs" target="_blank" rel="noopener noreferrer" aria-label="小红书"><span class="footer-social-icon footer-social-icon--redbook" aria-hidden="true"><img src="image/social/xiaohongshu.svg" alt=""></span><span data-zh="小红书" data-en="RED">小红书</span></a><a class="footer-social-link" href="https://weibo.com/u/9182971464" target="_blank" rel="noopener noreferrer" aria-label="微博"><span class="footer-social-icon footer-social-icon--weibo" aria-hidden="true"><img src="image/social/sinaweibo.svg" alt=""></span><span data-zh="微博" data-en="Weibo">微博</span></a></div></div>
            </div>
            <div class="footer-legal"><span data-zh="© 2026 汤问致新（北京）机器人科技有限公司 版权所有" data-en="© 2026 Techvoyage (Beijing) Robotics Technology Co., Ltd. All rights reserved.">© 2026 汤问致新（北京）机器人科技有限公司 版权所有</span><span data-zh="让科技拥有温度" data-en="Technology with warmth">让科技拥有温度</span></div>
          </section>
        </div>`;
    });
  }

  function groupLastPageWithFooter(){
    if($('.career_hero')) document.documentElement.classList.add('careers-page');
    $$('.site-footer').forEach(footer => {
      if(footer.closest('.last-page-shell') || footer.closest('.snap-group') || footer.closest('.contact-shell')) return;
      const careersContent = $('.jobs-section');
      const previous = careersContent || footer.previousElementSibling;
      if(!previous || previous.tagName === 'SCRIPT') return;
      const shell = document.createElement('div');
      shell.className = 'last-page-shell';
      previous.before(shell);
      shell.append(previous, footer);
    });
  }

  function ensureHomeFooter(){
    if(!document.documentElement.classList.contains('home-page') && !$('#hero')) return;
    if($('.site-footer')) return;
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.id = 'footer';
    document.body.appendChild(footer);
  }

  function buildProductDeck(){
    if(!document.documentElement.classList.contains('products-page')) return;
    const overviewSlide = document.getElementById('layers');
    const intro = document.getElementById('overview');
    if(overviewSlide && intro) intro.after(overviewSlide);
    const ids = ['design','structure','electronics','system','perception','control','intelligence'];
    const slides = ids.map(id => document.getElementById(id)).filter(Boolean);
    if(!slides.length) return;
    slides.forEach(slide => slide.remove());
  }

  function buildFaq(){
    const panel = $('[data-pt-faq]');
    if(!panel) return;
    const container = $('.pt-container', panel);
    const head = $('.pt-faq__head', panel);
    const faq = $('.pt-faq', panel);
    if(!container || !head || !faq) return;
    const layout = document.createElement('div');
    layout.className = 'pt-faq-layout';
    const aside = document.createElement('aside');
    aside.className = 'pt-faq-aside';
    aside.innerHTML = `${head.innerHTML}<p data-zh="这里汇总合作过程中最常被问到的问题。若没有找到答案，欢迎直接联系我们。" data-en="Common questions about working with us. Contact us if you need anything else.">这里汇总合作过程中最常被问到的问题。若没有找到答案，欢迎直接联系我们。</p><div class="pt-faq-categories"><button class="is-active" type="button">合作流程</button><button type="button">技术能力</button><button type="button">安全与服务</button></div><div class="pt-faq-contact"><strong data-zh="还有问题？" data-en="Got questions?">还有问题？</strong><p data-zh="团队很乐意直接回答。" data-en="Our team is happy to help.">团队很乐意直接回答。</p><a href="mailto:sunxy@techvoyage.site">发送邮件 →</a></div>`;
    head.remove();
    layout.append(aside, faq);
    container.appendChild(layout);
    $$('.pt-faq-item', faq).forEach((item,i)=>{
      const h3 = $('h3',item), p = $('p',item);
      const btn = document.createElement('button');
      btn.className = 'pt-faq-toggle'; btn.type = 'button'; btn.innerHTML = h3.innerHTML;
      btn.setAttribute('aria-expanded', i===0?'true':'false');
      h3.replaceWith(btn); item.classList.toggle('is-open',i===0); item.classList.add('is-in');
      btn.addEventListener('click',()=>{
        const open = !item.classList.contains('is-open');
        $$('.pt-faq-item',faq).forEach(other=>{other.classList.remove('is-open'); $('.pt-faq-toggle',other)?.setAttribute('aria-expanded','false');});
        item.classList.toggle('is-open',open); btn.setAttribute('aria-expanded',String(open));
      });
    });
  }

  function mergePartnershipFormFaq(){
    const formSection = document.getElementById('form');
    const faqPanel = $('[data-pt-faq]');
    if(!formSection || !faqPanel || faqPanel.classList.contains('is-merged')) return;
    faqPanel.classList.add('is-merged');
    const form = $('#partnership-form', formSection);
    const kicker = $('.pt-kicker', formSection)?.cloneNode(true);
    const title = $('.pt-title', formSection)?.cloneNode(true);
    const container = $('.pt-container', faqPanel);
    const layout = $('.pt-faq-layout', faqPanel);
    if(!form || !container || !layout) return;
    const formCard = document.createElement('section');
    formCard.className = 'pt-merged-form';
    if(kicker) formCard.appendChild(kicker);
    if(title) formCard.appendChild(title);
    formCard.appendChild(form);
    layout.prepend(formCard);
    $('.pt-faq-aside', layout)?.remove();
    formSection.remove();
  }

  function enrichAboutPage(){
    const timeline = document.querySelector('.about-timeline__stage');
    if(timeline && !timeline.querySelector('.about-photo-stream')){
      const stream = document.createElement('div');
      stream.className = 'about-photo-stream';
      stream.setAttribute('aria-label', '公司足迹照片轮播');
      const photos = [
        '图片1.jpg','图片2.jpg','图片3.jpg','图片4.jpg','图片5.jpg','图片6.jpg','图片7.jpg','图片8.jpg',
        '图片9-web-1800.jpg','图片10.png','图片11.png','图片12.png','图片13.jpg','图片14.png','图片15.png','图片16-web-1800.jpg'
      ];
      const blocks = photos.map((name,i)=>`<figure><img src="background/pictures/${name}" alt="公司足迹照片 ${String(i+1).padStart(2,'0')}" loading="lazy"></figure>`).join('');
      stream.innerHTML=`<div>${blocks}${blocks}</div>`;
      timeline.appendChild(stream);
    }
    document.querySelectorAll('.about-timeline-card__img video').forEach(video=>{
      if(video.dataset.hoverPlayback === 'ready') return;
      video.dataset.hoverPlayback = 'ready';
      video.removeAttribute('autoplay');
      video.muted = true;
      video.pause();
      const card = video.closest('.about-timeline-card');
      if(!card) return;
      const freeze = ()=>video.pause();
      const play = ()=>video.play().catch(()=>{});
      if(video.readyState < 2){
        video.addEventListener('loadeddata', freeze, {once:true});
      }
      card.addEventListener('pointerenter', play);
      card.addEventListener('pointerleave', freeze);
      card.addEventListener('focusin', play);
      card.addEventListener('focusout', freeze);
    });
    const mediaGrid = document.querySelector('.about-media__grid');
    if(mediaGrid && !mediaGrid.querySelector('.about-media-card__visual') && !mediaGrid.querySelector('.about-media-placeholder')){
      const classes=['is-wide','is-tall','is-small','is-large','is-small','is-wide'];
      classes.forEach((cls,i)=>{const card=document.createElement('article');card.className=`about-media-placeholder ${cls}`;card.innerHTML=`<span>MEDIA ${String(i+1).padStart(2,'0')}</span>`;mediaGrid.appendChild(card);});
    }
  }

  function enrichCooperationScenes(){
    const cards = $$('.pt-coop-card');
    const palette=['#ffe1e6','#eef0f3','#ffd1d9','#eceff4','#ffdce2','#e8eaee'];
    cards.forEach((card,i)=>{if(card.querySelector('.pt-coop-card__visual'))return;const visual=document.createElement('div');visual.className='pt-coop-card__visual';visual.style.setProperty('--placeholder',palette[i%palette.length]);visual.innerHTML=`<span>合作场景 ${String(i+1).padStart(2,'0')}</span>`;card.prepend(visual);});
  }

  function loadMobile(){
    const mq=matchMedia('(max-width:768px)');
    let loaded=false;
    function load(){
      if(!mq.matches || loaded) return;
      loaded=true;
      const s=document.createElement('script'); s.src='mobile/mobile.js?v=20260929-mobile3'; s.defer=true; document.body.appendChild(s);
    }
    mq.addEventListener('change',load);
    load();
  }

  function initExploreRail(){
    const root = $('[data-explore-carousel]');
    if(!root) return;
    const stage = $('.explore-showcase__stage', root);
    if(!stage) return;
    const cards = $$('.explore-card', stage), dots = $$('[data-explore-dot]', root);
    const prev = $('.explore-showcase__btn--prev', root), next = $('.explore-showcase__btn--next', root);
    if(!cards.length) return;

    const controls = document.createElement('div');
    controls.className = 'explore-showcase__controls';
    stage.after(controls);
    if(prev) controls.append(prev);
    if(next) controls.append(next);

    const caption = document.createElement('div');
    caption.className = 'explore-showcase__caption';
    caption.setAttribute('aria-live','polite');
    controls.after(caption);

    let active = 0, autoTimer = 0;
    let inView = false, paused = false;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const syncCaption = (idx, instant = false) => {
      const body = $('.explore-card__body', cards[idx]);
      if(!body) return;
      const title = $('.explore-card__title', body);
      const copy = $('.explore-card__text', body);
      const link = $('.explore-card__link', body);
      const write = () => {
        caption.innerHTML = '';
        if(title){ const node=title.cloneNode(true); node.className='explore-showcase__caption-title'; caption.append(node); }
        if(copy){ const node=copy.cloneNode(true); node.className='explore-showcase__caption-text'; caption.append(node); }
        if(link){ const node=link.cloneNode(true); node.className='explore-showcase__caption-link'; caption.append(node); }
        requestAnimationFrame(()=>caption.classList.remove('is-changing'));
      };
      if(instant){ write(); return; }
      caption.classList.add('is-changing');
      setTimeout(write, 150);
    };

    const render = (idx, captionInstant = false) => {
      if(idx === active && caption.childElementCount && !captionInstant) return;
      active = idx;
      const previous = (active - 1 + cards.length) % cards.length;
      const following = (active + 1) % cards.length;
      cards.forEach((card,i)=>{
        const current = i === active;
        card.classList.toggle('is-active',current);
        card.classList.toggle('is-preview-prev',cards.length > 1 && i===previous);
        card.classList.toggle('is-preview-next',cards.length > 2 && i===following);
        card.setAttribute('aria-current',current?'true':'false');
        card.setAttribute('aria-hidden',current||i===previous||i===following?'false':'true');
      });
      dots.forEach((dot,i)=>dot.classList.toggle('active',i===active));
      syncCaption(active, captionInstant);
    };

    const schedule = () => {
      clearTimeout(autoTimer);
      if(!inView || paused || reducedMotion) return;
      autoTimer=setTimeout(()=>go(active+1, false),5200);
    };

    const go = (idx, manual = true) => {
      const nextIndex = (idx + cards.length) % cards.length;
      render(nextIndex);
      schedule();
    };

    prev?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();go(active-1);},{capture:true});
    next?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();go(active+1);},{capture:true});
    dots.forEach((dot,i)=>dot.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();go(i);},{capture:true}));
    stage.addEventListener('click',e=>{
      const card=e.target.closest('.explore-card');
      if(!card) return;
      e.preventDefault();e.stopImmediatePropagation();
      const idx=cards.indexOf(card); if(idx>=0 && idx!==active) go(idx);
    },{capture:true});
    stage.addEventListener('keydown',e=>{
      if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight') return;
      e.preventDefault();e.stopImmediatePropagation();go(active+(e.key==='ArrowLeft'?-1:1));
    },{capture:true});

    const pause = () => { paused=true; clearTimeout(autoTimer); };
    const resume = () => { paused=false; schedule(); };
    root.addEventListener('mouseenter',pause);
    root.addEventListener('mouseleave',resume);
    root.addEventListener('focusin',pause);
    root.addEventListener('focusout',resume);
    root.addEventListener('pointerdown',pause,{passive:true});
    root.addEventListener('pointerup',resume,{passive:true});
    new IntersectionObserver(entries=>{
      inView=entries[0]?.isIntersecting&&entries[0].intersectionRatio>.55;
      schedule();
    },{threshold:[.55]}).observe(root);

    requestAnimationFrame(()=>{
      render(0,true);
    });
  }

  ensureHomeFooter();
  buildFooter();
  buildProductDeck();
  buildFaq();
  mergePartnershipFormFaq();
  enrichAboutPage();
  enrichCooperationScenes();
  groupLastPageWithFooter();
  initExploreRail();
  initHeader();
  loadMobile();
})();

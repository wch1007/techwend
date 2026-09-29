(function () {
  'use strict';
  // Only additive mobile views. The original desktop DOM is kept intact.
  const mq = matchMedia('(max-width:768px)');
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
  const mobileImage = src => src.replace(/^background\//,'mobile/images/').replace(/\.(png|jpe?g)(\?.*)?$/i,'.webp');
  const make = (tag, cls) => { const el=document.createElement(tag); el.className=cls; return el; };
  const mobile = cls => { const el=make('div','mobile-only '+cls); el.style.display='none'; return el; };
  function copyText(source, tag) {
    const el=document.createElement(tag);
    if(!source) return el;
    el.innerHTML=source.innerHTML;
    ['zh','en'].forEach(lang=>{if(source.dataset[lang]) el.dataset[lang]=source.dataset[lang];});
    return el;
  }
  function localized(tag,zh,en) {
    const el=document.createElement(tag); el.dataset.zh=zh; el.dataset.en=en;
    el.textContent=document.documentElement.dataset.lang==='en'?en:zh; return el;
  }
  function explore() {
    const section=$('#grid'), source=$$('.explore-card');
    if(!section||!source.length) return;
    const wrap=mobile('m-explore');
    const hint=localized('p','左右滑动，探索更多 →','Swipe to explore →'); hint.className='m-swipe-hint'; wrap.append(hint);
    const gallery=make('div','m-gallery'); gallery.tabIndex=0; gallery.setAttribute('aria-label','探索更多');
    source.forEach(card=>{
      const item=make('article','m-gallery-card');
      const img=$('img',card).cloneNode(); img.src=mobileImage(img.getAttribute('src')); img.loading='lazy';
      const body=make('div','m-gallery-copy');
      body.append(copyText($('.explore-card__title',card),'h3'),copyText($('.explore-card__text',card),'p'));
      const link=$('a',card);
      if(link){ const a=link.cloneNode(true); a.href='products.html#specs'; body.append(a); }
      item.append(img,body); gallery.append(item);
    });
    wrap.append(gallery); section.append(wrap); section.classList.add('mobile-explore-ready');
  }
  function scenes() {
    const section=$('#scenarios'); if(!section) return;
    const wrap=mobile('m-scenes');
    $$('.scn-immersive__item',section).forEach((item,index)=>{
      const card=make('article','m-scene'), img=new Image();
      img.src=`mobile/images/场景${index+1}.webp`; img.alt=$('strong',item).textContent; img.loading='lazy'; img.decoding='async';
      const heading=document.createElement('h3'), num=document.createElement('span'); num.textContent=String(index+1).padStart(2,'0');
      heading.append(num,copyText($('strong',item),'strong')); card.append(img,heading); wrap.append(card);
    });
    section.append(wrap); section.classList.add('mobile-scenes-ready');
  }
  function productIntro() {
    const section=$('#overview'); if(!section) return;
    const wrap=mobile('m-product-intro');
    wrap.append(copyText($('.pr-title',section),'h1'),localized('p','让 AI 第一次以「在场」的方式，走进你的生活。','AI that shows up in your life.'));
    const stage=make('div','m-product-visual'),img=new Image();img.src='mobile/images/机器人.webp';img.alt='汤问桌面级机器人智能体终端';stage.append(img);wrap.append(stage);
    const metrics=make('div','m-product-metrics');
    $$('.pr-metric-row',section).forEach(row=>{const card=document.createElement('div');card.append($('.pr-metric-row__pair',row).cloneNode(true),copyText($('p',row),'p'));metrics.append(card);});
    wrap.append(metrics);
    const detail=document.createElement('details');detail.append(localized('summary','认识你的新伙伴','Meet your new companion'),copyText($('.pr-lead',section),'p'),copyText($('.pr-tagline',section),'p'));wrap.append(detail);
    section.append(wrap);section.classList.add('mobile-intro-ready');
  }
  function specs() {
    const section=$('#specs'), table=$('.pr-spec-table--comparison'); if(!section||!table) return;
    const rows=$$('tr',table), models=$$('td',rows[1]), wrap=mobile('m-specs');
    const tabs=make('div','m-model-tabs'); tabs.setAttribute('role','tablist'); tabs.setAttribute('aria-label','产品型号');
    const panels=[];
    models.forEach((model,index)=>{
      const button=document.createElement('button'); button.type='button'; button.textContent=model.textContent;
      button.id=`m-model-${index}`; button.setAttribute('role','tab'); button.setAttribute('aria-controls',`m-spec-${index}`);
      const panel=make('div','m-spec-panel'); panel.id=`m-spec-${index}`; panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-labelledby',button.id);
      const summary=make('div','m-spec-summary'); summary.append(copyText(model,'h3'),copyText($('td',rows[0]),'p'),copyText($$('td',rows.at(-1))[index],'strong'),copyText($('th',rows.at(-1)),'small'));
      const dl=make('dl','m-spec-list');
      rows.slice(2,-1).forEach(row=>{ const entry=document.createElement('div'); entry.append(copyText($('th',row),'dt'),copyText($$('td',row)[index],'dd')); dl.append(entry); });
      panel.append(summary,dl); panels.push(panel); tabs.append(button);
      button.addEventListener('click',()=>activate(index));
      button.addEventListener('keydown',event=>{
        const keys={ArrowRight:(index+1)%3,ArrowLeft:(index+2)%3,Home:0,End:2};
        if(event.key in keys){ event.preventDefault(); activate(keys[event.key]); tabs.children[keys[event.key]].focus(); }
      });
    });
    function activate(index) {
      [...tabs.children].forEach((button,i)=>{ button.setAttribute('aria-selected',String(i===index)); button.tabIndex=i===index?0:-1; panels[i].hidden=i!==index; });
    }
    wrap.append(tabs,...panels); $('.pr-container',section).append(wrap); section.classList.add('mobile-specs-ready'); activate(0);
  }
  function contact() {
    const panel=$('.qr_panel'), links=$('.footer-social-links'); if(!panel||!links) return;
    const wrap=mobile('m-contact-social'); [...links.children].forEach(link=>wrap.append(link.cloneNode(true))); panel.append(wrap); panel.classList.add('mobile-contact-ready');
  }
  explore(); productIntro(); scenes(); specs(); contact();
  const current=location.pathname.split('/').pop()||'index.html';
  $$('#nav-links a').forEach(a=>{if(a.getAttribute('href')===current) a.setAttribute('aria-current','page');});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&mq.matches&&$('#nav-links.open')) { $('#burger')?.click(); $('#burger')?.focus(); }
  });
  const lead=$('.pr-layers__lead');
  const originalLead=lead?{html:lead.innerHTML,zh:lead.dataset.zh,en:lead.dataset.en}:null;
  const phone=$('.info_content a[href^="tel:"]'); const originalPhone=phone?.getAttribute('href');
  function sync() {
    document.documentElement.classList.toggle('mobile-layout',mq.matches);
    if(lead) {
      lead.dataset.zh=mq.matches?'继续向下滑动，看机器人从结构核心逐层成形。':originalLead.zh;
      lead.dataset.en=mq.matches?'Scroll down to build your companion, layer by layer.':originalLead.en;
      lead.innerHTML=mq.matches?lead.dataset[document.documentElement.dataset.lang==='en'?'en':'zh']:originalLead.html;
    }
    if(phone) phone.setAttribute('href',mq.matches?'tel:+8618661996738':originalPhone);
    if(!mq.matches&&$('#nav-links.open')) $('#burger')?.click();
  }
  mq.addEventListener('change',sync); sync();
  function assemblyStory() {
    const root=$('#layers'), inner=$('.pr-layers__inner',root||document);
    if(!root||!inner) return;
    const tabs=$$('[data-layer-to]',root), count=tabs.length;
    if(count<2) return;
    const controls=mobile('m-layer-controls'), status=make('div','m-layer-status');
    const number=document.createElement('strong');
    status.append(localized('span','向上滑动 · 逐层装配','Scroll to assemble'),number);
    const scrub=document.createElement('input'); scrub.type='range';scrub.className='m-layer-scrub';
    scrub.min='0';scrub.max=String(count-1);scrub.step='1';scrub.value='0';
    const exit=localized('a','继续探索 ↓','Keep exploring ↓');exit.href='#scenarios';exit.className='m-layer-exit';
    controls.append(status,scrub,exit);inner.append(controls);root.classList.add('m-scroll-layers');
    let active=-1, frame=0;
    function geometry(){
      const style=getComputedStyle(root), top=parseFloat(getComputedStyle(inner).top)||80;
      const padding=parseFloat(style.paddingTop)||0, bottom=parseFloat(style.paddingBottom)||0;
      return {start:root.getBoundingClientRect().top+scrollY+padding-top, travel:Math.max(1,root.offsetHeight-inner.offsetHeight-padding-bottom)};
    }
    function paint(){
      frame=0;if(!mq.matches)return;
      const {start,travel}=geometry();
      const progress=Math.max(0,Math.min(1,(scrollY-start)/travel));
      const index=Math.min(count-1,Math.floor(progress*count));
      if(index!==active){
        active=index;root.dispatchEvent(new CustomEvent('mobile-layer-change',{detail:index}));
        number.textContent=String(index+1).padStart(2,'0')+' / '+String(count).padStart(2,'0');
        scrub.value=String(index);
      }
      const en=document.documentElement.dataset.lang==='en', label=$('em',tabs[index]);
      scrub.setAttribute('aria-label',en?'Robot assembly progress':'机器人装配进度');
      scrub.setAttribute('aria-valuetext',`${index+1} / ${count} · ${label.dataset[en?'en':'zh']||label.textContent}`);
      scrub.style.setProperty('--assembly-progress',`${index/(count-1)*100}%`);
    }
    function schedule(){if(!frame&&mq.matches)frame=requestAnimationFrame(paint);}
    scrub.addEventListener('input',()=>{
      const {start,travel}=geometry(), index=Number(scrub.value);
      // Move the document to this layer's midpoint, keeping scroll and drag in sync.
      window.scrollTo({top:start+travel*(index+.5)/count,behavior:'instant'});paint();
    });
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule,{passive:true});
    new ResizeObserver(schedule).observe(inner);
    new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-lang']});
    mq.addEventListener('change',()=>{active=-1;schedule();});
    paint();
  }
  assemblyStory();
  // Compact, touch-driven showrooms. Controls are additive and mobile-only.
  function rail(selector) {
    const track=$(selector); if(!track) return;
    const cards=[...track.children]; if(cards.length<2) return;
    const controls=mobile('m-rail-controls');
    const prev=document.createElement('button'), next=document.createElement('button');
    prev.type=next.type='button'; prev.textContent='←'; next.textContent='→';
    prev.setAttribute('aria-label','上一张'); next.setAttribute('aria-label','下一张');
    const dots=make('div','m-rail-dots'); let active=0;
    cards.forEach((card,i)=>{
      const dot=document.createElement('button'); dot.type='button'; dot.setAttribute('aria-label',`查看第 ${i+1} 张`);
      dot.addEventListener('click',()=>go(i)); dots.append(dot);
    });
    function go(i){const card=cards[Math.max(0,Math.min(cards.length-1,i))];track.scrollTo({left:card.offsetLeft-track.offsetLeft,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}
    function paint(){
      const left=track.getBoundingClientRect().left;
      active=cards.reduce((best,c,i)=>Math.abs(c.getBoundingClientRect().left-left)<Math.abs(cards[best].getBoundingClientRect().left-left)?i:best,0);
      cards.forEach((c,i)=>c.classList.toggle('m-current',i===active));
      [...dots.children].forEach((d,i)=>{d.classList.toggle('is-active',i===active);d.setAttribute('aria-current',i===active?'true':'false');});
      prev.disabled=active===0;next.disabled=active===cards.length-1;
    }
    prev.addEventListener('click',()=>go(active-1));next.addEventListener('click',()=>go(active+1));
    track.addEventListener('scroll',paint,{passive:true});
    controls.append(prev,dots,next); track.after(controls); paint();
  }
  ['.c3-row','.era-timeline__nodes','.m-scenes','.m-gallery','.about-timeline__grid'].forEach(rail);
  $$('#stats .stat-panel').forEach(panel=>{
    const source=$('.stat-panel__detail',panel); if(!source) return;
    const details=document.createElement('details');details.className='mobile-only m-stat-details';details.style.display='none';
    details.append(localized('summary','技术细节 +','Details +'),source.cloneNode(true));panel.append(details);
  });
  const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting) { entry.target.classList.add('m-in-view'); reveal.unobserve(entry.target); }
  }),{threshold:.08});
  $$('.cards-panel__header,.value-panel__copy,.era-timeline__head,.pf-section-head,.about-folder__head,.about-media__head,.m-product-intro h1').forEach(el=>{el.classList.add('m-motion');reveal.observe(el);});
  const hero=$('#hero.hero'), video=$('.hero__video');
  if(hero&&video){
    const control=mobile('m-video-controls'), play=localized('button','播放开场','Play intro'), skip=localized('button','跳过开场 ↓','Skip intro ↓');
    play.type=skip.type='button';control.append(play,skip);hero.append(control);
    video.muted=true;video.playsInline=true;
    let skipped=false;
    const complete=()=>hero.classList.add('m-video-complete');
    async function start(){
      if(!mq.matches) return;
      skipped=false;
      hero.classList.remove('m-video-complete','m-video-blocked');video.currentTime=0;
      try { await video.play(); } catch(e){hero.classList.add('m-video-blocked');}
    }
    play.addEventListener('click',start);
    skip.addEventListener('click',()=>{skipped=true;video.pause();complete();});
    video.addEventListener('ended',complete);
    video.addEventListener('error',()=>{complete();hero.classList.add('m-video-unavailable');});
    video.addEventListener('play',()=>{if(mq.matches){if(skipped){video.pause();complete();}else hero.classList.remove('m-video-complete','m-video-blocked');}});
    if(video.ended) complete();
    else if(mq.matches) video.play().catch(()=>hero.classList.add('m-video-blocked'));
    mq.addEventListener('change',()=>{if(mq.matches&&video.ended)complete();});
  }
  // Shared pictures use native media sources; widening restores desktop automatically.
})();

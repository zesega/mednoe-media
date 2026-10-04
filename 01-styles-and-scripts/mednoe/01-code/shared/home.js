(function(){function start(){if(window.__bs98Started)return;window.__bs98Started=true;document.documentElement.id='bs98-tilda';document.documentElement.lang='ru';document.documentElement.dataset.lang='ru';
document.documentElement.classList.add('js');window.__rvDrop=function(){document.documentElement.classList.remove('js');document.querySelectorAll('img[data-src]').forEach(function(i){if(i.dataset.src)i.src=i.dataset.src;});};window.__rvT=setTimeout(window.__rvDrop,4000);window.addEventListener('error',window.__rvDrop);
try{
(function(){var b=document.getElementById('gmapLoad');if(!b)return;b.addEventListener('click',function(){var f=b.closest('.gmap');var i=document.createElement('iframe');i.src='https://www.google.com/maps?q=66.192007,29.141011&z=13&output=embed';i.loading='lazy';i.allowFullscreen=true;i.referrerPolicy='no-referrer-when-downgrade';i.title='Карта Google — Салмиламминваара';i.tabIndex=0;f.appendChild(i);document.getElementById('gmapFacade').style.display='none';try{i.focus({preventScroll:true});}catch(e){i.focus();}});})(); /* the button disappears with the facade: hand focus to the map */
}catch(error){console.error("BS98 block initialization",error);if(window.__rvDrop)window.__rvDrop();}

try{

(function(){
  "use strict"; // a directive, not a statement: it must stay first for strict mode to apply
  var root = document.documentElement;
  var rmq = matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = rmq.matches;

  root.lang='ru'; root.dataset.lang='ru';
  document.body.insertAdjacentHTML('afterbegin','<div class="progress" id="progress"></div>');
  var hdr=document.getElementById('top'), prog=document.getElementById('progress');
  /* header state + progress bar: one write per frame, no CSS transition to lag behind */
  var sTick=false;
  function onScrollFrame(){sTick=false;hdr.classList.toggle('scrolled',scrollY>40);if(prog){var h=document.documentElement.scrollHeight-innerHeight;prog.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0)+')';}}
  addEventListener('scroll',function(){if(!sTick){sTick=true;requestAnimationFrame(onScrollFrame);}},{passive:true});

  function fmt(v,dec,sep){var lang=root.dataset.lang,s=v.toFixed(dec),p=s.split('.');if(sep)p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,lang==='en'?',':' ');return p[1]?p[0]+(lang==='en'?'.':',')+p[1]:p[0];}
  function reformatNumbers(){document.querySelectorAll('.cnt[data-done]').forEach(function(el){el.textContent=fmt(parseFloat(el.dataset.target),parseInt(el.dataset.dec||'0'),el.dataset.sep==='1');});}
  function countUp(el){var t=parseFloat(el.dataset.target),dec=parseInt(el.dataset.dec||'0'),sep=el.dataset.sep==='1';el.textContent=fmt(t,dec,sep);if(reduce||!root.classList.contains('js'))return;
    el.style.minWidth=Math.ceil(el.getBoundingClientRect().width)+'px'; // width of the final value: the unit beside it never shifts
    var dur=1600,t0=performance.now();(function step(now){var pr=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-pr,3);el.textContent=fmt(t*e,dec,sep);if(pr<1)requestAnimationFrame(step);else{el.textContent=fmt(t,dec,sep);el.style.minWidth='';}})(performance.now());}

  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;e.target.classList.add('in');if(e.target.querySelectorAll)e.target.querySelectorAll('.cnt:not([data-done])').forEach(function(c){c.dataset.done='1';countUp(c);});io.unobserve(e.target);});},{threshold:.16,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rv').forEach(function(el){io.observe(el);});
  /* the hero enters by CSS alone (vfHeroIn); printing shows every section, revealed or not */
  addEventListener('beforeprint',function(){document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in');});});

  /* Below-fold images (maps, mood stills, film poster) carry data-src and are swapped in only as
     they come within ~600px of the viewport. loading="lazy" alone was not enough: on a throttled
     link Chrome starts them almost immediately and they queue ahead of the hero's fonts (LCP). */
  (function(){
    var imgs=[].slice.call(document.querySelectorAll('img[data-src]'));if(!imgs.length)return;
    function load(img){if(img.dataset.src){img.src=img.dataset.src;img.removeAttribute('data-src');}}
    function loadAll(){imgs.forEach(load);}
    if(!('IntersectionObserver' in window)){loadAll();return;}
    var iio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;
      var car=e.target.closest('#mapCar'); // the карусель: fetch all three maps together so the next slide is ready
      if(car)[].forEach.call(car.querySelectorAll('img[data-src]'),load);else load(e.target);
      iio.unobserve(e.target);});},{rootMargin:'600px 0px'});
    imgs.forEach(function(i){iio.observe(i);});
    addEventListener('beforeprint',loadAll);
  })();

  /* Maps: fade in when present; keep placeholder if the file is missing */
  document.querySelectorAll('img[data-map]').forEach(function(img){
    if(img.complete&&img.naturalWidth>0)img.classList.add('in');
    else img.addEventListener('load',function(){img.classList.add('in');});
  });

  /* Ambient video — muted loops, loaded and played only in view. The poster <img> covers
     the video until frames are actually moving ('playing'), so a blocked autoplay (iOS Low
     Power Mode, data saver) keeps the photo rather than a paused first frame.
     No ambient motion under prefers-reduced-motion (followed live) or while the viewer has
     paused it with #motionTog (WCAG 2.2.2); that choice lasts for the browser session. */
  var held=false, motionHooks=[];
  try{held=sessionStorage.getItem('bs98-motion')==='off';}catch(e){}
  function still(){return rmq.matches||held;}
  function vPlay(v){
    if(still())return;
    if(!v.src && v.dataset.src){
      var c = navigator.connection || {};
      if (c.saveData || /(^|-)2g$/.test(c.effectiveType || "")) return; // poster stays
      /* phones and tablets (narrow viewport or touch pointer) get the lighter 720p encode of the same clip */
      var lite = v.dataset.srcMobile && (matchMedia("(max-width: 900px)").matches || matchMedia("(pointer: coarse)").matches);
      v.src = lite ? v.dataset.srcMobile : v.dataset.src;
    }
    v.muted = true;
    if(!v.dataset.bound){
      v.dataset.bound = "1";
      v.addEventListener("playing", function(){ v.classList.add("ready"); });
    }
    if(!v.paused && v.readyState >= 2) v.classList.add("ready"); // already running
    var p = v.play();
    if(p && p.catch) p.catch(function(){ /* refused: the poster image simply stays */ });
  }
  var ambient=[].slice.call(document.querySelectorAll('video[data-src]'));
  var vio=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;v._vfIn=e.isIntersecting;if(e.isIntersecting)vPlay(v);else if(v.src&&!v.paused)v.pause();});},{threshold:.15});
  ambient.forEach(function(v){if(v.hasAttribute('data-lazy'))vio.observe(v);});
  function motionOn(){ambient.forEach(function(v){if(!v.hasAttribute('data-lazy')||v._vfIn)vPlay(v);});}
  function motionOff(){ambient.forEach(function(v){if(!v.paused)v.pause();});}

  /* Pause motion — one toggle, bottom-right of the hero, for every ambient video on the page */
  (function(){
    var b=document.getElementById('motionTog');if(!b||!ambient.length)return;
    function sync(){b.setAttribute('aria-pressed',held?'true':'false');b.hidden=rmq.matches;}
    b.addEventListener('click',function(){
      held=!held;
      try{if(held)sessionStorage.setItem('bs98-motion','off');else sessionStorage.removeItem('bs98-motion');}catch(e){}
      sync();
      if(held)motionOff();else motionOn();
      motionHooks.forEach(function(f){f(held);});
    });
    function onPref(){sync();if(rmq.matches)motionOff();else motionOn();}
    if(rmq.addEventListener)rmq.addEventListener('change',onPref);else if(rmq.addListener)rmq.addListener(onPref);
    sync();
  })();

  /* Hero — one full-bleed clip; start it now (Pause motion / reduced motion are handled in vPlay) */
  /* Hero clip starts after load so it never competes with the headline (LCP). */
  var heroV=document.querySelector('.hero .slide video');
  if(heroV){ if(document.readyState==='complete') vPlay(heroV); else addEventListener('load',function(){vPlay(heroV);},{once:true}); }

  /* Location map карусель — three maps, click to enlarge. Auto-advances only while it is
     on screen and motion is not paused; stops for good once the viewer steers, touches or
     focuses it (WCAG 2.2.2). Inactive slides are inert and hidden from assistive tech. */
  (function(){
    var car=document.getElementById('mapCar');if(!car)return;
    var slides=[].slice.call(car.querySelectorAll('.mc-slide'));if(slides.length<2)return;
    var dotsWrap=document.querySelector('#mapCar + .mc-dots'),i=0,timer,auto=true,vis=false,hover=false;
    var dots=slides.map(function(s,n){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Карта '+(n+1));b.addEventListener('click',function(){go(n);stop();});if(dotsWrap)dotsWrap.appendChild(b);return b;});
    function mark(){
      slides.forEach(function(s,n){var on=n===i;s.classList.toggle('active',on);s.inert=!on;if(on)s.removeAttribute('aria-hidden');else s.setAttribute('aria-hidden','true');});
      dots.forEach(function(d,n){d.classList.toggle('active',n===i);if(n===i)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current');});
    }
    function go(n){n=(n+slides.length)%slides.length;if(n===i)return;i=n;mark();}
    function reset(){clearInterval(timer);if(auto&&!reduce&&!held&&vis&&!hover)timer=setInterval(function(){go(i+1);},6000);}
    function stop(){auto=false;clearInterval(timer);}
    var nx=car.querySelector('.mc-arrow.next'),pv=car.querySelector('.mc-arrow.prev');
    if(nx)nx.addEventListener('click',function(){go(i+1);stop();});
    if(pv)pv.addEventListener('click',function(){go(i-1);stop();});
    car.addEventListener('focusin',stop);
    car.addEventListener('pointerdown',stop);
    /* touch: a mostly-horizontal swipe of 40 px or more moves one map (and ends the auto-advance) */
    var sx=null,sy=null;
    car.addEventListener('touchstart',function(e){var t=e.changedTouches[0];sx=t.clientX;sy=t.clientY;},{passive:true});
    car.addEventListener('touchend',function(e){if(sx===null)return;var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;sx=sy=null;if(Math.abs(dx)>=40&&Math.abs(dx)>Math.abs(dy)*1.5){go(i+(dx<0?1:-1));stop();}},{passive:true});
    if(dotsWrap)dotsWrap.addEventListener('focusin',stop);
    car.addEventListener('mouseenter',function(){hover=true;clearInterval(timer);});
    car.addEventListener('mouseleave',function(){hover=false;reset();});
    motionHooks.push(reset); // follows "Pause motion" both ways; a direct interaction still stops it for good
    mark();
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){vis=es[es.length-1].isIntersecting;if(vis)reset();else clearInterval(timer);},{threshold:.3}).observe(car);
    }
  })();

  /* Map lightbox — click a map, or "Suurenna", to view it large. A real modal: focus
     moves to Close, Tab stays inside, Esc / Close returns focus to where it was. */
  (function(){
    var lb=document.getElementById('mapLightbox');if(!lb)return;
    document.body.appendChild(lb); // out of the transformed .rv section, so position:fixed is the viewport
    var lbImg=lb.querySelector('img'),lbCap=lb.querySelector('.lb-cap'),lbClose=lb.querySelector('.lb-close'),back=null;
    function focusEl(x){try{x.focus({preventScroll:true});}catch(e){x.focus();}}
    function open(img){
      if(!img||(img.complete&&img.naturalWidth===0))return; // map file missing: keep the placeholder
      var h4=img.closest('.mc-slide').querySelector('.mc-cap h4'),cap='';
      if(h4){var en=root.dataset.lang==='en',pick=h4.querySelector(en?'[lang=en]':'[lang=fi]')||h4;cap=pick.textContent.trim();}
      back=document.activeElement;
      lbImg.src=img.dataset.full||img.currentSrc;lbImg.alt=img.alt||'';if(lbCap)lbCap.textContent=cap;
      lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
      focusEl(lbClose);
    }
    function close(){
      if(!lb.classList.contains('open'))return;
      lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.style.overflow='';
      setTimeout(function(){if(!lb.classList.contains('open'))lbImg.removeAttribute('src');},350);
      if(back&&back!==document.body&&document.contains(back))focusEl(back);else lbClose.blur();
      back=null;
    }
    [].forEach.call(document.querySelectorAll('#mapCar .mc-slide > img'),function(img){img.addEventListener('click',function(){open(img);});});
    var zoom=document.querySelector('#mapCar .mc-zoom');
    if(zoom)zoom.addEventListener('click',function(){open(document.querySelector('#mapCar .mc-slide.active > img'));});
    lb.addEventListener('click',function(e){if(e.target===lb)close();});
    lbClose.addEventListener('click',close);
    addEventListener('keydown',function(e){
      if(!lb.classList.contains('open'))return;
      if(e.key==='Escape')close();
      else if(e.key==='Tab'){e.preventDefault();focusEl(lbClose);} // Close is the only control
    });
  })();

  /* Subtle parallax on full-bleed video bands. First run in a frame (not during script
     evaluation); all rects are read before any transform is written. */
  (function(){
    if(reduce)return;
    var bands=[].slice.call(document.querySelectorAll('.band')).map(function(b){return {b:b,v:b.querySelector('.vid')};}).filter(function(x){return x.v;});
    if(!bands.length)return;
    var ticking=false;
    function update(){
      ticking=false;
      var vh=innerHeight,rs=bands.map(function(x){return x.b.getBoundingClientRect();});
      bands.forEach(function(x,k){var r=rs[k];if(r.bottom<-50||r.top>vh+50)return;var p=((r.top+r.height/2)-vh/2)/vh;x.v.style.transform='translate3d(0,'+(p*-5).toFixed(2)+'%,0) scale(1.12)';});
    }
    function req(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
    addEventListener('scroll',req,{passive:true});
    addEventListener('resize',req,{passive:true});
    req();
  })();
  clearTimeout(window.__rvT); // the whole page script ran without throwing: keep the reveal animations (see <head>)
})();

}catch(error){console.error("BS98 block initialization",error);if(window.__rvDrop)window.__rvDrop();}

try{
/* ValkiaForest Villas — brand film. Used on the homepage (no framework, no globals).

   #filmbox[data-state]
     idle  poster + "Katso äänellä · 0:20". Nothing downloads.
     loop  muted preview (video/brandfilm-loop.mp4) while at least half of the film is on
           screen; pauses when it leaves. The pause toggle (WCAG 2.2.2) is sticky.
     full  the film with sound from 0:00 with native controls, only after an explicit tap.
   [data-live]   frames are moving: only then does the poster fade.
   [data-held]   the viewer paused the preview.
   [data-ended]  the film has played to the end: end card + "Katso uudelleen".

   No preview at all under prefers-reduced-motion (followed live), Save-Data or a
   2G/3G connection. A refused play() (iOS Low Power Mode, in-app browsers, "block
   autoplay") leaves the poster + play button and drops the src so nothing downloads.

   Markup contract (see the page): <div id="filmbox" data-state="idle" data-cta="/materials/">
   with <video id="film" data-loop data-full muted playsinline preload="none" inert>
   (no src, no poster), <img class="fposter">, #filmplay, optional #filmsound and
   #filmpause. Visible text lives in the markup as <span lang="fi">/<span lang="en">
   pairs; the few strings injected here are injected as the same pairs. */
(function () {
  "use strict";
  var box = document.getElementById("filmbox"),
      v = document.getElementById("film"),
      bPlay = document.getElementById("filmplay");
  if (!box || !v || !bPlay || typeof v.play !== "function" || box._vfFilm) return;
  box._vfFilm = true; // included twice by mistake: the second copy does nothing

  var bSound = document.getElementById("filmsound"),
      bPause = document.getElementById("filmpause"),
      /* phones and tablets get the 480p encode of the preview loop — the same rule the ambient clips use */
      lite = !!window.matchMedia && (matchMedia("(max-width: 900px)").matches || matchMedia("(pointer: coarse)").matches),
      LOOP = (lite && v.getAttribute("data-loop-mobile")) || v.getAttribute("data-loop"),
      FULL = v.getAttribute("data-full"),
      CTA = box.getAttribute("data-cta"),
      rm = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null,
      state = "",
      held = false,     // the viewer paused the preview: stays paused until they resume it
      engaged = false,  // the viewer has started the film with sound: no more auto-preview
      blocked = false,  // the browser refused the muted preview: don't retry this visit
      visible = false,  // >= half of the film box is in the viewport
      gen = 0,          // bumps on every src/play decision; stale play() promises are ignored
      home = bPlay.nextSibling,
      end = null, endRow = null;

  function pair(fi, en) { var labels={"Kartta / Map ": "Карта ", "Pause preview": "Приостановить просмотр", "Resume preview": "Продолжить просмотр", "Watch again": "Смотреть ещё раз", "Replay": "Повторить", "Open the data room": "Материалы проекта", "Open the data room →": "Материалы проекта →", "The exact figures and materials are in the data room.": "Открытые материалы помогут подробнее познакомиться с проектом.", "Request access &rarr;": "Материалы проекта &rarr;", "Request access →": "Материалы проекта →", "The film did not start &mdash; try again": "Фильм не запустился — попробуйте ещё раз", "The film did not start — try again": "Фильм не запустился — попробуйте ещё раз", "The film could not be played. Please try again.": "Не удалось воспроизвести фильм. Попробуйте ещё раз."}; return labels[en] || en; }
  function el(tag, cls, html) { var e = document.createElement(tag); e.className = cls; if (html) e.innerHTML = html; return e; }
  function flag(name, on) { if (on) box.setAttribute(name, ""); else box.removeAttribute(name); }
  function focus(x) { try { x.focus({ preventScroll: true }); } catch (e) { x.focus(); } }

  /* ---- one-time setup ------------------------------------------------------ */
  /* <source> children are only the no-JS fallback; the script drives src itself. */
  [].slice.call(v.querySelectorAll("source")).forEach(function (s) { s.parentNode.removeChild(s); });
  v.removeAttribute("controls");
  v.preload = "none";
  v.muted = true; v.defaultMuted = true;
  v.playsInline = true; v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", "");

  /* status line for playback errors (a live region must exist before it speaks) */
  var msg = el("p", "film-msg");
  msg.setAttribute("role", "status");
  box.appendChild(msg);

  /* "Katso uudelleen" label + replay icon, shown on #filmplay once the film has ended */
  var lbl = bPlay.querySelector(".lbl"), again = el("span", "film-again", pair("Katso uudelleen", "Watch again"));
  bPlay.insertBefore(again, lbl ? lbl.nextSibling : null);
  var disc = bPlay.querySelector(".disc");
  if (disc) disc.insertAdjacentHTML("beforeend",
    '<svg class="i-again" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5V1.5L7 6.5l5 5V8a5 5 0 1 1-5 5H5a7 7 0 1 0 7-8z"/></svg>');

  /* end card: only when the page names where "Pyydä pääsyä" should go */
  if (CTA) {
    end = el("div", "film-end");
    var t = el("p", "film-end-t", pair("Tarkat luvut ja aineistot ovat dataroomissa.", "The exact figures and materials are in the data room."));
    t.id = "filmend-t";
    var a = el("a", "film-cta", pair("Pyydä pääsyä &rarr;", "Request access &rarr;"));
    a.setAttribute("href", CTA);
    endRow = el("div", "film-end-a");
    endRow.appendChild(a);
    end.appendChild(t); end.appendChild(endRow);
    end.inert = true;
    box.appendChild(end);
  }

  /* ---- state ------------------------------------------------------------------- */
  function set(s) {
    var f = document.activeElement,
        had = !!f && f !== document.body && box.contains(f);
    state = s;
    box.setAttribute("data-state", s);
    bPlay.inert = s !== "idle";
    if (bSound) bSound.inert = s !== "loop";
    if (bPause) bPause.inert = s !== "loop";
    v.inert = s !== "full";
    v.controls = s === "full";
    if ("disableRemotePlayback" in v) v.disableRemotePlayback = s !== "full";
    if ("disablePictureInPicture" in v) v.disablePictureInPicture = s !== "full";
    if (s === "loop") showMsg("");
    /* Hidden controls are inert, which drops focus to <body>. Hand it to the control
       that took their place instead, so keyboard and screen-reader users stay put. */
    if (had && (f.inert || (f.closest && f.closest("[inert]")))) {
      focus(s === "full" ? v : s === "loop" ? (bSound || bPause || box) : bPlay);
    }
  }

  function showMsg(html) { if (msg.innerHTML !== html) msg.innerHTML = html; }

  function frugal() {
    var c = navigator.connection;
    return !!c && (c.saveData === true || /(^|-)(2g|3g)$/.test(c.effectiveType || ""));
  }
  function previewAllowed() {
    return !!LOOP && !(rm && rm.matches) && !frugal() && !blocked && !engaged && !held && !document.hidden;
  }

  /* ---- muted preview ------------------------------------------------------------- */
  function startPreview(force) {
    if (state === "full" || !previewAllowed() || !(visible || force)) return;
    var g = ++gen, p;
    if (v.getAttribute("src") !== LOOP) v.setAttribute("src", LOOP);
    v.muted = true; v.defaultMuted = true; v.loop = true;
    try { p = v.play(); } catch (e) { dropPreview(); return; }
    if (p && typeof p.then === "function") p.then(null, function (err) {
      if (g !== gen || state === "full") return;
      if (err && err.name === "AbortError") return; // our own pause()/src change interrupted it
      dropPreview();
    });
  }
  function stopPreview() { if (state !== "full" && !v.paused) { gen++; v.pause(); } }

  /* The browser said no (or the loop file failed): poster + play button, and let go
     of the file so nothing keeps downloading. */
  function dropPreview() {
    blocked = true; gen++;
    try { v.pause(); } catch (e) {}
    if (v.getAttribute("src")) { v.removeAttribute("src"); try { v.load(); } catch (e) {} }
    flag("data-live", false);
    set("idle");
  }

  /* Preview no longer wanted (reduced motion switched on): back to the poster. */
  function calmPreview() {
    gen++;
    if (!v.paused) v.pause();
    flag("data-live", false);
    set("idle");
  }

  /* ---- the film with sound ------------------------------------------------------- */
  function watchFull() {
    if (!FULL) return;
    var g = ++gen, p, f = document.activeElement,
        wasIn = !!f && f !== document.body && box.contains(f); // moving #filmplay back would blur it
    engaged = true;
    showMsg("");
    flag("data-ended", false);
    if (end) { end.inert = true; if (bPlay.parentNode !== box) box.insertBefore(bPlay, home && home.parentNode === box ? home : null); }
    bPlay.removeAttribute("aria-describedby");
    flag("data-live", false); // the poster covers the switch until the film's frames move
    v.loop = false; v.muted = false; v.defaultMuted = false;
    if (v.getAttribute("src") !== FULL) v.setAttribute("src", FULL);
    else { try { v.currentTime = 0; } catch (e) {} }
    set("full");
    if (wasIn && document.activeElement !== v) focus(v);
    try { p = v.play(); } catch (e) { fail(); return; }
    if (p && typeof p.then === "function") p.then(null, function (err) {
      if (g !== gen || state !== "full") return;
      if (err && err.name === "AbortError") return;
      fail();
    });
  }

  function fail() {
    gen++;
    exitFullscreen();
    try { v.pause(); } catch (e) {}
    if (v.getAttribute("src")) { v.removeAttribute("src"); try { v.load(); } catch (e) {} }
    v.muted = true; v.defaultMuted = true;
    flag("data-live", false);
    showMsg(pair("Filmi ei k&auml;ynnistynyt &mdash; yrit&auml; uudelleen", "The film did not start &mdash; try again"));
    set("idle");
    if (document.activeElement === document.body) focus(bPlay);
  }

  function finish() {
    gen++;
    exitFullscreen();
    v.muted = true; v.defaultMuted = true;
    flag("data-live", false);
    flag("data-ended", true);
    if (end) {
      endRow.insertBefore(bPlay, endRow.firstChild);
      end.inert = false;
      bPlay.setAttribute("aria-describedby", "filmend-t");
    }
    var f = document.activeElement, keep = f && f !== document.body && !box.contains(f);
    set("idle");
    if (!keep) focus(bPlay); // back to the control that started it, unless focus moved on elsewhere
  }

  function exitFullscreen() {
    try {
      var d = document, fe = d.fullscreenElement || d.webkitFullscreenElement, r;
      if (fe && (fe === v || fe === box || fe.contains(v))) {
        r = (d.exitFullscreen || d.webkitExitFullscreen).call(d);
        if (r && typeof r.catch === "function") r.catch(function () {});
      } else if (v.webkitDisplayingFullscreen && v.webkitExitFullscreen) v.webkitExitFullscreen();
    } catch (e) {}
  }

  /* ---- events ---------------------------------------------------------------------- */
  v.addEventListener("playing", function () {
    flag("data-live", true);
    if (state === "idle" && v.getAttribute("src") === LOOP) set("loop");
  });
  v.addEventListener("ended", function () { if (state === "full") finish(); });
  v.addEventListener("error", function () {
    var src = v.getAttribute("src");
    if (!src) return;
    if (state === "full" && src === FULL) fail();
    else if (src === LOOP) dropPreview();
  });

  bPlay.addEventListener("click", watchFull);
  if (bSound) bSound.addEventListener("click", watchFull);

  if (bPause) {
    var tPause = bPause.querySelector(".t-pause"), tPlay = bPause.querySelector(".t-play");
    bPause.addEventListener("click", function () {
      held = !held;
      flag("data-held", held);
      if (tPause) tPause.hidden = held;
      if (tPlay) tPlay.hidden = !held;
      if (held) { gen++; v.pause(); } else startPreview(true);
    });
  }

  if (LOOP && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      var e = es[es.length - 1];
      visible = e.isIntersecting && e.intersectionRatio >= 0.5;
      if (visible) startPreview(); else stopPreview();
    }, { threshold: [0, 0.5] }).observe(box);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopPreview(); else startPreview();
  });

  /* the OS motion setting can change mid-visit */
  function onMotionPref() {
    if (state === "full") return;
    if (rm.matches) { if (state === "loop" || !v.paused) calmPreview(); }
    else startPreview();
  }
  if (rm) { if (rm.addEventListener) rm.addEventListener("change", onMotionPref); else if (rm.addListener) rm.addListener(onMotionPref); }

  set("idle");
})();

}catch(error){console.error("BS98 block initialization",error);if(window.__rvDrop)window.__rvDrop();}

}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();})();

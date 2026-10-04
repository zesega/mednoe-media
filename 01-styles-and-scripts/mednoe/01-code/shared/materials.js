(function(){function start(){if(window.__bs98Started)return;window.__bs98Started=true;document.documentElement.id='bs98-tilda';document.documentElement.lang='ru';document.documentElement.dataset.lang='ru';
try{
(function(){/* background video — decorative, so nothing downloads until the page (fonts,
       form, Turnstile) has loaded; under prefers-reduced-motion it never starts
       and the poster still stays. */
    var v=document.getElementById('bgv'),rm=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):null;
    function bgPlay(){if(!v||(rm&&rm.matches))return;if(!v.getAttribute('src')&&v.dataset.src){var lite=v.dataset.srcMobile&&window.matchMedia&&(matchMedia('(max-width: 900px)').matches||matchMedia('(pointer: coarse)').matches);v.src=lite?v.dataset.srcMobile:v.dataset.src;} /* phones/tablets: lighter 720p encode of the same clip */ v.muted=true;var pr=v.play();if(pr&&pr.catch)pr.catch(function(){});}
    if(v){
      if(document.readyState==='complete')bgPlay();else window.addEventListener('load',bgPlay,{once:true});
      if(rm){var onRm=function(){if(rm.matches){if(!v.paused)v.pause();}else if(document.readyState==='complete')bgPlay();};if(rm.addEventListener)rm.addEventListener('change',onRm);else if(rm.addListener)rm.addListener(onRm);}
    }

    })();
}catch(error){console.error("BS98 block initialization",error);if(window.__rvDrop)window.__rvDrop();}

}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();})();

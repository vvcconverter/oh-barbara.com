(()=>{const t="https://oh-barbara.com",e="STREAMER. MODEL. NIGHT OWL.",n="Just Chatting, IRL и lifestyle с Пхукета",o="oh_barbara — Streamer & Model",a="Ох_Барбара — стример и модель. Lifestyle & fashion из Пхукета. Twitch, Instagram, Telegram.",i=document.getElementById("year");i&&(i.textContent=String((new Date).getFullYear()));const r=document.getElementById("jellyfish-field");if(r){const t='\n      <svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\n        <ellipse cx="32" cy="22" rx="18" ry="14" fill="rgba(215,240,234,0.55)"/>\n        <path d="M18 28c2 10 4 22 5 34M26 30c1 12 2 24 2 34M32 31c0 12 0 24 0 34M38 30c-1 12-2 24-2 34M46 28c-2 10-4 22-5 34"\n          stroke="rgba(215,240,234,0.45)" stroke-width="1.4" stroke-linecap="round"/>\n        <ellipse cx="26" cy="18" rx="3" ry="2" fill="rgba(126,184,173,0.7)"/>\n        <ellipse cx="38" cy="20" rx="2.5" ry="1.8" fill="rgba(126,184,173,0.55)"/>\n      </svg>',e=window.matchMedia("(max-width: 700px)").matches?4:7;for(let n=0;n<e;n+=1){const e=document.createElement("div");e.className="jelly",e.style.setProperty("--size",48+70*Math.random()+"px"),e.style.setProperty("--dur",10+10*Math.random()+"s"),e.style.setProperty("--delay",8*-Math.random()+"s"),e.style.left=8+84*Math.random()+"%",e.style.top=10+75*Math.random()+"%",e.innerHTML=t,r.appendChild(e)}}document.querySelectorAll(".reveal").forEach((t=>t.classList.add("is-in")));const c=location.hostname||"localhost",l=["localhost","127.0.0.1","oh-barbara.com","www.oh-barbara.com"];-1===l.indexOf(c)&&l.push(c);const s="oh_barbara";function d(t){if(!t||!window.Twitch||!Twitch.Embed)return;const e=Math.max(400,Math.floor(t.clientWidth||960)),n=Math.max(300,Math.min(620,Math.round(.56*e)+(e>=800?0:320)));new Twitch.Embed("twitch-embed",{width:"100%",height:Math.max(480,Math.min(680,n)),channel:s,layout:"video-with-chat",theme:"dark",muted:!0,autoplay:!0,parent:l})}function u(t){const e=(Array.isArray(t)?t:[]).map((function(t){return(t&&(t.name||t.localizedName||"")).trim()})).filter(Boolean),n=[];return["IRL","Just Chatting","Unboxing","Music","Art","ASMR"].forEach((function(t){const o=e.find((function(e){return e.toLowerCase()===t.toLowerCase()}));o&&-1===n.indexOf(o)&&n.push(o)})),e.forEach((function(t){n.length>=2||-1===n.indexOf(t)&&n.push(t)})),n.slice(0,2)}const m=document.getElementById("twitch-embed");function h(t){return String(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function g(t,e){const n=document.getElementById(t);n&&n.setAttribute("content",e||"")}function p(t,e,n){const o=document.getElementById(t);o&&o.setAttribute(e,n||"")}function f(i){const raw=String(i||"").trim(),r=window.OB_TAGS?OB_TAGS.resolve(i):i;const offtopTag=!!(r&&window.OB_TAGS&&OB_TAGS.bySlug&&OB_TAGS.bySlug[r]&&OB_TAGS.bySlug[r].offtop);if(r==="oh-barbara_offtop"||/^(offtop|blog|news)$/i.test(raw)||offtopTag){const q=/^(blog|news|offtop)$/i.test(raw)?raw.toLowerCase():(r==="oh-barbara_offtop"?"offtop":r);location.replace("offtop.html?id="+encodeURIComponent(q));return;}const c=document.getElementById("ob-title"),l=document.getElementById("ob-lead"),s=document.getElementById("ob-kicker"),d=r&&window.OB_TAGS?OB_TAGS.name(r):"",u=r&&window.OB_TAGS?OB_TAGS.lead(r):n;if(document.querySelectorAll(".hero-tags a, .tag-cloud a, .cat-drop-panel a").forEach((t=>{let e=t.getAttribute("data-tag-slug")||"";try{const n=new URL(t.href,location.href);e||(e=n.searchParams.get("id")||n.searchParams.get("tag")||""),window.OB_TAGS&&(e=OB_TAGS.resolve(e))}catch(t){}t.classList.toggle("on",!!r&&e===r)})),document.querySelectorAll("[data-tags]").forEach((t=>{if(!r||/_about$|_gallery$|_stream$|_clips$|_video$|_tags$|_connect$|_comments$/.test(r))return void t.classList.remove("ob-dim");const e=function(t){return(t.getAttribute("data-tags")||"").split(",").map((t=>t.trim())).filter(Boolean).map((t=>window.OB_TAGS?OB_TAGS.resolve(t):t))}(t);t.classList.toggle("ob-dim",e.length>0&&-1===e.indexOf(r))})),!r){c&&(c.textContent="Oh Barbara"),l&&(l.textContent=n),s&&(s.textContent=e),document.title=o,g("ob-desc",a),g("ob-kw","oh-barbara, oh_barbara, ох-барбара, Ох_Барбара, стример, модель, Twitch, Instagram, Пхукет, Just Chatting, IRL, lifestyle, fashion"),g("ob-og-title",o),g("ob-og-desc",a),g("ob-tw-title",o),g("ob-tw-desc",a),p("ob-canon","href",t+"/"),g("ob-og-url",t+"/");const i=document.getElementById("ob-ld-tagpage");return void(i&&i.remove())}try{const t=new URLSearchParams(location.search);t.get("id")!==r&&(t.set("id",r),t.delete("tag"),t.delete("n"),t.delete("name"),history.replaceState(null,"",location.pathname+"?"+t.toString()+location.hash))}catch(t){}const m=t+"/index.html?id="+encodeURIComponent(r),h=d+" — oh_barbara",f=u;/_(?:about|gallery|stream|clips|video|tags|connect|comments|chat)$/.test(r)||"oh-barbara-pictures"===r?(c&&(c.textContent="Oh Barbara"),l&&(l.textContent=n),s&&(s.textContent=e)):(c&&(c.textContent=d),l&&(l.textContent=u),s&&(s.textContent="Тема · #"+d)),document.title=h,g("ob-desc",f),g("ob-kw",[d,"oh-barbara","oh_barbara","ох-барбара","Ох_Барбара","стример","модель"].join(", ")),g("ob-og-title",h),g("ob-og-desc",f),g("ob-tw-title",h),g("ob-tw-desc",f),p("ob-canon","href",m),g("ob-og-url",m);const b=String(r).match(/_(about|gallery|stream|clips|video|tags|connect|comments|chat)$/),w=b?b[1]:"video-oh-barbara"===r?"video":r,y=document.getElementById(w);y&&requestAnimationFrame((function(){const t=document.querySelector(".site-header"),e=t?t.offsetHeight:72,n="clips"===w?16:10,o=window.scrollY+y.getBoundingClientRect().top-e-n;window.scrollTo({top:Math.max(0,o),behavior:"smooth"})})),function(t,e){let n=document.getElementById(t);n||(n=document.createElement("script"),n.type="application/ld+json",n.id=t,document.head.appendChild(n)),n.textContent=JSON.stringify(e)}("ob-ld-tagpage",{"@context":"https://schema.org","@type":"WebPage","@id":m+"#page",url:m,name:h,headline:d,description:f,inLanguage:"ru-RU",isPartOf:{"@id":t+"/#website"},about:{"@type":"DefinedTerm",name:d,termCode:r,url:m},primaryImageOfPage:{"@type":"ImageObject",url:t+"/assets/profile.png"}})}function b(t){return'<a href="'+h(OB_TAGS.href(t.slug))+'" data-tag-slug="'+h(t.slug)+'">#'+h(t.name)+"</a>"}function w(){const t=function(){try{const t=new URLSearchParams(location.search),e=(t.get("id")||t.get("tag")||t.get("n")||t.get("name")||"").trim();return e?window.OB_TAGS?OB_TAGS.resolve(e):e:""}catch(t){return""}}();(function(){const t=document.getElementById("tagCloud"),e=document.getElementById("ob-hero-tags");if(window.OB_TAGS){if(t){let e='<div class="cat-drops">';Object.keys(OB_TAGS.byCat).forEach((t=>{const n=OB_TAGS.forCategory(t);if(!n.length)return;const o=function(t){return String(t||"").toLowerCase().replace(/ё/g,"е").replace(/[^a-z0-9а-я]+/gi,"-").replace(/^-+|-+$/g,"")}(t);e+='<div class="cat-drop" data-cat="'+h(o)+'"><button type="button" class="cat-drop-btn" aria-expanded="false" aria-controls="ob-cat-'+h(o)+'">'+h(t)+' ▾</button><div class="cat-drop-panel" id="ob-cat-'+h(o)+'" hidden role="listbox" aria-label="'+h(t)+'">',n.forEach((t=>{e+=b(t)})),e+="</div></div>"}));const n=OB_TAGS.all().filter((t=>t.user));n.length&&(e+='<div class="cat-drop" data-cat="extra"><button type="button" class="cat-drop-btn" aria-expanded="false" aria-controls="ob-cat-extra">Ещё ▾</button><div class="cat-drop-panel" id="ob-cat-extra" hidden role="listbox" aria-label="Ещё">',n.forEach((t=>{e+=b(t)})),e+="</div></div>"),e+="</div>",t.innerHTML=e}if(e){let t='<div class="cat-drop hero-drop" data-cat="top"><button type="button" class="cat-drop-btn" aria-expanded="false" aria-controls="ob-cat-top">Топ темы ▾</button><div class="cat-drop-panel" id="ob-cat-top" hidden role="listbox" aria-label="Топ темы">';["twitch-oh-barbara","твич-ох-барбара","instagram-oh-barbara","lifestyle-oh-barbara","fashion-oh-barbara","phuket-oh-barbara","пхукет-ох-барбара","irl-oh-barbara"].forEach((e=>{t+=b({slug:e,name:OB_TAGS.name(e)})})),t+="</div></div>",e.innerHTML=t}}})(),function(){const t=[document.getElementById("tagCloud"),document.getElementById("ob-hero-tags")].filter(Boolean).flatMap((t=>Array.from(t.querySelectorAll(".cat-drop"))));function e(e){t.forEach((t=>{if(e&&t===e)return;const n=t.querySelector(".cat-drop-btn"),o=t.querySelector(".cat-drop-panel");if(!n||!o)return;t.classList.remove("is-open"),o.hidden=!0,n.setAttribute("aria-expanded","false");const a=n.textContent.replace(/[▾▴]\s*$/,"").trim();n.textContent=a+" ▾"}))}t.length&&(t.forEach((t=>{const n=t.querySelector(".cat-drop-btn"),o=t.querySelector(".cat-drop-panel");n&&o&&n.addEventListener("click",(n=>{n.preventDefault(),n.stopPropagation(),function(t,n){const o=t.querySelector(".cat-drop-btn"),a=t.querySelector(".cat-drop-panel");if(!o||!a)return;const i=o.textContent.replace(/[▾▴]\s*$/,"").trim();n&&e(t),t.classList.toggle("is-open",n),a.hidden=!n,o.setAttribute("aria-expanded",n?"true":"false"),o.textContent=i+(n?" ▴":" ▾")}(t,o.hidden)}))})),document.addEventListener("click",(t=>{t.target.closest&&t.target.closest(".cat-drop")||e()})),document.addEventListener("keydown",(t=>{"Escape"===t.key&&e()})))}(),f(t)}function y(){const t=document.getElementById("clips"),e=document.querySelector("#clips iframe[data-src]");if(!e||e.getAttribute("src"))return;const n=()=>{t&&t.classList.add("is-ready"),t&&t.classList.remove("is-loading")};e.addEventListener("load",n,{once:!0}),window.addEventListener("message",(t=>{t&&t.data&&"ob-clips-ready"===t.data.type&&n()})),e.src=e.getAttribute("data-src")}m&&(s,fetch("https://gql.twitch.tv/gql",{method:"POST",headers:{"Client-ID":"kimne78kx3ncx6brgo4mv6wki5h1ko","Content-Type":"application/json"},body:JSON.stringify({query:"query($login:String!){  user(login:$login){    followers{ totalCount }    stream{      id title viewersCount      game{ name }      freeformTags{ name }    }    lastBroadcast{ title game{ name } }  }}",variables:{login:"oh_barbara"}})}).then((function(t){return t.ok?t.json():null})).then((function(t){const e=t&&t.data&&t.data.user;if(!e)return null;const n=e.stream,o=e.lastBroadcast,a=n&&n.game&&n.game.name||o&&o.game&&o.game.name||"";return{live:!!n,title:n&&n.title||"",lastTitle:o&&o.title||"",game:a,tags:u(n&&n.freeformTags),followers:e.followers&&null!=e.followers.totalCount?e.followers.totalCount:null,viewers:n&&null!=n.viewersCount?n.viewersCount:null}})).catch((function(){return null}))).then((function(t){(function(t){const e=document.getElementById("ob-stream-meta"),n=document.querySelector(".stream-note");if(!t)return;const o=[];t.game&&o.push(t.game),(t.tags||[]).forEach((function(t){t&&-1===o.indexOf(t)&&o.push(t)})),null!=t.followers?o.push(function(t){if((t=Math.max(0,Math.round(Number(t)||0)))>=1e6){const e=t/1e6;return(e>=10?Math.round(e):Math.round(10*e)/10)+"M"}if(t>=1e3){const e=t/1e3;return(e>=10?Math.round(e):Math.round(10*e)/10).toString().replace(".",",")+"K"}return String(t)}(t.followers)+" на Twitch"):o.push("Twitch"),e&&o.length&&(e.textContent=o.join(" · ")),n&&(t.live&&t.title?n.textContent="Сейчас в эфире: "+t.title:t.lastTitle?n.textContent="Последний стрим: "+t.lastTitle:t.live||(n.textContent="Канал оффлайн · загляните позже на Twitch"))})(t),window.__obStream={live:!!(t&&t.live),title:(t&&(t.title||t.lastTitle))||""},t&&!1===t.live?function(t){if(!t)return;t.innerHTML='<div class="twitch-offline"><p class="twitch-offline-title">Сейчас оффлайн</p><p class="twitch-offline-text">Стрим oh_barbara не в эфире. Можно открыть плеер и чат здесь.</p><button type="button" class="btn btn-primary" id="ob-open-twitch-embed">Открыть плеер с чатом</button></div>';const e=document.getElementById("ob-open-twitch-embed");e&&e.addEventListener("click",(function(){t.innerHTML="",d(t)}))}(m):d(m)}));try{fetch("data/clips.json",{credentials:"same-origin"}).catch((function(){}))}catch(t){}"complete"===document.readyState?y():window.addEventListener("load",y),window.OB_TAGS&&OB_TAGS.loadUserTags?OB_TAGS.loadUserTags().then(w).catch(w):w()})(),document.addEventListener("DOMContentLoaded",(()=>{!function(){const t=document.querySelector(".pic-grid"),e=document.getElementById("pic-more");if(!t||!e)return;const n=Array.prototype.slice.call(t.querySelectorAll(".pic"));let o=0;const a=document.getElementById("pic-less");function i(){if(n.forEach(((t,e)=>{e<o?t.classList.remove("is-hidden"):t.classList.add("is-hidden")})),o>=n.length)e.hidden=!0;else{e.hidden=!1;const t=n.length-o;e.textContent=t>4?"Ещё":"Ещё ("+t+")"}a&&(a.hidden=!(o>4))}function r(t){if(!(t<0)){for(;o<=t&&o<n.length;)o=Math.min(o+4,n.length);i()}}o=Math.min(4,n.length),i(),t.classList.add("pics-ready"),e.addEventListener("click",(function(){o=Math.min(o+4,n.length),i()})),a&&a.addEventListener("click",(function(){o=Math.min(4,n.length),i();const t=document.getElementById("oh-barbara-pictures");t&&t.scrollIntoView({behavior:"smooth",block:"start"})})),window.__picRevealUntil=r,window.__picRevealId=function(t){const e=n.findIndex((e=>e.id===t));e>=0&&r(e)}}(),function(){const t=document.getElementById("lightbox"),e=document.getElementById("lightbox-img"),n=document.getElementById("lightbox-cap"),o=document.getElementById("lightbox-tags"),a=document.getElementById("lightbox-close"),i=document.getElementById("lightbox-prev"),r=document.getElementById("lightbox-next"),c=document.getElementById("lightbox-track"),l=document.getElementById("lightbox-viewport"),s=document.getElementById("lightbox-carousel"),d=document.querySelector(".pic-grid");if(!(t&&d&&c&&l))return;const u=Array.prototype.slice.call(d.querySelectorAll(".pic"));if(!u.length)return;let m=0,wheelLock=0;function g(){return window.matchMedia("(min-width:769px)").matches}function norm(x){const N=u.length;return((x%N)+N)%N}function centerCurrent(){const cur=c.querySelector(".lightbox-card.is-active");if(!cur||!g())return;const er=cur.getBoundingClientRect(),vr=l.getBoundingClientRect(),dx=er.left+er.width/2-(vr.left+vr.width/2);if(Math.abs(dx)>1)l.scrollBy({left:dx,behavior:"smooth"})}function render(){const N=u.length,p=norm(m-1),q=norm(m),x=norm(m+1),arr=[p,q,x];c.innerHTML="",arr.forEach((idx,pos)=>{const pic=u[idx],img=pic.querySelector("img"),btn=document.createElement("button");btn.type="button";btn.className="lightbox-card"+(pos===1?" is-active":"");btn.dataset.i=String(idx);const im=document.createElement("img");im.src=img?img.currentSrc||img.src:"";im.alt=img&&img.alt||"";im.draggable=!1;btn.appendChild(im);btn.addEventListener("click",(ev)=>{ev.stopPropagation();if(pos===0)prev();else if(pos===2)next();else openByIndex(idx)});c.appendChild(btn)}),updateMeta(),requestAnimationFrame(centerCurrent)}function updateMeta(){const pic=u[m];if(!pic)return;const img=pic.querySelector("img");n&&(n.textContent=img&&(img.title||img.alt)||"");if(o){const tags=(pic.getAttribute("data-tags")||"").split(",").map((x)=>x.trim()).filter(Boolean);o.innerHTML=tags.map((x)=>"<a href=\"index.html?id="+encodeURIComponent(x)+"\">#"+x.replace(/</g,"")+"</a>").join("")}e&&img&&!g()?(e.hidden=!1,e.src=img.currentSrc||img.src,e.alt=img.alt||""):e&&(e.hidden=!0,e.removeAttribute("src"));window.__picRevealUntil&&window.__picRevealUntil(m);const id=pic.id||pic.getAttribute&&pic.getAttribute("id");history.replaceState(null,"",id?"index.html?id="+encodeURIComponent(id):"index.html")}function openByIndex(idx){m=norm(idx),t.hidden=!1,t.classList.toggle("is-carousel",g()),s&&(s.hidden=!1),document.body.style.overflow="hidden",render()}function close(){t.hidden=!0,t.classList.remove("is-carousel"),e&&e.removeAttribute("src"),o&&(o.innerHTML=""),document.body.style.overflow="",history.replaceState(null,"","index.html")}function prev(){m=norm(m-1),render()}function next(){m=norm(m+1),render()}window.__openPicLightbox=function(pic){const idx=u.indexOf(pic);idx>=0&&openByIndex(idx)},window.__closePicLightbox=close,d.addEventListener("click",(ev)=>{const pic=ev.target.closest(".pic");pic&&d.contains(pic)&&(ev.preventDefault(),openByIndex(u.indexOf(pic)))}),a&&a.addEventListener("click",(ev)=>{ev.stopPropagation(),close()}),i&&i.addEventListener("click",(ev)=>{ev.stopPropagation(),prev()}),r&&r.addEventListener("click",(ev)=>{ev.stopPropagation(),next()}),o&&o.addEventListener("click",(ev)=>{ev.stopPropagation()}),s&&s.addEventListener("click",(ev)=>{ev.stopPropagation()}),t.addEventListener("click",(ev)=>{ev.target===t&&close()}),document.addEventListener("keydown",(ev)=>{t.hidden||("Escape"===ev.key&&close(),"ArrowLeft"===ev.key&&prev(),"ArrowRight"===ev.key&&next())}),t.addEventListener("wheel",(ev)=>{if(t.hidden)return;ev.preventDefault();const now=Date.now();if(now-wheelLock<220)return;wheelLock=now;const dlt=Math.abs(ev.deltaY)>=Math.abs(ev.deltaX)?ev.deltaY:ev.deltaX;dlt>0?next():dlt<0&&prev()},{passive:!1}),window.addEventListener("resize",()=>{t.hidden||(t.classList.toggle("is-carousel",g()),updateMeta(),requestAnimationFrame(centerCurrent))})}();const t=new URLSearchParams(location.search),e=(t.get("id")||t.get("tag")||"").trim();e&&function(t){if(!t)return;window.__picRevealId&&window.__picRevealId(t),document.querySelectorAll(".is-active").forEach((t=>t.classList.remove("is-active")));let e=document.getElementById(t)||document.querySelector('[data-tags*="'+t+'"]');if(!e)return;e.classList.add("is-active"),e.classList&&e.classList.contains("pic")?window.__openPicLightbox&&window.__openPicLightbox(e):e.scrollIntoView({behavior:"smooth",block:"center"})}(e)})),
(()=>{const t=document.querySelector(".site-header");if(!t)return;let e=window.scrollY||0,a=false;const n=()=>{const n=window.scrollY||0;if(!a){e=n;return}if(n<=8)t.classList.remove("is-hidden");else if(n>e&&n>64)t.classList.add("is-hidden");e=n};const o=()=>{t.classList.remove("is-hidden");e=window.scrollY||0;setTimeout(()=>{e=window.scrollY||0;a=true},200)};addEventListener("scroll",n,{passive:!0});if(document.readyState==="complete")o();else addEventListener("load",o)})();(()=>{
  const CHANNEL="oh_barbara";
  let resizeTimer=0;
  function parents(){
    const list=["localhost","127.0.0.1","oh-barbara.com","www.oh-barbara.com"];
    const host=location.hostname||"";
    if(host&&list.indexOf(host)===-1)list.push(host);
    return list;
  }
  function isOpen(){
    const strip=document.getElementById("stream-detach");
    return !!(strip&&strip.classList.contains("is-open"));
  }
  function closeDetach(){
    const strip=document.getElementById("stream-detach");
    const body=document.getElementById("stream-detach-body");
    if(!strip)return;
    strip.classList.remove("is-open");
    strip.setAttribute("aria-hidden","true");
    if(body)body.innerHTML="";
  }
  function mountEmbed(){
    if(!isOpen())return;
    if(!window.Twitch||!Twitch.Embed){
      setTimeout(mountEmbed,50);
      return;
    }
    const body=document.getElementById("stream-detach-body");
    if(!body)return;
    body.innerHTML='<div id="ob-detach-embed"></div>';
    const w=Math.max(320, Math.round(body.clientWidth||window.innerWidth||960));
    const h=Math.max(180, Math.round(body.clientHeight||window.innerHeight||540));
    new Twitch.Embed("ob-detach-embed",{width:w,height:h,channel:CHANNEL,layout:"video-with-chat",theme:"dark",muted:!0,autoplay:!0,parent:parents()});
  }
  function openDetach(){
    const strip=document.getElementById("stream-detach");
    const body=document.getElementById("stream-detach-body");
    if(!strip||!body)return;
    body.innerHTML='<div id="ob-detach-embed"></div>';
    strip.classList.add("is-open");
    strip.setAttribute("aria-hidden","false");
    requestAnimationFrame(function(){
      strip.scrollIntoView({behavior:"smooth",block:"start"});
      requestAnimationFrame(mountEmbed);
    });
  }
  function onViewportChange(){
    if(!isOpen())return;
    window.clearTimeout(resizeTimer);
    resizeTimer=window.setTimeout(mountEmbed,120);
  }
  document.addEventListener("DOMContentLoaded",function(){
    const openBtn=document.getElementById("ob-detach-stream");
    const closeBtn=document.getElementById("stream-detach-close");
    if(openBtn)openBtn.addEventListener("click",openDetach);
    if(closeBtn)closeBtn.addEventListener("click",closeDetach);
    window.addEventListener("resize",onViewportChange);
    document.addEventListener("fullscreenchange",onViewportChange);
    document.addEventListener("webkitfullscreenchange",onViewportChange);
    if(window.visualViewport)window.visualViewport.addEventListener("resize",onViewportChange);
  });
(function(){function run(){var el=document.querySelector(".site-header .logo");if(!el||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;el.classList.remove("is-sunlit");void el.offsetWidth;el.classList.add("is-sunlit");el.addEventListener("animationend",function(e){if(e.animationName==="ob-logo-warm")el.classList.remove("is-sunlit")}, {once:true})}if(document.readyState==="complete")setTimeout(run,180);else window.addEventListener("load",function(){setTimeout(run,180)})})();})();
(()=>{
  const bell=document.getElementById("ob-news-bell");
  const badge=document.getElementById("ob-news-bell-count");
  const panel=document.getElementById("ob-news-bell-panel");
  const link=document.getElementById("ob-news-bell-link");
  const meta=document.getElementById("ob-news-bell-meta");
  const text=document.getElementById("ob-news-bell-text");
  if(!bell||!badge||!panel||!link||!meta||!text)return;
  const closeBtn=document.createElement("button");
  closeBtn.type="button";
  closeBtn.className="nav-bell-close";
  closeBtn.setAttribute("aria-label","Закрыть уведомление");
  closeBtn.textContent="×";
  panel.insertBefore(closeBtn,panel.firstChild);
  text.appendChild(link);
  const STORE_KEY="ob_news_viewed_v1";
  const TTL=2592e5;
  let siteLoaded=document.readyState==="complete";
  let clicked=false;
  let queue=[];
  function loadViewed(){try{const raw=localStorage.getItem(STORE_KEY);if(!raw)return{};const parsed=JSON.parse(raw);return parsed&&typeof parsed==="object"?parsed:{}}catch(e){return{}}}
  function saveViewed(v){try{localStorage.setItem(STORE_KEY,JSON.stringify(v))}catch(e){}}
  let viewed=loadViewed();
  function keyOf(p){return String(p&&((p.id||"")+"|"+(p.slug||""))||"").trim()}
  function toDateMs(v){const t=Date.parse(String(v||""));return Number.isFinite(t)?t:0}
  function stripMd(s){return String(s||"").replace(/\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\)/g," ").replace(/!\[[^\]]*\]\([^)]+\)/g," ").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").replace(/[#*_`>~\-]+/g," ").replace(/\s+/g," ").trim()}
  function trimText(s,n){const t=String(s||"");return t.length>n?t.slice(0,n-1)+"…":t}
  function postUrl(p){const id=p&&((p.slug||"").trim()||(p.id||"").trim())||"";return id?"offtop.html?id="+encodeURIComponent(id):"offtop.html"}
  function renderCount(){const c=queue.length;badge.textContent=String(c);badge.hidden=!c;if(c&&siteLoaded&&!clicked)bell.classList.add("is-alerting");else bell.classList.remove("is-alerting")}
  function closePanel(){panel.hidden=true;bell.setAttribute("aria-expanded","false");document.documentElement.classList.remove("ob-bell-open")}
  function openPanel(){panel.hidden=false;bell.setAttribute("aria-expanded","true");document.documentElement.classList.add("ob-bell-open")}
  function writeTextWithArrow(message){
    text.textContent=String(message||"")+" ";
    text.appendChild(link);
  }
  function renderEmpty(){
    link.href="offtop.html";
    link.textContent="➜";
    link.hidden=false;
    meta.textContent="";
    writeTextWithArrow("Новых уведомлений нет.");
  }
  function markViewed(p){const k=keyOf(p);if(!k)return;viewed[k]=Date.now();saveViewed(viewed)}
  function pruneViewed(recent){const keep=Object.create(null);const now=Date.now();recent.forEach(p=>{const k=keyOf(p);if(k)keep[k]=1});Object.keys(viewed).forEach(k=>{const ts=Number(viewed[k]||0);if(!keep[k]||now-ts>TTL)delete viewed[k]});saveViewed(viewed)}
  function showNext(){if(!queue.length){renderEmpty();openPanel();renderCount();return}const p=queue.shift();const created=toDateMs(p.created);const when=created?new Date(created).toLocaleString("ru-RU",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"";link.href=postUrl(p);link.textContent="➜";link.hidden=false;meta.textContent=when?("Опубликовано: "+when):"";writeTextWithArrow(trimText(stripMd(p.body||""),140)||"Новый пост");markViewed(p);openPanel();renderCount()}
  async function loadQueue(){try{const res=await fetch("data/blog.json?t="+Date.now(),{cache:"no-store",credentials:"same-origin"});if(!res.ok)throw new Error("blog load "+res.status);const data=await res.json();const posts=Array.isArray(data&&data.posts)?data.posts:[];const min=Date.now()-TTL;const recent=posts.filter(p=>toDateMs(p&&p.created)>=min).sort((a,b)=>toDateMs(b.created)-toDateMs(a.created));pruneViewed(recent);queue=recent.filter(p=>!viewed[keyOf(p)]);renderCount()}catch(e){queue=[];renderCount()}}
  bell.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();clicked=true;bell.classList.remove("is-alerting");showNext()});
  closeBtn.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();closePanel()});
  document.addEventListener("click",e=>{if(panel.hidden)return;const inside=panel.contains(e.target)||bell.contains(e.target);if(!inside)closePanel()});
  document.addEventListener("keydown",e=>{"Escape"===e.key&&closePanel()});
  if(siteLoaded)loadQueue();else window.addEventListener("load",()=>{siteLoaded=true;loadQueue()},{once:true});
})();
(()=>{
  const comments=document.querySelector(".site-header .nav-comments>a");
  const arrow=document.querySelector(".site-header .nav-blog");
  const bell=document.getElementById("ob-news-bell");
  const twitch=document.querySelector(".site-header .header-cta");
  if(!comments||!arrow||!bell||!twitch)return;
  function shift(el,dx){el.dataset.obDx=String(dx);el.style.translate=dx?dx+"px 0":""}
  function layout(){
    const oldA=Number(arrow.dataset.obDx||0),oldB=Number(bell.dataset.obDx||0);
    const c=comments.getBoundingClientRect(),t=twitch.getBoundingClientRect();
    const a=arrow.getBoundingClientRect(),b=bell.getBoundingClientRect();
    if(!c.width||!t.width){shift(arrow,0);shift(bell,0);return}
    const gap=(t.left-c.right-a.width-b.width)/3;
    if(gap<=0){shift(arrow,0);shift(bell,0);return}
    shift(arrow,Math.round(c.right+gap-(a.left-oldA)));
    shift(bell,Math.round(c.right+gap*2+a.width-(b.left-oldB)));
  }
  window.addEventListener("resize",layout);
  window.addEventListener("load",layout);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layout);
  layout();
})();
window.addEventListener("message",e=>{
  const d=e.data;
  if(!d||d.type!=="ob-clips-height"||!(d.h>0))return;
  const frame=document.getElementById("clips");
  if(!frame)return;
  const cs=getComputedStyle(frame);
  const borders=(parseFloat(cs.borderTopWidth)||0)+(parseFloat(cs.borderBottomWidth)||0);
  frame.style.height=(d.h+10+borders)+"px";
  frame.style.maxHeight="none";
  frame.style.minHeight="0";
});
(()=>{
  const startArrowAnimation=()=>document.documentElement.classList.add("ob-site-loaded");
  if(document.readyState==="complete")startArrowAnimation();
  else window.addEventListener("load",startArrowAnimation,{once:true});
})();


// media: local folder when present, portfolio CDN as fallback
const M=window.MEDIA_BASE||'https://anciusdroid-commits.github.io/media/';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
gsap.registerPlugin(ScrollTrigger);
const lenis=new Lenis({lerp:.1,smoothWheel:true,wheelMultiplier:.9,touchMultiplier:1.4});
lenis.on('scroll',ScrollTrigger.update);
gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{offset:0,duration:1.4,easing:x=>1-Math.pow(1-x,4)});}}));
// lazy videos
const vids=[...document.querySelectorAll('video.lz')];
vids.forEach(v=>{if(v.dataset.poster)v.poster=M+v.dataset.poster;});
const vio=new IntersectionObserver(es=>{es.forEach(e=>{const v=e.target;
  if(e.isIntersecting){if(!v.src){v.src=M+v.dataset.src;} v.play().catch(()=>{});} else if(v.src){v.pause();}
});},{rootMargin:'200px'});
vids.forEach(v=>vio.observe(v));
// reveal
const rio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rio.unobserve(e.target);}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>rio.observe(el));


// ===== Sound: music + SFX from the portfolio's audio kit =====
const A=M+'audio/';
const SND={on:false,music:null,vol:.38,duck:false,last:{}};
function mk(n){const a=new Audio(A+n+'.mp3');a.preload='auto';return a;}
const sfxBank={whoosh:mk('sfx_whoosh'),impact:mk('sfx_impact'),glitch:mk('sfx_glitch'),zap:mk('sfx_zap'),ui:mk('sfx_ui'),riser:mk('sfx_riser')};
function sfx(n,v=.5,gap=250){if(!SND.on)return;const t=performance.now();if(SND.last[n]&&t-SND.last[n]<gap)return;SND.last[n]=t;const a=sfxBank[n].cloneNode();a.volume=v;a.play().catch(()=>{});}
function fade(a,to,ms=600){if(!a)return;const from=a.volume,t0=performance.now();clearInterval(a._f);a._f=setInterval(()=>{const k=Math.min(1,(performance.now()-t0)/ms);a.volume=Math.max(0,Math.min(1,from+(to-from)*k));if(k>=1){clearInterval(a._f);if(to===0)a.pause();}},30);}
function setSound(on){SND.on=on;const b=document.getElementById('snd');b.classList.toggle('on',on);document.getElementById('sndl').textContent=on?'Sound on':'Sound off';
 if(on){if(!SND.music){SND.music=mk('music');SND.music.loop=true;SND.music.volume=0;}if(!SND.duck){SND.music.play().catch(()=>{});fade(SND.music,SND.vol,900);}}
 else if(SND.music)fade(SND.music,0,400);}
document.getElementById('snd').addEventListener('click',()=>{setSound(!SND.on);if(SND.on)sfx('ui',.4);});
// gate
(()=>{const g=document.getElementById('gate'),gt=document.getElementById('gtc');let f=0;const iv=setInterval(()=>{f++;gt.textContent='00:00:'+pad(Math.floor(f/25)%60)+':'+pad(f%25);},40);
 const enter=withSound=>{clearInterval(iv);g.classList.add('off');lenis.start();document.dispatchEvent(new Event('entered'));if(withSound){setSound(true);sfx('riser',.5);setTimeout(()=>sfx('impact',.6),650);}};
 lenis.stop();
 document.getElementById('genter').addEventListener('click',()=>enter(true));
 document.getElementById('gmute').addEventListener('click',()=>enter(false));})();
// section whooshes + UI ticks
const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){sfx('whoosh',.35,900);sio.unobserve(e.target);}}),{threshold:.6});
document.querySelectorAll('section h2').forEach(h=>sio.observe(h));
document.querySelectorAll('nav .links a,.btn,.play').forEach(el=>el.addEventListener('mouseenter',()=>sfx('ui',.25,120)));
document.querySelectorAll('.ba').forEach(el=>el.addEventListener('pointerdown',()=>sfx('glitch',.4,400)));
// duck music while the showreel plays
(()=>{const v=document.getElementById('reelv');v.addEventListener('play',()=>{SND.duck=true;if(SND.music)fade(SND.music,0,500);});
 const back=()=>{SND.duck=false;if(SND.on&&SND.music){SND.music.play().catch(()=>{});fade(SND.music,SND.vol,900);}};v.addEventListener('pause',back);v.addEventListener('ended',back);})();

// showreel
(()=>{const v=document.getElementById('reelv'),c=document.getElementById('cover'),rtc=document.getElementById('rtc');
v.poster=M+'wc26-hero.jpg';let f=0;const tick=setInterval(()=>{f++;rtc.textContent='00:00:'+pad(Math.floor(f/25)%60)+':'+pad(f%25);},40);
c.addEventListener('click',()=>{if(!v.src)v.src=M+'showreel-2026-v5.mp4';v.muted=false;v.volume=1;v.play().catch(()=>{});c.classList.add('off');clearInterval(tick);});
v.addEventListener('pause',()=>{});})();
// HUD timecode
const tc=document.getElementById('tc'),bar=document.getElementById('tcbar'),lab=document.getElementById('tcl');
const secs=[...document.querySelectorAll('[data-tc]')];
function pad(n){return String(n).padStart(2,'0')}
function hud(){const h=document.documentElement,max=h.scrollHeight-innerHeight,p=max>0?scrollY/max:0;
  const f=Math.round(p*300*25);tc.textContent='TC 00:'+pad(Math.floor(f/1500))+':'+pad(Math.floor(f/25)%60)+':'+pad(f%25);
  bar.style.width=(p*100)+'%';let cur=secs[0];secs.forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*.5)cur=s;});lab.textContent=cur.dataset.tc;}
addEventListener('scroll',hud,{passive:true});hud();
// before/after
document.querySelectorAll('.ba').forEach(ba=>{const top=ba.querySelector('.top'),h=ba.querySelector('.h');let drag=false;
  const set=x=>{const r=ba.getBoundingClientRect();let p=Math.min(1,Math.max(0,(x-r.left)/r.width));top.style.clipPath='inset(0 '+((1-p)*100)+'% 0 0)';h.style.left=(p*100)+'%';};
  ba.addEventListener('pointerdown',e=>{drag=true;set(e.clientX);});addEventListener('pointerup',()=>drag=false);
  ba.addEventListener('pointermove',e=>{if(drag||e.pointerType==='mouse')set(e.clientX);});});

// ===== Bet9ja lightning — procedural canvas bolt =====
(()=>{const cv=document.getElementById('zap'),cx=cv.getContext('2d');
if(matchMedia('(prefers-reduced-motion: reduce)').matches){cv.remove();return;}
let W,H,DPR;function rs(){DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cx.setTransform(DPR,0,0,DPR,0,0);}addEventListener('resize',rs);rs();
const mob=()=>W<700;
let state='idle',t0=performance.now(),idleFor=900,strikeFor=1200,tx=0,ty=0,sx=0,paths=[],branches=[],lastGen=0,sparks=[],flash=0,orb=0;
function jag(x1,y1,x2,y2,rough,depth){let pts=[[x1,y1],[x2,y2]];for(let d=0;d<depth;d++){const n=[pts[0]];for(let i=0;i<pts.length-1;i++){const[a,b]=[pts[i],pts[i+1]];const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;const len=Math.hypot(b[0]-a[0],b[1]-a[1]);n.push([mx+(Math.random()-.5)*rough*len,my+(Math.random()-.5)*rough*len*.25]);n.push(b);}pts=n;}return pts;}
function gen(){const r=mob()?.26:.22;paths=[];const strands=mob()?2:3;
 for(let k=0;k<strands;k++)paths.push({p:jag(sx+(Math.random()-.5)*8,-10,tx+(Math.random()-.5)*3,ty,k?r*.75:r,7),w:k?.8:1});
 branches=[];const main=paths[0].p;const nb=Math.random()<.55?(1+Math.floor(Math.random()*2)):0;
 for(let i=0;i<nb;i++){const a=main[Math.floor(main.length*(.25+Math.random()*.55))];const dir=Math.random()<.5?-1:1;const L=40+Math.random()*90;
  branches.push(jag(a[0],a[1],a[0]+dir*L*(.6+Math.random()*.6),a[1]+L*(.5+Math.random()*.7),.35,5));}}
function stroke(pts,w,col,blur,alpha){cx.save();cx.globalAlpha=alpha;cx.strokeStyle=col;cx.lineWidth=w;cx.shadowColor=col;cx.shadowBlur=blur;cx.lineJoin='round';cx.lineCap='round';cx.beginPath();cx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)cx.lineTo(pts[i][0],pts[i][1]);cx.stroke();cx.restore();}
function cut(pts,f){if(f>=1)return pts;const n=Math.max(2,Math.floor(pts.length*f));return pts.slice(0,n);}
function spark(n){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=1+Math.random()*4.5;sparks.push({x:tx,y:ty,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.5,l:1,d:.012+Math.random()*.03,s:.8+Math.random()*1.8});}}
function newStrike(){tx=W*(mob()?.86:.92)+(Math.random()-.5)*16;ty=H*(.52+Math.random()*.16);sx=tx+(Math.random()-.5)*40;strikeFor=900+Math.random()*900;flash=1;gen();spark(mob()?16:30);if(typeof sfx==='function')sfx('zap',.22,800);}
function frame(now){cx.clearRect(0,0,W,H);const el=now-t0;
 if(state==='idle'&&el>idleFor){state='strike';t0=now;newStrike();}
 else if(state==='strike'&&el>strikeFor){state='idle';t0=now;idleFor=1400+Math.random()*2600;}
 if(state==='strike'){const e=now-t0;const grow=Math.min(1,e/90);
  if(now-lastGen>55+Math.random()*40){gen();lastGen=now;if(Math.random()<.35)spark(4);}
  const flick=Math.random()<.12?.35:1;const fade=Math.min(1,(strikeFor-e)/220);const A=flick*fade;
  paths.forEach((P,k)=>{const pts=cut(P.p,grow);
   stroke(pts,(mob()?6:9)*P.w,'rgba(53,208,99,1)',28,.22*A);
   stroke(pts,(mob()?2.2:3)*P.w,'#c8ff3d',16,(k?.55:.95)*A);
   if(!k)stroke(pts,1.2,'#ffffff',6,.9*A);});
  if(grow>=1)branches.forEach(b=>{stroke(b,2,'#c8ff3d',12,.6*A);stroke(b,.8,'#fff',4,.6*A);});
  orb+=(1-orb)*.25;}else orb*=.9;
 // impact orb
 if(orb>.02){const R=(mob()?38:58)*(0.85+Math.random()*.25)*orb;const g=cx.createRadialGradient(tx,ty,0,tx,ty,R);
  g.addColorStop(0,'rgba(255,255,255,'+.95*orb+')');g.addColorStop(.12,'rgba(220,255,120,'+.85*orb+')');g.addColorStop(.4,'rgba(200,255,61,'+.35*orb+')');g.addColorStop(1,'rgba(53,208,99,0)');
  cx.fillStyle=g;cx.beginPath();cx.arc(tx,ty,R,0,Math.PI*2);cx.fill();}
 // sparks
 sparks=sparks.filter(p=>p.l>0);sparks.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.vx*=.98;p.l-=p.d;cx.globalAlpha=Math.max(0,p.l);cx.fillStyle=p.l>.6?'#fff':'#c8ff3d';cx.shadowColor='#c8ff3d';cx.shadowBlur=8;cx.fillRect(p.x,p.y,p.s,p.s);});cx.globalAlpha=1;cx.shadowBlur=0;
 // strike flash
 if(flash>0){cx.fillStyle='rgba(200,255,61,'+flash*.06+')';cx.fillRect(0,0,W,H);flash*=.8;if(flash<.01)flash=0;}
 requestAnimationFrame(frame);}
requestAnimationFrame(frame);})();

// ===== Lightbox: click any thumbnail to play the full video with sound =====
(()=>{const lb=document.getElementById('lb'),v=document.getElementById('lbv'),t=document.getElementById('lbt');
const full=s=>s.startsWith('wall/')?s.replace('wall/','wall-full/'):s.replace('-loop.mp4','.mp4');
document.querySelectorAll('.v916 .f,.tvc .f,.job .f,.wall .f,.clk-final').forEach(f=>{const lz=f.querySelector('video.lz');if(!lz)return;
  f.classList.add('clk');f.setAttribute('role','button');f.setAttribute('tabindex','0');
  const open=()=>{const card=f.closest('.v916,.tvc,.job,.stg');const h=card&&(card.querySelector('h3')||card.querySelector('p'));
    t.textContent=h?h.textContent:'World Cup 2026 · deliverable';
    v.poster=lz.poster||'';v.src=M+(f.dataset.full||full(lz.dataset.src));v.classList.toggle('tall',f.matches('.v916 .f,.wall .f'));
    lb.classList.add('on');lb.setAttribute('aria-hidden','false');lenis.stop();
    SND.duck=true;if(SND.music)fade(SND.music,0,400);v.muted=false;v.volume=1;v.play().catch(()=>{});sfx('ui',.3);};
  f.addEventListener('click',open);f.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});});
const close=()=>{if(!lb.classList.contains('on'))return;lb.classList.remove('on');lb.setAttribute('aria-hidden','true');
  v.pause();v.removeAttribute('src');v.load();lenis.start();
  SND.duck=false;if(SND.on&&SND.music){SND.music.play().catch(()=>{});fade(SND.music,SND.vol,900);}};
lb.addEventListener('click',e=>{if(e.target===lb||e.target.closest('.lbx'))close();});
addEventListener('keydown',e=>{if(e.key==='Escape')close();});
v.addEventListener('ended',close);})();

// ===== PIPELINE: hub diagram + mixer (layout-independent parts) =====
const TOOLS=[['higgsfield','Higgsfield','images'],['kling','Kling','image + video'],['seedance','Seedance','video'],['blender','Blender','motion ref · MCP'],['photoshop','Photoshop','comp · MCP'],['aftereffects','After Effects','comp · MCP'],['premiere','Premiere','edit · MCP'],['elevenlabs','ElevenLabs','VO + SFX · MCP'],['suno','Suno','music']];
(()=>{const L=document.getElementById('hubLines'),N=document.getElementById('hubNodes');if(!L)return;const ns='http://www.w3.org/2000/svg';
  TOOLS.forEach(([k,name,role],i)=>{const a=-Math.PI/2+i*2*Math.PI/TOOLS.length,x=210+168*Math.cos(a),y=210+168*Math.sin(a);
    const l=document.createElementNS(ns,'line');l.setAttribute('x1',210);l.setAttribute('y1',210);l.setAttribute('x2',x);l.setAttribute('y2',y);l.setAttribute('class','hl');l.dataset.t=k;L.appendChild(l);
    const g=document.createElementNS(ns,'g');g.setAttribute('class','hn');g.dataset.t=k;g.setAttribute('transform',`translate(${x} ${y})`);
    g.innerHTML=`<circle r="25"/><text y="4" text-anchor="middle" class="nt">${name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</text><text y="${y>210?44:-34}" text-anchor="middle" class="nl">${name}</text><text y="${y>210?58:-21}" text-anchor="middle" class="nr">${role}</text>`;N.appendChild(g);});
})();
window.pipeActivate=i=>{const st=document.querySelectorAll('.stg');if(!st.length)return;i=Math.max(0,Math.min(st.length-1,i));
  if(window._pipeI===i)return;window._pipeI=i;const s=st[i],tools=s.dataset.tools.split(',');
  st.forEach((e,j)=>e.classList.toggle('on',j===i));
  document.querySelectorAll('.hl,.hn').forEach(e=>e.classList.toggle('on',tools.includes(e.dataset.t)));
  document.querySelector('.hub').classList.add('live');
  document.getElementById('hubStage').textContent=s.querySelector('.sn').textContent;
  const used=TOOLS.filter(t=>tools.includes(t[0])).map(t=>t[1]);
  document.getElementById('hubWhat').textContent='Claude → '+(used.length?used.join(' · '):'plan, script, prompts');
  document.querySelectorAll('#pdots li').forEach((e,j)=>{e.classList.toggle('on',j===i);e.classList.toggle('done',j<i);});
  if(typeof sfx==='function')sfx('ui',.18,200);};
// mixer: final cut (muted) + the three real stems, with faders and live meters
(()=>{const btn=document.getElementById('mxPlay');if(!btn)return;const box=document.getElementById('mixer'),vid=box.querySelector('video');
  let ctx,st={},raf,playing=false;
  const init=()=>{ctx=new (window.AudioContext||window.webkitAudioContext)();
    ['vo','sfx','music'].forEach(k=>{const a=new Audio(M+'pipe/stem-'+k+'.mp3');a.preload='auto';const src=ctx.createMediaElementSource(a),g=ctx.createGain(),an=ctx.createAnalyser();an.fftSize=256;
      src.connect(g).connect(an).connect(ctx.destination);st[k]={a,g,an,buf:new Uint8Array(an.frequencyBinCount),m:box.querySelector(`[data-m="${k}"]`)};
      const r=box.querySelector(`[data-stem="${k}"]`);g.gain.value=r.value/100;r.addEventListener('input',()=>g.gain.value=r.value/100);});};
  const meter=()=>{Object.values(st).forEach(s=>{s.an.getByteTimeDomainData(s.buf);let p=0;for(const v of s.buf)p=Math.max(p,Math.abs(v-128));s.m.style.setProperty('--l',Math.min(1,p/90));});raf=requestAnimationFrame(meter);};
  const stop=()=>{playing=false;Object.values(st).forEach(s=>s.a.pause());vid.pause();cancelAnimationFrame(raf);btn.textContent='▶ Play with stems';box.classList.remove('on');
    Object.values(st).forEach(s=>s.m.style.setProperty('--l',0));SND.duck=false;if(SND.on&&SND.music){SND.music.play().catch(()=>{});fade(SND.music,SND.vol,900);}};
  btn.addEventListener('click',()=>{if(!ctx)init();if(playing)return stop();ctx.resume();playing=true;
    if(!vid.src)vid.src=M+vid.dataset.src;vid.currentTime=0;vid.play().catch(()=>{});
    Object.values(st).forEach(s=>{s.a.currentTime=0;s.a.play().catch(()=>{});});
    st.vo.a.onended=stop;btn.textContent='■ Stop';box.classList.add('on');meter();
    SND.duck=true;if(SND.music)fade(SND.music,0,400);});
})();

// ===== SCROLL CHOREOGRAPHY v2 (GSAP + ScrollTrigger) =====
// Rules: Lenis already smooths the wheel, so scrubs are direct (scrub:true) to avoid
// double easing; GSAP owns every element it animates (no CSS .rv on the same node);
// layout is re-measured once fonts load so pins start in the right place.
(()=>{if(RM){document.querySelectorAll('.split .ln>span').forEach(e=>e.style.transform='none');return;}
const E='expo.out';
ScrollTrigger.config({ignoreMobileResize:true});
document.querySelectorAll('.kpi,.job,.ph2,.q,.ceil,#player,.strip,.wall,.htrack .tvc,.stg').forEach(e=>{e.classList.remove('rv');e.classList.add('in');});
// hero intro after the gate
gsap.set('.hero .ln>span',{yPercent:115});
gsap.set(['.hero .who','.hero .mono','.hero .lead','.hero .stats'],{opacity:0,y:30});
document.addEventListener('entered',()=>{
  const tl=gsap.timeline({delay:.15});
  tl.to('.hero .ln>span',{yPercent:0,duration:1.3,ease:E,stagger:.14})
    .to(['.hero .who','.hero .mono','.hero .lead','.hero .stats'],{opacity:1,y:0,duration:1,ease:E,stagger:.1},'-=.9');
  document.querySelectorAll('.hero [data-count]').forEach(el=>{const to=+el.dataset.count,o={v:0};
    gsap.to(o,{v:to,duration:1.6,delay:.9,ease:'power2.out',onUpdate:()=>el.textContent=Math.round(o.v)});});
},{once:true});
// hero: content drifts up and fades, video pushes in
gsap.to('.hero .wrap',{yPercent:-14,opacity:0,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
gsap.fromTo('.hero > video',{scale:1},{scale:1.15,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
// section headings: line-by-line mask reveal (plays once, not scrubbed)
document.querySelectorAll('section h2.split').forEach(h=>{
  gsap.from(h.querySelectorAll('.ln>span'),{yPercent:115,duration:1.1,ease:E,stagger:.1,scrollTrigger:{trigger:h,start:'top 85%',once:true}});});
// reel: the frame opens up like a gate as it reaches the middle of the screen
gsap.fromTo('#player',{clipPath:'inset(14% 12% 14% 12% round 28px)',scale:.96},{clipPath:'inset(0% 0% 0% 0% round 16px)',scale:1,ease:'none',
  scrollTrigger:{trigger:'#player',start:'top 92%',end:'center 55%',scrub:true}});
// ONE SEAT mask: pinned, text zooms out of the video
const mtl=gsap.timeline({scrollTrigger:{trigger:'#mask1',start:'top top',end:'+=120%',pin:true,scrub:true,anticipatePin:1}});
mtl.fromTo('#mask1 .mask-txt',{scale:3.2},{scale:1,ease:'power2.inOut'})
   .fromTo('#mask1 video',{scale:1.25},{scale:1,ease:'none'},0)
   .fromTo('#mask1 .mask-cap',{opacity:0,y:20},{opacity:1,y:0},'-=.2');
// KPI cards: one staggered entrance per row
gsap.set('.kpi',{y:80,opacity:0});
ScrollTrigger.batch('.kpi',{start:'top 86%',once:true,onEnter:b=>gsap.to(b,{y:0,opacity:1,duration:1,ease:E,stagger:.12,overwrite:true})});
const mm=gsap.matchMedia();
// short-form: one pinned horizontal reel of every vertical, grouped (desktop)
mm.add('(min-width: 900px)',()=>{
  const wrap=document.querySelector('.shwrap'),track=document.querySelector('.shtrack'),bar=document.getElementById('shprog'),cnt=document.getElementById('shcount');if(!wrap)return;
  const total=track.querySelectorAll('.v916').length,dist=()=>track.scrollWidth-wrap.clientWidth;
  const tw=gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:wrap,start:'top 10%',end:()=>'+='+dist()*0.6,pin:true,scrub:true,invalidateOnRefresh:true,anticipatePin:1,
    onUpdate:self=>{bar.style.width=(Math.max(.03,self.progress)*100)+'%';cnt.textContent=String(Math.max(1,Math.round(self.progress*total))).padStart(2,'0')+' / '+total;}}});
  track.querySelectorAll('.v916').forEach(c=>gsap.fromTo(c,{y:40,opacity:.25,scale:.94},{y:0,opacity:1,scale:1,ease:'power2.out',
    scrollTrigger:{trigger:c,containerAnimation:tw,start:'left 98%',end:'left 70%',scrub:true}}));
});
// TVC horizontal timeline (desktop): pinned, snaps to each film, inner video parallax
mm.add('(min-width: 900px)',()=>{
  const track=document.querySelector('.htrack'),wrap=document.querySelector('.hwrap'),cnt=document.getElementById('hcount'),bar=document.getElementById('hprog');
  const n=track.children.length,dist=()=>track.scrollWidth-wrap.clientWidth;
  const tw=gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:wrap,start:'top 12%',end:()=>'+='+dist(),pin:true,scrub:true,invalidateOnRefresh:true,anticipatePin:1,
    onUpdate:self=>{const i=Math.round(self.progress*(n-1))+1;cnt.textContent=String(i).padStart(2,'0')+' / '+String(n).padStart(2,'0');bar.style.width=((i/n)*100)+'%';
      if(Math.abs(self.getVelocity())>900&&typeof sfx==='function')sfx('whoosh',.18,700);}}});
  track.querySelectorAll('.tvc').forEach(c=>{const v=c.querySelector('video');if(!v)return;
    gsap.fromTo(v,{xPercent:-5,scale:1.12},{xPercent:5,scale:1.12,ease:'none',scrollTrigger:{trigger:c,containerAnimation:tw,start:'left right',end:'right left',scrub:true}});});
});
// pipeline: pinned, stage cards slide past the hub; hub lights the tools each stage uses
mm.add('(min-width: 900px)',()=>{
  const wrap=document.querySelector('.pwrap'),track=document.querySelector('.ptrack'),view=document.querySelector('.pview');if(!wrap)return;
  const st=track.querySelectorAll('.stg'),n=st.length,dist=()=>track.scrollWidth-view.clientWidth;
  gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:wrap,start:'top top',end:()=>'+='+(dist()*1.15),pin:true,scrub:true,invalidateOnRefresh:true,anticipatePin:1,
    onEnter:()=>pipeActivate(0),onEnterBack:()=>{},
    onUpdate:self=>{document.getElementById('pprog').style.width=(self.progress*100)+'%';pipeActivate(Math.round(self.progress*(n-1)));}}});
  // hub breathes in as the section arrives
  gsap.from('.hub svg',{scale:.8,opacity:0,rotate:-20,ease:'power2.out',scrollTrigger:{trigger:wrap,start:'top 85%',end:'top 20%',scrub:true}});
});
mm.add('(max-width: 899px)',()=>{const st=[...document.querySelectorAll('.stg')];
  st.forEach((s,i)=>ScrollTrigger.create({trigger:s,start:'top 60%',end:'bottom 40%',onToggle:e=>{if(e.isActive)pipeActivate(i);}}));});
// wall of deliverables: tiles stand up in perspective
gsap.from('.wall .f',{rotateX:-70,y:60,opacity:0,ease:'power2.out',stagger:.05,scrollTrigger:{trigger:'.wall',start:'top 90%',end:'center 55%',scrub:true}});
// cards: batched so each row comes in together, media wipes open
gsap.set('.job,.ph2,.q,.ceil > div',{y:70,opacity:0});
ScrollTrigger.batch('.job,.ph2,.q,.ceil > div',{start:'top 88%',once:true,onEnter:b=>gsap.to(b,{y:0,opacity:1,duration:1,ease:E,stagger:.1,overwrite:true})});
gsap.utils.toArray('.job .f,.job .ph').forEach(el=>gsap.fromTo(el,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:1.2,ease:'power3.inOut',scrollTrigger:{trigger:el,start:'top 85%',once:true}}));
// before/after: handle sweeps to the middle as it scrolls in
gsap.utils.toArray('.ba:not(.img)').forEach(el=>{const top=el.querySelector('.top'),h=el.querySelector('.h');
  gsap.timeline({scrollTrigger:{trigger:el,start:'top 80%',end:'center 55%',scrub:true}})
    .fromTo(top,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 50% 0 0)',ease:'power2.out'},0)
    .fromTo(h,{left:'0%'},{left:'50%',ease:'power2.out'},0);});
// footer mask
gsap.fromTo('.fmask .mask-txt',{scale:1.9},{scale:1,ease:'none',scrollTrigger:{trigger:'footer',start:'top bottom',end:'top 15%',scrub:true}});
// re-measure once webfonts and media boxes have settled
document.fonts&&document.fonts.ready.then(()=>ScrollTrigger.refresh());
addEventListener('load',()=>ScrollTrigger.refresh());
})();

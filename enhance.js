/* CyphrWeb enhance layer */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const WA='https://chat.whatsapp.com/FMRIkeHuOK45pKjLTabjZZ';

// scroll progress
const bar=document.createElement('div');bar.className='progress';document.body.prepend(bar);
const onScroll=()=>{const h=document.documentElement;bar.style.transform=`scaleX(${h.scrollTop/(h.scrollHeight-h.clientHeight||1)})`};
addEventListener('scroll',onScroll,{passive:true});onScroll();

// hero spotlight + card glow
const hero=$('.hero');
hero&&hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--mx',(e.clientX-r.left)+'px');hero.style.setProperty('--my',(e.clientY-r.top)+'px')});
document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.card');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--cx',(e.clientX-r.left)+'px');c.style.setProperty('--cy',(e.clientY-r.top)+'px')});

// clickable hero network
const TIPS={Students:'Learn, meet builders, join events and internships.',Founders:'Get validation, a team, mentors and a launch path.',Developers:'Join real products and find co-founders to build with.',Experts:'Mentor early startups and share what you know.',Marketers:'Take a startup from first users to real growth.',Investors:'Meet early startups that are already building.',CyphrWeb:'The place where all of them connect.'};
const svg=$('.node-graph');
if(svg){const tip=document.createElement('div');tip.className='node-tip';tip.setAttribute('aria-live','polite');tip.innerHTML='<b>Tap a dot</b> to see what each person gets.';svg.parentElement.appendChild(tip);
 $$('.node',svg).forEach(n=>{const k=n.dataset.label;const show=()=>{$$('.node',svg).forEach(x=>x.classList.remove('is-on'));n.classList.add('is-on');tip.innerHTML=`<b>${k}</b> — ${TIPS[k]||''}`};n.addEventListener('click',show);n.addEventListener('mouseenter',show)});
 const v=$('.hero__visual');if(v)v.removeAttribute('aria-hidden')}

// "How it works" role picker
const ROLES=[
 {k:'I\'m a student',t:'Start with zero idea',d:'Learn by being around people who build.',s:['Join the community','Explore real problems','Find a team to work with'],g:['Peers & mentors','Events & internships','Hands-on projects'],c:'Join the Community',h:WA},
 {k:'I have an idea',t:'Test it before you build it',d:'Find out if people actually want it.',s:['Share your idea','Get expert feedback','Meet your co-founder'],g:['Validation','Expert guidance','Co-founder matching'],c:'Apply with your idea',h:'#apply'},
 {k:'I need a team',t:'Find the right people',d:'Say what you need. We help you meet them.',s:['Post what you\'re looking for','See who has those skills','Start building together'],g:['Developers','Marketers','Designers'],c:'Find a team',h:'#find-team'},
 {k:'I\'m building an MVP',t:'Launch and grow it',d:'We partner with you, not just advise.',s:['Share your progress','Plan launch & traction','Reach investors & users'],g:['Launch support','Growth help','Investor network'],c:'Build with CyphrWeb',h:'#apply'},
 {k:'I\'m an expert or investor',t:'Back early builders',d:'Meet startups that are already moving.',s:['Join our network','Meet vetted startups','Mentor or invest'],g:['Startup directory','Direct intros','Community events'],c:'Meet the network',h:'#investors'}];
const hs=$('#top');
if(hs){const sec=document.createElement('section');sec.className='section how';sec.id='how';
 sec.innerHTML=`<div class="container"><div class="section__head"><h2>What can CyphrWeb do for you?</h2><p class="section__lede">Pick what describes you. See your path in 10 seconds.</p></div><div class="how__roles" role="tablist" aria-label="Choose your role"></div><div class="how__panel" role="tabpanel" aria-live="polite"></div></div>`;
 hs.after(sec);const rl=$('.how__roles',sec),pn=$('.how__panel',sec);
 const draw=i=>{const r=ROLES[i];$$('.how__role',rl).forEach((b,j)=>b.setAttribute('aria-selected',j===i));
  pn.innerHTML=`<div><h3>${r.t}</h3><p>${r.d}</p><ol class="how__steps">${r.s.map((x,j)=>`<li style="--i:${j}" data-n="${j+1}">${x}</li>`).join('')}</ol></div><div class="how__get">${r.g.map(x=>`<span>${x}</span>`).join('')}<a class="btn btn--primary" href="${r.h}" ${r.h[0]!=='#'?'target="_blank" rel="noopener"':''}>${r.c}</a></div>`};
 ROLES.forEach((r,i)=>{const b=document.createElement('button');b.type='button';b.className='how__role';b.setAttribute('role','tab');b.textContent=r.k;b.onclick=()=>draw(i);rl.appendChild(b)});draw(0)}

// clickable journey
const J={Discover:'Explore problems worth solving. No idea needed.',Validate:'Talk to real users. Check if the problem is real.',Build:'Turn the idea into a working MVP with a team.',Launch:'Put it in front of first users and learn fast.',Grow:'Improve with feedback. Build real traction.',Scale:'Bring in funding, partners and a bigger team.'};
const steps=$$('.journey__step');
if(steps.length){const box=document.createElement('div');box.className='journey-detail';$('.journey').after(box);
 const pick=s=>{steps.forEach(x=>x.classList.remove('is-on'));s.classList.add('is-on');const l=$('.journey__label',s).textContent;box.innerHTML=`<b>${l}</b><span>${J[l]||''}</span>`};
 steps.forEach(s=>{s.tabIndex=0;s.setAttribute('role','button');s.onclick=()=>pick(s);s.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(s)}}});pick(steps[0])}
})();

(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
window.UI={reduce,
  tour(sec,cb){
    const steps=[...sec.querySelectorAll('.step')],box=sec.querySelector('.dots');
    if(box)steps.forEach((el,i)=>{const b=document.createElement('button');b.setAttribute('aria-label','Step '+(i+1));b.addEventListener('click',()=>el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'}));box.appendChild(b)});
    let cur=-1;
    const go=i=>{if(i===cur)return;cur=i;sec.dataset.s=i;if(box)[...box.children].forEach((d,k)=>d.setAttribute('aria-current',k===i));cb(i)};
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)go(steps.indexOf(e.target))}),{rootMargin:'-48% 0px -48% 0px'});
    steps.forEach(e=>io.observe(e));go(0);return {go};
  },
  pos(sec,hero){const st=[...sec.querySelectorAll('.step')],m=innerHeight/2;const c=st.map(e=>{const r=e.getBoundingClientRect();return r.top+r.height/2});
    if(hero)c[0]=sec.getBoundingClientRect().top+m;
    if(m<=c[0])return 0;for(let i=0;i<c.length-1;i++)if(m<c[i+1])return i+(m-c[i])/(c[i+1]-c[i]);return c.length-1},
  kf(a,u){const n=a.length-1,k=Math.max(0,Math.min(n-1,Math.floor(u))),f=Math.max(0,Math.min(1,u-k));let t=Math.max(0,Math.min(1,(f-.2)/.6));t=t*t*(3-2*t);
    const A=a[k],B=a[k+1]||A,o={};for(const key in A){const x=A[key],y=B[key];o[key]=Array.isArray(x)?x.map((v,i)=>v+(y[i]-v)*t):x+(y-x)*t}return o},
  prog(sec){const r=sec.getBoundingClientRect();return Math.min(1,Math.max(0,-r.top/Math.max(1,r.height-innerHeight)))},
  lazy(el,fn,m){const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();fn()}},{rootMargin:m||'800px'});io.observe(el)}
};
const f=document.getElementById('f');
if(f)f.addEventListener('submit',e=>{
  e.preventDefault();const v=id=>document.getElementById(id).value.trim();
  const body='Name: '+v('fn')+'\nCompany or farm: '+v('fo')+'\nCountry: '+v('fc')+'\nInterested in: '+v('fi')+'\n\n'+v('fm');
  const url='https://github.com/akaththi-labs/akaththi-labs/issues/new?title='+encodeURIComponent('Enquiry: '+v('fi'))+'&body='+encodeURIComponent(body);
  const n=document.getElementById('note');n.textContent='Opening a GitHub issue with your enquiry. It will be public.';
  window.open(url,'_blank','noopener');
});
})();

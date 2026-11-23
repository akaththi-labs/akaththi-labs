(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const op=(sel,v)=>{const e=$(sel);if(e){e.style.transition='opacity .5s';e.style.opacity=v}};
const c=AKStack.build($('#stackSvg'));c.grow(true);
function show(k){$$('[data-sc]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.sc===k));const r=c.show(k);$('#scT').textContent=r.t;$('#scD').textContent=r.d;$('#scL').innerHTML=r.keep.map(x=>'<li>'+x+'</li>').join('')}
$$('[data-sc]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.sc)));show('ok');
$$('[data-pc]').forEach(b=>b.addEventListener('click',()=>{$$('[data-pc]').forEach(x=>x.setAttribute('aria-pressed',x===b));c.pcs(+b.dataset.pc)}));
const b=AKStack.build($('#stackSvgB'));b.pulse(true);
function sy(m){$$('[data-sy]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.sy===m));const off=m==='off';op('#cut',off?1:0);op('#up',off?.2:1);op('#q',off?1:0);$('#syt').textContent=off?'Everything is stored on-site while the internet is down.':'Back online. Stored readings sync to the cloud.'}
$$('[data-sy]').forEach(x=>x.addEventListener('click',()=>sy(x.dataset.sy)));sy('off');
const ib=$('[data-inst]');if(ib)ib.addEventListener('click',()=>{const r=ib.closest('.crop');r.classList.add('ing');ib.disabled=true;ib.textContent='Adding pack';const u=r.querySelector('.bar u');requestAnimationFrame(()=>u.style.width='100%');setTimeout(()=>{ib.textContent='Added';ib.className='btn done';r.querySelector('span').textContent='Pack installed by update. No new hardware.';r.querySelector('.bar').style.display='none'},1500)});
const arT={1:'One POD, with a Kaani stack beside it. Control stays inside the POD.',2:'A micro farm: many PODs on one site share a single Kaani stack.',3:'A distributed farm: every site keeps running on its own, and Kaani cloud shows them all in one place.'};
function ar(m){$$('[data-ar]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.ar==m));[1,2,3].forEach(n=>{const g=$('#a'+n);g.style.transition='opacity .5s';g.style.opacity=n==m?1:0});$('#art').textContent=arT[m]}
$$('[data-ar]').forEach(x=>x.addEventListener('click',()=>ar(x.dataset.ar)));
})();

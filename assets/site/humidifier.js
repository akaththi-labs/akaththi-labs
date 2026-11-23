(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
if(AK.ok){
  const {T,makeStage,lights,buildHum}=AK;const V=(x,y,z)=>new T.Vector3(x,y,z);
  const s=makeStage($('#cvH2'),{th:.7,ph:1.25,r:9,fov:30,target:V(0,1,0)});s.orbit.sm=.02;
  lights(s.scene,{sb:6,sky:0xffffff,gnd:0xb9beb4,hemi:.95,key:1,fill:.5,fillc:0xffffff});
  const h=buildHum();s.scene.add(h);const g=new T.Mesh(new T.PlaneGeometry(40,40),new T.ShadowMaterial({opacity:.15}));g.rotation.x=-Math.PI/2;g.receiveShadow=true;s.scene.add(g);
  const KF=[{th:.7,ph:1.25,r:9,t:[0,1,0],o:0,f:0,d:0},{th:.35,ph:.9,r:6.2,t:[-1.3,1.4,0],o:1,f:0,d:0},{th:.95,ph:1.2,r:7.2,t:[0,1,0],o:0,f:0,d:0},{th:-1.25,ph:1.25,r:6.2,t:[-1.5,.8,0],o:0,f:1,d:0},{th:.15,ph:1.3,r:5.6,t:[.8,1.4,0],o:0,f:0,d:0},{th:.9,ph:1.15,r:11,t:[0,1.8,.3],o:0,f:0,d:1},{th:1.55,ph:1.3,r:7.4,t:[0,.9,0],o:0,f:0,d:0},{th:Math.PI+.35,ph:1.25,r:6.6,t:[0,1,0],o:0,f:0,d:0}];
  const sec=$('#humTour');s.orbit.sm=.0001;UI.tour(sec,()=>{});
  let last=performance.now();(function f(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(s.visible){const k=UI.kf(KF,UI.pos(sec,true)),o=s.orbit;o.touched=true;o.tth=k.th;o.tph=k.ph;o.tr=k.r;o.ttarget.set(k.t[0],k.t[1],k.t[2]);h.userData.set({lid:k.o,filt:k.f,duct:k.d>.5?1+Math.floor(now/2400)%3:0});o.update(dt,s.cam);s.renderer.render(s.scene,s.cam)}requestAnimationFrame(f)})(last);
}
function ro(m){$$('[data-ro]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ro===m));const own=m==='have',g=$('#ro');
  g.style.transition='opacity .5s';g.querySelectorAll('rect[stroke="currentColor"]').forEach(r=>r.style.stroke=own?'#56625a':'');
  $('#rob').setAttribute('stroke',own?'#56625a':'#3a78c2');$('#rot').textContent=own?'Your RO':'Akaththi RO stack';
  $('#rotn').textContent=own?'Connect your existing RO output straight to the humidifier inlet.':'Our three stage RO stack sits between the mains and the humidifier.'}
$$('[data-ro]').forEach(b=>b.addEventListener('click',()=>ro(b.dataset.ro)));ro('add');
})();

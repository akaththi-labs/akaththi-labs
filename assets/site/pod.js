(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const press=(attr,v)=>$$('['+attr+']').forEach(b=>b.setAttribute('aria-pressed',b.getAttribute(attr)===v));
/* ===== POD tour: real model, scrubbed by scroll ===== */
const sec=$('#podTour');
if(sec){
  UI.tour(sec,()=>{});
  if(AK.ok){
  const {T,makeStage,lights,buildPod,M,bx,cyl}=AK;const V=(x,y,z)=>new T.Vector3(x,y,z);
  let S=null;
  UI.lazy(sec,()=>{
    const s=makeStage($('#cvPT'),{th:.3,ph:1.18,r:34,target:V(0,5.2,0)});s.orbit.sm=.0001;
    lights(s.scene,{sb:20,sky:0xffffff,gnd:0xc4cac2,hemi:.45,key:1.05,fill:.2,fillc:0xffffff});
    const pod=buildPod(s,'#vwPT');pod.dimsOn=false;
    const grid=new T.GridHelper(400,100,0xcfd5cc,0xe1e5de);grid.position.y=.02;grid.visible=false;s.scene.add(grid);
    /* airflow */
    const air=new T.Group();s.scene.add(air);
    const loops=[-2.6,2.6].map(z=>new T.CatmullRomCurve3([[-3.7,8.1],[0,8.35],[3.7,8.1],[4.1,4.6],[3.7,1.3],[0,1],[-3.7,1.3],[-4.1,4.6]].map(p=>V(p[0],p[1],z)),true));
    loops.forEach((c,i)=>air.add(new T.Mesh(new T.TubeGeometry(c,80,.05,5,true),new T.MeshBasicMaterial({color:0x3a78c2,transparent:true,opacity:.28}))));
    const AN=34,aIM=new T.InstancedMesh(new T.SphereGeometry(.13,8,6),new T.MeshBasicMaterial({color:0xffffff}),AN*2);aIM.frustumCulled=false;air.add(aIM);
    const cB=new T.Color(0x3a78c2),cG=new T.Color(0x2d45e3);
    for(let l=0;l<2;l++)for(let i=0;i<AN;i++)aIM.setColorAt(l*AN+i,(i/AN<.5)?cB:cG);
    /* mist + UV */
    const sterG=new T.Group();s.scene.add(sterG);
    const MN=70,mIM=new T.InstancedMesh(new T.SphereGeometry(.1,6,5),new T.MeshBasicMaterial({color:0x3a78c2,transparent:true,opacity:.55}),MN);mIM.frustumCulled=false;sterG.add(mIM);
    const uvGlow=new T.Mesh(new T.BoxGeometry(9.2,7.8,9.2),new T.MeshBasicMaterial({color:0xe0457b,transparent:true,opacity:.09,side:T.BackSide,depthWrite:false}));uvGlow.position.y=4.6;sterG.add(uvGlow);
    /* panel highlight */
    const hl=new T.Mesh(new T.BoxGeometry(.07,8.0,10/3),new T.MeshBasicMaterial({color:0x2d45e3,transparent:true,opacity:.34,depthWrite:false}));hl.position.set(5.08,4.6,0);
    const hlE=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(.09,8.0,10/3)),new T.LineBasicMaterial({color:0x2d45e3}));hlE.position.copy(hl.position);
    const panelG=new T.Group();panelG.add(hl,hlE);s.scene.add(panelG);
    /* racks: footprint + upward arrow */
    const rackG=new T.Group();s.scene.add(rackG);
    const fp=new T.Mesh(new T.PlaneGeometry(10,10),new T.MeshBasicMaterial({color:0x2d45e3,transparent:true,opacity:.14,depthWrite:false}));fp.rotation.x=-Math.PI/2;fp.position.y=.06;rackG.add(fp);
    const arrM=new T.MeshBasicMaterial({color:0x2d45e3});
    const arr=new T.Group();arr.position.set(-6.8,0,0);arr.add(cyl(.18,7,arrM,0,3.5,0,10),new T.Mesh(new T.ConeGeometry(.55,1.3,14),arrM));arr.children[1].position.y=7.6;rackG.add(arr);
    /* footprints */
    const sizeG=new T.Group();s.scene.add(sizeG);
    function foot(x0,z0,w,d,col,dash){const g=new T.Group();
      const pts=[V(x0,.08,z0),V(x0+w,.08,z0),V(x0+w,.08,z0+d),V(x0,.08,z0+d),V(x0,.08,z0)];
      const mk=a=>{const l=new T.Line(new T.BufferGeometry().setFromPoints(a),dash?new T.LineDashedMaterial({color:col,dashSize:.6,gapSize:.4}):new T.LineBasicMaterial({color:col}));if(dash)l.computeLineDistances();return l};
      g.add(mk(pts));const n=Math.round(w/(10/3)),m=Math.round(d/(10/3));
      for(let i=1;i<n;i++)g.add(mk([V(x0+i*10/3,.08,z0),V(x0+i*10/3,.08,z0+d)]));
      for(let i=1;i<m;i++)g.add(mk([V(x0,.08,z0+i*10/3),V(x0+w,.08,z0+i*10/3)]));
      const f=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshBasicMaterial({color:col,transparent:true,opacity:dash?.04:.12,depthWrite:false}));f.rotation.x=-Math.PI/2;f.position.set(x0+w/2,.05,z0+d/2);g.add(f);sizeG.add(g)}
    foot(-5,-5,10,10,0x2d45e3,false);foot(10,-5,20,10,0x0b1310,true);
    /* power */
    const powerG=new T.Group();s.scene.add(powerG);
    const sunTex=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(255,214,102,1)');g.addColorStop(.25,'rgba(255,190,60,.55)');g.addColorStop(1,'rgba(255,190,60,0)');x.fillStyle=g;x.fillRect(0,0,256,256);return new T.CanvasTexture(c)})();
    const sunPos=V(-34,36,-16);
    const halo=new T.Sprite(new T.SpriteMaterial({map:sunTex,transparent:true,depthWrite:false}));halo.scale.set(26,26,1);halo.position.copy(sunPos);powerG.add(halo);
    const sunB=new T.Mesh(new T.SphereGeometry(2.2,24,18),new T.MeshBasicMaterial({color:0xffb81f}));sunB.position.copy(sunPos);powerG.add(sunB);
    const rays=[];for(let i=0;i<10;i++){const a=i/10*Math.PI*2;const r=new T.Mesh(new T.BoxGeometry(.22,1.8,.22),new T.MeshBasicMaterial({color:0xffb81f}));r.position.set(sunPos.x+Math.cos(a)*4.2,sunPos.y+Math.sin(a)*4.2,sunPos.z);r.rotation.z=a-Math.PI/2;powerG.add(r);rays.push(r)}
    const arrG=new T.Group();arrG.position.set(-24,0,4);powerG.add(arrG);
    const pvM=M(0x1e3f7a,{roughness:.25,metalness:.5}),pvF=M(0xcfd5cf,{roughness:.6});
    for(let r=0;r<2;r++)for(let c=0;c<3;c++){const p=new T.Group();p.position.set(c*6.6-6.6,2.2,r*5.6-2.8);p.rotation.x=-.62;p.add(bx(6.2,.22,4.6,pvF,0,0,0),bx(5.9,.1,4.3,pvM,0,.13,0));arrG.add(p);arrG.add(cyl(.18,2.4,pvF,c*6.6-6.6,1.1,r*5.6-2.8,6))}
    const pylon=new T.Group();pylon.position.set(34,0,-10);powerG.add(pylon);
    const steel=M(0x59635f,{roughness:.5,metalness:.6});
    pylon.add(cyl(.45,30,steel,0,15,0,10),bx(9,.4,.4,steel,0,28,0),bx(7,.4,.4,steel,0,24,0));
    [-4,0,4].forEach(x=>pylon.add(cyl(.28,1.2,M(0xd8ddd6),x,28.9,0,8)));
    const sunC=new T.CatmullRomCurve3([sunPos.clone().add(V(3,-2,1)),V(-30,26,-8),V(-26,14,0),V(-24,7,3)]);
    const solarC=new T.CatmullRomCurve3([V(-17,1.2,4),V(-12,.5,2),V(-8,1.6,-1),V(-5.4,3,-1.5)]);
    const gridC=new T.CatmullRomCurve3([V(34,28,-10),V(30,16,-9),V(16,6,-8.5),V(5.6,5.6,-6.6)]);
    [[sunC,0xffb81f,.07],[solarC,0xffb81f,.14],[gridC,0xe0457b,.14]].forEach(a=>powerG.add(new T.Mesh(new T.TubeGeometry(a[0],40,a[2],6,false),new T.MeshBasicMaterial({color:a[1],transparent:true,opacity:.35}))));
    const PN=26,sP0=new T.InstancedMesh(new T.SphereGeometry(.2,8,6),new T.MeshBasicMaterial({color:0xffc83d}),14),sP1=new T.InstancedMesh(new T.SphereGeometry(.3,10,8),new T.MeshBasicMaterial({color:0xffb81f}),PN),sP2=new T.InstancedMesh(new T.SphereGeometry(.3,10,8),new T.MeshBasicMaterial({color:0xe0457b}),PN);
    sP0.frustumCulled=sP1.frustumCulled=sP2.frustumCulled=false;powerG.add(sP0,sP1,sP2);
    S={s,pod,grid,air,aIM,loops,AN,sterG,mIM,MN,uvGlow,panelG,rackG,sizeG,powerG,sP0,sP1,sP2,PN,sunC,solarC,gridC,halo,rays,pm:new T.Object3D()};
  });
  const KF=[
   {th:.3,ph:1.18,r:34,t:[0,5.2,0],cut:1},
   {th:-.6,ph:1.25,r:22,t:[0,4.6,0],cut:1},
   {th:.9,ph:1.12,r:118,t:[-12,16,-5],cut:0},
   {th:.55,ph:1.2,r:30,t:[0,5,0],cut:1},
   {th:1.35,ph:1.2,r:30,t:[0,4.6,0],cut:0},
   {th:.3,ph:1.1,r:36,t:[0,5,0],cut:1},
   {th:0,ph:.42,r:92,t:[2,0,0],cut:0}];
  const sm=x=>x*x*(3-2*x);let last=performance.now();
  (function f(now){const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000;
    if(S&&S.s.visible){const u=UI.pos(sec,false),k=UI.kf(KF,u),i=Math.round(u),o=S.s.orbit;
      o.touched=true;o.tth=k.th;o.tph=k.ph;o.tr=k.r;o.ttarget.set(k.t[0],k.t[1],k.t[2]);
      S.pod.setCutAmt(k.cut);
      S.air.visible=i===0||i===1;S.sterG.visible=i===3;S.panelG.visible=i===4;S.rackG.visible=i===5;S.sizeG.visible=i===6;S.powerG.visible=i===2;S.grid.visible=i===2||i===6;
      const pm=S.pm;
      if(S.air.visible){const sp=i===1?.05:.1;for(let l=0;l<2;l++)for(let n=0;n<S.AN;n++){S.loops[l].getPoint((t*sp+n/S.AN+l*.5)%1,pm.position);pm.scale.setScalar(1);pm.updateMatrix();S.aIM.setMatrixAt(l*S.AN+n,pm.matrix)}S.aIM.instanceMatrix.needsUpdate=true}
      if(S.sterG.visible){for(let n=0;n<S.MN;n++){const sd=n/S.MN,f2=(t*.35+sd*3.7)%1;pm.position.set(Math.sin(sd*40)*f2*1.7,8.2-f2*4.2,((sd*7.3)%1-.5)*8);pm.scale.setScalar(1-f2);pm.updateMatrix();S.mIM.setMatrixAt(n,pm.matrix)}S.mIM.instanceMatrix.needsUpdate=true;S.uvGlow.material.opacity=.07+.03*Math.sin(t*3)}
      if(S.powerG.visible){const ph=(t%10)/10,share=.12+.76*sm(Math.sin(ph*Math.PI*2-1.2)*.5+.5);
        for(let n=0;n<14;n++){S.sunC.getPoint((t*.25+n/14)%1,pm.position);pm.scale.setScalar(.4+share);pm.updateMatrix();S.sP0.setMatrixAt(n,pm.matrix)}
        for(let n=0;n<S.PN;n++){const a=n<Math.round(S.PN*share),b=n<Math.round(S.PN*(1-share)),q=(t*.2+n/S.PN)%1;
          S.solarC.getPoint(q,pm.position);pm.scale.setScalar(a?1:.0001);pm.updateMatrix();S.sP1.setMatrixAt(n,pm.matrix);
          S.gridC.getPoint(q,pm.position);pm.scale.setScalar(b?1:.0001);pm.updateMatrix();S.sP2.setMatrixAt(n,pm.matrix)}
        S.sP0.instanceMatrix.needsUpdate=S.sP1.instanceMatrix.needsUpdate=S.sP2.instanceMatrix.needsUpdate=true;
        S.halo.scale.setScalar(16+share*20+Math.sin(t*2)*1.2);S.rays.forEach(r=>r.scale.y=.6+share*1.2);
        const sh=$('#shS');if(sh)sh.style.width=(share*100).toFixed(1)+'%'}
      const sb=$('#shareBarP');if(sb)sb.classList.toggle('on',i===2);
      S.pod.update(dt,t);o.update(dt,S.s.cam);S.s.renderer.render(S.s.scene,S.s.cam)}
    requestAnimationFrame(f)})(last);
  }
}
/* crop packs */
$$('[data-inst]').forEach(ib=>ib.addEventListener('click',()=>{const c=ib.closest('.crop');c.classList.add('ing');ib.disabled=true;ib.textContent='Adding pack';const u=c.querySelector('.bar u');if(u)requestAnimationFrame(()=>u.style.width='100%');setTimeout(()=>{ib.textContent='Added';ib.className='btn done';c.querySelector('span').textContent='Pack installed by update. No hardware change.';c.classList.remove('ing')},2200)}));
/* kaani */
const km=$('#stackSvgM');if(km){const c=AKStack.build(km);c.pulse(true)}
const kp=$('#stackSvgP');if(kp){const c=AKStack.build(kp);
  const show=k=>{press('data-sc',k);const r=c.show(k);$('#scT').textContent=r.t;$('#scD').textContent=r.d};
  $$('[data-sc]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.sc)));show('ok')}
})();

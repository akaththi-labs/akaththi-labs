(function(){
/* Kaani stage */
if(!AK.ok)return;
const {T,clamp,reduce,makeStage,lights,M,bx,cyl,buildPod,buildHum}=AK;
const V=(x,y,z)=>new T.Vector3(x,y,z);
const sm=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};

/* ================= story viewer ================= */
const cvP=document.getElementById('cvP');
const sP=makeStage(cvP,{th:.66,ph:1.2,r:44,auto:.07,target:V(0,9.6,-.8)});
sP.cam.far=7000;sP.orbit.sm=.015;
lights(sP.scene,{sb:30,sky:0xffffff,gnd:0xc4cac2,hemi:.45,key:1.05,fill:.2,fillc:0xffffff});
const scene=sP.scene;scene.fog=new T.Fog(0xeff1ec,500,4200);
const pod=buildPod(sP,'#vwP');pod.dimsOn=false;

/* ground */
const gc=document.createElement('canvas');gc.width=gc.height=128;{const c=gc.getContext('2d');c.fillStyle='#eff1ec';c.fillRect(0,0,128,128);c.strokeStyle='rgba(11,19,16,.10)';c.lineWidth=2;c.strokeRect(0,0,128,128)}
const gt=new T.CanvasTexture(gc);gt.wrapS=gt.wrapT=T.RepeatWrapping;gt.repeat.set(250,250);gt.anisotropy=8;gt.encoding=T.sRGBEncoding;
const ground=new T.Mesh(new T.PlaneGeometry(8000,8000),new T.MeshStandardMaterial({map:gt,roughness:1,metalness:0,transparent:true,opacity:0}));
ground.rotation.x=-Math.PI/2;ground.position.y=-.03;ground.receiveShadow=true;ground.visible=false;scene.add(ground);

/* instanced mini PODs */
const COL=[0x2d45e3,0xe0457b,0x3a78c2,0xd68a0c,0xc2412f,0x0f9aa8];
const items=[];  // {x,z,s,ci,kind,d}
const add=(x,z,s,ci,kind)=>items.push({x,z,s,ci,kind,d:Math.hypot(x,z)});
// micro farm: five neighbours of the real POD
[[-16,0],[16,0],[-16,-16],[0,-16],[16,-16]].forEach((p,i)=>add(p[0],p[1],1,i+1,'micro'));
// acres field
for(let x=-64;x<=64;x+=16)for(let z=-48;z<=48;z+=16){if(items.some(o=>o.x===x&&o.z===z)||(x===0&&z===0))continue;add(x,z,1,Math.abs(x*3+z)%6,'field')}
// regions
const REG=[[-640,430],[-1010,640]];const NAMES=['Chennai','Salem','Coimbatore'];
const rnd=(()=>{let s=7;return()=>(s=(s*16807)%2147483647)/2147483647})();
REG.forEach((c,ri)=>{const cols=5,rows=4;for(let i=0;i<cols;i++)for(let j=0;j<rows;j++)if(rnd()>.12)add(c[0]+(i-2)*78+rnd()*10,c[1]+(j-1.5)*78+rnd()*10,6,(ri+i+j)%6,'reg'+ri)});
const N=items.length;
const bodyM=new T.MeshStandardMaterial({color:0xf3f5f1,roughness:.45,transparent:true,opacity:0});
const baseM=new T.MeshStandardMaterial({color:0x3a4440,roughness:.8,transparent:true,opacity:0});
const bandM=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0});
const ringM=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false});
const mk=(g,m)=>{const im=new T.InstancedMesh(g,m,N);im.frustumCulled=false;return im};
const g1=new T.BoxGeometry(10,10.2,10);g1.translate(0,5.6,0);
const g2=new T.BoxGeometry(10,.7,10);g2.translate(0,.35,0);
const g3=new T.BoxGeometry(10.16,.6,10.16);g3.translate(0,9.8,0);
const g4=new T.RingGeometry(7,12.5,40);g4.rotateX(-Math.PI/2);g4.translate(0,.06,0);
const g5=new T.BoxGeometry(2.4,6.4,.12);g5.translate(2.6,3.9,5.03);const g6=new T.BoxGeometry(5.4,.9,.12);g6.translate(-1.8,8.4,5.03);const g7=new T.BoxGeometry(5.2,1.2,4.2);g7.translate(-1.4,10.7,-1.5);
const dkM=new T.MeshStandardMaterial({color:0x2b3330,roughness:.6,transparent:true,opacity:0});
const iBody=mk(g1,bodyM),iBase=mk(g2,baseM),iBand=mk(g3,bandM),iRing=mk(g4,ringM),iDoor=mk(g5,dkM),iSign=mk(g6,dkM),iRoof=mk(g7,bodyM);
iBody.castShadow=true;
const mini=new T.Group();mini.add(iBody,iBase,iBand,iRing,iDoor,iSign,iRoof);mini.visible=false;scene.add(mini);
const col=new T.Color();items.forEach((o,i)=>{col.setHex(COL[o.ci]);iBand.setColorAt(i,col);iRing.setColorAt(i,col)});
const dm=new T.Object3D();
let gF=0,gR=0,miniA=0;
function layout(){
  items.forEach((o,i)=>{
    let s=o.s;
    if(o.kind==='field')s*=sm(gF*1.7-o.d/130);
    else if(o.kind[0]==='r')s*=sm(gR*1.4-(+o.kind[3])*.08);
    dm.position.set(o.x,0,o.z);dm.scale.set(s||.0001,s||.0001,s||.0001);dm.updateMatrix();
    [iBody,iBase,iBand,iRing,iDoor,iSign,iRoof].forEach(m=>m.setMatrixAt(i,dm.matrix));
  });
  [iBody,iBase,iBand,iRing,iDoor,iSign,iRoof].forEach(m=>m.instanceMatrix.needsUpdate=true);
}
// ring under the real POD, and a plot outline for the micro farm
const podRing=new T.Mesh(g4,new T.MeshBasicMaterial({color:0x2d45e3,transparent:true,opacity:0,depthWrite:false}));scene.add(podRing);podRing.visible=false;
const plotPts=[V(-30,.1,-30),V(30,.1,-30),V(30,.1,14),V(-30,.1,14)];
const plot=new T.LineLoop(new T.BufferGeometry().setFromPoints(plotPts),new T.LineDashedMaterial({color:0x0b1310,dashSize:2.5,gapSize:2,transparent:true,opacity:0}));plot.computeLineDistances();plot.visible=false;scene.add(plot);

/* regions: beacons, hub, links, packets */
const regionG=new T.Group();regionG.visible=false;scene.add(regionG);
const hubPos=V(-450,420,300);
const hub=new T.Group();hub.position.copy(hubPos);regionG.add(hub);
hub.add(new T.Mesh(new T.IcosahedronGeometry(28,1),new T.MeshBasicMaterial({color:0xe0457b,wireframe:true})));
hub.add(new T.Mesh(new T.SphereGeometry(12,20,16),new T.MeshBasicMaterial({color:0xe0457b})));
const hr=new T.Mesh(new T.TorusGeometry(55,2,8,60),new T.MeshBasicMaterial({color:0xe0457b,transparent:true,opacity:.6}));hr.rotation.x=Math.PI/2;hub.add(hr);
const targets=[V(0,6,0)].concat(REG.map(c=>V(c[0],6,c[1])));
const links=[],pk=[];
targets.forEach((t,i)=>{
  const lg=new T.BufferGeometry().setFromPoints([hubPos,t]);
  const l=new T.Line(lg,new T.LineBasicMaterial({color:0xe0457b,transparent:true,opacity:.55}));regionG.add(l);links.push(t);
  if(i>0){const b=new T.Mesh(new T.CylinderGeometry(12,12,300,12,1,true),new T.MeshBasicMaterial({color:COL[(i-1)%6],transparent:true,opacity:.3,side:T.DoubleSide,depthWrite:false}));b.position.set(t.x,150,t.z);regionG.add(b)}
});
const pkM=new T.InstancedMesh(new T.SphereGeometry(9,10,8),new T.MeshBasicMaterial({color:0xe0457b}),targets.length*3);pkM.frustumCulled=false;regionG.add(pkM);
// acres beacon
{const b=new T.Mesh(new T.CylinderGeometry(12,12,300,12,1,true),new T.MeshBasicMaterial({color:0x2d45e3,transparent:true,opacity:.3,side:T.DoubleSide,depthWrite:false}));b.position.set(0,150,0);regionG.add(b)}

/* power scene: sun -> solar array -> POD, grid pylon -> POD, live share */
const powerG=new T.Group();powerG.visible=false;scene.add(powerG);
const sunTex=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(255,214,102,1)');g.addColorStop(.25,'rgba(255,190,60,.55)');g.addColorStop(1,'rgba(255,190,60,0)');x.fillStyle=g;x.fillRect(0,0,256,256);return new T.CanvasTexture(c)})();
const sunPos=V(-34,36,-16);
const halo=new T.Sprite(new T.SpriteMaterial({map:sunTex,transparent:true,depthWrite:false}));halo.scale.set(26,26,1);halo.position.copy(sunPos);powerG.add(halo);
const sunB=new T.Mesh(new T.SphereGeometry(2.2,24,18),new T.MeshBasicMaterial({color:0xffb81f}));sunB.position.copy(sunPos);powerG.add(sunB);
const rays=[];for(let i=0;i<10;i++){const a=i/10*Math.PI*2;const r=new T.Mesh(new T.BoxGeometry(.22,1.8,.22),new T.MeshBasicMaterial({color:0xffb81f}));r.position.set(sunPos.x+Math.cos(a)*4.2,sunPos.y+Math.sin(a)*4.2,sunPos.z);r.rotation.z=a-Math.PI/2;powerG.add(r);rays.push(r)}
// solar array: tilted panels on the ground, left of the POD
const arr=new T.Group();arr.position.set(-24,0,4);powerG.add(arr);
const pvM=M(0x1e3f7a,{roughness:.25,metalness:.5}),pvF=M(0xcfd5cf,{roughness:.6});
for(let r=0;r<2;r++)for(let c=0;c<3;c++){const p=new T.Group();p.position.set(c*6.6-6.6,2.2,r*5.6-2.8);p.rotation.x=-.62;p.add(bx(6.2,.22,4.6,pvF,0,0,0),bx(5.9,.1,4.3,pvM,0,.13,0));for(let k=1;k<3;k++)p.add(bx(.04,.02,4.3,pvF,-3+k*2,.19,0));for(let k=1;k<3;k++)p.add(bx(5.9,.02,.04,pvF,0,.19,-2.3+k*1.5));arr.add(p);arr.add(cyl(.18,2.4,pvF,c*6.6-6.6,1.1,r*5.6-2.8,6))}
// pylon
const pylon=new T.Group();pylon.position.set(34,0,-10);powerG.add(pylon);
const steel=M(0x59635f,{roughness:.5,metalness:.6});
pylon.add(cyl(.45,30,steel,0,15,0,10),bx(9,.4,.4,steel,0,28,0),bx(7,.4,.4,steel,0,24,0));
[-4,0,4].forEach(x=>pylon.add(cyl(.28,1.2,M(0xd8ddd6),x,28.9,0,8)));
const sunC=new T.CatmullRomCurve3([sunPos.clone().add(V(3,-2,1)),V(-30,26,-8),V(-26,14,0),V(-24,7,3)]);
const solarC=new T.CatmullRomCurve3([V(-17,1.2,4),V(-12,.5,2),V(-8,1.6,-1),V(-5.4,3,-1.5)]);
const gridC=new T.CatmullRomCurve3([V(34,28,-10),V(30,16,-9),V(16,6,-8.5),V(5.6,5.6,-6.6)]);
[[sunC,0xffb81f,.07],[solarC,0xffb81f,.14],[gridC,0xe0457b,.14]].forEach(a=>powerG.add(new T.Mesh(new T.TubeGeometry(a[0],40,a[2],6,false),new T.MeshBasicMaterial({color:a[1],transparent:true,opacity:.35}))));
const PN=26;
const sP0=new T.InstancedMesh(new T.SphereGeometry(.2,8,6),new T.MeshBasicMaterial({color:0xffc83d}),14);
const sP1=new T.InstancedMesh(new T.SphereGeometry(.3,10,8),new T.MeshBasicMaterial({color:0xffb81f}),PN);
const sP2=new T.InstancedMesh(new T.SphereGeometry(.3,10,8),new T.MeshBasicMaterial({color:0xe0457b}),PN);
sP0.frustumCulled=sP1.frustumCulled=sP2.frustumCulled=false;powerG.add(sP0,sP1,sP2);

/* failure scene */
const failG=new T.Group();failG.visible=false;scene.add(failG);
const cloudPos=V(0,22,-6);
const cl=new T.Group();cl.position.copy(cloudPos);failG.add(cl);
cl.add(new T.Mesh(new T.IcosahedronGeometry(2.4,1),new T.MeshBasicMaterial({color:0x3a78c2,wireframe:true})));
cl.add(new T.Mesh(new T.SphereGeometry(1,20,16),new T.MeshBasicMaterial({color:0x3a78c2})));
const cr=new T.Mesh(new T.TorusGeometry(4,.12,8,50),new T.MeshBasicMaterial({color:0x3a78c2,transparent:true,opacity:.6}));cr.rotation.x=Math.PI/2;cl.add(cr);
const roofP=V(0,11.4,-2.6);
const linkM=new T.LineBasicMaterial({color:0x3a78c2,transparent:true,opacity:.8});
const linkL=new T.Line(new T.BufferGeometry().setFromPoints([roofP,cloudPos]),linkM);failG.add(linkL);
const xTex=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='#fff';x.beginPath();x.arc(64,64,56,0,7);x.fill();x.strokeStyle='#c2412f';x.lineWidth=9;x.lineCap='round';x.beginPath();x.arc(64,64,56,0,7);x.stroke();x.beginPath();x.moveTo(40,40);x.lineTo(88,88);x.moveTo(88,40);x.lineTo(40,88);x.stroke();return new T.CanvasTexture(c)})();
const xs=new T.Sprite(new T.SpriteMaterial({map:xTex,transparent:true,depthTest:false}));xs.scale.set(2.4,2.4,1);xs.position.copy(roofP.clone().lerp(cloudPos,.55));xs.visible=false;failG.add(xs);
const fpk=new T.InstancedMesh(new T.SphereGeometry(.16,10,8),new T.MeshBasicMaterial({color:0x3a78c2}),6);fpk.frustumCulled=false;failG.add(fpk);
const runRing=new T.Mesh(new T.RingGeometry(6.6,6.85,64),new T.MeshBasicMaterial({color:0x2d45e3,transparent:true,opacity:0,depthWrite:false}));runRing.rotation.x=-Math.PI/2;runRing.position.y=.12;failG.add(runRing);

/* tour: camera, x-ray and scene are scrubbed directly by scroll position */
const KF=[
 {th:.66,ph:1.22,r:44,t:[0,9.6,-.8],cut:0},
 {th:.3,ph:1.18,r:34,t:[0,5.2,0],cut:1},
 {th:2.95,ph:1.26,r:33,t:[.4,4.8,-5.6],cut:0},
 {th:.4,ph:1.32,r:18,t:[1.2,4.8,5],cut:0},
 {th:.78,ph:1.0,r:108,t:[0,5,-8],cut:0},
 {th:.82,ph:.95,r:310,t:[0,0,-6],cut:0},
 {th:.6,ph:.9,r:1950,t:[-420,60,300],cut:0},
 {th:.9,ph:1.12,r:118,t:[-12,16,-5],cut:0},
 {th:.5,ph:1.15,r:64,t:[0,15,-3],cut:0}];
const SC=['pod','pod','pod','pod','micro','acres','regions','power','fail'];
const TAGS=[[],['mist','uv'],['roof','duct','ctrl','hum','act'],['touch'],[],[],[],[],[]];
let sc='pod',failT=0,curS=-1;
const tgt={ground:0,mini:0,F:0,R:0,regions:0,power:0,fail:0};
const top=document.getElementById('top'),dots=top.querySelector('.dots');
sP.orbit.sm=.0001;
[...top.querySelectorAll('.step')].forEach((el,i)=>{const b=document.createElement('button');b.setAttribute('aria-label','Step '+(i+1));b.addEventListener('click',()=>el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'}));dots.appendChild(b)});
function setScene(i){
  curS=i;sc=SC[i];top.dataset.s=i;[...dots.children].forEach((d,k)=>d.setAttribute('aria-current',k===i));pod.tags=TAGS[i];
  const far=['micro','acres','regions','power','fail'].indexOf(sc)>=0;
  tgt.ground=far?1:0;tgt.mini=(sc==='micro'||sc==='acres'||sc==='regions')?1:0;
  tgt.F=(sc==='acres'||sc==='regions')?1:0;tgt.R=sc==='regions'?1:0;
  tgt.regions=sc==='regions'?1:0;tgt.power=sc==='power'?1:0;tgt.fail=sc==='fail'?1:0;
  if(sc==='fail'){failT=0;netPill(false)}
}
function scrub(t){
  const u=UI.pos(top,true),k=UI.kf(KF,u),o=sP.orbit;
  const spin=Math.sin(t*.3)*.3*(1-clamp(u*3,0,1));
  o.touched=true;o.tth=k.th+spin;o.tph=k.ph;o.tr=k.r;o.ttarget.set(k.t[0],k.t[1],k.t[2]);
  pod.setCutAmt(k.cut);
  const i=clamp(Math.round(u),0,KF.length-1);if(i!==curS)setScene(i);
}
document.querySelectorAll('[data-go]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector('#top .step[data-s="1"]').scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'})}));
const pill=document.getElementById('netPill'),pt=document.getElementById('netTxt');
function netPill(bad){pill.classList.toggle('bad',bad);pt.textContent=bad?'Internet lost · POD keeps running':'Connected to Kaani cloud'}
const rlabs=[...document.querySelectorAll('.rlab')];

/* ================= product stages (scrubbed by scroll) ================= */
function stage(secId,cid,init,KFs,apply){
  const sec=document.getElementById(secId);let st=null;
  UI.lazy(sec,()=>{st=init(document.getElementById(cid))});
  UI.tour(sec,()=>{});
  return {tick(dt,now){if(!st||!st.s.visible)return;const k=UI.kf(KFs,UI.pos(sec,false)),o=st.s.orbit;o.touched=true;o.tth=k.th;o.tph=k.ph;o.tr=k.r;o.ttarget.set(k.t[0],k.t[1],k.t[2]);apply(k,st,dt,now);o.update(dt,st.s.cam);st.s.renderer.render(st.s.scene,st.s.cam)}};
}
const HS=stage('stageHum','cvHS',cv=>{
  const s=makeStage(cv,{th:.7,ph:1.28,r:9.5,fov:30,target:V(0,1.3,0)});s.orbit.sm=.0001;
  lights(s.scene,{sb:6,sky:0xffffff,gnd:0xb9beb4,hemi:.95,key:1,fill:.5,fillc:0xffffff});
  const h=buildHum();s.scene.add(h);const g=new T.Mesh(new T.PlaneGeometry(40,40),new T.ShadowMaterial({opacity:.15}));g.rotation.x=-Math.PI/2;g.receiveShadow=true;s.scene.add(g);
  return {s,api:h};
},[{th:.3,ph:1.3,r:8.6,t:[0,1.3,0],o:1},{th:.95,ph:1.2,r:8,t:[0,1.3,0],o:0},{th:.12,ph:1.3,r:6.2,t:[0,1.9,0],o:0},{th:Math.PI+.4,ph:1.28,r:8,t:[0,1.3,0],o:0}],
(k,st)=>{st.api.userData.hinge.rotation.y=-1.95*k.o});

/* ================= loop ================= */
let last=performance.now();const pm=new T.Object3D();
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000;
  if(sP.visible){
    scrub(t);
    // ground + minis fades
    ground.material.opacity+=(tgt.ground-ground.material.opacity)*(1-Math.pow(.02,dt));ground.visible=ground.material.opacity>.01;
    miniA+=(tgt.mini-miniA)*(1-Math.pow(.02,dt));if(!tgt.mini)miniA=0;iBody.castShadow=tgt.mini>0&&miniA>.5;
    gF+=(tgt.F-gF)*(1-Math.pow(.15,dt));gR+=(tgt.R-gR)*(1-Math.pow(.15,dt));if(!tgt.R)gR=0;
    mini.visible=miniA>.01;[bodyM,baseM,bandM,dkM].forEach(m=>{m.opacity=miniA;const t=miniA<.99;if(m.transparent!==t){m.transparent=t;m.needsUpdate=true}});ringM.opacity=.3*miniA;
    podRing.visible=plot.visible=mini.visible;podRing.material.opacity=.3*miniA;plot.material.opacity=.55*clamp(miniA*(1-gF),0,1);
    if(mini.visible)layout();
    regionG.visible=tgt.regions>0;
    powerG.visible=sc==='power';failG.visible=sc==='fail';
    if(regionG.visible){hub.rotation.y+=dt*.4;hr.rotation.z+=dt*.5;for(let i=0;i<targets.length;i++)for(let k=0;k<3;k++){const f=((t*.22+k/3+i*.13)%1),idx=i*3+k;pm.position.copy(hubPos).lerp(targets[i],f);pm.scale.setScalar(1);pm.updateMatrix();pkM.setMatrixAt(idx,pm.matrix)}pkM.instanceMatrix.needsUpdate=true}
    if(powerG.visible){
      const ph=(t%10)/10,share=.12+.76*sm(Math.sin(ph*Math.PI*2-1.2)*.5+.5);
      for(let i=0;i<14;i++){sunC.getPoint((t*.25+i/14)%1,pm.position);pm.scale.setScalar(.4+share);pm.updateMatrix();sP0.setMatrixAt(i,pm.matrix)}
      for(let i=0;i<PN;i++){const on1=i<Math.round(PN*share),on2=i<Math.round(PN*(1-share));
        const f=(t*.2+i/PN)%1;solarC.getPoint(f,pm.position);pm.scale.setScalar(on1?1:.0001);pm.updateMatrix();sP1.setMatrixAt(i,pm.matrix);
        gridC.getPoint(f,pm.position);pm.scale.setScalar(on2?1:.0001);pm.updateMatrix();sP2.setMatrixAt(i,pm.matrix)}
      sP0.instanceMatrix.needsUpdate=sP1.instanceMatrix.needsUpdate=sP2.instanceMatrix.needsUpdate=true;
      halo.scale.setScalar(16+share*20+Math.sin(t*2)*1.2);rays.forEach((r,i)=>{r.visible=true;r.scale.y=.6+share*1.2});
      const sh=document.getElementById('shS');if(sh)sh.style.width=(share*100).toFixed(1)+'%';
    }
    {const sb=document.getElementById('shareBar');if(sb)sb.classList.toggle('on',sc==='power')}
    if(failG.visible){
      failT+=dt;const bad=failT>2;
      if(bad!==linkM.userData.bad){linkM.userData.bad=bad;linkM.color.setHex(bad?0xc2412f:0x3a78c2);xs.visible=bad;netPill(bad)}
      for(let i=0;i<6;i++){const f=(t*.35+i/6)%1;pm.position.copy(roofP).lerp(cloudPos,f);pm.scale.setScalar(bad?.0001:1);pm.updateMatrix();fpk.setMatrixAt(i,pm.matrix)}fpk.instanceMatrix.needsUpdate=true;
      linkM.opacity=bad?(Math.sin(t*14)>0?.9:.3):.8;cl.rotation.y+=dt*.5;
      const rr=((t*.5)%1);runRing.scale.setScalar(1+rr*.9);runRing.material.opacity=.6*(1-rr);
    }
    pod.update(dt,t);sP.orbit.update(dt,sP.cam);sP.cam.updateMatrixWorld();sP.renderer.render(sP.scene,sP.cam);
    const pv=new T.Vector3(),pts=[V(0,70,0)].concat(REG.map(c=>V(c[0],200,c[1])));rlabs.forEach((el,i)=>{if(!(sc==='acres'&&i===0)&&sc!=='regions'){el.style.opacity=0;return}pv.copy(i===0&&sc==='acres'?V(0,30,0):pts[i]).project(sP.cam);if(pv.z>1){el.style.opacity=0;return}el.style.opacity=1;el.style.transform='translate('+clamp((pv.x*.5+.5)*sP.w,40,sP.w-110)+'px,'+clamp((-pv.y*.5+.5)*sP.h,90,sP.h-90)+'px) translate(-50%,-100%)'});
  }
  HS.tick(dt,t);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
scrub(0);
window.AKdebug={sP,snap(){scrub(performance.now()/1000);const o=sP.orbit;o.th=o.tth;o.ph=o.tph;o.r=o.tr;o.target.copy(o.ttarget)}};
})();

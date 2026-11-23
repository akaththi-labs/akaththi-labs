(function(){
function noGL(msg){document.querySelectorAll('.viewer').forEach(function(v){v.classList.add('nogl');v.insertAdjacentHTML('beforeend','<p class="glmsg">'+msg+'</p>')});}
var glOK=false;try{var tc=document.createElement('canvas');glOK=!!(tc.getContext('webgl2')||tc.getContext('webgl')||tc.getContext('experimental-webgl'))}catch(e){}
var AK=window.AK={ok:true,noGL:noGL};
if(!window.THREE){AK.ok=false;noGL('Live 3D could not load here. Showing a still render.');return;}
if(!glOK){AK.ok=false;noGL('Live 3D needs WebGL, which this view does not allow. Showing a still render.');return;}
window.addEventListener('error',function(e){if(!document.querySelector('.viewer.nogl')&&/THREE|WebGL|webgl/i.test(String(e.message))){noGL('Live 3D hit a problem on this device. Showing a still render.')}});
const T=THREE, clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- orbit camera ---------- */
class Orbit{
  constructor(canvas,o){
    this.th=this.tth=o.th; this.ph=this.tph=o.ph; this.r=this.tr=o.r; this.auto=o.auto||0; this.touched=false; this.ascale=1;
    this.target=o.target;this.ttarget=o.target.clone();
    let down=false,lx=0,ly=0; const s=this;
    canvas.addEventListener('pointerdown',e=>{down=true;lx=e.clientX;ly=e.clientY;s.touched=true;try{canvas.setPointerCapture(e.pointerId)}catch(_){}});
    canvas.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;s.tth-=dx*.008;if(e.pointerType==='mouse')s.tph=clamp(s.tph-dy*.006,.15,1.6);});
    const up=()=>{down=false};canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('pointerleave',up);
  }
  go(th,ph,r,t){let d=th-this.th;d=Math.atan2(Math.sin(d),Math.cos(d));this.tth=this.th+d;this.tph=ph;this.tr=r;this.touched=true;if(t)this.ttarget.set(t[0],t[1],t[2]);}
  update(dt,cam){
    if(this.auto&&!this.touched&&!reduce)this.tth+=this.auto*dt;
    const k=1-Math.pow(this.sm||.001,dt);
    this.target.lerp(this.ttarget,k);this.th+=(this.tth-this.th)*k;this.ph+=(this.tph-this.ph)*k;this.r+=(this.tr-this.r)*k;
    const R=this.r*this.ascale,sp=Math.sin(this.ph);
    cam.position.set(this.target.x+R*sp*Math.sin(this.th),this.target.y+R*Math.cos(this.ph),this.target.z+R*sp*Math.cos(this.th));
    cam.lookAt(this.target);
  }
}
function makeStage(canvas,o){
  const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=o.exposure||1.0;
  const scene=new T.Scene(),cam=new T.PerspectiveCamera(o.fov||34,1,.1,300);
  const orbit=new Orbit(canvas,o);
  const st={renderer,scene,cam,orbit,visible:true,w:1,h:1};
  function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();st.w=w;st.h=h;const a=w/h;orbit.ascale=a<.8?1.55:a<1.2?1.22:1;}
  new ResizeObserver(resize).observe(canvas);resize();
  new IntersectionObserver(es=>{st.visible=es[0].isIntersecting},{rootMargin:'100px'}).observe(canvas);
  return st;
}
function lights(scene,o){
  scene.add(new T.HemisphereLight(o.sky||0xe8f0ea,o.gnd||0x0a1210,o.hemi||.8));
  const d=new T.DirectionalLight(0xffffff,o.key||1.1);d.position.set(5,24,9);d.castShadow=true;d.shadow.mapSize.set(2048,2048);
  const c=d.shadow.camera;c.left=c.bottom=-o.sb;c.right=c.top=o.sb;c.near=1;c.far=60;d.shadow.bias=-.0004;d.shadow.radius=3;scene.add(d);
  const f=new T.DirectionalLight(o.fillc||0x9fd8ff,o.fill||.35);f.position.set(-12,6,-8);scene.add(f);
}
const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.6,metalness:.05},o||{}));
function bx(w,h,d,mat,x,y,z){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;return m}
function cyl(r,h,mat,x,y,z,seg){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,seg||24),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;return m}

/* ---------- humidifier model ---------- */
function rr(w,d,r){const s=new T.Shape(),x=-w/2,y=-d/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+d-r);s.quadraticCurveTo(x+w,y+d,x+w-r,y+d);s.lineTo(x+r,y+d);s.quadraticCurveTo(x,y+d,x,y+d-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s}
function slab(w,d,r,h,mat,bev){bev=bev||0;const g=new T.ExtrudeGeometry(rr(w-2*bev,d-2*bev,r),{depth:h-2*bev,bevelEnabled:bev>0,bevelSize:bev,bevelThickness:bev,bevelSegments:3,curveSegments:10});g.rotateX(-Math.PI/2);const m=new T.Mesh(g,mat);m.position.y=bev;m.castShadow=m.receiveShadow=true;const gr=new T.Group();gr.add(m);return gr}
function buildHum(){
  const g=new T.Group();
  const plastic=new T.MeshPhysicalMaterial({color:0xf3f5f1,roughness:.42,clearcoat:.45,clearcoatRoughness:.3});
  const lid=new T.MeshPhysicalMaterial({color:0xe6eae4,roughness:.4,clearcoat:.4,clearcoatRoughness:.3});
  const dark=M(0x0c110f,{roughness:.8}), grey=M(0x8e9895,{roughness:.5}), steel=M(0xbfc7c7,{roughness:.28,metalness:.9});
  const plinth=slab(2.76,1.56,.22,.25,dark);g.add(plinth);
  const body=slab(3,1.8,.28,2.1,plastic,.05);body.position.y=.25;g.add(body);
  const seam=slab(2.86,1.66,.24,.03,dark);seam.position.y=2.35;g.add(seam);
  const top=slab(2.9,1.7,.24,.16,lid,.03);top.position.y=2.38;g.add(top);
  [-.8,.8].forEach(x=>{g.add(cyl(.3,.24,grey,x,2.66,-.1));g.add(cyl(.23,.02,dark,x,2.79,-.1));});
  // grille
  for(let i=0;i<14;i++)g.add(bx(.05,.22,.02,dark,-.85+i*.131,.5,.905));
  // display + status bar
  g.add(bx(.72,.2,.02,M(0x0e1412,{roughness:.2,metalness:.3}),-.85,2.17,.905));
  g.add(bx(.04,.04,.025,new T.MeshBasicMaterial({color:0xd6f2cb}),-.62,2.17,.92));
  g.add(bx(1,.045,.02,new T.MeshBasicMaterial({color:0xd6f2cb}),.8,2.17,.905));
  // opening + generic service bay
  g.add(bx(2.5,1.25,.02,dark,0,1.375,.905));
  g.add(bx(2.3,.03,.02,M(0x59635f),0,.98,.918));g.add(bx(2.3,.03,.02,M(0x59635f),0,1.78,.918));
  g.add(bx(1.2,.5,.05,steel,.35,1.38,.93));
  const cap=cyl(.22,.05,steel,-.75,1.38,.935);cap.rotation.x=Math.PI/2;g.add(cap);
  // door
  const hinge=new T.Group();hinge.position.set(-1.25,1.375,.915);g.add(hinge);
  const dg=new T.ExtrudeGeometry(rr(2.5,1.25,.1),{depth:.05,bevelEnabled:false,curveSegments:8});
  const door=new T.Mesh(dg,new T.MeshPhysicalMaterial({color:0xf7f9f5,roughness:.4,clearcoat:.4}));door.position.set(1.25,0,0);door.castShadow=true;hinge.add(door);
  const hd=bx(.07,.55,.05,dark,2.2,-.05,.075);hinge.add(hd);
  hinge.add(bx(2.2,.03,.02,new T.MeshBasicMaterial({color:0xc04cc6}),1.25,-.5,.06));
  // grips
  [-1,1].forEach(s=>g.add(bx(.05,.3,.8,dark,s*1.5,1.7,0)));
  // ventilated rear panel with an exposed coil
  const rp=bx(2.5,1.1,.03,dark,0,1.45,-.9);g.add(rp);
  const coilM=M(0x9aa3a1,{roughness:.3,metalness:.85});
  for(let r=0;r<6;r++){const y=.98+r*.17;g.add(bx(2.3,.03,.03,steel,0,y,-.93));
    for(let i=0;i<=1;i++){const e=cyl(.085,.04,coilM,i?1.15:-1.15,y+.085,-.93,14);e.rotation.x=Math.PI/2;g.add(e);g.add(bx(.03,.17,.03,steel,i?1.15:-1.15,y+.085,-.93))}}
  for(let i=0;i<46;i++)g.add(bx(.012,1.0,.05,M(0x6a7471,{roughness:.5,metalness:.6}),-1.12+i*.049,1.45,-.945));
  g.add(bx(2.6,.06,.07,steel,0,2.03,-.93),bx(2.6,.06,.07,steel,0,.87,-.93));
  [-1.28,1.28].forEach(x=>g.add(bx(.06,1.2,.07,steel,x,1.45,-.93)));
  // rear ports
  [[-.5,0x2b6cb0],[0,0x1a2320],[.5,0x9aa3a1]].forEach(p=>{const c=cyl(.09,.22,M(p[1]),p[0],.55,-.97);c.rotation.x=Math.PI/2;g.add(c)});
  g.userData.hinge=hinge;
  return g;
}

/* ---------- POD model ---------- */
function buildPod(st,vsel){vsel=vsel||'#vwP';
  const root=new T.Group();st.scene.add(root);
  try{const pm=new T.PMREMGenerator(st.renderer),es=new T.Scene();es.background=new T.Color(.62,.66,.64);
    const lamp=(w,h,x,y,z,rx,ry,k)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(k,k,k),side:T.DoubleSide}));m.position.set(x,y,z);m.rotation.set(rx,ry,0);es.add(m)};
    lamp(40,40,0,20,0,Math.PI/2,0,4.5);lamp(30,12,-20,7,0,0,Math.PI/2,2.6);lamp(30,12,20,7,6,0,Math.PI/2,2);lamp(30,12,0,7,-20,0,0,1.6);
    st.scene.environment=pm.fromScene(es,.04).texture;pm.dispose();}catch(e){}
  const panel=()=>new T.MeshPhysicalMaterial({color:0xdde2db,roughness:.5,clearcoat:.25,clearcoatRoughness:.4,transparent:true});
  const frameM=M(0xb7beb7,{roughness:.5,metalness:.2}), darkM=M(0x1b2421,{roughness:.7}), plinthM=M(0x39433f,{roughness:.8});
  const fades=[]; function fade(m,base){m.transparent=true;fades.push({m,base:base===undefined?1:base,g:null});return m}
  function reg(group,key){group.traverse(o=>{if(o.material){o.material=o.material.clone();const m=o.material;m.transparent=true;fades.push({m,base:m.userData.base!==undefined?m.userData.base:m.opacity,k:key})}})}

  // ground + plinth
  const ground=new T.Mesh(new T.CircleGeometry(18,64),new T.ShadowMaterial({opacity:.15}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;root.add(ground);
  [8.2,11.5].forEach((r,i)=>{const ring=new T.Mesh(new T.RingGeometry(r,r+.03,96),new T.MeshBasicMaterial({color:0x2d45e3,transparent:true,opacity:.2-i*.08}));ring.rotation.x=-Math.PI/2;ring.position.y=.01;root.add(ring)});
  root.add(bx(10,.267,10,plinthM,0,.467,0));
  [[-4.4,-4.4],[4.4,-4.4],[-4.4,4.4],[4.4,4.4],[0,-4.4],[0,4.4],[-4.4,0],[4.4,0]].forEach(q=>{root.add(cyl(.2,.333,M(0x8b9490,{roughness:.35,metalness:.9}),q[0],.167,q[1],20));root.add(cyl(.3,.05,darkM,q[0],.025,q[1],20))});

  // corner joints between field-assembled panels
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(p=>root.add(bx(.04,8.0,.04,M(0xb2b8b0,{roughness:.7}),p[0]*5.0,4.6,p[1]*5.0)));
  // walls
  const seamM=M(0xb2b8b0,{roughness:.7});const steelM0=M(0xbfc7c7,{roughness:.28,metalness:.9});
  function wall(len,axis,sign,key){
    const g=new T.Group();
    const m=bx(axis==='x'?len:.45,8.0,axis==='x'?.45:len,panel(),axis==='z'?sign*.075:0,4.6,axis==='x'?sign*.075:0);g.add(m);
    for(let i=1;i<3;i++){const o=-len/2+i*len/3;const s=axis==='x'?bx(.05,8.0,.03,seamM,o,4.6,sign*.31):bx(.03,8.0,.05,seamM,sign*.31,4.6,o);g.add(s)}
    if(axis==='x')g.position.z=sign*4.7;else g.position.x=sign*4.7;
    root.add(g);return g;
  }
  const back=wall(9.4,'x',-1),left=wall(9.4,'z',-1),front=wall(9.4,'x',1),right=wall(9.4,'z',1);
  // front details
  const fz=5.0;
  const doorM=M(0xe9ede6,{roughness:.45});
  const door=bx(3,7,.08,doorM,-2.3,4.2,fz+.04);front.add(door);door.position.z-=4.7;
  function fr(x,y,w,h,z){const b=bx(w,h,.1,frameM,x,y,z-4.7);front.add(b)}
  fr(-2.3,7.75,3.1,.1,fz+.05);fr(-2.3,.65,3.1,.1,fz+.05);fr(-3.8,4.2,.1,7.1,fz+.05);fr(-.8,4.2,.1,7.1,fz+.05);
  const glass=M(0x9fd0e0,{roughness:.08,metalness:.2,opacity:.55,transparent:true,emissive:0x1d3a4a});glass.userData.base=.55;
  front.add(bx(1.3,1.3,.03,glass,-2.3,5.4,fz+.1-4.7));
  [[0,.72,1.5,.08],[0,-.72,1.5,.08]].forEach(a=>front.add(bx(a[2],a[3],.06,frameM,-2.3+a[0],5.4+a[1],fz+.1-4.7)));
  [[-.72],[.72]].forEach(a=>front.add(bx(.08,1.5,.06,frameM,-2.3+a[0],5.4,fz+.1-4.7)));
  front.add(bx(.1,1.0,.12,steelM0,-1.05,3.6,fz+.12-4.7));front.add(bx(.3,.08,.1,steelM0,-1.17,3.15,fz+.12-4.7));
  [1.2,3.9,6.6].forEach(y=>front.add(bx(.1,.5,.14,steelM0,-3.82,y,fz+.1-4.7)));
  // sign
  const cvs=document.createElement('canvas');cvs.width=1024;cvs.height=256;const cx=cvs.getContext('2d');
  cx.fillStyle='#dde2db';cx.fillRect(0,0,1024,256);cx.textBaseline='middle';
  cx.font='600 120px Georgia, serif';cx.fillStyle='#1b2421';cx.fillText('POD 1.0',44,96);
  cx.font='500 34px monospace';cx.fillStyle='#5b6663';cx.fillText('powered by',46,192);const wP=cx.measureText('powered by ').width;cx.fillStyle='#2d45e3';cx.fillText('Kaani Intelligence',46+wP+4,192);
  const tex=new T.CanvasTexture(cvs);tex.encoding=T.sRGBEncoding;tex.anisotropy=4;
  const sign=new T.Mesh(new T.PlaneGeometry(3.7,.925),new T.MeshBasicMaterial({map:tex}));sign.position.set(2.3,6.5,fz+.03-4.7);front.add(sign);
  (function(){const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.fillStyle='#dde2db';x.fillRect(0,0,512,128);x.textBaseline='middle';x.font='500 50px Georgia, serif';x.fillStyle='#1b2421';x.fillText('POD 1.0',22,40);x.font='500 22px monospace';x.fillStyle='#5b6663';x.fillText('powered by Kaani Intelligence',22,92);
    const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=4;const m=new T.Mesh(new T.PlaneGeometry(2.4,.6),new T.MeshBasicMaterial({map:t}));m.rotation.y=Math.PI/2;m.position.set(.32,5.2,-1.5);right.add(m);})();
  // Kaani touch interface, right of the door
  (function(){const c=document.createElement('canvas');c.width=512;c.height=768;const x=c.getContext('2d');
    x.fillStyle='#0c110f';x.fillRect(0,0,512,768);x.textBaseline='middle';
    x.fillStyle='#f4f6f2';x.font='600 64px Georgia, serif';x.fillText('kaani',34,70);x.fillStyle='#8f9a96';x.font='500 22px monospace';x.fillText('INTELLIGENCE',36,118);
    x.fillStyle='#d6f2cb';x.beginPath();x.arc(448,70,12,0,7);x.fill();
    [['TEMP','18.0','°C'],['HUMIDITY','85','%'],['CO2','800','ppm']].forEach((r,i)=>{const y=160+i*150;x.fillStyle='#18211e';x.beginPath();x.roundRect?x.roundRect(30,y,452,126,18):x.rect(30,y,452,126);x.fill();x.fillStyle='#8f9a96';x.font='500 22px monospace';x.fillText(r[0],56,y+32);x.fillStyle='#f4f6f2';x.font='500 66px sans-serif';x.fillText(r[1],56,y+86);const w=x.measureText(r[1]).width;x.fillStyle='#8f9a96';x.font='500 28px monospace';x.fillText(r[2],66+w,y+92)});
    x.fillStyle='#d6f2cb';x.font='500 28px monospace';x.fillText('MODE · Cultivation',34,630);x.fillText('All systems normal',34,676);
    x.fillStyle='#18211e';x.fillRect(30,700,452,4);x.fillStyle='#2d45e3';x.fillRect(30,700,300,4);
    const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=4;
    const z=fz+.1-4.7;
    front.add(bx(1.1,1.5,.07,M(0x1b2421,{roughness:.35,metalness:.5}),1.0,5.2,z));
    const scr=new T.Mesh(new T.PlaneGeometry(.9,1.35),new T.MeshBasicMaterial({map:t}));scr.position.set(1.0,5.2,z+.04);front.add(scr);})();
  // left vent slats
  for(let i=0;i<7;i++)left.add(bx(.03,.07,1.8,darkM,-.17,6.2+i*.16,0));
  // roof cap
  const roof=bx(10,.3,10,panel(),0,8.75,0);root.add(roof);[-1,1].forEach(s=>{root.add(bx(.04,.02,10,M(0xb2b8b0,{roughness:.7}),s*10/6,8.905,0),bx(10,.02,.04,M(0xb2b8b0,{roughness:.7}),0,8.905,s*10/6))});const roofG=new T.Group();root.remove(roof);roofG.add(roof);root.add(roofG);

  // ===== roof passive cooling unit, rear service bay, ducts, controller =====
  const foil=M(0x8f9899,{roughness:.3,metalness:1});
  const clad=M(0xd3d9d4,{roughness:.42,metalness:.6});
  const cladD=M(0xa9b2ae,{roughness:.45,metalness:.7});
  const painted=new T.MeshPhysicalMaterial({color:0xf2f4f0,roughness:.38,clearcoat:.5,clearcoatRoughness:.28});
  const blueI=M(0x2b6cb0,{roughness:.55}), greyI=M(0x8e9895,{roughness:.55}), blackI=M(0x161c1a,{roughness:.8});
  const glowM=new T.MeshBasicMaterial({color:0xd6f2cb});
  const V3=(x,y,z)=>new T.Vector3(x,y,z);
  function pipe(pts,r,mat,bend){
    const P=pts.map(q=>V3(q[0],q[1],q[2])),path=new T.CurvePath();let cur=P[0].clone();
    for(let i=1;i<P.length-1;i++){
      const a=P[i-1],b=P[i],c=P[i+1],d1=b.clone().sub(a),d2=c.clone().sub(b);
      const rb=Math.min(bend||.3,d1.length()/2,d2.length()/2);
      const p1=b.clone().sub(d1.clone().normalize().multiplyScalar(rb)),p2=b.clone().add(d2.clone().normalize().multiplyScalar(rb));
      path.add(new T.LineCurve3(cur,p1));path.add(new T.QuadraticBezierCurve3(p1,b.clone(),p2));cur=p2;
    }
    path.add(new T.LineCurve3(cur,P[P.length-1]));
    const m=new T.Mesh(new T.TubeGeometry(path,160,r,16,false),mat);m.castShadow=m.receiveShadow=true;root.add(m);return path;
  }
  function bands(path,ts,r,mat){ts.forEach(t=>{const q=path.getPointAt(t),tg=path.getTangentAt(t);const b=new T.Mesh(new T.TorusGeometry(r+.01,.04,6,20),mat);b.position.copy(q);b.quaternion.setFromUnitVectors(V3(0,0,1),tg);root.add(b)})}
  function cylA(r,len,mat,x,y,z,ax){const m=cyl(r,len,mat,x,y,z,24);if(ax==='z')m.rotation.x=Math.PI/2;else if(ax==='x')m.rotation.z=Math.PI/2;root.add(m);return m}
  function toggles(cx0,y,cz0,w,d){[[-.25,1],[.25,1],[-.25,-1],[.25,-1]].forEach(a=>root.add(bx(.26,.07,.07,steelM0,cx0+a[0]*w,y,cz0+a[1]*(d/2+.02))));[[-.25,1],[.25,1],[-.25,-1],[.25,-1]].forEach(a=>root.add(bx(.07,.07,.26,steelM0,cx0+a[1]*(w/2+.02),y,cz0+a[0]*d)))}
  const hcv=document.createElement('canvas');hcv.width=256;hcv.height=96;(function(){const x=hcv.getContext('2d');x.fillStyle='#d9c48f';x.fillRect(0,0,256,96);for(let i=0;i<256;i+=8){x.fillStyle=i%16?'#c3a768':'#e6d4a3';x.fillRect(i,0,4,96)}x.strokeStyle='rgba(120,90,40,.35)';x.lineWidth=2;for(let j=-96;j<256;j+=14){x.beginPath();x.moveTo(j,0);x.lineTo(j+96,96);x.stroke()}})();
  const honey=new T.CanvasTexture(hcv);honey.encoding=T.sRGBEncoding;

  // --- roof: passive cooling chamber (left) and cabinet (right)
  const RZ=-2.6;
  root.add(bx(3.1,.06,2.7,cladD,-1.6,8.93,RZ),bx(3.1,.06,2.7,cladD,2.2,8.93,RZ));
  root.add(bx(3,.92,2.6,clad,-1.6,9.39,RZ),bx(3.06,.08,2.66,cladD,-1.6,9.89,RZ));
  root.add(bx(3,.92,2.6,clad,2.2,9.39,RZ),bx(3.06,.08,2.66,cladD,2.2,9.89,RZ));
  toggles(-1.6,9.86,RZ,3,2.6);toggles(2.2,9.86,RZ,3,2.6);
  // evaporative pad window on the chamber's outer face
  const hw=new T.Mesh(new T.PlaneGeometry(2.0,.56),new T.MeshStandardMaterial({map:honey,roughness:.9}));hw.rotation.y=-Math.PI/2;hw.position.set(-3.105,9.39,RZ);root.add(hw);
  root.add(bx(.04,.64,2.12,cladD,-3.11,9.39,RZ));
  const hw2=hw.clone();hw2.rotation.y=Math.PI;hw2.scale.set(.9,1,1);hw2.position.set(-1.6,9.39,-3.905);root.add(hw2);
  // condenser exhaust grille on the cabinet
  const gr=new T.Mesh(new T.CircleGeometry(.4,32),darkM);gr.rotation.y=Math.PI/2;gr.position.set(3.705,9.4,RZ);root.add(gr);
  [.4,.27,.14].forEach(r=>{const t=new T.Mesh(new T.TorusGeometry(r,.015,6,32),steelM0);t.rotation.y=Math.PI/2;t.position.set(3.71,9.4,RZ);root.add(t)});
  // junction box on cabinet rear
  root.add(bx(.55,.42,.14,painted,1.1,9.4,-3.97));
  // water pipes between the two units
  cylA(.1,.85,blueI,.3,9.18,RZ-.3,'x');cylA(.1,.85,greyI,.3,9.18,RZ+.3,'x');
  // inflow ducts from front roof penetrations
  [-2.2,-1.0].forEach(x=>{
    cylA(.34,.1,steelM0,x,8.95,3.5,'y');
    const pa=pipe([[x,8.9,3.5],[x,9.2,3.5],[x,9.2,-1.3]],.25,foil,.24);bands(pa,[.12,.3,.5,.62],.25,steelM0);
    cylA(.35,.7,M(0xe6e9e4,{roughness:.45,metalness:.3}),x,9.2,1.9,'z');cylA(.38,.05,steelM0,x,9.2,2.27,'z');cylA(.38,.05,steelM0,x,9.2,1.53,'z');
    cylA(.31,.5,M(0x39433f,{roughness:.5,metalness:.7}),x,9.2,.2,'z');cylA(.27,.22,blackI,x,9.2,-1.15,'z');
  });
  // conditioned-air outflow ducts down the rear wall, discharging into the cabin at 3.5 ft above the floor
  [-1.6,-.6].forEach(x=>{
    const pa=pipe([[x,9.2,-3.9],[x,9.2,-5.35],[x,3.9,-5.35],[x,3.9,-4.95]],.27,foil,.32);bands(pa,[.1,.3,.45,.6,.75,.88],.27,steelM0);
    [5.0,6.6,8.2].forEach(y=>root.add(bx(.3,.12,.16,steelM0,x,y,-5.05)));
    cylA(.36,.07,darkM,x,3.9,-5.01,'z');
    // adjustable louvre vent on the cabin side
    cylA(.32,.05,darkM,x,3.9,-4.5,'z');for(let i=-2;i<=2;i++)root.add(bx(.5,.04,.06,steelM0,x,3.9+i*.1,-4.46));
  });
  // service pad + humidifier + active cooling unit
  // wall-mounted: heavy-duty cantilever shelf bolted to the rear wall, gusset braces back to the wall
  root.add(bx(8.6,.14,1.95,cladD,0,1.13,-5.98));root.add(bx(8.6,.5,.06,darkM,0,1.4,-5.05));
  [-4,-2,0,2,4].forEach(x=>{const g=bx(.12,2.0,.1,steelM0,x,.68,-5.9);g.rotation.x=-1.12;root.add(g);root.add(bx(.3,.3,.05,steelM0,x,.45,-5.03))});
  const H=buildHum();H.scale.setScalar(.8);H.rotation.y=Math.PI;H.position.set(-2.9,1.2,-6.02);root.add(H);
  root.add(bx(2.1,1.5,.05,darkM,-2.9,2.1,-5.03));
  [-.4,0,.4].forEach(o=>cylA(.06,.3,steelM0,-2.9+o,1.7,-5.15,'z'));
  // humidifier fresh-air inlet (left): goose-neck hood, G4 filter, fan, motorised damper
  const ip=pipe([[-3.54,3.46,-5.94],[-3.54,7.1,-5.94],[-3.54,7.1,-6.4],[-3.54,6.6,-6.4]],.25,foil,.3);bands(ip,[.12,.6,.78],.25,steelM0);
  cylA(.34,.55,M(0xe6e9e4,{roughness:.45,metalness:.3}),-3.54,4.2,-5.94,'y');cylA(.37,.05,steelM0,-3.54,3.93,-5.94,'y');cylA(.37,.05,steelM0,-3.54,4.47,-5.94,'y');
  cylA(.31,.5,M(0x39433f,{roughness:.5,metalness:.7}),-3.54,5.0,-5.94,'y');
  root.add(bx(.55,.3,.3,painted,-3.54,5.8,-5.94));cylA(.1,.2,steelM0,-3.54,5.8,-5.7,'z');
  const mesh=new T.Mesh(new T.CircleGeometry(.27,24),M(0x2b3330,{roughness:.8}));mesh.rotation.x=Math.PI/2;mesh.position.set(-3.54,6.58,-6.4);root.add(mesh);
  [4.2,6.0].forEach(y=>root.add(bx(.2,.1,.9,steelM0,-3.54,y,-5.5)));
  // misted-air outlet (right): rises the rear wall to the ceiling distribution line
  const hp=pipe([[-2.26,3.46,-5.94],[-2.26,4.3,-5.94],[-2.26,4.3,-5.45],[-2.26,8.3,-5.45],[-2.26,8.3,-4.95]],.25,foil,.3);bands(hp,[.2,.4,.55,.7,.85],.25,steelM0);
  [5.0,6.6,7.8].forEach(y=>root.add(bx(.3,.12,.5,steelM0,-2.26,y,-5.2)));
  cylA(.34,.07,darkM,-2.26,8.3,-5.01,'z');
  // active cooling unit
  const act=new T.Group();act.position.set(3,1.2,-5.95);act.scale.setScalar(.78);root.add(act);
  const base=slab(2.5,1.7,.12,.2,darkM);act.add(base);
  const body=slab(2.6,1.8,.2,2.55,painted,.04);body.position.y=.2;act.add(body);
  const topc=slab(2.66,1.86,.22,.08,M(0xe2e6e0,{roughness:.4}),.02);topc.position.y=2.72;act.add(topc);
  act.add(bx(1.45,1.9,.02,darkM,-.45,1.4,-.905));
  for(let i=0;i<15;i++)act.add(bx(1.4,.045,.04,M(0x59635f),-.45,.55+i*.12,-.925));
  act.add(bx(.72,.34,.02,M(0x0e1412,{roughness:.2,metalness:.3}),.82,2.2,-.905));act.add(bx(.5,.04,.025,glowM,.82,2.2,-.92));
  const gg=cyl(.17,.06,steelM0,.82,1.5,-.92,24);gg.rotation.x=Math.PI/2;act.add(gg);const gf=cyl(.13,.02,M(0xf5f7f3),.82,1.5,-.955,24);gf.rotation.x=Math.PI/2;act.add(gf);
  act.add(bx(.04,.04,.025,glowM,.6,1.0,-.915),bx(.04,.04,.025,new T.MeshBasicMaterial({color:0xc04cc6}),.74,1.0,-.915));
  const wd=cyl(.66,.04,darkM,0,2.78,0,40);act.add(wd);
  [.66,.46,.26].forEach(r=>{const t=new T.Mesh(new T.TorusGeometry(r,.02,6,40),steelM0);t.rotation.x=Math.PI/2;t.position.y=2.8;act.add(t)});
  const fan=new T.Group();fan.position.y=2.77;for(let i=0;i<5;i++){const b=bx(.55,.015,.2,M(0x3a4642),0,0,0);b.position.x=.3;const h=new T.Group();h.rotation.y=i*Math.PI*2/5;h.add(b);fan.add(h)}act.add(fan);
  // coolant loop, humidifier to active cooling unit
  const lp1=pipe([[1.99,1.7,-5.9],[-1.7,1.7,-5.9]],.12,blueI,.3),lp2=pipe([[1.99,2.1,-5.9],[-1.7,2.1,-5.9]],.12,greyI,.3);
  [1.1,-1.1].forEach(x=>root.add(bx(.12,.6,.2,steelM0,x,1.9,-5.9)));
  root.add(bx(.7,.5,.5,painted,0,1.5,-5.95));cylA(.2,.45,M(0x39433f,{roughness:.5,metalness:.7}),0,1.5,-5.6,'z');
  // controller enclosure
  const ctl=new T.Group();ctl.position.set(.9,5.5,-5.275);root.add(ctl);
  ctl.add(bx(1.8,2.6,.45,painted,0,0,0));
  ctl.add(bx(1.7,2.5,.03,M(0xe9ede6,{roughness:.4}),0,0,-.235));
  ctl.add(bx(1.2,.8,.03,M(0x0c110f,{roughness:.12,metalness:.4}),0,.5,-.26));
  ctl.add(bx(.8,.05,.03,glowM,0,.76,-.28));ctl.add(bx(.04,.04,.03,glowM,-.5,.15,-.28),bx(.04,.04,.03,new T.MeshBasicMaterial({color:0xc04cc6}),-.4,.15,-.28));
  const kc=document.createElement('canvas');kc.width=512;kc.height=160;(function(){const x=kc.getContext('2d');x.fillStyle='#e9ede6';x.fillRect(0,0,512,160);x.textBaseline='middle';x.font='600 84px Georgia, serif';x.fillStyle='#1b2421';x.fillText('kaani',30,62);x.font='500 28px monospace';x.fillStyle='#5b6663';x.fillText('INTELLIGENCE · POD CONTROL',30,128)})();
  const kt=new T.CanvasTexture(kc);kt.encoding=T.sRGBEncoding;kt.anisotropy=4;
  const kp=new T.Mesh(new T.PlaneGeometry(1.5,.47),new T.MeshBasicMaterial({map:kt}));kp.position.set(0,-.55,-.255);kp.rotation.y=Math.PI;ctl.add(kp);
  const lk=cyl(.07,.06,steelM0,.7,-.2,-.26,16);lk.rotation.x=Math.PI/2;ctl.add(lk);
  [-.6,-.2,.2,.6].forEach(x=>ctl.add(cyl(.06,.16,blackI,x,-1.35,0,12)));
  // conduits: controller to humidifier, cooling unit and roof
  pipe([[.3,4.15,-5.275],[.3,3.5,-5.275],[-2.9,3.5,-5.275],[-2.9,3.4,-5.275]],.06,blackI,.2);
  pipe([[.7,4.15,-5.275],[.7,3.5,-5.275],[3.0,3.5,-5.275],[3.0,3.35,-5.275]],.06,blackI,.2);
  pipe([[1.5,6.8,-5.275],[1.5,9.15,-5.275],[1.5,9.15,-4.0]],.06,blackI,.2);
  root.add(bx(.3,.2,.12,painted,-2.9,3.55,-5.2));
  // rear vents inside the cabin handled with the interiors

  // register fade groups
  reg(front,'f');reg(right,'r');reg(roofG,'o');

  // dimensions
  const dimG=new T.Group();root.add(dimG);
  const lm=new T.LineBasicMaterial({color:0x2d45e3,transparent:true,opacity:.9});
  function seg(pts){const g=new T.BufferGeometry().setFromPoints(pts);dimG.add(new T.LineSegments(g,lm))}
  const V=(x,y,z)=>new T.Vector3(x,y,z);
  seg([V(-5,.03,6.2),V(5,.03,6.2),V(-5,.03,5.9),V(-5,.03,6.5),V(5,.03,5.9),V(5,.03,6.5)]);
  seg([V(6.2,.03,-5),V(6.2,.03,5),V(5.9,.03,-5),V(6.5,.03,-5),V(5.9,.03,5),V(6.5,.03,5)]);
  seg([V(-6.2,0,6.2),V(-6.2,10,6.2),V(-6.5,0,6.2),V(-5.9,0,6.2),V(-6.5,10,6.2),V(-5.9,10,6.2)]);
  const lab={w:V(0,.03,6.2),d:V(6.2,.03,0),h:V(-6.2,5,6.2)};
  const els={};document.querySelectorAll(vsel+' .dim').forEach(e=>els[e.dataset.k]=e);
  const tagEls=[...document.querySelectorAll(vsel+' .tag')];
  const tagA={roof:V(-.2,10.1,-2.6),duct:V(-1.1,6.2,-5.6),ctrl:V(1.9,5.6,-5.5),hum:V(-2.9,3.5,-6.2),act:V(4.0,3.4,-6.4),mist:V(0,7.5,-.6),uv:V(3.3,8.4,-1.0),touch:V(1.0,6.1,5.2)};

  // interiors
  const interiors={};
  const floor=new T.Mesh(new T.PlaneGeometry(9.1,9.1),M(0x9ea7a1,{roughness:.8}));floor.rotation.x=-Math.PI/2;floor.position.y=.41;floor.receiveShadow=true;root.add(floor);
  const dum=new T.Object3D();
  function uvLamps(){const g=new T.Group();const tube=new T.MeshBasicMaterial({color:0xb48cff});[[-3.3,-2.7],[-3.3,2.7],[3.3,-2.7],[3.3,2.7]].forEach(q=>{g.add(bx(.3,.1,3.4,M(0xcfd5cd,{roughness:.4,metalness:.5}),q[0],8.52,q[1]));const t=cyl(.05,3.2,tube,q[0],8.44,q[1],10);t.rotation.x=Math.PI/2;g.add(t)});return g}
  function sensors(){const g=new T.Group();[[-3,5.2],[2.5,5.4]].forEach(a=>{g.add(bx(.12,.6,.34,M(0xe3e7e0,{roughness:.5}),4.48,a[1],a[0]));g.add(bx(.03,.06,.06,glowM,4.4,a[1]+.18,a[0]))});return g}
  function mistLine(){const g=new T.Group();const pv=M(0xe6e8e3,{roughness:.5});const p=cyl(.25,9.2,pv,0,8.3,0,24);p.rotation.x=Math.PI/2;g.add(p);
    g.add(bx(.5,.5,.06,pv,0,8.3,4.62));
    [.1,.3,.5,.7,.9].forEach(f=>{const z=-4.6+9.2*f;g.add(cyl(.14,.42,pv,0,7.85,z,16));g.add(cyl(.24,.06,pv,0,7.62,z,20));const hd=new T.Mesh(new T.SphereGeometry(.12,16,12),M(0x2b3330,{roughness:.5}));hd.position.set(0,7.5,z);g.add(hd);g.add(bx(.05,.3,.05,frameM,0,8.58,z))});return g}
  function rack(g,x,z,L,tiers,mat){
    const D=1.8;[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(p=>g.add(bx(.08,7.6,.08,frameM,x+p[0]*(D/2),4.2,z+p[1]*(L/2))));
    tiers.forEach(y=>g.add(bx(D,.06,L,mat,x,y,z)));
  }
  // mushroom
  (function(){
    const g=new T.Group();const sm=M(0xe9ece6,{roughness:.6});const L=5.4,zc=-.1,tiers=[.9,2.3,3.7,5.1,6.5],xs=[-3.2,.2,3.4];
    const n=xs.length*tiers.length*14;const bags=new T.InstancedMesh(new T.CylinderGeometry(.27,.27,.7,10),M(0xd8c9a2,{roughness:.9}),n);bags.castShadow=true;
    const caps=new T.InstancedMesh(new T.SphereGeometry(.2,8,6),M(0xf0e9dc,{roughness:.8}),n);
    let k=0;const col=new T.Color();
    xs.forEach(x=>{rack(g,x,zc,L,tiers,sm);tiers.forEach(y=>{[-.45,.45].forEach(ox=>{for(let i=0;i<7;i++){const z=zc-2.4+i*.8;dum.position.set(x+ox,y+.38,z);dum.scale.set(1,1,1);dum.updateMatrix();bags.setMatrixAt(k,dum.matrix);col.setHSL(.11,.3,.62+Math.random()*.1);bags.setColorAt(k,col);dum.position.y=y+.78;dum.scale.set(1,.55+Math.random()*.4,1);dum.updateMatrix();caps.setMatrixAt(k,dum.matrix);k++}})})});
    g.add(bags,caps);
    g.add(sensors(),mistLine(),uvLamps());
    for(let i=0;i<3;i++){g.add(bx(.12,.04,5.6,new T.MeshBasicMaterial({color:0xfffbea}),xs[i]-1.6+1.6,8.5,zc))}
    interiors.mush={g,light:0xfff2d8};
  })();
  // saffron
  (function(){
    const g=new T.Group();const tm=M(0x3a4440,{roughness:.8});const soil=M(0x3b2f27,{roughness:1});const L=5.4,zc=-.1,tiers=[.9,2.2,3.5,4.8,6.1,7.4],xs=[-3.2,.2,3.4];
    const per=3*13,n=xs.length*tiers.length*per;const fl=new T.InstancedMesh(new T.SphereGeometry(.1,8,6),M(0x8b3fb0,{roughness:.6,emissive:0x2a0a38}),n);
    let k=0;
    xs.forEach(x=>{rack(g,x,zc,L,tiers,tm);tiers.forEach(y=>{g.add(bx(1.5,.1,5.2,soil,x,y+.1,zc));
      g.add(bx(1.4,.04,5,new T.MeshBasicMaterial({color:0xe070e8}),x,y+1.1,zc));
      for(let c=0;c<3;c++)for(let i=0;i<13;i++){dum.position.set(x-.5+c*.5,y+.22,zc-2.3+i*.38);dum.scale.set(1,1,1);dum.updateMatrix();fl.setMatrixAt(k++,dum.matrix)}})});
    g.add(fl);
    g.add(sensors(),mistLine(),uvLamps());
    interiors.saffron={g,light:0xff86ee};
  })();
  // clean room
  (function(){
    const g=new T.Group();const hepa=new T.MeshBasicMaterial({color:0xffffff});const st2=M(0xcfd5d7,{roughness:.25,metalness:.85});
    for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const p=new T.Mesh(new T.PlaneGeometry(1.8,1.8),hepa);p.rotation.x=Math.PI/2;p.position.set(a*3,8.58,b*3);g.add(p)}
    [[-1.8,-.6],[2.4,-.6]].forEach(p=>{g.add(bx(5,.12,1.8,st2,p[0],2.9,p[1]));[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(q=>g.add(bx(.1,2.5,.1,st2,p[0]+q[0]*2.3,1.6,p[1]+q[1]*.75)));g.add(bx(4.6,.08,1.5,st2,p[0],1.2,p[1]))});
    g.add(bx(2,6,1.2,M(0xf1f3f1,{roughness:.5}),-3.4,3.4,-3.8));g.add(bx(1,.05,.05,frameM,-3.4,6.3,-3.18));
    g.add(bx(.8,.8,.8,st2,-4.2,3.5,1.6));
    g.add(bx(1.6,1.6,.04,new T.MeshBasicMaterial({color:0xcfe9ff}),2.5,3.4,-4.5));
    interiors.clean={g,light:0xdff4ff,floor:0xc8d3d8};
  })();
  Object.values(interiors).forEach(o=>{o.g.visible=false;root.add(o.g)});
  const pl1=new T.PointLight(0xfff2d8,.9,18,1.6);pl1.position.set(-1,7.8,1.5);const pl2=pl1.clone();pl2.position.set(1.5,7.8,-2.5);root.add(pl1,pl2);

  const api={variant:'mush',cut:false,op:1,tags:[],dimsOn:true,humT:0,humO:0,setVariant(v){this.variant=v;Object.keys(interiors).forEach(k=>interiors[k].g.visible=(k===v));const o=interiors[v];pl1.color.setHex(o.light);pl2.color.setHex(o.light);floor.material.color.setHex(o.floor||(v==='saffron'?0x59605c:0x9ea7a1))},setCut(c){this.cut=c}};
  api.root=root;api.tagA=tagA;api.setCutAmt=function(a){this.cutV=1-.93*Math.min(1,Math.max(0,a))};api.setVariant('mush');
  const pv=new T.Vector3();
  api.update=function(dt,t){
    if(this.cutV!==undefined)this.op=this.cutV;else{const target=this.cut?.07:1;this.op+=(target-this.op)*(1-Math.pow(.0005,dt))}
    fades.forEach(f=>{const hide=f.k==='f'||f.k==='r'||f.k==='o';const o=hide?this.op:1;f.m.opacity=f.base*o;f.m.depthWrite=o>.95;});
    pl1.intensity=pl2.intensity=1.1*(1-this.op);
    if(!reduce)fan.rotation.y+=dt*2.2;
    this.humO+=(this.humT-this.humO)*(1-Math.pow(.003,dt));H.userData.hinge.rotation.y=-1.95*this.humO;
    tagEls.forEach(e=>{const k=e.dataset.a,a=tagA[k];if(!a||this.tags.indexOf(k)<0){e.style.opacity=0;return}pv.copy(a).project(st.cam);if(pv.z>1){e.style.opacity=0;return}e.style.opacity=1;const px=clamp((pv.x*.5+.5)*st.w,24,st.w-(st.w<600?150:190)),py=clamp((-pv.y*.5+.5)*st.h,90,st.h-110);e.style.transform='translate('+px+'px,'+py+'px) translate(-14px,-50%)'});
    dimG.visible=this.dimsOn;
    ['w','d','h'].forEach(k=>{const e=els[k];if(!e)return;if(!this.dimsOn){e.style.opacity=0;return}pv.copy(lab[k]).project(st.cam);if(pv.z>1){e.style.opacity=0;return}e.style.opacity=1;const px=clamp((pv.x*.5+.5)*st.w,48,st.w-48),py=clamp((-pv.y*.5+.5)*st.h,60,st.h-130);e.style.transform='translate('+px+'px,'+py+'px) translate(-50%,-50%)'});
  };
  return api;
}
Object.assign(AK,{T,clamp,reduce,Orbit,makeStage,lights,M,bx,cyl,slab,buildHum,buildPod});
})();

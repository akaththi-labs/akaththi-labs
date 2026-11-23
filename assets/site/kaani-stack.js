(function(){
const SC={
  ok:{t:'Everything connected.',d:'The node holds the climate, the stack supervises on-site, the cloud learns, and your team sees it live.',st:{pod:['Controlling','ok'],edge:['Supervising','ok'],cloud:['Learning','ok'],app:['Live view','ok']},ln:{a:1,b:1,c:1},keep:['Climate held on target','Data flowing to every layer']},
  net:{t:'Internet down. The farm keeps running.',d:'Control lives in the node and on the on-site stack, not in the cloud. Readings are stored locally and sync when the connection returns.',st:{pod:['Controlling','ok'],edge:['Running on-site','warn'],cloud:['Waiting for data','warn'],app:['Last known view','warn']},ln:{a:1,b:0,c:1},keep:['Climate control unaffected','Nothing is lost, it queues','Syncs on reconnect']},
  edge:{t:'On-site stack offline. The POD carries on.',d:'Each POD has its own node, so the climate holds on its last plan. The cloud notices the silence and tells your team.',st:{pod:['Running on its own','warn'],edge:['Offline','off'],cloud:['Stack went silent','warn'],app:['Alert sent','warn']},ln:{a:0,b:0,c:1},keep:['Climate held by the node','Team alerted','Resumes when the stack returns']},
  sensor:{t:'Sensor fault. A bad reading is never trusted.',d:'When readings stop making sense, the node moves equipment to a safe state rather than guessing, and tells your team.',st:{pod:['Safe state','safe'],edge:['Alert raised','warn'],cloud:['Event logged','ok'],app:['Alert on phone','warn']},ln:{a:1,b:1,c:1},keep:['Equipment held safe','Alert reaches the farm team','Event kept in the record']},
  power:{t:'Power cut. The POD fails safe.',d:'The fresh-air damper closes by itself, so an outage cannot pull outside air over the crop. Kaani notices the POD went quiet and alerts your team.',st:{pod:['Fails safe','safe'],edge:['Alert raised','warn'],cloud:['POD went silent','warn'],app:['Alert: POD offline','warn']},ln:{a:0,b:1,c:1},keep:['Damper closes on its own','Silence is detected','Team alerted']}
};
const PULSE=[['pod','Reacts instantly'],['edge','Spots anomalies on-site'],['cloud','Learns across farms'],['app','Tells your team']];
function build(svg){
  const cx=300,A=95,B=47,TH=16;
  const L=[{id:'app',cy:40,n:'Cultivator app',b:'Phones and screens',c:'#0b1310'},{id:'cloud',cy:240,n:'Kaani cloud',b:'Learns across farms',c:'#3a78c2'},{id:'edge',cy:440,n:'Kaani stack',b:'On-site · Kaani edge',c:'#e0457b'},{id:'pod',cy:640,n:'Kaani node',b:'Inside every POD',c:'#2d45e3'}];
  const P=(y,u,v)=>[cx+(u-v)*A,y+(u+v)*B],pt=a=>a.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ');
  function cube(x,y,s,h,t,l,r,extra){const a=s*A,b=s*B;return `<g ${extra||''}><polygon points="${pt([[x-a,y-h],[x,y-h+b],[x,y+b],[x-a,y]])}" fill="${l}"/><polygon points="${pt([[x+a,y-h],[x,y-h+b],[x,y+b],[x+a,y]])}" fill="${r}"/><polygon points="${pt([[x,y-h-b],[x+a,y-h],[x,y-h+b],[x-a,y-h]])}" fill="${t}"/></g>`}
  const pc=(k)=>{const yy=464-k*21;return `<g class="pc pc${k}">`+cube(cx,yy,.5,14,'#2f3b36','#1a2320','#0f1512')+`<circle class="pls" cx="${cx+.16*A}" cy="${yy-3}" r="3.2" fill="#d070d6"/><line x1="${cx-.4*A}" y1="${yy-2}" x2="${cx-.08*A}" y2="${yy+.14*B-2}" stroke="#555f5b" stroke-width="1.5"/></g>`};
  let h=`<defs>
    <linearGradient id="bg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2d45e3"/><stop offset=".5" stop-color="#e0457b"/><stop offset="1" stop-color="#3a78c2"/></linearGradient>
    ${L.map(l=>`<linearGradient id="g-${l.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".96"/><stop offset="1" stop-color="${l.c}" stop-opacity=".16"/></linearGradient>`).join('')}
    <filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="sh" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#0b1310" flood-opacity=".14"/></filter></defs>`;
  h+=`<path d="M44 350V690" stroke="#0b1310" stroke-width="2" fill="none"/><text class="br-t" transform="translate(28 520) rotate(-90)" text-anchor="middle">CONTROL · LOCAL</text>`;
  h+=`<path d="M44 -30V300" stroke="#e0457b" stroke-width="2" fill="none"/><text class="br-t" transform="translate(28 135) rotate(-90)" text-anchor="middle" style="fill:#e0457b">INTELLIGENCE · ADVISES</text>`;
  const content={
    pod:y=>{const n=[[-.62,.3],[.62,-.3],[.05,.78]].map(q=>P(y,q[0],q[1]));return n.map(q=>`<line class="dash" x1="${q[0]}" y1="${q[1]}" x2="${cx}" y2="${y+8}" stroke="#2d45e3" stroke-width="2"/>`).join('')+n.map(q=>cube(q[0],q[1],.17,7,'#d6f2cb','#9fc9a5','#7cb289')+`<circle class="pls" cx="${q[0]}" cy="${q[1]-12}" r="3.5" fill="#2d45e3"/>`).join('')+cube(cx,y+8,.46,70,'#ffffff','#e1e6df','#c3cac0','class="glow"')+cube(cx,y+8-70,.22,10,'#cfd5cd','#b2b9b1','#99a199')},
    edge:y=>pc(1)+pc(2)+pc(3),
    cloud:y=>`<g class="flt"><path class="glow" transform="translate(${cx-82} ${y-86}) scale(3.4)" d="M14 34a8 8 0 0 1-1-15.9A11 11 0 0 1 34 16a9 9 0 0 1 1 18z" fill="#fff" stroke="#3a78c2" stroke-width="1"/><g transform="translate(${cx-82} ${y-86}) scale(3.4)" fill="none" stroke="#3a78c2" stroke-width=".9" opacity=".7"><path d="M17 27h14M17 22h9"/></g></g>`+[[-.55,.5],[0,.7],[.55,.5]].map(q=>{const r=P(y,q[0],q[1]);return cube(r[0],r[1],.13,20,'#cfe0f3','#9fbddf','#7ea4d0')}).join(''),
    app:y=>`<g class="flt"><rect class="glow" x="${cx-72}" y="${y-92}" width="54" height="100" rx="10" fill="#0b1310"/><rect x="${cx-67}" y="${y-86}" width="44" height="88" rx="6" fill="#d6f2cb"/><rect x="${cx-62}" y="${y-76}" width="34" height="6" rx="3" fill="#2d45e3"/><rect x="${cx-62}" y="${y-62}" width="34" height="16" rx="3" fill="#fff" opacity=".8"/><rect x="${cx-62}" y="${y-42}" width="34" height="16" rx="3" fill="#fff" opacity=".8"/><rect class="glow" x="${cx-6}" y="${y-70}" width="96" height="70" rx="9" fill="#0b1310"/><rect x="${cx-1}" y="${y-65}" width="86" height="60" rx="5" fill="#e9ecff" /><rect x="${cx+6}" y="${y-56}" width="40" height="6" rx="3" fill="#3a78c2"/><path d="M${cx+6} ${y-20}l14-14 12 8 16-18 20 14" fill="none" stroke="#2d45e3" stroke-width="3" stroke-linecap="round"/></g>`
  };
  L.slice().reverse().forEach(l=>{
    const y=l.cy,T=[P(y,-1,-1),P(y,1,-1),P(y,1,1),P(y,-1,1)];
    h+=`<g class="L" data-l="${l.id}" filter="url(#sh)">`+
      `<polygon points="${pt([T[3],T[2],[T[2][0],T[2][1]+TH],[T[3][0],T[3][1]+TH]])}" fill="${l.c}" opacity=".35"/>`+
      `<polygon points="${pt([T[1],T[2],[T[2][0],T[2][1]+TH],[T[1][0],T[1][1]+TH]])}" fill="${l.c}" opacity=".55"/>`+
      `<polygon class="top" points="${pt(T)}" fill="url(#g-${l.id})" stroke="${l.c}" stroke-width="2" stroke-opacity=".7"/>`+
      `<polygon class="ring" points="${pt(T)}" stroke="${l.c}"/>`+
      [-.5,0,.5].map(o=>`<line x1="${P(y,o,-1)[0]}" y1="${P(y,o,-1)[1]}" x2="${P(y,o,1)[0]}" y2="${P(y,o,1)[1]}" stroke="${l.c}" stroke-opacity=".12"/><line x1="${P(y,-1,o)[0]}" y1="${P(y,-1,o)[1]}" x2="${P(y,1,o)[0]}" y2="${P(y,1,o)[1]}" stroke="${l.c}" stroke-opacity=".12"/>`).join('')+
      `<polygon points="${pt([P(y,-.86,-.86),P(y,.86,-.86),P(y,.86,.86),P(y,-.86,.86)])}" fill="none" stroke="${l.c}" stroke-opacity=".4" stroke-dasharray="3 5"/>`+
      content[l.id](y)+`</g>`;
  });
  [['a',640,440],['b',440,240],['c',240,40]].forEach(q=>{const y1=q[1]-(q[0]==='a'?96:30),y2=q[2]+(q[0]==='c'?0:26);h+=`<g class="beam" data-k="${q[0]}"><line x1="${cx}" y1="${y1}" x2="${cx}" y2="${y2}"/>`+[0,.6,1.2].map(d=>`<circle class="dot" r="5" fill="#fff" stroke="#e0457b" stroke-width="2"><animateMotion dur="1.8s" begin="${d}s" repeatCount="indefinite" path="M${cx} ${y1} L${cx} ${y2}"/></circle>`).join('')+`<g class="xm" transform="translate(${cx} ${(y1+y2)/2})"><circle r="13" fill="#fff" stroke="#c2412f" stroke-width="2"/><path d="M-6 -6l12 12M6 -6l-12 12" stroke="#c2412f" stroke-width="2.5" stroke-linecap="round"/></g></g>`});
  h+=`<g class="net" id="netN" transform="translate(${cx} 343)"><circle r="26" fill="#fff" stroke="#0b1310" stroke-opacity=".25" stroke-width="2" class="glow"/><g class="wf" fill="none" stroke="#3a78c2" stroke-width="2.4" stroke-linecap="round"><path d="M-14 -3a20 20 0 0 1 28 0"/><path d="M-8 4a12 12 0 0 1 16 0"/><circle r="2.5" cx="0" cy="11" fill="#3a78c2"/></g><path class="slash" d="M-18 -18L18 18" stroke="#c2412f" stroke-width="3.5" stroke-linecap="round"/></g>`;
  h+=`<text class="lb" x="${cx+38}" y="338">Internet</text><text class="ls" id="netT" x="${cx+38}" y="362"></text>`;
  h+=`<g class="badge-off"><rect x="${cx+296}" y="330" width="200" height="32" rx="16" fill="#fff" stroke="#a2680b"/><text x="${cx+396}" y="352" text-anchor="middle" font-family="var(--mono)" font-size="16" fill="#a2680b" letter-spacing=".08em">OFFLINE MODE</text></g>`;
  L.forEach(l=>{h+=`<line x1="${cx+A*2+10}" y1="${l.cy}" x2="522" y2="${l.cy}" stroke="${l.c}" stroke-opacity=".45" stroke-dasharray="2 5"/><circle cx="522" cy="${l.cy}" r="4" fill="${l.c}"/><text class="ln" x="540" y="${l.cy-12}">${l.n}</text><text class="lb" x="540" y="${l.cy+14}">${l.b}</text><text class="ls" data-st="${l.id}" x="540" y="${l.cy+42}"></text>`});
  svg.innerHTML=h;
  const wrap=svg.parentNode;let pT=null,pi=0,cT=null,cn=1;
  const g=id=>svg.querySelector('[data-l="'+id+'"]');
  const ctl={
    hl(id){L.forEach(l=>{const e=g(l.id);e.classList.toggle('dim',!!id&&l.id!==id);e.classList.toggle('hl',l.id===id)})},
    show(k,ids){const c=SC[k];
      for(const l in c.st){const e=svg.querySelector('[data-st="'+l+'"]');e.textContent=c.st[l][0];e.setAttribute('class','ls '+c.st[l][1]);const x=g(l);x.classList.remove('ok','warn','off','safe');x.classList.add(c.st[l][1])}
      for(const l in c.ln)svg.querySelector('[data-k="'+l+'"]').setAttribute('class','beam'+(c.ln[l]?'':' down'));
      const off=!c.ln.b;wrap.classList.toggle('offl',k==='net');svg.querySelector('#netN').setAttribute('class','net'+(off?' down':''));
      const nt=svg.querySelector('#netT');nt.textContent=off?'Disconnected':'Connected';nt.setAttribute('class','ls '+(off?'warn':'ok'));return c},
    pulse(on){clearInterval(pT);if(!on){ctl.hl(null);ctl.show('ok');return}
      const step=()=>{const p=PULSE[pi%4];ctl.hl(p[0]);svg.querySelectorAll('[data-st]').forEach(e=>{e.textContent=e.dataset.st===p[0]?p[1]:'';e.setAttribute('class','ls ok')});pi++};
      step();pT=setInterval(step,1500)},
    pcs(n){clearInterval(cT);for(let i=1;i<=3;i++)svg.querySelector('.pc'+i).style.opacity=i<=n?1:.18},
    grow(on){clearInterval(cT);const set=n=>{for(let i=1;i<=3;i++)svg.querySelector('.pc'+i).style.opacity=i<=n?1:.18};
      if(!on){set(3);return}cn=1;set(1);cT=setInterval(()=>{cn=cn%3+1;set(cn)},1400)}
  };
  ctl.show('ok');return ctl;
}
window.AKStack={build,SC};
})();

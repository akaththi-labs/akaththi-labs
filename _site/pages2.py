from common import *
import math
G,V,B,A,K='#2d45e3','#e0457b','#3a78c2','#d68a0c','#0b1310'
def fs(eyebrow,h,p,visual,rev=False,extra=''):
    return f'<section class="fs{" rev" if rev else ""}"><div class="fx"><span class="eyebrow">{eyebrow}</span><h2>{h}</h2><p>{p}</p>{extra}</div><div class="fv">{visual}</div></section>\n'
# ---------------- HUMIDIFIER ----------------
steps=[('Opens from the top.','The lid lifts and the tank is open to the light. Wipe it clean by hand.'),('Wipes clean.','A smooth moulded body, with nothing to catch.'),('The filter pulls out.','A washable foam filter slides out of the side. No tools.'),('Seen across the room.','A status light bar and display tell you at a glance. One switch turns it on and off.'),('Air out where you need it.','A round outlet on top takes your own duct, high, low or long.'),('Easy to move.','Wheels, and a strong handle on each end.'),('Three connections, all at the back.','Power, water in and drain.')]
st=''.join(f'    <article class="step" data-s="{i+1}"><div class="sc"><span class="k">0{i+1}</span><h2>{h}</h2><p>{p}</p></div></article>\n' for i,(h,p) in enumerate(steps))
def dots(path,n,dur,col,r=3.6):
    return ''.join(f'<circle r="{r}" fill="{col}"><animateMotion dur="{dur}s" begin="{-i*dur/n:.2f}s" repeatCount="indefinite" path="{path}"/></circle>' for i in range(n))
P1="M92 190H196";P2="M388 190H514";PR="M352 276V322H150";PD="M606 296V336H700"
def cyl(x,lab,sub):
    return f'<g><rect x="{x}" y="128" width="52" height="120" rx="12" fill="#fff" stroke="currentColor" stroke-width="2"/><rect x="{x}" y="176" width="52" height="72" rx="12" fill="{B}" fill-opacity=".18"/><line x1="{x+10}" y1="140" x2="{x+10}" y2="236" stroke="currentColor" stroke-opacity=".2"/><text x="{x+26}" y="116" text-anchor="middle" style="font-size:9.5px">{lab}</text><text x="{x+26}" y="266" text-anchor="middle" class="m" style="font-size:9px">{sub}</text></g>'
water=f'''<svg class="dg" id="wt" viewBox="0 0 760 370" role="img" aria-label="Water path: mains water passes through a three stage RO stack into the humidifier, which makes mist at the top and sends a drain line to the floor.">
<g stroke="{K}" stroke-opacity=".55" stroke-width="5" fill="none" stroke-linecap="round"><path d="{P1}"/><path d="{P2}"/><path d="{PR}" stroke-width="3.5"/><path d="{PD}" stroke-width="3.5"/><path d="M196 190H200M404 190V190"/></g>
<g stroke="{B}" stroke-opacity=".35" stroke-width="2" fill="none"><path d="{P1}"/><path d="{P2}"/><path d="{PR}"/><path d="{PD}"/></g>
<g><rect x="30" y="176" width="26" height="28" rx="4" fill="#fff" stroke="{K}" stroke-opacity=".6" stroke-width="2"/><rect x="56" y="184" width="36" height="12" fill="{K}" fill-opacity=".14"/><circle cx="43" cy="160" r="7" fill="none" stroke="{K}" stroke-opacity=".6" stroke-width="2"/><line x1="43" y1="167" x2="43" y2="176" stroke="{K}" stroke-opacity=".6" stroke-width="2"/><text x="60" y="230" text-anchor="middle">Water in</text><text x="60" y="248" text-anchor="middle" class="m" style="font-size:10.5px">Mains</text></g>
<g id="ro" class="ours" color="{K}">{cyl(206,"Sediment","5 µm")}{cyl(266,"Carbon","Chlorine")}{cyl(326,"Membrane","RO")}
<rect x="196" y="96" width="192" height="190" rx="12" fill="none" stroke="{B}" stroke-width="2" stroke-dasharray="6 5" id="rob"/><text x="292" y="80" text-anchor="middle" font-weight="600" id="rot">Akaththi RO stack</text></g>
<g transform="translate(514 90)"><rect width="184" height="206" rx="14" fill="#fff" stroke="{K}" stroke-opacity=".55" stroke-width="2"/>
<rect x="16" y="14" width="152" height="14" rx="7" fill="#d9f0e4"/><text x="92" y="25" text-anchor="middle" style="font-size:10px">Status</text>
<rect x="16" y="94" width="104" height="92" rx="8" fill="{B}" fill-opacity=".1" stroke="{B}" stroke-opacity=".5"/>
<path d="M16 130Q42 118 68 130T120 130V186H16Z" fill="{B}" fill-opacity=".35"><animateTransform attributeName="transform" type="translate" values="0 0;-8 0;0 0" dur="3s" repeatCount="indefinite"/></path>
<text x="68" y="112" text-anchor="middle" class="m" style="font-size:10.5px">Water</text>
<circle cx="146" cy="142" r="17" fill="none" stroke="{K}" stroke-opacity=".5" stroke-width="2"/><path d="M146 130v24M134 142h24" stroke="{K}" stroke-opacity=".35" stroke-width="2"><animateTransform attributeName="transform" type="rotate" from="0 146 142" to="360 146 142" dur="2.4s" repeatCount="indefinite"/></path><text x="146" y="178" text-anchor="middle" class="m" style="font-size:10px">Pump</text>
<rect x="76" y="-12" width="32" height="14" rx="4" fill="{K}" fill-opacity=".5"/>
<text x="92" y="64" text-anchor="middle" font-weight="600">Humidifier 1.0</text></g>
<g fill="{B}" fill-opacity=".5">{''.join(f'<circle cx="{606+(i%3-1)*14}" cy="76" r="4"><animate attributeName="cy" values="76;30" dur="{1.8+i*.2:.1f}s" begin="{i*.35}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".7;0" dur="{1.8+i*.2:.1f}s" begin="{i*.35}s" repeatCount="indefinite"/></circle>' for i in range(6))}</g>
<text x="606" y="18" text-anchor="middle" class="m">Fine mist, to the room</text>
{dots(P1,3,3,B)}{dots(P2,3,3,B)}{dots(PR,3,4,B,3)}{dots(PD,3,3,B,3)}
<text x="250" y="344" text-anchor="middle" class="m" style="font-size:10.5px">Reject to drain</text><text x="652" y="354" text-anchor="middle" class="m" style="font-size:10.5px">Drain</text>
</svg>
<div class="tl" role="group" aria-label="Water source"><button class="chip" data-ro="have" aria-pressed="false">Have RO? Connect it.</button><button class="chip" data-ro="add" aria-pressed="true">Don’t? Add our RO stack.</button></div>
<p class="note-s" style="text-align:center" id="rotn">Our three stage RO stack sits between the mains and the humidifier.</p>'''
hum=head('Humidifier 1.0 · Akaththi Labs','Humidifier 1.0, a high-efficiency humidification unit.',False)+nav('hum')+f'''<section class="pagehero" style="padding-bottom:10px"><div class="wrap"><span class="eyebrow">Humidifier 1.0</span><h1>You have the farm. <em>Now, the humidity.</em></h1><p>Humidity held exactly as your crops expect, built to be cleaned, moved and trusted.</p></div></section>
<section class="tour stage" id="humTour" data-s="0">
  <div class="stick" style="height:calc(100svh - 0px)">
    <div class="viewer full" id="vwH2"><canvas id="cvH2" role="img" aria-label="Interactive 3D model of Humidifier 1.0. Scroll to open its lid and turn it."></canvas></div>
    <nav class="dots" aria-label="Highlights"></nav>
  </div>
  <div class="steps">
    <article class="step" data-s="0" aria-hidden="true"></article>
{st}  </div>
</section>
<div class="wrap">
'''+fs('Water','It runs on RO water.','Two simple paths: bring your own RO, or add ours.',water,True)+'</div>'+enquire('Talk to us about <em>Humidifier 1.0.</em>')+foot('<script src="vendor/three.min.js"></script><script src="engine.js"></script><script src="ui.js"></script><script src="humidifier.js"></script>')
open(STAGE+'humidifier.html','w').write(hum)

# ---------------- KAANI ----------------
names=[('Kaani node','The controller and logic inside every POD.',G),('Kaani stack','On-site hardware that sits beside your farm and runs Kaani edge.',V),('Kaani edge','The on-site services that run on the Kaani stack.',V),('Kaani cloud','The cloud layer that learns across farms.',B)]
ncards=''.join(f'<div class="vcard" style="border-top:3px solid {c}"><span class="k" style="color:{c}">{n.split()[0]} {n.split()[1]}</span><h3>{n}</h3><p>{d}</p></div>' for n,d,c in names)
# day loop
nodes=['Plan','Grow','Harvest','Sell','Improve']
loop=f'''<svg class="dg" viewBox="0 0 520 420" role="img" aria-label="A loop from plan to grow to harvest to sell to improve, and back to the next plan.">
<circle cx="260" cy="210" r="140" fill="none" stroke="{K}" stroke-opacity=".15" stroke-width="2"/>
<path id="lp" d="M260 70A140 140 0 1 1 259.9 70" fill="none" stroke="{V}" stroke-width="3" stroke-dasharray="6 7" class="dash"/>
{''.join(f'<g transform="translate({260+140*math.sin(i*2*math.pi/5):.1f} {210-140*math.cos(i*2*math.pi/5):.1f})"><circle r="38" fill="#fff" stroke="{G}" stroke-width="2"/><text text-anchor="middle" y="4" font-weight="500" style="font-size:12.5px">{n}</text></g>' for i,n in enumerate(nodes))}
<text x="260" y="206" text-anchor="middle" font-weight="600" style="font:600 18px var(--display)">Kaani</text><text x="260" y="226" text-anchor="middle" class="m">next plan, smarter</text>
<circle r="8" fill="{V}"><animateMotion dur="10s" repeatCount="indefinite" path="M260 70A140 140 0 1 1 259.9 70"/></circle></svg>'''
# offline sync
sync=f'''<svg class="dg" id="sy" viewBox="0 0 600 260" role="img" aria-label="Readings are stored on-site when the internet is down, then sync to the cloud when it returns.">
<rect x="30" y="90" width="110" height="80" rx="12" fill="#fff" stroke="{G}" stroke-width="2"/><text x="85" y="135" text-anchor="middle">POD</text>
<rect x="245" y="90" width="110" height="80" rx="12" fill="#fff" stroke="{V}" stroke-width="2"/><text x="300" y="125" text-anchor="middle">On-site</text><text x="300" y="143" text-anchor="middle">stack</text>
<path d="M455 70Q440 70 440 90Q420 90 420 108A16 16 0 0 0 436 124H520A22 22 0 0 0 524 82A32 32 0 0 0 470 70Z" fill="#fff" stroke="{B}" stroke-width="2"/><text x="478" y="108" text-anchor="middle" style="font-size:11px">Cloud</text>
<line class="dash" x1="140" y1="130" x2="245" y2="130" stroke="{G}" stroke-width="3"/>
<g id="up"><line class="dash" x1="355" y1="130" x2="425" y2="130" stroke="{B}" stroke-width="3"/></g>
<g id="cut" opacity="0"><circle cx="390" cy="130" r="14" fill="#fff" stroke="#c2412f" stroke-width="2"/><path d="M383 123l14 14M397 123l-14 14" stroke="#c2412f" stroke-width="2.5" stroke-linecap="round"/></g>
<g id="q">{''.join(f'<rect x="{262+(i%4)*20}" y="{196-(i//4)*14}" width="16" height="10" rx="3" fill="{V}"/>' for i in range(8))}</g>
<text x="300" y="236" text-anchor="middle" class="m" id="syt">Everything is stored on-site while the internet is down.</text></svg>
<div class="tl"><button class="chip" data-sy="off" aria-pressed="true">Internet down</button><button class="chip" data-sy="on" aria-pressed="false">Back online</button></div>'''
phones='''<div class="phones"><div class="ph"><h4>Alerts</h4><div class="al"><i style="--c:#d68a0c"></i><div><b>Humidity drifting</b><span>Chennai · POD 2 · Kaani is correcting</span></div></div><div class="al"><i style="--c:#2d45e3"></i><div><b>Harvest window opens</b><span>Salem · POD 1 · Tomorrow morning</span></div></div><div class="al"><i style="--c:#e0457b"></i><div><b>Sterilise complete</b><span>Coimbatore · POD 3 · Ready to load</span></div></div></div>
<div class="ph"><h4>Today’s checklist</h4><label class="ck"><input type="checkbox" checked><span>Check door seals</span></label><label class="ck"><input type="checkbox"><span>Clean the air filter</span></label><label class="ck"><input type="checkbox"><span>Start the harvest SOP</span></label><label class="ck"><input type="checkbox"><span>Log substrate batch</span></label></div></div>'''
crops='''<div class="crops" id="crops"><div class="crop" style="--c:#2d45e3"><i>Ps</i><div><b>Oyster mushrooms</b><span>Included with every POD</span></div><button class="btn done" disabled>Included</button></div><div class="crop" style="--c:#d68a0c"><i>Sf</i><div><b>Saffron</b><span>Crop pack · added by update</span><div class="bar"><u></u></div></div><button class="btn solid" data-inst>Add pack</button></div></div>'''
def mini_sites(n,cx,cy):
    return ''.join(f'<rect x="{cx-52+(i%3)*36}" y="{cy-22+(i//3)*30}" width="26" height="22" rx="4" fill="#fff" stroke="{G}" stroke-width="1.5"/>' for i in range(n))
def apod(x,y,k=1):
    return f'<g transform="translate({x} {y}) scale({k})"><rect x="-24" y="-20" width="48" height="40" rx="3" fill="#fff" stroke="{K}" stroke-width="1.8"/><rect x="-19" y="-14" width="14" height="30" rx="1.5" fill="{G}" fill-opacity=".14" stroke="{K}" stroke-opacity=".6"/><rect x="2" y="-8" width="16" height="8" fill="{K}" fill-opacity=".18"/><rect x="-16" y="-27" width="14" height="7" rx="1.5" fill="#e7ece5" stroke="{K}" stroke-opacity=".6"/><rect x="2" y="-27" width="14" height="7" rx="1.5" fill="#e7ece5" stroke="{K}" stroke-opacity=".6"/><rect x="-22" y="20" width="44" height="3" fill="{K}" fill-opacity=".3"/></g>'
def astack(x,y,k=1):
    return f'<g transform="translate({x} {y}) scale({k})">'+''.join(f'<rect x="-20" y="{-i*10}" width="40" height="8" rx="2" fill="#2f3b36"/><circle cx="14" cy="{-i*10+4}" r="1.6" fill="{V}"/>' for i in range(3))+f'<text x="25" y="-8" style="font-size:9px" class="m">Stack</text></g>'
def asite(x,y,w,h,lab):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{G}" fill-opacity=".04" stroke="{K}" stroke-opacity=".4" stroke-dasharray="6 5"/><text x="{x+10}" y="{y+18}" class="m" style="font-size:10.5px">{lab}</text>'
def alink(p,col,w=1.8,n=2,dur=3):
    return f'<path d="{p}" fill="none" stroke="{col}" stroke-opacity=".45" stroke-width="{w}"/>'+dots(p,n,dur,col,3)
cloud=f'<g transform="translate(380 66)"><path d="M-42 12Q-56 12 -56 -2A18 18 0 0 1 -38 -16Q-34 -34 -12 -32Q4 -46 24 -30Q54 -30 54 -4Q54 12 38 12Z" fill="#e6eef8" stroke="{B}" stroke-width="2"/><text x="0" y="0" text-anchor="middle" style="font-size:11px" font-weight="600">Kaani cloud</text></g>'
phone=f'<g transform="translate(668 40)"><rect width="40" height="64" rx="7" fill="#fff" stroke="{K}" stroke-width="2"/><rect x="6" y="10" width="28" height="9" rx="2" fill="{G}" fill-opacity=".25"/><rect x="6" y="23" width="28" height="9" rx="2" fill="{V}" fill-opacity=".25"/><rect x="6" y="36" width="28" height="9" rx="2" fill="{K}" fill-opacity=".12"/></g><text x="688" y="124" text-anchor="middle" class="m" style="font-size:10.5px">Cultivator app</text>'
# mode 1: one POD
m1=asite(290,200,200,170,'One site')+apod(345,285,1.7)+astack(440,330)+alink('M377 285H440V318',V)+alink('M440 296V160H380V98',B,1.8,3,4)
# mode 2: micro farm
m2=asite(200,196,360,186,'Micro farm · one site')
for i in range(6):
    x=245+(i%3)*75;y=252+(i//3)*66
    m2+=apod(x,y,1.05)+alink(f'M{x+24} {y}H500V{300}',V,1.2,1,3+i*.3)
m2+=astack(500,330,1.1)+alink('M500 306V160H380V98',B,1.8,3,4)
# mode 3: distributed
m3=''
for j,(nm,xx) in enumerate([('Chennai',40),('Salem',270),('Coimbatore',500)]):
    m3+=asite(xx,200,220,180,nm)
    for i in range(2):
        m3+=apod(xx+50+i*70,270,1.05)+alink(f'M{xx+50+i*70} 290V352H{xx+168}',V,1.2,1,3+i)
    m3+=astack(xx+168,330,1.0)+alink(f'M{xx+168} 306V150H380V98',B,1.6,2,4+j)
m3+=''.join(apod(xx+50+i*70,330,1.05) for xx in (40,270,500) for i in range(0))
arch=f'''<div class="archwide"><svg class="dg" id="ar" viewBox="0 0 760 400" role="img" aria-label="Kaani architecture at three sizes: one POD with a stack, a micro farm of several PODs on one stack, and a distributed farm of several sites linked through Kaani cloud to the Cultivator app.">
{cloud}{phone}{alink('M436 66H664',B,1.8,3,4)}
<g id="a1">{m1}</g><g id="a2" opacity="0">{m2}</g><g id="a3" opacity="0">{m3}</g></svg>
<div class="tl" role="group" aria-label="Farm size"><button class="chip" data-ar="1" aria-pressed="true">One POD</button><button class="chip" data-ar="2" aria-pressed="false">Micro farm</button><button class="chip" data-ar="3" aria-pressed="false">Distributed farm</button></div>
<p class="note-s" style="text-align:center" id="art">One POD, with a Kaani stack beside it. Control stays inside the POD.</p></div>'''
kaani=head('Kaani Intelligence · Akaththi Labs','Kaani Intelligence is a complete farm operating system, from crop planning to production, sales, marketing and efficiency.',False)+nav('kaani')+f'''<section class="pagehero"><div class="wrap"><span class="eyebrow">Kaani Intelligence</span><h1>A complete farm <em>operating system.</em></h1><p>From crop planning through production, sales, marketing and efficiency.</p></div></section>
<div class="wrap">
<div class="vgrid three" style="margin:20px 0 10px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr))">{ncards}</div>
<section class="vsec" style="border:0;padding-top:50px"><div class="head" style="margin-bottom:6px"><div><span class="eyebrow">Four layers</span><h2>Break something. <em>The farm keeps running.</em></h2></div></div>
<div class="sim"><div class="stack simsvg"><svg id="stackSvg" viewBox="0 -70 820 830" role="img" aria-label="Kaani layers: cultivator app, cloud, on-site stack and node."></svg></div><div class="simctl"><div class="brk" role="group" aria-label="Simulate a failure"><span class="bl">Break something</span><button class="chip" data-sc="ok" aria-pressed="true">All connected</button><button class="chip" data-sc="net" aria-pressed="false">Internet down</button><button class="chip" data-sc="edge" aria-pressed="false">Stack offline</button><button class="chip" data-sc="sensor" aria-pressed="false">Sensor fault</button><button class="chip" data-sc="power" aria-pressed="false">Power cut</button></div>
<div class="out" aria-live="polite"><strong id="scT"></strong><p id="scD"></p><ul id="scL"></ul></div></div></div>
</section>
'''+fs('Intelligence','Intelligence at every layer.','The node reacts instantly. The stack spots anomalies on-site. The cloud learns across farms.','<div class="stack" style="max-width:520px;margin:0 auto;pointer-events:none"><svg id="stackSvgB" viewBox="0 -70 820 830" aria-hidden="true"></svg></div>')\
+fs('Rhythm','A day in the life of a farm.','Plan, grow, harvest, sell, improve. Then back to the next plan, a little smarter.',loop,True)\
+fs('Offline','Offline is just another mode.','Readings are kept on-site, and sync to the cloud the moment the connection returns.',sync)\
+fs('Cultivator app','Your farm, in every pocket.','Alerts when something needs you, and checklists that walk your team through every SOP.',phones,True)\
+fs('New crops','A new crop arrives like an app.','Add a crop or a variety with an update. No new hardware.',crops)\
+'<section class="vsec" style="border:0"><div class="head"><div><span class="eyebrow">Architecture</span><h2>One POD to <em>a distributed farm.</em></h2></div><p>The same Kaani grows with you: one site, many PODs, many sites.</p></div>'+arch+'</section>'\
+'</div>'+enquire('Talk to us about <em>Kaani.</em>')+foot('<script src="vendor/three.min.js"></script><script src="kaani-stack.js"></script><script src="ui.js"></script><script src="kaani.js"></script>')
open(STAGE+'kaani.html','w').write(kaani)

# ---------------- ABOUT ----------------
rays=''.join(f'<line class="dash" x1="{300+118*math.cos(a):.1f}" y1="{260+118*math.sin(a):.1f}" x2="{300+235*math.cos(a):.1f}" y2="{260+235*math.sin(a):.1f}" stroke="{V}" stroke-width="3" stroke-linecap="round" style="animation-duration:{1.4+i*.1}s"/><circle cx="{300+245*math.cos(a):.1f}" cy="{260+245*math.sin(a):.1f}" r="5" fill="{V}"/>' for i,a in enumerate([x*math.pi/6+.1 for x in range(12)]))
about_svg=f'''<svg class="dg" viewBox="0 0 600 540" role="img" aria-label="A circle for controlled environment agriculture, with lines pushing outward past its edge and the products sitting inside as first steps.">
<circle cx="300" cy="260" r="118" fill="{G}" fill-opacity=".07" stroke="{G}" stroke-width="3"/>
{rays}
<text x="300" y="196" text-anchor="middle" class="m">Controlled environment</text><text x="300" y="214" text-anchor="middle" class="m">agriculture</text>
<g transform="translate(248 262)"><circle r="19" fill="#fff" stroke="{G}" stroke-width="2"/><text y="4" text-anchor="middle" style="font-size:10px">POD</text></g>
<g transform="translate(300 316)"><circle r="19" fill="#fff" stroke="{B}" stroke-width="2"/><text y="3" text-anchor="middle" style="font-size:9px">Humid.</text></g>
<g transform="translate(352 262)"><circle r="19" fill="#fff" stroke="{V}" stroke-width="2"/><text y="4" text-anchor="middle" style="font-size:10px">Kaani</text></g>
<text x="300" y="530" text-anchor="middle" class="m">The first steps, not the last.</text></svg>'''
about=head('About · Akaththi Labs','Akaththi Labs is a technology unit focused on agriculture technology and automation.',False)+nav('about')+f'''<section class="pagehero"><div class="wrap"><span class="eyebrow">About Akaththi Labs</span><h1>Where controlled environment agriculture ends, <em>we keep going.</em></h1><p>A technology unit focused on agriculture technology and automation.</p></div></section>
<div class="wrap" style="max-width:760px"><p style="font-size:clamp(19px,2.2vw,26px);line-height:1.4;letter-spacing:-.02em;font-weight:500;margin:50px 0 0;text-wrap:balance">Akaththi Labs is a technology unit of Akaththi Farms Private Limited. We explore controlled environment agriculture, and the boundaries beyond it. We set no boundaries on the exploration.</p>
<div class="family"><span class="eyebrow">One Akaththi, three units</span>
<div class="fam3"><a href="https://akaththifarms.com/"><b>Farms</b><p>Grows mushrooms and microgreens, and makes value-added products.</p><span class="go">Visit Farms →</span></a><a class="on" href="index.html"><b>Labs</b><p>Automation and technology for agriculture, and managed farms. You are here.</p></a><a href="https://akaththi-research.github.io/akaththi-research/"><b>Research</b><p>All research, from cultivation to technology.</p><span class="go">Visit Research →</span></a></div></div>
<p class="addr" style="margin:28px 0 36px">Akaththi Labs, a unit of Akaththi Farms Private Limited<br>Polichalur, Chennai<br>Tamil Nadu 600125, India</p>
<a class="btn solid" href="index.html#enquire">Enquire</a><div style="height:100px"></div></div>
'''+foot('')
open(STAGE+'about.html','w').write(about)

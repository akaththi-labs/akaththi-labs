from common import *
G,V,B,A,K='#2d45e3','#e0457b','#3a78c2','#d68a0c','#0b1310'
def fs(eyebrow,h,p,visual,rev=False,extra=''):
    return f'<section class="fs{" rev" if rev else ""}"><div class="wrap" style="display:contents"></div><div class="fx"><span class="eyebrow">{eyebrow}</span><h2>{h}</h2><p>{p}</p>{extra}</div><div class="fv">{visual}</div></section>\n'
# a. climate cross-section
climate=f'''<svg class="dg" viewBox="0 0 600 380" role="img" aria-label="Cross-section of a POD showing air circulating through the racks with cooling on the roof and the rear wall.">
<line x1="40" y1="330" x2="560" y2="330" stroke="{K}" stroke-opacity=".25"/>
<rect x="140" y="90" width="300" height="240" rx="10" fill="#fff" stroke="{K}" stroke-opacity=".45" stroke-width="2"/>
<rect x="180" y="52" width="120" height="38" rx="6" fill="#e9f3ec" stroke="{G}"/><text x="240" y="76" text-anchor="middle">Passive cooling</text>
<rect x="440" y="240" width="64" height="90" rx="6" fill="#f1e6f3" stroke="{V}"/><text x="472" y="282" text-anchor="middle" style="font-size:11px">Active</text><text x="472" y="296" text-anchor="middle" style="font-size:11px">cooling</text>
<rect x="440" y="150" width="64" height="70" rx="6" fill="#e6eef8" stroke="{B}"/><text x="472" y="190" text-anchor="middle" style="font-size:11px">Humidity</text>
{''.join(f'<g><line x1="{x}" y1="130" x2="{x}" y2="320" stroke="{K}" stroke-opacity=".5"/>'+''.join(f'<rect x="{x-28}" y="{y}" width="56" height="5" fill="{K}" fill-opacity=".35"/><circle class="pls" cx="{x-12}" cy="{y-8}" r="5" fill="#d8c9a2"/><circle class="pls" cx="{x+12}" cy="{y-8}" r="5" fill="#d8c9a2" style="animation-delay:.6s"/>' for y in (170,215,260,305))+'</g>' for x in (200,290,380))}
<path class="dash" d="M240 90V112H415V300H430" fill="none" stroke="{G}" stroke-width="3"/>
<path class="dash" d="M430 310H160V112H240" fill="none" stroke="{B}" stroke-width="3"/>
<g transform="translate(40 120)"><rect width="22" height="150" rx="11" fill="#e9f3ec" stroke="{G}"/><circle class="flt" cx="11" cy="75" r="7" fill="{G}"/></g><text x="51" y="290" text-anchor="middle" class="m">Steady</text>
</svg>'''
# b. consistency
def clus(x,y):
    return f'<g transform="translate({x} {y})"><path d="M-30 0Q-30 -26 0 -26Q30 -26 30 0Z" fill="#e7dcc0"/><rect x="-6" y="0" width="12" height="22" rx="4" fill="#f4efe2"/><path d="M-56 12Q-56 -6 -38 -6Q-20 -6 -20 12Z" fill="#d8c9a2"/><path d="M20 12Q20 -6 38 -6Q56 -6 56 12Z" fill="#d8c9a2"/></g>'
cons=f'''<svg class="dg" viewBox="0 0 600 300" role="img" aria-label="Four seasons of identical harvests under a flat, steady climate line.">
<rect x="30" y="60" width="540" height="40" rx="8" fill="#e9f3ec"/><line x1="30" y1="80" x2="570" y2="80" stroke="{G}" stroke-width="3"/>
{''.join(f'<text x="{x}" y="46" text-anchor="middle" class="m">Season {i+1}</text><line x1="{x}" y1="104" x2="{x}" y2="150" stroke="{K}" stroke-opacity=".15" stroke-dasharray="3 4"/><g style="animation:rise 5s {i*.5}s infinite backwards">{clus(x,200)}</g><circle cx="{x}" cy="80" r="6" fill="{G}"/>' for i,x in enumerate((100,233,366,500)))}
<text x="300" y="276" text-anchor="middle" style="font-size:14px">No surprises. Cycle after cycle.</text></svg>'''
# c. hybrid power
power=f'''<svg class="dg" id="pw" viewBox="0 0 600 380" role="img" aria-label="Power flow into a POD: all from the grid, or part from the sun and part from the grid.">
<g class="sun"><circle cx="90" cy="70" r="26" fill="#ffb81f"/>{''.join(f'<line x1="90" y1="70" x2="{90+44*__import__("math").cos(i*.785):.0f}" y2="{70+44*__import__("math").sin(i*.785):.0f}" stroke="#ffb81f" stroke-width="3" stroke-linecap="round" stroke-dasharray="0 28 14 100"/>' for i in range(8))}</g>
<g id="pyl"><line x1="520" y1="130" x2="520" y2="330" stroke="{K}" stroke-opacity=".5" stroke-width="5"/><line x1="494" y1="150" x2="546" y2="150" stroke="{K}" stroke-opacity=".5" stroke-width="4"/><line x1="500" y1="180" x2="540" y2="180" stroke="{K}" stroke-opacity=".5" stroke-width="4"/><text x="520" y="352" text-anchor="middle" class="m">Grid</text></g>
<rect x="200" y="150" width="200" height="180" rx="12" fill="#fff" stroke="{K}" stroke-opacity=".45" stroke-width="2"/><text x="300" y="142" text-anchor="middle" font-weight="500">POD</text>
<g id="c1"><rect x="220" y="170" width="160" height="38" rx="8" fill="#f6f7f4" stroke="{K}" stroke-opacity=".2"/><text x="300" y="194" text-anchor="middle">Cooling</text></g>
<g id="c2"><rect x="220" y="220" width="160" height="38" rx="8" fill="#f6f7f4" stroke="{K}" stroke-opacity=".2"/><text x="300" y="244" text-anchor="middle">Humidity</text></g>
<g id="c3"><rect x="220" y="270" width="160" height="38" rx="8" fill="#f6f7f4" stroke="{K}" stroke-opacity=".2"/><text x="300" y="294" text-anchor="middle">Control</text></g>
<path id="s1" class="dash" d="M110 92C170 120 190 150 220 189" fill="none" stroke="#ffb81f" stroke-width="3"/>
<path id="s3" class="dash" d="M112 80C150 200 160 270 220 289" fill="none" stroke="#ffb81f" stroke-width="3"/>
<path id="g1" class="dash" d="M520 170C470 170 430 180 380 189" fill="none" stroke="{V}" stroke-width="3"/>
<path id="g2" class="dash" d="M520 200C470 230 430 240 380 239" fill="none" stroke="{V}" stroke-width="3"/>
<path id="g3" class="dash" d="M520 230C470 280 430 290 380 289" fill="none" stroke="{V}" stroke-width="3"/>
</svg>
<div class="tl" role="group" aria-label="Power model"><button class="chip" data-pw="grid" aria-pressed="true">Grid only</button><button class="chip" data-pw="hyb" aria-pressed="false">Sun + grid <small>POD 1.2</small></button></div>
<p class="note-s" style="text-align:center">POD 1.0 is available now and runs on the grid. The hybrid solar version arrives with POD 1.2.</p>'''
# d. modes
modes=f'''<svg class="dg" id="md" viewBox="0 0 600 340" role="img" aria-label="Cross-section of a POD in cultivation mode and in sterilisation mode with misting heads and UV lamps.">
<rect x="120" y="40" width="360" height="270" rx="12" fill="#fff" stroke="{K}" stroke-opacity=".45" stroke-width="2"/>
<g id="uv">{''.join(f'<rect x="{x}" y="52" width="70" height="7" rx="3.5" fill="{V}"/>' for x in (150,265,380))}</g>
<g id="mi">{''.join(f'<circle cx="{x}" cy="78" r="5" fill="#2b3330"/>' for x in (180,240,300,360,420))}</g>
<g id="mist">{''.join(f'<g class="pls" style="animation-delay:{i*.25}s"><circle cx="{x-9+(i%2)*14}" cy="{104+i%3*16}" r="4" fill="{B}" fill-opacity=".5"/><circle cx="{x+6}" cy="{124+i%2*14}" r="3" fill="{B}" fill-opacity=".4"/></g>' for i,x in enumerate((180,240,300,360,420)))}</g>
<g id="rk">{''.join(f'<g><line x1="{x}" y1="130" x2="{x}" y2="300" stroke="{K}" stroke-opacity=".5"/>'+''.join(f'<rect x="{x-30}" y="{y}" width="60" height="5" fill="{K}" fill-opacity=".35"/><circle cx="{x-14}" cy="{y-8}" r="6" fill="#d8c9a2"/><circle cx="{x+14}" cy="{y-8}" r="6" fill="#d8c9a2"/>' for y in (170,215,260,300))+'</g>' for x in (200,300,400))}</g>
<g id="glow" opacity="0"><rect x="120" y="40" width="360" height="270" rx="12" fill="{V}" fill-opacity=".08"/></g>
</svg>
<div class="tl" role="group" aria-label="Operating mode"><button class="chip" data-md="grow" aria-pressed="true">Cultivation</button><button class="chip" data-md="ster" aria-pressed="false">Sterilisation</button></div>
<p class="note-s" style="text-align:center" id="mdn">Misting heads keep humidity even along the ceiling.</p>'''
# f. panels
def isocube(extra):
    return f'''<svg class="dg" id="pn" viewBox="0 0 600 380" role="img" aria-label="A POD made of individual panels, shown indoors and outdoors.">
<g id="outd"><circle cx="500" cy="60" r="28" fill="#ffb81f" fill-opacity=".9"/><path d="M60 330Q130 290 200 330Z" fill="#e9f3ec"/><path d="M420 340Q480 300 560 340Z" fill="#e9f3ec"/></g>
<g id="ind" opacity="0"><path d="M60 330V120L300 40L540 120V330Z" fill="none" stroke="{K}" stroke-opacity=".3" stroke-width="2" stroke-dasharray="8 8"/><line x1="60" y1="120" x2="540" y2="120" stroke="{K}" stroke-opacity=".15"/></g>
<g transform="translate(300 220)">
<polygon points="-110,-30 0,25 0,150 -110,95" fill="#eef0eb" stroke="{K}" stroke-opacity=".5"/>
<polygon points="110,-30 0,25 0,150 110,95" fill="#e1e4de" stroke="{K}" stroke-opacity=".5"/>
<polygon points="0,-85 110,-30 0,25 -110,-30" fill="#fbfcfa" stroke="{K}" stroke-opacity=".5"/>
{''.join(f'<line x1="{-110+i*36.6:.1f}" y1="{-30+i*18.3:.1f}" x2="{-110+i*36.6:.1f}" y2="{95+i*18.3:.1f}" stroke="{K}" stroke-opacity=".25"/>' for i in (1,2))}
{''.join(f'<line x1="{i*36.6:.1f}" y1="{25+i*-18.3:.1f}" x2="{i*36.6:.1f}" y2="{150+i*-18.3:.1f}" stroke="{K}" stroke-opacity=".25"/>' for i in (1,2))}
<line x1="-110" y1="32" x2="0" y2="87" stroke="{K}" stroke-opacity=".2"/><line x1="110" y1="32" x2="0" y2="87" stroke="{K}" stroke-opacity=".2"/>
<g id="hl"><polygon points="-73.4,-11.7 -36.8,6.6 -36.8,50 -73.4,31.7" fill="{G}" fill-opacity=".35" stroke="{G}" stroke-width="2" class="pls"/></g>
</g></svg>
<div class="tl" role="group" aria-label="Where it stands"><button class="chip" data-pn="out" aria-pressed="true">Outdoors</button><button class="chip" data-pn="in" aria-pressed="false">Indoors</button></div>'''
panels=isocube('')
# g. racks
def rack_iso():
    out=''
    for t in range(6):
        y=-26*t
        out+=f'<g style="animation:rise 5s {t*.45}s infinite backwards"><polygon points="-62,{20+y} 0,{51+y} 62,{20+y} 0,{-11+y}" fill="#fff" stroke="{K}" stroke-opacity=".5"/>'+''.join(f'<ellipse cx="{cx}" cy="{cy+y}" rx="9" ry="5" fill="#d8c9a2"/>' for cx,cy in ((-24,18),(0,28),(24,18),(0,8)))+'</g>'
    return out
racks=f'''<svg class="dg" viewBox="0 0 600 380" role="img" aria-label="A small floor outline with racks stacked upward inside it.">
<g transform="translate(300 270)"><polygon points="-150,0 0,75 150,0 0,-75" fill="{G}" fill-opacity=".08" stroke="{G}" stroke-width="2" stroke-dasharray="8 6"/>
<g transform="translate(0 0) scale(1.05)">{rack_iso()}</g>
<line x1="-96" y1="-60" x2="-96" y2="-190" stroke="{K}" stroke-opacity=".3"/><polygon points="-100,-186 -96,-196 -92,-186" fill="{K}" fill-opacity=".5"/>
</g><text x="300" y="365" text-anchor="middle" class="m">Small footprint. Growth goes up, not out.</text></svg>'''
# j. sizes: plan view in 1 m panels
def grid(x,y,n,m,c,dash,lab,sub):
    s=34;o=f'<rect x="{x}" y="{y}" width="{n*s}" height="{m*s}" fill="{c}" fill-opacity="{.04 if dash else .12}" stroke="{c if not dash else K}" stroke-width="2.4"'+(' stroke-dasharray="7 6"' if dash else '')+'/>'
    o+=''.join(f'<line x1="{x+i*s}" y1="{y}" x2="{x+i*s}" y2="{y+m*s}" stroke="{c if not dash else K}" stroke-opacity=".35"/>' for i in range(1,n))
    o+=''.join(f'<line x1="{x}" y1="{y+j*s}" x2="{x+n*s}" y2="{y+j*s}" stroke="{c if not dash else K}" stroke-opacity=".35"/>' for j in range(1,m))
    o+=f'<g stroke="{K}" stroke-opacity=".5"><line x1="{x}" y1="{y-16}" x2="{x+n*s}" y2="{y-16}"/><line x1="{x}" y1="{y-21}" x2="{x}" y2="{y-11}"/><line x1="{x+n*s}" y1="{y-21}" x2="{x+n*s}" y2="{y-11}"/></g>'
    o+=f'<text x="{x+n*s/2}" y="{y-24}" text-anchor="middle" class="m">{lab}</text><text x="{x+n*s/2}" y="{y+m*s+24}" text-anchor="middle" font-weight="500">{sub}</text>'
    return o
sizes=f'''<svg class="dg" viewBox="0 0 600 300" role="img" aria-label="Plan view of the first POD size, and a planned larger size.">
{grid(50,90,3,3,G,False,"about 10 ft","First size")}
{grid(250,90,6,3,K,True,"about 20 ft","Planned")}
<text x="300" y="272" text-anchor="middle" class="m">Each square is one panel. Walls are 8 ft high.</text></svg>'''
crops='''<div class="crops" id="crops">
<div class="crop" style="--c:#2d45e3"><i>Ps</i><div><b>Oyster mushrooms</b><span>Included with every POD</span></div><button class="btn done" disabled>Included</button></div>
<div class="crop" style="--c:#e0457b"><i>Gl</i><div><b>Reishi and exotics pack</b><span>Crop pack · added by update<div class="bar"><u></u></div></span></div><button class="btn solid" data-inst>Add pack</button></div>
<div class="crop" style="--c:#8a4b0f"><i>Hc</i><div><b>Lion’s mane pack</b><span>Crop pack · added by update<div class="bar"><u></u></div></span></div><button class="btn solid" data-inst>Add pack</button></div>
<div class="crop" style="--c:#1b2620"><i>Sf</i><div><b>Saffron pack</b><span>Crop pack · coming soon</span></div><button class="btn" disabled>Soon</button></div>
<div class="crop" style="--c:#56625a"><i>+</i><div><b>Your crop</b><span>Let’s build the pack together</span></div><a class="btn" href="index.html#enquire">Collaborate</a></div></div>'''
kv='<div class="stack" style="max-width:460px;margin:0 auto"><svg id="stackSvgP" viewBox="0 -70 820 830" role="img" aria-label="Kaani layers: node, on-site stack, cloud and app."></svg></div><div class="tl"><button class="chip" data-sc="ok" aria-pressed="true">All connected</button><button class="chip" data-sc="net" aria-pressed="false">Internet down</button><button class="chip" data-sc="power" aria-pressed="false">Power cut</button></div><p class="note-s" id="scT" style="text-align:center;color:var(--ink);font-weight:500"></p><ul id="scL" style="display:none"></ul><p id="scD" class="note-s" style="text-align:center"></p>'
proto='''<section class="vsec"><div class="wrap"><div class="head"><div><span class="eyebrow">Where it started</span><h2>Prototype v0, <em>running in Chennai.</em></h2></div><p>This is the first prototype we built to learn the climate system. The production POD grew from what it taught us, and looks different from this.</p></div>
<div class="proto3"><figure class="pf"><img src="pod-exterior.jpg" alt="Prototype v0 exterior: insulated panels and an inspection window" loading="lazy"><figcaption>Prototype v0, exterior</figcaption></figure><figure class="pf"><img src="pod-interior.jpg" alt="Prototype v0 interior: white panel walls, cooling unit and vents" loading="lazy"><figcaption>Prototype v0, interior</figcaption></figure><figure class="pf"><img src="pod-diffuser.jpg" alt="Prototype v0 ceiling air distribution" loading="lazy"><figcaption>Prototype v0, overhead</figcaption></figure></div></div></section>'''
body=head('POD 1.0 · Akaththi Labs','POD 1.0 is a complete farm in a box, powered by Kaani Intelligence.',False)+nav('pod')+f'''<section class="pagehero"><div class="wrap"><span class="eyebrow">POD 1.0 · Available now</span><h1>A complete farm. <em>Ready to grow.</em></h1><p>The perfect harvest, with less energy.</p></div></section>
<section class="tour stage" id="podTour" data-s="0">
  <div class="stick">
    <div class="viewer full" id="vwPT"><canvas id="cvPT" role="img" aria-label="Interactive 3D model of POD 1.0. Scroll to follow its story."></canvas>
      <div class="share" id="shareBarP"><span class="s">Solar</span><b><i id="shS"></i></b><span class="g">Grid</span></div>
    </div>
    <nav class="dots" aria-label="POD 1.0 highlights"></nav>
  </div>
  <div class="steps">
    <article class="step" data-s="0"><div class="sc"><span class="k">01 · Climate</span><h2>Cooling that works with less.</h2><p>Cooling on the roof does the easy work. The rear wall steps in only when it is needed.</p></div></article>\n    <article class="step" data-s="1"><div class="sc"><span class="k">02 · Harvest</span><h2>The perfect harvest.</h2><p>Air moves evenly through every rack, so each cycle runs the same way.</p></div></article>\n    <article class="step" data-s="2"><div class="sc"><span class="k">03 · Power</span><h2>Grid, sun, or both.</h2><p>POD 1.0 runs on the grid. A hybrid solar model arrives with POD 1.2.</p></div></article>\n    <article class="step" data-s="3"><div class="sc"><span class="k">04 · Modes</span><h2>More than one mode.</h2><p>Sterilisation uses the misting heads and UV lamps to clean the room between cycles.</p></div></article>\n    <article class="step" data-s="4"><div class="sc"><span class="k">05 · Panels</span><h2>Built panel by panel.</h2><p>Insulated panels, field assembled indoors or outdoors.</p></div></article>\n    <article class="step" data-s="5"><div class="sc"><span class="k">06 · Racks</span><h2>Grows high, not wide.</h2><p>Stacked racks make full use of a 10 × 10 ft floor.</p></div></article>\n    <article class="step" data-s="6"><div class="sc"><span class="k">07 · Sizes</span><h2>Sized in panels.</h2><p>The first size is about 10 × 10 ft and 8 ft high. Larger sizes add whole panels.</p></div></article>\n  </div>
</section>
<div class="wrap">
'''+fs('Resilience','Designed for failure.','Lose the internet and the POD keeps running. Lose power and it fails safe, then tells your team.',kv)\
+fs('Crops','Today mushrooms. Tomorrow anything.','A new crop or a new variety is just an update. Extra crops come as paid crop packs, added with no hardware change.',crops,True)\
+fs('Kaani Intelligence','The intelligence is the product.','Every POD runs on Kaani, a complete farm operating system that keeps getting better while it grows your crops.',f'<div class="stack" style="max-width:400px;margin:0 auto;pointer-events:none"><svg id="stackSvgM" viewBox="0 -70 820 830" aria-hidden="true"></svg></div>',False,'<a class="btn solid" href="kaani.html">Learn about Kaani →</a>')\
+fs('Sizes','A platform, not a size.','The first size is about 10 × 10 ft and 8 ft high. Larger sizes are planned in whole panels.',sizes,True)\
+'</div>'+proto+enquire('Talk to us about <em>POD 1.0.</em>')+foot('''<script src="vendor/three.min.js"></script><script src="engine.js"></script><script src="kaani-stack.js"></script><script src="ui.js"></script><script src="pod.js"></script>''')
open(STAGE+'pod.html','w').write(body)

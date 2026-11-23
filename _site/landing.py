from common import *
S=[('01 · Inside','See what’s inside.','Racks stacked high, with the climate held steady around every one.'),
('02 · Rear wall','Serviced from outside.','Every system is mounted on the rear wall. Your team never enters the room.'),
('03 · Kaani','Everything at a touch.','The Kaani screen sits right beside the door.'),
('04 · Micro farm','Same floor. Many PODs.','Side by side, each glowing its own climate for a different variety.'),
('05 · Farm','Acres of PODs.','Add a POD whenever you grow. Each one joins Kaani the moment it arrives.'),
('06 · Everywhere','Regions. One view.','Every POD is linked to Kaani, and the Cultivator app shows them all in one place.'),
('07 · Power','Let the sun carry a share.','Solar takes what it can. The grid covers the rest.'),
('08 · Resilience','The internet drops. The farm doesn’t.','Control stays inside the POD, so cultivation carries on.')]
steps=''.join(f'    <article class="step" data-s="{i+1}"><div class="sc"><span class="k">{k}</span><h2>{h}</h2><p>{p}</p>'+('<a class="btn solid sm" href="pod.html">Explore POD 1.0 →</a>' if i==len(S)-1 else '')+'</div></article>\n' for i,(k,h,p) in enumerate(S))
def stage(id,vid,kicker,items,btn,href,extra_cls='',viewer=''):
    st=''
    for i,(h,p) in enumerate(items):
        b=f'<a class="btn solid sm" href="{href}">{btn} →</a>' if i==len(items)-1 else ''
        st+=f'    <article class="step" data-s="{i}"><div class="sc"><span class="k">{kicker}</span><h2>{h}</h2><p>{p}</p>{b}</div></article>\n'
    return f'''<section class="tour stage {extra_cls}" id="{id}" data-s="0">
  <div class="stick">
    {viewer}
    <nav class="dots" aria-label="{kicker} highlights"></nav>
  </div>
  <div class="steps">
{st}  </div>
</section>
'''
podv='<div class="viewer full" id="vwPS"><canvas id="cvPS" role="img" aria-label="Interactive 3D model of POD 1.0. Scroll to rotate it."></canvas></div>'
humv='<div class="viewer full" id="vwHS"><canvas id="cvHS" role="img" aria-label="Interactive 3D model of Humidifier 1.0. Scroll to rotate it."></canvas></div>'
kv='<div class="stack"><svg id="stackSvgL" viewBox="0 -70 820 830" role="img" aria-label="Kaani as four layers: node, on-site stack, cloud and the Cultivator app."></svg></div>'
phone='''<div class="phone" aria-hidden="true"><h4>My farms</h4>
        <div class="r" style="--c:#2d45e3"><i></i>Chennai · Oyster<small>Normal</small></div>
        <div class="r" style="--c:#e0457b"><i></i>Salem · Reishi<small>Normal</small></div>
        <div class="r" style="--c:#3a78c2"><i></i>Coimbatore · Lion’s mane<small>Normal</small></div></div>'''
band=lambda n,t,sub,href:f'<section class="pband"><div class="wrap"><span class="eyebrow">{n}</span><h2>{t}</h2><p>{sub}</p><a class="btn" href="{href}">Open the {t.split()[0]} page →</a></div></section>\n'
body=head('Akaththi Labs · Wherever you are. Grow on.','POD 1.0, a complete mushroom farm in a box, powered by Kaani Intelligence. A technology unit focused on agriculture technology and automation.',False)+nav('')+f'''<section class="tour" id="top" data-s="0">
  <div class="stick">
    <div class="viewer full" id="vwP">
      <canvas id="cvP" role="img" aria-label="Interactive 3D model of POD 1.0. Scroll to follow its story, or drag to rotate."></canvas>
      <span class="tag" data-a="roof">Passive cooling unit</span>
      <span class="tag" data-a="duct">Insulated duct</span>
      <span class="tag" data-a="ctrl">Controller</span>
      <span class="tag" data-a="hum">Humidifier 1.0</span>
      <span class="tag" data-a="act">Active cooling unit</span>
      <span class="tag" data-a="mist">Misting heads</span>
      <span class="tag" data-a="uv">UV lamps</span>
      <span class="tag" data-a="touch">Kaani touch screen</span>
      <div class="hero-copy">
        <span class="eyebrow">POD 1.0 · Powered by Kaani Intelligence</span>
        <h1>Wherever you are. <em>Grow on.</em></h1>
        <p class="sub">The perfect harvest, with less energy.</p><p class="prompt" aria-hidden="true"><span class="ps">$</span>grow --anywhere<span class="cursor"></span></p>
        <div class="cta"><a class="btn solid" href="#s1" data-go="1">Watch the story</a><a class="btn" href="pod.html">Meet POD 1.0</a></div>
      </div>
      {phone}
      <span class="tag rlab">Chennai</span><span class="tag rlab">Salem</span><span class="tag rlab">Coimbatore</span>
      <div class="share" id="shareBar"><span class="s">Solar</span><b><i id="shS"></i></b><span class="g">Grid</span></div>
      <div class="pill" id="netPill"><i></i><span id="netTxt">Connected</span></div>
    </div>
    <nav class="dots" id="dots" aria-label="Story steps"></nav>
  </div>
  <div class="steps">
    <article class="step" data-s="0" aria-hidden="true"></article>
{steps}  </div>
</section>

'''+stage('stageHum','vwHS','Humidifier 1.0',[('Already have a farm?','Add our high-efficiency humidifier. It holds humidity exactly as your crops expect.'),('Opens from the top.','The lid lifts, and a smooth body wipes clean.'),('Seen across the room.','A status light bar and display tell you at a glance.'),('Three connections.','Power, water in and drain, all at the back.')],'Explore Humidifier 1.0','humidifier.html',viewer=humv)\
+'''<section class="close">
  <div class="wrap"><span class="eyebrow">For growers</span><h2>Growing something else? <em>Let’s make the POD ready for it.</em></h2><p class="more">Want to automate something else in agriculture? Talk to us. We can help.</p></div>
</section>
'''+enquire('Start with <em>a conversation.</em>')+foot('''<script src="vendor/three.min.js"></script>
<script src="engine.js"></script><script src="kaani-stack.js"></script><script src="ui.js"></script>
<script src="landing.js"></script>''')
open(STAGE+'index.html','w').write(body)

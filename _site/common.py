import os
STAGE=os.path.join(os.path.dirname(os.path.abspath(__file__)),"stage")+os.sep
os.makedirs(STAGE,exist_ok=True)
LOGO='<img src="mark.svg" alt="" width="28" height="28">'
def head(title,desc,three=True):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title if 'living systems' in title else title+' · '+'Automation for living systems'}</title>
<meta name="description" content="{desc}">
<link rel="preload" href="fonts/martian-mono-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/instrument-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="theme-color" content="#f1f4f0">
{'<script src="vendor/three.min.js"></script>' if three else ''}
<link rel="stylesheet" href="site.css">
</head>
<body>
'''
NAVJS='''<script>(function(){var n=document.querySelector('.nav'),b=n.querySelector('.burger');function c(){n.classList.remove('open');b.setAttribute('aria-expanded','false')}b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});n.querySelectorAll('ul a').forEach(function(a){a.addEventListener('click',c)});addEventListener('resize',function(){if(innerWidth>=860)c()});addEventListener('keydown',function(e){if(e.key==='Escape')c()})})()</script>'''
def nav(active=''):
    def a(h,t,k): return f'<li><a href="{h}"{" aria-current=\"page\"" if k==active else ""}>{t}</a></li>'
    return f'''<nav class="nav" aria-label="Main">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="Akaththi Labs home">{LOGO}<span>Akaththi Labs</span><i class="cur" aria-hidden="true"></i><small>Automation for living systems</small></a>
    <button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mnav"><span></span><span></span><span></span></button>
    <ul id="mnav">{a("pod.html","POD","pod")}{a("humidifier.html","Humidifier","hum")}{a("kaani.html","Kaani","kaani")}{a("managed-farms.html","Managed farms","mf")}{a("about.html","About","about")}<li class="mq"><a href="index.html#enquire">Enquire</a></li></ul>
    <a class="btn" href="index.html#enquire">Enquire</a>
  </div>
</nav>
{NAVJS}
<main>
'''
def enquire(title='Talk to us about <em>your farm.</em>'):
    return f'''<section class="sec enquire" id="enquire">
  <div class="wrap enq">
    <div>
      <span class="eyebrow">Enquire</span>
      <h2 style="margin-top:16px">{title}</h2>
      <p class="s">Tell us what you grow and where. We reply with next steps for POD 1.0 or Humidifier 1.0. Growing something else? Tell us, and let's explore it together.</p>
      <p class="addr">Akaththi Labs<br>Polichalur, Chennai<br>Tamil Nadu 600125, India</p>
    </div>
    <form id="f" novalidate>
      <label for="fn">Your name<input id="fn" autocomplete="name"></label>
      <label for="fo">Company or farm<input id="fo" autocomplete="organization"></label>
      <label for="fc">Country<input id="fc" autocomplete="country-name"></label>
      <label for="fi">Interested in
        <select id="fi"><option>POD 1.0</option><option>Humidifier 1.0</option><option selected>POD 1.0 and Humidifier 1.0</option><option>A different crop</option><option>Automating something in agriculture</option></select>
      </label>
      <label for="fm">Tell us about your project<textarea id="fm" placeholder="Crop, scale, location, timeline"></textarea></label>
      <button class="btn solid" type="submit" style="justify-self:start">Send enquiry</button>
      <p class="note" id="note" role="status">Sending opens a public GitHub issue, so your message will be public. Leave out anything private.</p>
    </form>
  </div>
</section>
'''
def foot(scripts):
    return f'''</main>
<footer>
  <div class="wrap"><span>© 2026 Akaththi Labs, a unit of Akaththi Farms Private Limited.</span><span>Powered by Kaani Intelligence · Patent pending · Designed in Chennai</span></div>
  <div class="wrap fam"><span>Akaththi: <a href="https://akaththifarms.com/">Farms</a> · Labs · <a href="https://github.com/akaththi-research">Research</a> · <a href="open-source.html">Open source</a></span></div>
</footer>
{scripts}
</body>
</html>
'''

from common import *
def row(h,body): return f'<section class="rowsec"><div class="wrap split2"><h2>{h}</h2><div>{body}</div></div></section>\n'
def spec(items): return '<dl class="spec2">'+''.join(f'<dt>{k}</dt><dd>{v}</dd>' for k,v in items)+'</dl>'
def ul(items): return '<ul class="ul2">'+''.join(f'<li>{i}</li>' for i in items)+'</ul>'
def hero(eb,h,p,extra=''): return f'<section class="pagehero"><div class="wrap"><span class="eyebrow">{eb}</span><h1>{h}</h1><p>{p}</p>{extra}</div></section>\n'
# ---- managed farms ----
mf=head('Managed farms · Akaththi Labs','Akaththi Labs brings its procedures, supplies and operators to a farm in your space. We run it, you sell the produce. Pilot enquiries are open.',False)+nav('mf')+hero('Managed farms','Advanced farming, <em>without the know-how to build.</em>','We bring our procedures, supply the raw materials and run the farm. You sell the produce.')
mf+='<div class="wrap" style="max-width:900px">'+spec([('for','Campuses, offices, kitchens, institutes and brands with space and a market for fresh produce.'),('status','<span class="tagb">in design</span> Pilots start after the <a href="pod.html">POD</a> has run reliably on our own farm.'),('crops','Mushrooms and microgreens first. Saffron once the POD has proven it.'),('you pay for','Technology, supplies and operations.')])+'</div>\n'
mf+=row('The problem',ul(['Most new farms fail on know-how, not on ambition: hygiene, spawn and seed handling, timing.','Good inputs are hard to source on time and at steady quality.','Building a controlled farm costs a lot before the first sale.','Hiring and training skilled operators is slow, and they are hard to keep.']))
mf+=row('Who does what','<ol class="ol2"><li><b>Our procedures.</b> The standard operating procedures we run our own farm by, and the advanced farming technology behind them.</li><li><b>Our supplies.</b> We supply the raw materials and keep the inventory stocked.</li><li><b>Our operators.</b> We operate the farm day to day.</li><li><b>Your market.</b> You own the harvest and sell it, in your space or your channels.</li></ol>')
mf+=row('Before a pilot','<p>Food-safety licensing and who is responsible for what are agreed in writing before any pilot starts.</p><p>We start with small pilots and prove each one before adding the next.</p>')
mf+=enquire('Have space and a market for <em>fresh produce?</em>')+foot('<script src="ui.js"></script>')
open(STAGE+'managed-farms.html','w').write(mf)
# ---- open source ----
os_=head('Open source · Akaththi Labs','Akaththi Labs plans to release selected tools around its products as open source. The POD design and the core of Kaani stay closed.',False)+nav('')+hero('Open source','We open the parts that <em>help other builders.</em>','Selected tools around the POD and Kaani will be released openly. The product itself stays closed.')
os_+='<div class="wrap" style="max-width:900px">'+spec([('status','<span class="tagb">planned</span> Nothing is released yet.'),('licence','Each project states its own.'),('code','<a href="https://github.com/akaththi-labs">github.com/akaththi-labs</a>')])+'</div>\n'
os_+=row('First candidates',ul(['Sensor drivers and utilities for ESP-IDF.','An open format for logging cultivation data.'])+'<p>These are candidates, not commitments. A repository appears here only when there is something to use.</p>')
os_+=row('What stays closed',ul(['The POD design.','The core of Kaani Intelligence.','Our manufacturing and growing procedures.']))
os_+=row('Contributing','<p>When a project repository exists, issues and pull requests are welcome there.</p>')
os_+=foot('')
open(STAGE+'open-source.html','w').write(os_)
# ---- 404 ----
nf=head('Page not found · Akaththi Labs','This page does not exist.',False)+nav('')+'<section class="pagehero"><div class="wrap"><span class="eyebrow">404</span><h1>Page <em>not found.</em></h1><p class="prompt" style="justify-content:center;display:flex"><span class="ps">$</span>labs open this-page<span class="cursor"></span></p><p>That address does not lead anywhere. Start from the <a href="index.html">home page</a>, or choose a product from the menu.</p></div></section>'+foot('')
open(STAGE+'404.html','w').write(nf)

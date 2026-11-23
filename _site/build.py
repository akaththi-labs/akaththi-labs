"""Builds every page of the site, plus sitemap.xml and robots.txt, into the repository root.
Usage: python3 _site/build.py   (Python 3.9+, no dependencies)
Sources: common.py (shared shell), landing.py, pod.py, pages2.py. Scripts and styles live in assets/site/."""
import os,re,subprocess,sys,shutil
here=os.path.dirname(os.path.abspath(__file__));root=os.path.dirname(here)
stage=os.path.join(here,'stage');shutil.rmtree(stage,ignore_errors=True)
for g in ['landing','pod','pages2','pages3']:
    subprocess.check_call([sys.executable,os.path.join(here,g+'.py')],cwd=here)
BASE='https://akaththi-labs.github.io/akaththi-labs'
PAGES={'index.html':('index.html','/'),'pod.html':('pod/index.html','/pod/'),'humidifier.html':('humidifier/index.html','/humidifier/'),'kaani.html':('kaani/index.html','/kaani/'),'about.html':('about/index.html','/about/'),'managed-farms.html':('managed-farms/index.html','/managed-farms/'),'open-source.html':('open-source/index.html','/open-source/'),'404.html':('404.html','/404.html')}
BRAND={'mark.svg','favicon.svg','favicon-32.png','apple-touch-icon.png'}
for src in ['index.html','pod.html','humidifier.html','kaani.html','about.html','managed-farms.html','open-source.html','404.html']:
    html=open(os.path.join(stage,src),encoding='utf-8').read()
    out,path=PAGES[src];depth=out.count('/');pre='../'*depth if depth else './'
    if src=='404.html':pre='/akaththi-labs/'
    def fix(m):
        attr,val=m.group(1),m.group(2)
        if re.match(r'(https?:|mailto:|#|data:)',val):return m.group(0)
        name,frag=(val.split('#',1)+[''])[:2];frag=('#'+frag) if frag else ''
        if name in PAGES:return f'{attr}="{pre}{PAGES[name][0]}{frag}"'
        if name in BRAND:return f'{attr}="{pre}assets/{name}{frag}"'
        if name.startswith('fonts/'):return f'{attr}="{pre}assets/{name}"'
        return f'{attr}="{pre}assets/site/{name}{frag}"'
    html=re.sub(r'(href|src)="([^"]*)"',fix,html)
    title=re.search(r'<title>(.*?)</title>',html).group(1);desc=re.search(r'<meta name="description" content="(.*?)">',html).group(1)
    extra=f'''<link rel="canonical" href="{BASE}{PAGES[src][1]}">
<link rel="icon" href="{pre}favicon.ico" sizes="any">
<link rel="manifest" href="{pre}site.webmanifest">
<meta property="og:type" content="website"><meta property="og:site_name" content="Akaththi Labs"><meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:url" content="{BASE}{PAGES[src][1]}"><meta property="og:image" content="{BASE}/assets/og-image.png"><meta name="twitter:card" content="summary_large_image">
</head>'''
    html=html.replace('</head>',extra,1)
    dest=os.path.join(root,out);os.makedirs(os.path.dirname(dest),exist_ok=True)
    open(dest,'w',encoding='utf-8').write(html);print('wrote',out)
urls=''.join(f'  <url><loc>{BASE}{p}</loc></url>\n' for k,(o,p) in PAGES.items() if k!='404.html')
open(os.path.join(root,'sitemap.xml'),'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls+'</urlset>\n')
open(os.path.join(root,'robots.txt'),'w').write(f'User-agent: *\nAllow: /\n\nSitemap: {BASE}/sitemap.xml\n')
shutil.rmtree(stage,ignore_errors=True)

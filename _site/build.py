"""Builds the product pages (home, POD, Humidifier, Kaani, About) into the repository root.
Usage: python3 _site/build.py   (Python 3.9+, no dependencies)
The other pages (managed farms, open source, 404) still come from `node _tools/build.mjs`.
Sources: common.py (shared shell), landing.py, pod.py, pages2.py. Scripts and styles live in assets/site/."""
import os,re,subprocess,sys,shutil
here=os.path.dirname(os.path.abspath(__file__));root=os.path.dirname(here)
stage=os.path.join(here,'stage');shutil.rmtree(stage,ignore_errors=True)
for g in ['landing','pod','pages2']:
    subprocess.check_call([sys.executable,os.path.join(here,g+'.py')],cwd=here)
BASE='https://akaththi-labs.github.io/akaththi-labs'
PAGES={'index.html':('index.html','/'),'pod.html':('pod/index.html','/pod/'),'humidifier.html':('humidifier/index.html','/humidifier/'),'kaani.html':('kaani/index.html','/kaani/'),'about.html':('about/index.html','/about/'),'managed-farms.html':('managed-farms/index.html','/managed-farms/')}
BRAND={'mark.svg','favicon.svg','favicon-32.png','apple-touch-icon.png'}
for src in ['index.html','pod.html','humidifier.html','kaani.html','about.html']:
    html=open(os.path.join(stage,src),encoding='utf-8').read()
    out,path=PAGES[src];depth=out.count('/');pre='../'*depth if depth else './'
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
shutil.rmtree(stage,ignore_errors=True)

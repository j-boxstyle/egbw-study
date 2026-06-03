#!/usr/bin/env python3
"""Merge tb_w*.json into textbook_data.js (CHAPTERS, WEEK_CHAPTERS, WEEK_INFO, CONCEPTS, TB_GLOSSARY, EXAM_PROBLEMS)."""
import json, glob, os, re
HERE=os.path.dirname(os.path.abspath(__file__))
SITE=os.path.join(HERE,'..')
OUT=os.path.join(SITE,'textbook_data.js')

CHAP_TITLES={5:"Elasticities",6:"Taxes & subsidies",8:"Price ceilings & floors",9:"International trade",10:"Externalities",13:"Monopoly",15:"Oligopoly",16:"Competing for monopoly (network goods)",17:"Monopolistic competition",18:"Labor markets",22:"Managing incentives",24:"Asymmetric information",25:"Consumer choice",26:"GDP & output measurement",28:"Solow growth model",30:"Aggregate demand & supply",31:"Business fluctuations",32:"Unemployment",33:"Inflation & quantity theory",34:"Central banks & monetary policy",35:"Monetary policy & shocks",38:"International finance"}
WEEK_CHAPTERS={1:[5,6,8,9,10],2:[13,15,16,17,18],3:[22,24,25],5:[26,28],6:[30,31,32,33],7:[34,35,38]}
WEEK_INFO={
 1:"Week 1: Demand & Supply — Elasticities, Taxes, Price Controls, Trade & Externalities",
 2:"Week 2: Firms & Factor Markets — Monopoly, Oligopoly, Network Goods, Labor",
 3:"Week 3: Decision Making — Incentives, Asymmetric Information, Consumer Choice",
 5:"Week 5: Economic Growth — GDP Measurement & the Solow Growth Model",
 6:"Week 6: Business Fluctuations — AD/AS, Shocks, Unemployment & Inflation",
 7:"Week 7: Macroeconomic Policy — Central Banks, Monetary Policy & International Finance",
}

concepts=[]; glossary=[]; exams=[]
for f in sorted(glob.glob(os.path.join(HERE,'tb_w*.json'))):
    d=json.load(open(f,encoding='utf-8'))
    concepts.extend(d.get('concepts',[]))
    glossary.extend(d.get('glossary',[]))
    exams.extend(d.get('examProblems',[]))

# order concepts by week then chapter (stable within)
WEEK_ORDER=[1,2,3,5,6,7]
def wk_idx(w):
    try: return WEEK_ORDER.index(w)
    except: return 99
concepts.sort(key=lambda c:(wk_idx(c.get('week',0)), c.get('ch',0)))

# unique ids
seen=set()
for i,c in enumerate(concepts):
    cid=c.get('id') or ('c%s_%d'%(c.get('ch'),i))
    base=cid; n=2
    while cid in seen: cid=base+'_'+str(n); n+=1
    c['id']=cid; seen.add(cid)

# dedup glossary by lowercased term, keep first; sort alphabetically
gseen=set(); gl=[]
for g in glossary:
    t=(g.get('term') or '').strip()
    k=t.lower()
    if not t or k in gseen: continue
    gseen.add(k); gl.append({'term':t,'def':g.get('def','')})
gl.sort(key=lambda x:x['term'].lower())

# chapters present
chs=sorted({c['ch'] for c in concepts})
CHAPTERS={ch:{'title':CHAP_TITLES.get(ch,'Chapter %d'%ch),'subtitle':'CH%d'%ch} for ch in CHAP_TITLES}

# English-only gate for name/punchline/defEN/example
jp=re.compile(r'[ぁ-んァ-ン一-龥]')
viol=[]
for c in concepts:
    for fld in ['name','punchline','defEN','example']:
        if jp.search(str(c.get(fld,''))): viol.append((c['id'],fld))
print('concepts',len(concepts),'| glossary',len(gl),'| exams',len(exams))
bych={}
for c in concepts: bych[c['ch']]=bych.get(c['ch'],0)+1
print('concepts/chapter',dict(sorted(bych.items())))
print('chapters with <3:',[k for k,v in bych.items() if v<3])
print('English-only violations:',len(viol), viol[:10])

with open(OUT,'w',encoding='utf-8') as f:
    f.write('// EGBW textbook data — auto-generated from Canvas (Cowen & Tabarrok 5e). Source: Canvas only.\n')
    f.write('window.CHAPTERS='+json.dumps(CHAPTERS,ensure_ascii=False)+';\n')
    f.write('window.WEEK_CHAPTERS='+json.dumps(WEEK_CHAPTERS)+';\n')
    f.write('window.WEEK_INFO='+json.dumps(WEEK_INFO,ensure_ascii=False)+';\n')
    f.write('window.CONCEPTS='+json.dumps(concepts,ensure_ascii=False)+';\n')
    f.write('window.TB_GLOSSARY='+json.dumps(gl,ensure_ascii=False)+';\n')
    f.write('window.EXAM_PROBLEMS='+json.dumps(exams,ensure_ascii=False)+';\n')
print('wrote',OUT,round(os.path.getsize(OUT)/1024,1),'KB')

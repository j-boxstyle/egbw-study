#!/usr/bin/env python3
"""Merge week + exam JSON -> validated, balanced questions.js (window.QUESTIONS)."""
import json, glob, os, re, random
random.seed(42)
HERE=os.path.dirname(os.path.abspath(__file__))
OUT=os.path.join(HERE,'..','questions.js')

def norm(s): return re.sub(r'\s+',' ',(s or '').lower()).strip()

files=sorted(glob.glob(os.path.join(HERE,'w*.json')))
if os.path.exists(os.path.join(HERE,'exams.json')):
    files.append(os.path.join(HERE,'exams.json'))

raw=[]
for f in files:
    raw.extend(json.load(open(f,encoding='utf-8')))

BAD=re.compile(r'\ball of (the|these) above\b|\bnone of (the|these) above\b',re.I)
seen=set(); clean=[]; rejected=[]
for q in raw:
    opts=q.get('opts'); ans=q.get('ans')
    # structural checks
    if not isinstance(opts,list) or len(opts)!=4: rejected.append(('opts!=4',q.get('q'))); continue
    if not isinstance(ans,int) or ans<0 or ans>3: rejected.append(('ans',q.get('q'))); continue
    we=q.get('we') or {}
    need={str(i) for i in range(4) if i!=ans}
    if set(we.keys())!=need:
        # repair: rebuild we keys best-effort
        nw={}
        for i in range(4):
            if i==ans: continue
            nw[str(i)]=we.get(str(i)) or '誤り。正解の選択肢が教材の定義に合致するため、この選択肢は当てはまらない。'
        we=nw
    # reject ambiguous correct answers
    if BAD.search(str(opts[ans])): rejected.append(('all/none correct',q.get('q'))); continue
    k=norm(q.get('q'))+'|'+norm(opts[ans])
    if k in seen: rejected.append(('dup',q.get('q'))); continue
    seen.add(k)
    q['we']=we
    clean.append(q)

# ---- balance answer position to ~25% each with anti-3-streak ----
order=list(range(len(clean)))
random.shuffle(order)
targets=[]
slot_cycle=[0,1,2,3]
# round-robin target slots, shuffled per group of 4
i=0
while len(targets)<len(clean):
    g=slot_cycle[:]; random.shuffle(g); targets.extend(g)
targets=targets[:len(clean)]
# anti-streak: avoid 3 same consecutive in final sequence order
def remap(q,newpos):
    opts=q['opts']; ans=q['ans']; we=q['we']
    correct=opts[ans]
    distract=[(i,opts[i]) for i in range(4) if i!=ans]  # keep order
    newopts=[None]*4
    newopts[newpos]=correct
    slots=[s for s in range(4) if s!=newpos]
    newwe={}
    for (oldi,text),s in zip(distract,slots):
        newopts[s]=text
        newwe[str(s)]=we[str(oldi)]
    q['opts']=newopts; q['ans']=newpos; q['we']=newwe
    return q

# assign in shuffled order, fix streaks
seq=[clean[idx] for idx in order]
final_pos=[]
for n,q in enumerate(seq):
    t=targets[n]
    if len(final_pos)>=2 and final_pos[-1]==final_pos[-2]==t:
        # pick a different slot
        for alt in [(t+1)%4,(t+2)%4,(t+3)%4]:
            if not(len(final_pos)>=2 and final_pos[-1]==final_pos[-2]==alt):
                t=alt; break
    remap(q,t); final_pos.append(t)

# restore a stable ordering: by week, then ch, then keep variety
seq.sort(key=lambda q:(q.get('week',0),q.get('ch',0)))
for i,q in enumerate(seq): q['id']=i+1

dist={0:0,1:0,2:0,3:0}
for q in seq: dist[q['ans']]+=1
total=len(seq)
print('TOTAL',total,'| ans dist A/B/C/D =',[round(100*dist[i]/total) for i in range(4)],'%')
by_w={}
for q in seq: by_w[q['week']]=by_w.get(q['week'],0)+1
print('by week',dict(sorted(by_w.items())))
by_src={}
for q in seq:
    s='Past Exam' if 'Past Exam' in q.get('source','') else ('Weekly Test' if 'Weekly Test' in q.get('source','') else ('Exercise' if 'Exercise' in q.get('source','') else 'Slides'))
    by_src[s]=by_src.get(s,0)+1
print('by source',by_src)
print('rejected',len(rejected))

with open(OUT,'w',encoding='utf-8') as f:
    f.write('// EGBW questions — auto-generated, source: Canvas (Cowen & Tabarrok 5e) only\n')
    f.write('window.QUESTIONS='+json.dumps(seq,ensure_ascii=False)+';\n')
print('wrote',OUT, os.path.getsize(OUT),'bytes')

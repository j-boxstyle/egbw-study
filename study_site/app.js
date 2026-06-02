/* EGBW study site engine — vanilla JS. Source data: Canvas only. */
'use strict';
const Q = window.QUESTIONS || [];
const C = window.CONTENT || {weeks:[],glossary:[],chapterTitles:{}};
const DK = "わからない"; // 5th option label
const LS = {
  prog:'egbw_progress_v1', modes:'egbw_modes_v1', tab:'egbw_tab_v1'
};
const WEEK_TITLES = {1:"Demand & supply",2:"Firms & factor markets",3:"Decision making",5:"Economic growth",6:"Business fluctuations",7:"Macro policy"};

/* ---------- persistence ---------- */
function loadProg(){ try{return JSON.parse(localStorage.getItem(LS.prog))||{};}catch(e){return {};} }
function saveProg(p){ try{localStorage.setItem(LS.prog,JSON.stringify(p));}catch(e){} }
let PROG = loadProg();   // { [id]: {category, chosen, isDk, usedAnalysis, usedVerify} }

/* category for a question id (auto) */
function catOf(id){
  const r = PROG[id];
  if(!r) return 'unanswered';
  if(r.isDk) return 'dk';
  if(r.category==='correct') return r.usedAnalysis||r.usedVerify ? 'review' : 'correct';
  // wrong
  return r.usedAnalysis||r.usedVerify ? 'wrong_studied' : 'wrong';
}

/* ---------- state ---------- */
const quizState = {
  block: [], blockResults: [], index: 0, answered:false, chosen:null,
  modes:['all'], selectedWeeks:[], selectedChs:[], passModes:[0], sources:['all']
};
// passModes meaning kept for parity; sources: all/exam/exercise/test/slides

/* ---------- option shuffling ---------- */
function shuffleQuestionOptionsAt(q, targetSlot){
  // builds q._opts (5 incl. DK), q._ans index, q._we map (index->reason)
  const base = q.opts.slice(0,4);
  const correct = base[q.ans];
  const distract = [];
  for(let i=0;i<4;i++) if(i!==q.ans) distract.push({t:base[i], r:(q.we&&q.we[String(i)])||''});
  // Fisher-Yates on distractors
  for(let i=distract.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[distract[i],distract[j]]=[distract[j],distract[i]];}
  const slots=[0,1,2,3];
  const out=new Array(4); out[targetSlot]=correct;
  const free=slots.filter(s=>s!==targetSlot);
  const we={};
  free.forEach((s,k)=>{ out[s]=distract[k].t; we[s]=distract[k].r; });
  q._opts = out.concat([DK]);
  q._ans = targetSlot;
  q._we = we;
}
function shuffleBlockOptions(block){
  // stratified targets: cycle 0..3 so 20 questions => ~5 each, with anti-3-streak
  const n=block.length;
  let targets=[];
  while(targets.length<n){ const g=[0,1,2,3]; for(let i=g.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[g[i],g[j]]=[g[j],g[i]];} targets=targets.concat(g); }
  targets=targets.slice(0,n);
  for(let i=2;i<n;i++){ if(targets[i]===targets[i-1]&&targets[i-1]===targets[i-2]){ targets[i]=(targets[i]+1)%4; } }
  block.forEach((q,i)=>shuffleQuestionOptionsAt(q,targets[i]));
}

/* ---------- filtering ---------- */
function srcKey(q){
  const s=q.source||'';
  if(/Past Exam/i.test(s)) return 'exam';
  if(/Weekly Test/i.test(s)) return 'test';
  if(/Exercise/i.test(s)) return 'exercise';
  return 'slides';
}
function getFilteredQuestions(){
  const wk=quizState.selectedWeeks, ch=quizState.selectedChs, modes=quizState.modes, src=quizState.sources;
  return Q.filter(q=>{
    if(wk.length && !wk.includes(q.week)) return false;
    if(ch.length && !ch.includes(q.ch)) return false;
    if(!src.includes('all') && !src.includes(srcKey(q))) return false;
    if(modes.includes('all')) return true;
    // OR union across selected modes
    const c=catOf(q.id);
    let ok=false;
    if(modes.includes('wrong') && (c==='wrong'||c==='wrong_studied')) ok=true;
    if(modes.includes('dk') && c==='dk') ok=true;
    if(modes.includes('unanswered') && c==='unanswered') ok=true;
    return ok;
  });
}

/* ---------- block building ---------- */
function buildBlock(){
  let pool=getFilteredQuestions().slice();
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  quizState.block = pool.slice(0,20);
  quizState.blockResults = new Array(quizState.block.length).fill(null);
  quizState.index=0; quizState.answered=false; quizState.chosen=null;
  if(quizState.block.length) shuffleBlockOptions(quizState.block);
}

/* ---------- rendering ---------- */
function el(id){return document.getElementById(id);}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

function renderQuiz(){
  renderFilters();
  if(!quizState.block.length){ buildBlock(); }
  renderQuestion();
}

function renderFilters(){
  const weeks=[1,2,3,5,6,7];
  const chs=[...new Set(Q.map(q=>q.ch))].sort((a,b)=>a-b);
  const modeDefs=[['all','すべて'],['wrong','❌復習(誤答)'],['dk','❓わからない'],['unanswered','◻️未回答']];
  const srcDefs=[['all','全範囲'],['exam','過去問'],['exercise','演習'],['test','週テスト'],['slides','講義']];
  const chip=(active,label,onclick)=>`<button class="chip${active?' on':''}" onclick="${onclick}">${esc(label)}</button>`;
  let h='';
  h+='<div class="frow"><span class="flab">週</span>'+weeks.map(w=>chip(quizState.selectedWeeks.includes(w),'W'+w,`toggleWeek(${w})`)).join('')+'</div>';
  h+='<div class="frow"><span class="flab">章</span>'+chs.map(c=>chip(quizState.selectedChs.includes(c),'Ch'+c,`toggleCh(${c})`)).join('')+'</div>';
  h+='<div class="frow"><span class="flab">出題</span>'+srcDefs.map(([k,l])=>chip(quizState.sources.includes(k),l,`toggleSrc('${k}')`)).join('')+'</div>';
  h+='<div class="frow"><span class="flab">モード</span>'+modeDefs.map(([k,l])=>chip(quizState.modes.includes(k),l,`toggleMode('${k}')`)).join('')+'</div>';
  const cnt=getFilteredQuestions().length;
  h+=`<div class="frow"><button class="btn primary" onclick="startBlock()">▶ この条件で20問</button><span class="cnt">該当 ${cnt} 問</span></div>`;
  el('filters').innerHTML=h;
}

function renderQuestion(){
  const card=el('qcard');
  if(!quizState.block.length){ card.innerHTML='<div class="empty">該当する問題がありません。フィルタを変えてください。</div>'; el('qfooter').innerHTML=''; return; }
  const q=quizState.block[quizState.index];
  const r=quizState.blockResults[quizState.index];
  const answered = r!==null;
  const chTitle=(C.chapterTitles[q.ch]||'');
  let h='';
  h+=`<div class="qmeta">Q${quizState.index+1}/${quizState.block.length} ｜ <span class="badge">W${q.week} Ch${q.ch} ${esc(chTitle)}</span> <span class="src">${esc(q.source||'')}</span></div>`;
  if(q.fig) h+=`<div class="fig">${q.fig}</div>`;
  h+=`<div class="qtext">${esc(q.q)}</div>`;
  h+='<div class="opts">';
  q._opts.forEach((opt,i)=>{
    let cls='opt';
    if(answered){
      if(i===q._ans) cls+=' correct';
      else if(i===r.chosen) cls+=' wrong';
      if(i===4 && r.chosen===4) cls+=' dk';
    }
    const letter=i===4?'?':String.fromCharCode(65+i);
    const onclick = answered ? '' : `onclick="selectOption(${i})"`;
    h+=`<button class="${cls}" ${onclick}><span class="ol">${letter}</span><span>${esc(opt)}</span></button>`;
  });
  h+='</div>';
  if(answered){
    const ok=r.chosen===q._ans, dk=r.chosen===4;
    h+=`<div class="result ${ok?'ok':(dk?'dk':'ng')}">${ok?'✅ 正解':(dk?'❓ わからない':'❌ 不正解')}</div>`;
    h+=`<div class="exp"><b>解説</b><br>${esc(q.exp)}</div>`;
    if(!ok && !dk && q._we && q._we[r.chosen]) h+=`<div class="we">あなたの選択の誤り: ${esc(q._we[r.chosen])}</div>`;
    h+=`<div class="airow"><button class="btn ai" onclick="copyAnalysis(${q.id})">📋 分析プロンプト</button><button class="btn ai" onclick="copyVerify(${q.id})">🎯 確認テスト</button></div>`;
  }
  card.innerHTML=h;
  // footer: 2 buttons only
  const prevDis=quizState.index<=0?'disabled':'';
  const isLast=quizState.index>=quizState.block.length-1;
  el('qfooter').innerHTML=
    `<button class="btn" ${prevDis} onclick="prevQuestion()">◀ 前の問題</button>`+
    `<button class="btn primary" onclick="nextQuestion()">${isLast?'結果を見る ▶':'次へ ▶'}</button>`;
}

function selectOption(idx){
  const q=quizState.block[quizState.index];
  const isDk = idx===4;
  const correct = idx===q._ans;
  const prev=PROG[q.id]||{};
  quizState.blockResults[quizState.index]={q:q.id,chosen:idx,correct,isDk,usedAnalysis:prev.usedAnalysis||false,usedVerify:prev.usedVerify||false,category:isDk?'dk':(correct?'correct':'wrong')};
  // persist
  PROG[q.id]={category:isDk?'dk':(correct?'correct':'wrong'),chosen:idx,isDk,usedAnalysis:prev.usedAnalysis||false,usedVerify:prev.usedVerify||false};
  saveProg(PROG);
  quizState.answered=true;
  renderQuestion();
}
function nextQuestion(){
  if(quizState.index>=quizState.block.length-1){ renderBlockResult(); return; }
  quizState.index++; quizState.answered=false; quizState.chosen=null; renderQuestion();
}
function prevQuestion(){ if(quizState.index>0){quizState.index--; renderQuestion();} }

function renderBlockResult(){
  const cats={correct:0,wrong_studied:0,wrong:0,dk:0,unanswered:0};
  const items=[];
  quizState.block.forEach((q,i)=>{
    const r=quizState.blockResults[i];
    if(!r){cats.unanswered++; return;}
    const c=catOf(q.id); cats[c]=(cats[c]||0)+1;
    items.push({q,r});
  });
  const answered=items.length, correct=quizState.block.filter((q,i)=>quizState.blockResults[i]&&quizState.blockResults[i].correct).length;
  let h=`<div class="bres"><h2>ブロック結果</h2>`;
  h+=`<div class="score">${correct} / ${answered} 正解</div>`;
  h+=`<div class="catrow">⚠️誤答+確認 ${cats.wrong_studied||0}｜❌誤答 ${cats.wrong||0}｜❓わからない ${cats.dk||0}｜✅正解 ${cats.correct||0}</div>`;
  const wrongIds=items.filter(x=>!x.r.correct).map(x=>x.q.id);
  if(answered>=10){
    h+=`<div class="airow"><button class="btn ai" onclick="copyBatchAnalysis()">📋 バッチ分析(一括)</button><button class="btn ai" onclick="copyBatchVerify()">🎯 確認テスト15問(一括)</button></div>`;
  }
  h+=`<div class="airow"><button class="btn primary" onclick="startBlock()">▶ もう20問</button><button class="btn" onclick="showTab('quiz')">フィルタに戻る</button></div>`;
  h+='</div>';
  el('qcard').innerHTML=h; el('qfooter').innerHTML='';
  window._lastWrong=wrongIds; window._lastBlock=quizState.block.map(q=>q.id);
}
function startBlock(){ buildBlock(); renderQuestion(); window.scrollTo(0,0); }

/* ---------- filter toggles ---------- */
function toggleIn(arr,v){ const i=arr.indexOf(v); if(i>=0)arr.splice(i,1); else arr.push(v); }
function toggleWeek(w){ toggleIn(quizState.selectedWeeks,w); renderFilters(); }
function toggleCh(c){ toggleIn(quizState.selectedChs,c); renderFilters(); }
function toggleSrc(k){
  if(k==='all'){ quizState.sources=['all']; }
  else { quizState.sources=quizState.sources.filter(x=>x!=='all'); toggleIn(quizState.sources,k); if(!quizState.sources.length)quizState.sources=['all']; }
  renderFilters();
}
function toggleMode(k){
  const m=quizState.modes;
  if(k==='all'){ quizState.modes=['all']; }
  else {
    let n=m.filter(x=>x!=='all'); const i=n.indexOf(k); if(i>=0)n.splice(i,1); else n.push(k);
    quizState.modes = n.length? n : ['all'];
  }
  try{localStorage.setItem(LS.modes,JSON.stringify(quizState.modes));}catch(e){}
  renderFilters();
}

/* ---------- AI prompts (Opus 4.8) ---------- */
const MODEL='【Opus 4.8】';
const COMMON_RULES=
`# 作問ルール（厳守）
- あなたは UvA「Economics in a Global Business World」(教科書: Cowen & Tabarrok, Modern Principles of Economics 5e) の教師。
- 出題範囲は **Canvas教材の論点のみ**。教材外の一般知識・新事実は混ぜない。
- 同じ概念で**新しいシナリオ**を作る（元問題のコピペ禁止）。
- 各問は **5択 + F) わからない**。
- **正解位置を完全ランダム**に。まず正解配列(例 [D,A,E,C,B])を決めてから本文を書く。**B偏り禁止**。
- **正解は必ず1つだけ**。複数正解・等価判定（"A and B"等）禁止。誤答は明確に誤りと分かるものにする。
- 計算問題は **substitution形式**（数値代入の途中式）で。
- 難易度は基礎→本番レベルへ。
- **問題文・選択肢=英語 / 解説=日本語**。数式はLaTeX。`;

function qBrief(q){
  return `- [W${q.week} Ch${q.ch} ${C.chapterTitles[q.ch]||''}] ${q.q}\n  正解: ${q.opts[q.ans]}\n  概念: ${q.conceptId}`;
}
function markUsed(id,kind){
  const p=PROG[id]||{category:'unanswered'};
  if(kind==='a')p.usedAnalysis=true; else p.usedVerify=true;
  PROG[id]=p; saveProg(PROG);
}
function fallbackCopy(text,msg){
  const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
  let ok=false;try{ok=document.execCommand('copy');}catch(e){}
  document.body.removeChild(ta);toast(ok?(msg||'コピーしました'):'コピー失敗。手動で選択してください');
}
function copyToClip(text,msg){
  if(navigator&&navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(()=>toast(msg||'コピーしました')).catch(()=>fallbackCopy(text,msg));
  } else { fallbackCopy(text,msg); }
}
function copyAnalysis(id){
  const q=Q.find(x=>x.id===id); markUsed(id,'a');
  const t=`${MODEL} 次の問題を私が間違えました。なぜ間違えたかを診断し、つまずいている概念を特定して、同じ概念の類題を3問出してください。\n\n## 間違えた問題\n${qBrief(q)}\n\n${COMMON_RULES}\n\n## 出力\n1. 誤解の診断（日本語）\n2. 押さえるべき核心概念（日本語、Canvas教材の範囲）\n3. 類題3問（英語問題＋5択＋F)わからない、正解位置ランダム、最後に日本語解説）`;
  copyToClip(t,'分析プロンプトをコピー → '+MODEL+'に貼り付け');
}
function copyVerify(id){
  const q=Q.find(x=>x.id===id); markUsed(id,'v');
  const t=`${MODEL} 次の問題と同じ概念の確認テストを5問作ってください。\n\n## 対象\n${qBrief(q)}\n\n${COMMON_RULES}\n\n## 出力\n- 英語の問題5問（5択＋F)わからない、正解位置を必ずランダム化）\n- 最後にまとめて解答と日本語解説（substitution形式の計算過程含む）`;
  copyToClip(t,'確認テストをコピー → '+MODEL);
}
function copyBatchAnalysis(){
  const ids=window._lastBlock||[]; const res=quizState.blockResults;
  const cat={wrongStudied:[],wrong:[],dk:[],reviewed:[],correct:[]};
  quizState.block.forEach((q,i)=>{const r=res[i]; if(!r)return; if(r.isDk)cat.dk.push(q); else if(r.correct){ (catOf(q.id)==='review'?cat.reviewed:cat.correct).push(q);} else {(catOf(q.id)==='wrong_studied'?cat.wrongStudied:cat.wrong).push(q);} q&&markUsed(q.id,'a');});
  const sec=(arr)=>arr.length?arr.map(qBrief).join('\n'):'（なし）';
  const t=`${MODEL} 直近20問の結果を分析し、弱点TOP3と確認テスト15問を作ってください。\n\n## 結果（5カテゴリ）\n### ⚠️ 誤答＋過去に確認済み\n${sec(cat.wrongStudied)}\n### ❌ 単純な誤答\n${sec(cat.wrong)}\n### ❓ わからない\n${sec(cat.dk)}\n### 🔍 正解だが確認した\n${sec(cat.reviewed)}\n### ✅ 完全正解\n${sec(cat.correct)}\n\n${COMMON_RULES}\n\n## 出力\n1. **弱点TOP3**（日本語、Canvas教材の範囲で）\n2. **確認テスト15問**（英語、5択＋F)わからない、正解位置ランダム、弱点に重点配分）\n3. 末尾に解答＋日本語解説（計算はsubstitution形式）`;
  copyToClip(t,'バッチ分析(15問)をコピー → '+MODEL);
}
function copyBatchVerify(){
  const wrong=(window._lastWrong||[]).map(id=>Q.find(q=>q.id===id)).filter(Boolean);
  wrong.forEach(q=>markUsed(q.id,'v'));
  const t=`${MODEL} 私が間違えた以下の問題の概念について、確認テストを15問作ってください。\n\n## 間違えた問題\n${wrong.length?wrong.map(qBrief).join('\n'):'（なし。直近ブロックの主要概念から出題して）'}\n\n${COMMON_RULES}\n\n## 出力\n- 英語15問（5択＋F)わからない、正解位置ランダム）\n- 末尾に解答＋日本語解説`;
  copyToClip(t,'確認テスト15問をコピー → '+MODEL);
}

/* ---------- toast ---------- */
let _toastT=null;
function toast(msg){ const t=el('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(_toastT); _toastT=setTimeout(()=>t.classList.remove('show'),2600); }

/* ---------- textbook / summary / glossary ---------- */
function renderTextbook(){
  const chs=[...new Set(Q.map(q=>q.ch))].sort((a,b)=>a-b);
  let h='<div class="doc"><h1>📖 教科書（章別要点）</h1><p class="muted">Cowen &amp; Tabarrok, Modern Principles of Economics 5e（Canvas教材より）</p>';
  C.weeks.forEach(wk=>{
    h+=`<h2>Week ${wk.w} — ${esc(wk.title)} <span class="muted">(Ch ${wk.chs.join(', ')})</span></h2>`;
    h+='<ul>'+wk.summary.map(s=>`<li>${esc(s)}</li>`).join('')+'</ul>';
  });
  h+='</div>';
  el('view-text').innerHTML=h;
}
function renderSummary(){
  let h='<div class="doc"><h1>📋 まとめ（週別1ページ）</h1>';
  C.weeks.forEach(wk=>{
    const n=Q.filter(q=>q.week===wk.w).length;
    h+=`<div class="wcard"><h2>Week ${wk.w}: ${esc(wk.title)}</h2><div class="muted">Chapters ${wk.chs.join(', ')} ｜ 問題 ${n}問</div><ul>`+wk.summary.map(s=>`<li>${esc(s)}</li>`).join('')+`</ul><button class="btn primary" onclick="quizWeek(${wk.w})">この週をクイズ ▶</button></div>`;
  });
  h+='</div>';
  el('view-summary').innerHTML=h;
}
function quizWeek(w){ quizState.selectedWeeks=[w]; quizState.selectedChs=[]; quizState.modes=['all']; quizState.sources=['all']; showTab('quiz'); buildBlock(); renderQuiz(); }
function renderGlossary(){
  let h='<div class="doc"><h1>📚 用語集（日英対訳）</h1><input id="gsearch" class="gsearch" placeholder="検索 (英語/日本語)" oninput="filterGloss(this.value)"><div id="glist">';
  h+=glossHtml('');
  h+='</div></div>';
  el('view-glossary').innerHTML=h;
}
function glossHtml(term){
  const t=(term||'').toLowerCase();
  const byCh={};
  (C.glossary||[]).forEach(g=>{ if(t && !(g.en.toLowerCase().includes(t)||g.ja.toLowerCase().includes(t)))return; (byCh[g.ch]=byCh[g.ch]||[]).push(g); });
  let h='';
  Object.keys(byCh).map(Number).sort((a,b)=>a-b).forEach(ch=>{
    h+=`<h3>Ch${ch} — ${esc(C.chapterTitles[ch]||'')}</h3>`;
    byCh[ch].forEach(g=>{ h+=`<div class="gitem"><span class="gen">${esc(g.en)}</span><span class="gja">${esc(g.ja)}</span></div>`; });
  });
  return h||'<div class="muted">該当なし</div>';
}
function filterGloss(v){ el('glist').innerHTML=glossHtml(v); }

/* ---------- tabs ---------- */
function showTab(name){
  ['text','summary','quiz','glossary','menu'].forEach(t=>{
    el('view-'+t).style.display = t===name?'block':'none';
    const b=el('tab-'+t); if(b) b.classList.toggle('on',t===name);
  });
  try{localStorage.setItem(LS.tab,name);}catch(e){}
  if(name==='quiz') renderQuiz();
  if(name==='text') renderTextbook();
  if(name==='summary') renderSummary();
  if(name==='glossary') renderGlossary();
  if(name==='menu') renderMenu();
  window.scrollTo(0,0);
}
function renderMenu(){
  const total=Q.length;
  let done=0,correct=0,wrong=0,dk=0;
  Object.keys(PROG).forEach(id=>{ const c=catOf(id); if(c!=='unanswered')done++; if(c==='correct'||c==='review')correct++; if(c==='wrong'||c==='wrong_studied')wrong++; if(c==='dk')dk++; });
  let h='<div class="doc"><h1>☰ メニュー</h1>';
  h+=`<div class="stat">総問題数 <b>${total}</b></div>`;
  h+=`<div class="stat">回答済み <b>${done}</b>（✅${correct} ❌${wrong} ❓${dk}）</div>`;
  const byW={}; Q.forEach(q=>byW[q.week]=(byW[q.week]||0)+1);
  h+='<h2>週別問題数</h2><ul>'+[1,2,3,5,6,7].map(w=>`<li>W${w} ${WEEK_TITLES[w]}: ${byW[w]||0}問</li>`).join('')+'</ul>';
  const bySrc={}; Q.forEach(q=>{const k=srcKey(q);bySrc[k]=(bySrc[k]||0)+1;});
  h+=`<h2>出題ソース</h2><ul><li>過去問: ${bySrc.exam||0}</li><li>演習: ${bySrc.exercise||0}</li><li>週テスト: ${bySrc.test||0}</li><li>講義: ${bySrc.slides||0}</li></ul>`;
  h+=`<h2>データ</h2><button class="btn" onclick="resetProgress()">学習履歴をリセット</button>`;
  h+='<p class="muted">全問 Canvas 教材（Cowen &amp; Tabarrok 5e）由来。AI連携モデル: '+MODEL+'</p></div>';
  el('view-menu').innerHTML=h;
}
function resetProgress(){ if(confirm('学習履歴を全て消去しますか？')){ PROG={}; saveProg(PROG); toast('リセットしました'); renderMenu(); } }

/* ---------- init ---------- */
function init(){
  try{const m=JSON.parse(localStorage.getItem(LS.modes)); if(Array.isArray(m)&&m.length)quizState.modes=m;}catch(e){}
  const last=(function(){try{return localStorage.getItem(LS.tab);}catch(e){return null;}})()||'quiz';
  showTab(last);
}
document.addEventListener('DOMContentLoaded',init);

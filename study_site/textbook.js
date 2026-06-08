/* EGBW textbook tab — 8-block concept cards. Render functions ported from the accounting reference. */
'use strict';
(function(){
function escapeHtml(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function renderConceptDiagram(){ return ''; } // no SVG diagrams in EGBW build
function MATH(html){ return (window.renderMathInHtml ? window.renderMathInHtml(html) : html); }
// inline formatter for English fields: escape + **bold** + *em*
function enFmt(s){ return escapeHtml(s||'').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*\n]+)\*/g,'<em>$1</em>'); }
// English definition → keyword chips (the bold key terms only). Falls back to sentence
// bullets when there are too few bold terms, and to the rich renderer for tables/code.
// Key Terms section: English term — concise meaning pairs. Returns '' when too sparse.
function keyTermsHtml(defEN, defJA){
  var str=defEN||'';
  if(!str) return '';
  var G=window.TB_GLOSSARY||[];
  function gloss(term){
    var tl=term.toLowerCase();
    for(var i=0;i<G.length;i++){ if(G[i].term.toLowerCase()===tl) return G[i].def; }
    for(var j=0;j<G.length;j++){ var gt=G[j].term.toLowerCase(); if(gt.length>4 && (tl.indexOf(gt)>=0||gt.indexOf(tl)>=0)) return G[j].def; }
    return null;
  }
  var rows=[], seen={};
  // 1) concise English-term (Japanese-meaning) pairs taken from the JA definition
  var pp=/\*\*([A-Za-z][A-Za-z0-9 \/&'\-]*?)\*\*\s*[（(]([^（）()]{1,40})[）)]/g, pm;
  while((pm=pp.exec(defJA||''))!==null){
    var t=pm[1].trim(), k=t.toLowerCase();
    if(!t||seen[k]) continue; seen[k]=1;
    rows.push({term:t, def:pm[2].trim()});
  }
  // 2) add remaining bold keywords from defEN that have a glossary meaning
  var bb=/\*\*([^*]+)\*\*/g, bm;
  while((bm=bb.exec(str))!==null){
    var bt=bm[1].trim(), bk=bt.toLowerCase();
    if(!bt||seen[bk]) continue;
    var g=gloss(bt);
    if(g){ seen[bk]=1; rows.push({term:bt, def:g}); }
  }
  if(rows.length<2) return '';
  var html='<div class="def-kw-defs">';
  for(var r=0;r<rows.length;r++){
    html+='<div class="def-kw-row"><span class="kw">'+escapeHtml(rows[r].term)+'</span><span class="kw-def">'+escapeHtml(rows[r].def)+'</span></div>';
  }
  html+='</div>';
  return html;
}
// English definition → scannable keyword bullets (one per sentence). Falls back to the
// rich renderer when the source contains a table or code block.
function renderDefBullets(str){
  if(!str) return '';
  if(/```|(\n\s*\|)/.test(str)) return renderDefEN(str);
  var parts=[];
  str.split(/\n+/).forEach(function(line){
    line=line.trim(); if(!line) return;
    var re=/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g, m;
    while((m=re.exec(line))!==null){ var s=m[0].trim(); if(s) parts.push(s); }
  });
  if(!parts.length) return renderDefEN(str);
  var html='<ul class="def-kw-list">';
  for(var i=0;i<parts.length;i++){
    var s=escapeHtml(parts[i]).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*\n]+)\*/g,'<em>$1</em>');
    html+='<li>'+s+'</li>';
  }
  html+='</ul>';
  return html;
}

// ---- renderMd (ported verbatim) ----
function renderMd(str) {
  if (!str) return '';
  var blocks = [];
  var s = str.replace(/```([\s\S]*?)```/g, function(_, code) {
    var idx = blocks.length; blocks.push(code.replace(/^\n/, '').replace(/\n$/, '')); return '\x00CODE' + idx + '\x00';
  });
  s = escapeHtml(s);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\n/g, '<br>');
  s = s.replace(/\x00CODE(\d+)\x00(?:<br>)?/g, function(_, i) {
    return '<pre class="md-code">' + escapeHtml(blocks[parseInt(i, 10)]) + '</pre>';
  });
  return s;
}

// ---- renderDefEN (ported verbatim) ----
function renderDefEN(str) {
  if (!str) return '';
  var blocks = [];
  var raw = str.replace(/```([\s\S]*?)```/g, function(_, code) {
    var idx = blocks.length; blocks.push(code.replace(/^\n/, '').replace(/\n$/, '')); return '\x01CODE' + idx + '\x01';
  });
  var tables = [];
  raw = raw.replace(/(?:^|\n)((?:\|[^\n]*\|\s*\n){2,})/g, function(m, body) {
    var rows = body.trim().split('\n').map(function(line){
      return line.replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map(function(c){return c.trim();});
    });
    rows = rows.filter(function(r){ return !r.every(function(c){return /^-+:?$|^:?-+$|^$/.test(c);}); });
    var idx = tables.length; tables.push(rows); return '\n\x02TABLE' + idx + '\x02';
  });
  var marked = raw.replace(/([.!?])\s+(\*\*[A-Z(])/g, '$1\x00$2');
  marked = marked.replace(/\s+(\(\d+\)\s*\*\*)/g, '\x00$1');
  marked = marked.replace(/(?:[:：]\s+|\s{2,})(\*\*\(\d+\))/g, '\x00$1');
  marked = marked.replace(/([.!?])\s+(\*\*\(\d+\))/g, '$1\x00$2');
  marked = marked.replace(/(?:[:：]\s+|\s{2,})(\*\*\([a-z]\))/g, '\x00$1');
  marked = marked.replace(/([.!?])\s+(\*\*\([a-z]\))/g, '$1\x00$2');
  marked = marked.replace(/\n\s*(•\s)/g, '\x00$1');
  marked = marked.replace(/\n\s*(→\s)/g, '\x00$1');
  marked = marked.replace(/\n\s*(\([a-z]\)\s)/g, '\x00$1');
  marked = marked.replace(/\n\s*(Step \d+[:.])/gi, '\x00$1');
  marked = marked.replace(/\n\s*(Example\s*[A-Z0-9]?[:.])/g, '\x00$1');
  marked = marked.replace(/\n\s*(\*\*[A-Z][A-Za-z &/()\-]{1,40}:\*\*)/g, '\x00$1');
  marked = marked.replace(/\n\n+/g, '\x00');
  var parts = marked.split('\x00');
  function renderTable(rows){
    if (!rows.length) return '';
    var h = '<div class="md-table-wrap"><table class="md-table">';
    h += '<thead><tr>';
    rows[0].forEach(function(c){ h += '<th>' + escapeHtml(c).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>') + '</th>'; });
    h += '</tr></thead><tbody>';
    for (var r = 1; r < rows.length; r++) {
      h += '<tr>';
      rows[r].forEach(function(c){ h += '<td>' + escapeHtml(c).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>') + '</td>'; });
      h += '</tr>';
    }
    h += '</tbody></table></div>';
    return h;
  }
  function fmt(part) {
    var s = escapeHtml(part);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
    s = s.replace(/(^|[\s;:>])\(([a-z])\)\s+/g, function(_, lead, ch) { var n = ch.charCodeAt(0) - 96; return lead + '[' + n + '] '; });
    s = s.replace(/(=\s+[^<\n—]+?)\s+—\s+([A-Z])/g, '$1<br>→ $2');
    s = s.replace(/(^|\n)\s*[•\-]\s+([^\n]+)/g, '$1<span class="def-bullet">• $2</span>');
    s = s.replace(/\n/g, '<br>');
    s = s.replace(/\x01CODE(\d+)\x01(?:<br>)?/g, function(_, idx) { return '<pre class="md-code">' + escapeHtml(blocks[parseInt(idx,10)]) + '</pre>'; });
    s = s.replace(/(?:<br>)?\x02TABLE(\d+)\x02(?:<br>)?/g, function(_, idx) { return renderTable(tables[parseInt(idx,10)]); });
    return s;
  }
  var nodes = [];
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i].trim();
    if (!part) continue;
    var only = part.match(/^\x01CODE(\d+)\x01$/);
    if (only) { nodes.push({type:'code', idx: parseInt(only[1],10)}); continue; }
    var onlyT = part.match(/^\x02TABLE(\d+)\x02$/);
    if (onlyT) { nodes.push({type:'table', idx: parseInt(onlyT[1],10)}); continue; }
    var stripped = part.replace(/\*\*/g, '').trim();
    var firstLine = stripped.split('\n')[0];
    var isSub = /^\(\d+\)/.test(stripped) || /^\([a-z]\)/.test(stripped) || /^Step\s+\d/i.test(stripped);
    var isExample = /^Example\b/.test(stripped);
    var isCont = /^(→|•|-\s)/.test(stripped) || isExample;
    var isSection = !isExample && !isSub && (
      /^(Three|Two|Four|Five|Six|Seven|Eight|Process|Variants?|Conversions?|Formula|Structure|Pros|Cons|Red Flags|Why|Note|Common|Key|Three Types|Industry|Authorization|Memory|Compare|Period)\b/i.test(stripped)
      || (/^[A-Z][A-Za-z &/()\-]+:\s*$/.test(firstLine))
      || (/^[A-Z][A-Za-z &/()\-]+:$/.test(firstLine.replace(/<[^>]+>/g,'')))
    );
    if (isSection) nodes.push({type:'section', raw: part});
    else if (isSub) nodes.push({type:'sub', raw: part});
    else if (isCont) nodes.push({type:'cont', raw: part});
    else nodes.push({type:'plain', raw: part});
  }
  var CIRCLED_NUMS = ['','①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬','⑭','⑮'];
  function convertSubMarker(raw) {
    var s = fmt(raw);
    s = s.replace(/^(<strong>)?\((\d+)\)(\s+)/, function(_, b1, n, sp) { var ci = CIRCLED_NUMS[parseInt(n,10)] || ('(' + n + ')'); return (b1 || '') + ci + sp; });
    s = s.replace(/^(<strong>)?\(([a-z])\)(\s+)/, function(_, b1, ch, sp) { var n = ch.charCodeAt(0) - 96; return (b1 || '') + '[' + n + ']' + sp; });
    return s;
  }
  var html = ''; var cardOpen = false;
  function closeCard(){ if (cardOpen){ html += '</section>'; cardOpen = false; } }
  function splitSectionTitle(raw) {
    var m = raw.match(/^(\*\*[^*\n]+?:\*\*)\s*([\s\S]+)$/);
    if (m && m[2].trim()) return { title: m[1], body: m[2] };
    var firstLineEnd = raw.indexOf('\n');
    if (firstLineEnd > 0) {
      var firstLine = raw.substring(0, firstLineEnd).trim();
      var stripped = firstLine.replace(/^\*\*|\*\*$/g, '');
      if (/[:：]$/.test(stripped) && stripped.length < 80) { return { title: firstLine, body: raw.substring(firstLineEnd + 1).trim() }; }
    }
    var colonIdx = raw.indexOf(':');
    if (colonIdx > 0 && colonIdx < 60) {
      var head = raw.substring(0, colonIdx);
      var headStripped = head.replace(/\*\*/g, '').trim();
      var asteriskCount = (head.match(/\*\*/g) || []).length;
      if (asteriskCount % 2 === 0 && headStripped.length < 50 && /^[A-Z]/.test(headStripped)) {
        return { title: raw.substring(0, colonIdx + 1), body: raw.substring(colonIdx + 1).trim() };
      }
    }
    return { title: raw, body: '' };
  }
  for (var i2 = 0; i2 < nodes.length; i2++) {
    var nn = nodes[i2];
    if (nn.type !== 'cont') continue;
    var strp = nn.raw.replace(/\*\*/g,'').trim();
    if (!/^[•\-]\s/.test(strp)) continue;
    var j = i2;
    while (j < nodes.length && nodes[j].type === 'cont' && /^[•\-]\s/.test(nodes[j].raw.replace(/\*\*/g,'').trim())) j++;
    var runLen = j - i2;
    if (runLen >= 2) { for (var k = 0; k < runLen; k++) { nodes[i2 + k].bulletIdx = k + 1; } }
    i2 = j - 1;
  }
  function numberBulletsInline(html2) {
    var hasLetterMarkers = /<span class="def-bullet">•\s*(?:<strong>)?\([a-z]\)/.test(html2);
    if (hasLetterMarkers) {
      html2 = html2.replace(/<span class="def-bullet">•\s*(?:<strong>)?\(([a-z])\)(?:<\/strong>)?\s+/g, function(_, ch) { var n = ch.charCodeAt(0) - 96; return '<span class="def-bullet">• <span class="num-mini">[' + n + ']</span> '; });
      return html2;
    }
    var bullets = html2.match(/<span class="def-bullet">/g);
    if (!bullets || bullets.length < 2) return html2;
    var n = 0;
    return html2.replace(/<span class="def-bullet">•\s*/g, function() { n++; return '<span class="def-bullet">• <span class="num-mini">[' + n + ']</span> '; });
  }
  function bulletPrefix(rawHtml, idx) {
    var letterRe = /(<span class="def-bullet">•\s*)(?:<strong>)?\(([a-z])\)(?:<\/strong>)?\s*/;
    var m = rawHtml.match(letterRe);
    if (m) { var n = m[2].charCodeAt(0) - 96; return rawHtml.replace(letterRe, '$1<span class="num-mini">[' + n + ']</span> '); }
    return rawHtml.replace(/(<span class="def-bullet">•\s*)/, '$1<span class="num-mini">[' + idx + ']</span> ');
  }
  for (var i = 0; i < nodes.length; i++) {
    var n = nodes[i];
    if (n.type === 'section') {
      closeCard();
      var parts2 = splitSectionTitle(n.raw);
      html += '<section class="def-card"><div class="def-card-title">' + fmt(parts2.title) + '</div>';
      if (parts2.body) { html += '<div class="def-entry def-plain">' + numberBulletsInline(fmt(parts2.body)) + '</div>'; }
      cardOpen = true;
    } else if (n.type === 'sub') {
      if (!cardOpen) { html += '<section class="def-card def-card-flat">'; cardOpen = true; }
      html += '<div class="def-sub-item">' + numberBulletsInline(convertSubMarker(n.raw)) + '</div>';
    } else if (n.type === 'cont') {
      var contHtml = fmt(n.raw);
      if (n.bulletIdx) contHtml = bulletPrefix(contHtml, n.bulletIdx);
      html += '<div class="def-cont">' + contHtml + '</div>';
    } else if (n.type === 'plain') {
      html += '<div class="def-entry def-plain">' + numberBulletsInline(fmt(n.raw)) + '</div>';
    } else if (n.type === 'code') {
      html += '<pre class="md-code def-attached">' + escapeHtml(blocks[n.idx]) + '</pre>';
    } else if (n.type === 'table') {
      html += renderTable(tables[n.idx]);
    }
  }
  closeCard();
  return html;
}

// ---- renderCompareTable (ported) ----
function renderCompareTable(compare) {
  if (!compare) return '';
  var html = '<div style="overflow-x:auto;"><table class="compare-table">';
  if (compare.headers && compare.rows) {
    html += '<thead><tr>';
    for (var h = 0; h < compare.headers.length; h++) html += '<th>' + escapeHtml(compare.headers[h]) + '</th>';
    html += '</tr></thead><tbody>';
    for (var r = 0; r < compare.rows.length; r++) {
      var row = compare.rows[r]; html += '<tr>';
      for (var ci = 0; ci < row.length; ci++) html += '<td>' + escapeHtml(row[ci] || '') + '</td>';
      html += '</tr>';
    }
    html += '</tbody></table></div>'; return html;
  }
  if (compare.table) {
    html += '<thead><tr><th>' + escapeHtml(compare.dim || 'Aspect') + '</th><th>' + escapeHtml(compare.a) + '</th><th>' + escapeHtml(compare.b) + '</th></tr></thead><tbody>';
    for (var i = 0; i < compare.table.length; i++) {
      var orow = compare.table[i];
      html += '<tr><td>' + escapeHtml(orow.dim) + '</td><td>' + escapeHtml(orow.a) + '</td><td>' + escapeHtml(orow.b || '') + '</td></tr>';
    }
    html += '</tbody></table></div>'; return html;
  }
  return '';
}

// ---- inline glossary chips ----
function renderInlineGlossary(conceptId, conceptName) {
  var G = window.TB_GLOSSARY || [];
  var nameLower = conceptName ? conceptName.toLowerCase() : '';
  var matched = [];
  for (var i = 0; i < G.length; i++) {
    var g = G[i];
    var tl = g.term.toLowerCase();
    // precise match: the full glossary term appears in the concept name, or vice-versa
    if (nameLower.indexOf(tl) >= 0 || (tl.length > 6 && tl.indexOf(nameLower) >= 0 && nameLower.length > 4)) matched.push(g);
  }
  if (matched.length === 0) return '';
  var html = '<div class="glossary-chips">';
  for (var j = 0; j < matched.length && j < 6; j++) html += '<div class="glossary-chip" title="' + escapeHtml(matched[j].def) + '">' + escapeHtml(matched[j].term) + '</div>';
  html += '</div>';
  return html;
}

// ---- inline mini quiz (chapter-based, reuses window.QUESTIONS) ----
function renderInlineQuiz(ch, afterIndex) {
  var QS = window.QUESTIONS || [];
  var pool = QS.filter(function(q){ return q.ch === ch; });
  if (pool.length === 0) return '';
  // deterministic-ish pick: rotate by afterIndex so different quizzes show different Qs
  var start = (afterIndex * 3) % pool.length;
  var selected = [];
  for (var i = 0; i < pool.length && selected.length < 3; i++) selected.push(pool[(start + i) % pool.length]);
  var domId = 'iq-ch' + ch + '-idx' + afterIndex;
  var html = '<div class="inline-quiz"><div class="inline-quiz-title">📝 Chapter ' + ch + ' Mini Quiz</div>';
  for (var q = 0; q < selected.length; q++) {
    var qu = selected[q]; var qDomId = domId + '-q' + q;
    html += '<div style="margin-bottom:18px;" id="' + qDomId + '-wrap">';
    html += '<div class="iq-q">' + (q+1) + '. ' + MATH(escapeHtml(qu.q)) + '</div>';
    for (var o = 0; o < qu.opts.length; o++) {
      html += '<div class="iq-opt" id="' + qDomId + '-o' + o + '" onclick="checkInlineAnswer(\'' + qDomId + '\',' + o + ',' + qu.ans + ')">' + String.fromCharCode(65+o) + '. ' + MATH(escapeHtml(qu.opts[o])) + '</div>';
    }
    html += '<div class="iq-exp hidden" id="' + qDomId + '-exp">' + MATH(escapeHtml(qu.exp)) + '</div>';
    html += '</div>';
  }
  html += '</div>';
  return html;
}
window.checkInlineAnswer = function(qDomId, sel, correct) {
  for (var i = 0; i < 5; i++) {
    var el = document.getElementById(qDomId + '-o' + i);
    if (!el) continue;
    el.onclick = null; el.style.pointerEvents = 'none';
    if (i === correct) el.classList.add('correct');
    else if (i === sel) el.classList.add('wrong');
  }
  var exp = document.getElementById(qDomId + '-exp');
  if (exp) exp.classList.remove('hidden');
};

// ---- chapter content ----
function renderChapterContent(ch) {
  var info = (window.CHAPTERS || {})[ch] || {title:'Chapter '+ch, subtitle:'CH'+ch};
  var C = window.CONCEPTS || [];
  var concepts = C.filter(function(c){ return c.ch === ch; });
  var html = '<div class="chapter-header"><div class="chapter-num">' + ch + '</div><div class="chapter-title">' + escapeHtml(info.title) + '</div><div class="chapter-sub">' + escapeHtml(info.subtitle) + '</div></div>';
  for (var idx = 0; idx < concepts.length; idx++) {
    var c = concepts[idx];
    html += '<div class="concept-card' + (c.star ? ' star-card' : '') + '" id="concept-' + c.id + '">';
    html += '<div class="concept-header"><div class="concept-num">' + (idx + 1) + '</div><div class="concept-title">' + escapeHtml(c.name) + '</div>';
    if (c.star) html += '<div class="star-badge">★ 試験重要</div>';
    html += '</div>';
    // CORE: per-term definitions — each term: 🇬🇧 English first (it's an English test), then 🇯🇵 Japanese.
    if (c.defs && c.defs.length) {
      html += '<div class="termdefs">';
      for (var di = 0; di < c.defs.length; di++) {
        var d = c.defs[di];
        html += '<div class="termdef">';
        html += '<div class="td-term">' + MATH(enFmt(d.t)) + '</div>';
        html += '<div class="td-en"><span class="fl">🇬🇧</span><span>' + MATH(enFmt(d.en)) + '</span></div>';
        html += '<div class="td-ja"><span class="fl">🇯🇵</span><span>' + MATH(renderMd(d.ja)) + '</span></div>';
        html += '</div>';
      }
      html += '</div>';
    } else {
      // fallback for any concept lacking defs
      if (c.defEN) html += '<div class="def-section en"><div class="section-label en">🇬🇧 English Definition</div><div>' + MATH(renderDefBullets(c.defEN)) + '</div></div>';
      if (c.defJA) html += '<div class="def-section ja"><div class="section-label ja">🇯🇵 日本語の説明</div><div>' + MATH(renderMd(c.defJA)) + '</div></div>';
    }
    if (c.compare) html += '<div style="margin:12px 0;">' + MATH(renderCompareTable(c.compare)) + '</div>';
    // Example (EN)
    if (c.example) html += '<div class="example-block"><div class="section-label" style="color:#22c55e;">💡 Example (EN)</div><div>' + MATH(renderMd(c.example)) + '</div></div>';
    // Common mistakes (JA)
    if (c.mistakes && c.mistakes.length) {
      html += '<div class="mistakes-block"><div class="section-label" style="color:#ef4444;">⚠️ よくある間違い</div>';
      for (var m = 0; m < c.mistakes.length; m++) html += '<div>• ' + MATH(renderMd(c.mistakes[m])) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    if ((idx + 1) % 2 === 0) html += renderInlineQuiz(ch, idx);
  }
  return html;
}

// ---- exam problems ----
function renderExamProblems(week) {
  var EP = window.EXAM_PROBLEMS || [];
  var probs = EP.filter(function(p){ return p.week === week; });
  if (probs.length === 0) return '';
  var html = '<div class="exam-section"><div class="exam-section-title">📋 Comprehensive Exam Practice</div>';
  for (var j = 0; j < probs.length; j++) {
    var p = probs[j];
    html += '<div class="exam-card">';
    html += '<div class="exam-badge">' + escapeHtml(p.badge) + '</div>';
    html += '<div style="font-size:20px;font-weight:700;margin-bottom:12px;">' + escapeHtml(p.title) + '</div>';
    html += '<div class="exam-scenario">' + MATH(escapeHtml(p.scenario).replace(/\n/g, '<br>')) + '</div>';
    if (p.transactions && p.transactions.length) {
      html += '<ul class="doit-items">';
      for (var t = 0; t < p.transactions.length; t++) html += '<li>' + escapeHtml(p.transactions[t]) + '</li>';
      html += '</ul>';
    }
    if (p.questions && p.questions.length) {
      html += '<div style="font-size:16px;font-weight:700;color:#a855f7;margin:12px 0 6px;">Questions:</div><ol class="exam-qs" style="padding-left:22px;">';
      for (var q = 0; q < p.questions.length; q++) html += '<li>' + escapeHtml(p.questions[q]) + '</li>';
      html += '</ol>';
    }
    html += '<button class="exam-reveal" onclick="toggleExamSolution(this)">👁 解答を見る</button>';
    html += '<div class="exam-solution"><div class="exam-sol-block">' + MATH(p.solHtml || '') + '</div></div>';
    html += '</div>';
  }
  html += '</div>';
  return html;
}
window.toggleExamSolution = function(btn) {
  var card = btn.parentNode;
  var sol = card.querySelector('.exam-solution');
  if (sol.classList.contains('visible')) { sol.classList.remove('visible'); btn.textContent = '👁 解答を見る'; }
  else { sol.classList.add('visible'); btn.textContent = '🙈 解答を隠す'; }
};

// ---- week + tab orchestration ----
var TB_WEEKS = [1,2,3,5,6,7];
var currentWeek = 1;
function renderWeek(week) {
  var chs = (window.WEEK_CHAPTERS || {})[week] || [];
  var html = '<div class="week-header">' + escapeHtml((window.WEEK_INFO || {})[week] || ('Week ' + week)) + '</div>';
  for (var i = 0; i < chs.length; i++) html += renderChapterContent(chs[i]);
  html += renderExamProblems(week);
  var c = document.getElementById('textbook-content');
  if (c) c.innerHTML = html;
}
window.selectWeek = function(week) {
  currentWeek = week;
  var pills = document.querySelectorAll('#view-text .ch-pill[data-week]');
  for (var i = 0; i < pills.length; i++) pills[i].classList.toggle('active', parseInt(pills[i].getAttribute('data-week'),10) === week);
  renderWeek(week);
  window.scrollTo(0,0);
};

// override app.js renderTextbook with the rich version
window.renderTextbook = function() {
  var host = document.getElementById('view-text');
  if (!host) return;
  var pills = '<div class="ch-pills">';
  for (var i = 0; i < TB_WEEKS.length; i++) {
    var w = TB_WEEKS[i];
    pills += '<div class="ch-pill' + (w === currentWeek ? ' active' : '') + '" data-week="' + w + '" onclick="selectWeek(' + w + ')">Week ' + w + '</div>';
  }
  pills += '</div>';
  host.innerHTML = '<div class="tb-wrap">' + pills + '<div id="textbook-content"></div></div>';
  renderWeek(currentWeek);
};
})();

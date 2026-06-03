/* EGBW lightweight math renderer — dependency-free. Stacks fractions, renders sup/sub,
   beautifies symbols. Conservative: only converts a "/" into a fraction when BOTH sides are
   math operands AND at least one side contains a digit or Δ — so prose like and/or, AD/AS,
   Demand/Supply, buyer/seller is left untouched. */
(function(){
  var COMMON = {and:1,or:1,to:1,of:1,vs:1,the:1,at:1,in:1,on:1,by:1};
  function stripParens(s){ s=s.trim(); while(/^\([^()]*\)$/.test(s)) s=s.slice(1,-1).trim(); return s; }
  function hasDigitOrDelta(s){ return /[0-9Δ]/.test(s); }
  // a real operand carries a digit, Δ, or a lowercase subscript (MUa, Pa, Qd) — blocks bare acronym pairs like AD/AS
  function hasMathMark(s){ return /[0-9Δa-z]/.test(s); }
  // is this token a math operand (a variable/number/paren-group), not a prose word?
  function isOperand(raw){
    var s=stripParens(raw).trim();
    if(!s) return false;
    if(/\s{2,}/.test(s)) return false;
    // contains digit or Δ → operand
    if(/[0-9Δ]/.test(s)) return true;
    // leading % like %ΔX handled above (has Δ); plain %X:
    if(/^%/.test(s)) return true;
    // a single math symbol token: starts uppercase or %, short, with optional subscript letters
    // accept: P, Q, MC, MR, TR, TC, MUa, Pa, Qd, Eps, GDP_old ... reject Title-case words (Demand, Supply, Before)
    if(/^[A-Z][a-z]{2,}$/.test(s)) return false;          // Title word (Demand, Supply, Tax) → prose
    if(/^[a-z]{2,}$/.test(s)) return false;                // lowercase word → prose
    if(COMMON[s.toLowerCase()]) return false;
    if(/\s/.test(s)) return false;                         // multi-word → prose
    // identifier containing an uppercase letter but not a single Title-case word → math symbol
    // (accepts P, MC, MR, GDP, MUa, GDP_old, AD, AS; rejects Demand, Supply, MySpace handled by digit/Δ gate)
    if(/[A-Z]/.test(s) && /^%?[A-Za-z0-9_.Δ]+$/.test(s)) return true;
    if(/^[%A-Za-zΔ][A-Za-z0-9_Δ]{0,4}$/.test(s)) return true; // short symbol like Pa, Qd
    return false;
  }
  // split a string on the FIRST top-level "/" (respecting parentheses). returns [a,b] or null
  function splitTopSlash(s){
    var depth=0;
    for(var i=0;i<s.length;i++){
      var c=s[i];
      if(c==='(') depth++;
      else if(c===')') depth--;
      else if(c==='/' && depth===0) return [s.slice(0,i), s.slice(i+1)];
    }
    return null;
  }
  // render a math operand: nested fraction + sup/sub
  function renderOperand(raw){
    var s=raw.trim();
    var stripped=stripParens(s);
    var parts=splitTopSlash(stripped);
    if(parts && isOperand(parts[0]) && isOperand(parts[1]) && (hasMathMark(stripParens(parts[0]))||hasMathMark(stripParens(parts[1])))){
      return frac(renderOperand(parts[0]), renderOperand(parts[1]));
    }
    return supsub(esc(stripped));
  }
  function frac(numHtml,denHtml){
    return '<span class="math-frac"><span class="mf-num">'+numHtml+'</span><span class="mf-den">'+denHtml+'</span></span>';
  }
  function supsub(s){
    // ^{...} or ^x  → superscript ; _{...} or _x → subscript
    s=s.replace(/\^\{([^}]+)\}/g,'<sup>$1</sup>').replace(/\^([0-9A-Za-z]+)/g,'<sup>$1</sup>');
    s=s.replace(/_\{([^}]+)\}/g,'<sub>$1</sub>').replace(/_([0-9A-Za-z]+)/g,'<sub>$1</sub>');
    return s;
  }
  function esc(s){ return String(s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }

  // candidate operand char-class for the inline scan
  var OPND = "(?:\\([^()]*\\)|[%$]?[A-Za-zΔ0-9_.%\\-−+]+)";
  var FRAC_RE = new RegExp("(^|[\\s=(>×·−)])("+OPND+")\\s*/\\s*("+OPND+")(?=$|[\\s=).,;:<×·])","g");

  // process a single text segment (no HTML tags inside)
  function processText(text){
    return text.replace(FRAC_RE, function(m, lead, a, b){
      // peel trailing sentence punctuation off b (keep it after the fraction); preserve decimals like 0.5
      var tail='';
      var tm=b.match(/[.,;:!?]+$/);  // a real decimal ends in a digit, so a trailing dot is always punctuation
      if(tm){ tail=tm[0]; b=b.slice(0, b.length-tail.length); }
      var ca=stripParens(a), cb=stripParens(b);
      if(isOperand(a) && isOperand(b) && (hasMathMark(ca)||hasMathMark(cb))){
        return lead + frac(renderOperand(a), renderOperand(b)) + tail;
      }
      return m; // leave prose slash untouched
    });
  }

  // public: process an HTML string, transforming math only in text nodes (outside tags)
  window.renderMathInHtml = function(html){
    if(!html || (html.indexOf('/')<0 && html.indexOf('^')<0)) return html;
    var out=''; var i=0; var n=html.length;
    while(i<n){
      var lt=html.indexOf('<', i);
      if(lt<0){ out+=processText(html.slice(i)); break; }
      out+=processText(html.slice(i, lt));
      // skip preformatted code blocks verbatim
      if(html.substr(lt,4).toLowerCase()==='<pre'){
        var end=html.toLowerCase().indexOf('</pre>', lt);
        if(end<0){ out+=html.slice(lt); break; }
        out+=html.slice(lt, end+6); i=end+6; continue;
      }
      var gt=html.indexOf('>', lt);
      if(gt<0){ out+=html.slice(lt); break; }
      out+=html.slice(lt, gt+1);
      i=gt+1;
    }
    return out;
  };
  // public: process a plain (already HTML-escaped) string
  window.renderMathPlain = function(s){ return processText(s||''); };
})();

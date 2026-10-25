(function(){
var root=document.documentElement;
try{var t=localStorage.getItem('wtheme');if(t)root.setAttribute('data-theme',t);}catch(e){}
document.getElementById('theme').onclick=function(){
  var dark=root.getAttribute('data-theme')==='dark'||(!root.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme: dark)').matches);
  var n=dark?'light':'dark';root.setAttribute('data-theme',n);try{localStorage.setItem('wtheme',n);}catch(e){}};
document.getElementById('menu').onclick=function(){document.body.classList.toggle('menu');};
var q=document.getElementById('q'),box=document.getElementById('res'),sel=-1;
function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function run(){
  var v=q.value.trim().toLowerCase();sel=-1;
  if(v.length<2){box.classList.remove('on');box.innerHTML='';return;}
  var words=v.split(/\s+/),out=[];
  WIKI.forEach(function(p){
    var s=0,t=p.t.toLowerCase(),h=p.h.toLowerCase(),x=p.x.toLowerCase(),sm=p.s.toLowerCase(),ok=true;
    words.forEach(function(w){var hit=0;if(t.indexOf(w)>=0)hit+=10;if(h.indexOf(w)>=0)hit+=4;if(sm.indexOf(w)>=0)hit+=3;if(x.indexOf(w)>=0)hit+=1;if(!hit)ok=false;s+=hit;});
    if(ok){if(words.length>1){if(t.indexOf(v)>=0)s+=20;if(h.indexOf(v)>=0)s+=12;if(x.indexOf(v)>=0)s+=6;}var i=x.indexOf(v)>=0?x.indexOf(v):x.indexOf(words[0]),snip=i>=0?x.substr(Math.max(0,i-40),120):p.s;out.push({p:p,s:s,snip:snip});}
  });
  out.sort(function(a,b){return b.s-a.s;});
  box.innerHTML=out.length?out.slice(0,12).map(function(o){
    var sn=esc(o.snip);words.forEach(function(w){if(w.length>1)sn=sn.replace(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),function(m){return '<mark>'+m+'</mark>';});});
    return '<a href="'+o.p.u+'"><b>'+esc(o.p.t)+'</b> <span style="color:var(--soft);font-size:13px">· '+esc(o.p.c)+'</span><small>'+sn+'…</small></a>';}).join('')
    :'<div class="none">Nothing found for “'+esc(q.value)+'”.</div>';
  box.classList.add('on');}
q.addEventListener('input',run);
q.addEventListener('keydown',function(e){var a=box.querySelectorAll('a');if(!a.length)return;
  if(e.key==='ArrowDown'){sel=Math.min(sel+1,a.length-1);}else if(e.key==='ArrowUp'){sel=Math.max(sel-1,0);}
  else if(e.key==='Enter'){location.href=a[Math.max(sel,0)].href;return;}else if(e.key==='Escape'){box.classList.remove('on');return;}else return;
  e.preventDefault();a.forEach(function(x,i){x.classList.toggle('sel',i===sel);});});
document.addEventListener('click',function(e){if(!e.target.closest('.search'))box.classList.remove('on');});
document.addEventListener('keydown',function(e){if(e.key==='/'&&document.activeElement!==q){e.preventDefault();q.focus();}});
})();
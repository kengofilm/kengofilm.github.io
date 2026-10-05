'use strict';
const categories = {
  all: {name:'おすすめ',color:'#ed663d'},
  ai: {name:'AI・未来',color:'#5964d8'},
  science: {name:'科学・宇宙',color:'#147698'},
  industry: {name:'包装・製造業',color:'#b96a1d'},
  travel: {name:'旅・海外',color:'#168478'},
  world: {name:'世界・経済',color:'#b94463'},
  culture: {name:'教養・音楽',color:'#7a54b4'}
};
const $ = id => document.getElementById(id);
const KEYS = {feed:'kengo-news-feed-v1',saved:'kengo-news-saved-v1',read:'kengo-news-read-v1'};
function stored(key,fallback){try{return JSON.parse(localStorage.getItem(key)) ?? fallback;}catch{return fallback;}}
function put(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
let feed=null, category='all', mode='today', current=null, lastFocus=null;
const storedRead=stored(KEYS.read,[]);
let saved = stored(KEYS.saved,{}), read = new Set(Array.isArray(storedRead)?storedRead:[]);
if(!saved || Array.isArray(saved) || typeof saved!=='object') saved={};
let toastTimer;
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{$('toast').hidden=true;},2500);}
function node(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;}
function validUrl(value){try{const u=new URL(value);return u.protocol==='https:';}catch{return false;}}
function validArticle(a){return a && typeof a.id==='string' && typeof a.title==='string' && categories[a.category] && a.category!=='all' && typeof a.source==='string' && validUrl(a.url) && /^\d{4}-\d{2}-\d{2}$/.test(a.publishedAt) && typeof a.addedAt==='string' && typeof a.dek==='string' && typeof a.why==='string' && Array.isArray(a.summary) && a.summary.length===3 && a.summary.every(x=>typeof x==='string');}
function validate(data){return data && data.schemaVersion===1 && typeof data.updatedAt==='string' && !Number.isNaN(Date.parse(data.updatedAt)) && Array.isArray(data.articles) && data.articles.length>0 && data.articles.every(validArticle) && new Set(data.articles.map(a=>a.id)).size===data.articles.length;}
function dateString(value,full=false){const d=new Date(value.length===10?value+'T12:00:00+09:00':value);if(Number.isNaN(d.getTime()))return '日付不明';return new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',month:'numeric',day:'numeric',...(full?{hour:'2-digit',minute:'2-digit'}:{})}).format(d);}
function bookmarkIcon(){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.7');svg.setAttribute('aria-hidden','true');const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d','M6 4h12v17l-6-4-6 4z');svg.append(p);return svg;}
for(const [key,c] of Object.entries(categories)){const b=node('button','channel',c.name);b.style.setProperty('--c',c.color);b.dataset.category=key;b.setAttribute('aria-pressed',String(key==='all'));b.addEventListener('click',()=>{category=key;render();});$('channels').append(b);}
function toggleSave(a){const next={...saved};if(next[a.id])delete next[a.id];else next[a.id]=a;if(!put(KEYS.saved,next)){toast('保存できなかったよ　ブラウザの保存設定を確認してね');return;}saved=next;render();if(current)updateSaveButton();toast(saved[a.id]?'あとで読むに保存したよ':'保存を解除したよ');}
function updateSaveButton(){$('save-detail').textContent=saved[current.id]?'保存済み · 解除':'あとで読む';$('save-detail').setAttribute('aria-pressed',String(!!saved[current.id]));}
function openArticle(a){current=a;lastFocus=document.activeElement;read.add(a.id);if(read.size>500)read=new Set([...read].slice(-500));put(KEYS.read,[...read]);const c=categories[a.category];$('detail-category').textContent=c.name;$('detail-category').style.setProperty('--c',c.color);const content=$('detail-content');content.replaceChildren();const title=node('h2','detail-title',a.title);title.id='detail-title';content.append(title,node('p','detail-meta',`${a.source} · ${a.publishedAt.replaceAll('-','/')} 公開${a.language==='en'?' · 英語記事':''}`),node('h3','summary-title','3行でわかる'));const list=node('ol','summary-list');a.summary.forEach(t=>list.append(node('li','',t)));content.append(list);const why=node('div','why');why.append(node('h3','','けんごに関係するポイント'),node('p','',a.why));content.append(why);if(a.verificationNote)content.append(node('p','verification',a.verificationNote));$('source-link').href=a.url;updateSaveButton();$('detail').showModal();document.body.style.overflow='hidden';render();}
$('detail').addEventListener('close',()=>{document.body.style.overflow='';const focus=lastFocus?.isConnected?lastFocus:document.querySelector(`[data-article-id="${CSS.escape(current?.id||'')}"]`);(focus||$('today')).focus();});
$('detail').addEventListener('click',e=>{if(e.target===$('detail')){const r=$('detail').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('detail').close();}});
$('close-detail').addEventListener('click',()=>$('detail').close());
$('save-detail').addEventListener('click',()=>current&&toggleSave(current));
function render(){
  const q=$('search').value.trim().toLocaleLowerCase();
  let articles=(mode==='saved'?Object.values(saved).filter(validArticle):(feed?.articles||[])).filter(a=>(category==='all'||a.category===category)&&(!q||[a.title,a.dek,a.source,a.why,...a.summary].join(' ').toLocaleLowerCase().includes(q)));
  $('channels').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
  $('view-title').firstChild.textContent=mode==='saved'?'あとで読む':category==='all'?'今日のピックアップ':categories[category].name;
  $('eyebrow').textContent=mode==='saved'?'YOUR READING LIST':'YOUR DAILY EDITION';
  $('count').textContent=`${articles.length}本`;
  $('today').classList.toggle('active',mode==='today');$('saved').classList.toggle('active',mode==='saved');
  $('today').setAttribute('aria-pressed',String(mode==='today'));$('saved').setAttribute('aria-pressed',String(mode==='saved'));
  const total=Object.values(saved).filter(validArticle).length;$('saved-count').textContent=total?String(total):'';
  $('stories').replaceChildren();$('empty').hidden=articles.length>0;
  $('empty-text').textContent=mode==='saved'&&total===0?'記事のしおりマークで保存できるよ':'別の言葉やカテゴリで探してみて';
  articles.forEach((a,i)=>{
    const c=categories[a.category];const card=node('article',`story${i===0&&mode==='today'&&!q?' featured':''}`);card.style.setProperty('--c',c.color);
    const top=node('div','story-top');const label=node('span','tag',c.name);const save=node('button','bookmark');save.append(bookmarkIcon());save.setAttribute('aria-label',`${a.title}を${saved[a.id]?'保存から解除':'あとで読むに保存'}`);save.setAttribute('aria-pressed',String(!!saved[a.id]));save.addEventListener('click',()=>toggleSave(a));top.append(label,save);
    const open=node('button','story-open');open.dataset.articleId=a.id;open.setAttribute('aria-label',`${a.title}の要約を読む`);open.append(node('h2','',a.title),node('p','deck',a.dek));open.addEventListener('click',()=>openArticle(a));
    const foot=node('div','story-foot'),meta=node('div','story-meta');meta.append(node('span','',a.source),node('time','date',dateString(a.publishedAt)+' 公開'));meta.lastChild.setAttribute('datetime',a.publishedAt);foot.append(meta);if(read.has(a.id))foot.append(node('span','read-mark','読んだ'));else foot.append(node('span','read-badge','要約を読む'));
    card.append(top,open,foot);$('stories').append(card);
  });
}
function updateStatus(cached=false){if(!feed)return;$('edition').textContent=new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'long',day:'numeric',weekday:'short'}).format(new Date(feed.updatedAt));$('update-line').textContent=`最終更新 ${dateString(feed.updatedAt,true)} · ${feed.articles.length}本${cached?' · 保存済みの一覧を表示':''}`;const age=Date.now()-Date.parse(feed.updatedAt);if(age>48*60*60*1000){$('notice').textContent='記事一覧は2日以上前の更新だよ　元記事の公開日も確認してね';$('notice').hidden=false;}}
async function load(manual=false){
  const button=$('refresh');if(button.disabled)return;button.disabled=true;button.classList.add('refreshing');$('notice').hidden=true;
  const cached=stored(KEYS.feed,null);if(!feed&&validate(cached)){feed=cached;updateStatus(true);render();}
  try{const response=await fetch('./feed.json?t='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('HTTP '+response.status);const data=await response.json();if(!validate(data))throw new Error('Invalid feed');feed=data;put(KEYS.feed,data);updateStatus();render();if(manual)toast('最新の記事一覧を確認したよ');}
  catch{if(feed){updateStatus(true);$('notice').textContent='再読み込みできなかったよ　前回の記事一覧を表示している';}else{$('update-line').textContent='記事一覧を取得できなかったよ';$('notice').textContent='接続を確認して、右上の更新ボタンでもう一度試してね';render();}$('notice').hidden=false;}
  finally{button.disabled=false;button.classList.remove('refreshing');}
}
$('search').addEventListener('input',render);$('refresh').addEventListener('click',()=>load(true));
for(const id of ['today','saved'])$(id).addEventListener('click',()=>{mode=id;category='all';$('search').value='';render();window.scrollTo({top:0,behavior:'smooth'});});
$('clear').addEventListener('click',()=>{mode='today';category='all';$('search').value='';render();});
// Refresh when the reader returns after a while; the scheduled editor updates feed.json independently.
let lastVisible=Date.now();document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-lastVisible>5*60*1000)load();if(document.hidden)lastVisible=Date.now();});
render();load();

(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const memory={};
function get(k,f=''){try{const v=localStorage.getItem(k);return v===null?(k in memory?memory[k]:f):v}catch{return k in memory?memory[k]:f}}
function set(k,v){memory[k]=String(v);try{localStorage.setItem(k,String(v))}catch{}}
function toast(t){const x=$('#toast');if(!x)return;x.textContent=t;x.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>x.classList.remove('show'),1800)}
window.WAuto={get,set,toast};

function bindMenu(){const b=$('#menuBtn'),m=$('#mobileNav');if(b&&m)b.addEventListener('click',()=>m.classList.toggle('open'))}
function bindSearch(){const f=$('#globalSearchForm'),i=$('#globalSearch');if(!f||!i)return;f.addEventListener('submit',e=>{e.preventDefault();const q=i.value.trim();location.href=q?'faults.html?q='+encodeURIComponent(q):'faults.html'})}
function bindModals(){const carBtn=$('#carSelectBtn'),carModal=$('#carModal'),favBtn=$('#favBtn'),favModal=$('#favoritesModal');if(carBtn&&carModal)carBtn.onclick=()=>carModal.classList.add('open');if(favBtn&&favModal)favBtn.onclick=()=>{renderFavorites();favModal.classList.add('open')};$$('[data-close-modal]').forEach(b=>b.onclick=()=>b.closest('.modal')?.classList.remove('open'));$$('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')}))}
function currentCar(){try{return JSON.parse(get('wauto-car','null'))}catch{return null}}
function renderCar(){const c=currentCar(),n=$('#myCarName'),s=$('#myCarSub');if(n)n.textContent=c?.name||'Моя машина';if(s)s.textContent=c?.sub||'Не выбрана';$$('[data-model-id]').forEach(el=>el.classList.toggle('is-selected',el.dataset.modelId===c?.id));$$('[data-select-car]').forEach(b=>b.classList.toggle('selected',b.dataset.selectCar===c?.id))}
function bindCars(){document.addEventListener('click',e=>{const b=e.target.closest('[data-select-car]');if(!b)return;e.preventDefault();const car={id:b.dataset.selectCar,name:b.dataset.carName||b.closest('[data-model-id]')?.querySelector('h3')?.textContent.trim()||'Моя машина',sub:b.dataset.carSub||''};set('wauto-car',JSON.stringify(car));renderCar();$$('.modal.open').forEach(m=>m.classList.remove('open'));toast('Автомобиль добавлен в гараж')})}
function favorites(){try{return JSON.parse(get('wauto-favorites','[]'))}catch{return[]}}
function saveFavorites(a){set('wauto-favorites',JSON.stringify(a));renderFavoriteState()}
function renderFavoriteState(){const a=favorites(),ids=new Set(a.map(x=>x.id)),badge=$('#favCount');if(badge){badge.textContent=a.length;badge.hidden=!a.length}$$('[data-favorite-id]').forEach(b=>{const on=ids.has(b.dataset.favoriteId);b.classList.toggle('is-fav',on);const base=b.textContent.includes('Сохранить')?(on?'★ Сохранено':'♡ Сохранить'):(on?'★':'♡');b.textContent=base;b.setAttribute('aria-pressed',on?'true':'false')})}
function bindFavorites(){document.addEventListener('click',e=>{const b=e.target.closest('[data-favorite-id]');if(!b)return;e.preventDefault();const id=b.dataset.favoriteId;let a=favorites();const on=a.some(x=>x.id===id);a=on?a.filter(x=>x.id!==id):[...a,{id,title:b.dataset.favoriteTitle||'Материал',url:b.dataset.favoriteUrl||location.pathname.split('/').pop()}];saveFavorites(a);toast(on?'Удалено из избранного':'Добавлено в избранное')});document.addEventListener('click',e=>{const b=e.target.closest('[data-remove-favorite]');if(!b)return;saveFavorites(favorites().filter(x=>x.id!==b.dataset.removeFavorite));renderFavorites()})}
function renderFavorites(){const a=favorites(),box=$('#favoritesList'),empty=$('#favoritesEmpty');if(!box||!empty)return;empty.hidden=!!a.length;box.innerHTML=a.map(x=>`<article class="favorite-row"><div><strong>${escapeHtml(x.title)}</strong><small>Сохранённый материал WAuto</small></div><a class="btn secondary favorite-open" href="${safeUrl(x.url)}">Открыть</a><button class="icon-btn" type="button" data-remove-favorite="${escapeHtml(x.id)}">✕</button></article>`).join('')}
function safeUrl(u){return /^[a-z0-9._-]+\.html(?:[?#].*)?$/i.test(u||'')?u:'#'}
function escapeHtml(s){return String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function imageFallback(){document.addEventListener('error',e=>{const im=e.target;if(im?.tagName==='IMG'&&!im.dataset.fallback){im.dataset.fallback='1';im.src='assets/icons/image-fallback.svg'}},true)}

document.addEventListener('DOMContentLoaded',()=>{imageFallback();bindMenu();bindSearch();bindModals();bindCars();bindFavorites();renderCar();renderFavoriteState()});
})();

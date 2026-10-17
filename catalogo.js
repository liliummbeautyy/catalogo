/* Lilium Beauty · catálogo público */
'use strict';
const CFG={url:'https://yrdtetbtjkzqubpsxswo.supabase.co',key:'sb_publishable_Sr5qJr46wo0kKKU6Sn2_1A_O30n2GNZ',slug:new URLSearchParams(location.search).get('u')||'lilium',bucket:'catalog'};
const sb=window.supabase?.createClient?window.supabase.createClient(CFG.url,CFG.key,{auth:{persistSession:false,autoRefreshToken:false}}):null;
const S={profile:null,designs:[],cat:'Todos'};
const FINGERS=['Pulgar','Índice','Medio','Anular','Meñique'];
const PREFS=[['whatsapp','WhatsApp'],['instagram','Instagram'],['email','Email'],['llamada','Llamada']];
const STAMPS=['flores','botanical','love','nippon','mariposa','ciruelo','rosa','fresas','gato','lirios'];
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const money=n=>{const v=Number(n);return (Number.isInteger(v)?v.toLocaleString('es-ES'):v.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2}))+' €'};
const priceText=d=>d.price==null?'Consultar':(d.price_from?'Desde ':'')+money(d.price);
const photo=p=>!p?'':/^https?:/.test(p)?p:sb.storage.from(CFG.bucket).getPublicUrl(p).data.publicUrl;
const icon=n=>({
 whatsapp:'<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.2c0 3 2.6 5.6 5.6 5.6l1-1.4-1.8-1-.9.8c-1-.4-1.9-1.3-2.3-2.3l.8-.9-1-1.8z"/>',
 insta:'<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r=".8" fill="currentColor"/>',
 tiktok:'<path d="M13.5 4v10.5a3.5 3.5 0 1 1-3-3.5"/><path d="M13.5 4c.4 2.6 2.2 4.3 5 4.5"/>',
 mail:'<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
 pin:'<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
 close:'<path d="M6 6l12 12M18 6L6 18"/>',heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',
 left:'<path d="M15 5l-7 7 7 7"/>',right:'<path d="M9 5l7 7-7 7"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
 moon:'<path d="M15 4a8.5 8.5 0 1 0 5 13.5A7 7 0 0 1 15 4z"/>'}[n]);
const ic=n=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${icon(n)}</svg>`;
function toast(t,ms=3000){const x=$('#toast');x.textContent=t;x.classList.add('show');clearTimeout(window.__t);window.__t=setTimeout(()=>x.classList.remove('show'),ms)}
function waLink(phone,text){let c=String(phone||'').replace(/\D/g,'');if(c.length===9&&/^[6789]/.test(c))c='34'+c;return c.length>=9?`https://wa.me/${c}?text=${encodeURIComponent(text||'')}`:''}

/* Tema */
$('#themeBtn').querySelector('.tt-sun').innerHTML=ic('sun');$('#themeBtn').querySelector('.tt-moon').innerHTML=ic('moon');
$('#themeBtn').onclick=()=>{const d=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=d;try{localStorage.setItem('lilium_cat_theme',d)}catch{}};

/* Datos */
async function load(){
 if(!sb){$('#grid').innerHTML='<p class="muted center">No se ha podido cargar el catálogo. Revisa tu conexión y recarga la página.</p>';return}
 try{
  const {data:p,error:e1}=await sb.from('catalog_profile').select('*').eq('slug',CFG.slug).maybeSingle();
  if(e1)throw e1;if(!p)throw new Error('Catálogo no encontrado');S.profile=p;
  const {data:d,error:e2}=await sb.from('catalog_designs').select('*').eq('owner',p.owner).eq('visible',true).order('sort',{ascending:true}).order('created_at',{ascending:false});
  if(e2)throw e2;S.designs=d||[];
  paintProfile();paintCats();paintGrid();paintContact();
 }catch(e){console.error(e);$('#grid').innerHTML='<p class="muted center">No se ha podido cargar el catálogo ahora mismo. Prueba de nuevo en un momento.</p>'}
}
function paintProfile(){
 const p=S.profile;document.title=`${p.business} · Catálogo de diseños de uñas`;
 if(p.tagline)$('#tagline').textContent=p.tagline;
 $('#heroText').textContent=p.about?p.about.split('\n')[0]:'Diseños de uñas hechos a mano, a tu medida.';
 $('#aboutText').textContent=p.about||'Cada diseño está hecho a mano y adaptado a tus medidas. Escríbeme y lo preparamos juntas.';
 $('#footCity').textContent=p.city||p.business;
}
function paintCats(){
 const cats=['Todos',...new Set(S.designs.map(d=>d.category).filter(Boolean))];
 $('#cats').innerHTML=cats.length>2?cats.map(c=>`<button role="tab" class="chip ${S.cat===c?'on':''}" aria-selected="${S.cat===c}" data-c="${esc(c)}">${esc(c)}</button>`).join(''):'';
 $('#cats').onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;S.cat=b.dataset.c;paintCats();paintGrid()};
}
function paintGrid(){
 const list=S.designs.filter(d=>S.cat==='Todos'||d.category===S.cat);
 if(!S.designs.length){$('#grid').innerHTML=`<div class="soon"><img src="assets/stamps/lirios.webp" alt="" style="--r:-5deg"><p class="script">Muy pronto…</p><p class="muted">Estoy preparando mis primeros diseños. Mientras, escríbeme y te enseño ideas.</p><a class="btn" href="#contacto">Escríbeme</a></div>`;return}
 $('#grid').innerHTML=list.map((d,i)=>`<article class="dcard">
  ${i%4===0?`<img class="sticker" src="assets/stamps/${STAMPS[(i/4)%STAMPS.length]}.webp" alt="" aria-hidden="true" style="--r:${i%8?7:-7}deg">`:''}
  <button class="dphoto" data-view="${d.id}" aria-label="Ver ${esc(d.name)}">${d.photos?.[0]?`<img src="${esc(photo(d.photos[0]))}" alt="${esc(d.name)}" loading="lazy">`:`<span class="nophoto">${ic('heart')}</span>`}${d.photos?.length>1?`<em>${d.photos.length} fotos</em>`:''}</button>
  <div class="dinfo"><h3>${esc(d.name)}</h3><p class="meta">${esc([d.category,d.shape,d.length].filter(Boolean).join(' · '))}</p>
  <div class="drow"><span class="price">${priceText(d)}</span>${S.profile.open?`<button class="btn small" data-order="${d.id}">Lo quiero</button>`:''}</div></div>
 </article>`).join('');
}
$('#grid').addEventListener('click',e=>{const v=e.target.closest('[data-view]'),o=e.target.closest('[data-order]');if(v)openDesign(v.dataset.view);if(o)openOrder(o.dataset.order)});

/* Ventanas */
function openModal(html,cls=''){$('#modal-root').innerHTML=`<div class="modal" role="dialog" aria-modal="true"><div class="modal-card ${cls}"><button class="close" aria-label="Cerrar">${ic('close')}</button>${html}</div></div>`;const m=$('#modal-root .modal');m.addEventListener('mousedown',e=>{if(e.target===m)closeModal()});m.querySelector('.close').onclick=closeModal;document.body.classList.add('noscroll')}
function closeModal(){$('#modal-root').innerHTML='';document.body.classList.remove('noscroll')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

function openDesign(id){
 const d=S.designs.find(x=>x.id===id);if(!d)return;let i=0;const ph=d.photos||[];
 openModal(`<div class="view"><div class="gallery">${ph.length?`<img id="vImg" src="${esc(photo(ph[0]))}" alt="${esc(d.name)}">`:`<span class="nophoto big">${ic('heart')}</span>`}${ph.length>1?`<button class="gnav prev" aria-label="Foto anterior">${ic('left')}</button><button class="gnav next" aria-label="Foto siguiente">${ic('right')}</button><div class="dots">${ph.map((_,k)=>`<i class="${k?'':'on'}"></i>`).join('')}</div>`:''}</div>
 <div class="vinfo"><h2>${esc(d.name)}</h2><p class="meta">${esc([d.category,d.shape,d.length].filter(Boolean).join(' · '))}</p><p class="price big">${priceText(d)}</p>${d.description?`<p class="desc">${esc(d.description)}</p>`:''}${d.tags?.length?`<div class="tags">${d.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}
 ${S.profile.open?`<button class="btn wide" id="vOrder">Lo quiero</button>`:''}<p class="muted small">Se adapta a tus medidas. Te escribo para confirmar todos los detalles.</p></div></div>`,'wide');
 const show=k=>{i=(k+ph.length)%ph.length;$('#vImg').src=photo(ph[i]);document.querySelectorAll('.dots i').forEach((x,n)=>x.classList.toggle('on',n===i))};
 $('.gnav.prev')?.addEventListener('click',()=>show(i-1));$('.gnav.next')?.addEventListener('click',()=>show(i+1));
 $('#vOrder')?.addEventListener('click',()=>openOrder(id));
}

/* Formularios */
function prefSeg(name,val='whatsapp'){return PREFS.filter(([k])=>k!=='llamada'||true).map(([k,l])=>`<label class="${k===val?'on':''}"><input type="radio" name="${name}" value="${k}" ${k===val?'checked':''}>${l}</label>`).join('')}
function contactFields(pref,prefix){
 const f=(k,l,type,ph,req,ac)=>`<div class="field"><label for="${prefix}_${k}">${l}${req?'':' <small>(opcional)</small>'}</label><input id="${prefix}_${k}" type="${type}" placeholder="${ph}" ${ac?`autocomplete="${ac}"`:''} ${req?'required':''}></div>`;
 const need=k=>pref===k||(pref==='llamada'&&k==='phone')||(pref==='whatsapp'&&k==='phone');
 return f('phone','Teléfono','tel','600 000 000',need('phone'),'tel')+f('instagram','Instagram','text','@tu_usuario',pref==='instagram','')+f('email','Email','email','tu@email.com',pref==='email','email');
}
function wireSeg(form,name,prefix){
 const seg=form.querySelector(`.seg[data-name="${name}"]`);seg.innerHTML=prefSeg(name);
 const box=form.querySelector(`.contact-fields[data-for="${name}"]`);
 const draw=()=>{const v=form.querySelector(`input[name="${name}"]:checked`).value;const keep={};box.querySelectorAll('input').forEach(i=>keep[i.id]=i.value);box.innerHTML=contactFields(v,prefix);box.querySelectorAll('input').forEach(i=>{if(keep[i.id])i.value=keep[i.id]});seg.querySelectorAll('label').forEach(l=>l.classList.toggle('on',l.querySelector('input').checked))};
 seg.addEventListener('change',draw);draw();
}
function readContact(form,name,prefix){
 const g=k=>(form.querySelector(`#${prefix}_${k}`)?.value||'').trim();
 return {contact_pref:form.querySelector(`input[name="${name}"]:checked`).value,phone:g('phone').slice(0,30),instagram:g('instagram').replace(/^https?:\/\/(www\.)?instagram\.com\//,'').replace(/\/$/,'').slice(0,60),email:g('email').slice(0,120)};
}
function validate(form){const bad=[...form.querySelectorAll('[required]')].find(i=>i.type==='checkbox'?!i.checked:!i.value.trim());if(bad){bad.focus();return bad.type==='checkbox'?'Marca la casilla para poder enviarlo':'Completa los campos marcados'}const em=form.querySelector('input[type=email]');if(em&&em.value&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value))return 'Revisa el email';return ''}
async function send(row,form,btn,doneHtml){
 if(form.querySelector('.hp')?.value)return;
 const err=validate(form);const msg=form.querySelector('.form-msg');if(err){msg.textContent=err;msg.className='form-msg err';return}
 btn.disabled=true;const txt=btn.textContent;btn.textContent='Enviando…';msg.textContent='';
 const {error}=await sb.from('catalog_requests').insert({owner:S.profile.owner,...row});
 if(error){btn.disabled=false;btn.textContent=txt;msg.className='form-msg err';msg.textContent=/Demasiados/.test(error.message)?error.message:'No se ha podido enviar. Revisa tu conexión o escríbeme por WhatsApp.';return}
 doneHtml();
}
function thanksHtml(title,extra=''){const wa=waLink(S.profile.whatsapp,'Hola 🌸 Te acabo de escribir desde tu catálogo');return `<div class="thanks"><img src="assets/stamps/love.webp" alt="" style="--r:-6deg"><h2 class="script">${title}</h2><p>${extra||'Te escribo muy pronto.'}</p>${wa?`<a class="btn ghost" href="${esc(wa)}" target="_blank" rel="noopener">${ic('whatsapp')}O escríbeme ya por WhatsApp</a>`:''}</div>`}

function openOrder(id){
 const d=S.designs.find(x=>x.id===id);if(!d)return;
 openModal(`<div class="order-head">${d.photos?.[0]?`<img src="${esc(photo(d.photos[0]))}" alt="">`:''}<div><small class="muted">Tu pedido</small><h2>${esc(d.name)}</h2><p class="price">${priceText(d)}</p></div></div>
 <form class="form" id="orderForm" novalidate>
  <div class="field"><label for="o_name">Tu nombre</label><input id="o_name" maxlength="80" autocomplete="name" required></div>
  <div class="field"><span class="label">¿Cómo prefieres que te contacte?</span><div class="seg" data-name="o_pref"></div></div>
  <div class="contact-fields" data-for="o_pref"></div>
  <div class="field"><span class="label">Tus medidas</span><div class="seg sizes-seg">${[['measure','Me ayudas a medirme'],['know','Sé mis tallas']].map(([k,l],i)=>`<label class="${i?'':'on'}"><input type="radio" name="o_size" value="${k}" ${i?'':'checked'}>${l}</label>`).join('')}</div></div>
  <div class="sizes" hidden>${['Izquierda','Derecha'].map(h=>`<div class="hand"><span>${h}</span>${(h==='Izquierda'?[...FINGERS].reverse():FINGERS).map(f=>`<label><small>${f}</small><input inputmode="numeric" maxlength="2" data-h="${h[0]}" aria-label="Talla ${f} mano ${h.toLowerCase()}"></label>`).join('')}</div>`).join('')}</div>
  <div class="grid-2"><div class="field"><label for="o_shape">Forma</label><input id="o_shape" list="oShapes" maxlength="40" value="${esc(d.shape||'')}"><datalist id="oShapes">${['Almond','Coffin','Cuadrada','Redonda','Stiletto'].map(x=>`<option value="${x}">`).join('')}</datalist></div><div class="field"><label for="o_len">Largo</label><input id="o_len" maxlength="20" value="${esc(d.length||'')}"></div></div>
  <div class="field"><label for="o_msg">¿Algo más? <small>(opcional)</small></label><textarea id="o_msg" rows="3" maxlength="1000" placeholder="Colores, fecha que lo necesitas, si es para un evento…"></textarea></div>
  <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
  <label class="consent"><input type="checkbox" required><span>Acepto que ${esc(S.profile.business)} use estos datos solo para gestionar mi pedido.</span></label>
  <button class="btn wide" type="submit">Enviar pedido</button>
  <p class="form-msg" role="status"></p>
  <p class="muted small center">No pagas nada ahora: primero te escribo para confirmarlo todo.</p>
 </form>`,'order');
 const form=$('#orderForm');wireSeg(form,'o_pref','o');
 form.querySelector('.sizes-seg').addEventListener('change',e=>{form.querySelectorAll('.sizes-seg label').forEach(l=>l.classList.toggle('on',l.querySelector('input').checked));form.querySelector('.sizes').hidden=e.target.value!=='know'});
 form.addEventListener('submit',e=>{e.preventDefault();
  const know=form.querySelector('input[name="o_size"]:checked').value==='know';
  const sz=h=>[...form.querySelectorAll(`.sizes input[data-h="${h}"]`)].map(i=>i.value.trim()||'-').join(' ');
  const c=readContact(form,'o_pref','o');
  send({kind:'pedido',design_id:d.id,design_name:d.name.slice(0,80),price:d.price,name:$('#o_name').value.trim().slice(0,80),...c,sizes:know?`Izq: ${sz('I')} · Der: ${sz('D')}`:'Necesita que la midan',shape:$('#o_shape').value.trim().slice(0,40),length:$('#o_len').value.trim().slice(0,20),message:$('#o_msg').value.trim().slice(0,1000)},form,form.querySelector('button[type=submit]'),()=>{$('.modal-card').innerHTML=`<button class="close" aria-label="Cerrar" onclick="closeModal()">${ic('close')}</button>`+thanksHtml('¡Pedido enviado!',`He recibido tu pedido de <b>${esc(d.name)}</b>. Te escribo muy pronto para confirmar medidas y detalles.`)});
 });
 setTimeout(()=>$('#o_name')?.focus(),60);
}

function paintContact(){
 const p=S.profile;const links=[];
 if(p.whatsapp)links.push(`<a class="clink" href="${esc(waLink(p.whatsapp,'Hola 🌸 He visto tu catálogo y me gustaría información'))}" target="_blank" rel="noopener">${ic('whatsapp')}<span><b>WhatsApp</b><small>${esc(p.whatsapp)}</small></span></a>`);
 if(p.instagram)links.push(`<a class="clink" href="https://instagram.com/${esc(p.instagram.replace(/^@/,''))}" target="_blank" rel="noopener">${ic('insta')}<span><b>Instagram</b><small>${esc(p.instagram.startsWith('@')?p.instagram:'@'+p.instagram)}</small></span></a>`);
 if(p.tiktok)links.push(`<a class="clink" href="https://www.tiktok.com/@${esc(p.tiktok.replace(/^@/,''))}" target="_blank" rel="noopener">${ic('tiktok')}<span><b>TikTok</b><small>${esc(p.tiktok.startsWith('@')?p.tiktok:'@'+p.tiktok)}</small></span></a>`);
 if(p.email)links.push(`<a class="clink" href="mailto:${esc(p.email)}">${ic('mail')}<span><b>Email</b><small>${esc(p.email)}</small></span></a>`);
 if(p.city)links.push(`<div class="clink">${ic('pin')}<span><b>Dónde estoy</b><small>${esc(p.city)}</small></span></div>`);
 $('#contactLinks').innerHTML=`<img class="cl-stamp" src="assets/stamps/avion.webp" alt="" aria-hidden="true" style="--r:6deg">`+(links.join('')||'<p class="muted">Escríbeme con el formulario y te contesto pronto.</p>');
 const form=$('#contactForm');
 if(!p.open){form.innerHTML='<h3>Ahora mismo no acepto pedidos nuevos</h3><p class="muted">Puedes seguir viendo mis diseños. Vuelve pronto 🌸</p>';return}
 wireSeg(form,'c_pref','c');
 form.addEventListener('submit',e=>{e.preventDefault();const c=readContact(form,'c_pref','c');send({kind:'contacto',name:$('#c_name').value.trim().slice(0,80),...c,message:$('#c_msg').value.trim().slice(0,1000)},form,form.querySelector('button[type=submit]'),()=>{form.innerHTML=thanksHtml('¡Mensaje enviado!')})});
}
load();

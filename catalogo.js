/* Lilium Beauty · catálogo público */
'use strict';
const CFG={url:'https://yrdtetbtjkzqubpsxswo.supabase.co',key:'sb_publishable_Sr5qJr46wo0kKKU6Sn2_1A_O30n2GNZ',slug:new URLSearchParams(location.search).get('u')||'lilium',bucket:'catalog'};
const sb=window.supabase?.createClient?window.supabase.createClient(CFG.url,CFG.key,{auth:{persistSession:false,autoRefreshToken:false}}):null;
const S={profile:null,designs:[],album:[],cat:'Todos'};
const FINGERS=['Pulgar','Índice','Medio','Anular','Meñique'];
const PREFS=[['whatsapp','WhatsApp'],['instagram','Instagram'],['email','Email'],['llamada','Llamada']];
const STAMPS=['flores','botanical','love','nippon','mariposa','ciruelo','rosa','fresas','gato','lirios'];
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const money=n=>{const v=Number(n);return (Number.isInteger(v)?v.toLocaleString('es-ES'):v.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2}))+' €'};
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
  if(e2)throw e2;S.designs=(d||[]).filter(x=>x.photos?.length||x.name);
  paintProfile();paintCats();paintGrid();paintCustom();paintContact();
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
 if(!S.designs.length){$('#grid').innerHTML=`<div class="soon"><img src="assets/stamps/lirios.webp" alt="" style="--r:-5deg"><p class="script">Muy pronto…</p><p class="muted">Estoy preparando mis primeros diseños. Mientras, pídeme uno a tu estilo o escríbeme y te enseño ideas.</p><a class="btn" href="#propio">Diseño a tu estilo</a></div>`;return}
 $('#grid').innerHTML=list.map((d,i)=>{const meta=[d.category,d.shape,d.length].filter(Boolean).join(' · ');return `<article class="dcard">
  ${i%4===0?`<img class="sticker" src="assets/stamps/${STAMPS[(i/4)%STAMPS.length]}.webp" alt="" aria-hidden="true" style="--r:${i%8?7:-7}deg">`:''}
  <button class="dphoto" data-view="${d.id}" aria-label="Ver ${esc(d.name||'diseño')}">${d.photos?.[0]?`<img src="${esc(photo(d.photos[0]))}" alt="${esc(d.name||'Diseño de uñas')}" loading="lazy">`:`<span class="nophoto">${ic('heart')}</span>`}${d.photos?.length>1?`<em>${d.photos.length} fotos</em>`:''}</button>
  ${d.name||meta||S.profile.open?`<div class="dinfo">${d.name?`<h3>${esc(d.name)}</h3>`:''}${meta?`<p class="meta">${esc(meta)}</p>`:''}${S.profile.open?`<div class="drow"><button class="btn small ghost" data-want="${d.id}">${ic('heart')}Me interesa</button></div>`:''}</div>`:''}
 </article>`}).join('');
}
$('#grid').addEventListener('click',e=>{const v=e.target.closest('[data-view]'),w=e.target.closest('[data-want]');if(v)openDesign(v.dataset.view);if(w)wantDesign(w.dataset.want)});
function wantDesign(id){const d=S.designs.find(x=>x.id===id);if(d)openCustom({item:d,photo:d.photos?.[0]||''})}

/* Ventanas */
function openModal(html,cls=''){$('#modal-root').innerHTML=`<div class="modal" role="dialog" aria-modal="true"><div class="modal-card ${cls}"><button class="close" aria-label="Cerrar">${ic('close')}</button>${html}</div></div>`;const m=$('#modal-root .modal');m.addEventListener('mousedown',e=>{if(e.target===m)closeModal()});m.querySelector('.close').onclick=closeModal;document.body.classList.add('noscroll')}
function closeModal(){$('#modal-root').innerHTML='';document.body.classList.remove('noscroll')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

function openDesign(id){
 const d=S.designs.find(x=>x.id===id);if(!d)return;let i=0;const ph=d.photos||[];
 openModal(`<div class="view"><div class="gallery">${ph.length?`<img id="vImg" src="${esc(photo(ph[0]))}" alt="${esc(d.name)}">`:`<span class="nophoto big">${ic('heart')}</span>`}${ph.length>1?`<button class="gnav prev" aria-label="Foto anterior">${ic('left')}</button><button class="gnav next" aria-label="Foto siguiente">${ic('right')}</button><div class="dots">${ph.map((_,k)=>`<i class="${k?'':'on'}"></i>`).join('')}</div>`:''}</div>
 <div class="vinfo">${d.name?`<h2>${esc(d.name)}</h2>`:''}<p class="meta">${esc([d.category,d.shape,d.length].filter(Boolean).join(' · '))}</p>${d.description?`<p class="desc">${esc(d.description)}</p>`:''}${d.tags?.length?`<div class="tags">${d.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}
 ${S.profile.open?`<button class="btn wide" id="vOrder">${ic('heart')}Me interesa</button>`:''}${waLink(S.profile.whatsapp,'')?`<a class="btn ghost wide" id="vWa" target="_blank" rel="noopener">${ic('whatsapp')}Escríbeme por WhatsApp</a>`:''}<p class="muted small">Lo adapto a tus medidas y a tu gusto. Escríbeme y lo hablamos.</p></div></div>`,'wide');
 const show=k=>{i=(k+ph.length)%ph.length;$('#vImg').src=photo(ph[i]);document.querySelectorAll('.dots i').forEach((x,n)=>x.classList.toggle('on',n===i))};
 $('.gnav.prev')?.addEventListener('click',()=>show(i-1));$('.gnav.next')?.addEventListener('click',()=>show(i+1));
 $('#vOrder')?.addEventListener('click',()=>openCustom({item:d,photo:ph[i]||''}));
 const wa=$('#vWa');if(wa)wa.href=waLink(S.profile.whatsapp,`Hola 🌸 He visto ${d.name?'el diseño «'+d.name+'»':'un diseño'} en tu catálogo y me interesa. ${photo(ph[i]||ph[0]||'')}`.trim());
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
function validate(form){const bad=[...form.querySelectorAll('[required]')].find(i=>i.type==='checkbox'?!i.checked:!i.value.trim());if(bad){bad.focus();return bad.type==='checkbox'?'Marca la casilla para poder enviarlo':'Completa los campos marcados'}const em=form.querySelector('input[type=email]');if(em&&em.value&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value))return 'Revisa el email';const ph=form.querySelector('input[type=tel]');if(ph&&ph.value.trim()&&ph.value.replace(/\D/g,'').length<9){ph.focus();return 'Revisa el teléfono: escribe el número completo (9 cifras, o con prefijo si no es de España)'}return ''}
async function send(row,form,btn,doneHtml){
 if(form.querySelector('.hp')?.value)return;
 const err=validate(form);const msg=form.querySelector('.form-msg');if(err){msg.textContent=err;msg.className='form-msg err';return}
 btn.disabled=true;const txt=btn.textContent;btn.textContent='Enviando…';msg.textContent='';
 const {error}=await sb.from('catalog_requests').insert({owner:S.profile.owner,...row,consent:true});
 if(error){btn.disabled=false;btn.textContent=txt;msg.className='form-msg err';msg.textContent=/Demasiados/.test(error.message)?error.message:'No se ha podido enviar. Revisa tu conexión o escríbeme por WhatsApp.';return}
 doneHtml();
}
function thanksHtml(title,extra=''){const wa=waLink(S.profile.whatsapp,'Hola 🌸 Te acabo de escribir desde tu catálogo');return `<div class="thanks"><img src="assets/stamps/love.webp" alt="" style="--r:-6deg"><h2 class="script">${title}</h2><p>${extra||'Te escribo muy pronto.'}</p>${wa?`<a class="btn ghost" href="${esc(wa)}" target="_blank" rel="noopener">${ic('whatsapp')}O escríbeme ya por WhatsApp</a>`:''}</div>`}

function paintContact(){
 const cc=$('#contactConsent');if(cc)cc.outerHTML=consentHtml('responder a tu mensaje');
 const p=S.profile;const links=[];
 if(p.whatsapp)links.push(`<a class="clink" href="${esc(waLink(p.whatsapp,'Hola 🌸 He visto tu catálogo y me gustaría información'))}" target="_blank" rel="noopener">${ic('whatsapp')}<span><b>WhatsApp</b><small>${esc(p.whatsapp)}</small></span></a>`);
 if(p.instagram)links.push(`<a class="clink" href="https://instagram.com/${esc(p.instagram.replace(/^@/,''))}" target="_blank" rel="noopener">${ic('insta')}<span><b>Instagram</b><small>${esc(p.instagram.startsWith('@')?p.instagram:'@'+p.instagram)}</small></span></a>`);
 if(p.tiktok)links.push(`<a class="clink" href="https://www.tiktok.com/@${esc(p.tiktok.replace(/^@/,''))}" target="_blank" rel="noopener">${ic('tiktok')}<span><b>TikTok</b><small>${esc(p.tiktok.startsWith('@')?p.tiktok:'@'+p.tiktok)}</small></span></a>`);
 if(p.email)links.push(`<a class="clink" href="mailto:${esc(p.email)}">${ic('mail')}<span><b>Email</b><small>${esc(p.email)}</small></span></a>`);
 if(p.city)links.push(`<div class="clink">${ic('pin')}<span><b>Dónde estoy</b><small>${esc(p.city)}</small></span></div>`);
 const box=$('#contactLinks');box.closest('.contact-grid').classList.toggle('solo',!links.length);box.hidden=!links.length;box.innerHTML=`<img class="cl-stamp" src="assets/stamps/avion.webp" alt="" aria-hidden="true" style="--r:6deg">`+links.join('');
 const form=$('#contactForm');
 if(!p.open){form.innerHTML='<h3>Ahora mismo no acepto encargos nuevos</h3><p class="muted">Puedes seguir viendo mis diseños. Vuelve pronto 🌸</p>';return}
 wireSeg(form,'c_pref','c');
 form.addEventListener('submit',e=>{e.preventDefault();const c=readContact(form,'c_pref','c');send({kind:'contacto',name:$('#c_name').value.trim().slice(0,80),...c,message:$('#c_msg').value.trim().slice(0,1000)},form,form.querySelector('button[type=submit]'),()=>{form.innerHTML=thanksHtml('¡Mensaje enviado!')})});
}
load();

/* ---------- Legal: RGPD, LSSI y cookies ---------- */
const PRIVACY_VERSION='2026-10';
function L(){const p=S.profile||{};return {biz:p.business||'Lilium Beauty',name:p.legal_name||'',nif:p.legal_id||'',addr:p.legal_address||'',email:p.email||'',city:p.city||'',wa:p.whatsapp||''}}
function who(){const l=L();return esc(l.name||l.biz)+(l.nif?` (NIF ${esc(l.nif)})`:'')}
function contactLine(){const l=L();return [l.email&&`<a href="mailto:${esc(l.email)}">${esc(l.email)}</a>`,l.wa&&`WhatsApp ${esc(l.wa)}`].filter(Boolean).join(' · ')||'el formulario de contacto de esta web'}
function consentHtml(purpose){const l=L();return `<div class="privacy-box"><p><b>Protección de datos.</b> Responsable: ${who()}. Finalidad: ${purpose}. Legitimación: tu consentimiento. No se ceden a terceros; se alojan cifrados en la UE. Puedes acceder, rectificar o suprimir tus datos y ejercer tus demás derechos como se explica en la <button type="button" class="link" onclick="openLegal('privacidad')">política de privacidad</button>.</p></div>
 <label class="consent"><input type="checkbox" required><span>Tengo 14 años o más, he leído la <button type="button" class="link" onclick="openLegal('privacidad')">política de privacidad</button> y acepto que ${esc(l.biz)} use estos datos para ${purpose}.</span></label>`}
function openLegal(kind){
 const l=L();const missing=!l.name||!l.nif;
 const pend=missing?'<p class="legal-pend">Datos de la titular pendientes de completar.</p>':'';
 const html={
 aviso:`<h2>Aviso legal</h2>${pend}<p>En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información (LSSI), se informa de los datos de la titular de esta web:</p>
  <ul><li><b>Titular:</b> ${esc(l.name||'—')}</li><li><b>NIF:</b> ${esc(l.nif||'—')}</li><li><b>Nombre comercial:</b> ${esc(l.biz)}</li>${l.addr?`<li><b>Domicilio:</b> ${esc(l.addr)}</li>`:''}<li><b>Contacto:</b> ${contactLine()}</li></ul>
  <h3>Uso de la web</h3><p>Esta web muestra los diseños de uñas de ${esc(l.biz)} y permite contactar para pedir información o un diseño. Esta web no vende: enviar un mensaje no supone ninguna compra ni compromiso; los detalles se acuerdan después por mensaje.</p>
  <h3>Propiedad intelectual</h3><p>Las fotos, diseños y textos son de ${esc(l.biz)}. No se pueden copiar ni usar sin permiso.</p>
  <h3>Responsabilidad</h3><p>Se intenta que la información sea exacta, pero puede contener errores que se corregirán en cuanto se detecten.</p>
  <h3>Legislación</h3><p>Se aplica la legislación española. Si eres consumidora, tienes los derechos que te reconoce la normativa de consumo.</p>`,
 privacidad:`<h2>Política de privacidad</h2>${pend}<p>Conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD):</p>
  <h3>Responsable</h3><p>${who()}${l.name?' · '+esc(l.biz):''}${l.addr?' · '+esc(l.addr):''}. Contacto: ${contactLine()}.</p>
  <h3>Qué datos se tratan</h3><p>Los que escribes en los formularios: nombre, teléfono, Instagram o email, tu preferencia de contacto, la forma y el largo de uñas que prefieras, las fotos de referencia que subas y tu mensaje. No pidas ni envíes datos de salud por aquí; si tienes alguna alergia, coméntalo directamente por mensaje.</p>
  <h3>Para qué</h3><p>Responder a tus mensajes y contactarte sobre el diseño que te interesa. No se usan para publicidad ni se toman decisiones automatizadas.</p>
  <h3>Base legal</h3><p>Tu consentimiento (art. 6.1.a RGPD) al marcar la casilla, y la aplicación de medidas precontractuales a petición tuya (art. 6.1.b) si decides encargar un diseño. Puedes retirar tu consentimiento cuando quieras.</p>
  <h3>Cuánto tiempo</h3><p>Los mensajes se borran automáticamente un año después de cerrarse y, en todo caso, a los dos años. Si pasas a ser clienta, se conservan mientras lo seas y hasta 2 años después de tu último servicio, salvo obligación legal (por ejemplo, fiscal).</p>
  <h3>Quién los ve</h3><p>Solo la titular. No se ceden a terceros. Se alojan en Supabase (servidores en Irlanda, UE) como encargado del tratamiento, con contrato que garantiza su protección. La web se publica en GitHub Pages y usa Google Fonts y jsDelivr para tipografías y código. Estos servicios pueden recibir tu dirección IP y están acogidos al Marco de Privacidad de Datos UE-EE. UU.</p>
  <h3>Tus derechos</h3><p>Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad de tus datos escribiendo a ${contactLine()}. Si crees que no se han respetado, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener">www.aepd.es</a>).</p>
  <h3>Menores</h3><p>Si tienes menos de 14 años, pide a tu madre, padre o tutor que contacte por ti.</p>
  <h3>Seguridad</h3><p>La conexión está cifrada (HTTPS). Lo que envías solo lo puede leer la titular. Nadie más tiene acceso, ni siquiera desde esta web.</p>
  <p class="muted small">Versión ${PRIVACY_VERSION}.</p>`,
 cookies:`<h2>Política de cookies</h2><p>Esta web <b>no usa cookies</b> ni herramientas de publicidad o de estadísticas. No se te rastrea.</p>
  <p>Solo guarda en tu navegador (almacenamiento local) dos preferencias técnicas, permitidas sin consentimiento por el art. 22.2 de la LSSI:</p>
  <table class="cookie-table"><tr><th>Nombre</th><th>Para qué</th><th>Duración</th></tr><tr><td>lilium_cat_theme</td><td>Recordar si prefieres el modo claro u oscuro</td><td>Hasta que la borres</td></tr><tr><td>lilium_cat_cookies</td><td>Recordar que ya has visto este aviso</td><td>Hasta que la borres</td></tr></table>
  <p>Las tipografías (Google Fonts) y el código de conexión (jsDelivr) se descargan de servicios externos, que reciben tu dirección IP para poder enviártelos. Puedes borrar estos datos desde los ajustes de tu navegador.</p>`}[kind];
 openModal(`<div class="legal">${html}</div>`,'legal-card');
}
function cookieBar(){
 try{if(localStorage.getItem('lilium_cat_cookies')===PRIVACY_VERSION)return}catch{}
 const d=document.createElement('div');d.className='cookie-bar';d.id='cookieBar';d.setAttribute('role','region');d.setAttribute('aria-label','Aviso de cookies');
 d.innerHTML=`<p>🍪 Esta web <b>no usa cookies</b> de publicidad ni de análisis. Solo recuerda tu preferencia de modo claro u oscuro.</p><div><button type="button" class="link" onclick="openLegal('cookies')">Más información</button><button type="button" class="btn small" onclick="try{localStorage.setItem('lilium_cat_cookies',PRIVACY_VERSION)}catch{};this.closest('.cookie-bar').remove()">Entendido</button></div>`;
 document.body.appendChild(d);
}
setTimeout(cookieBar,700);

/* ---------- Diseño propio ---------- */
const STYLES=['Minimalista','Francesa','Flores','Brillos y cromados','Piedras y joyas','Pastel','Nude natural','Oscuro o gótico','Animal print','Boda o evento','Temporada (Navidad, Halloween…)','Sorpréndeme'];
function paintCustom(){
 const b=$('#customBtn');if(!b)return;
 if(!S.profile.open){b.outerHTML='<p class="muted">Ahora mismo no acepto encargos nuevos. Vuelve pronto 🌸</p>';return}
 b.onclick=()=>openCustom();
}
function compress(file,max=1200,q=.82){return new Promise((res,rej)=>{const r=new FileReader();r.onerror=rej;r.onload=()=>{const im=new Image();im.onerror=rej;im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(b=>b?res(b):rej(new Error('img')),'image/jpeg',q)};im.src=r.result};r.readAsDataURL(file)})}
function openCustom(ref=null){
 if(!S.profile.open)return toast('Ahora mismo no acepto encargos nuevos');
 const refs=[];
 openModal(`<div class="order-head">${ref?`<img src="${esc(photo(ref.photo))}" alt="">`:`<img src="assets/stamps/mariposa.webp" alt="" class="stamp-img">`}<div><small class="muted">${ref?'Me interesa':'Diseño propio'}</small><h2>${ref?esc(ref.item.name||'Este diseño'):'A tu estilo'}</h2><p class="muted small">Déjame tus datos y te escribo para hablarlo. No te compromete a nada.</p></div></div>
 <form class="form" id="customForm" novalidate>
  <div class="field"><label for="p_name">Tu nombre</label><input id="p_name" maxlength="80" autocomplete="name" required></div>
  <div class="field"><span class="label">¿Cómo prefieres que te contacte?</span><div class="seg" data-name="p_pref"></div></div>
  <div class="contact-fields" data-for="p_pref"></div>
  <div class="field"><label for="p_idea">${ref?'¿Qué cambiarías o qué te gustaría?':'Cuéntame tu idea'} <small id="p_ideaHint">${ref?'(opcional)':''}</small></label><textarea id="p_idea" rows="4" maxlength="1000" placeholder="${ref?'Igual pero en rojo, más corto, con menos piedras…':'Colores, dibujos, para qué ocasión, cuándo lo necesitas…'}"></textarea></div>
  <div class="field"><span class="label">Estilo <small>(elige los que quieras)</small></span><div class="seg multi" id="p_styles">${STYLES.map(x=>`<label><input type="checkbox" value="${esc(x)}">${esc(x)}</label>`).join('')}</div></div>
  <div class="field"><label for="p_colors">Colores <small>(opcional)</small></label><input id="p_colors" maxlength="80" placeholder="Rosa empolvado y dorado"></div>
  <div class="field"><span class="label">Fotos de referencia <small id="p_refHint">${ref?'(opcional, ya va la de este diseño)':'(al menos 1, hasta 3)'}</small></span><div class="refs" id="p_refs"></div></div>
  <div class="grid-2"><div class="field"><label for="p_shape">Forma</label><input id="p_shape" list="pShapes" maxlength="40" value="${esc(ref?.item?.shape||'')}" placeholder="La que me recomiendes"><datalist id="pShapes">${['Almond','Coffin','Cuadrada','Redonda','Stiletto'].map(x=>`<option value="${x}">`).join('')}</datalist></div><div class="field"><label for="p_len">Largo</label><input id="p_len" list="pLens" maxlength="20" value="${esc(ref?.item?.length||'')}" placeholder="Corto, medio, largo"><datalist id="pLens">${['Corto','Medio','Largo','Extra largo'].map(x=>`<option value="${x}">`).join('')}</datalist></div></div>
  <div class="field"><span class="label">Tus medidas</span><div class="seg multi"><label><input type="checkbox" id="p_help">Ayúdame a medirme</label></div></div>
  <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
  ${consentHtml(ref?'contactarte sobre este diseño':'preparar tu diseño personalizado y contactarte sobre él')}
  <button class="btn wide" type="submit">Enviar mi idea</button>
  <p class="form-msg" role="status"></p>
 </form>`,'order');
 const form=$('#customForm');wireSeg(form,'p_pref','p');
 const surprise=()=>!!form.querySelector('#p_styles input[value="Sorpréndeme"]:checked');
 $('#p_help').addEventListener('change',e=>e.target.closest('label').classList.toggle('on',e.target.checked));
 form.querySelector('#p_styles').addEventListener('change',e=>{const l=e.target.closest('label');if(l)l.classList.toggle('on',e.target.checked);
  if(!ref){const sp=surprise();$('#p_refHint').textContent=sp?'(opcional: me dejas sorprenderte)':'(al menos 1, hasta 3)';$('#p_ideaHint').textContent=sp?'(opcional)':''}});
 const drawRefs=()=>{$('#p_refs').innerHTML=refs.map((r,k)=>`<figure><img src="${r.url}" alt="Referencia ${k+1}"><button type="button" class="rm" data-rm="${k}" aria-label="Quitar foto">${ic('close')}</button></figure>`).join('')+(refs.length<3?`<label class="ref-add">${ic('heart')}<span>Añadir foto</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden></label>`:'')};
 $('#p_refs').addEventListener('click',e=>{const b=e.target.closest('[data-rm]');if(!b)return;const [r]=refs.splice(+b.dataset.rm,1);URL.revokeObjectURL(r.url);drawRefs()});
 $('#p_refs').addEventListener('change',async e=>{const files=[...(e.target.files||[])].filter(f=>/^image\//.test(f.type)).slice(0,3-refs.length);for(const f of files){try{const b=await compress(f);refs.push({blob:b,url:URL.createObjectURL(b)})}catch{toast('No se pudo leer esa foto')}}drawRefs()});
 drawRefs();
 form.addEventListener('submit',async e=>{e.preventDefault();if(form.querySelector('.hp')?.value)return;
  const msg=form.querySelector('.form-msg');const err=validate(form);if(err){msg.textContent=err;msg.className='form-msg err';return}
  const idea=$('#p_idea').value.trim();
  if(!ref&&!surprise()&&!refs.length){msg.textContent='Añade al menos una foto de referencia, o elige el estilo «Sorpréndeme» y te sorprendo yo 💕';msg.className='form-msg err';$('#p_refs').scrollIntoView({block:'center',behavior:'smooth'});return}
  if(!ref&&!surprise()&&!idea){msg.textContent='Cuéntame un poco tu idea';msg.className='form-msg err';$('#p_idea').focus();return}
  const btn=form.querySelector('button[type=submit]');btn.disabled=true;btn.textContent=refs.length?'Subiendo fotos…':'Enviando…';
  const paths=[];
  for(const r of refs){const path=`${S.profile.owner}/${(crypto.randomUUID?crypto.randomUUID():Date.now()+''+Math.random()).replace(/[^a-z0-9-]/gi,'')}.jpg`;const {error}=await sb.storage.from('catalog-refs').upload(path,r.blob,{contentType:'image/jpeg',upsert:false});if(error){btn.disabled=false;btn.textContent='Enviar mi idea';msg.className='form-msg err';msg.textContent='No se han podido subir las fotos. Prueba sin ellas o con otras.';return}paths.push(path)}
  btn.disabled=false;btn.textContent='Enviar mi idea';
  const styles=[...form.querySelectorAll('#p_styles input:checked')].map(i=>i.value);const colors=$('#p_colors').value.trim();
  const c=readContact(form,'p_pref','p');
  send({kind:'propio',design_id:ref?.item?.id||null,design_name:ref?(ref.item.name||'Diseño del catálogo').slice(0,80):'Diseño propio',price:null,name:$('#p_name').value.trim().slice(0,80),...c,
   style:[styles.join(', '),colors&&'Colores: '+colors].filter(Boolean).join(' · ').slice(0,300),refs:ref&&ref.photo?['catalog:'+ref.photo,...paths].slice(0,3):paths,
   sizes:$('#p_help').checked?'Quiere que la ayudes a medirse':'',shape:$('#p_shape').value.trim().slice(0,40),length:$('#p_len').value.trim().slice(0,20),message:idea.slice(0,1000)},
   form,btn,()=>{refs.forEach(r=>URL.revokeObjectURL(r.url));$('.modal-card').innerHTML=`<button class="close" aria-label="Cerrar" onclick="closeModal()">${ic('close')}</button>`+thanksHtml(ref?'¡Recibido!':'¡Idea recibida!','Me encanta que te guste. Te escribo muy pronto para hablarlo.')});
 });
 setTimeout(()=>$('#p_name')?.focus(),60);
}

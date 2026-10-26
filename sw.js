// Service worker propio del catálogo: así el de la app (en la raíz) no lo controla.
const CACHE='lilium-catalogo-v8';
const SHELL=['./','index.html','catalogo.css?v=4','catalogo.js?v=8','manifest.webmanifest','assets/lily.svg','assets/logo.webp','assets/logo-dark.webp','assets/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('lilium-catalogo')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET')return;const url=new URL(req.url);
 if(url.origin!==location.origin||!url.pathname.startsWith('/catalogo/'))return;
 e.respondWith(fetch(req).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(req,c))}return res}).catch(()=>caches.match(req).then(h=>h||caches.match('index.html'))));
});

// PickMe service worker. Versioned, project scoped and network first for navigation and CSS.
const CACHE_NAME='pickme-v7';
const BASE_URL=new URL(self.registration.scope);
const STATIC_ASSETS=['./','index.html','styles.css?v=6','script.js','manifest.json','public_letter.html','valentine.html','godview.html'].map(path=>new URL(path,BASE_URL).href);
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{const cache=await caches.open(CACHE_NAME);await Promise.all(STATIC_ASSETS.map(async url=>{try{const response=await fetch(url,{cache:'reload'});if(response.ok)await cache.put(url,response)}catch(error){console.warn('PickMe cache warmup skipped:',url,error)}}))})());
 self.skipWaiting();
});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith('pickme-')&&key!==CACHE_NAME).map(key=>caches.delete(key)));await self.clients.claim()})())});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 const isStylesheet=url.pathname.endsWith('/styles.css');
 if(request.mode==='navigate'||isStylesheet){
  event.respondWith((async()=>{try{const response=await fetch(request,{cache:'no-cache'});if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put(request,response.clone())}return response}catch(error){return(await caches.match(request))||(request.mode==='navigate'?caches.match(new URL('index.html',BASE_URL).href):Response.error())}})());return;
 }
 event.respondWith((async()=>{const cached=await caches.match(request);if(cached)return cached;const response=await fetch(request);if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put(request,response.clone())}return response})());
});

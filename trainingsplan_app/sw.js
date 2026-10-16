// Offline-Cache: alles, was die App lädt (Seite, 3D-Modelle, Bibliotheken), wird beim ersten Mal gespeichert.
const CACHE='trainingsplan-1792153313';
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const cached = await c.match(e.request);
    const netz = fetch(e.request).then(r => { if (r && (r.ok || r.type === "opaque")) c.put(e.request, r.clone()); return r; }).catch(() => cached);
    return cached || netz;   // sofort aus dem Cache, im Hintergrund aktualisieren
  }));
});

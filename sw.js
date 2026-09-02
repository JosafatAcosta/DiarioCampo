/* Diario de Campo · Clínica Comunitaria Ágora
   Service worker: permite abrir y llenar el diario sin conexión.

   Estrategia:
   · documento (navegación) → red primero, caché como respaldo.
     Así el equipo recibe las actualizaciones al abrir con señal,
     y el diario sigue funcionando cuando no hay red en el Ágora.
   · resto de archivos (íconos, manifiesto) → caché primero.

   Los diarios NO pasan por aquí: viven en localStorage del dispositivo.
*/

const VERSION = 'diario-agora-v2.4.0';
const ESENCIALES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(ESENCIALES))
      .catch(() => null)
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(
        claves.filter((c) => c !== VERSION).map((c) => caches.delete(c))
      ))
      .then(() => self.clients.claim())
  );
});

// Permite que la página pida activar de inmediato una versión nueva.
self.addEventListener('message', (evento) => {
  if (evento.data === 'ACTIVAR_YA') self.skipWaiting();
});

self.addEventListener('fetch', (evento) => {
  const peticion = evento.request;
  if (peticion.method !== 'GET') return;

  const url = new URL(peticion.url);
  if (url.origin !== self.location.origin) return;

  // Navegación: red primero
  if (peticion.mode === 'navigate') {
    evento.respondWith(
      fetch(peticion)
        .then((respuesta) => {
          const copia = respuesta.clone();
          caches.open(VERSION).then((c) => c.put('./index.html', copia));
          return respuesta;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // Resto: caché primero
  evento.respondWith(
    caches.match(peticion).then((enCache) => {
      if (enCache) return enCache;
      return fetch(peticion).then((respuesta) => {
        if (respuesta && respuesta.status === 200 && respuesta.type === 'basic') {
          const copia = respuesta.clone();
          caches.open(VERSION).then((c) => c.put(peticion, copia));
        }
        return respuesta;
      }).catch(() => enCache);
    })
  );
});

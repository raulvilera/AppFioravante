const CACHE_NAME = 'lkm-gestao-v4';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/pwa-192x192.png',
    '/pwa-512x512.png',
    '/index.css'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('SW: Cache aberto');
            // Tentamos cachear os essenciais, mas permitimos continuar mesmo com falha
            return cache.addAll(['/', '/index.html', '/manifest.json']).catch(() => {
                console.warn('SW: Cache inicial falhou, mas continuando instalação...');
            });
        })
    );
    self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('SW: Limpando cache antigo', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Estratégia Fetch: Network First, falling back to cache
self.addEventListener('fetch', (event) => {
    // Ignora requisições de extensões de navegador ou esquemas não-http
    if (!(event.request.url.startsWith('http'))) return;

    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.match(event.request);
            })
    );
});

const CACHE_NAME = 'lkm-gestao-v5';

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Ativação e limpeza
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// O handler de fetch é OBRIGATÓRIO para o PWA ser instalável.
// Mesmo que não salve nada no cache agora, o navegador exige que ele exista.
self.addEventListener('fetch', (event) => {
    // Apenas repassa a requisição para a rede
    event.respondWith(fetch(event.request));
});

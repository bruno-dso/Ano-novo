const CACHE_NAME = "campainha-v2";

const ARQUIVOS = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ARQUIVOS))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

self.addEventListener("push", event => {

    const dados = event.data
        ? event.data.json()
        : {
            title: "🔔 Campainha",
            body: "Alguém está na porta!"
        };

    event.waitUntil(
        self.registration.showNotification(
            dados.title,
            {
                body: dados.body,
                icon: "/icons/icon-192.png",
                badge: "/icons/icon-192.png",
                vibrate: [200, 100, 200]
            }
        )
    );
});
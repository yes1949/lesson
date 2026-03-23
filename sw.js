const CACHE_NAME = 'dictation-app-v1';
// 填入你需要缓存的文件列表
const urlsToCache = [
  './',
  './index.html', // 如果你的主网页叫 dictation.html，请把这里改成 ./dictation.html
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 安装 Service Worker，并缓存核心文件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
  );
});

// 拦截网络请求，优先从缓存读取
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存里有，就直接返回缓存
        if (response) {
          return response;
        }
        // 如果没有，再去发网络请求
        return fetch(event.request);
      })
  );
});

// 激活 Service Worker，清理旧版本缓存
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

const staticCacheName = 's-app-v1'
const dynamicCacheName = 'd-app-v1'

const assetUrls = [ //кешируемые файлы
  'index.html',
  '/js/route.js',
  '/js/script.js',
  '/css/style.css',
  '/offline.html'
]

self.addEventListener('install', async event => { //установка нового воркера
  const cache = await caches.open(staticCacheName)
  await cache.addAll(assetUrls)
})

self.addEventListener('activate', async event => { //остановка старого воркера, активация нового
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
      .filter(name => name !== staticCacheName)
      .filter(name => name !== dynamicCacheName)
      .map(name => caches.delete(name))
  )
})

self.addEventListener('fetch', event => { //получение ресурса из сети, который не был найден в кеше
  const {request} = event
  const url = new URL(request.url)
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request))
  } else {
    event.respondWith(networkFirst(request))
  }
})


async function cacheFirst(request) { //поиск в кеше, если нет - запрос к сети
  const cached = await caches.match(request)
  return cached ?? await networkFirst(request)
}

async function networkFirst(request) { //запрос на получение актуальных файлов
  const cache = await caches.open(dynamicCacheName)
  try {
    const response = await fetch(request)
    await cache.put(request, response.clone())
    return response
  } catch (e) {
    const cached = await cache.match(request)
    return cached ?? await caches.match('/offline.html')
  }
}
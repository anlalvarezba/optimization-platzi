const CACHE_NAME = 'app-v1'

self.addEventListener('fetch', myCustomFetch)
self.addEventListener('activate', clearCache)

function myCustomFetch(event){
    const response = cacheOrFetch(event)
    event.respondWidth(response)
}

async function cacheOrFetch(event){
    let response = await caches.match(event.request)
    if(response){
        return response
    }
    response  = await fetch(event.request)
    if(
        !response ||
        response.status !== 200 ||
        response.type !== 'basic' ||
        !isAssetCSS(event.request.url)
    ){
        return response
    }
    const clonedResponse = response.clone()
    caches.open(CACHE_NAME).then(cache => {
        cache.put(event.request, clonedResponse)
    })

    return response
}

const assetsRegExp = /.png|.gif|.jpg|.jpeg|.css|.js/g
function isAssetCSS(url){
    return assetsRegExp.test(url)
}



/*
	Cache Service Worker template by mrc 2019
	mostly based in:
	https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/basic/service-worker.js
	https://github.com/chriscoyier/Simple-Offline-Site/blob/master/js/service-worker.js
	https://gist.github.com/kosamari/7c5d1e8449b2fbc97d372675f16b566e	
	
	Note for GitHub Pages:
	there can be an unexpected behaviour (cache not updating) when site is accessed from
	https://user.github.io/repo/ (without index.html) in some browsers (Firefox)
	use absolute paths if hosted in GitHub Pages in order to avoid it
	also invoke sw with an absolute path:
	navigator.serviceWorker.register('/repo/_cache_service_worker.js', {scope: '/repo/'})
*/


/* MOD: fix old caches for mrc */
caches.keys().then(function(cacheNames){
	for(var i=0; i<cacheNames.length; i++){
		if(
			cacheNames[i]==='runtime' ||
			/^precache-\w+$/.test(cacheNames[i]) ||
			/^precache-editor-([\w\+]+)-\w+$/.test(cacheNames[i]) ||
			/^v?\d+\w?$/.test(cacheNames[i])
		){
			console.log('deleting old cache: '+cacheNames[i]);
			caches.delete(cacheNames[i]);
		}
	}
});

var PRECACHE_ID='zelda-botw-editor';
var PRECACHE_VERSION='v5c';
var PRECACHE_URLS=[
	//is hashes file too big for cacheing?
	'/savegame-editors/zelda-botw/','/savegame-editors/zelda-botw/index.html',
	'/savegame-editors/zelda-botw/zelda-botw.css',
	'/savegame-editors/zelda-botw/zelda-botw.js',
	'/savegame-editors/zelda-botw/zelda-botw.data.js',
	'/savegame-editors/zelda-botw/zelda-botw.icons.js',
	'/savegame-editors/zelda-botw/zelda-botw.locations.js',
	'/savegame-editors/zelda-botw/zelda-botw.master.js',
	'/savegame-editors/zelda-botw/favicon.png',
	'/savegame-editors/zelda-botw/assets/_blank.png',
	'/savegame-editors/zelda-botw/assets/logo.png',
	'/savegame-editors/zelda-botw/assets/tabs.png',
	'/savegame-editors/zelda-botw/assets/bg_black.jpg',
	'/savegame-editors/zelda-botw/assets/bg_white.jpg',
	'/savegame-editors/savegame-editor.js'
];



// install event (fired when sw is first installed): opens a new cache
self.addEventListener('install', evt => {
	evt.waitUntil(
		caches.open('precache-'+PRECACHE_ID+'-'+PRECACHE_VERSION)
			.then(cache => cache.addAll(PRECACHE_URLS))
			.then(self.skipWaiting())
	);
});


// activate event (fired when sw is has been successfully installed): cleans up old outdated caches
self.addEventListener('activate', evt => {
	evt.waitUntil(
		caches.keys().then(cacheNames => {
			return cacheNames.filter(cacheName => (cacheName.startsWith('precache-'+PRECACHE_ID+'-') && !cacheName.endsWith('-'+PRECACHE_VERSION)));
		}).then(cachesToDelete => {
			return Promise.all(cachesToDelete.map(cacheToDelete => {
				console.log('delete '+cacheToDelete);
				return caches.delete(cacheToDelete);
			}));
		}).then(() => self.clients.claim())
	);
});


// fetch event (fired when requesting a resource): returns cached resource when possible
self.addEventListener('fetch', evt => {
	if(evt.request.url.startsWith(self.location.origin)){ //skip cross-origin requests
		evt.respondWith(
			caches.match(evt.request).then(cachedResource => {
				if (cachedResource) {
					return cachedResource;
				}else{
					return fetch(evt.request);
				}
			})
		);
	}
});
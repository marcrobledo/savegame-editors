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

var PRECACHE_ID='zelda-totk-editor';
var PRECACHE_VERSION='v1';
var PRECACHE_URLS=[
	'/savegame-editors/zelda-totk/','/savegame-editors/zelda-totk/index.html',
	'/savegame-editors/zelda-totk/zelda-totk.css',
	'/savegame-editors/zelda-totk/zelda-totk.js',

	'/savegame-editors/zelda-totk/zelda-totk.class.armor.js',
	'/savegame-editors/zelda-totk/zelda-totk.class.autobuilder.js',
	'/savegame-editors/zelda-totk/zelda-totk.class.equipment.js',
	'/savegame-editors/zelda-totk/zelda-totk.class.horse.js',
	'/savegame-editors/zelda-totk/zelda-totk.class.item.js',
	'/savegame-editors/zelda-totk/zelda-totk.class.pouch.js',

	'/savegame-editors/zelda-totk/zelda-totk.completism.js',
	'/savegame-editors/zelda-totk/zelda-totk.coordinates.js',
	'/savegame-editors/zelda-totk/zelda-totk.exp-calculator.js',
	'/savegame-editors/zelda-totk/zelda-totk.locale.js',
	'/savegame-editors/zelda-totk/zelda-totk.master.js',
	'/savegame-editors/zelda-totk/zelda-totk.variables.js',

	'/savegame-editors/zelda-totk/lib/cash.min.js',
	'/savegame-editors/zelda-totk/lib/murmurhash3js.min.js',

	'/savegame-editors/zelda-totk/locale/zelda-totk.locale.en',

	'/savegame-editors/zelda-totk/favicon.png',

	'/savegame-editors/zelda-totk/assets/item_icons/unknown.png',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_check.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_copy.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_download.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_eye.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_github.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_heart.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_infinity.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_kebab_vertical.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_link_external.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_pin.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_pin_slash.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_plus_circle.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_sparkle_fill.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_star_fill.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_tools.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_trash.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_upload.svg',
	'/savegame-editors/zelda-totk/assets/octicons/octicon_x.svg',

	'/savegame-editors/zelda-totk/assets/logo.png',
	'/savegame-editors/zelda-totk/assets/tabs.png',
	'/savegame-editors/zelda-totk/assets/bg_black.jpg',
	'/savegame-editors/zelda-totk/assets/bg_white.jpg',

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
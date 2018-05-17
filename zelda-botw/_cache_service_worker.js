/*
Copyright 2016 Google Inc. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at	http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
---
mod by marcrobledo, original from: https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/basic/service-worker.js
*/

const PRECACHE_ID='v20180517c';
const PRECACHE_FILES=[
'zelda-botw/index.html','./',
'zelda-botw/zelda-botw.css',
'zelda-botw/zelda-botw.js',
'zelda-botw/zelda-botw.data.js',
'zelda-botw/zelda-botw.icons.js',
'zelda-botw/zelda-botw.locations.js',
'zelda-botw/favicon.png',
'zelda-botw/assets/_blank.png',
'zelda-botw/assets/logo.png',
'zelda-botw/assets/bg_black.jpg',
'zelda-botw/assets/bg_white.jpg',
'savegame-editor.js'
];

self.addEventListener('install',event=>{event.waitUntil(caches.open(PRECACHE_ID).then(cache=>cache.addAll(PRECACHE_FILES)).then(self.skipWaiting()))});self.addEventListener('activate',event=>{const currentCaches=[PRECACHE_ID,'runtime'];event.waitUntil(caches.keys().then(cacheNames=>{return cacheNames.filter(cacheName=>!currentCaches.includes(cacheName));}).then(cachesToDelete=>{return Promise.all(cachesToDelete.map(cacheToDelete=>{return caches.delete(cacheToDelete);}))}).then(()=>self.clients.claim()))});self.addEventListener('fetch',event=>{if(event.request.url.startsWith(self.location.origin))event.respondWith(caches.match(event.request).then(cachedResponse=>{if(cachedResponse)return cachedResponse;return caches.open('runtime').then(cache=>{return fetch(event.request).then(response=>{return cache.put(event.request,response.clone()).then(()=>{return response})})})}))})
// Service Worker for caching video and static assets
const CACHE_NAME = 'esa-cache-v1';
const VIDEO_CACHE = 'esa-video-cache-v1';
const STATIC_CACHE = 'esa-static-cache-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/about',
  '/services', 
  '/projects',
  '/contact',
  '/android-chrome-512x512.png',
  '/video-fallback.jpg',
  '/video-poster.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
    ])
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== VIDEO_CACHE && 
              cacheName !== STATIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Video files - Cache with custom strategy
  if (request.url.includes('/uploads/') && 
      (request.url.includes('.mp4') || 
       request.url.includes('.webm') || 
       request.url.includes('-thumb.jpg'))) {
    event.respondWith(handleVideoRequest(request));
    return;
  }

  // Static assets - Cache first
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script' ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.webp')) {
    event.respondWith(handleStaticAssets(request));
    return;
  }

  // API requests - Network first with fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // HTML pages - Network first with cache fallback
  if (request.destination === 'document') {
    event.respondWith(handlePageRequest(request));
    return;
  }

  // Default: network first
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Handle video file requests with range support
async function handleVideoRequest(request) {
  const cache = await caches.open(VIDEO_CACHE);
  
  // Check if we have the video in cache
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Handle range requests for video
    if (request.headers.has('range')) {
      return handleRangeRequest(request, cachedResponse);
    }
    return cachedResponse;
  }

  try {
    // Fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the video file (only cache complete responses)
      if (!request.headers.has('range')) {
        const responseClone = networkResponse.clone();
        cache.put(request, responseClone);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Video fetch failed:', error);
    // Return cached version if available
    return cachedResponse || new Response('Video unavailable', { status: 503 });
  }
}

// Handle range requests for cached video
function handleRangeRequest(request, cachedResponse) {
  const rangeHeader = request.headers.get('range');
  const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
  
  if (!match) {
    return cachedResponse;
  }

  const start = parseInt(match[1]);
  const end = match[2] ? parseInt(match[2]) : undefined;

  return cachedResponse.arrayBuffer().then(buffer => {
    const byteLength = buffer.byteLength;
    const endByte = end || byteLength - 1;
    const slice = buffer.slice(start, endByte + 1);
    
    return new Response(slice, {
      status: 206,
      statusText: 'Partial Content',
      headers: {
        'Content-Range': `bytes ${start}-${endByte}/${byteLength}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': slice.byteLength,
        'Content-Type': cachedResponse.headers.get('content-type') || 'video/mp4',
      }
    });
  });
}

// Handle static assets with cache first strategy
async function handleStaticAssets(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Asset unavailable', { status: 503 });
  }
}

// Handle API requests with network first
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful GET requests
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache for GET requests
    if (request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    throw error;
  }
}

// Handle page requests
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    return cache.match('/') || new Response('Page unavailable', { status: 503 });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  // Handle offline contact form submissions
  const requests = await getStoredRequests('contact-form');
  
  for (const request of requests) {
    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.data)
      });
      
      // Remove from storage after successful sync
      await removeStoredRequest('contact-form', request.id);
    } catch (error) {
      console.error('Failed to sync contact form:', error);
    }
  }
}

// Helper functions for IndexedDB operations
async function getStoredRequests(storeName) {
  // Implementation would use IndexedDB to store offline requests
  return [];
}

async function removeStoredRequest(storeName, id) {
  // Implementation would remove from IndexedDB
}
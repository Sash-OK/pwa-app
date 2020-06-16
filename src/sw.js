const VERSION = 'v1';
const CACHE_ID = `sw-test-${VERSION}`;

self.addEventListener('install', (ev) => {
  self.skipWaiting();
  ev.waitUntil(
    caches.open(CACHE_ID).then((cache) => {
      cache.addAll([
        '/',
        'http://localhost:3000/api/notifications_111',
        '/runtime.js',
        '/polyfills.js',
        '/styles.js',
        '/vendor.js',
        '/main.js'
      ]);
    })
  );
});

self.addEventListener('activate', ev => {
  ev.waitUntil(self.clients.claim());

  ev.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(cacheKey => {
        if (CACHE_ID !== cacheKey) {
          return caches.delete(cacheKey);
        }
      })
    ))
  );
});

self.addEventListener('fetch', ev => {
  if (ev.request.url.includes('api/')) {
    return ev.respondWith(apiRequestHandler(ev.request));
  }

  ev.respondWith(resourceRequestHandler(ev.request.url));
});

function apiRequestHandler(request) {
  const errorResponse = () => {
    return new Response(JSON.stringify({needSync: true}), {
      headers: {'Content-Type': 'application/json'},
      status: 500,
      ok: false
    });
  }

  if (navigator.onLine) {
    if (request.method === 'POST') {
      return fetch(request.clone())
        .then(
          resp => {
            if (!resp.ok) {
              throw Error('Error');
            }

            return resp;
          }
        )
        .catch(errorResponse);
    }

    return fetch(request.clone());
  }

  return errorResponse();
}

/*self.addEventListener('sync', (ev) => {
  console.log('sync event', ev);
  if (ev.tag === 'showNotifications') {
    ev.waitUntil(syncHandler());
  }
});

self.addEventListener('message', (ev) => {
  ev.waitUntil(showMessage(ev.data));
});*/

async function syncHandler() {
  const notifications = await getNotifications();

  return Promise.all(notifications.map((message) => {
    return showMessage(message).then(() => deleteNotification(message.id));
  }));
}

function showMessage(message) {
  return new Promise((resolve) => {
    const messageTime = new Date(message.dateTime).getTime();
    const currentTime = new Date().getTime();
    const timeout = messageTime - currentTime;
    console.log('New Message ', message);

    setTimeout(() => {
      self.registration.showNotification('My notify', {
        body: message.message,
        timestamp: messageTime
      });
      resolve();
    }, timeout > 0 ? timeout : 0);
  });
}

async function resourceRequestHandler(url) {
  const cached = await caches.match(url);
  return cached || fetch(url);
}

function openDB(dbName) {
  return new Promise((resolve, reject) => {
    const request = this.indexedDB.open(dbName);
    request.onsuccess = () => {
      const db = request.result;

      db.onversionchange = () => {
        db.close();
        console.log('Refresh the page, DB is outdated');
      };

      resolve(db);
    };
  });
}

async function getNotifications() {
  const db = await openDB('my-pwa-store');

  return new Promise((resolve, reject) => {
    const tableName = 'notifications';
    const transaction = db.transaction(tableName, 'readonly');
    const store = transaction.objectStore(tableName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function deleteNotification(id) {
  const db = await openDB('my-pwa-store');
  const transaction = db.transaction('notifications', 'readwrite');
  const store = transaction.objectStore('notifications');

  store.delete(id);
  transaction.oncomplete = (e) => {
    db.close();
  };
}

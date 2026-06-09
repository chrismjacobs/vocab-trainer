self.addEventListener('install', function (e) {
  self.skipWaiting()
})

self.addEventListener('activate', function (e) {
  e.waitUntil(clients.claim())
})

self.addEventListener('push', function (e) {
  var data = {}
  if (e.data) {
    try { data = e.data.json() } catch (err) { data = { title: 'Vocab Trainer', body: e.data.text() } }
  }
  var title = data.title || 'Vocab Trainer'
  var options = {
    body: data.body || 'Time to practice!',
    icon: '/static/icon.svg',
    badge: '/static/icon.svg',
    data: { url: data.url || '/' }
  }
  e.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (e) {
  e.notification.close()
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url === e.notification.data.url && 'focus' in list[i]) {
          return list[i].focus()
        }
      }
      if (clients.openWindow) return clients.openWindow(e.notification.data.url)
    })
  )
})

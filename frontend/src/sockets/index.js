import store from '../store/store'

export function openSocket () {
  const io = require('socket.io-client')

  let host = window.location.hostname

  if (host.includes('127') || host.includes('local')) {
    host = 'http://127.0.0.1:5000/'
  } else {
    host = 'https://vc-bootcamp.herokuapp.com/'
  }
  const socket = io.connect(host)
  let userProfile = store.state.userProfile

  socket.on('connect', function () {
    // sends to app.py as msg which it prints
    socket.emit('online', { username: userProfile.username, email: userProfile.email })
  })

  socket.on('onlineUsers', function (data) {
    console.log('onlineUsers', data)
  })

  return socket
}

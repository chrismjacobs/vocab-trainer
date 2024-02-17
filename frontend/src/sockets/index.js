import store from '../store/store'

export function openSocket () {
  const io = require('socket.io-client')

  let host = 'https://' + window.location.hostname
  if (host.includes('127') || host.includes('local')) {
    host = 'http://127.0.0.1:5000'
  }

  const socket = io.connect(host)
  let userProfile = store.state.userProfile
  // let friends = store.state.logsRecord.friends
  let friends = userProfile.classmates

  socket.on('connect', function () {
    // sends to app.py as msg which it prints
    socket.emit('online', { userProfile: userProfile, friends: friends })
  })

  return socket
}

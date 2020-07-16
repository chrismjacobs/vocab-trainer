import Vue from 'vue'

// The EventBus is an instance of the Vue object.
// has both an $emit and a pair of $on / $off methods,
// used to emit events as well as register and unregister to events.
export const EventBus = new Vue()

// jwt =  [HEADER].[PAYLOAD].[SIGNATURE]
// payload contains studentID/time start/expire data as JSON
export function isValidJwt (jwt) {
  if (!jwt || jwt.split('.').length < 3) {
    console.log('NO JWT or CANNOT be SPLIT 3WAYS', jwt)
    return false
  }
  const data = JSON.parse(atob(jwt.split('.')[1]))
  const exp = new Date(data.exp * 1000) // JS deals with dates in milliseconds since epoch
  const now = new Date()
  console.log('VALIDATION DATA', data, exp, now)
  return now < exp
}

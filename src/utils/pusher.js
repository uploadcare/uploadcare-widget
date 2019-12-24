import { Pusher } from '../vendor/pusher'

// utils.pusher
var pushers = {}

// This fixes Pusher's prototype. Because Pusher replaces it:
// Pusher.prototype = {method: ...}
// instead of extending:
// Pusher.prototype.method = ...
Pusher.prototype.constructor = Pusher
class ManagedPusher extends Pusher {
  subscribe(name) {
    // Ensure we are connected when subscribing.
    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout)
      this.disconnectTimeout = null
    }
    this.connect()
    return super.subscribe(...arguments)
  }

  unsubscribe(name) {
    super.unsubscribe(...arguments)
    // Schedule disconnect if no channels left.
    if (this.channels.channels && Object.keys(this.channels.channels).length === 0) {
      this.disconnectTimeout = setTimeout(() => {
        this.disconnectTimeout = null
        return this.disconnect()
      }, 5000)
    }
  }
}

const getPusher = function(key) {
  if (pushers[key] == null) {
    pushers[key] = new ManagedPusher(key)
  }

  // Preconnect before we actually need channel.
  pushers[key].connect()
  return pushers[key]
}

export { getPusher }

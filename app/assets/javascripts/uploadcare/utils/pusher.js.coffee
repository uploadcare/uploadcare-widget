#
# USAGE:
# 
#     var pusher = uploadcare.utils.pusher.getPusher(key, 'owner')
#     # owner is your module which uses pusher
#
#     # when you're done
#     pusher.release()
# 

uploadcare.whenReady ->
  {debug} = uploadcare
  debug('hello');

  uploadcare.namespace 'uploadcare.utils.pusher', (ns) ->
    pushers = {}

    ns.getPusher = (key, owner) ->
      if key not of pushers
        pushers[key] =
          instance: null,
          owners: {}

      if not pushers[key].owners[owner]
        pushers[key].owners[owner] = true

      updateConnection(key)

      pusherWrapped(key, owner)


    releasePusher = (key, owner) ->
      debug('releasing', owner)

      if not pushers[key].owners[owner]
        debug('this pusher has already been released')
        return 

      pushers[key].owners[owner] = false

      updateConnection(key)

    ownerCount = (key) ->
      (owner for owner of pushers[key].owners when pushers[key].owners[owner]).length

    updateConnection = (key) ->
      instance = pusherInstance(key)

      # .connect() and disconnect() seems to be no-ops
      # if it's already in this state. so not checking.
      if ownerCount(key) > 0
        debug('connect', key)
        instance.connect()
      else
        debug('disconnect timeout started', key)
        setTimeout (->
          if ownerCount(key) > 0
            debug('not disconnecting in the end')
          else
            debug('actual disconnect', key)
            instance.disconnect()
          ), 5000
        

    pusherInstance = (key) ->
      if pushers[key]?.instance?
        return pushers[key].instance
      
      debug('new actual Pusher')
      pushers[key].instance = new Pusher(key)


    pusherWrapped = (key, owner) ->
      Wrapped = ->
        this.owner = owner # just fyi
        this.release = -> releasePusher(key, owner)
        this # is a constructor

      Wrapped.prototype = pusherInstance(key)
      new Wrapped()




      

  

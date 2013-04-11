#
# USAGE:
# 
#     var pusher = uploadcare.utils.pusher.getPusher(key, 'owner')
#     # owner is your module which uses pusher
#
#     # when you're done
#     pusher.release()
# 

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
    if not pushers[key].owners[owner]
      return 

    pushers[key].owners[owner] = false

    updateConnection(key)

  hasOwners = (key) ->
    (owner for owner of pushers[key].owners when pushers[key].owners[owner])
      .length > 0

  updateConnection = (key) ->
    instance = pusherInstance(key)

    # .connect() and disconnect() seems to be no-ops
    # if it's already in this state. so not checking.
    if hasOwners(key)
      instance.connect()
    else
      setTimeout (->
        unless hasOwners(key)
          instance.disconnect()
        ), 5000
      

  pusherInstance = (key) ->
    if pushers[key]?.instance?
      return pushers[key].instance
    
    pushers[key].instance = new Pusher(key)


  pusherWrapped = (key, owner) ->
    Wrapped = ->
      this.owner = owner # just fyi
      this.release = -> releasePusher(key, owner)
      this # is a constructor

    Wrapped.prototype = pusherInstance(key)
    new Wrapped()

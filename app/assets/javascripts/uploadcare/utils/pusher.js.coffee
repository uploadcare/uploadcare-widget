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

  ns.getPusher = (key) ->
    if not pushers[key]?
      pushers[key] = new uploadcare.Pusher(key)

    return pushers[key]

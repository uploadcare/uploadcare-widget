uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  url = 'http://uploadcare.local:5000'

  namespace 'uploadcare.social', (ns) ->
    class SocialServices
      constructor: () ->
        @services = {}

      updateStatus: (callback) ->

        $.ajax "#{url}/sources/list",
          dataType: 'jsonp'
        .done((data) =>
          for service, status of data
            @services[service].updateStatus(status)
        )

      register: (service, adapter) ->
        @services[service] = adapter


    ns.socialServices = new SocialServices()

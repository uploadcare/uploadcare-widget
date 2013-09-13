{
  namespace,
  jQuery: $,
  templates: {tpl},
  locale: {t}
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->

  class ns.BaseSourceTab

    CLASS_PREFIX = 'uploadcare-dialog-source-base-'
    ROLE_PREFIX = '@' + CLASS_PREFIX

    constructor: (@container, @tabButton, @dialogApi, @settings) ->

      @container.append tpl 'source-tab-base'

      @wrap = @container.find ROLE_PREFIX + 'wrap'

      notDisabled = ':not(.uploadcare-disabled-el)'
      @container.on('click', ROLE_PREFIX + 'show-files' + notDisabled, @dialogApi.switchToPreview)
      @container.on('click', ROLE_PREFIX + 'done' + notDisabled, @dialogApi.done)

      updateFooter = =>
        tooFewFiles = @dialogApi.fileColl.length() is 0

        @container.find("#{ROLE_PREFIX}done, #{ROLE_PREFIX}show-files")
          .toggleClass 'uploadcare-disabled-el', tooFewFiles

        @container.find(ROLE_PREFIX + 'footer-text')
          .text(
              t('dialog.tabs.preview.multiple.title') + ' ' + t('file', @dialogApi.fileColl.length())
          )

      updateFooter()
      @dialogApi.fileColl.onAdd.add updateFooter
      @dialogApi.fileColl.onRemove.add updateFooter

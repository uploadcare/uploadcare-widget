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
      @container.on('click', ROLE_PREFIX + 'show-files' + notDisabled, =>
        @dialogApi.switchTab 'preview')
      @container.on('click', ROLE_PREFIX + 'done' + notDisabled, @dialogApi.resolve)

      updateFooter = =>
        files = @dialogApi.fileColl.length()
        tooManyFiles = @settings.multipleMax != 0 and files > @settings.multipleMax
        tooFewFiles = files < @settings.multipleMin

        @container.find(ROLE_PREFIX + 'done')
          .toggleClass 'uploadcare-disabled-el', tooManyFiles or tooFewFiles

        @container.find(ROLE_PREFIX + 'show-files')
          .toggleClass 'uploadcare-disabled-el', files is 0

        footer = if tooManyFiles
          t('dialog.tabs.preview.multiple.tooManyFiles')
            .replace('%max%', @settings.multipleMax)
        else if files and tooFewFiles
          t('dialog.tabs.preview.multiple.tooFewFiles')
            .replace('%min%', @settings.multipleMin)
        else
          t('dialog.tabs.preview.multiple.title')

        @container.find(ROLE_PREFIX + 'footer-text')
          .toggleClass('uploadcare-error', tooManyFiles)
          .text(footer.replace('%files%', t('file', files)))

        @container.find(".#{CLASS_PREFIX}counter")
          .toggleClass('uploadcare-error', tooManyFiles)
          .text(if files then "(#{files})" else "")

      updateFooter()
      @dialogApi.fileColl.onAdd.add updateFooter
      @dialogApi.fileColl.onRemove.add updateFooter

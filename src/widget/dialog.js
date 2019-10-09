import $ from 'jquery'

import { FileTab } from './tabs/file-tab'
import { UrlTab } from './tabs/url-tab'
import { CameraTab } from './tabs/camera-tab'
import { RemoteTab } from './tabs/remote-tab'
import { PreviewTab } from './tabs/preview-tab'
import { PreviewTabMultiple } from './tabs/preview-tab-multiple'

import { CollectionOfPromises } from '../utils/collection'
import { then, publicCallbacks, fitSize, applyCropCoordsToInfo } from '../utils'
import { build, emptyKeyText } from '../settings'
import { t } from '../locale'
import { tpl } from '../templates'
import { filesFrom } from '../files'
import { FileGroup } from '../files/group-creator'
import { isFileGroup } from '../utils/groups'

const lockDialogFocus = function (e) {
  if (!e.shiftKey && focusableElements.last().is(e.target)) {
    e.preventDefault()
    return focusableElements.first().focus()
  } else if (e.shiftKey && focusableElements.first().is(e.target)) {
    e.preventDefault()
    return focusableElements.last().focus()
  }
}

const lockScroll = function (el, toTop) {
  var left, top
  top = el.scrollTop()
  left = el.scrollLeft()
  if (toTop) {
    el.scrollTop(0).scrollLeft(0)
  }
  return function () {
    return el.scrollTop(top).scrollLeft(left)
  }
}

$(window).on('keydown', (e) => {
  if (isDialogOpened()) {
    if (e.which === 27) { // Escape
      e.stopImmediatePropagation()
      // close only topmost dialog
      if (typeof currentDialogPr !== 'undefined' && currentDialogPr !== null) {
        currentDialogPr.reject()
      }
    }
    if (e.which === 9) { // Tab
      return lockDialogFocus(e)
    }
  }
})

let currentDialogPr = null
const openedClass = 'uploadcare--page'
let originalFocusedElement = null
let focusableElements = null

const isDialogOpened = function () {
  return currentDialogPr !== null
}

const closeDialog = function () {
  // todo fix this

  var results = []

  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDialogPr) {
    results.push(currentDialogPr.reject())
  }

  return results
}

const openDialog = function (files, tab, settings) {
  var cancelLock, dialog, dialogPr
  closeDialog()
  originalFocusedElement = document.activeElement
  dialog = $(tpl('dialog')).appendTo('body')
  dialogPr = openPanel(dialog.find('.uploadcare--dialog__placeholder'), files, tab, settings)
  dialog.find('.uploadcare--panel').addClass('uploadcare--dialog__panel')
  dialog.addClass('uploadcare--dialog_status_active')
  dialogPr.dialogElement = dialog
  focusableElements = dialog.find('select, input, textarea, button, a[href]')
  focusableElements.first().focus()
  cancelLock = lockScroll($(window), dialog.css('position') === 'absolute')
  $('html, body').addClass(openedClass)
  dialog.find('.uploadcare--dialog__close').on('click', dialogPr.reject)
  dialog.on('dblclick', function (e) {
    var showStoppers
    // handler can be called after element detached (close button)
    if (!$.contains(document.documentElement, e.target)) {
      return
    }
    showStoppers = '.uploadcare--dialog__panel, .uploadcare--dialog__powered-by'
    if ($(e.target).is(showStoppers) || $(e.target).parents(showStoppers).length) {
      return
    }
    return dialogPr.reject()
  })

  currentDialogPr = dialogPr.always(function () {
    $('html, body').removeClass(openedClass)
    currentDialogPr = null
    dialog.remove()
    cancelLock()
    return originalFocusedElement.focus()
  })

  return currentDialogPr
}

const openPreviewDialog = function (file, settings) {
  var dialog, oldDialogPr
  // hide current opened dialog and open new one
  oldDialogPr = currentDialogPr
  currentDialogPr = null
  settings = $.extend({}, settings, {
    multiple: false,
    tabs: ''
  })
  dialog = openDialog(file, 'preview', settings)
  if (oldDialogPr != null) {
    oldDialogPr.dialogElement.addClass('uploadcare--dialog_status_inactive')
  }
  dialog.always(function () {
    currentDialogPr = oldDialogPr
    if (oldDialogPr != null) {
      // still opened
      $('html, body').addClass(openedClass)
      return oldDialogPr.dialogElement.removeClass('uploadcare--dialog_status_inactive')
    }
  })
  dialog.onTabVisibility((tab, shown) => {
    if (tab === 'preview' && !shown) {
      return dialog.reject()
    }
  })
  return dialog
}

// files - null, or File object, or array of File objects, or FileGroup object
// result - File objects or FileGroup object (depends on settings.multiple)
const openPanel = function (placeholder, files, tab, settings) {
  var filter, panel

  if ($.isPlainObject(tab)) {
    settings = tab
    tab = null
  }

  if (!files) {
    files = []
  } else if (isFileGroup(files)) {
    files = files.files()
  } else if (!$.isArray(files)) {
    files = [files]
  }

  settings = build(settings)

  panel = new Panel(settings, placeholder, files, tab).publicPromise()

  filter = function (files) {
    if (settings.multiple) {
      return FileGroup(files, settings)
    } else {
      return files[0]
    }
  }

  return then(panel, filter, filter).promise(panel)
}

const registeredTabs = {}
const registerTab = function (tabName, constructor) {
  registeredTabs[tabName] = constructor
  return registeredTabs[tabName]
}

registerTab('file', FileTab)
registerTab('url', UrlTab)
registerTab('camera', CameraTab)
registerTab('facebook', RemoteTab)
registerTab('dropbox', RemoteTab)
registerTab('gdrive', RemoteTab)
registerTab('gphotos', RemoteTab)
registerTab('instagram', RemoteTab)
registerTab('flickr', RemoteTab)
registerTab('vk', RemoteTab)
registerTab('evernote', RemoteTab)
registerTab('box', RemoteTab)
registerTab('onedrive', RemoteTab)
registerTab('huddle', RemoteTab)
registerTab('empty-pubkey', function (tabPanel, _1, _2, settings) {
  return tabPanel.append(emptyKeyText)
})

registerTab('preview', function (tabPanel, tabButton, dialogApi, settings, name) {
  var tabCls
  if (!settings.previewStep && dialogApi.fileColl.length() === 0) {
    return
  }
  tabCls = settings.multiple ? PreviewTabMultiple : PreviewTab
  // eslint-disable-next-line new-cap
  return new tabCls(tabPanel, tabButton, dialogApi, settings, name)
})

class Panel {
  constructor (settings1, placeholder, files, tab) {
    var sel
    // (fileType, data) or ([fileObject, fileObject])
    this.addFiles = this.addFiles.bind(this)
    this.__resolve = this.__resolve.bind(this)
    this.__reject = this.__reject.bind(this)
    this.__updateFooter = this.__updateFooter.bind(this)
    this.__closePanel = this.__closePanel.bind(this)
    this.switchTab = this.switchTab.bind(this)
    this.showTab = this.showTab.bind(this)
    this.hideTab = this.hideTab.bind(this)
    this.isTabVisible = this.isTabVisible.bind(this)
    this.openMenu = this.openMenu.bind(this)

    this.settings = settings1
    this.dfd = $.Deferred()
    this.dfd.always(this.__closePanel)
    sel = '.uploadcare--panel'
    this.content = $(tpl('dialog__panel'))
    this.panel = this.content.find(sel).add(this.content.filter(sel))
    this.placeholder = $(placeholder)
    this.placeholder.replaceWith(this.content)
    this.panel.append($(tpl('icons')))
    if (this.settings.multiple) {
      this.panel.addClass('uploadcare--panel_multiple')
    }
    this.panel.find('.uploadcare--menu__toggle').on('click', () => {
      return this.panel.find('.uploadcare--menu').toggleClass('uploadcare--menu_opened')
    })
    // files collection
    this.files = new CollectionOfPromises(files)
    this.files.onRemove.add(() => {
      if (this.files.length() === 0) {
        return this.hideTab('preview')
      }
    })
    this.__autoCrop(this.files)
    this.tabs = {}
    this.__prepareFooter()
    this.onTabVisibility = $.Callbacks().add((tab, show) => {
      return this.panel.find(`.uploadcare--menu__item_tab_${tab}`).toggleClass('uploadcare--menu__item_hidden', !show)
    })
    if (this.settings.publicKey) {
      this.__prepareTabs(tab)
    } else {
      this.__welcome()
    }
  }

  publicPromise () {
    if (!this.promise) {
      this.promise = this.dfd.promise({
        reject: this.__reject,
        resolve: this.__resolve,
        fileColl: this.files,
        addFiles: this.addFiles,
        switchTab: this.switchTab,
        hideTab: this.hideTab,
        showTab: this.showTab,
        isTabVisible: this.isTabVisible,
        openMenu: this.openMenu,
        onTabVisibility: publicCallbacks(this.onTabVisibility)
      })
    }

    return this.promise
  }

  addFiles (files, data) {
    var file, i, len
    if (data) {
      // 'files' is actually file type
      files = filesFrom(files, data, this.settings)
    }
    if (!this.settings.multiple) {
      this.files.clear()
      files = [files[0]]
    }
    for (i = 0, len = files.length; i < len; i++) {
      file = files[i]
      if (this.settings.multipleMaxStrict) {
        if (this.files.length() >= this.settings.multipleMax) {
          file.cancel()
          continue
        }
      }
      this.files.add(file)
    }
    if (this.settings.previewStep) {
      this.showTab('preview')
      if (!this.settings.multiple) {
        return this.switchTab('preview')
      }
    } else {
      return this.__resolve()
    }
  }

  __autoCrop (files) {
    var crop, i, len, ref
    if (!this.settings.crop || !this.settings.multiple) {
      return
    }
    ref = this.settings.crop
    for (i = 0, len = ref.length; i < len; i++) {
      crop = ref[i]
      // if even one of crop option sets allow free crop,
      // we don't need to crop automatically
      if (!crop.preferedSize) {
        return
      }
    }
    return files.autoThen((fileInfo) => {
      var info, size
      // .cdnUrlModifiers came from already cropped files
      // .crop came from autocrop even if autocrop do not set cdnUrlModifiers
      if (!fileInfo.isImage || fileInfo.cdnUrlModifiers || fileInfo.crop) {
        return fileInfo
      }
      info = fileInfo.originalImageInfo
      size = fitSize(this.settings.crop[0].preferedSize, [info.width, info.height], true)
      return applyCropCoordsToInfo(fileInfo, this.settings.crop[0], [info.width, info.height], {
        width: size[0],
        height: size[1],
        left: Math.round((info.width - size[0]) / 2),
        top: Math.round((info.height - size[1]) / 2)
      })
    })
  }

  __resolve () {
    return this.dfd.resolve(this.files.get())
  }

  __reject () {
    return this.dfd.reject(this.files.get())
  }

  __prepareTabs (tab) {
    var i, len, ref, tabName
    this.addTab('preview')
    ref = this.settings.tabs
    for (i = 0, len = ref.length; i < len; i++) {
      tabName = ref[i]
      this.addTab(tabName)
    }
    if (this.files.length()) {
      this.showTab('preview')
      this.switchTab('preview')
    } else {
      this.hideTab('preview')
      this.switchTab(tab || this.__firstVisibleTab())
    }
    if (this.settings.tabs.length === 0) {
      this.panel.addClass('uploadcare--panel_menu-hidden')
      return this.panel.find('.uploadcare--panel__menu').addClass('uploadcare--panel__menu_hidden')
    }
  }

  __prepareFooter () {
    var notDisabled
    this.footer = this.panel.find('.uploadcare--panel__footer')
    notDisabled = ':not(:disabled)'
    this.footer.on('click', '.uploadcare--panel__show-files' + notDisabled, () => {
      return this.switchTab('preview')
    })
    this.footer.on('click', '.uploadcare--panel__done' + notDisabled, this.__resolve)
    this.__updateFooter()
    this.files.onAdd.add(this.__updateFooter)
    return this.files.onRemove.add(this.__updateFooter)
  }

  __updateFooter () {
    var footer, tooFewFiles, tooManyFiles
    const files = this.files.length()
    tooManyFiles = files > this.settings.multipleMax
    tooFewFiles = files < this.settings.multipleMin
    this.footer.find('.uploadcare--panel__done').attr('disabled', tooManyFiles || tooFewFiles)
    this.footer.find('.uploadcare--panel__show-files').attr('disabled', files === 0)
    footer = tooManyFiles ? t('dialog.tabs.preview.multiple.tooManyFiles').replace('%max%', this.settings.multipleMax) : files && tooFewFiles ? t('dialog.tabs.preview.multiple.tooFewFiles').replace('%min%', this.settings.multipleMin) : t('dialog.tabs.preview.multiple.title')
    this.footer.find('.uploadcare--panel__message').toggleClass('uploadcare--panel__message_hidden', files === 0).toggleClass('uploadcare--error', tooManyFiles || tooFewFiles).text(footer.replace('%files%', t('file', files)))
    return this.footer.find('.uploadcare--panel__file-counter').toggleClass('uploadcare--error', tooManyFiles || tooFewFiles).text(files ? `(${files})` : '')
  }

  __closePanel () {
    this.panel.replaceWith(this.placeholder)
    return this.content.remove()
  }

  addTab (name) {
    var TabCls, tabButton, tabIcon, tabPanel
    if (name in this.tabs) {
      return
    }
    TabCls = registeredTabs[name]
    if (!TabCls) {
      throw new Error(`No such tab: ${name}`)
    }
    tabPanel = $('<div>').addClass('uploadcare--tab').addClass(`uploadcare--tab_name_${name}`).insertBefore(this.footer)
    if (name === 'preview') {
      tabIcon = $('<div class="uploadcare--menu__icon uploadcare--panel__icon">')
    } else {
      tabIcon = $(`<svg width='32' height='32'><use xlink:href='#uploadcare--icon-${name}'/></svg>`).attr('role', 'presentation').attr('class', 'uploadcare--icon uploadcare--menu__icon')
    }
    tabButton = $('<div>', {
      role: 'button',
      tabindex: '0'
    }).addClass('uploadcare--menu__item').addClass(`uploadcare--menu__item_tab_${name}`).attr('title', t(`dialog.tabs.names.${name}`)).append(tabIcon).appendTo(this.panel.find('.uploadcare--menu__items')).on('click', () => {
      if (name === this.currentTab) {
        return this.panel.find('.uploadcare--panel__menu').removeClass('uploadcare--menu_opened')
      } else {
        return this.switchTab(name)
      }
    })
    this.tabs[name] = new TabCls(tabPanel, tabButton, this.publicPromise(), this.settings, name)

    return this.tabs[name]
  }

  switchTab (tab) {
    var className
    if (!tab || this.currentTab === tab) {
      return
    }
    this.currentTab = tab
    this.panel.find('.uploadcare--panel__menu').removeClass('uploadcare--menu_opened').attr('data-current', tab)
    this.panel.find('.uploadcare--menu__item').removeClass('uploadcare--menu__item_current').filter(`.uploadcare--menu__item_tab_${tab}`).addClass('uploadcare--menu__item_current')
    className = 'uploadcare--tab'
    this.panel.find(`.${className}`).removeClass(`${className}_current`).filter(`.${className}_name_${tab}`).addClass(`${className}_current`)

    if (this.tabs[tab].displayed) {
      this.tabs[tab].displayed()
    }

    return this.dfd.notify(tab)
  }

  showTab (tab) {
    return this.onTabVisibility.fire(tab, true)
  }

  hideTab (tab) {
    this.onTabVisibility.fire(tab, false)
    if (this.currentTab === tab) {
      return this.switchTab(this.__firstVisibleTab())
    }
  }

  isTabVisible (tab) {
    return !this.panel.find(`.uploadcare--menu__item_tab_${tab}`).is('.uploadcare--menu__item_hidden')
  }

  openMenu () {
    return this.panel.find('.uploadcare--panel__menu').addClass('uploadcare--menu_opened')
  }

  __firstVisibleTab () {
    var i, len, ref, tab
    ref = this.settings.tabs
    for (i = 0, len = ref.length; i < len; i++) {
      tab = ref[i]
      if (this.isTabVisible(tab)) {
        return tab
      }
    }
  }

  __welcome () {
    var i, len, ref, tabName
    this.addTab('empty-pubkey')
    this.switchTab('empty-pubkey')
    ref = this.settings.tabs
    for (i = 0, len = ref.length; i < len; i++) {
      tabName = ref[i]
      this.__addFakeTab(tabName)
    }
    return null
  }

  __addFakeTab (name) {
    var tabIcon
    tabIcon = $(`<svg width='32' height='32'><use xlink:href='#uploadcare--icon-${name}'/></svg>`).attr('role', 'presentation').attr('class', 'uploadcare--icon uploadcare--menu__icon')
    if (name === 'empty-pubkey') {
      tabIcon.addClass('uploadcare--panel__icon')
    }
    return $('<div>').addClass('uploadcare--menu__item').addClass(`uploadcare--menu__item_tab_${name}`).attr('aria-disabled', true).attr('title', t(`dialog.tabs.names.${name}`)).append(tabIcon).appendTo(this.panel.find('.uploadcare--menu__items'))
  }
}

export {
  isDialogOpened,
  closeDialog,
  openDialog,
  openPreviewDialog,
  openPanel,
  registerTab
}

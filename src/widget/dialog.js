import { FileTab } from './tabs/file-tab'
import { UrlTab } from './tabs/url-tab'
import { CameraTab } from './tabs/camera-tab'
import { RemoteTab } from './tabs/remote-tab'
import { PreviewTab } from './tabs/preview-tab'
import { PreviewTabMultiple } from './tabs/preview-tab-multiple'

import { CollectionOfPromises } from '../utils/collection'
import {
  publicCallbacks,
  fitSize,
  applyCropCoordsToInfo,
  parseHTML,
  callbacks,
  isPlainObject,
  matches
} from '../utils'
import { build } from '../settings'
import locale from '../locale'
import { tpl } from '../templates'
import { filesFrom } from '../files'
import { FileGroup } from '../files/group-creator'
import { isFileGroup } from '../utils/groups'
import { isWindowDefined } from '../utils/is-window-defined'
import { html } from '../utils/html.ts'
import { welcomeContent } from '../templates/welcome-content'

const lockDialogFocus = function(e) {
  if (!e.shiftKey && focusableElements.last().is(e.target)) {
    e.preventDefault()
    return focusableElements.first().focus()
  } else if (e.shiftKey && focusableElements.first().is(e.target)) {
    e.preventDefault()
    return focusableElements.last().focus()
  }
}

const lockScroll = function(toTop) {
  const x = window.scrollX
  const y = window.scrollY
  if (toTop) {
    window.scrollTo(0, 0)
  }
  return function() {
    return window.scrollTo(x, y)
  }
}

isWindowDefined() &&
  window.addEventListener('keydown', e => {
    if (isDialogOpened()) {
      if (e.keyCode === 27) {
        // Escape
        // close only topmost dialog
        if (
          typeof currentDialogPr !== 'undefined' &&
          currentDialogPr !== null
        ) {
          currentDialogPr.reject()
        }
      }
      if (e.keyCode === 9) {
        // Tab
        return lockDialogFocus(e)
      }
    }
  })

let currentDialogPr = null
const openedClass = 'uploadcare--page'
let originalFocusedElement = null
let focusableElements = null

const isDialogOpened = function() {
  return currentDialogPr !== null
}

const closeDialog = function() {
  if (currentDialogPr) {
    currentDialogPr.reject()
    currentDialogPr = null
  }
}

const openDialog = function(files, tab, settings) {
  closeDialog()
  originalFocusedElement = document.activeElement

  const dialog = parseHTML(tpl('dialog'))
  document.body.appendChild(dialog)

  const dialogPr = openPanel(
    dialog.querySelector('.uploadcare--dialog__placeholder'),
    files,
    tab,
    settings
  )

  dialog.classList.add('uploadcare--dialog_status_active')
  dialog
    .querySelector('.uploadcare--panel')
    .classList.add('uploadcare--dialog__panel')

  dialogPr.dialogElement = dialog

  focusableElements = dialog.querySelectorAll(
    'select, input, textarea, button, a[href]'
  )
  focusableElements[0].focus()

  const cancelLock = lockScroll(dialog.style.position === 'absolute')

  document.documentElement.classList.add(openedClass)
  document.body.classList.add(openedClass)

  dialog
    .querySelector('.uploadcare--dialog__close')
    .addEventListener('click', dialogPr.reject)

  // dblclick
  // dialog.addEventListener('click', function(e) {

  //   var showStoppers = '.uploadcare--dialog__panel, .uploadcare--dialog__powered-by'
  //   if (
  //     $(e.target === showStoppers) ||
  //     $(e.target).parents(showStoppers).length
  //   ) {
  //     return
  //   }
  //   return dialogPr.reject()
  // })

  currentDialogPr = dialogPr

  dialogPr.always(function() {
    document.documentElement.classList.remove(openedClass)
    document.body.classList.remove(openedClass)

    currentDialogPr = null

    dialog.remove()
    cancelLock()

    return originalFocusedElement.focus()
  })

  return currentDialogPr
}

const openPreviewDialog = function(file, settings) {
  // hide current opened dialog and open new one
  const oldDialogPr = currentDialogPr
  currentDialogPr = null

  settings = Object.assign({}, settings, {
    multiple: false,
    tabs: ''
  })

  const dialog = openDialog(file, 'preview', settings)
  if (oldDialogPr != null) {
    oldDialogPr.dialogElement.classList.add(
      'uploadcare--dialog_status_inactive'
    )
  }

  dialog.always(function() {
    currentDialogPr = oldDialogPr
    if (oldDialogPr != null) {
      // still opened
      document.documentElement.classList.add(openedClass)
      document.body.classList.add(openedClass)

      return oldDialogPr.dialogElement.classList.remove(
        'uploadcare--dialog_status_inactive'
      )
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
const openPanel = function(placeholder, files, tab, settings) {
  if (isPlainObject(tab)) {
    settings = tab
    tab = null
  }

  if (!files) {
    files = []
  } else if (isFileGroup(files)) {
    files = files.files()
  } else if (!Array.isArray(files)) {
    files = [files]
  }

  settings = build(settings)

  return new Panel(settings, placeholder, files, tab).publicPromise()
}

const registeredTabs = {}
const registerTab = function(tabName, constructor) {
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
registerTab('empty-pubkey', function(tabPanel, _1, _2, settings) {
  return tabPanel.append(parseHTML(welcomeContent))
})

registerTab('preview', function(
  tabPanel,
  tabButton,
  dialogApi,
  settings,
  name
) {
  var tabCls
  if (!settings.previewStep && dialogApi.fileColl.length() === 0) {
    return
  }
  tabCls = settings.multiple ? PreviewTabMultiple : PreviewTab
  // eslint-disable-next-line new-cap
  return new tabCls(tabPanel, tabButton, dialogApi, settings, name)
})

class Panel {
  constructor(settings1, placeholder, files, tab) {
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

    this._resolveDfd = null
    this._rejectDfd = null

    this.progress = callbacks()
    this.dfd = new Promise((resolve, reject) => {
      this._resolveDfd = resolve
      this._rejectDfd = reject
    })

    this.dfd.finally(this.__closePanel)
    this.content = parseHTML(tpl('dialog__panel'))
    this.panel = this.content

    this.placeholder = placeholder
    this.placeholder.replaceWith(this.content)

    this.panel.appendChild(parseHTML(tpl('icons')))
    if (this.settings.multiple) {
      this.panel.classList.add('uploadcare--panel_multiple')
    }
    this.panel
      .querySelector('.uploadcare--menu__toggle')
      .addEventListener('click', () => {
        return this.panel
          .querySelector('.uploadcare--menu')
          .classList.toggle('uploadcare--menu_opened')
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
    this.onTabVisibility = callbacks().add((tab, show) => {
      return this.panel
        .querySelector(`.uploadcare--menu__item_tab_${tab}`)
        .classList.toggle('uploadcare--menu__item_hidden', !show)
    })
    if (this.settings.publicKey) {
      this.__prepareTabs(tab)
    } else {
      this.__welcome()
    }
  }

  publicPromise() {
    if (!this.promise) {
      const promise = this.dfd.then(files => {
        if (this.settings.multiple) {
          // return object not promise for
          // stop promise chain
          return { v: FileGroup(files, this.settings) }
        } else {
          return { v: files[0] }
        }
      })

      const then = promise.then.bind(promise)
      const always = promise.finally.bind(promise)

      this.promise = {
        always,
        then,
        done: then,
        progress: (...args) => this.progress.add(...args),

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
      }
    }

    return this.promise
  }

  addFiles(files, data) {
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

  __autoCrop(files) {
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
    return files.autoThen(fileInfo => {
      var info, size
      // .cdnUrlModifiers came from already cropped files
      // .crop came from autocrop even if autocrop do not set cdnUrlModifiers
      if (!fileInfo.isImage || fileInfo.cdnUrlModifiers || fileInfo.crop) {
        return fileInfo
      }
      info = fileInfo.originalImageInfo
      size = fitSize(
        this.settings.crop[0].preferedSize,
        [info.width, info.height],
        true
      )
      return applyCropCoordsToInfo(
        fileInfo,
        this.settings.crop[0],
        [info.width, info.height],
        {
          width: size[0],
          height: size[1],
          left: Math.round((info.width - size[0]) / 2),
          top: Math.round((info.height - size[1]) / 2)
        }
      )
    })
  }

  __resolve() {
    return this._resolveDfd(this.files.get())
  }

  __reject() {
    return this._rejectDfd(this.files.get())
  }

  __prepareTabs(tab) {
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
      this.panel.classList.add('uploadcare--panel_menu-hidden')
      return this.panel
        .querySelector('.uploadcare--panel__menu')
        .classList.add('uploadcare--panel__menu_hidden')
    }
  }

  __prepareFooter() {
    this.footer = this.panel.querySelector('.uploadcare--panel__footer')
    this.footer.addEventListener('click', e => {
      if (matches(e.target, '.uploadcare--panel__show-files:not(:disabled)')) {
        this.switchTab('preview')
      }
    })

    this.footer.addEventListener('click', e => {
      if (matches(e.target, '.uploadcare--panel__done:not(:disabled)')) {
        this.__resolve()
      }
    })

    this.__updateFooter()

    this.files.onAdd.add(this.__updateFooter)
    this.files.onRemove.add(this.__updateFooter)
  }

  __updateFooter() {
    const files = this.files.length()
    const tooManyFiles = files > this.settings.multipleMax
    const tooFewFiles = files < this.settings.multipleMin

    const done = this.footer.querySelector('.uploadcare--panel__done')
    done.setAttribute('disabled', tooManyFiles || tooFewFiles)
    done.setAttribute('aria-disabled', tooManyFiles || tooFewFiles)

    const showFiles = this.footer.querySelector(
      '.uploadcare--panel__show-files'
    )
    showFiles.setAttribute('disabled', files === 0)
    showFiles.setAttribute('aria-disabled', files === 0)

    const footer = tooManyFiles
      ? locale
          .t('dialog.tabs.preview.multiple.tooManyFiles')
          .replace('%max%', this.settings.multipleMax)
      : files && tooFewFiles
      ? locale
          .t('dialog.tabs.preview.multiple.tooFewFiles')
          .replace('%min%', this.settings.multipleMin)
      : locale.t('dialog.tabs.preview.multiple.title')

    const message = this.footer.querySelector('.uploadcare--panel__message')
    message.classList.toggle('uploadcare--panel__message_hidden', files === 0)
    message.classList.toggle('uploadcare--error', tooManyFiles || tooFewFiles)
    message.textContent = footer.replace('%files%', locale.t('file', files))

    const fileCounter = this.footer.querySelector(
      '.uploadcare--panel__file-counter'
    )
    fileCounter.classList.toggle(
      'uploadcare--error',
      tooManyFiles || tooFewFiles
    )
    fileCounter.textContent = files ? `(${files})` : ''
  }

  __closePanel() {
    this.progress.remove()
    this.panel.replaceWith(this.placeholder)
    return this.content.remove()
  }

  addTab(name) {
    if (name in this.tabs) {
      return
    }
    const TabCls = registeredTabs[name]
    if (!TabCls) {
      throw new Error(`No such tab: ${name}`)
    }
    const tabPanel = parseHTML(html`
      <div class="uploadcare--tab uploadcare--tab_name_${name}"></div>
    `)

    this.footer.parentNode.insertBefore(tabPanel, this.footer)

    const tabIcon =
      name === 'preview'
        ? html`
            <div
              class="uploadcare--menu__icon uploadcare--panel__icon"
              role="progressbar"
              aria-valuenow="0"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          `
        : html`
            <svg
              width="32"
              height="32"
              role="presentation"
              class="uploadcare--icon uploadcare--menu__icon"
            >
              <use xlink:href="#uploadcare--icon-${name}" />
            </svg>
          `

    const tabButton = parseHTML(html`
      <div
        role="button"
        tabindex="0"
        class="uploadcare--menu__item uploadcare--menu__item_tab_${name}"
        title="${locale.t(`dialog.tabs.names.${name}`)}"
      >
        ${tabIcon}
      </div>
    `)

    this.panel.querySelector('.uploadcare--menu__items').appendChild(tabButton)
    tabButton.addEventListener('click', () => {
      if (name === this.currentTab) {
        return this.panel
          .querySelector('.uploadcare--panel__menu')
          .classList.add('uploadcare--menu_opened')
      } else {
        return this.switchTab(name)
      }
    })

    this.tabs[name] = new TabCls(
      tabPanel,
      tabButton,
      this.publicPromise(),
      this.settings,
      name
    )

    return this.tabs[name]
  }

  switchTab(tab) {
    if (!tab || this.currentTab === tab) {
      return
    }
    this.currentTab = tab

    const panelMenu = this.panel.querySelector('.uploadcare--panel__menu')
    panelMenu.classList.remove('uploadcare--menu_opened')
    panelMenu.setAttribute('data-current', tab)

    const currentItem = this.panel.querySelector(
      '.uploadcare--menu__item_current'
    )

    currentItem &&
      currentItem.classList.remove('uploadcare--menu__item_current')

    this.panel
      .querySelector(`.uploadcare--menu__item_tab_${tab}`)
      .classList.add('uploadcare--menu__item_current')

    const currentTab = this.panel.querySelector(`.uploadcare--tab_current`)
    currentTab && currentTab.classList.remove(`uploadcare--tab_current`)

    const tabNode = this.panel.querySelector(`.uploadcare--tab_name_${tab}`)
    tabNode && tabNode.classList.add(`uploadcare--tab_current`)

    if (this.tabs[tab].displayed) {
      this.tabs[tab].displayed()
    }

    this.progress.fire(tab)
  }

  showTab(tab) {
    return this.onTabVisibility.fire(tab, true)
  }

  hideTab(tab) {
    this.onTabVisibility.fire(tab, false)
    if (this.currentTab === tab) {
      return this.switchTab(this.__firstVisibleTab())
    }
  }

  isTabVisible(tab) {
    return !matches(
      this.panel.querySelector(`.uploadcare--menu__item_tab_${tab}`),
      '.uploadcare--panel__show-files:not(:disabled)'
    )
  }

  openMenu() {
    return this.panel
      .querySelector('.uploadcare--panel__menu')
      .classList.add('uploadcare--menu_opened')
  }

  __firstVisibleTab() {
    var i, len, ref, tab
    ref = this.settings.tabs
    for (i = 0, len = ref.length; i < len; i++) {
      tab = ref[i]
      if (this.isTabVisible(tab)) {
        return tab
      }
    }
  }

  __welcome() {
    this.addTab('empty-pubkey')
    this.switchTab('empty-pubkey')

    for (let i = 0, len = this.settings.tabs.length; i < len; i++) {
      this.__addFakeTab(this.settings.tabs[i])
    }
  }

  __addFakeTab(name) {
    const fakeTab = parseHTML(html`
      <div
        class="uploadcare--menu__item uploadcare--menu__item_tab_${name}"
        aria-disabled="true"
        title="${locale.t(`dialog.tabs.names.${name}`)}"
      >
        <svg
          width="32"
          height="32"
          role="presentation"
          class="uploadcare--icon uploadcare--menu__icon ${name ===
            'empty-pubkey' && 'uploadcare--panel__icon'}"
        >
          <use xlink:href="#uploadcare--icon-${name}" />
        </svg>
      </div>
    `)

    this.panel.querySelector('.uploadcare--menu__items').appendChild(fakeTab)
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

import uploadcare from '../namespace'
import { defer } from '../utils'

const {
  jQuery: $
} = uploadcare

const fakeButtons = ['.uploadcare--menu__item', '.uploadcare--file__description', '.uploadcare--crop-sizes__item'].join(', ')

const mouseFocusedClass = 'uploadcare--mouse-focused'

$(document.documentElement).on('mousedown', fakeButtons, function (e) {
  // http://wd.dizaina.net/internet-maintenance/on-outlines/
  return defer(function () {
    var activeElement
    activeElement = document.activeElement
    if (activeElement && activeElement !== document.body) {
      return $(activeElement).addClass(mouseFocusedClass).one('blur', function () {
        return $(activeElement).removeClass(mouseFocusedClass)
      })
    }
  })
}).on('keypress', fakeButtons, function (e) {
  // 13 = Return, 32 = Space
  if (e.which === 13 || e.which === 32) {
    $(this).click()
    e.preventDefault()
    return e.stopPropagation()
  }
})

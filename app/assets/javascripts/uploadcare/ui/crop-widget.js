import uploadcare from '../namespace'

const {
  jQuery: $,
  utils
} = uploadcare

uploadcare.namespace('crop', function (ns) {
  ns.CropWidget = (function () {
    var cropModifierRegExp

    class CropWidget {
      constructor (element, originalSize, crop = {}) {
        this.element = element
        this.originalSize = originalSize
        this.__api = $.Jcrop(this.element[0], {
          trueSize: this.originalSize,
          baseClass: 'uploadcare--jcrop',
          addClass: 'uploadcare--crop-widget',
          createHandles: ['nw', 'ne', 'se', 'sw'],
          bgColor: 'transparent',
          bgOpacity: 0.8
        })
        this.setCrop(crop)
        this.setSelection()
      }

      //   downscale:
      // If set to `true` "-/resize/%preferedSize%/" will be added
      // if selected area bigger than `preferedSize`. Default false.

      //   upscale:
      // If set to `true` "-/resize/%preferedSize%/" will be added
      // if selected area smaller than `preferedSize`. Default false.

      //   notLess:
      // Restrict selection to preferedSize area. Default false.

      //   preferedSize:
      // Defines image size you want to get at the end.
      // If `downscale` option is set to `false`, it defines only
      // the prefered aspect ratio.
      // If set to `null` any aspect ratio will be acceptable.
      // Array: [123, 123]. (optional)
      setCrop (crop) {
        this.crop = crop

        return this.__api.setOptions({
          aspectRatio: crop.preferedSize ? crop.preferedSize[0] / crop.preferedSize[1] : 0,
          minSize: crop.notLess ? utils.fitSize(crop.preferedSize, this.originalSize) : [0, 0]
        })
      }

      setSelection (selection) {
        var center, left, size, top
        if (selection) {
          center = selection.center
          size = [selection.width, selection.height]
        } else {
          center = true
          size = this.originalSize
        }
        if (this.crop.preferedSize) {
          size = utils.fitSize(this.crop.preferedSize, size, true)
        }
        if (center) {
          left = (this.originalSize[0] - size[0]) / 2
          top = (this.originalSize[1] - size[1]) / 2
        } else {
          left = selection.left || 0
          top = selection.top || 0
        }
        return this.__api.setSelect([left, top, size[0] + left, size[1] + top])
      }

      __parseModifiers (modifiers) {
        var raw = modifiers != null ? modifiers.match(cropModifierRegExp) : undefined
        if (raw) {
          return {
            width: parseInt(raw[1], 10),
            height: parseInt(raw[2], 10),
            center: raw[4] === 'center',
            left: parseInt(raw[5], 10) || undefined,
            top: parseInt(raw[6], 10) || undefined
          }
        }
      }

      setSelectionFromModifiers (modifiers) {
        return this.setSelection(this.__parseModifiers(modifiers))
      }

      getSelection () {
        var coords, left, top
        coords = this.__api.tellSelect()
        left = Math.round(Math.max(0, coords.x))
        top = Math.round(Math.max(0, coords.y))
        return {
          left: left,
          top: top,
          width: Math.round(Math.min(this.originalSize[0], coords.x2)) - left,
          height: Math.round(Math.min(this.originalSize[1], coords.y2)) - top
        }
      }

      applySelectionToFile (file) {
        return file.then((info) => {
          return utils.applyCropCoordsToInfo(info, this.crop, this.originalSize, this.getSelection())
        })
      }
    };

    cropModifierRegExp = /-\/crop\/([0-9]+)x([0-9]+)(\/(center|([0-9]+),([0-9]+)))?\//i

    return CropWidget
  }.call(this))
})

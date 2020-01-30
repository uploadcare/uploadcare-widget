// import { fileFrom } from '../files'

// Check if given obj is file API promise (aka File object)
import WidgetFile from '../file'

const isFile = function(obj) {
  return obj && obj.done && obj.fail && obj.cancel
}

// Converts user-given value to File object.
const valueToFile = function(value, settings) {
  if (value && !isFile(value)) {
    value = new WidgetFile(value, settings)
  }
  return value || null
}

export { isFile, valueToFile }

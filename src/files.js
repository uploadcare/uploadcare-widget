import WidgetFile from './file'

const fileFrom = function(type, data, s) {
  return new WidgetFile([data], s)
}

export { fileFrom }

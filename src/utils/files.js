import $ from 'jquery'

import uploadcare from '../namespace'
import { wrapToPromise } from '../utils'
import { fileFrom } from '../files'

// Check if given obj is file API promise (aka File object)
const isFile = function (obj) {
  return obj && obj.done && obj.fail && obj.cancel
}

// Converts user-given value to File object.
const valueToFile = function (value, settings) {
  if (value && !isFile(value)) {
    value = fileFrom('uploaded', value, settings)
  }
  return value || null
}

const isFileGroup = function (obj) {
  return obj && obj.files && obj.promise
}

// Converts user-given value to FileGroup object.
const valueToGroup = function (value, settings) {
  var files, item
  if (value) {
    if ($.isArray(value)) {
      files = (function () {
        var j, len, results
        results = []
        for (j = 0, len = value.length; j < len; j++) {
          item = value[j]
          results.push(valueToFile(item, settings))
        }
        return results
      })()
      value = uploadcare.FileGroup(files, settings)
    } else {
      if (!isFileGroup(value)) {
        return uploadcare.loadFileGroup(value, settings)
      }
    }
  }
  return wrapToPromise(value || null)
}

// check if two groups contains same files in same order
const isFileGroupsEqual = function (group1, group2) {
  var file, files1, files2, i, j, len
  if (group1 === group2) {
    return true
  }
  if (!(isFileGroup(group1) && isFileGroup(group2))) {
    return false
  }
  files1 = group1.files()
  files2 = group2.files()
  if (files1.length !== files2.length) {
    return false
  }
  for (i = j = 0, len = files1.length; j < len; i = ++j) {
    file = files1[i]
    if (file !== files2[i]) {
      return false
    }
  }
  return true
}

export { isFile, valueToFile, isFileGroup, valueToGroup, isFileGroupsEqual }

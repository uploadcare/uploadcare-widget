// import $ from 'jquery'

// import { wrapToPromise } from '../utils'
// import { valueToFile } from './files'
import { groupInfo, uploadFileGroup } from '@uploadcare/upload-client'
import { UploadcareGroup } from '@uploadcare/upload-client/lib/tools/UploadcareGroup'
import { UploadcareFile } from '@uploadcare/upload-client/lib/tools/UploadcareFile'
// import { loadFileGroup, FileGroup } from '../files/group-creator'

const isFileGroup = function(obj) {
  return obj && obj.files
}

// Converts user-given value to FileGroup object.
const valueToGroup = function(value, settings) {
  let group

  if (Array.isArray(value)) {
    group = uploadFileGroup(value, settings)
  } else {
    group = groupInfo(value, settings).then(groupInfo => {
      const files = groupInfo.files.map(file => new UploadcareFile(file, {}))

      return new UploadcareGroup(groupInfo, files)
    })
  }

  return group
  //
  // var files, item
  // if (value) {
  //   if ($.isArray(value)) {
  //     files = (function() {
  //       var j, len, results
  //       results = []
  //       for (j = 0, len = value.length; j < len; j++) {
  //         item = value[j]
  //         results.push(valueToFile(item, settings))
  //       }
  //       return results
  //     })()
  //     value = FileGroup(files, settings)
  //   } else {
  //     if (!isFileGroup(value)) {
  //       return loadFileGroup(value, settings)
  //     }
  //   }
  // }
  // return wrapToPromise(value || null)
}

// check if two groups contains same files in same order
const isFileGroupsEqual = function(group1, group2) {
  var file, files1, files2, i, j, len
  if (group1 === group2) {
    return true
  }
  if (!(isFileGroup(group1) && isFileGroup(group2))) {
    return false
  }
  files1 = group1.files
  files2 = group2.files
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

export { isFileGroup, valueToGroup, isFileGroupsEqual }

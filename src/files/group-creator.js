import $ from 'jquery'

import { log } from '../utils/warnings'
import { groupIdRegex, jsonp } from '../utils'
import { build } from '../settings'
import { isFile } from '../utils/files'
import { isFileGroup } from '../utils/groups'
import { FileGroup as FileGroupClass, SavedFileGroup } from './group'

// root
const FileGroup = function (filesAndGroups = [], settings) {
  var file, files, item, j, k, len, len1, ref
  files = []
  for (j = 0, len = filesAndGroups.length; j < len; j++) {
    item = filesAndGroups[j]
    if (isFile(item)) {
      files.push(item)
    } else if (isFileGroup(item)) {
      ref = item.files()
      for (k = 0, len1 = ref.length; k < len1; k++) {
        file = ref[k]
        files.push(file)
      }
    }
  }
  return new FileGroupClass(files, settings).api()
}

const loadFileGroup = function (groupIdOrUrl, settings) {
  var df, id
  settings = build(settings)
  df = $.Deferred()
  id = groupIdRegex.exec(groupIdOrUrl)
  if (id) {
    jsonp(`${settings.urlBase}/group/info/`, 'GET', {
      jsonerrors: 1,
      pub_key: settings.publicKey,
      group_id: id[0]
    }, {
      headers: {
        'X-UC-User-Agent': settings._userAgent
      }
    }).fail((reason) => {
      if (settings.debugUploads) {
        log("Can't load group info. Probably removed.", id[0], settings.publicKey, reason)
      }
      return df.reject()
    }).done(function (data) {
      var group
      group = new SavedFileGroup(data, settings)
      return df.resolve(group.api())
    })
  } else {
    df.reject()
  }
  return df.promise()
}

export { FileGroup, loadFileGroup }

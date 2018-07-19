/* @flow */

import {UploadcareError} from './UploadcareError'

export class SettingsError<T> extends UploadcareError {
  returnValue: T

  constructor(message: string, returnValue: T) {
    super(message)

    this.returnValue = returnValue
  }
}

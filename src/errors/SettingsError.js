/* @flow */

import {UploadcareError} from './UploadcareError'

export class SettingsError extends UploadcareError {
  returnValue: any

  constructor(message: string, returnValue: any) {
    super(message)

    this.returnValue = returnValue
  }
}

/* @flow */

export class UploadcareError extends Error {
  constructor(message: string) {
    super(message)
    this.name = `Uc${this.constructor.name}`
    Error.captureStackTrace(this, this.constructor)
  }
}

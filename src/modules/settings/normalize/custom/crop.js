/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'
import type {CropSettings} from '../../flow-typed/Settings'

import {boolean} from '../cast'

export const crop: ValueTransformer<Array<CropSettings> | false> = (value: any) => {
  if (Array.isArray(value) || value === false) {
    return value
  }

  if (!boolean(value)) {
    return false
  }

  let cropStr = value.toString()

  return cropStr.split(',').map(crop => {
    const reRatio = /^([0-9]+)([x:])([0-9]+)\s*(|upscale|minimum)$/i
    const ratio = reRatio.exec(crop.trim().toLowerCase()) || []

    return {
      downscale: ratio[2] === 'x',
      upscale: !!ratio[4],
      notLess: ratio[4] === 'minimum',
      preferedSize: ratio.length ? [+ratio[1], +ratio[3]] : null,
    }
  })
}

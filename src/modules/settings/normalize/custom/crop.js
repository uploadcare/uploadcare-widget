/* @flow */

import {boolean} from '../cast'
import {SettingsError} from 'errors/SettingsError'

import type {ValueTransformer} from '../flow-typed/ValueTransformer'
import type {Settings} from '../../flow-typed/Settings'

export const crop: ValueTransformer<mixed, $PropertyType<Settings, 'crop'>> = (value: mixed) => {
  if (!boolean(value)) {
    return false
  }

  if (typeof value !== 'string') {
    throw new SettingsError('Not a string', null)
  }

  return value.split(',').map((crop: string) => {
    const normalized = crop.trim().toLowerCase()
    const reRatio = /^([0-9]+)([x:])([0-9]+)\s*(|upscale|minimum)$/i
    const ratio = reRatio.exec(normalized) || []

    if (!ratio.length && !['free', ''].includes(normalized)) {
      throw new SettingsError('Wrong format', 'free')
    }

    return {
      downscale: ratio[2] === 'x',
      upscale: !!ratio[4],
      notLess: ratio[4] === 'minimum',
      preferedSize: ratio.length ? [+ratio[1], +ratio[3]] : null,
    }
  })
}

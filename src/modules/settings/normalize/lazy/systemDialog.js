/* @flow */

import type {ValueTransformer} from '../flow-typed/ValueTransformer'

// TODO: implement abilities
const abilities = {sendFileAPI: true}

export const systemDialog: ValueTransformer<boolean, boolean> = (value: boolean) =>
  abilities.sendFileAPI ? value : false

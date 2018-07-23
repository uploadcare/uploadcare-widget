/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Icon.css'
import * as Icons from './icons/index'

import type {Props} from './flow-typed'

/**
 * Convert kebab-case to UpperCamelCase.
 * @param {string} key
 * @return {string}
 */
const kebab2upperCamelCase = (key: string): string => key.split('-')
  .map(item => item.replace(/^\w/, character => character.toUpperCase()))
  .join('')

export const Icon = ({className, name}: Props) => {
  const IconComponent = Icons[`Icon${kebab2upperCamelCase(name)}`]

  return <IconComponent className={cn(styles.icon, className)} />
}

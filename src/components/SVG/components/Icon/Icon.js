/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Icon.css'
import * as Icons from './icons/index'
import {kebab2upperCamelCase} from '../../../../helpers/case'

import type {Props} from './flow-typed'

export const Icon = ({className, name}: Props) => {
  const IconComponent = Icons[`Icon${kebab2upperCamelCase(name)}`]

  return <IconComponent className={cn(styles.icon, className)} />
}

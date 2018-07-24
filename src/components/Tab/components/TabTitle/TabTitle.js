/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './TabTitle.css'

import {Text} from '../../../Text/Text'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const TabTitle = ({className}: Props, children: Array<Children>) => (
  <Text
    className={cn(styles.tab__title, className)}
    size='large'>
    {children}
  </Text>
)

/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Preview.css'

import type {Props} from './flow-typed'

export const Preview = ({className}: Props) => (
  <div class={cn(styles.preview__content, className)}>
  </div>
)

/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './FileSources.css'

import type {Props} from './flow-typed'

export const FileSources = ({className}: Props, children) => (
  <div className={cn(styles['file-sources'], className)}>
    {children}
  </div>
)

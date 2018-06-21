/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './FileSource.css'

import type {Props} from './flow-typed'

export const FileSource = ({className}: Props, children) => (
  <div className={cn(styles['file-source'], className)}>
    {children}
  </div>
)

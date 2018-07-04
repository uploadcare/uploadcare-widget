/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Media.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const Media = ({className}: Props, children: Array<Children>) => (
  <div className={cn(styles.media, className)}>
    {children}
  </div>
)

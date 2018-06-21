/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Camera.css'

import type {Props} from './flow-typed'

export const Camera = ({className}: Props, children) => (
  <div className={cn(styles.camera, className)}>
    {children}
  </div>
)

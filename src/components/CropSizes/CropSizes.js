/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './CropSizes.css'

import type {Props} from './flow-typed'

export const CropSizes = ({className}: Props, children: Children) => (
  <div class={cn(styles['crop-sizes'], className)}>
    {children}
  </div>
)

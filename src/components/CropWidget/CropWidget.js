/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './CropWidget.css'

import type {Props} from './flow-typed'

export const CropWidget = ({className}: Props, children: Children) => (
  <div className={cn(styles['crop-widget'], className)}>
    {children}
  </div>
)

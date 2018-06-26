/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './WidgetFileName.css'

import type {Props} from './flow-typed'

import {LinkDiv} from '../../../Link/Link'

export const WidgetFileName = ({className, name, size}: Props) => (
  <div class={className}>
    <LinkDiv className={cn(
      styles['widget__file-name'],
    )}>
      {name}
    </LinkDiv>
    <div class={styles['widget__file-size']}>{size}</div>
  </div>
)

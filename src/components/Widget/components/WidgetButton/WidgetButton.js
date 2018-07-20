/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './WidgetButton.css'

import type {Children} from 'hyperapp'
import type {Props} from './flow-typed'

export const WidgetButton = ({className, type}: Props, children: Array<Children>) => (
  <button
    type='button'
    class={cn(
      styles.widget__button,
      styles[`widget__button_type_${type}`],
      className,
    )}>
    {children}
  </button>
)

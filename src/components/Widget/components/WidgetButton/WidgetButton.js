/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './WidgetButton.css'

import type {Props} from './flow-typed'

export const WidgetButton = ({className, name, caption}: Props) => (
  <button
    type='button'
    class={cn(
      styles.widget__button,
      styles[`widget__button_type_${name}`],
      className,
    )}>
    {caption}
  </button>
)

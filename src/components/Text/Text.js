/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Text.css'

import type {Props} from './flow-typed'

export const Text = ({className, isMuted, isPre, size}: Props, children: Children) => (
  <div className={cn(
    styles.text,
    isMuted && styles.text_muted,
    isPre && styles.text_pre,
    size && size === 'small' && styles.text_size_small,
    size && size === 'medium' && styles.text_size_medium,
    size && size === 'large' && styles.text_size_large,
    size && size === 'extra' && styles['text_size_extra-large'],
    className
  )}>
    {children}
  </div>
)

/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Button.css'
import {Icon} from '../SVG/components/Icon/Icon'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

/* eslint-disable max-len*/
export const Button = (
  {className, isFake = false, withIcon, isMuted = false, isOverlay = false, isPrimary = false, size, title, type = 'button', caption}: Props,
  children: Array<Children>
) => (isFake
  ? <div
    role='button'
    tabIndex='0'
    className={cn(
      styles.button,
      withIcon && styles.button_icon,
      className,
    )}
    data-caption={caption}>
    {children}
  </div>
  : <button
    className={cn(
      styles.button,
      withIcon && styles.button_icon,
      isMuted && styles.button_muted,
      isOverlay && styles.button_overlay,
      isPrimary && styles.button_primary,
      size && size === 'big' && styles.button_size_big,
      size && size === 'small' && styles.button_size_small,
      className
    )}
    type={type}
    title={title}>{
      withIcon
        ? (<Icon name={withIcon}/>)
        : children
    }</button>
)

/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Button.css'
import {Icon} from '../SVG/components/Icon/Icon'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const Button = (props: Props, children: Array<Children>) => {
  const {
    className,
    withIcon,
    isMuted,
    isOverlay,
    isPrimary,
    size,
    title,
    type = 'button',
  } = props

  return (
    <button
      class={cn(
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
          ? (<Icon name={withIcon} />)
          : children
      }</button>
  )
}

export const ButtonDiv = (props: {
  className?: string,
  withIcon?: boolean,
  caption?: string,
}, children: Array<Children>) => (
  <div
    role='button'
    tabIndex='0'
    className={cn(
      styles.button,
      props.withIcon && styles.button_icon,
      props.className,
    )}
    data-caption={props.caption}>
    {children}
  </div>
)

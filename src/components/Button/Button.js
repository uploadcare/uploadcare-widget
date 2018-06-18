/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Button.css'

type Props = {
  className?: string,
  icon?: string,
  isMuted?: boolean,
  isOverlay?: boolean,
  isPrimary?: boolean,
  size?: string,
  children?: string,
}

export const Button = ({className, icon, isMuted, isOverlay, isPrimary, size}: Props, children) => (
  <button
    class={cn(
      styles.button,
      isMuted && styles.button_muted,
      isOverlay && styles.button_overlay,
      isPrimary && styles.button_primary,
      size && size === 'big' && styles.button_size_big,
      size && size === 'small' && styles.button_size_small,
      className
    )}
    type='button'>{icon}{children}</button>
)

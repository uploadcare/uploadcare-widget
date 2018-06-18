/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Text.css'

type Props = {
  className?: string,
  isMuted?: boolean,
  isPre?: boolean,
  size?: string,
}

export const Text = ({className, isMuted, isPre, size}: Props, children) => (
  <div class={cn(
    styles.text,
    isMuted && styles.text_muted,
    isPre && styles.text_pre,
    size && size === 'small' && styles.text_size_small,
    size && size === 'medium' && styles.text_size_medium,
    size && size === 'large' && styles.text_size_large,
    size && size === 'extra-large' && styles.text_size_xlarge,
    className
  )}>{children}</div>
)

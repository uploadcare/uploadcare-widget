/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Media.css'

type Props = {
  className?: string,
}

export const Media = ({className}: Props, children) => (
  <div class={cn(
    styles.media,
    className
  )}>{children}</div>
)

export const Video = ({className}: Props) => (
  <video
    muted
    class={cn(
      styles.media__video,
      className
    )}></video>
)

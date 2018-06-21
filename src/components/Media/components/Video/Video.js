/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Video.css'

import type {Props} from './flow-typed'

export const Video = ({className}: Props) => (
  <video
    controls
    class={cn(styles.media__video, className)} />
)

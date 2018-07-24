/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Image.css'

import type {Props} from './flow-typed'

export const Image = ({src, title, alt, className}: Props) => (
  <img
    class={cn(styles.media__image, className)}
    src={src}
    title={title}
    alt={alt} />
)

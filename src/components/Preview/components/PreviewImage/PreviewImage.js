/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import styles from './PreviewImage.css'

import {Media} from '../../../Media/Media'
import {Image} from '../../../Media/components/Image/Image'

import type {Props} from './flow-typed'

export const PreviewImage = ({src, title, alt}: Props) => (
  <Media>
    <Image
      className={styles.preview__image}
      src={src}
      title={title}
      alt={alt} />
  </Media>
)

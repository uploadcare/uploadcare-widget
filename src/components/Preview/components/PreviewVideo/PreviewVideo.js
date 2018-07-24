/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import styles from './PreviewVideo.css'

import {Media} from '../../../Media/Media'
import {Video} from '../../../Media/components/Video/Video'

import type {Props} from './flow-typed'

export const PreviewVideo = ({}: Props) => (
  <Media>
    <Video className={styles.preview__video} />
  </Media>
)

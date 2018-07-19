/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import {WidgetText} from '../WidgetText/WidgetText'
import styles from './WidgetFile.css'

import type {Props} from './flow-typed'

export const WidgetFile = ({name, size}: Props) => (
  <WidgetText>
    <span class={styles['widget__file-name']}>
      {name}
    </span>
    <span class={styles['widget__file-size']}>{size}</span>
  </WidgetText>
)

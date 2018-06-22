/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Widget.css'

import {translate} from '../../helpers'

import type {Props} from './flow-typed'

export const Widget = ({className}: Props) => (
  <div className={cn(styles.widget, className)}>
    <div class={styles['widget__dragndrop-area']}>
      {translate('draghere')}
    </div>
    <div class={styles.widget__progress} />
    <div class={styles.widget__text} />
  </div>
)

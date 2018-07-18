/* @jsx h */
import {h} from 'hyperapp'
import styles from './WidgetText.css'

export const WidgetText = ({}, children) => (
  <div class={styles.widget__text}>{children}</div>
)

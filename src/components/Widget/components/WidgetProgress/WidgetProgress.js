/* @jsx h */
import {h} from 'hyperapp'
import styles from './WidgetProgress.css'

export const WidgetProgress = ({value}) => (
  <div class={styles.widget__progress}>{value}</div>
)

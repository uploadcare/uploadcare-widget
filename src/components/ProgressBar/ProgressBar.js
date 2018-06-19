/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './ProgressBar.css'

type Props = {
  className?: string,
}

export const ProgressBar = ({className}: Props, children) => (
  <div className={cn(styles.progressbar, className)}>
    <div className={styles.progressbar__value}>{children}</div>
  </div>
)

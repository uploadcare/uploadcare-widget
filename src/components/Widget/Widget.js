/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Widget.css'

type Props = {
  className?: string,
}

export const Widget = ({className}: Props, children) => (
  <div className={cn(styles.widget, className)}>
    {children}
  </div>
)

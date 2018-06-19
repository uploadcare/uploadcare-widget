/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Tab.css'

type Props = {
  className?: string,
}

export const Tab = ({className}: Props, children) => (
  <div className={cn(styles.tab, className)}>

  </div>
)

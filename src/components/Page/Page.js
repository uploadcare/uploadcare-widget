/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Page.css'

type Props = {
  className?: string,
}

export const Page = ({className}: Props, children) => (
  <div class={cn(styles.page, className)}>
    {children}
  </div>
)


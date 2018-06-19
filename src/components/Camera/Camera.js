/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Camera.css'

type Props = {
  className?: string,
}

export const Camera = ({className}: Props, children) => (
  <div className={cn(styles.camera, className)}>
    {children}
  </div>
)


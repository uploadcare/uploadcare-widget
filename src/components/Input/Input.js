import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Input.pcss'

export const Input = ({className}) => (
  <input className={cn(styles.input, className)} />
)

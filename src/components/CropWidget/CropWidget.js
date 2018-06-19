/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './CropWidget.css'

type Props = {
  className?: string,
}

export const CropWidget = ({className}: Props, children) => (
  <div className={cn(styles['crop-widget'], className)}>
    {children}
  </div>
)


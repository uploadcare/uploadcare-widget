/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Footer.css'
import {Button} from '../Button/Button'

import type {ButtonProps} from '../Button/Button'

type Props = {
  className?: string,
}

export const Footer = ({className}: Props, children) => (
  <div class={cn(styles.footer, className)}>
    {children}
  </div>
)

export const FooterButton = (props: ButtonProps, children) =>
  <Button className={cn(styles.footer__button, props.className)} {...props}>{children}</Button>

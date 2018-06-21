/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './FooterButton.css'
import {Button} from '../../../Button/Button'

import type {Props} from './flow-typed'

export const FooterButton = (props: Props, children) =>
  <Button className={cn(styles.footer__button, props.className)} {...props}>{children}</Button>

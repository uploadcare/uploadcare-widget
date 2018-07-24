/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './PreviewMessage.css'

import {FooterAdditions} from '../../../Footer/components/FooterAdditions/FooterAdditions'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const PreviewMessage = ({className}: Props, children: Array<Children>) => (
  <FooterAdditions
    className={cn(styles.preview__message, className)}>
    {children}
  </FooterAdditions>
)

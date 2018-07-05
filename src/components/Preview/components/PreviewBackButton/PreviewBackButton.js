/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './PreviewBackButton.css'

import {FooterButton} from '../../../Footer/components/FooterButton/FooterButton'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const PreviewBackButton = ({className}: Props, children: Array<Children>) => (
  <FooterButton
    className={cn(styles.preview__back, className)}>
    {children}
  </FooterButton>
)

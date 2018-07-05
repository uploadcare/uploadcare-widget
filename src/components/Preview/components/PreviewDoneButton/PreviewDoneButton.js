/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './PreviewDoneButton.css'

import {FooterButton} from '../../../Footer/components/FooterButton/FooterButton'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const PreviewDoneButton = ({className}: Props, children: Array<Children>) => (
  <FooterButton
    isPrimary
    className={cn(styles.preview__done, className)}>
    {children}
  </FooterButton>
)

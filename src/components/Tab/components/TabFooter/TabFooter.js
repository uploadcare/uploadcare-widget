/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './TabFooter.css'

import {Footer} from '../../../Footer/Footer'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const TabFooter = ({className}: Props, children: Array<Children>) => (
  <Footer className={cn(styles.tab__footer, className)}>
    {children}
  </Footer>
)

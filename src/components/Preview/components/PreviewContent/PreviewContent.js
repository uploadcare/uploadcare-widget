/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './PreviewContent.css'

import {TabContent} from '../../../Tab/components/TabContent/TabContent'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const PreviewContent = ({className}: Props, children: Array<Children>) => (
  <TabContent className={cn(styles.preview__content, className)}>
    {children}
  </TabContent>
)

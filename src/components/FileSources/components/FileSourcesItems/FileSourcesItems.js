/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './FileSourcesItems.css'

import type {Props} from './flow-typed'

export const FileSourcesItems = ({className}: Props, children: Children) => (
  <div class={cn(
    styles['file-sources__items'],
    className,
  )}>
    {children}
  </div>
)

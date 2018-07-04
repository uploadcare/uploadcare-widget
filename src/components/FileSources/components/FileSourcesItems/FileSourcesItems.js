/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './FileSourcesItems.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const FileSourcesItems = ({className}: Props, children: Array<Children>) => (
  <div class={cn(
    styles['file-sources__items'],
    className,
  )}>
    {children}
  </div>
)

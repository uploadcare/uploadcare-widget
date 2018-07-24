/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Files.css'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'
import {File} from '../File/File'

export const Files = ({className}: Props, children: Array<Children>) => (
  <div className={cn(styles.files, className)}>
    {children}
  </div>
)

export const FilesItem = ({className}: Props, children: Array<Children>) => (
  <File className={cn(styles.files__item, className)}>
    {children}
  </File>
)

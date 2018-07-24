/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './FileSource.css'

import {Button} from '../Button/Button'

import type {Props} from './flow-typed'

export const FileSource = ({className}: Props) => (
  <Button
    className={cn(
      styles['file-source'],
      styles['file-source_all'],
      className,
    )}
    withIcon='more' />
)

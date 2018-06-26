/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './FileSourcesItem.css'

import type {Props} from './flow-typed'
import {FileSource} from '../../../FileSource/FileSource'

export const FileSourcesItem = ({className}: Props) => (
  <FileSource
    className={cn(
      styles['file-sources__item'],
      className,
    )}/>
)

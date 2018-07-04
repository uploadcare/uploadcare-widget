/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './FileSourcesItem.css'

import {FileSource} from '../../../FileSource/FileSource'

import type {Props} from './flow-typed'

export const FileSourcesItem = ({className}: Props) => (
  <FileSource
    className={cn(
      styles['file-sources__item'],
      className,
    )}/>
)

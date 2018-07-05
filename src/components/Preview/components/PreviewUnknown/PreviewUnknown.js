/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './PreviewUnknown.css'

import {Text} from '../../../Text/Text'

import type {Props} from './flow-typed'

export const PreviewUnknown = ({className, fileName}: Props) => (
  <Text className={cn(styles['preview__file-name'], className)}>{fileName}</Text>
)

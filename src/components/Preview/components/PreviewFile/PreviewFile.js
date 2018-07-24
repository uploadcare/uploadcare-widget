/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './PreviewFile.css'

import {Text} from '../../../Text/Text'

import type {Props} from './flow-typed'
import {translate} from '../../../../helpers'

const humanFileSize = (fileSize: number): string => `${fileSize}`

export const PreviewFile = ({className, fileName, fileSize}: Props) => (
  <Text className={cn(styles['preview__file-name'], className)}>
    {`${fileName || translate('dialog.tabs.preview.unknownName') }, ${humanFileSize(fileSize)}`}
  </Text>
)

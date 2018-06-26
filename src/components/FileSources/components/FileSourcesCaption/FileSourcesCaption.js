/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './FileSourcesCaption.css'

import {Text} from '../../../Text/Text'

import type {Props} from './flow-typed'

export const FileSourcesCaption = ({className}: Props, children: Children) => (
  <Text
    className={cn(
      styles['file-sources__caption'],
      className
    )}
    size='small'
    isMuted>
    {children}
  </Text>
)

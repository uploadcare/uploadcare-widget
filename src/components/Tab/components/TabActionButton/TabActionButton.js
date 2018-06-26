/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './TabActionButton.css'

import type {Props} from './flow-typed'
import {Button} from '../../../Button/Button'

export const TabActionButton = ({className}: Props, children: Children) => (
  <Button
    className={cn(
      styles['tab__action-button'],
      className,
    )}
    size='big'
    isPrimary>
    {children}
  </Button>
)

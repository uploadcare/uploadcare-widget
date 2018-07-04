/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './TabActionButton.css'

import {Button} from '../../../Button/Button'

import type {Props} from './flow-typed'
import type {Children} from 'hyperapp'

export const TabActionButton = ({className, type = 'button'}: Props, children: Array<Children>) => (
  <Button
    className={cn(
      styles['tab__action-button'],
      className,
    )}
    size='big'
    isPrimary
    type={type} >
    {children}
  </Button>
)

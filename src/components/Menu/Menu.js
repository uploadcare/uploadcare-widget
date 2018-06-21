/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Menu.css'

import {Button} from '../Button/Button'
import {Icon} from '../SVG/components/Icon/Icon'

import type {Props} from './flow-typed'

export const Menu = ({className}: Props, children) => (
  <div class={cn(styles.menu, className)}>
    <Button
      className={styles.menu__toggle}
      withIcon=''
      isMuted>
      <Icon />
    </Button>
    <Button
      className={styles.menu__toggle}
      withIcon=''>
      <Icon />
    </Button>
    <div class={styles.menu__items}>{children}</div>
  </div>
)

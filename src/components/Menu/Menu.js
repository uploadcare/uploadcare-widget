/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Menu.css'

import {MenuItem} from './components/MenuItem/MenuItem'
import {Button} from '../Button/Button'
import {Icon} from '../SVG/components/Icon/Icon'

import type {Props} from './flow-typed'
import type {Props as MenuItemProps} from './components/MenuItem/flow-typed'

export const Menu = ({className, menuItems}: Props) => (
  <div class={cn(styles.menu, className)}>
    <Button
      className={styles.menu__toggle}
      withIcon='menu'
      isMuted>
      <Icon />
    </Button>
    <Button
      className={styles.menu__toggle}
      withIcon='back'>
      <Icon />
    </Button>
    <div class={styles.menu__items}>
      {menuItems.map(
        ({className, title, iconName, isHidden, isCurrent}: MenuItemProps) => (
          <MenuItem
            key={iconName}
            className={className}
            title={title}
            iconName={iconName}
            isHidden={isHidden}
            isCurrent={isCurrent} />
        ))}
    </div>
  </div>
)

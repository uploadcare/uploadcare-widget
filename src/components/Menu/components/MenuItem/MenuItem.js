/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './MenuItem.css'

import {Icon} from '../../../SVG/components/Icon/Icon'

import type {Props} from './flow-typed'

export const MenuItem = ({className, title, iconName, isHidden, isCurrent}: Props) => (
  <div
    role='button'
    tabIndex='0'
    class={cn(
      styles.menu__item,
      isHidden && styles.menu__item_hidden,
      isCurrent && styles.menu__item_current,
      className,
    )}
    title={title}>
    <Icon
      className={styles.menu__icon}
      name={iconName} />
  </div>
)

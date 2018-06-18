/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import st from './Menu.css'

import {Button} from '../Button/Button'
import {Icon} from '../Icon/Icon'

type Props = {
  className?: string,
  href: string,
  target?: string,
}

export const Menu = ({className}: Props, children) => (
  <div class={cn(st.menu, className)}>
    <Button
      className={st.menu__toggle}
      withIcon
      isMuted>
      <Icon></Icon>
    </Button>
    <Button
      className={st.menu__toggle}
      withIcon>
      <Icon></Icon>
    </Button>
    <div class={st.menu__items}>{children}</div>
  </div>
)


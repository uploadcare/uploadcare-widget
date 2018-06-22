/* @flow */
import type {Props as MenuItemProps} from '../Menu/components/MenuItem/flow-typed'

export type Props = {
  className?: string,
  menuItems: Array<MenuItemProps>,
  filesCount: string,
}

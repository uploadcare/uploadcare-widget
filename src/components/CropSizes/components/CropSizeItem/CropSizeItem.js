/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './CropSizeItem.css'

import {ButtonDiv} from '../../../Button/Button'
import {Icon} from '../../../SVG/components/Icon/Icon'

import type {Props} from './flow-typed'
import {MouseFocused} from '../../../MouseFocused/MouseFocused'

const Item = ({caption, withIcon}: Props) => (
  <div
    className={cn(
      styles['crop-sizes__icon'],
      caption && caption === 'free' && styles['crop-sizes__icon_free'],
    )}>
    {withIcon && <Icon name={withIcon}/>}
  </div>
)

export const CropSizeItem = ({className, isCurrent = false, caption, withIcon}: Props) => (
  <ButtonDiv
    withIcon
    className={cn(
      styles['crop-sizes__item'],
      isCurrent && styles['crop-sizes__item_current'],
      className,
    )}
    caption={caption}>
    {isCurrent
      ? <Item
        caption={caption}
        withIcon={withIcon} /> : (
        <MouseFocused>
          <Item
            caption={caption}
            withIcon={withIcon} />
        </MouseFocused>
      )}
  </ButtonDiv>
)

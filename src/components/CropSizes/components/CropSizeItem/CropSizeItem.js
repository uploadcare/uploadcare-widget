/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './CropSizeItem.css'

import {ButtonDiv} from '../../../Button/Button'
import {Icon} from '../../../SVG/components/Icon/Icon'

import type {Props} from './flow-typed'

export const CropSizeItem = ({className, caption, withIcon}: Props) => (
  <ButtonDiv
    withIcon
    className={cn(
      styles['crop-sizes__item'],
      className,
    )}
    caption={caption}>
    <div class={styles['crop-sizes__icon']}>
      {withIcon && <Icon name={withIcon} />}
    </div>
  </ButtonDiv>
)

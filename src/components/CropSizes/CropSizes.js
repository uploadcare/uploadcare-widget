/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './CropSizes.css'

import {CropSizeItem} from './components/CropSizeItem/CropSizeItem'

import type {Props, CropSizeItemProps} from './flow-typed'

export const CropSizes = ({className, items}: Props) => (
  <div class={cn(styles['crop-sizes'], className)}>
    {items.map(({caption, withIcon}: CropSizeItemProps) => (
      <CropSizeItem
        key={caption}
        caption={caption}
        withIcon={withIcon}/>
    ))}
  </div>
)

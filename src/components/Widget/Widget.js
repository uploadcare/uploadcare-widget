/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import {WidgetButton} from './components/WidgetButton/WidgetButton'
import {WidgetText} from './components/WidgetText/WidgetText'
import {WidgetProgress} from './components/WidgetProgress/WidgetProgress'
import {WidgetFile} from './components/WidgetFile/WidgetFile'

import styles from './Widget.css'

import type {Props} from './flow-typed'

export const Widget = ({status = 'ready', progressValue, file, errorMessage}: Props) => (
  <div class={cn(styles.widget, styles[`widget_status_${status}`])}>
    {(() => {
      switch (status) {
      case 'ready':
        return <WidgetButton type='open'>Choose a file</WidgetButton>
      case 'started':
        return [
          <WidgetProgress key='progress' value={progressValue} />,
          <WidgetText key='text'>Uploading...</WidgetText>,
          <WidgetButton key='remove button' type='remove'>Remove</WidgetButton>,
        ]
      case 'loaded':
        return <WidgetFile name={file.name} size={file.size} />
      case 'error':
        return [
          <WidgetText key='error'>{errorMessage}</WidgetText>,
          <WidgetButton key='open button' type='open'>Choose a file</WidgetButton>,
        ]
      default:
        return null
      }
    })()}
  </div>
)

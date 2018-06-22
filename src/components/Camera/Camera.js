/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Camera.css'

import {translate} from '../../helpers'

import {Button} from '../Button/Button'
import {Text} from '../Text/Text'

import type {Props} from './flow-typed'

export const Camera = ({className}: Props) => (
  <div className={cn(styles.camera, className)}>
    <div className={styles.camera__controls}>
      <Button
        className={(cn(
          styles.camera__button,
          styles['camera__button_type_start-record']
        ))}
        isPrimary>
        {translate('dialog.tabs.camera.startRecord')}
      </Button>
      <Button
        className={(cn(
          styles.camera__button,
          styles.camera__button_type_capture
        ))}
        isPrimary>
        {translate('dialog.tabs.camera.capture')}
      </Button>
      <Button
        className={(cn(
          styles.camera__button,
          styles['camera__button_type_cancel-record']
        ))}>
        {translate('dialog.tabs.camera.cancelRecord')}
      </Button>
      <Button
        className={(cn(
          styles.camera__button,
          styles['camera__button_type_stop-record']
        ))}
        isPrimary>
        {translate('dialog.tabs.camera.stopRecord')}
      </Button>
    </div>
    <div class={styles['camera__please-allow']}>
      <Text size='medium'>{translate('dialog.tabs.camera.pleaseAllow.title')}</Text>
      <Text>{translate('dialog.tabs.camera.pleaseAllow.text')}</Text>
    </div>
    <div class={styles['camera__not-found']}>
      <Text size='medium'>{translate('dialog.tabs.camera.notFound.title')}</Text>
      <Text>{translate('dialog.tabs.camera.notFound.text')}</Text>
    </div>
    <Button
      className={(cn(
        styles.camera__button,
        styles.camera__button_type_retry
      ))}>
      {translate('dialog.tabs.camera.retry')}
    </Button>
  </div>
)

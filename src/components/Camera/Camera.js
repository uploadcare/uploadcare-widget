/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Camera.css'

import {Button} from '../Button/Button'
import {Text} from '../Text/Text'
import {Media, Video} from '../Media/Media'
import {translate} from '../../helpers'

type Props = {
  className?: string,
}

export const Camera = ({className}: Props) => (
  <div>
    <Media className={styles.camera__container}>
      <Video className={cn(
        styles.camera__video,
        styles.camera__video_mirrored
      )}/>

      <Button
        size='small'
        isOverlay
        className={cn(
          styles.camera__button,
          styles.camera__button_type_mirror,
        )}>{translate('dialog.tabs.camera.mirror')}</Button>
    </Media>

    <div class={styles.camera__controls}>
      <Button
        className={cn(
          styles.camera__button,
          styles.camera__button_type_start
        )}
        isPrimary>{translate('dialog.tabs.camera.startRecord')}</Button>
      <Button
        className={cn(
          styles.camera__button,
          styles.camera__button_type_capture,
        )}
        isPrimary>{translate('dialog.tabs.camera.capture')}</Button>
      <Button className={cn(
        styles.camera__button,
        styles.camera__button_type_cancel,
      )}>{translate('dialog.tabs.camera.cancelRecord')}</Button>
      <Button
        className={cn(
          styles.camera__button,
          styles.camera__button_type_stop,
        )}
        isPrimary>{translate('dialog.tabs.camera.stopRecord')}</Button>
    </div>

    <div class={styles.camera__not}>
      <Text size='medium'>{translate('dialog.tabs.camera.notFound.title')}</Text>
      <Text>{translate('dialog.tabs.camera.notFound.text')}</Text>
    </div>

    <Button className={cn(
      styles.camera__button,
      styles.camera__button_type_retry,
    )}>{translate('dialog.tabs.camera.retry')}</Button>
  </div>
)

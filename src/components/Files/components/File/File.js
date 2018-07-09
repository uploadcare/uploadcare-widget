/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './File.css'

import {ProgressBar} from '../../../ProgressBar/ProgressBar'
import {Button} from '../../../Button/Button'

import type {Props} from './flow-typed'

export const File = (
  {className, status, fileName, fileSize, hasError}: Props
) => (
  <div class={cn(styles.file, status && styles[`file_status_${status}`], className)}>
    <div class={styles.file__description}>
      <div class={styles.file__preview}></div>
      <div class={styles.file__name}>
        {fileName}
      </div>
      <div class={styles.file__size}>
        {fileSize}
      </div>
      {hasError && (
        <div className={styles.file__error}>{hasError}</div>
      )}
    </div>
    <div class={styles.file__progressbar}>
      <ProgressBar></ProgressBar>
    </div>
    <Button
      className={styles.file__remove}
      isMuted
      withIcon='remove' />
  </div>
)

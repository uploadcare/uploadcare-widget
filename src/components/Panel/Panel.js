/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './Panel.css'

import {translate} from '../../helpers'

import {Menu} from '../Menu/Menu'
import {Footer} from '../Footer/Footer'
import {FooterAdditions} from '../Footer/components/FooterAdditions/FooterAdditions'
import {FooterButton} from '../Footer/components/FooterButton/FooterButton'
import {PoweredBy} from '../PoweredBy/PoweredBy'

import type {Props} from './flow-typed'

export const Panel = ({className, menuItems, filesCount}: Props) => (
  <div className={cn(styles.panel, className)}>
    <Menu
      className={styles.panel__menu}
      items={menuItems} />
    <div class={styles.panel__content}>
      <Footer className={styles.panel__footer}>
        <FooterAdditions className={styles.panel__message} />
        <FooterButton className={styles['panel__show-files']}>
          {translate('dialog.showFiles')}
          <div class={styles['panel__file-counter']}>{filesCount}</div>
        </FooterButton>
        <FooterButton className={styles.panel__done}>
          {translate('dialog.done')}
        </FooterButton>
      </Footer>
      <PoweredBy
        className={styles['panel__powered-by']}
        version='4.0.0' />
    </div>
  </div>
)

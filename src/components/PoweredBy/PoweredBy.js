/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import styles from './PoweredBy.css'
import {translate} from '../../helpers'

import {Link} from '../Link/Link'
import {Icon} from '../SVG/components/Icon/Icon'

import type {Props} from './flow-typed'

export const PoweredBy = ({className, version}: Props) => (
  <div class={cn(styles['powered-by'], className)}>
    {translate('dialog.footer.text')}
    <Link
      className={styles['powered-by__link']}
      href={`'https://uploadcare.com/?utm_campaign=widget&utm_source=copyright&utm_medium=desktop&utm_content='${version}`}
      target='_blank'>
      <Icon
        className={styles['powered-by__logo']}
        name='uploadcare' />
      {translate('dialog.footer.link')}
    </Link>
  </div>
)

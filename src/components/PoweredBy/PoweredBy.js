/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'
import st from './PoweredBy.css'
import {translate} from '../../helpers'

import {Link} from '../Link/Link'
import {Icon} from '../Icon/Icon'

type Props = {
  className?: string,
  version: string,
}

export const PoweredBy = ({className, version}: Props) => (
  <div class={cn(st.poweredBy, className)}>
    {translate('dialog.footer.text')}
    <Link
      className={st.poweredBy__link}
      href={`'https://uploadcare.com/?utm_campaign=widget&utm_source=copyright&utm_medium=desktop&utm_content='${version}`}
      target='_blank'>
      <Icon className={st.poweredBy__logo}>1</Icon>
      {translate('dialog.footer.link')}
    </Link>
  </div>
)


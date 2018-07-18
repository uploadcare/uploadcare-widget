import {h} from 'hyperapp'
import styles from './LocalizedDemo.pcss'
import cn from 'classnames'
import {i18n, t} from 'i18n'

export const LocalizedDemo = () => {
  const toggle = () => {
    const nextLocale = i18n.getLocale() === 'ru' ? 'en' : 'ru'

    i18n.setLocale(nextLocale)
  }

  return (
    <div>
      <div
        class={cn(styles.hello)}
        onclick={toggle}>
        Click me! - {t('hello')}
      </div>
    </div>
  )
}

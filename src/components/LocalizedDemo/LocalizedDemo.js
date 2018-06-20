import {h} from 'hyperapp'
import styles from './LocalizedDemo.pcss'
import cn from 'classnames'
import {t} from 'i18n'

export const LocalizedDemo = () => (state, actions) => {
  const toggle = () => {
    const nextLocale = state.i18n.locale === 'ru' ? 'en' : 'ru'

    actions.i18n.set(nextLocale)
  }

  return (
    <div>
      <div class={cn(styles.hello)} onclick={toggle}>
      Click me! - {t('hello')}
      </div>
    </div>
  )
}

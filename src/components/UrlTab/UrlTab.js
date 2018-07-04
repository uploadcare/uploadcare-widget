/* @flow */
/* @jsx h */
import {h} from 'hyperapp'

import {translate} from '../../helpers'

import {TabContent} from '../Tab/components/TabContent/TabContent'
import {TabTitle} from '../Tab/components/TabTitle/TabTitle'
import {TabActionButton} from '../Tab/components/TabActionButton/TabActionButton'
import {Form} from '../Form/Form'
import {Input} from '../Input/Input'

import type {Props} from './flow-typed'

export const UrlTab = ({className}: Props) => (
  <TabContent className={className}>
    <TabTitle>
      {translate('dialog.tabs.url.title')}
    </TabTitle>
    <Text>{translate('dialog.tabs.url.line1')}</Text>
    <Text>{translate('dialog.tabs.url.line2')}</Text>
    <Form>
      <Input placeholder={translate('dialog.tabs.url.input')} />
      <TabActionButton type='submit'>
        {translate('dialog.tabs.url.button')}
      </TabActionButton>
    </Form>
  </TabContent>
)

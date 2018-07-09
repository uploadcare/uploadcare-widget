/* @flow */
/* @jsx h */
import {h} from 'hyperapp'
import cn from 'classnames'

import {TabHeader} from '../Tab/components/TabHeader/TabHeader'
import {PreviewTitle} from '../Preview/components/PreviewTitle/PreviewTitle'

import type {Props} from './flow-typed'
import {translate} from '../../helpers'

export const PreviewMultiple = ({}: Props) => (
  <div>
    <TabHeader>
      <PreviewTitle></PreviewTitle>
    </TabHeader>
    <TabContent>
      <Files></Files>
    </TabContent>
    <TabFooter>
      <PreviewMessage></PreviewMessage>
      <PreviewBackButton>
        {translate('dialog.tabs.preview.multiple.clear')}
      </PreviewBackButton>
      <PreviewDoneButton>
        {translate('dialog.tabs.preview.multiple.done')}
      </PreviewDoneButton>
    </TabFooter>
  </div>
)

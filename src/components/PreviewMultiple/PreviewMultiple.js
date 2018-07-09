/* @flow */
/* @jsx h */
import {h} from 'hyperapp'

import {TabHeader} from '../Tab/components/TabHeader/TabHeader'
import {TabContent} from '../Tab/components/TabContent/TabContent'
import {TabFooter} from '../Tab/components/TabFooter/TabFooter'
import {PreviewTitle} from '../Preview/components/PreviewTitle/PreviewTitle'
import {PreviewMessage} from '../Preview/components/PreviewMessage/PreviewMessage'
import {PreviewBackButton} from '../Preview/components/PreviewBackButton/PreviewBackButton'
import {PreviewDoneButton} from '../Preview/components/PreviewDoneButton/PreviewDoneButton'
import {Files} from '../Files/Files'

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

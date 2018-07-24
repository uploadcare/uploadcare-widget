/* @flow */
/* @jsx h */
import {h} from 'hyperapp'

import {translate} from '../../../../helpers'

import {Error} from '../../../Error/Error'
import {Text} from '../../../Text/Text'
import {PreviewTitle} from '../PreviewTitle/PreviewTitle'
import {PreviewBackButton} from '../PreviewBackButton/PreviewBackButton'

import type {Props} from './flow-typed'

export const PreviewError = ({error}: Props) => (
  <Error>
    <PreviewTitle>
      {error
        ? translate(`dialog.tabs.preview.error.${error}.title`)
        : translate('dialog.tabs.preview.error.default.title')
      }
    </PreviewTitle>
    <Text>
      {error
        ? translate(`dialog.tabs.preview.error.${error}.text`)
        : translate('dialog.tabs.preview.error.default.text')
      }
    </Text>
    <PreviewBackButton>
      {error
        ? translate(`dialog.tabs.preview.error.${error}.back`)
        : translate('dialog.tabs.preview.error.default.back')
      }
    </PreviewBackButton>
  </Error>
)

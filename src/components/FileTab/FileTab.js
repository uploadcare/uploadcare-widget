/* @flow */
/* @jsx h */
import {h} from 'hyperapp'

import {translate} from '../../helpers'

import {TabContent} from '../Tab/components/TabContent/TabContent'
import {TabActionButton} from '../Tab/components/TabActionButton/TabActionButton'
import {DragAndDrop} from '../DragAndDrop/DragAndDrop'
import {DragAndDropTitle} from '../DragAndDrop/components/DragAndDropTitle/DragAndDropTitle'
import {DragAndDropSupported} from '../DragAndDrop/components/DragAndDropSupported/DragAndDropSupported'
import {DragAndDropNotSupported} from '../DragAndDrop/components/DragAndDropNotSupported/DragAndDropNotSupported'
import {Dragging} from '../Dragging/Dragging'
import {DraggingShow} from '../Dragging/components/DraggingShow/DraggingShow'
import {DraggingHide} from '../Dragging/components/DraggingHide/DraggingHide'
import {Text} from '../Text/Text'
import {FileSources} from '../FileSources/FileSources'
import {FileSourcesCaption} from '../FileSources/components/FileSourcesCaption/FileSourcesCaption'
import {FileSourcesItems} from '../FileSources/components/FileSourcesItems/FileSourcesItems'
import {FileSourcesItem} from '../FileSources/components/FileSourcesItem/FileSourcesItem'

import type {Props} from './flow-typed'

export const FileTab = ({className, isDragAndDropSupported}: Props) => (
  <TabContent className={className}>
    <DragAndDrop>
      <Dragging>
        <DraggingShow>
          <Text size='extra'>
            {translate('draghere')}
          </Text>
        </DraggingShow>
        <DragAndDropTitle>
          <DraggingHide>
            {isDragAndDropSupported && (
              <DragAndDropSupported>
                <Text size='extra'>
                  {translate('dialog.tabs.file.drag')}
                </Text>
                <Text
                  size='small'
                  isMuted>
                  {translate('dialog.tabs.file.or')}
                </Text>
              </DragAndDropSupported>
            )}
            {!isDragAndDropSupported && (
              <DragAndDropNotSupported>
                <Text size='large'>
                  {translate('dialog.tabs.file.nodrop')}
                </Text>
              </DragAndDropNotSupported>
            )}
          </DraggingHide>
        </DragAndDropTitle>
        <DraggingHide>
          <TabActionButton>
            {translate('dialog.tabs.file.button')}
          </TabActionButton>
        </DraggingHide>
        <DraggingHide>
          <FileSources>
            <FileSourcesCaption>
              {translate('dialog.tabs.file.also')}
            </FileSourcesCaption>
            <FileSourcesItems>
              <FileSourcesItem />
            </FileSourcesItems>
          </FileSources>
        </DraggingHide>
      </Dragging>
    </DragAndDrop>
  </TabContent>
)

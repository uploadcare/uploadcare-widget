import {Selector as selector} from 'testcafe'

fixture `Simple`
  .page `./simple.html`

const widgetButton = selector('.uploadcare--widget__button')

test('Widget button exists', async controller => {
  const widgetButtonExists = widgetButton.exists

  await controller
    .expect(widgetButtonExists).ok()
})

test('Click on widget button opens Widget Dialog', async controller => {
  const widgetDialog = await selector('.uploadcare--dialog_status_active')

  await controller
    .click(widgetButton)
    .expect(widgetDialog.exists)
    .ok()
})



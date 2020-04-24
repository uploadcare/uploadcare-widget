describe('uploadcare widget', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:10001/default.html')
  })

  it('should display a uploadcare widget', async () => {
    await expect(page).toMatch('Choose a file')
  })

  it('shold upload files from url', async () => {
    // open dialog
    await expect(page).toClick('button', { text: 'Choose a file' })
    // check if it rendered
    const dialog = await expect(page).toMatchElement(
      '.uploadcare--dialog.uploadcare--dialog_status_active'
    )
    // open url tab
    await expect(dialog).toClick(
      '.uploadcare--menu__item.uploadcare--menu__item_tab_url'
    )
    // fill input
    await expect(dialog).toFill(
      'input.uploadcare--input',
      'https://images.unsplash.com/photo-1587618420001-024eaae2aa7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2112&q=80'
    )

    await expect(dialog).toClick('button', { text: 'Upload' })

    await expect(page).toMatchElement(
      '.uploadcare--widget.uploadcare--widget_status_started'
    )

    // await expect(
    //   page
    // ).toMatchElement('.uploadcare--widget_status_loaded', {
    //   timeout: 30000
    // })
  })
})

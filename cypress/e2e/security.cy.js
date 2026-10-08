/// <reference types="cypress" />
/* eslint-env mocha */
/* global cy */
/* global expect */

import { setup } from '../templates'

// window.uploadcare only exposes internals through the plugin API.
const internals = (win) => win.uploadcare.plugin((uc) => uc)

describe('security hardening', () => {
  it('escapes HTML in server error messages shown in the preview tab', () => {
    const payload = '<img src=x onerror="window.__xss = true">'

    setup()

    cy.window().then((win) => {
      const markup = internals(win).templates.tpl('tab-preview-error', {
        errorType: 'upload',
        error: { message: payload }
      })

      expect(markup).to.contain('&lt;img src=x')
      expect(markup).not.to.contain('<img')
    })
  })

  it('falls back to localized text when the error has no message', () => {
    setup()

    cy.window().then((win) => {
      const markup = internals(win).templates.tpl('tab-preview-error', {
        debugUploads: true,
        errorType: 'image'
      })

      expect(markup).to.contain('Please try again with another file.')
      expect(markup).not.to.contain('undefined')
    })
  })
})

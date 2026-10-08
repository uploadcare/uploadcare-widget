/// <reference types="cypress" />
/* eslint-env mocha */
/* global cy */
/* global expect */

import { setup } from '../templates'

const SOCIAL_ORIGIN = 'https://social.uploadcare.com'

const postToWidget = (win, { data, origin, source }) => {
  win.dispatchEvent(
    new win.MessageEvent('message', {
      data: JSON.stringify(data),
      origin,
      source
    })
  )
}

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

  it('registerMessage only accepts messages from the given origin', () => {
    setup()

    cy.window().then((win) => {
      const { registerMessage, unregisterMessage } = internals(win).utils
      const strict = cy.stub().as('strict')
      const loose = cy.stub().as('loose')

      registerMessage('test-msg', win, strict, 'https://trusted.example')
      registerMessage('test-msg', win, loose)

      postToWidget(win, {
        data: { type: 'test-msg', n: 1 },
        origin: 'https://evil.example',
        source: win
      })
      postToWidget(win, {
        data: { type: 'test-msg', n: 2 },
        origin: 'https://trusted.example',
        source: win
      })

      unregisterMessage('test-msg', win)

      expect(strict).to.have.callCount(1)
      expect(strict.firstCall.args[0]).to.deep.equal({ type: 'test-msg', n: 2 })
      // Without an origin the old behaviour is kept: source check only.
      expect(loose).to.have.callCount(2)
    })
  })

  it('open-new-window ignores foreign origins and non-http URLs', () => {
    setup()

    cy.get('.uploadcare--widget__button_type_open').click()
    cy.get('.uploadcare--menu__item_tab_huddle').click()

    cy.get('.uploadcare--tab_name_huddle iframe')
      .should('exist')
      .then(($iframe) => {
        const source = $iframe[0].contentWindow

        cy.window().then((win) => {
          const open = cy.stub(win, 'open').returns(null).as('open')

          // Wrong origin, same source window: refused.
          postToWidget(win, {
            data: { type: 'open-new-window', url: 'https://example.com/a' },
            origin: 'https://evil.example',
            source
          })
          // Right origin, dangerous scheme: refused.
          postToWidget(win, {
            data: { type: 'open-new-window', url: 'javascript:alert(1)' },
            origin: SOCIAL_ORIGIN,
            source
          })
          // Right origin, wrong source window: refused.
          postToWidget(win, {
            data: { type: 'open-new-window', url: 'https://example.com/b' },
            origin: SOCIAL_ORIGIN,
            source: win
          })
          expect(open).to.have.callCount(0)

          // Right origin, right source, http(s) URL: opened.
          postToWidget(win, {
            data: { type: 'open-new-window', url: 'https://example.com/ok' },
            origin: SOCIAL_ORIGIN,
            source
          })
          expect(open).to.have.been.calledOnceWith(
            'https://example.com/ok',
            '_blank'
          )
        })
      })
  })
})

/// <reference types="cypress" />
/* eslint-env mocha */
/* global cy */

import { setup } from '../templates'

describe('uploadcare widget', () => {
  it('should upload images from url', function () {
    setup()

    cy.get('.uploadcare--widget__button_type_open').click()

    cy.get('.uploadcare--menu__item_tab_url').click()
    cy.get('.uploadcare--input').type(
      'https://ucarecdn.com/e8701017-071b-42f4-b4db-0592b24931f9/small.png{enter}'
    )

    cy.get('.uploadcare--progress').should('exist')

    cy.get('.uploadcare--link')
      .should('exist')
      .should('contain.text', 'small.png')
  })

  it('should upload files with drag-n-drop and open dialog', () => {
    const fileName = 'image.jpeg'
    setup()

    cy.fixture(fileName).then((fileContent) => {
      cy.get('.uploadcare--widget__button_type_open').click()

      cy.get('.uploadcare--draganddrop').upload(
        { fileContent, fileName, mimeType: 'image/jpeg' },
        { subjectType: 'drag-n-drop', events: ['dragcenter', 'drop'] }
      )

      cy.get('.uploadcare--progress').should('exist')

      cy.get('.uploadcare--link')
        .should('exist')
        .should('contain.text', fileName)
    })
  })

  it('should upload images', () => {
    const fileName = 'image.jpeg'

    cy.fixture(fileName).then((fileContent) => {
      setup()

      cy.get('.uploadcare--widget__button_type_open').click()

      cy.get(
        '.uploadcare--tab_name_file .uploadcare--tab__action-button'
      ).click()
      cy.get('input[type="file"]').upload({
        fileContent,
        fileName,
        mimeType: 'image/jpeg'
      })

      cy.get('.uploadcare--progress').should('exist')

      cy.get('.uploadcare--link')
        .should('exist')
        .should('contain.text', fileName)
    })
  })
})

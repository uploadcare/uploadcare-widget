/// <reference types="cypress" />
/* eslint-env mocha */

describe('uploadcare widget', function () {
  beforeEach(function () {
    cy.visit('/')
  })

  it('uploads with url', function () {
    cy.get('.uploadcare--progress').should('not.exist')
    cy.get('.uploadcare--widget__button_type_open').click()

    cy.get('.uploadcare--menu__item_tab_url').click()
    cy.get('.uploadcare--input').type('https://ucarecdn.com/3db26848-d1c6-4b3d-8cfa-13cc5a76f2a1/small.png{enter}')

    cy.get('.uploadcare--progress').should('exist')

    cy.get('.uploadcare--link').should('exist').should('contain.text', 'small.png')
  })

  it('uploads with image', async () => {
    const fileName = 'image.jpeg'
    const fileContent = await cy.fixture(fileName)

    cy.get('.uploadcare--progress').should('not.exist')

    cy.get('.uploadcare--widget').upload(
      { fileContent, fileName, mimeType: 'image/jpeg' },
      { subjectType: 'drag-n-drop' }
    )

    cy.get('.uploadcare--progress').should('exist')

    cy.get('.uploadcare--link').should('exist').should('contain.text', 'small.png')
  })
})

/// <reference types="cypress" />
/* eslint-env mocha */
/* global cy */


describe('uploadcare widget', () => {
  it('should upload images from url', function() {
    cy.visit('/simple.html')

    cy.get('.uploadcare--widget__button_type_open').click()

    cy.get('.uploadcare--menu__item_tab_url').click()
    cy.get('.uploadcare--input').type(
      'https://ucarecdn.com/3db26848-d1c6-4b3d-8cfa-13cc5a76f2a1/small.png{enter}'
    )

    cy.get('.uploadcare--progress').should('exist')

    cy.get('.uploadcare--link')
      .should('exist')
      .should('contain.text', 'small.png')
  })


  it('should upload files with drag-n-drop', async () => {
    const fileName = 'image.jpeg'
    
    return cy.fixture(fileName).then((fileContent) => {
      cy.visit('/simple.html')

      cy.get('.uploadcare--widget').upload(
        { fileContent, fileName, mimeType: 'image/jpeg' },
        { subjectType: 'drag-n-drop' }
      )

      cy.get('.uploadcare--progress').should('exist')

      cy.get('.uploadcare--link')
        .should('exist')
        .should('contain.text', 'small.png') // TODO: fix this accert
    })
  })

  it('should upload files with drag-n-drop and open dialog', () => {
    const fileName = 'image.jpeg'
    
    return cy.fixture(fileName).then(fileContent => {
      cy.visit('/simple.html')

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
    
    return cy.fixture(fileName).then(fileContent => {
      cy.visit('/simple.html')

      cy.get('.uploadcare--widget__button_type_open').click()

      cy.get('div.uploadcare--tab.uploadcare--tab_name_file button.uploadcare--tab__action-button').click()
      cy.get('input[type="file"]').upload({ fileContent, fileName, mimeType: 'image/jpeg' })

      cy.get('.uploadcare--progress').should('exist')

      cy.get('.uploadcare--link')
        .should('exist')
        .should('contain.text', fileName)
    })
  })
})

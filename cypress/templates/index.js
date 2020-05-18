/* global cy */

import { join } from 'path'

const TEMPLATES = {
  SIMPLE: join(__dirname, './index.html')
}

const setup = (template = TEMPLATES.SIMPLE) => {
  cy.visit(template)
}

export { setup, TEMPLATES }

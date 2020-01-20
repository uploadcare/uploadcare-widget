/* eslint-env jest */

import { html } from './html'

describe("HTML function", () => {
  it('should work with template string literals', () => {
    expect(html`<div></div>`).toBe('<div></div>')
  })
})

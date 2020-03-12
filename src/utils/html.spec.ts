/* eslint-env jest */

import { html } from './html'

describe("HTML function", () => {
  it('should work with template string literals', () => {
    expect(html`<div></div>`).toBe('<div></div>')
  })

  it('should skip falsy values from template (except 0)', () => {
    expect(
      html`<div null='${null}' undefined='${undefined}' number='${0}' true='${true}'>${false}</div>`
    ).toBe("<div null='' undefined='' number='0' true='true'></div>")
  })
})

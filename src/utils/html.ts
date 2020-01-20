// This module used only in dev mod

// For production 'babel-plugin-html-tag' removes html
// function and evaluates and minifies tagged html

type Base = string | number | null | undefined

const html = (parts: TemplateStringsArray, ...values: Base[]): string =>
  parts.reduce((str, next, i) => str + values[i - 1] + next)

export { html }

// This module used only in dev mod

// For production 'babel-plugin-html-tag' removes html
// function and evaluates and minifies tagged html

type Base = string | number | boolean | null | undefined

const validate = (value: Base, fallback: string = ''): string => {
  if (value == null) {
    return fallback
  } else if (typeof value === 'boolean' && value === false) {
    return fallback
  } else {
    return value.toString()
  }
}

const html = (parts: TemplateStringsArray, ...values: Base[]): string =>
  parts.reduce((str, next, i) => str + validate(values[i - 1]) + next)

export { html }

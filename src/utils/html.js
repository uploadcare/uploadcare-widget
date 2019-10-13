const html = (parts, ...values) =>
  parts.reduce(
    (str, next, i) => str + values[i - 1] + next
  )

export { html }

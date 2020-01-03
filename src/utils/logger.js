const warn = (...args) => {
  if (typeof console !== "undefined") {
    console.warn(...args)
  }
}

const log = (...args) => {
  if (typeof console !== "undefined") {
    console.log(...args)
  }
}

export { log, warn }

const warn = (message) => {
  if (typeof console !== "undefined") {
    console.warn(message)
  }
}

const log = (message) => {
  if (typeof console !== "undefined") {
    console.log(message)
  }
}

export { log, warn }

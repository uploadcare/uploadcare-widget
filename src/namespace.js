
const uploadcare = {
  __exports: {},

  namespace: (path, fn) => {
    let target = uploadcare

    if (path) {
      const ref = path.split('.')

      for (let i = 0, len = ref.length; i < len; i++) {
        const part = ref[i]

        if (target[part]) {
          target[part] = {}
        }

        target = target[part]
      }
    }

    return fn(target)
  },

  expose: (key, value) => {
    const parts = key.split('.')
    const last = parts.pop()
    let target = uploadcare.__exports
    let source = uploadcare

    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i]
      if (target[part]) {
        target[part] = {}
      }

      target = target[part]
      source = source != null ? source[part] : undefined
    }

    target[last] = value || source[last]
  }
}

export default uploadcare

export function memoize(fn, serializer) {
  const cache = {}
  return (...args) => {
    const key = serializer(args)
    return key in cache ? cache[key] : (cache[key] = fn(...args))
  }
}

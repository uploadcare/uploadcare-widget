export function memoize(fn, serializer) {
  const cache = {}
  return (...args) => {
    const key = serializer(args, cache)
    return key in cache ? cache[key] : (cache[key] = fn(...args))
  }
}

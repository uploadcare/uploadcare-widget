function find(arr, predicate) {
  var len = arr.length
  var k = 0

  while (k < len) {
    var kValue = arr[k]
    if (predicate(kValue)) {
      return kValue
    }
    k++
  }

  return undefined
}

export default find

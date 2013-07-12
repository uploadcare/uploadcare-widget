window.uploadcare ||= {}

uploadcare.namespace = (path, fn) ->
  parts = path.split('.')
  first = parts[0]
  rest = parts[1..]

  if first == 'uploadcare'
    target = uploadcare
  else
    window[first] ||= {}
    target = window[first]

  for part in rest
    target[part] ||= {}
    target = target[part]

  fn(target)

uploadcare.expose = (key, value) ->
  parts = key.split('.')
  last = parts.pop()

  target = window.uploadcare
  source = uploadcare

  for part in parts
    target[part] ||= {}
    target = target[part]
    source = source?[part]

  target[last] = value || source[last]

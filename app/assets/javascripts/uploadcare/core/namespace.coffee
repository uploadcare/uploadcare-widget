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

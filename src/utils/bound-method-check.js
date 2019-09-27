function boundMethodCheck (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding')
  }
}

export { boundMethodCheck }

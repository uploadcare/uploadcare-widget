import ucNew from '../../dist/uploadcare'
import ucOld from 'https://ucarecdn.com/libs/widget/3.7.9/uploadcare.js'

import { detailedDiff } from 'deep-object-diff'

console.log('COMPARE uploadcare')
console.log('')

console.log(ucNew)

console.log('')
console.log(ucOld)

console.log('')
console.log('exports diff:')
console.log(detailedDiff(ucOld, ucNew))

let nsOld = null
ucOld.plugin(ns => (nsOld = ns))

let nsNew = null
ucNew.plugin(ns => (nsNew = ns))

console.log('')
console.log('namespace diff:')
console.log(detailedDiff(nsOld, nsNew))
console.log('')
console.log('')

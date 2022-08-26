const fs = require('fs')
const crypto = require('crypto')

const cssBundle = fs.readFileSync('./src/stylesheets/styles.css').toString()
const algorithms = ['sha256', 'sha384', 'sha512']
let txt = ''
for (const algo of algorithms) {
  const hash = crypto.createHash(algo).update(cssBundle).digest('base64')
  txt += `${algo}-${hash}\n`
}

fs.writeFileSync('style-hashes.txt', txt)

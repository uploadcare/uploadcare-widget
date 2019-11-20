require('dotenv').config()

const AWS = require('aws-sdk')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')

const pkg = require('../package.json')

const getVersionTypes = version => [
  version,
  version.replace(/^(\d+\.\d+)\.\d+/, '$1.x'),
  version.replace(/^(\d+)\.\d+\.\d+/, '$1.x')
]

const BASE_PATH = 'libs/widget/'
const VERSION_TYPES = getVersionTypes(pkg.version)
const BUCKET = process.env.BUCKET
const ACCESS_KEY = process.env.ACCESS_KEY
const SECRET_KEY = process.env.SECRET_KEY

if (!BUCKET || !ACCESS_KEY || !SECRET_KEY) {
  console.log('don\'t found credentials skip publish to s3')
  process.exit(0)
}

const UPLOAD_CONFIG = {
  ACL: 'public-read',
  Bucket: BUCKET,
  ContentType: 'application/javascript; charset=utf-8'
}

const S3 = new AWS.S3({
  credentials: new AWS.Credentials(ACCESS_KEY, SECRET_KEY)
})

const baseS3upload = promisify(S3.upload.bind(S3))
const readFilePr = promisify(fs.readFile)

const readFile = filePath => {
  const absolutePath = path.resolve(__dirname, '../', filePath)

  return readFilePr(absolutePath, 'utf-8')
}

const uploadToS3 = (data, path, { dry } = {}) => {
  let promise = Promise.resolve()
  if (!dry) {
    promise = baseS3upload(
      Object.assign({}, UPLOAD_CONFIG, { Body: data, Key: path })
    )
  }

  console.log(`uploading ${data.length}B to ${path}`)

  return promise
}

const uploadFile = async (data, fileName, options) =>
  Promise.all(
    VERSION_TYPES.map(version =>
      uploadToS3(data, `${BASE_PATH}${version}/${fileName}`, options)
    )
  )

Promise.all(
  pkg.files.map(name =>
    Promise.all([readFile(name), name]).then(([data, name]) =>
      uploadFile(data, name)
    )
  )
).catch(error => {
  console.error(error)
  process.exit(1)
})

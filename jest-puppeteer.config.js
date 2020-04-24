module.exports = {
  launch: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  server: {
    command: `npm start`,
    port: 10001,
    waitOnScheme: {
      verbose: true,
      delay: 10000,
    },
  }
}

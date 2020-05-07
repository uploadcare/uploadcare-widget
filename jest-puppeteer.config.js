module.exports = {
  launch: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  server: {
    command: `npm start`,
    port: 10001,
    launchTimeout: 30000,
    waitOnScheme: { delay: 10000 },
  }
}

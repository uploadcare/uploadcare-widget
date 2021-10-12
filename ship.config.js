module.exports = {
  mergeStrategy: { toSameBranch: ['master'] },
  pullRequestReviewers: ['nd0ut'],
  buildCommand: () => null,
  testCommandBeforeRelease: () => 'npm run test',
  afterPublish: ({ exec }) => exec('node ./scripts/publish-to-s3.js'),
  slack: {
    // disable slack notification for `prepared` lifecycle.
    // Ship.js will send slack message only for `releaseSuccess`.
    prepared: null
  }
}

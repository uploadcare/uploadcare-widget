module.exports = {
  mergeStrategy: { toSameBranch: ['master'] },
  pullRequestReviewers: ['nd0ut'],
  testCommandBeforeRelease: () => 'npm run test',
  afterPublish: ({ exec }) => exec('node ./scripts/publish-to-s3.js')
}

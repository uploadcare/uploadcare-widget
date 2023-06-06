module.exports = {
  mergeStrategy: { toSameBranch: ['master'] },
  pullRequestReviewers: ['nd0ut'],
  // build command is empty because it will be implicitly run by the test command below
  buildCommand: () => null,
  testCommandBeforeRelease: () => 'npm run test',
  afterPublish: ({ exec }) => exec('node ./scripts/publish-to-s3.js')
}

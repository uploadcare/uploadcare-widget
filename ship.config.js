module.exports = {
  mergeStrategy: { toSameBranch: ['master'] },
  pullRequestReviewers: ['jeetiss'],
  buildCommand: () => null,
  testCommandBeforeRelease: () => 'npm run test',
  afterPublish: ({ exec }) => exec('node ./scripts/publish-to-s3.js'),
  slack: {
    // disable slack notification for `prepared` lifecycle.
    // Ship.js will send slack message only for `releaseSuccess`.
    prepared: null,
  },
  // skip preparation if master contain only `chore` commits
  shouldPrepare: ({ releaseType, commitNumbersPerType }) => {
    const { fix = 0 } = commitNumbersPerType;
    if (releaseType === "patch" && fix === 0) {
      return false;
    }
    return true;
  }
}

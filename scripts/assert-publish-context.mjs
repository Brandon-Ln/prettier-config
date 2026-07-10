// @ts-check
const expectedRepository = 'Brandon-Ln/prettier-config'
const expectedWorkflow =
  'Brandon-Ln/prettier-config/.github/workflows/publish.yml@refs/heads/main'

const checks = [
  ['CI', process.env.CI === 'true'],
  ['GITHUB_ACTIONS', process.env.GITHUB_ACTIONS === 'true'],
  ['GITHUB_EVENT_NAME', process.env.GITHUB_EVENT_NAME === 'workflow_dispatch'],
  ['GITHUB_REPOSITORY', process.env.GITHUB_REPOSITORY === expectedRepository],
  ['GITHUB_REF', process.env.GITHUB_REF === 'refs/heads/main'],
  ['GITHUB_WORKFLOW_REF', process.env.GITHUB_WORKFLOW_REF === expectedWorkflow],
]

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name)

if (failed.length > 0) {
  throw new Error(
    `Refusing to publish outside the protected GitHub Actions workflow. Failed checks: ${failed.join(', ')}`,
  )
}

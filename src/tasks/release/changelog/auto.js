import { execa } from 'execa'
import { valid } from 'semver'

// If `CHANGELOG.md` is empty, use `git log` as a fallback
export const printAutoChangelog = async () => {
  const { stdout: lastTag } = await execa('git', ['describe', '--abbrev=0'])

  if (valid(lastTag) === null) {
    throw new TypeError('Could not find last git tag.')
  }

  const { stdout: changelog } = await execa('git', [
    'log',
    '--pretty=format:* %s (%h)',
    `${lastTag}..HEAD`,
  ])

  if (changelog.trim() === '') {
    throw new TypeError('Empty changelog.')
  }

  // eslint-disable-next-line no-console, no-restricted-globals
  console.log(changelog.trim())
}

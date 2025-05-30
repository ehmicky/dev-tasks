import { ALL_CONTRIBUTORS_TYPES } from './all_contributors.js'
import { DOCKER_DIR } from './docker.js'

// Ignore those links
export const getExcludedLinks = () => EXCLUDED_LINKS.map(addExcludeLinkFlag)

const EXCLUDED_LINKS = [
  // Links to the GitHub page's issues
  'file:///issues',
  // `git` URLs
  '\\.git$',
  // Avoid rate limiting
  'linkedin.com',
  'medium.com/@ehmicky',
  'instagram.com',
  // All-contributors adds fake anchors in README.md
  `README.md#(${ALL_CONTRIBUTORS_TYPES.join('|')})-[\\w-]+$`,
  // Meant as a root URL, but does not work itself
  'https://npmmirror.com/mirrors/node',
  // Seems to always fail with 403 inside GitHub action
  'linux.die.net',
  'creativefabrica.com',
  // Sometimes fail with 403
  'freepik.com',
  // Sometimes fail with 429
  'gnu.org',
  // Sometimes fail with 502
  'unpkg.com',
  'bundlephobia',
  'fosstodon',
  // Used in tests
  'invalid-mirror.com',
  '//localhost',
  'cat.com',
  'dog.com',
  'koala.com',
  // Used in examples
  'my-user',
  'my-project',
  // Used in templates
  'template-name',
  // Emoji
  '%EF%B8%8F',
]

const addExcludeLinkFlag = (excludedLink) => `--exclude=${excludedLink}`

// Remap those links
export const getRemaps = () =>
  REMAPS.map(([source, destination]) => `--remap=${source}\\ ${destination}`)

const REMAPS = [
  // Local links to GitHub branches
  [`${DOCKER_DIR}/blob/[^/]+`, DOCKER_DIR],
]

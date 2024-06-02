import { ALL_CONTRIBUTORS_TYPES } from './all_contributors.js'
import { DOCKER_DIR } from './docker.js'

// Ignore those links
export const getExcludedLinks = () => EXCLUDED_LINKS.map(addExcludeLinkFlag)

const EXCLUDED_LINKS = [
  // Links to the GitHub page's issues
  'file:///issues',
  // `git` URLs
  '\\.git$',
  // Avoid LinkedIn rate limiting
  'linkedin',
  // All-contributors adds fake anchors in README.md
  `README.md#(${ALL_CONTRIBUTORS_TYPES.join('|')})-[\\w]+$`,
]

const addExcludeLinkFlag = (excludedLink) => `--exclude=${excludedLink}`

// Remap those links
export const getRemaps = () =>
  REMAPS.map(([source, destination]) => `--remap=${source}\\ ${destination}`)

const REMAPS = [
  // Local links to GitHub branches
  [`${DOCKER_DIR}/blob/[^/]+`, DOCKER_DIR],
]

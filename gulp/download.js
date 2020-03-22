import { createWriteStream } from 'fs'
import { pipeline } from 'stream'
import { promisify } from 'util'

import got from 'got'

const pPipeline = promisify(pipeline)

const CODECOV_DIST = `${__dirname}/../src/tasks/unit/codecov.sh`
const CODECOV_URL = 'https://codecov.io/bash'

// `codecov` upload script is in Bash and the repository does not have any
// `package.json` so we can't use `npm`.
// Using `curl` to retrieve it is slower in CI and randomly fails so we
// run this Gulp task instead anytime the script has a new version.
// Done in streaming mode for best performance.

export const download = async function () {
  const response = await got.stream(CODECOV_URL)
  const stream = createWriteStream(CODECOV_DIST)
  await pPipeline(response, stream)
}

// eslint-disable-next-line fp/no-mutation
download.description = 'Download latest codecov upload script'

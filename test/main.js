// eslint-disable-next-line node/no-missing-import, import/no-unresolved
import { build } from '@ehmicky/dev-tasks'
// eslint-disable-next-line node/no-missing-import, import/no-unresolved, import/no-unassigned-import
import '@ehmicky/dev-tasks/register.js'
import test from 'ava'

test('Dummy test', (t) => {
  t.is(typeof build, 'function')
})

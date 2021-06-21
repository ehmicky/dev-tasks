import { build } from '@ehmicky/dev-tasks'
// eslint-disable-next-line import/no-unassigned-import
import '@ehmicky/dev-tasks/register.js'
import test from 'ava'

test('Dummy test', (t) => {
  t.is(typeof build, 'function')
})

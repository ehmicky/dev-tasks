import isCi from 'is-ci'

// `eslint` and `prettier` are run twice:
//  - First, checks and prints errors
//  - Then, prints them (unless in CI)
export const runTwice = async (runMethod) => {
  try {
    await runMethod(false)
  } catch (error) {
    await applyAutoFix(runMethod)
    throw error
  }
}

const applyAutoFix = async (runMethod) => {
  if (isCi) {
    return
  }

  try {
    await runMethod(true)
  } catch {}
}

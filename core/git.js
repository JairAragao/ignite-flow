const { execSync } = require('child_process')

function exec(cmd) {
  return execSync(cmd, { encoding: 'utf-8' }).trim()
}

function getCurrentBranch() {
  return exec('git rev-parse --abbrev-ref HEAD')
}

function branchExists(branch) {
  try {
    exec(`git rev-parse --verify ${branch}`)
    return true
  } catch {
    return false
  }
}

function getLocalBranches() {
  return exec('git branch --format="%(refname:short)"')
    .split('\n')
    .map(b => b.trim())
    .filter(Boolean)
}

function getRemoteBranches() {
  try {
    return exec('git branch -r --format="%(refname:short)"')
      .split('\n')
      .map(b => b.trim().replace(/^origin\//, ''))
      .filter(Boolean)
  } catch {
    return []
  }
}

function checkout(branch) {
  exec(`git checkout ${branch}`)
}

function createAndCheckout(branch, from) {
  exec(`git checkout -b ${branch} ${from}`)
}

function pull(branch) {
  try {
    exec(`git pull origin ${branch}`)
  } catch {
    // remote may not exist yet
  }
}

function merge(branch, noFf = true) {
  const flag = noFf ? '--no-ff' : ''
  exec(`git merge ${flag} ${branch}`)
}

function deleteBranch(branch) {
  exec(`git branch -d ${branch}`)
}

function getTags() {
  try {
    return exec('git tag --sort=-v:refname')
      .split('\n')
      .filter(Boolean)
  } catch {
    return []
  }
}

function createTag(tag, message) {
  exec(`git tag -a ${tag} -m "${message}"`)
}

function hasUncommittedChanges() {
  try {
    exec('git diff-index --quiet HEAD --')
    return false
  } catch {
    return true
  }
}

function getLog(from, to) {
  try {
    return exec(`git log ${from}..${to} --oneline`)
      .split('\n')
      .filter(Boolean)
  } catch {
    return []
  }
}

function pushBranch(branch) {
  exec(`git push origin ${branch}`)
}

function pushTag(tag) {
  exec(`git push origin ${tag}`)
}

module.exports = {
  exec,
  getCurrentBranch,
  branchExists,
  getLocalBranches,
  getRemoteBranches,
  checkout,
  createAndCheckout,
  pull,
  merge,
  deleteBranch,
  getTags,
  createTag,
  hasUncommittedChanges,
  getLog,
  pushBranch,
  pushTag,
}

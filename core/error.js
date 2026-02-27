const chalk = require('chalk')

class IgniteError extends Error {
  constructor(message) {
    super(message)
    this.name = 'IgniteError'
  }
}

class NotConfiguredError extends IgniteError {
  constructor() {
    super('not_configured')
    this.name = 'NotConfiguredError'
  }
}

class UncommittedChangesError extends IgniteError {
  constructor() {
    super('uncommitted_changes')
    this.name = 'UncommittedChangesError'
  }
}

class MergeConflictError extends IgniteError {
  constructor(source, target) {
    super('merge_conflict')
    this.name = 'MergeConflictError'
    this.source = source
    this.target = target
  }
}

class InvalidBranchError extends IgniteError {
  constructor(branch) {
    super('invalid_branch')
    this.name = 'InvalidBranchError'
    this.branch = branch
  }
}

function handleError(err, t) {
  if (err instanceof NotConfiguredError) {
    console.error(chalk.red(t('common.notConfigured')))
  } else if (err instanceof UncommittedChangesError) {
    console.error(chalk.red(t('common.uncommittedChanges')))
  } else if (err instanceof MergeConflictError) {
    console.error(chalk.red(t('error.mergeConflict', { source: err.source, target: err.target })))
    console.error(chalk.yellow(t('error.mergeConflictHint')))
  } else if (err instanceof InvalidBranchError) {
    console.error(chalk.red(t('error.invalidBranch', { branch: err.branch })))
  } else {
    console.error(chalk.red(err.message))
  }
  process.exit(1)
}

module.exports = {
  IgniteError,
  NotConfiguredError,
  UncommittedChangesError,
  MergeConflictError,
  InvalidBranchError,
  handleError,
}

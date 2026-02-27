const chalk = require('chalk')
const git = require('../core/git')
const { t } = require('../core/i18n')
const { withConfig, requireCleanWorkTree } = require('../core/middleware')
const { MergeConflictError, handleError } = require('../core/error')

const sync = withConfig((cfg, options = {}) => {
  requireCleanWorkTree()

  const currentBranch = git.getCurrentBranch()

  // Detect base branch
  let baseBranch
  if (currentBranch.startsWith(cfg.featurePrefix) || currentBranch.startsWith(cfg.releasePrefix)) {
    baseBranch = cfg.developBranch
  } else if (currentBranch.startsWith(cfg.hotfixPrefix)) {
    baseBranch = cfg.mainBranch
  } else {
    console.log(chalk.yellow(t('sync.alreadyOnBase', { branch: currentBranch })))
    return
  }

  console.log(chalk.cyan.bold(`\n  ${t('sync.title')}\n`))
  console.log(chalk.cyan(t('sync.syncing', { branch: currentBranch, base: baseBranch })))

  if (options.dryRun) {
    console.log(chalk.yellow(t('common.dryRun')))
    return
  }

  // Pull base branch
  console.log(chalk.cyan(t('common.updating', { branch: baseBranch })))
  git.checkout(baseBranch)
  git.pull(baseBranch)

  // Back to current and merge
  git.checkout(currentBranch)
  const mergeMsg = `Merge ${baseBranch} into ${currentBranch} [ignite-flow sync]`

  if (!git.safeMerge(baseBranch, mergeMsg)) {
    git.abortMerge()
    handleError(new MergeConflictError(baseBranch, currentBranch), t)
  }

  console.log(chalk.green.bold(`\n${t('sync.success', { branch: currentBranch, base: baseBranch })}`))
})

module.exports = sync

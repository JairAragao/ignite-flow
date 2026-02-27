const chalk = require('chalk')
const git = require('../core/git')
const { t } = require('../core/i18n')
const { withConfig, requireCleanWorkTree } = require('../core/middleware')
const { getLastVersion, bumpMinor, formatTag } = require('../core/version')
const { MergeConflictError, handleError } = require('../core/error')

const releaseApply = withConfig((cfg, options = {}) => {
  requireCleanWorkTree()

  const currentBranch = git.getCurrentBranch()
  if (currentBranch !== cfg.developBranch) {
    console.error(chalk.red(t('common.needDevelop', { branch: cfg.developBranch })))
    process.exit(1)
  }

  const lastTag = getLastVersion(cfg)
  const newVersion = bumpMinor(lastTag)
  const tagName = formatTag(cfg, newVersion)
  const mergeMsg = `Merge ${cfg.developBranch} into ${cfg.mainBranch} [ignite-flow]`

  console.log(chalk.cyan.bold(`\n  ${t('releaseApply.title')}\n`))
  console.log(chalk.gray(`  ${t('common.lastTag', { tag: `${cfg.versionTagPrefix}${lastTag}` })}`))
  console.log(chalk.white(`  ${t('common.newTag', { tag: tagName })}\n`))

  if (options.dryRun) {
    console.log(chalk.yellow(t('common.dryRun')))
    return
  }

  // Pull develop
  console.log(chalk.cyan(t('common.updating', { branch: cfg.developBranch })))
  git.pull(cfg.developBranch)

  // Checkout main and pull
  console.log(chalk.cyan(t('common.updating', { branch: cfg.mainBranch })))
  git.checkout(cfg.mainBranch)
  git.pull(cfg.mainBranch)

  // Merge develop into main
  console.log(chalk.cyan(t('common.mergingFrom', { from: cfg.developBranch, to: cfg.mainBranch })))
  if (!git.safeMerge(cfg.developBranch, mergeMsg)) {
    git.abortMerge()
    git.checkout(cfg.developBranch)
    handleError(new MergeConflictError(cfg.developBranch, cfg.mainBranch), t)
  }

  // Create tag
  console.log(chalk.cyan(t('common.creatingTag', { tag: tagName })))
  git.createTag(tagName, `Release: ${newVersion}`)

  // Push
  if (!options.noPush) {
    console.log(chalk.cyan(t('common.pushing', { targets: 'main, tag' })))
    git.pushBranch(cfg.mainBranch)
    git.pushTag(tagName)
  } else {
    console.log(chalk.yellow(t('common.skippingPush')))
  }

  // Back to develop
  git.checkout(cfg.developBranch)

  console.log(chalk.green.bold(`\n${t('releaseApply.success', { tag: tagName })}`))
  console.log(chalk.gray(t('common.backToBranch', { branch: cfg.developBranch })))
})

module.exports = releaseApply

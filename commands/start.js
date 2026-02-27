const chalk = require('chalk')
const git = require('../core/git')
const { t } = require('../core/i18n')
const { withConfig, requireCleanWorkTree } = require('../core/middleware')

const start = withConfig((cfg, type, name, options = {}) => {
  if (!name) {
    console.error(chalk.red(t('start.missingName')))
    process.exit(1)
  }

  const validTypes = {
    feature: { prefix: cfg.featurePrefix, from: cfg.developBranch },
    hotfix: { prefix: cfg.hotfixPrefix, from: cfg.mainBranch },
    release: { prefix: cfg.releasePrefix, from: cfg.developBranch },
  }

  if (!validTypes[type]) {
    console.error(chalk.red(t('start.invalidType', { type })))
    process.exit(1)
  }

  const { prefix, from } = validTypes[type]
  const branchName = `${prefix}${name}`

  if (!git.isValidBranchName(branchName)) {
    console.error(chalk.red(t('error.invalidBranchChars')))
    process.exit(1)
  }

  if (git.branchExists(branchName)) {
    console.error(chalk.red(t('start.branchExists', { branch: branchName })))
    process.exit(1)
  }

  requireCleanWorkTree()

  if (options.dryRun) {
    console.log(chalk.cyan(t('start.creating', { branch: branchName, from })))
    console.log(chalk.yellow(t('common.dryRun')))
    return
  }

  console.log(chalk.cyan(t('common.updating', { branch: from })))
  git.checkout(from)
  git.pull(from)

  console.log(chalk.cyan(t('start.creating', { branch: branchName, from })))
  git.createAndCheckout(branchName, from)

  console.log(chalk.green.bold(`\n${t('start.success', { branch: branchName })}`))
  console.log(chalk.gray(t('start.basedOn', { from })))
})

module.exports = start

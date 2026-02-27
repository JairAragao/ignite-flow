const inquirer = require('inquirer')
const chalk = require('chalk')
const git = require('../core/git')
const { t } = require('../core/i18n')
const { withConfig, requireCleanWorkTree } = require('../core/middleware')
const { getLastVersion, bumpMajor, formatTag } = require('../core/version')

const bump = withConfig(async (cfg, options = {}) => {
  requireCleanWorkTree()

  const currentBranch = git.getCurrentBranch()
  if (currentBranch !== cfg.mainBranch) {
    console.error(chalk.red(t('bump.needMain', { branch: cfg.mainBranch })))
    process.exit(1)
  }

  const lastTag = getLastVersion(cfg)
  const newVersion = bumpMajor(lastTag)
  const tagName = formatTag(cfg, newVersion)

  console.log(chalk.cyan.bold(`\n  ${t('bump.title')}\n`))
  console.log(chalk.gray(`  ${t('common.lastTag', { tag: `${cfg.versionTagPrefix}${lastTag}` })}`))
  console.log(chalk.white(`  ${t('common.newTag', { tag: tagName })}\n`))

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: t('bump.confirm', { from: `${cfg.versionTagPrefix}${lastTag}`, to: tagName }),
      default: false,
    },
  ])

  if (!confirm) return

  if (options.dryRun) {
    console.log(chalk.yellow(t('common.dryRun')))
    return
  }

  git.pull(cfg.mainBranch)

  console.log(chalk.cyan(t('common.creatingTag', { tag: tagName })))
  git.createTag(tagName, `Major bump: ${newVersion}`)

  if (!options.noPush) {
    console.log(chalk.cyan(t('common.pushing', { targets: 'tag' })))
    git.pushTag(tagName)
  } else {
    console.log(chalk.yellow(t('common.skippingPush')))
  }

  console.log(chalk.green.bold(`\n${t('bump.success', { tag: tagName })}`))
})

module.exports = bump

const chalk = require('chalk')
const git = require('../core/git')
const { t } = require('../core/i18n')
const { withConfig } = require('../core/middleware')

const status = withConfig((cfg) => {
  const currentBranch = git.getCurrentBranch()
  const branches = git.getLocalBranches()

  const features = branches.filter(b => b.startsWith(cfg.featurePrefix))
  const hotfixes = branches.filter(b => b.startsWith(cfg.hotfixPrefix))
  const releases = branches.filter(b => b.startsWith(cfg.releasePrefix))

  console.log(chalk.cyan.bold(`\n  ${t('status.title')}\n`))

  console.log(chalk.white(`  ${t('status.currentBranch', { branch: chalk.green.bold(currentBranch) })}`))
  console.log(chalk.gray(`  Main:    ${cfg.mainBranch}`))
  console.log(chalk.gray(`  Develop: ${cfg.developBranch}`))
  console.log()

  if (currentBranch.startsWith(cfg.featurePrefix)) {
    console.log(chalk.yellow(`  ${t('status.inFeature', { name: currentBranch.replace(cfg.featurePrefix, '') })}`))
  } else if (currentBranch.startsWith(cfg.hotfixPrefix)) {
    console.log(chalk.red(`  ${t('status.inHotfix', { name: currentBranch.replace(cfg.hotfixPrefix, '') })}`))
  } else if (currentBranch.startsWith(cfg.releasePrefix)) {
    console.log(chalk.magenta(`  ${t('status.inRelease', { name: currentBranch.replace(cfg.releasePrefix, '') })}`))
  }

  if (features.length > 0) {
    console.log(chalk.yellow.bold(`  ${t('status.features', { count: features.length })}`))
    features.forEach(f => {
      const marker = f === currentBranch ? chalk.green(' *') : '  '
      console.log(`  ${marker} ${f}`)
    })
    console.log()
  }

  if (hotfixes.length > 0) {
    console.log(chalk.red.bold(`  ${t('status.hotfixes', { count: hotfixes.length })}`))
    hotfixes.forEach(h => {
      const marker = h === currentBranch ? chalk.green(' *') : '  '
      console.log(`  ${marker} ${h}`)
    })
    console.log()
  }

  if (releases.length > 0) {
    console.log(chalk.magenta.bold(`  ${t('status.releases', { count: releases.length })}`))
    releases.forEach(r => {
      const marker = r === currentBranch ? chalk.green(' *') : '  '
      console.log(`  ${marker} ${r}`)
    })
    console.log()
  }

  if (features.length === 0 && hotfixes.length === 0 && releases.length === 0) {
    console.log(chalk.gray(`  ${t('status.noBranches')}\n`))
  }

  const tags = git.getTags()
  if (tags.length > 0) {
    const recentTags = tags.slice(0, 5)
    console.log(chalk.white.bold(`  ${t('status.lastTags')}`))
    recentTags.forEach(tag => console.log(chalk.gray(`    ${tag}`)))
    console.log()
  }
})

module.exports = status

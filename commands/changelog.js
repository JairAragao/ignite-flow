const chalk = require('chalk')
const git = require('../core/git')
const { t } = require('../core/i18n')
const { withConfig } = require('../core/middleware')
const { getLastVersion, formatTag } = require('../core/version')

const changelog = withConfig((cfg) => {
  const tags = git.getTags()

  if (tags.length < 1) {
    console.log(chalk.yellow(`\n  ${t('changelog.noTags')}\n`))
    return
  }

  console.log(chalk.cyan.bold(`\n  ${t('changelog.title')}\n`))

  const prefix = cfg.versionTagPrefix
  const versionTags = tags.filter(tag => tag.replace(prefix, '').match(/^\d+\.\d+\.\d+/))

  if (versionTags.length < 2) {
    // Show commits from first tag to HEAD
    const from = versionTags[0] || tags[0]
    console.log(chalk.white(`  ${t('changelog.between', { from, to: 'HEAD' })}\n`))
    const commits = git.getLog(from, 'HEAD')
    if (commits.length === 0) {
      console.log(chalk.gray(`  ${t('changelog.noCommits')}`))
    } else {
      commits.forEach(c => console.log(chalk.gray(`    ${c}`)))
    }
    console.log()
    return
  }

  // Show changelog between last 5 tag pairs
  const maxPairs = Math.min(versionTags.length - 1, 5)
  for (let i = 0; i < maxPairs; i++) {
    const to = versionTags[i]
    const from = versionTags[i + 1]
    console.log(chalk.white(`  ${t('changelog.between', { from, to })}\n`))
    const commits = git.getLog(from, to)
    if (commits.length === 0) {
      console.log(chalk.gray(`    ${t('changelog.noCommits')}`))
    } else {
      commits.forEach(c => console.log(chalk.gray(`    ${c}`)))
    }
    console.log()
  }
})

module.exports = changelog

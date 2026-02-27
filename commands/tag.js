const chalk = require('chalk')
const git = require('../core/git')
const { t } = require('../core/i18n')
const { withConfig } = require('../core/middleware')

const tag = withConfig((cfg) => {
  const tags = git.getTags()

  if (tags.length === 0) {
    console.log(chalk.yellow(`\n  ${t('tag.noTags')}\n`))
    return
  }

  const prefix = cfg.versionTagPrefix

  console.log(chalk.cyan.bold(`\n  ${t('tag.title')}\n`))
  console.log(chalk.gray(`  ${t('tag.prefixConfig', { prefix: prefix || t('init.noPrefix') })}\n`))

  tags.forEach(item => {
    const isVersion = item.replace(prefix, '').match(/^\d+\.\d+\.\d+/)
    if (isVersion) {
      console.log(chalk.green(`    ${item}`))
    } else {
      console.log(chalk.gray(`    ${item}`))
    }
  })

  console.log()
})

module.exports = tag

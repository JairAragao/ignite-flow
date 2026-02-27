const chalk = require('chalk')
const config = require('../core/config')
const git = require('../core/git')

function tag() {
  const cfg = config.load()
  if (!cfg) {
    console.error(chalk.red('Ignite Flow nao configurado. Execute "ignite init" primeiro.'))
    process.exit(1)
  }

  const tags = git.getTags()

  if (tags.length === 0) {
    console.log(chalk.yellow('\n  Nenhuma tag encontrada.\n'))
    return
  }

  const prefix = cfg.versionTagPrefix

  console.log(chalk.cyan.bold('\n  Ignite Flow - Tags\n'))
  console.log(chalk.gray(`  Prefixo configurado: "${prefix || '(sem prefixo)'}"\n`))

  tags.forEach(t => {
    const isVersion = t.replace(prefix, '').match(/^\d+\.\d+\.\d+/)
    if (isVersion) {
      console.log(chalk.green(`    ${t}`))
    } else {
      console.log(chalk.gray(`    ${t}`))
    }
  })

  console.log()
}

module.exports = tag

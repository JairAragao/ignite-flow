const chalk = require('chalk')
const config = require('../core/config')
const git = require('../core/git')

function start(type, name) {
  const cfg = config.load()
  if (!cfg) {
    console.error(chalk.red('Ignite Flow nao configurado. Execute "ignite init" primeiro.'))
    process.exit(1)
  }

  if (!name) {
    console.error(chalk.red('Informe o nome da branch. Ex: ignite start feature minha-feature'))
    process.exit(1)
  }

  const validTypes = {
    feature: { prefix: cfg.featurePrefix, from: cfg.developBranch },
    hotfix: { prefix: cfg.hotfixPrefix, from: cfg.mainBranch },
    release: { prefix: cfg.releasePrefix, from: cfg.developBranch },
  }

  if (!validTypes[type]) {
    console.error(chalk.red(`Tipo invalido: "${type}". Use: feature, hotfix ou release.`))
    process.exit(1)
  }

  const { prefix, from } = validTypes[type]
  const branchName = `${prefix}${name}`

  if (git.branchExists(branchName)) {
    console.error(chalk.red(`Branch "${branchName}" ja existe.`))
    process.exit(1)
  }

  if (git.hasUncommittedChanges()) {
    console.error(chalk.red('Voce tem alteracoes nao commitadas. Commite ou stash antes de continuar.'))
    process.exit(1)
  }

  console.log(chalk.cyan(`Atualizando "${from}"...`))
  git.checkout(from)
  git.pull(from)

  console.log(chalk.cyan(`Criando branch "${branchName}" a partir de "${from}"...`))
  git.createAndCheckout(branchName, from)

  console.log(chalk.green.bold(`\nBranch "${branchName}" criada e checkout realizado!`))
  console.log(chalk.gray(`Baseada em: ${from}`))
}

module.exports = start

const chalk = require('chalk')
const config = require('../core/config')
const git = require('../core/git')

function releaseApply() {
  const cfg = config.load()
  if (!cfg) {
    console.error(chalk.red('Ignite Flow nao configurado. Execute "ignite init" primeiro.'))
    process.exit(1)
  }

  if (git.hasUncommittedChanges()) {
    console.error(chalk.red('Voce tem alteracoes nao commitadas. Commite ou stash antes de continuar.'))
    process.exit(1)
  }

  const currentBranch = git.getCurrentBranch()
  if (currentBranch !== cfg.developBranch) {
    console.error(chalk.red(`Voce precisa estar na branch "${cfg.developBranch}" para executar release apply.`))
    process.exit(1)
  }

  const lastTag = getLastVersion(cfg)
  const newVersion = bumpMinor(lastTag)
  const tagName = `${cfg.versionTagPrefix}${newVersion}`

  console.log(chalk.cyan.bold('\n  Ignite Flow - Release Apply (fast)\n'))
  console.log(chalk.gray(`  Ultima tag: ${cfg.versionTagPrefix}${lastTag}`))
  console.log(chalk.white(`  Nova tag:   ${tagName}\n`))

  // Pull develop
  console.log(chalk.cyan(`Atualizando "${cfg.developBranch}"...`))
  git.pull(cfg.developBranch)

  // Checkout main and pull
  console.log(chalk.cyan(`Atualizando "${cfg.mainBranch}"...`))
  git.checkout(cfg.mainBranch)
  git.pull(cfg.mainBranch)

  // Merge develop into main
  console.log(chalk.cyan(`Fazendo merge de "${cfg.developBranch}" em "${cfg.mainBranch}"...`))
  git.merge(cfg.developBranch)

  // Create tag
  console.log(chalk.cyan(`Criando tag "${tagName}"...`))
  git.createTag(tagName, `Release: ${newVersion}`)

  // Push main and tag
  console.log(chalk.cyan('Fazendo push (main e tag)...'))
  git.pushBranch(cfg.mainBranch)
  git.pushTag(tagName)

  // Back to develop
  git.checkout(cfg.developBranch)

  console.log(chalk.green.bold(`\nRelease apply concluido! Tag: ${tagName}`))
  console.log(chalk.gray(`Voce esta de volta na branch "${cfg.developBranch}".`))
}

// Helpers
function getLastVersion(cfg) {
  const tags = git.getTags()
  const prefix = cfg.versionTagPrefix
  const versionTags = tags
    .map(t => t.replace(prefix, ''))
    .filter(t => /^\d+\.\d+\.\d+/.test(t))

  return versionTags.length > 0 ? versionTags[0] : '0.0.0'
}

function bumpMinor(version) {
  const parts = version.split('.')
  parts[1] = parseInt(parts[1] || 0) + 1
  parts[2] = 0
  return parts.join('.')
}

module.exports = releaseApply

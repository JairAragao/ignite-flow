const chalk = require('chalk')
const config = require('../core/config')
const git = require('../core/git')

function status() {
  const cfg = config.load()
  if (!cfg) {
    console.error(chalk.red('Ignite Flow nao configurado. Execute "ignite init" primeiro.'))
    process.exit(1)
  }

  const currentBranch = git.getCurrentBranch()
  const branches = git.getLocalBranches()

  const features = branches.filter(b => b.startsWith(cfg.featurePrefix))
  const hotfixes = branches.filter(b => b.startsWith(cfg.hotfixPrefix))
  const releases = branches.filter(b => b.startsWith(cfg.releasePrefix))

  console.log(chalk.cyan.bold('\n  Ignite Flow - Status\n'))

  console.log(chalk.white(`  Branch atual: ${chalk.green.bold(currentBranch)}`))
  console.log(chalk.gray(`  Main:    ${cfg.mainBranch}`))
  console.log(chalk.gray(`  Develop: ${cfg.developBranch}`))
  console.log()

  // Detect current branch type
  if (currentBranch.startsWith(cfg.featurePrefix)) {
    console.log(chalk.yellow(`  Voce esta em uma feature: ${currentBranch.replace(cfg.featurePrefix, '')}`))
  } else if (currentBranch.startsWith(cfg.hotfixPrefix)) {
    console.log(chalk.red(`  Voce esta em uma hotfix: ${currentBranch.replace(cfg.hotfixPrefix, '')}`))
  } else if (currentBranch.startsWith(cfg.releasePrefix)) {
    console.log(chalk.magenta(`  Voce esta em uma release: ${currentBranch.replace(cfg.releasePrefix, '')}`))
  }

  if (features.length > 0) {
    console.log(chalk.yellow.bold(`  Features (${features.length}):`))
    features.forEach(f => {
      const marker = f === currentBranch ? chalk.green(' *') : '  '
      console.log(`  ${marker} ${f}`)
    })
    console.log()
  }

  if (hotfixes.length > 0) {
    console.log(chalk.red.bold(`  Hotfixes (${hotfixes.length}):`))
    hotfixes.forEach(h => {
      const marker = h === currentBranch ? chalk.green(' *') : '  '
      console.log(`  ${marker} ${h}`)
    })
    console.log()
  }

  if (releases.length > 0) {
    console.log(chalk.magenta.bold(`  Releases (${releases.length}):`))
    releases.forEach(r => {
      const marker = r === currentBranch ? chalk.green(' *') : '  '
      console.log(`  ${marker} ${r}`)
    })
    console.log()
  }

  if (features.length === 0 && hotfixes.length === 0 && releases.length === 0) {
    console.log(chalk.gray('  Nenhuma branch de feature, hotfix ou release ativa.\n'))
  }

  // Last tags
  const tags = git.getTags()
  if (tags.length > 0) {
    const recentTags = tags.slice(0, 5)
    console.log(chalk.white.bold(`  Ultimas tags:`))
    recentTags.forEach(t => console.log(chalk.gray(`    ${t}`)))
    console.log()
  }
}

module.exports = status

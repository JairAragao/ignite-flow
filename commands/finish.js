const inquirer = require('inquirer')
const chalk = require('chalk')
const config = require('../core/config')
const git = require('../core/git')

async function finish() {
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

  let type, branchName

  if (currentBranch.startsWith(cfg.featurePrefix)) {
    type = 'feature'
    branchName = currentBranch.replace(cfg.featurePrefix, '')
  } else if (currentBranch.startsWith(cfg.hotfixPrefix)) {
    type = 'hotfix'
    branchName = currentBranch.replace(cfg.hotfixPrefix, '')
  } else if (currentBranch.startsWith(cfg.releasePrefix)) {
    type = 'release'
    branchName = currentBranch.replace(cfg.releasePrefix, '')
  } else {
    console.error(chalk.red('Voce nao esta em uma branch de feature, hotfix ou release.'))
    process.exit(1)
  }

  console.log(chalk.cyan(`\nFinalizando ${type}: ${branchName}`))
  console.log(chalk.gray(`Branch atual: ${currentBranch}\n`))

  if (type === 'feature') {
    await finishFeature(cfg, currentBranch)
  } else if (type === 'hotfix') {
    await finishHotfix(cfg, currentBranch, branchName)
  } else if (type === 'release') {
    await finishRelease(cfg, currentBranch, branchName)
  }
}

async function finishFeature(cfg, currentBranch) {
  console.log(chalk.cyan(`Fazendo merge em "${cfg.developBranch}"...`))
  git.checkout(cfg.developBranch)
  git.pull(cfg.developBranch)
  git.merge(currentBranch)

  const { deleteBranch } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'deleteBranch',
      message: `Deseja deletar a branch "${currentBranch}"?`,
      default: true,
    },
  ])

  if (deleteBranch) {
    git.deleteBranch(currentBranch)
    console.log(chalk.gray(`Branch "${currentBranch}" deletada.`))
  }

  const { push } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'push',
      message: `Deseja fazer push de "${cfg.developBranch}"?`,
      default: true,
    },
  ])

  if (push) {
    git.pushBranch(cfg.developBranch)
  }

  console.log(chalk.green.bold(`\nFeature finalizada com sucesso!`))
}

async function finishHotfix(cfg, currentBranch, name) {
  const lastTag = getLastVersion(cfg)
  const newVersion = bumpPatch(lastTag)
  const tagName = `${cfg.versionTagPrefix}${newVersion}`

  console.log(chalk.gray(`  Ultima tag: ${cfg.versionTagPrefix}${lastTag}`))
  console.log(chalk.white(`  Nova tag:   ${tagName}\n`))

  // Merge into main
  console.log(chalk.cyan(`Fazendo merge em "${cfg.mainBranch}"...`))
  git.checkout(cfg.mainBranch)
  git.pull(cfg.mainBranch)
  git.merge(currentBranch)

  // Create tag
  console.log(chalk.cyan(`Criando tag "${tagName}"...`))
  git.createTag(tagName, `Hotfix: ${name}`)

  // Merge into develop
  console.log(chalk.cyan(`Fazendo merge em "${cfg.developBranch}"...`))
  git.checkout(cfg.developBranch)
  git.pull(cfg.developBranch)
  git.merge(currentBranch)

  // Delete branch
  git.deleteBranch(currentBranch)
  console.log(chalk.gray(`Branch "${currentBranch}" deletada.`))

  // Push
  console.log(chalk.cyan('Fazendo push (main, develop e tag)...'))
  git.pushBranch(cfg.mainBranch)
  git.pushBranch(cfg.developBranch)
  git.pushTag(tagName)

  console.log(chalk.green.bold(`\nHotfix finalizada com sucesso! Tag: ${tagName}`))
}

async function finishRelease(cfg, currentBranch, name) {
  const lastTag = getLastVersion(cfg)
  const newVersion = bumpMinor(lastTag)
  const tagName = `${cfg.versionTagPrefix}${newVersion}`

  console.log(chalk.gray(`  Ultima tag: ${cfg.versionTagPrefix}${lastTag}`))
  console.log(chalk.white(`  Nova tag:   ${tagName}\n`))

  // Merge into main
  console.log(chalk.cyan(`Fazendo merge em "${cfg.mainBranch}"...`))
  git.checkout(cfg.mainBranch)
  git.pull(cfg.mainBranch)
  git.merge(currentBranch)

  // Create tag
  console.log(chalk.cyan(`Criando tag "${tagName}"...`))
  git.createTag(tagName, `Release: ${name}`)

  // Merge into develop
  console.log(chalk.cyan(`Fazendo merge em "${cfg.developBranch}"...`))
  git.checkout(cfg.developBranch)
  git.pull(cfg.developBranch)
  git.merge(currentBranch)

  // Delete branch
  git.deleteBranch(currentBranch)
  console.log(chalk.gray(`Branch "${currentBranch}" deletada.`))

  // Push
  console.log(chalk.cyan('Fazendo push (main, develop e tag)...'))
  git.pushBranch(cfg.mainBranch)
  git.pushBranch(cfg.developBranch)
  git.pushTag(tagName)

  console.log(chalk.green.bold(`\nRelease finalizada com sucesso! Tag: ${tagName}`))
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

function bumpPatch(version) {
  const parts = version.split('.')
  parts[2] = parseInt(parts[2] || 0) + 1
  return parts.join('.')
}

function bumpMinor(version) {
  const parts = version.split('.')
  parts[1] = parseInt(parts[1] || 0) + 1
  parts[2] = 0
  return parts.join('.')
}

module.exports = finish

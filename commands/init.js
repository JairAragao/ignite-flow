const inquirer = require('inquirer')
const chalk = require('chalk')
const config = require('../core/config')
const git = require('../core/git')

async function init() {
  console.log(chalk.cyan.bold('\n  Ignite Flow - Configuracao inicial\n'))

  if (config.exists()) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Ja existe uma configuracao (.igniteflow.json). Deseja sobrescrever?',
        default: false,
      },
    ])
    if (!overwrite) {
      console.log(chalk.yellow('Configuracao mantida.'))
      return
    }
  }

  const branches = git.getLocalBranches()
  const remoteBranches = git.getRemoteBranches()
  const allBranches = [...new Set([...branches, ...remoteBranches])]

  // Detect main branch
  let suggestedMain = 'main'
  if (allBranches.includes('main')) {
    suggestedMain = 'main'
  } else if (allBranches.includes('master')) {
    suggestedMain = 'master'
  }

  const { mainBranch } = await inquirer.prompt([
    {
      type: 'input',
      name: 'mainBranch',
      message: 'Branch principal (producao):',
      default: suggestedMain,
    },
  ])

  // Detect develop branch
  let suggestedDevelop = 'develop'
  if (allBranches.includes('develop')) {
    suggestedDevelop = 'develop'
  } else if (allBranches.includes('development')) {
    suggestedDevelop = 'development'
  }

  const { developBranch } = await inquirer.prompt([
    {
      type: 'input',
      name: 'developBranch',
      message: 'Branch de desenvolvimento:',
      default: suggestedDevelop,
    },
  ])

  // Create develop if it doesn't exist
  if (!allBranches.includes(developBranch)) {
    console.log(chalk.yellow(`Branch "${developBranch}" nao existe. Criando a partir de "${mainBranch}"...`))
    try {
      git.checkout(mainBranch)
      git.createAndCheckout(developBranch, mainBranch)
      console.log(chalk.green(`Branch "${developBranch}" criada com sucesso.`))
    } catch (err) {
      console.error(chalk.red(`Erro ao criar branch "${developBranch}": ${err.message}`))
      process.exit(1)
    }
  }

  // Prefixes
  console.log(chalk.cyan('\n  Prefixos de branches\n'))

  const { featurePrefix } = await inquirer.prompt([
    {
      type: 'input',
      name: 'featurePrefix',
      message: 'Prefixo para features:',
      default: 'feature/',
    },
  ])

  const { hotfixPrefix } = await inquirer.prompt([
    {
      type: 'input',
      name: 'hotfixPrefix',
      message: 'Prefixo para hotfixes:',
      default: 'hotfix/',
    },
  ])

  const { releasePrefix } = await inquirer.prompt([
    {
      type: 'input',
      name: 'releasePrefix',
      message: 'Prefixo para releases:',
      default: 'release/',
    },
  ])

  // Version tag prefix
  console.log(chalk.cyan('\n  Versionamento\n'))

  const { versionTagPrefix } = await inquirer.prompt([
    {
      type: 'list',
      name: 'versionTagPrefix',
      message: 'Tags de versao devem ter prefixo "v" (ex: v1.0.0)?',
      choices: [
        { name: 'Sim - v1.0.0', value: 'v' },
        { name: 'Nao - 1.0.0', value: '' },
      ],
      default: 0,
    },
  ])

  const cfg = {
    mainBranch,
    developBranch,
    featurePrefix,
    hotfixPrefix,
    releasePrefix,
    versionTagPrefix,
  }

  config.save(cfg)

  console.log(chalk.green.bold('\n  Ignite Flow configurado com sucesso!'))
  console.log(chalk.gray(`  Arquivo: ${config.CONFIG_FILE}`))
  console.log()
  console.log(chalk.white('  Configuracao salva:'))
  console.log(chalk.gray(`    Branch principal:    ${mainBranch}`))
  console.log(chalk.gray(`    Branch develop:      ${developBranch}`))
  console.log(chalk.gray(`    Feature prefix:      ${featurePrefix}`))
  console.log(chalk.gray(`    Hotfix prefix:       ${hotfixPrefix}`))
  console.log(chalk.gray(`    Release prefix:      ${releasePrefix}`))
  console.log(chalk.gray(`    Tag prefix:          ${versionTagPrefix || '(sem prefixo)'}`))
  console.log()
}

module.exports = init

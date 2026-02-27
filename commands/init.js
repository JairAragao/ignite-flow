const inquirer = require('inquirer')
const chalk = require('chalk')
const config = require('../core/config')
const git = require('../core/git')
const { t, setLang } = require('../core/i18n')

async function init() {
  // Language selection first (always bilingual)
  const { language } = await inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      message: 'Selecione o idioma / Select language:',
      choices: [
        { name: 'Portugues', value: 'pt' },
        { name: 'English', value: 'en' },
        { name: 'Espanol', value: 'es' },
      ],
      default: 0,
    },
  ])
  setLang(language)

  console.log(chalk.cyan.bold(`\n  ${t('init.title')}\n`))

  if (config.exists()) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: t('init.overwriteConfirm'),
        default: false,
      },
    ])
    if (!overwrite) {
      console.log(chalk.yellow(t('init.configKept')))
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
      message: t('init.mainBranch'),
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
      message: t('init.developBranch'),
      default: suggestedDevelop,
    },
  ])

  // Create develop if it doesn't exist
  if (!allBranches.includes(developBranch)) {
    console.log(chalk.yellow(t('init.branchNotExists', { branch: developBranch, from: mainBranch })))
    try {
      git.checkout(mainBranch)
      git.createAndCheckout(developBranch, mainBranch)
      console.log(chalk.green(t('init.branchCreated', { branch: developBranch })))
      git.pushBranch(developBranch)
      console.log(chalk.green(t('init.branchPushed', { branch: developBranch })))
    } catch (err) {
      console.error(chalk.red(t('init.branchCreateError', { branch: developBranch, error: err.message })))
      process.exit(1)
    }
  }

  // Prefixes
  console.log(chalk.cyan(`\n  ${t('init.prefixesTitle')}\n`))

  const { featurePrefix } = await inquirer.prompt([
    {
      type: 'input',
      name: 'featurePrefix',
      message: t('init.featurePrefix'),
      default: 'feature/',
    },
  ])

  const { hotfixPrefix } = await inquirer.prompt([
    {
      type: 'input',
      name: 'hotfixPrefix',
      message: t('init.hotfixPrefix'),
      default: 'hotfix/',
    },
  ])

  const { releasePrefix } = await inquirer.prompt([
    {
      type: 'input',
      name: 'releasePrefix',
      message: t('init.releasePrefix'),
      default: 'release/',
    },
  ])

  // Version tag prefix
  console.log(chalk.cyan(`\n  ${t('init.versioningTitle')}\n`))

  const { versionTagPrefix } = await inquirer.prompt([
    {
      type: 'input',
      name: 'versionTagPrefix',
      message: t('init.versionTagQuestion'),
    },
  ])

  const cfg = {
    language,
    mainBranch,
    developBranch,
    featurePrefix,
    hotfixPrefix,
    releasePrefix,
    versionTagPrefix,
  }

  config.save(cfg)

  console.log(chalk.green.bold(`\n  ${t('init.successTitle')}`))
  console.log()
  console.log(chalk.white(`  ${t('init.savedConfig')}`))
  console.log(chalk.gray(`    ${t('init.labelMain')}    ${mainBranch}`))
  console.log(chalk.gray(`    ${t('init.labelDevelop')}      ${developBranch}`))
  console.log(chalk.gray(`    ${t('init.labelFeature')}      ${featurePrefix}`))
  console.log(chalk.gray(`    ${t('init.labelHotfix')}       ${hotfixPrefix}`))
  console.log(chalk.gray(`    ${t('init.labelRelease')}      ${releasePrefix}`))
  console.log(chalk.gray(`    ${t('init.labelTag')}          ${versionTagPrefix || t('init.noPrefix')}`))
  console.log()
}

module.exports = init

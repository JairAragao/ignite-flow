const inquirer = require('inquirer')
const chalk = require('chalk')
const git = require('../core/git')
const { t } = require('../core/i18n')
const { withConfig, requireCleanWorkTree } = require('../core/middleware')
const { getLastVersion, bumpPatch, bumpMinor, formatTag } = require('../core/version')
const { MergeConflictError, handleError } = require('../core/error')

const finish = withConfig(async (cfg, options = {}) => {
  requireCleanWorkTree()

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
    console.error(chalk.red(t('common.notInBranch')))
    process.exit(1)
  }

  console.log(chalk.cyan(`\n${t('finish.finishing', { type, name: branchName })}`))
  console.log(chalk.gray(`${t('finish.currentBranch', { branch: currentBranch })}\n`))

  if (type === 'feature') {
    await finishFeature(cfg, currentBranch, options)
  } else if (type === 'hotfix') {
    await finishHotfix(cfg, currentBranch, branchName, options)
  } else if (type === 'release') {
    await finishRelease(cfg, currentBranch, branchName, options)
  }
})

async function finishFeature(cfg, currentBranch, options) {
  const mergeMsg = `Merge ${currentBranch} into ${cfg.developBranch} [ignite-flow]`

  if (options.dryRun) {
    console.log(chalk.cyan(t('common.merging', { branch: cfg.developBranch })))
    console.log(chalk.yellow(t('common.dryRun')))
    return
  }

  console.log(chalk.cyan(t('common.merging', { branch: cfg.developBranch })))
  git.checkout(cfg.developBranch)
  git.pull(cfg.developBranch)

  if (!git.safeMerge(currentBranch, mergeMsg)) {
    git.abortMerge()
    git.checkout(currentBranch)
    handleError(new MergeConflictError(currentBranch, cfg.developBranch), t)
  }

  const { deleteBranch } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'deleteBranch',
      message: t('finish.deleteConfirm', { branch: currentBranch }),
      default: true,
    },
  ])

  if (deleteBranch) {
    git.deleteBranch(currentBranch)
    git.deleteRemoteBranch(currentBranch)
    console.log(chalk.gray(t('common.branchDeleted', { branch: currentBranch })))
  }

  if (!options.noPush) {
    const { push } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'push',
        message: t('finish.pushConfirm', { branch: cfg.developBranch }),
        default: true,
      },
    ])
    if (push) {
      git.pushBranch(cfg.developBranch)
    }
  } else {
    console.log(chalk.yellow(t('common.skippingPush')))
  }

  console.log(chalk.green.bold(`\n${t('finish.featureSuccess')}`))
}

async function finishHotfix(cfg, currentBranch, name, options) {
  const lastTag = getLastVersion(cfg)
  const newVersion = bumpPatch(lastTag)
  const tagName = formatTag(cfg, newVersion)
  const mergeMainMsg = `Merge ${currentBranch} into ${cfg.mainBranch} [ignite-flow]`
  const mergeDevMsg = `Merge ${currentBranch} into ${cfg.developBranch} [ignite-flow]`

  console.log(chalk.gray(`  ${t('common.lastTag', { tag: `${cfg.versionTagPrefix}${lastTag}` })}`))
  console.log(chalk.white(`  ${t('common.newTag', { tag: tagName })}\n`))

  if (options.dryRun) {
    console.log(chalk.yellow(t('common.dryRun')))
    return
  }

  // Merge into main
  console.log(chalk.cyan(t('common.merging', { branch: cfg.mainBranch })))
  git.checkout(cfg.mainBranch)
  git.pull(cfg.mainBranch)
  if (!git.safeMerge(currentBranch, mergeMainMsg)) {
    git.abortMerge()
    git.checkout(currentBranch)
    handleError(new MergeConflictError(currentBranch, cfg.mainBranch), t)
  }

  // Create tag
  console.log(chalk.cyan(t('common.creatingTag', { tag: tagName })))
  git.createTag(tagName, `Hotfix: ${name}`)

  // Merge into develop
  console.log(chalk.cyan(t('common.merging', { branch: cfg.developBranch })))
  git.checkout(cfg.developBranch)
  git.pull(cfg.developBranch)
  if (!git.safeMerge(currentBranch, mergeDevMsg)) {
    git.abortMerge()
    git.checkout(currentBranch)
    handleError(new MergeConflictError(currentBranch, cfg.developBranch), t)
  }

  // Delete branch
  git.deleteBranch(currentBranch)
  git.deleteRemoteBranch(currentBranch)
  console.log(chalk.gray(t('common.branchDeleted', { branch: currentBranch })))

  // Push
  if (!options.noPush) {
    console.log(chalk.cyan(t('common.pushing', { targets: 'main, develop, tag' })))
    git.pushBranch(cfg.mainBranch)
    git.pushBranch(cfg.developBranch)
    git.pushTag(tagName)
  } else {
    console.log(chalk.yellow(t('common.skippingPush')))
  }

  console.log(chalk.green.bold(`\n${t('finish.hotfixSuccess', { tag: tagName })}`))
}

async function finishRelease(cfg, currentBranch, name, options) {
  const lastTag = getLastVersion(cfg)
  const newVersion = bumpMinor(lastTag)
  const tagName = formatTag(cfg, newVersion)
  const mergeMainMsg = `Merge ${currentBranch} into ${cfg.mainBranch} [ignite-flow]`
  const mergeDevMsg = `Merge ${currentBranch} into ${cfg.developBranch} [ignite-flow]`

  console.log(chalk.gray(`  ${t('common.lastTag', { tag: `${cfg.versionTagPrefix}${lastTag}` })}`))
  console.log(chalk.white(`  ${t('common.newTag', { tag: tagName })}\n`))

  if (options.dryRun) {
    console.log(chalk.yellow(t('common.dryRun')))
    return
  }

  // Merge into main
  console.log(chalk.cyan(t('common.merging', { branch: cfg.mainBranch })))
  git.checkout(cfg.mainBranch)
  git.pull(cfg.mainBranch)
  if (!git.safeMerge(currentBranch, mergeMainMsg)) {
    git.abortMerge()
    git.checkout(currentBranch)
    handleError(new MergeConflictError(currentBranch, cfg.mainBranch), t)
  }

  // Create tag
  console.log(chalk.cyan(t('common.creatingTag', { tag: tagName })))
  git.createTag(tagName, `Release: ${name}`)

  // Merge into develop
  console.log(chalk.cyan(t('common.merging', { branch: cfg.developBranch })))
  git.checkout(cfg.developBranch)
  git.pull(cfg.developBranch)
  if (!git.safeMerge(currentBranch, mergeDevMsg)) {
    git.abortMerge()
    git.checkout(currentBranch)
    handleError(new MergeConflictError(currentBranch, cfg.developBranch), t)
  }

  // Delete branch
  git.deleteBranch(currentBranch)
  git.deleteRemoteBranch(currentBranch)
  console.log(chalk.gray(t('common.branchDeleted', { branch: currentBranch })))

  // Push
  if (!options.noPush) {
    console.log(chalk.cyan(t('common.pushing', { targets: 'main, develop, tag' })))
    git.pushBranch(cfg.mainBranch)
    git.pushBranch(cfg.developBranch)
    git.pushTag(tagName)
  } else {
    console.log(chalk.yellow(t('common.skippingPush')))
  }

  console.log(chalk.green.bold(`\n${t('finish.releaseSuccess', { tag: tagName })}`))
}

module.exports = finish

const { execSync } = require('child_process')

const CONFIG_SECTION = 'igniteflow'

function gitConfig(key, value) {
  if (value !== undefined) {
    execSync(`git config ${CONFIG_SECTION}.${key} "${value}"`, { encoding: 'utf-8' })
  } else {
    try {
      return execSync(`git config ${CONFIG_SECTION}.${key}`, { encoding: 'utf-8' }).trim()
    } catch {
      return null
    }
  }
}

function exists() {
  return gitConfig('mainbranch') !== null
}

function load() {
  const mainBranch = gitConfig('mainbranch')
  if (!mainBranch) {
    return null
  }

  return {
    language: gitConfig('language') || 'pt',
    mainBranch: mainBranch,
    developBranch: gitConfig('developbranch') || 'develop',
    featurePrefix: gitConfig('featureprefix') || 'feature/',
    hotfixPrefix: gitConfig('hotfixprefix') || 'hotfix/',
    releasePrefix: gitConfig('releaseprefix') || 'release/',
    versionTagPrefix: gitConfig('versiontagprefix') || '',
  }
}

function save(cfg) {
  gitConfig('language', cfg.language || 'pt')
  gitConfig('mainbranch', cfg.mainBranch)
  gitConfig('developbranch', cfg.developBranch)
  gitConfig('featureprefix', cfg.featurePrefix)
  gitConfig('hotfixprefix', cfg.hotfixPrefix)
  gitConfig('releaseprefix', cfg.releasePrefix)
  gitConfig('versiontagprefix', cfg.versionTagPrefix)
}

function defaultConfig() {
  return {
    language: 'pt',
    mainBranch: 'main',
    developBranch: 'develop',
    featurePrefix: 'feature/',
    hotfixPrefix: 'hotfix/',
    releasePrefix: 'release/',
    versionTagPrefix: 'v',
  }
}

module.exports = {
  exists,
  load,
  save,
  defaultConfig,
}

const fs = require('fs')
const path = require('path')

const CONFIG_FILE = '.igniteflow.json'

function getConfigPath() {
  return path.join(process.cwd(), CONFIG_FILE)
}

function exists() {
  return fs.existsSync(getConfigPath())
}

function load() {
  const filePath = getConfigPath()
  if (!fs.existsSync(filePath)) {
    return null
  }
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

function save(cfg) {
  const filePath = getConfigPath()
  fs.writeFileSync(filePath, JSON.stringify(cfg, null, 2) + '\n', 'utf-8')
}

function defaultConfig() {
  return {
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
  CONFIG_FILE,
}

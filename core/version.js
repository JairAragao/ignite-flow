const git = require('./git')

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

function bumpMajor(version) {
  const parts = version.split('.')
  parts[0] = parseInt(parts[0] || 0) + 1
  parts[1] = 0
  parts[2] = 0
  return parts.join('.')
}

function formatTag(cfg, version) {
  return `${cfg.versionTagPrefix}${version}`
}

module.exports = {
  getLastVersion,
  bumpPatch,
  bumpMinor,
  bumpMajor,
  formatTag,
}

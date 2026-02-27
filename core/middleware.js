const config = require('./config')
const git = require('./git')
const { setLang, t } = require('./i18n')
const { NotConfiguredError, UncommittedChangesError, handleError } = require('./error')

function withConfig(fn) {
  return async (...args) => {
    try {
      const cfg = config.load()
      if (!cfg) {
        throw new NotConfiguredError()
      }
      setLang(cfg.language || 'pt')
      return await fn(cfg, ...args)
    } catch (err) {
      if (err.name && err.name.endsWith('Error') && err.message !== 'not_configured') {
        handleError(err, t)
      } else if (err.message === 'not_configured') {
        handleError(err, t)
      } else {
        throw err
      }
    }
  }
}

function requireCleanWorkTree(cfg) {
  if (git.hasUncommittedChanges()) {
    throw new UncommittedChangesError()
  }
}

module.exports = {
  withConfig,
  requireCleanWorkTree,
}

#!/usr/bin/env node

const { program } = require('commander')
const pkg = require('../package.json')

program
  .name('ignite')
  .description('Ignite Flow - Git Flow mais dinamico e rapido')
  .version(pkg.version)

program
  .command('init')
  .description('Configura o repositorio para usar o Ignite Flow')
  .action(async () => {
    const init = require('../commands/init')
    await init()
  })

program
  .command('start <type> <name>')
  .description('Cria uma nova branch (feature, hotfix ou release)')
  .action((type, name) => {
    const start = require('../commands/start')
    start(type, name)
  })

program
  .command('finish')
  .description('Finaliza a branch atual (detecta tipo automaticamente)')
  .action(async () => {
    const finish = require('../commands/finish')
    await finish()
  })

program
  .command('status')
  .description('Mostra overview das branches ativas')
  .action(() => {
    const status = require('../commands/status')
    status()
  })

program
  .command('tag')
  .description('Lista as tags do repositorio')
  .action(() => {
    const tag = require('../commands/tag')
    tag()
  })

program
  .command('release-apply')
  .alias('ra')
  .description('Merge develop direto na main, cria tag e push (sem branch de release)')
  .action(() => {
    const releaseApply = require('../commands/release-apply')
    releaseApply()
  })

program.parse(process.argv)

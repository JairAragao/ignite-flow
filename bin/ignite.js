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
  .option('--dry-run', 'Simula sem executar')
  .action(async (type, name, opts) => {
    const start = require('../commands/start')
    await start(type, name, { dryRun: opts.dryRun })
  })

program
  .command('finish')
  .description('Finaliza a branch atual (detecta tipo automaticamente)')
  .option('--no-push', 'Nao faz push automaticamente')
  .option('--dry-run', 'Simula sem executar')
  .action(async (opts) => {
    const finish = require('../commands/finish')
    await finish({ noPush: opts.push === false, dryRun: opts.dryRun })
  })

program
  .command('status')
  .description('Mostra overview das branches ativas')
  .action(async () => {
    const status = require('../commands/status')
    await status()
  })

program
  .command('tag')
  .description('Lista as tags do repositorio')
  .action(async () => {
    const tag = require('../commands/tag')
    await tag()
  })

program
  .command('release-apply')
  .alias('ra')
  .description('Merge develop direto na main, cria tag e push (sem branch de release)')
  .option('--no-push', 'Nao faz push automaticamente')
  .option('--dry-run', 'Simula sem executar')
  .action(async (opts) => {
    const releaseApply = require('../commands/release-apply')
    await releaseApply({ noPush: opts.push === false, dryRun: opts.dryRun })
  })

program
  .command('sync')
  .description('Sincroniza a branch atual com a base (develop/main)')
  .option('--dry-run', 'Simula sem executar')
  .action(async (opts) => {
    const sync = require('../commands/sync')
    await sync({ dryRun: opts.dryRun })
  })

program
  .command('changelog')
  .alias('cl')
  .description('Mostra changelog entre tags')
  .action(async () => {
    const changelog = require('../commands/changelog')
    await changelog()
  })

program
  .command('bump')
  .description('Bump major de versao (ex: 1.x.x -> 2.0.0)')
  .option('--no-push', 'Nao faz push automaticamente')
  .option('--dry-run', 'Simula sem executar')
  .action(async (opts) => {
    const bump = require('../commands/bump')
    await bump({ noPush: opts.push === false, dryRun: opts.dryRun })
  })

program.parse(process.argv)

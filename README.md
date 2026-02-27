# Ignite Flow

CLI para gerenciamento de branches baseado no Git Flow, mais dinamico e rapido.

## Instalacao

```bash
npm install -g ignite-flow
```

## Comandos

### `ignite init`
Configura o repositorio. Detecta automaticamente as branches `main`/`master` e sugere defaults.

### `ignite start <type> <name>`
Cria uma nova branch a partir da base correta.

```bash
ignite start feature minha-feature   # cria feature/minha-feature a partir de develop
ignite start hotfix fix-bug          # cria hotfix/fix-bug a partir de main
ignite start release 1.2.0           # cria release/1.2.0 a partir de develop
```

### `ignite finish`
Detecta automaticamente o tipo da branch atual e executa o merge correto:
- **Feature**: merge em develop
- **Hotfix**: merge em main + develop, cria tag
- **Release**: merge em main + develop, cria tag

### `ignite status`
Overview completo: branch atual, features/hotfixes/releases ativas e ultimas tags.

### `ignite tag`
Lista todas as tags do repositorio.

## Configuracao

O `ignite init` cria um arquivo `.igniteflow.json` na raiz do projeto:

```json
{
  "mainBranch": "main",
  "developBranch": "develop",
  "featurePrefix": "feature/",
  "hotfixPrefix": "hotfix/",
  "releasePrefix": "release/",
  "versionTagPrefix": "v"
}
```

Todos os prefixos sao personalizaveis durante o init.

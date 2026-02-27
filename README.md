# Ignite Flow

[Português](#portugues) | [English](#english) | [Espanol](#espanol)

---

## Português

CLI para gerenciamento de branches baseado no Git Flow, mais dinâmico e rápido.

### Instalação

```bash
npm install -g ignite-flow
```

### Comandos

#### `ignite init`
Configura o repositório. Detecta automaticamente as branches `main`/`master` e sugere defaults.

#### `ignite start <type> <name>`
Cria uma nova branch a partir da base correta.

```bash
ignite start feature minha-feature   # cria feature/minha-feature a partir de develop
ignite start hotfix fix-bug          # cria hotfix/fix-bug a partir de main
ignite start release 1.2.0           # cria release/1.2.0 a partir de develop
```

#### `ignite finish`
Detecta automaticamente o tipo da branch atual e executa o merge correto:
- **Feature**: merge em develop
- **Hotfix**: merge em main + develop, cria tag (bump patch: 1.1.0 -> 1.1.1)
- **Release**: merge em main + develop, cria tag (bump minor: 1.2.5 -> 1.3.0)

#### `ignite release-apply` (alias: `ra`)
Merge develop direto na main sem criar branch de release. Cria tag com bump minor e faz push.

```bash
ignite release-apply   # ou ignite ra
```

#### `ignite status`
Overview completo: branch atual, features/hotfixes/releases ativas e últimas tags.

#### `ignite tag`
Lista todas as tags do repositório.

### Configuração

O `ignite init` salva as configurações no `.git/config` do repositório (igual ao git-flow):

```ini
[igniteflow]
  language = pt
  mainbranch = main
  developbranch = develop
  featureprefix = feature/
  hotfixprefix = hotfix/
  releaseprefix = release/
  versiontagprefix = v
```

Todos os prefixos são personalizáveis durante o init.

---

## English

CLI for branch management based on Git Flow, more dynamic and faster.

### Installation

```bash
npm install -g ignite-flow
```

### Commands

#### `ignite init`
Configures the repository. Automatically detects `main`/`master` branches and suggests defaults.

#### `ignite start <type> <name>`
Creates a new branch from the correct base.

```bash
ignite start feature my-feature   # creates feature/my-feature from develop
ignite start hotfix fix-bug       # creates hotfix/fix-bug from main
ignite start release 1.2.0        # creates release/1.2.0 from develop
```

#### `ignite finish`
Automatically detects the current branch type and executes the correct merge:
- **Feature**: merge into develop
- **Hotfix**: merge into main + develop, creates tag (bump patch: 1.1.0 -> 1.1.1)
- **Release**: merge into main + develop, creates tag (bump minor: 1.2.5 -> 1.3.0)

#### `ignite release-apply` (alias: `ra`)
Merges develop directly into main without creating a release branch. Creates tag with minor bump and pushes.

```bash
ignite release-apply   # or ignite ra
```

#### `ignite status`
Complete overview: current branch, active features/hotfixes/releases and recent tags.

#### `ignite tag`
Lists all repository tags.

### Configuration

`ignite init` saves configuration in the repository's `.git/config` (same as git-flow):

```ini
[igniteflow]
  language = en
  mainbranch = main
  developbranch = develop
  featureprefix = feature/
  hotfixprefix = hotfix/
  releaseprefix = release/
  versiontagprefix = v
```

All prefixes are customizable during init.

---

## Espanol

CLI para gestion de ramas basado en Git Flow, mas dinamico y rapido.

### Instalacion

```bash
npm install -g ignite-flow
```

### Comandos

#### `ignite init`
Configura el repositorio. Detecta automaticamente las ramas `main`/`master` y sugiere valores por defecto.

#### `ignite start <type> <name>`
Crea una nueva rama desde la base correcta.

```bash
ignite start feature mi-feature   # crea feature/mi-feature desde develop
ignite start hotfix fix-bug       # crea hotfix/fix-bug desde main
ignite start release 1.2.0        # crea release/1.2.0 desde develop
```

#### `ignite finish`
Detecta automaticamente el tipo de la rama actual y ejecuta el merge correcto:
- **Feature**: merge en develop
- **Hotfix**: merge en main + develop, crea tag (bump patch: 1.1.0 -> 1.1.1)
- **Release**: merge en main + develop, crea tag (bump minor: 1.2.5 -> 1.3.0)

#### `ignite release-apply` (alias: `ra`)
Merge develop directo en main sin crear rama de release. Crea tag con bump minor y hace push.

```bash
ignite release-apply   # o ignite ra
```

#### `ignite status`
Vista completa: rama actual, features/hotfixes/releases activas y ultimas tags.

#### `ignite tag`
Lista todas las tags del repositorio.

### Configuracion

`ignite init` guarda la configuracion en el `.git/config` del repositorio (igual que git-flow):

```ini
[igniteflow]
  language = es
  mainbranch = main
  developbranch = develop
  featureprefix = feature/
  hotfixprefix = hotfix/
  releaseprefix = release/
  versiontagprefix = v
```

Todos los prefijos son personalizables durante el init.

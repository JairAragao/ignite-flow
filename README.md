# Ignite Flow

[Português](#português) | [English](#english) | [Espanol](#espanol)

---

## Português

CLI para gerenciamento de branches baseado no Git Flow, mais dinâmico e rápido.

### Instalação

```bash
# Global (recomendado)
npm install -g ignite-flow

# Ou como devDependency no projeto
npm install -D ignite-flow
```

### Comandos

#### `ignite init`
Configura o repositório. Detecta automaticamente as branches `main`/`master` e sugere defaults.

#### `ignite start <type> <name>`
Cria uma nova branch a partir da base correta. Valida nome da branch automaticamente.

```bash
ignite start feature minha-feature   # cria feature/minha-feature a partir de develop
ignite start hotfix fix-bug          # cria hotfix/fix-bug a partir de main
ignite start release 1.2.0           # cria release/1.2.0 a partir de develop
ignite start feature teste --dry-run # simula sem executar
```

#### `ignite finish`
Detecta automaticamente o tipo da branch atual e executa o merge correto:
- **Feature**: merge em develop
- **Hotfix**: merge em main + develop, cria tag (bump patch: 1.1.0 -> 1.1.1)
- **Release**: merge em main + develop, cria tag (bump minor: 1.2.5 -> 1.3.0)

Deleta a branch local e remota automaticamente (hotfix/release). Trata conflitos de merge com mensagem clara.

```bash
ignite finish             # finaliza a branch atual
ignite finish --no-push   # finaliza sem fazer push
ignite finish --dry-run   # simula sem executar
```

#### `ignite release-apply` (alias: `ra`)
Merge develop direto na main sem criar branch de release. Cria tag com bump minor e faz push.

```bash
ignite release-apply             # ou ignite ra
ignite release-apply --no-push   # sem push
ignite release-apply --dry-run   # simula
```

#### `ignite sync`
Sincroniza a branch atual com a base (develop para features/releases, main para hotfixes).

```bash
ignite sync            # pull da base e merge na branch atual
ignite sync --dry-run  # simula
```

#### `ignite changelog` (alias: `cl`)
Mostra changelog entre as últimas tags de versão.

```bash
ignite changelog   # ou ignite cl
```

#### `ignite bump`
Bump major de versão na main (ex: 1.x.x -> 2.0.0). Pede confirmação antes de executar.

```bash
ignite bump             # bump major
ignite bump --no-push   # sem push
ignite bump --dry-run   # simula
```

#### `ignite status`
Overview completo: branch atual, features/hotfixes/releases ativas e últimas tags.

#### `ignite tag`
Lista todas as tags do repositório.

### Flags globais

| Flag | Disponível em | Descrição |
|------|--------------|-----------|
| `--dry-run` | start, finish, release-apply, sync, bump | Simula a operação sem executar |
| `--no-push` | finish, release-apply, bump | Executa tudo localmente, sem push |

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
# Global (recommended)
npm install -g ignite-flow

# Or as devDependency in your project
npm install -D ignite-flow
```

### Commands

#### `ignite init`
Configures the repository. Automatically detects `main`/`master` branches and suggests defaults.

#### `ignite start <type> <name>`
Creates a new branch from the correct base. Validates branch name automatically.

```bash
ignite start feature my-feature   # creates feature/my-feature from develop
ignite start hotfix fix-bug       # creates hotfix/fix-bug from main
ignite start release 1.2.0        # creates release/1.2.0 from develop
ignite start feature test --dry-run
```

#### `ignite finish`
Automatically detects the current branch type and executes the correct merge:
- **Feature**: merge into develop
- **Hotfix**: merge into main + develop, creates tag (bump patch: 1.1.0 -> 1.1.1)
- **Release**: merge into main + develop, creates tag (bump minor: 1.2.5 -> 1.3.0)

Deletes local and remote branch automatically (hotfix/release). Handles merge conflicts with clear messages.

```bash
ignite finish             # finishes current branch
ignite finish --no-push   # finish without pushing
ignite finish --dry-run   # simulate without executing
```

#### `ignite release-apply` (alias: `ra`)
Merges develop directly into main without creating a release branch. Creates tag with minor bump.

```bash
ignite release-apply             # or ignite ra
ignite release-apply --no-push
ignite release-apply --dry-run
```

#### `ignite sync`
Syncs current branch with its base (develop for features/releases, main for hotfixes).

```bash
ignite sync
ignite sync --dry-run
```

#### `ignite changelog` (alias: `cl`)
Shows changelog between recent version tags.

```bash
ignite changelog   # or ignite cl
```

#### `ignite bump`
Major version bump on main (e.g. 1.x.x -> 2.0.0). Asks for confirmation before executing.

```bash
ignite bump
ignite bump --no-push
ignite bump --dry-run
```

#### `ignite status`
Complete overview: current branch, active features/hotfixes/releases and recent tags.

#### `ignite tag`
Lists all repository tags.

### Global flags

| Flag | Available in | Description |
|------|-------------|-------------|
| `--dry-run` | start, finish, release-apply, sync, bump | Simulates without executing |
| `--no-push` | finish, release-apply, bump | Runs everything locally, no push |

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
# Global (recomendado)
npm install -g ignite-flow

# O como devDependency en el proyecto
npm install -D ignite-flow
```

### Comandos

#### `ignite init`
Configura el repositorio. Detecta automaticamente las ramas `main`/`master` y sugiere valores por defecto.

#### `ignite start <type> <name>`
Crea una nueva rama desde la base correcta. Valida el nombre de la rama automaticamente.

```bash
ignite start feature mi-feature   # crea feature/mi-feature desde develop
ignite start hotfix fix-bug       # crea hotfix/fix-bug desde main
ignite start release 1.2.0        # crea release/1.2.0 desde develop
ignite start feature test --dry-run
```

#### `ignite finish`
Detecta automaticamente el tipo de la rama actual y ejecuta el merge correcto:
- **Feature**: merge en develop
- **Hotfix**: merge en main + develop, crea tag (bump patch: 1.1.0 -> 1.1.1)
- **Release**: merge en main + develop, crea tag (bump minor: 1.2.5 -> 1.3.0)

Elimina la rama local y remota automaticamente (hotfix/release). Maneja conflictos de merge con mensajes claros.

```bash
ignite finish             # finaliza la rama actual
ignite finish --no-push   # sin push
ignite finish --dry-run   # simula sin ejecutar
```

#### `ignite release-apply` (alias: `ra`)
Merge develop directo en main sin crear rama de release. Crea tag con bump minor.

```bash
ignite release-apply             # o ignite ra
ignite release-apply --no-push
ignite release-apply --dry-run
```

#### `ignite sync`
Sincroniza la rama actual con la base (develop para features/releases, main para hotfixes).

```bash
ignite sync
ignite sync --dry-run
```

#### `ignite changelog` (alias: `cl`)
Muestra changelog entre las ultimas tags de version.

```bash
ignite changelog   # o ignite cl
```

#### `ignite bump`
Bump major de version en main (ej: 1.x.x -> 2.0.0). Pide confirmacion antes de ejecutar.

```bash
ignite bump
ignite bump --no-push
ignite bump --dry-run
```

#### `ignite status`
Vista completa: rama actual, features/hotfixes/releases activas y ultimas tags.

#### `ignite tag`
Lista todas las tags del repositorio.

### Flags globales

| Flag | Disponible en | Descripcion |
|------|--------------|-------------|
| `--dry-run` | start, finish, release-apply, sync, bump | Simula sin ejecutar |
| `--no-push` | finish, release-apply, bump | Ejecuta todo localmente, sin push |

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

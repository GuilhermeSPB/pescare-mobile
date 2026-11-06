// https://docs.expo.dev/guides/using-eslint/
const fs = require('node:fs')
const path = require('node:path')
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')

const FEATURES_DIR = path.join(__dirname, 'src', 'features')
const SHARED_DIRS = ['components', 'hooks', 'lib', 'stores', 'theme', 'types', 'utils', 'config']

// As features vêm das pastas em src/features, então uma feature nova já nasce isolada
// sem precisar registrar a zona aqui (no pescare-frontend essa lista é manual).
const listFeatureNames = () => {
  if (!fs.existsSync(FEATURES_DIR)) return []

  return fs
    .readdirSync(FEATURES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}

const featureIsolationZones = listFeatureNames().map((featureName) => ({
  target: `./src/features/${featureName}`,
  from: './src/features',
  except: [`./${featureName}`],
}))

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    settings: {
      // O resolver padrão do eslint-config-expo (node) não entende o alias `@/` do tsconfig:
      // sem o de TypeScript, imports como `@/features/...` escapariam da regra abaixo.
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
      },
    },
    rules: {
      // Regras de arquitetura (feature-based / Bulletproof React), as mesmas do pescare-frontend:
      // - uma feature não pode importar de outra feature diretamente
      // - o código flui em uma direção: shared -> features -> app
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            ...featureIsolationZones,
            { target: './src/features', from: './src/app' },
            {
              target: SHARED_DIRS.map((dir) => `./src/${dir}`),
              from: ['./src/features', './src/app'],
            },
          ],
        },
      ],
    },
  },
])

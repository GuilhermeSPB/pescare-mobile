import Constants from 'expo-constants'

// Único lugar que lê `process.env.EXPO_PUBLIC_*`.
// Sem EXPO_PUBLIC_API_URL, usa a máquina que roda o `expo start` (mesmo IP que o
// celular ou emulador já alcança) na porta padrão do backend.
function defaultApiUrl() {
  const host = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost'

  return `http://${host}:3000/api/v1`
}

export const env = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? defaultApiUrl(),
}

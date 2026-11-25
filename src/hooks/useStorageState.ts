import * as SecureStore from 'expo-secure-store'
import { useCallback, useEffect, useReducer } from 'react'
import { Platform } from 'react-native'

// Padrão da documentação do Expo Router (autenticação): SecureStore no celular,
// localStorage na web. O primeiro item da tupla diz se ainda está carregando.
type StorageState = [boolean, string | null]

async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === 'web') {
    try {
      if (value === null) localStorage.removeItem(key)
      else localStorage.setItem(key, value)
    } catch (error) {
      console.error('localStorage indisponível:', error)
    }
    return
  }

  if (value === null) await SecureStore.deleteItemAsync(key)
  else await SecureStore.setItemAsync(key, value)
}

export function useStorageState(key: string) {
  const [state, setState] = useReducer(
    (_state: StorageState, value: string | null): StorageState => [false, value],
    [true, null],
  )

  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        setState(typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null)
      } catch (error) {
        console.error('localStorage indisponível:', error)
        setState(null)
      }
      return
    }

    SecureStore.getItemAsync(key)
      .then(setState)
      .catch(() => setState(null))
  }, [key])

  const setValue = useCallback(
    (value: string | null) => {
      setState(value)
      setStorageItemAsync(key, value)
    },
    [key],
  )

  return [state, setValue] as const
}

import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Keyboard, Pressable } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Button } from '@/components/Button'
import { FormMessage } from '@/components/FormMessage'
import { FormScreen } from '@/components/FormScreen'
import { Icon } from '@/components/Icon'
import { TextField } from '@/components/TextField'
import { useSignUp } from '@/contexts/SignUpContext'
import { ApiError } from '@/lib/api-client'
import { listMunicipalities } from '@/services/municipalities'
import type { Municipality } from '@/types/municipality'
import { searchMunicipalities, stateName } from '@/utils/municipalities'

const MIN_QUERY = 2

const Status = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.md}px;
  padding-vertical: ${({ theme }) => theme.space.sm}px;
`

const StatusText = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

const List = styled.View`
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.outlineVariant};
`

const RowContent = styled.View`
  flex: 1;
`

const CityName = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurface};
`

const StateName = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

type CityRowProps = {
  municipality: Municipality
  selected: boolean
  onPress: () => void
}

function CityRow({ municipality, selected, onPress }: CityRowProps) {
  const { colors, space, size } = useTheme()
  const state = stateName(municipality.uf)

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${municipality.name}, ${state}`}
      android_ripple={{ color: 'rgba(37, 99, 235, 0.12)' }}
      style={({ pressed }) => ({
        minHeight: size.control + space.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.lg,
        paddingHorizontal: space.lg,
        paddingVertical: space.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.outlineVariant,
        backgroundColor: selected
          ? colors.primaryContainer
          : pressed && process.env.EXPO_OS !== 'android'
            ? 'rgba(17, 24, 39, 0.06)'
            : colors.surface,
      })}
    >
      <RowContent>
        <CityName
          style={selected ? { fontWeight: '600', color: colors.onPrimaryContainer } : undefined}
        >
          {municipality.name}
        </CityName>
        <StateName>{state}</StateName>
      </RowContent>
      {selected && <Icon name="check" color={colors.primary} />}
    </Pressable>
  )
}

export default function MunicipalityStep() {
  const { colors } = useTheme()
  const { data, update, errors, setError } = useSignUp()
  const [municipalities, setMunicipalities] = useState<Municipality[] | null>(null)
  const [loadError, setLoadError] = useState<string>()
  const [attempt, setAttempt] = useState(0)
  const [query, setQuery] = useState(data.municipality?.name ?? '')
  const [error, setLocalError] = useState<string>()

  useEffect(() => {
    let active = true

    listMunicipalities()
      .then((list) => active && setMunicipalities(list))
      .catch((reason) => {
        if (active) {
          setLoadError(
            reason instanceof ApiError ? reason.message : 'Não foi possível carregar as cidades.',
          )
        }
      })

    return () => {
      active = false
    }
  }, [attempt])

  function retry() {
    setLoadError(undefined)
    setAttempt((current) => current + 1)
  }

  const tooShort = query.trim().length < MIN_QUERY
  const { results, total } =
    municipalities && !tooShort
      ? searchMunicipalities(municipalities, query)
      : { results: [], total: 0 }

  function select(municipality: Municipality) {
    // Fecha o teclado para o botão "Continuar" e a escolha ficarem à vista.
    Keyboard.dismiss()
    update({ municipality })
    setQuery(municipality.name)
    setLocalError(undefined)
    setError('municipality', undefined)
  }

  function next() {
    if (!data.municipality) {
      setLocalError('Toque na sua cidade na lista para escolher.')
      return
    }

    router.push('/sign-up/email')
  }

  return (
    <FormScreen
      appBarTitle="Criar conta"
      progress={{ step: 2, total: 4 }}
      headline="Onde você pesca?"
      example="Escreva o nome da sua cidade e toque nela na lista."
      footer={<Button label="Continuar" onPress={next} />}
    >
      <TextField
        label="Cidade"
        leadingIcon="search"
        value={query}
        onChangeText={(text) => {
          setQuery(text)
          setLocalError(undefined)
          // Digitar de novo é procurar outra cidade: a escolha anterior deixa de valer.
          if (data.municipality) update({ municipality: null })
        }}
        error={error ?? errors.municipality}
        helper={tooShort ? `Digite pelo menos ${MIN_QUERY} letras do nome.` : undefined}
        autoFocus={!data.municipality}
        autoCapitalize="words"
        autoCorrect={false}
        autoComplete="off"
        returnKeyType="search"
      />

      {loadError ? (
        <>
          <FormMessage tone="error">{loadError}</FormMessage>
          <Button variant="outlined" label="Tentar de novo" onPress={retry} />
        </>
      ) : !municipalities ? (
        <Status>
          <ActivityIndicator color={colors.primary} />
          <StatusText>Carregando a lista de cidades…</StatusText>
        </Status>
      ) : tooShort ? null : results.length === 0 ? (
        <StatusText accessibilityLiveRegion="polite">
          Nenhuma cidade com “{query.trim()}”. Confira o nome e tente de novo.
        </StatusText>
      ) : (
        <>
          <List accessibilityRole="radiogroup">
            {results.map((municipality) => (
              <CityRow
                key={municipality.ibge_code}
                municipality={municipality}
                selected={data.municipality?.ibge_code === municipality.ibge_code}
                onPress={() => select(municipality)}
              />
            ))}
          </List>
          {total > results.length && (
            <StatusText>
              Mostrando {results.length} de {total}. Digite mais letras para achar a sua.
            </StatusText>
          )}
        </>
      )}
    </FormScreen>
  )
}

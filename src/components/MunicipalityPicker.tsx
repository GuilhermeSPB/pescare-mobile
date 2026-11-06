import { useState } from 'react'
import { Pressable } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import type { Municipality } from '@/types/municipality'
import { searchMunicipalities, stateName } from '@/utils/municipalities'

import { EmptyState } from './EmptyState'
import { TextField } from './TextField'

type MunicipalityPickerProps = {
  label: string
  municipalities: Municipality[] | undefined
  selectedCode: string | null
  onSelect: (municipality: Municipality) => void
}

const MIN_QUERY = 2

const Results = styled.View`
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.outlineVariant};
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

// Busca de cidade: digita as primeiras letras e toca na cidade na lista.
export function MunicipalityPicker({
  label,
  municipalities,
  selectedCode,
  onSelect,
}: MunicipalityPickerProps) {
  const { colors, space, size } = useTheme()
  const [query, setQuery] = useState('')
  const tooShort = query.trim().length < MIN_QUERY
  const { results, total } =
    municipalities && !tooShort
      ? searchMunicipalities(municipalities, query)
      : { results: [], total: 0 }

  if (!municipalities) return <EmptyState message="Carregando a lista de cidades…" />

  return (
    <>
      <TextField
        label={label}
        leadingIcon="search"
        value={query}
        onChangeText={setQuery}
        helper={tooShort ? `Digite pelo menos ${MIN_QUERY} letras do nome.` : undefined}
        autoCorrect={false}
        autoCapitalize="words"
        autoComplete="off"
        autoFocus
      />
      {!tooShort && results.length === 0 && (
        <EmptyState
          message={`Nenhuma cidade com “${query.trim()}”. Confira o nome e tente de novo.`}
        />
      )}
      {results.length > 0 && (
        <Results accessibilityRole="radiogroup">
          {results.map((municipality) => {
            const selected = municipality.ibge_code === selectedCode

            return (
              <Pressable
                key={municipality.ibge_code}
                onPress={() => onSelect(municipality)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={`${municipality.name}, ${stateName(municipality.uf)}`}
                android_ripple={{ color: 'rgba(37, 99, 235, 0.12)' }}
                style={{
                  minHeight: size.control + space.lg,
                  justifyContent: 'center',
                  paddingHorizontal: space.lg,
                  paddingVertical: space.sm,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.outlineVariant,
                  backgroundColor: selected ? colors.primaryContainer : colors.surface,
                }}
              >
                <CityName>{municipality.name}</CityName>
                <StateName>{stateName(municipality.uf)}</StateName>
              </Pressable>
            )
          })}
          {total > results.length && (
            <EmptyState
              message={`Mostrando ${results.length} de ${total}. Digite mais letras para achar a sua.`}
            />
          )}
        </Results>
      )}
    </>
  )
}

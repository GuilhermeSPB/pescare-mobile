import { router } from 'expo-router'
import { useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { Button } from '@/components/Button'
import { DateField } from '@/components/DateField'
import { FormScreen } from '@/components/FormScreen'
import { Icon } from '@/components/Icon'
import { MunicipalityPicker } from '@/components/MunicipalityPicker'
import { useMe } from '@/hooks/use-me'
import { useMunicipalities } from '@/hooks/use-municipalities'
import { findMunicipality, stateName } from '@/utils/municipalities'

import { useFishingRecordForm } from '../contexts/fishing-record-form-context'

const Question = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

const CityCard = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.md}px;
  padding: ${({ theme }) => theme.space.lg}px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.primaryContainer};
`

const CityText = styled.View`
  flex: 1;
`

const CityName = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.colors.onPrimaryContainer};
`

const CityHint = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

// Passo 1 de 5: quando e onde. A cidade já vem marcada com a do cadastro; trocar é opcional.
export function FishingDateScreen() {
  const { colors } = useTheme()
  const { draft, update } = useFishingRecordForm()
  const [choosingCity, setChoosingCity] = useState(false)
  const meQuery = useMe()
  const municipalitiesQuery = useMunicipalities()

  const ownCode = meQuery.data?.fk_municipality_ibge_code ?? null
  const cityCode = draft.municipalityCode ?? ownCode
  const city = findMunicipality(municipalitiesQuery.data, cityCode ?? '')
  const isOwnCity = draft.municipalityCode === null || draft.municipalityCode === ownCode

  function chooseCity(code: string | null) {
    update({ municipalityCode: code })
    setChoosingCity(false)
  }

  return (
    <FormScreen
      appBarTitle="Registrar pesca"
      progress={{ step: 1, total: 5 }}
      headline="Quando e onde você pescou?"
      example="Escolha o dia no calendário e confira a cidade."
      footer={
        choosingCity ? (
          <Button variant="outlined" label="Cancelar" onPress={() => setChoosingCity(false)} />
        ) : (
          <Button label="Continuar" onPress={() => router.push('/fishing-records/new/how')} />
        )
      }
    >
      <DateField
        label="Dia da pesca"
        value={draft.fishingDate}
        maximumDate={new Date()}
        onChange={(fishingDate) => update({ fishingDate })}
      />
      <Question>Cidade onde você pescou</Question>
      {!choosingCity && (
        <>
          <CityCard accessibilityLabel={`Cidade escolhida: ${city?.name ?? 'carregando'}`}>
            <Icon name="check" color={colors.primary} />
            <CityText>
              <CityName>
                {city ? `${city.name} (${stateName(city.uf)})` : 'Carregando cidade…'}
              </CityName>
              <CityHint>
                {isOwnCity ? 'Sua cidade do cadastro' : 'Cidade escolhida para esta pesca'}
              </CityHint>
            </CityText>
          </CityCard>
          {isOwnCity ? (
            <Button
              variant="outlined"
              label="Pesquei em outra cidade"
              onPress={() => setChoosingCity(true)}
            />
          ) : (
            <>
              <Button
                variant="outlined"
                label="Trocar de cidade"
                onPress={() => setChoosingCity(true)}
              />
              <Button
                variant="text"
                label="Voltar para a minha cidade"
                onPress={() => chooseCity(null)}
              />
            </>
          )}
        </>
      )}
      {choosingCity && (
        <MunicipalityPicker
          label="Buscar cidade"
          municipalities={municipalitiesQuery.data}
          selectedCode={cityCode}
          onSelect={(municipality) =>
            chooseCity(municipality.ibge_code === ownCode ? null : municipality.ibge_code)
          }
        />
      )}
    </FormScreen>
  )
}

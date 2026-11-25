import { router } from 'expo-router'
import { useState } from 'react'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'

import { Button } from '@/components/Button'
import { FormMessage } from '@/components/FormMessage'
import { FormScreen } from '@/components/FormScreen'
import { MunicipalityPicker } from '@/components/MunicipalityPicker'
import { QueryFeedback } from '@/components/QueryFeedback'
import { useMe } from '@/hooks/use-me'
import { useMunicipalities } from '@/hooks/use-municipalities'
import { ApiError } from '@/lib/api-client'
import type { Municipality } from '@/types/municipality'
import { describeMunicipality } from '@/utils/municipalities'

import { useUpdateMe } from '../api/update-me'
import { ProfileField } from '../components/profile-field'
import { ProfileFormFallback } from '../components/profile-form-fallback'
import { saveFailedMessage } from '../utils/profile-errors'

const APP_BAR_TITLE = 'Mudar cidade'
const HEADLINE = 'Onde você pesca?'
const CITY_NOT_FOUND = 'Não achamos essa cidade. Escolha de novo na lista.'

const NoticeText = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurface};
`

type NewCityPickerProps = {
  cityError?: string
  onCitySelect: (municipality: Municipality) => void
}

function NewCityPicker({ cityError, onCitySelect }: NewCityPickerProps) {
  const municipalitiesQuery = useMunicipalities()

  if (municipalitiesQuery.isError) {
    return (
      <QueryFeedback
        isPending={false}
        isError
        error={municipalitiesQuery.error}
        onRetry={() => municipalitiesQuery.refetch()}
      />
    )
  }

  return (
    <MunicipalityPicker
      label="Nova cidade"
      municipalities={municipalitiesQuery.data}
      selectedCode={null}
      onSelect={onCitySelect}
      error={cityError}
    />
  )
}

type ChosenCityProps = {
  cityName: string
  cityLabel: string
  onChooseAnotherCity: () => void
}

// Depois do toque na lista: a escolha fica à vista, com o que muda no app ao salvar.
function ChosenCity({ cityName, cityLabel, onChooseAnotherCity }: ChosenCityProps) {
  return (
    <>
      <ProfileField label="Nova cidade" value={cityLabel} />
      <NoticeText>
        Depois de salvar, você vai ver os defesos e os comunicados de {cityName}.
      </NoticeText>
      <Button variant="text" label="Escolher outra cidade" onPress={onChooseAnotherCity} />
    </>
  )
}

// A API recusa uma cidade que não existe com 400, numa mensagem que fala em código do IBGE.
function isCityRejected(error: unknown) {
  return error instanceof ApiError && error.status === 400
}

type EditCityFormProps = {
  currentCode: string
}

function EditCityForm({ currentCode }: EditCityFormProps) {
  const municipalitiesQuery = useMunicipalities()
  const updateMeMutation = useUpdateMe()
  const [chosenCity, setChosenCity] = useState<Municipality | null>(null)
  const [cityError, setCityError] = useState<string>()
  const [formError, setFormError] = useState<string>()

  function handleCitySelect(municipality: Municipality) {
    if (municipality.ibge_code === currentCode) {
      setCityError('Essa já é a sua cidade. Escolha outra na lista.')
      return
    }

    // Fecha o teclado para a cidade escolhida e o botão "Salvar" ficarem à vista.
    Keyboard.dismiss()
    setChosenCity(municipality)
    setCityError(undefined)
    setFormError(undefined)
  }

  function handleChooseAnotherCity() {
    setChosenCity(null)
    setFormError(undefined)
  }

  async function handleSave() {
    if (updateMeMutation.isPending) return

    if (!chosenCity) {
      setCityError('Toque na nova cidade na lista para escolher.')
      return
    }

    setFormError(undefined)

    try {
      await updateMeMutation.mutateAsync({ fk_municipality_ibge_code: chosenCity.ibge_code })
      router.back()
    } catch (error) {
      // Cidade recusada volta para a busca, com o erro no campo; só o que sobra vai para o log.
      if (isCityRejected(error)) {
        setChosenCity(null)
        setCityError(CITY_NOT_FOUND)
        return
      }

      console.error('[profile] Erro ao salvar a cidade:', error)
      setFormError(saveFailedMessage(error))
    }
  }

  return (
    <FormScreen
      appBarTitle={APP_BAR_TITLE}
      headline={HEADLINE}
      example={chosenCity ? undefined : 'Escreva o nome da nova cidade e toque nela na lista.'}
      footer={<Button label="Salvar" onPress={handleSave} loading={updateMeMutation.isPending} />}
    >
      <ProfileField
        label="Sua cidade hoje"
        value={describeMunicipality(municipalitiesQuery.data, currentCode)}
      />
      {chosenCity ? (
        <ChosenCity
          cityName={chosenCity.name}
          cityLabel={describeMunicipality(municipalitiesQuery.data, chosenCity.ibge_code)}
          onChooseAnotherCity={handleChooseAnotherCity}
        />
      ) : (
        <NewCityPicker cityError={cityError} onCitySelect={handleCitySelect} />
      )}
      {formError && <FormMessage tone="error">{formError}</FormMessage>}
    </FormScreen>
  )
}

// Muda a cidade do pescador, que decide os defesos e os comunicados que ele vê. As pescas já
// registradas guardam a cidade de cada uma e não mudam.
export function EditCityScreen() {
  const meQuery = useMe()

  if (!meQuery.data) {
    return (
      <ProfileFormFallback
        appBarTitle={APP_BAR_TITLE}
        headline={HEADLINE}
        isMeError={meQuery.isError}
        meError={meQuery.error}
        onRetry={() => meQuery.refetch()}
      />
    )
  }

  return <EditCityForm currentCode={meQuery.data.fk_municipality_ibge_code} />
}

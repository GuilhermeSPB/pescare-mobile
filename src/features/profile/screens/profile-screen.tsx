import { ActivityIndicator } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Button } from '@/components/Button'
import { FormMessage } from '@/components/FormMessage'
import { SectionCard } from '@/components/SectionCard'
import { TopAppBar } from '@/components/TopAppBar'
import { useAuth } from '@/contexts/AuthContext'
import { useMe } from '@/hooks/use-me'
import { useMunicipalities } from '@/hooks/use-municipalities'
import { useOpenDrawer } from '@/hooks/use-open-drawer'
import { ApiError } from '@/lib/api-client'
import { findMunicipality, stateName } from '@/utils/municipalities'

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

const Inner = styled.View`
  gap: ${({ theme }) => theme.space.xl}px;
  padding: ${({ theme }) => theme.space.lg}px;
`

const Field = styled.View`
  gap: ${({ theme }) => theme.space.xs}px;
`

const FieldLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

const FieldValue = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurface};
`

// Perfil: dados da conta e a saída. O botão de sair fica aqui, fora da tela inicial.
export function ProfileScreen() {
  const { colors } = useTheme()
  const { signOut } = useAuth()
  const meQuery = useMe()
  const municipalitiesQuery = useMunicipalities()
  const openDrawer = useOpenDrawer()

  const municipality = meQuery.data
    ? findMunicipality(municipalitiesQuery.data, meQuery.data.fk_municipality_ibge_code)
    : undefined

  return (
    <Container>
      <TopAppBar title="Perfil" onMenu={openDrawer} />
      <Inner>
        {meQuery.isPending && <ActivityIndicator color={colors.primary} />}
        {meQuery.isError && (
          <>
            <FormMessage tone="error">
              {meQuery.error instanceof ApiError
                ? meQuery.error.message
                : 'Não foi possível carregar seus dados.'}
            </FormMessage>
            <Button variant="outlined" label="Tentar de novo" onPress={() => meQuery.refetch()} />
          </>
        )}
        {meQuery.data && (
          <SectionCard title="Seus dados">
            <Field>
              <FieldLabel>Nome</FieldLabel>
              <FieldValue>{meQuery.data.name}</FieldValue>
            </Field>
            <Field>
              <FieldLabel>E-mail</FieldLabel>
              <FieldValue>{meQuery.data.email}</FieldValue>
            </Field>
            <Field>
              <FieldLabel>Cidade</FieldLabel>
              <FieldValue>
                {municipality
                  ? `${municipality.name} (${stateName(municipality.uf)})`
                  : 'Carregando cidade…'}
              </FieldValue>
            </Field>
          </SectionCard>
        )}
        <Button variant="outlined" label="Sair da conta" onPress={signOut} />
      </Inner>
    </Container>
  )
}

import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import Animated, { Easing, FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { Button } from '@/components/Button'
import { useAuth } from '@/contexts/AuthContext'

const Container = styled.View`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.space.xl}px;
  background-color: ${({ theme }) => theme.colors.primary};
`

// O nome fica um pouco acima do centro óptico; os botões, presos acima da barra de gestos.
const Brand = styled(Animated.View)`
  flex: 1;
  justify-content: center;
  padding-bottom: ${({ theme }) => theme.space.xxxl}px;
`

const Wordmark = styled.Text`
  font-size: ${({ theme }) => theme.typography.display.fontSize}px;
  line-height: ${({ theme }) => theme.typography.display.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.display.fontWeight};
  letter-spacing: ${({ theme }) => theme.typography.display.letterSpacing}px;
  color: ${({ theme }) => theme.colors.onPrimary};
`

const Tagline = styled.Text`
  margin-top: ${({ theme }) => theme.space.md}px;
  max-width: 320px;
  font-size: ${({ theme }) => theme.typography.tagline.fontSize}px;
  line-height: ${({ theme }) => theme.typography.tagline.lineHeight}px;
  color: ${({ theme }) => theme.colors.onPrimary};
`

const Actions = styled.View`
  gap: ${({ theme }) => theme.space.md}px;
`

// Tela de abertura: continua o azul da splash nativa, e o nome sobe no lugar
// do logo que ainda não existe (a animação respeita o "reduzir movimento" do sistema).
export default function WelcomeScreen() {
  const insets = useSafeAreaInsets()
  const { isLoading } = useAuth()

  return (
    <Container style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 24 }}>
      <StatusBar style="light" />
      {/* O nome só monta quando a splash sai, para a subida acontecer à vista. */}
      {isLoading ? (
        <Brand />
      ) : (
        <Brand entering={FadeInUp.duration(700).easing(Easing.out(Easing.exp))}>
          <Wordmark accessibilityRole="header" maxFontSizeMultiplier={1.4}>
            Pescare
          </Wordmark>
          <Tagline>Anote sua pesca e suas vendas. Saiba os defesos da sua cidade.</Tagline>
        </Brand>
      )}
      <Actions>
        <Button tone="inverse" label="Criar conta" onPress={() => router.push('/sign-up')} />
        <Button
          tone="inverse"
          variant="outlined"
          label="Já tenho conta"
          onPress={() => router.push('/sign-in')}
        />
      </Actions>
    </Container>
  )
}

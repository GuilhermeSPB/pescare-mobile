import { router } from 'expo-router'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { TopAppBar } from './TopAppBar'

// No iOS os eventos "will" chegam junto com a animação do teclado; os "did", só no fim
// (o rodapé daria um pulo). O Android só emite os "did".
const KEYBOARD_SHOW = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
const KEYBOARD_HIDE = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

function useKeyboardVisible() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = Keyboard.addListener(KEYBOARD_SHOW, () => setVisible(true))
    const hide = Keyboard.addListener(KEYBOARD_HIDE, () => setVisible(false))

    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  return visible
}

type FormScreenProps = {
  appBarTitle: string
  headline: string
  example?: string
  progress?: { step: number; total: number }
  children: ReactNode
  footer: ReactNode
}

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.surface};
`

const ProgressRow = styled.View`
  gap: ${({ theme }) => theme.space.sm}px;
  margin-bottom: ${({ theme }) => theme.space.xxl}px;
`

const Track = styled.View`
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.primaryTrack};
`

const Indicator = styled.View`
  height: 4px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.primary};
`

const StepText = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

const Headline = styled.Text`
  font-size: ${({ theme }) => theme.typography.headline.fontSize}px;
  line-height: ${({ theme }) => theme.typography.headline.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.headline.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

const Example = styled.Text`
  margin-top: ${({ theme }) => theme.space.sm}px;
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

const Body = styled.View`
  margin-top: ${({ theme }) => theme.space.xl}px;
  gap: ${({ theme }) => theme.space.lg}px;
`

const Footer = styled.View<{ $edge: boolean }>`
  gap: ${({ theme }) => theme.space.sm}px;
  padding-horizontal: ${({ theme }) => theme.space.lg}px;
  padding-top: ${({ theme }) => theme.space.md}px;
  border-top-width: 1px;
  border-top-color: ${({ theme, $edge }) => ($edge ? theme.colors.outlineVariant : 'transparent')};
  background-color: ${({ theme }) => theme.colors.surface};
`

// Esqueleto das telas de formulário: uma pergunta por tela, com o botão principal
// sempre visível acima do teclado.
export function FormScreen({
  appBarTitle,
  headline,
  example,
  progress,
  children,
  footer,
}: FormScreenProps) {
  const insets = useSafeAreaInsets()
  const { space } = useTheme()
  const keyboardVisible = useKeyboardVisible()
  // Linhas na barra e no rodapé só quando há conteúdo passando por baixo deles.
  const [edges, setEdges] = useState({ top: false, bottom: false })
  const metrics = useRef({ offset: 0, viewport: 0, content: 0 })

  function updateEdges(changes: Partial<typeof metrics.current>) {
    Object.assign(metrics.current, changes)
    const { offset, viewport, content } = metrics.current
    const top = offset > 0
    const bottom = offset + viewport < content - 1

    setEdges((current) =>
      current.top === top && current.bottom === bottom ? current : { top, bottom },
    )
  }

  return (
    <Container>
      <TopAppBar title={appBarTitle} onBack={() => router.back()} elevated={edges.top} />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          scrollEventThrottle={32}
          onScroll={(event) => updateEdges({ offset: event.nativeEvent.contentOffset.y })}
          onLayout={(event) => updateEdges({ viewport: event.nativeEvent.layout.height })}
          onContentSizeChange={(_width, height) => updateEdges({ content: height })}
          contentContainerStyle={{
            paddingHorizontal: space.lg,
            paddingTop: space.sm,
            paddingBottom: space.xl,
          }}
        >
          {progress && (
            <ProgressRow>
              <Track
                accessibilityRole="progressbar"
                accessibilityLabel={`Passo ${progress.step} de ${progress.total}`}
                accessibilityValue={{ min: 0, max: progress.total, now: progress.step }}
              >
                <Indicator style={{ width: `${(progress.step / progress.total) * 100}%` }} />
              </Track>
              <StepText importantForAccessibility="no">
                Passo {progress.step} de {progress.total}
              </StepText>
            </ProgressRow>
          )}
          <Headline accessibilityRole="header">{headline}</Headline>
          {example && <Example>{example}</Example>}
          <Body>{children}</Body>
        </ScrollView>
        {/* Com o teclado aberto, a barra de gestos fica atrás dele: sem a folga do inset. */}
        <Footer
          $edge={edges.bottom}
          style={{ paddingBottom: (keyboardVisible ? 0 : insets.bottom) + space.lg }}
        >
          {footer}
        </Footer>
      </KeyboardAvoidingView>
    </Container>
  )
}

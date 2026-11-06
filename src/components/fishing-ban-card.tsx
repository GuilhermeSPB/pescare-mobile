import styled from 'styled-components/native'

// Texto pronto de um defeso para o cartão. Quem monta é a feature de defesos: o cartão só mostra.
export type FishingBanCardData = {
  id: number
  rule: string
  // Defeso que vale agora: ganha o destaque vermelho.
  highlight: boolean
  statusText: string
  speciesText: string
  locationText: string
}

type FishingBanCardProps = {
  ban: FishingBanCardData
  onPress: () => void
}

const Card = styled.Pressable<{ $highlight: boolean }>`
  gap: ${({ theme }) => theme.space.sm}px;
  padding: ${({ theme }) => theme.space.lg}px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  border-width: ${({ $highlight }) => ($highlight ? 2 : 1)}px;
  border-color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.error : theme.colors.outlineVariant};
  background-color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.errorContainer : theme.colors.surface};
`

const Rule = styled.Text<{ $highlight: boolean }>`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.onErrorContainer : theme.colors.onSurface};
`

const Status = styled.Text<{ $highlight: boolean }>`
  font-size: ${({ theme }) => theme.typography.label.fontSize}px;
  line-height: ${({ theme }) => theme.typography.label.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.onErrorContainer : theme.colors.onSurfaceVariant};
`

const Detail = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

// Cartão de um defeso. O vermelho com borda grossa marca o que vale agora: defeso é proibição.
export function FishingBanCard({ ban, onPress }: FishingBanCardProps) {
  return (
    <Card
      onPress={onPress}
      $highlight={ban.highlight}
      accessibilityRole="button"
      accessibilityLabel={`${ban.rule}. ${ban.statusText}. Espécies: ${ban.speciesText}. Locais: ${ban.locationText}`}
      android_ripple={{ color: 'rgba(37, 99, 235, 0.12)' }}
    >
      <Rule $highlight={ban.highlight}>{ban.rule}</Rule>
      <Status $highlight={ban.highlight}>{ban.statusText}</Status>
      <Detail>Espécies: {ban.speciesText}</Detail>
      <Detail>Locais: {ban.locationText}</Detail>
    </Card>
  )
}

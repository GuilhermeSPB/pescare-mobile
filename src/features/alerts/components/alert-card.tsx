import { Pressable } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Icon } from '@/components/Icon'
import { toSingleLine } from '@/utils/text'

import type { AlertListItem } from '../types/alert'
import { describePublication } from '../utils/describe-publication'

type AlertCardProps = {
  alert: AlertListItem
  onPress: () => void
}

// O contorno fica por fora e corta o ripple do Android nos cantos arredondados.
const Card = styled.View`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.card}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.outlineVariant};
  background-color: ${({ theme }) => theme.colors.surface};
`

const Published = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

const AlertTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

const Excerpt = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

const ReadLink = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: flex-end;
`

const ReadText = styled.Text`
  font-size: ${({ theme }) => theme.typography.label.fontSize}px;
  line-height: ${({ theme }) => theme.typography.label.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.colors.primary};
`

// Um comunicado na lista: data, título e o começo do texto. O texto vem cortado, então o
// "Ler" com a seta diz que o cartão inteiro abre o comunicado.
export function AlertCard({ alert, onPress }: AlertCardProps) {
  const { colors, space } = useTheme()
  const published = describePublication(alert.publication_date)

  return (
    <Card>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${alert.title}. ${published}. Ler comunicado`}
        android_ripple={{ color: 'rgba(37, 99, 235, 0.16)' }}
        style={({ pressed }) => ({
          gap: space.sm,
          padding: space.lg,
          backgroundColor:
            pressed && process.env.EXPO_OS !== 'android'
              ? 'rgba(37, 99, 235, 0.08)'
              : 'transparent',
        })}
      >
        <Published>{published}</Published>
        <AlertTitle>{alert.title}</AlertTitle>
        <Excerpt numberOfLines={3}>{toSingleLine(alert.description)}</Excerpt>
        <ReadLink>
          <ReadText>Ler</ReadText>
          <Icon name="chevronRight" color={colors.primary} />
        </ReadLink>
      </Pressable>
    </Card>
  )
}

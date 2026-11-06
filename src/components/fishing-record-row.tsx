import { Pressable } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { formatBrl } from '@/utils/format-currency'
import { formatDateLabel, parseIsoDate } from '@/utils/iso-date'

import { Icon } from './Icon'

// Uma pesca como a lista mostra: o que a linha precisa, sem o formato completo da API.
export type FishingRecordRowData = {
  id: number
  fishingDate: string
  isFinished: boolean
  speciesNames: string[]
  // null quando a pesca não teve venda.
  totalEarned: number | null
}

type FishingRecordRowProps = {
  item: FishingRecordRowData
  onPress: () => void
}

const Texts = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.space.xs}px;
`

const RowDate = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

const RowDetail = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

const OpenLink = styled.View`
  flex-direction: row;
  align-items: center;
`

const OpenText = styled.Text`
  font-size: ${({ theme }) => theme.typography.label.fontSize}px;
  line-height: ${({ theme }) => theme.typography.label.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.colors.primary};
`

// "R$ 100,00" ou "Sem venda"; pesca em aberto ganha o aviso no fim, em texto e não só em cor.
function moneyText(item: FishingRecordRowData): string {
  const money = item.totalEarned === null ? 'Sem venda' : formatBrl(item.totalEarned)

  return item.isFinished ? money : `${money} · Falta terminar`
}

// Uma pesca numa lista (home e histórico). A linha inteira é o alvo do toque, com "Ver" para
// dizer o que acontece.
export function FishingRecordRow({ item, onPress }: FishingRecordRowProps) {
  const { colors, size, space } = useTheme()
  const date = formatDateLabel(parseIsoDate(item.fishingDate))
  const species = item.speciesNames.join(', ')
  const money = moneyText(item)

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver pesca de ${date}, ${species}, ${money}`}
      android_ripple={{ color: 'rgba(37, 99, 235, 0.16)' }}
      style={({ pressed }) => ({
        minHeight: size.control,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.md,
        paddingVertical: space.sm,
        backgroundColor:
          pressed && process.env.EXPO_OS !== 'android' ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
      })}
    >
      <Texts>
        <RowDate>{date}</RowDate>
        <RowDetail numberOfLines={2}>{species}</RowDetail>
        <RowDetail>{money}</RowDetail>
      </Texts>
      <OpenLink>
        <OpenText>Ver</OpenText>
        <Icon name="chevronRight" color={colors.primary} />
      </OpenLink>
    </Pressable>
  )
}

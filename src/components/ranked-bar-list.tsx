import styled from 'styled-components/native'

// Uma linha do ranking: o nome, o valor escrito e a barra do tamanho do valor.
export type RankedBarItem = {
  key: string
  label: string
  // Linha de apoio embaixo do nome, como "em 3 dias". Some quando não há.
  detail?: string
  value: number
  valueLabel: string
}

type RankedBarListProps = {
  // Subtítulo dentro da seção, como "Em quilos". Some quando não há.
  title?: string
  // Na ordem em que devem aparecer: quem chama decide o ranking.
  items: RankedBarItem[]
}

const List = styled.View`
  gap: ${({ theme }) => theme.space.lg}px;
`

const ListTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.label.fontSize}px;
  line-height: ${({ theme }) => theme.typography.label.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

const Row = styled.View`
  gap: ${({ theme }) => theme.space.xs}px;
`

// Nome à esquerda e valor à direita. Com fonte grande, o valor desce para a linha de baixo.
const RowHeader = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  column-gap: ${({ theme }) => theme.space.sm}px;
`

const ItemLabel = styled.Text`
  flex-shrink: 1;
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurface};
`

const ItemValue = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

const ItemDetail = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

// Faixa da barra: só ocupa a largura toda para a porcentagem ter base. Não tem cor (não é limite).
const BarLane = styled.View`
  height: ${({ theme }) => theme.size.barThickness}px;
`

// Base reta na esquerda (a linha de zero) e ponta arredondada no fim, como no guia de gráficos.
const Bar = styled.View`
  height: 100%;
  min-width: ${({ theme }) => theme.radius.bar}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-top-right-radius: ${({ theme }) => theme.radius.bar}px;
  border-bottom-right-radius: ${({ theme }) => theme.radius.bar}px;
`

// Largura da barra em relação à maior da lista.
function barShare(value: number, maxValue: number): `${number}%` {
  if (maxValue <= 0) return '0%'

  return `${(value / maxValue) * 100}%`
}

function describeItem(item: RankedBarItem): string {
  return [`${item.label}: ${item.valueLabel}`, item.detail].filter(Boolean).join(', ')
}

// Ranking em barras deitadas: o nome fica em texto normal, acima da barra, e quebra linha com
// fonte grande em vez de cortar. Cada linha é lida inteira pelo leitor de tela.
export function RankedBarList({ title, items }: RankedBarListProps) {
  const maxValue = Math.max(0, ...items.map((item) => item.value))

  return (
    <List>
      {title && <ListTitle accessibilityRole="header">{title}</ListTitle>}
      {items.map((item) => (
        <Row key={item.key} accessible accessibilityLabel={describeItem(item)}>
          <RowHeader>
            <ItemLabel>{item.label}</ItemLabel>
            <ItemValue>{item.valueLabel}</ItemValue>
          </RowHeader>
          <BarLane>
            <Bar style={{ width: barShare(item.value, maxValue) }} />
          </BarLane>
          {item.detail && <ItemDetail>{item.detail}</ItemDetail>}
        </Row>
      ))}
    </List>
  )
}

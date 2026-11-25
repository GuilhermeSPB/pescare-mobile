import { useState } from 'react'
import { type LayoutChangeEvent, useWindowDimensions, View } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import styled, { useTheme } from 'styled-components/native'

import { groupThousands } from '@/utils/group-thousands'

// Uma coluna do gráfico: o rótulo curto embaixo ("Nov") e o nome inteiro para o leitor de tela e
// para a linha que mostra o mês tocado ("Novembro").
export type MonthColumn = {
  key: string
  label: string
  name: string
  value: number
  valueLabel: string
}

type MonthColumnChartProps = {
  title: string
  // Em ordem de calendário. A última coluna (o mês mais recente) começa escolhida.
  columns: MonthColumn[]
}

// Largura de "Mai" no corpo de 16, com folga: base da largura de cada coluna antes da escala da
// fonte do sistema.
const MONTH_LABEL_WIDTH = 36
// Largura de "10.000" no corpo de 16, base da faixa dos números do eixo.
const AXIS_LABEL_WIDTH = 52
const AXIS_SECTIONS = 4

const Container = styled.View`
  gap: ${({ theme }) => theme.space.sm}px;
`

const ChartTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.label.fontSize}px;
  line-height: ${({ theme }) => theme.typography.label.lineHeight}px;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`

const Readout = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurface};
`

const Hint = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

function describeColumns(title: string, columns: MonthColumn[]): string {
  return `${title}. ${columns.map((column) => `${column.name}: ${column.valueLabel}`).join('. ')}`
}

// Número do eixo em pt-BR, sem casas: "1.000".
function formatAxisLabel(label: string): string {
  return groupThousands(String(Math.round(Number(label))))
}

// Topo do eixo com passos redondos (1, 2, 2,5 ou 5 vezes uma potência de 10): sem ele, a
// biblioteca divide o maior valor em partes quebradas, como 102, 205, 307.
function roundAxisMax(maxValue: number, sections: number): number {
  if (maxValue <= 0) return sections

  const rawStep = maxValue / sections
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const niceFactor = [1, 2, 2.5, 5, 10].find((factor) => factor * magnitude >= rawStep) ?? 10

  return niceFactor * magnitude * sections
}

// Colunas mês a mês. É o único lugar do app que usa o react-native-gifted-charts: trocar de
// biblioteca mexe só aqui. As medidas de rótulo seguem a fonte do sistema, porque a biblioteca
// põe cada rótulo numa caixa de tamanho fixo. O toque numa coluna mostra o valor dela em texto.
export function MonthColumnChart({ title, columns }: MonthColumnChartProps) {
  const { colors, size, space, radius, typography } = useTheme()
  const { fontScale } = useWindowDimensions()
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(columns.length - 1)
  const selected = columns[selectedIndex] ?? columns[columns.length - 1]
  const slotWidth = Math.max(size.columnWidth + space.sm, Math.ceil(MONTH_LABEL_WIDTH * fontScale))
  const axisLabelWidth = Math.ceil(AXIS_LABEL_WIDTH * fontScale)
  const axisMax = roundAxisMax(Math.max(0, ...columns.map((column) => column.value)), AXIS_SECTIONS)
  const labelTextStyle = {
    color: colors.onSurfaceVariant,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  }

  // Tela escondida (outro item do menu aberto, na web) mede largura 0: sem espaço, não desenha,
  // senão a biblioteca monta um <svg> de largura negativa e enche o console de erros.
  const chartWidth = containerWidth === null ? 0 : containerWidth - axisLabelWidth

  const handleLayout = (event: LayoutChangeEvent) =>
    setContainerWidth(event.nativeEvent.layout.width)

  return (
    <Container>
      <ChartTitle accessibilityRole="header">{title}</ChartTitle>
      {selected && (
        <Readout accessibilityLiveRegion="polite">
          {selected.name}: {selected.valueLabel}
        </Readout>
      )}
      <View onLayout={handleLayout} accessible accessibilityLabel={describeColumns(title, columns)}>
        {chartWidth > 0 && (
          <BarChart
            data={columns.map((column) => ({ value: column.value, label: column.label }))}
            width={chartWidth}
            height={size.columnChartHeight}
            barWidth={size.columnWidth}
            labelWidth={size.columnWidth}
            spacing={slotWidth - size.columnWidth}
            initialSpacing={space.sm}
            endSpacing={space.sm}
            frontColor={colors.primary}
            barBorderTopLeftRadius={radius.bar}
            barBorderTopRightRadius={radius.bar}
            noOfSections={AXIS_SECTIONS}
            maxValue={axisMax}
            rulesType="solid"
            rulesColor={colors.outlineVariant}
            rulesThickness={1}
            xAxisThickness={1}
            xAxisColor={colors.outline}
            yAxisThickness={0}
            yAxisLabelWidth={axisLabelWidth}
            yAxisTextStyle={labelTextStyle}
            formatYLabel={formatAxisLabel}
            xAxisLabelTextStyle={labelTextStyle}
            xAxisLabelsHeight={Math.ceil(typography.body.lineHeight * fontScale)}
            xAxisTextNumberOfLines={1}
            focusBarOnPress
            focusedBarIndex={selectedIndex}
            focusedBarConfig={{ color: colors.onPrimaryContainer }}
            onPress={(_item: unknown, index: number) => setSelectedIndex(index)}
            scrollToEnd
            isAnimated={false}
          />
        )}
      </View>
      <Hint>Toque numa coluna para ver o valor do mês.</Hint>
    </Container>
  )
}

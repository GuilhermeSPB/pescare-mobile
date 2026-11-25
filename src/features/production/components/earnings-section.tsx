import styled from 'styled-components/native'

import { MonthColumnChart } from '@/components/month-column-chart'
import { SectionCard } from '@/components/SectionCard'
import { StatCard } from '@/components/stat-card'
import { formatBrl } from '@/utils/format-currency'

import type { FinanceIndicators } from '../types/production-indicators'
import { describeEarningsChange } from '../utils/describe-earnings-change'
import { describeFishingDays } from '../utils/to-capture-bar-items'
import { toEarningsColumns } from '../utils/to-earnings-columns'

type EarningsSectionProps = {
  year: number
  finance: FinanceIndicators
  workedDays: number
}

// Um cartão por linha: o valor em reais e a frase de comparação precisam da largura toda com
// fonte grande. A linha em `row` dá a largura ao `flex: 1` do StatCard.
const CardRow = styled.View`
  flex-direction: row;
`

// Indicadores financeiros: o total, o ganho por dia de pesca e, no ano, as colunas mês a mês.
// Só há receita: o banco não guarda despesas.
export function EarningsSection({ year, finance, workedDays }: EarningsSectionProps) {
  const columns = finance.by_month ? toEarningsColumns(finance.by_month, year, new Date()) : []
  const hasMonthlyEarnings = columns.some((column) => column.value > 0)

  return (
    <SectionCard title="Quanto ganhei">
      <CardRow>
        <StatCard
          label="Total ganho"
          value={formatBrl(finance.total_earned)}
          detail={describeEarningsChange(finance.total_earned, finance.previous_period)}
        />
      </CardRow>
      <CardRow>
        <StatCard
          label="Por dia de pesca"
          value={finance.earned_per_day === null ? '—' : formatBrl(finance.earned_per_day)}
          detail={describeFishingDays(workedDays)}
        />
      </CardRow>
      {hasMonthlyEarnings && <MonthColumnChart key={year} title="Mês a mês" columns={columns} />}
    </SectionCard>
  )
}

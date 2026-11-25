import { useState } from 'react'
import styled from 'styled-components/native'

import { ExpandableCard } from '@/components/expandable-card'
import { SectionCard } from '@/components/SectionCard'
import { formatMonthName } from '@/utils/iso-date'

import type { ReapCatalogs, ReapMonthSummary } from '../types/reap'
import { formatDays } from '../utils/format-worked-days'
import { describeMonthWithoutFishing } from '../utils/reap-texts'
import { ReapPeriodDetails } from './reap-period-details'
import { RecordNote } from './record-text'

const List = styled.View`
  gap: ${({ theme }) => theme.space.md}px;
`

type ReapYearMonthsProps = {
  monthSummaries: ReapMonthSummary[]
  catalogs: ReapCatalogs
}

// O ano mês a mês, como na escolha "Por mês": cada mês com pesca abre e fecha; mês parado fica
// fechado, com a frase. Sem total do ano (decisão do time).
export function ReapYearMonths({ monthSummaries, catalogs }: ReapYearMonthsProps) {
  const [openMonths, setOpenMonths] = useState<number[]>([])

  const handleToggle = (month: number) =>
    setOpenMonths((current) =>
      current.includes(month) ? current.filter((item) => item !== month) : [...current, month],
    )

  return (
    <List>
      {monthSummaries.map(({ month, summary }) => {
        const title = formatMonthName(month - 1)

        if (!summary.hasFished) {
          return (
            <SectionCard key={month} title={title}>
              <RecordNote>{describeMonthWithoutFishing(summary)}</RecordNote>
            </SectionCard>
          )
        }

        return (
          <ExpandableCard
            key={month}
            title={title}
            summary={`${formatDays(summary.workedDays)} de pesca`}
            isExpanded={openMonths.includes(month)}
            onToggle={() => handleToggle(month)}
          >
            <ReapPeriodDetails summary={summary} catalogs={catalogs} />
          </ExpandableCard>
        )
      })}
    </List>
  )
}

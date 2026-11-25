import { EmptyState } from '@/components/EmptyState'

import type { ProductionIndicators } from '../types/production-indicators'
import {
  toLocationCaptureRows,
  toMethodCaptureRows,
  toSpeciesCaptureRows,
} from '../utils/to-capture-bar-items'
import { CatchSection } from './catch-section'
import { EarningsSection } from './earnings-section'
import { SalesSection } from './sales-section'

type ProductionIndicatorsViewProps = {
  indicators: ProductionIndicators
}

// As cinco seções, uma por indicador: financeiro, captura por espécie, por lugar e por método, e
// comercialização. Sem pesca terminada no período, fica só a frase de vazio. As pescas sem
// terminar ficam fora, sem aviso na tela.
export function ProductionIndicatorsView({ indicators }: ProductionIndicatorsViewProps) {
  return (
    <>
      {indicators.overview.finished_count === 0 && (
        <EmptyState message="Nenhuma pesca terminada neste período." />
      )}
      {indicators.overview.finished_count > 0 && (
        <>
          <EarningsSection
            year={indicators.period.year}
            finance={indicators.finance}
            workedDays={indicators.overview.worked_days}
          />
          <CatchSection
            title="O que pesquei"
            rows={toSpeciesCaptureRows(indicators.catches_by_species)}
          />
          <CatchSection
            title="Onde pesquei"
            rows={toLocationCaptureRows(indicators.catches_by_location)}
          />
          <CatchSection
            title="Como pesquei"
            rows={toMethodCaptureRows(indicators.catches_by_method)}
          />
          <SalesSection sales={indicators.sales} />
        </>
      )}
    </>
  )
}

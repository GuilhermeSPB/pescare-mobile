import { RankedBarList } from '@/components/ranked-bar-list'
import { SectionCard } from '@/components/SectionCard'

import { type CaptureRow, toCaptureBarItems } from '../utils/to-capture-bar-items'

type CatchSectionProps = {
  title: string
  rows: CaptureRow[]
}

// Uma seção de captura (por espécie, lugar ou método). Quilo e unidade não se somam: cada um tem
// o seu ranking, e o subtítulo só aparece quando os dois existem.
export function CatchSection({ title, rows }: CatchSectionProps) {
  const kgItems = toCaptureBarItems(rows, 'KG')
  const unitItems = toCaptureBarItems(rows, 'UNIDADE')
  const hasBothUnits = kgItems.length > 0 && unitItems.length > 0

  return (
    <SectionCard title={title}>
      {kgItems.length > 0 && (
        <RankedBarList title={hasBothUnits ? 'Em quilos' : undefined} items={kgItems} />
      )}
      {unitItems.length > 0 && (
        <RankedBarList title={hasBothUnits ? 'Em unidades' : undefined} items={unitItems} />
      )}
    </SectionCard>
  )
}

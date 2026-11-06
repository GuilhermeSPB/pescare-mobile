import { EmptyState } from '@/components/EmptyState'
import { FishingRecordRow, type FishingRecordRowData } from '@/components/fishing-record-row'
import { SectionCard } from '@/components/SectionCard'

type RecentFishingsCardProps = {
  items: FishingRecordRowData[]
  onOpen: (recordId: number) => void
}

// Últimas pescas na home. Lista curta: o histórico completo fica na aba Histórico.
export function RecentFishingsCard({ items, onOpen }: RecentFishingsCardProps) {
  return (
    <SectionCard title="Últimas pescas">
      {items.length === 0 && (
        <EmptyState message="Suas pescas aparecem aqui depois que você registrar a primeira." />
      )}
      {items.map((item) => (
        <FishingRecordRow key={item.id} item={item} onPress={() => onOpen(item.id)} />
      ))}
    </SectionCard>
  )
}

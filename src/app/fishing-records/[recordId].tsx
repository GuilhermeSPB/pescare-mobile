import { useLocalSearchParams } from 'expo-router'

import { FishingDetailScreen } from '@/features/fishing-records/screens/fishing-detail-screen'

// O id chega da URL como texto; a API e a tela trabalham com número.
export default function FishingRecordRoute() {
  const { recordId } = useLocalSearchParams<{ recordId: string }>()

  return <FishingDetailScreen recordId={Number(recordId)} />
}

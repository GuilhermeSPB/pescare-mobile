import { useLocalSearchParams } from 'expo-router'

import { FishingBanDetailScreen } from '@/features/fishing-bans/screens/fishing-ban-detail-screen'

// O id chega da URL como texto; a API e a tela trabalham com número. A cidade é opcional:
// sem ela, o detalhe usa a cidade do cadastro.
export default function FishingBanRoute() {
  const { banId, city } = useLocalSearchParams<{ banId: string; city?: string }>()

  return <FishingBanDetailScreen banId={Number(banId)} cityCode={city ?? null} />
}

import { useLocalSearchParams } from 'expo-router'

import { AlertDetailScreen } from '@/features/alerts/screens/alert-detail-screen'

// O id chega da URL como texto; a API e a tela trabalham com número.
export default function AlertRoute() {
  const { alertId } = useLocalSearchParams<{ alertId: string }>()

  return <AlertDetailScreen alertId={Number(alertId)} />
}

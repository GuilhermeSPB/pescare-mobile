import { Stack } from 'expo-router'

import { FishingRecordFormProvider } from '@/features/fishing-records/contexts/fishing-record-form-context'
import { theme } from '@/theme/theme'

// Fluxo de registro: cada passo é uma rota, então o "voltar" do sistema volta um passo.
export default function FishingRecordsLayout() {
  return (
    <FishingRecordFormProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.surface },
        }}
      />
    </FishingRecordFormProvider>
  )
}

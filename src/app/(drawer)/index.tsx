import { useFishingRecords } from '@/features/fishing-records/api/get-fishing-records'
import { summarizeMonth } from '@/features/fishing-records/utils/summarize-month'
import { toFishingRecordRowData } from '@/features/fishing-records/utils/to-fishing-record-row'
import { useMunicipalityFishingBans } from '@/features/fishing-bans/api/get-municipality-fishing-bans'
import { toFishingBanCardData } from '@/features/fishing-bans/utils/to-fishing-ban-card-data'
import { HomeScreen } from '@/features/home/screens/home-screen'
import { useMe } from '@/hooks/use-me'
import { useMunicipalities } from '@/hooks/use-municipalities'
import { formatMonthLabel, monthPrefix } from '@/utils/iso-date'
import { describeMunicipality } from '@/utils/municipalities'

const RECENT_LIMIT = 3

// Rota da home: junta as pescas e os defesos (features de registro e de defesos) com a tela de
// início, sem que as features se importem entre si.
export default function HomeRoute() {
  const recordsQuery = useFishingRecords()
  const meQuery = useMe()
  const municipalitiesQuery = useMunicipalities()
  const municipality = meQuery.data?.fk_municipality_ibge_code ?? null
  const bansQuery = useMunicipalityFishingBans(municipality)
  const records = recordsQuery.data
  const today = new Date()

  return (
    <HomeScreen
      monthLabel={formatMonthLabel(today)}
      stats={records && summarizeMonth(records, monthPrefix(today))}
      recent={records?.slice(0, RECENT_LIMIT).map(toFishingRecordRowData)}
      query={{
        isPending: recordsQuery.isPending,
        isError: recordsQuery.isError,
        error: recordsQuery.error,
        onRetry: () => recordsQuery.refetch(),
      }}
      fishingBans={{
        cityLabel: describeMunicipality(municipalitiesQuery.data, municipality ?? ''),
        cards: bansQuery.data?.filter((ban) => ban.status === 'EM_VIGOR').map(toFishingBanCardData),
        isLoading: bansQuery.isLoading,
        isError: bansQuery.isError,
        error: bansQuery.error,
        onRetry: () => bansQuery.refetch(),
      }}
    />
  )
}

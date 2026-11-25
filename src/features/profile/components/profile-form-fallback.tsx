import { FormScreen } from '@/components/FormScreen'
import { QueryFeedback } from '@/components/QueryFeedback'

type ProfileFormFallbackProps = {
  appBarTitle: string
  headline: string
  isMeError: boolean
  meError: unknown
  onRetry: () => void
}

// O formulário começa com os dados de hoje. Quando eles ainda não chegaram (o app abriu direto
// nesta tela), mostra o carregando ou o erro com "Tentar de novo".
export function ProfileFormFallback({
  appBarTitle,
  headline,
  isMeError,
  meError,
  onRetry,
}: ProfileFormFallbackProps) {
  return (
    <FormScreen appBarTitle={appBarTitle} headline={headline} footer={null}>
      <QueryFeedback isPending={!isMeError} isError={isMeError} error={meError} onRetry={onRetry} />
    </FormScreen>
  )
}

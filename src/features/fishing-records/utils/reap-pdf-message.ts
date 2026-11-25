import type { PdfSaveOutcome } from '@/types/pdf'

// Aviso abaixo dos botões do PDF, com o tom do `FormMessage`.
export type ReapPdfMessage = { tone: 'error' | 'success'; text: string }

type ReapPdfOutcome = {
  hasSendError: boolean
  hasSaveError: boolean
  // undefined enquanto não houve "salvar" ou depois que ele foi apagado por um "enviar".
  saveOutcome: PdfSaveOutcome | undefined
}

/**
 * O aviso da última ação do PDF. Só "salvo" ganha mensagem de sucesso: no "enviar" e no menu do
 * iPhone, quem decide o que fazer com o arquivo é a pessoa, no menu do sistema.
 *
 * @example
 * describeReapPdfOutcome({ hasSendError: false, hasSaveError: false, saveOutcome: 'saved' })
 * // { tone: 'success', text: 'PDF salvo na pasta que você escolheu.' }
 */
export function describeReapPdfOutcome(outcome: ReapPdfOutcome): ReapPdfMessage | null {
  if (outcome.hasSendError) {
    return { tone: 'error', text: 'Não deu para criar o PDF. Tente de novo.' }
  }
  if (outcome.hasSaveError) {
    return { tone: 'error', text: 'Não deu para salvar o PDF. Tente de novo.' }
  }
  if (outcome.saveOutcome === 'saved') {
    return { tone: 'success', text: 'PDF salvo na pasta que você escolheu.' }
  }

  return null
}

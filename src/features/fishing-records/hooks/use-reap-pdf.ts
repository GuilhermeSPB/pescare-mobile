import { useMutation } from '@tanstack/react-query'

import { savePdfToDevice } from '@/lib/save-pdf'
import { sharePdf } from '@/lib/share-pdf'

import type { ReapPdfContent } from '../types/reap'
import { describeReapPdfOutcome, type ReapPdfMessage } from '../utils/reap-pdf-message'
import { toReapPdfDocument } from '../utils/to-reap-pdf-document'

type ReapPdfActions = {
  sendPdf: (content: ReapPdfContent) => void
  savePdf: (content: ReapPdfContent) => void
  isPdfSending: boolean
  isPdfSaving: boolean
  pdfMessage: ReapPdfMessage | null
}

/**
 * As duas saídas do PDF do REAP: enviar (menu de compartilhar) e salvar no celular. São
 * mutações para os botões terem o "gerando" e o erro sem estado à mão; nada vai para a API.
 *
 * @example
 * const reapPdf = useReapPdf()
 * reapPdf.savePdf(content)
 */
export function useReapPdf(): ReapPdfActions {
  const sendMutation = useMutation({
    mutationFn: (content: ReapPdfContent) =>
      sharePdf(toReapPdfDocument(content), 'Enviar resumo do REAP'),
    onError: (error) => console.error('[reap-pdf] Erro ao gerar ou enviar o PDF:', error),
  })
  const saveMutation = useMutation({
    mutationFn: (content: ReapPdfContent) =>
      savePdfToDevice(toReapPdfDocument(content), 'Salvar resumo do REAP'),
    onError: (error) => console.error('[reap-pdf] Erro ao gerar ou salvar o PDF:', error),
  })

  // Só o aviso da última ação aparece: começar uma apaga o resultado da outra.
  const sendPdf = (content: ReapPdfContent) => {
    saveMutation.reset()
    sendMutation.mutate(content)
  }
  const savePdf = (content: ReapPdfContent) => {
    sendMutation.reset()
    saveMutation.mutate(content)
  }

  return {
    sendPdf,
    savePdf,
    isPdfSending: sendMutation.isPending,
    isPdfSaving: saveMutation.isPending,
    pdfMessage: describeReapPdfOutcome({
      hasSendError: sendMutation.isError,
      hasSaveError: saveMutation.isError,
      saveOutcome: saveMutation.data,
    }),
  }
}

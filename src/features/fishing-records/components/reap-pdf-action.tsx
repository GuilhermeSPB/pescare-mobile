import styled from 'styled-components/native'

import { Button } from '@/components/Button'
import { FormMessage } from '@/components/FormMessage'

import type { ReapPdfMessage } from '../utils/reap-pdf-message'
import { RecordNote } from './record-text'

type ReapPdfActionProps = {
  // Falso até chegarem o usuário e os catálogos: sem eles o PDF sairia com "—".
  canUsePdf: boolean
  isPdfSending: boolean
  isPdfSaving: boolean
  // Aviso da última ação (erro ou "salvo"). null = nada a dizer.
  pdfMessage: ReapPdfMessage | null
  onSendPdf: () => void
  onSavePdf: () => void
}

const Action = styled.View`
  gap: ${({ theme }) => theme.space.sm}px;
`

// Os botões do PDF (enviar e salvar no celular), a frase que diz para que servem e o aviso da
// última ação. Enquanto um gera o PDF, o outro fica desligado.
export function ReapPdfAction({
  canUsePdf,
  isPdfSending,
  isPdfSaving,
  pdfMessage,
  onSendPdf,
  onSavePdf,
}: ReapPdfActionProps) {
  return (
    <Action>
      <Button
        label="Enviar resumo em PDF"
        onPress={onSendPdf}
        loading={isPdfSending}
        disabled={!canUsePdf || isPdfSaving}
      />
      <Button
        variant="outlined"
        label="Salvar PDF no celular"
        onPress={onSavePdf}
        loading={isPdfSaving}
        disabled={!canUsePdf || isPdfSending}
      />
      <RecordNote>Mande pelo WhatsApp ou guarde o arquivo no celular.</RecordNote>
      {pdfMessage && <FormMessage tone={pdfMessage.tone}>{pdfMessage.text}</FormMessage>}
    </Action>
  )
}

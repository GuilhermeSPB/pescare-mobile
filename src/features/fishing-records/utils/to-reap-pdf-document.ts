import type { PdfDocument } from '@/types/pdf'

import type { ReapPdfContent } from '../types/reap'
import { buildReapHtml } from './build-reap-html'
import { toReapPdfFileName } from './reap-pdf-file-name'

/**
 * O PDF do REAP pronto para enviar ou salvar: o HTML e o nome do arquivo.
 *
 * @example
 * toReapPdfDocument(content).fileName // "REAP-2026-Joao-da-Silva.pdf"
 */
export function toReapPdfDocument(content: ReapPdfContent): PdfDocument {
  return {
    html: buildReapHtml(content),
    fileName: toReapPdfFileName(content.period, content.fisherName),
  }
}

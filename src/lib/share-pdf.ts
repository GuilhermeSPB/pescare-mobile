import { File, Paths } from 'expo-file-system'
import { isAvailableAsync, shareAsync } from 'expo-sharing'

import type { PdfDocument } from '@/types/pdf'

import { printPdfToBase64 } from './print-pdf'

// Na web (só preview de desenvolvimento) o expo-print imprime a página do app, não o HTML, e
// não há arquivo para compartilhar. O HTML abre numa aba nova, para conferir o conteúdo.
function openHtmlInNewTab(html: string): void {
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))

  window.open(url, '_blank')
}

// Grava o PDF no cache do app com o nome final, que é o que aparece para quem recebe.
function writeCachedPdf(base64: string, fileName: string): File {
  const pdfFile = new File(Paths.cache, fileName)

  // O nome se repete quando a pessoa gera o mesmo período de novo: `write` sobrescreve o velho.
  pdfFile.write(base64, { encoding: 'base64' })

  return pdfFile
}

/**
 * Gera o PDF e abre o menu de compartilhar do celular (WhatsApp, Drive, imprimir). Fechar o
 * menu sem escolher nada não é erro.
 *
 * @example
 * await sharePdf({ html, fileName: 'REAP-2026-Ana.pdf' }, 'Enviar resumo do REAP')
 */
export async function sharePdf(pdf: PdfDocument, dialogTitle: string): Promise<void> {
  if (process.env.EXPO_OS === 'web') return openHtmlInNewTab(pdf.html)

  if (!(await isAvailableAsync())) {
    throw new Error(`Compartilhar não está disponível neste aparelho (arquivo: ${pdf.fileName})`)
  }

  const pdfFile = writeCachedPdf(await printPdfToBase64(pdf.html), pdf.fileName)

  await shareAsync(pdfFile.uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle })
}

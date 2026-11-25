import { Directory } from 'expo-file-system'

import type { PdfDocument, PdfSaveOutcome } from '@/types/pdf'

import { printPdfToBase64 } from './print-pdf'
import { sharePdf } from './share-pdf'

// Pasta Documentos do aparelho, onde o seletor abre. Desde o Android 11 o seletor não deixa
// escolher a pasta Download nem a raiz da memória; Documentos é a mais parecida que ele aceita.
const ANDROID_DOCUMENTS_URI =
  'content://com.android.externalstorage.documents/document/primary%3ADocuments'

// Código do erro do expo-file-system quando a pessoa fecha o seletor sem escolher a pasta
// (PickerCancelledException no Kotlin vira ERR_PICKER_CANCELLED).
const PICKER_CANCELED_CODE = 'ERR_PICKER_CANCELLED'

function isPickerCanceled(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === PICKER_CANCELED_CODE
}

// Abre o seletor de pastas do Android. null quando a pessoa desiste.
async function pickAndroidFolder(): Promise<Directory | null> {
  try {
    return await Directory.pickDirectoryAsync(ANDROID_DOCUMENTS_URI)
  } catch (error) {
    if (isPickerCanceled(error)) return null

    throw error
  }
}

async function saveOnAndroid(pdf: PdfDocument): Promise<PdfSaveOutcome> {
  // A pasta vem antes do PDF: se a pessoa desistir, nada é gerado à toa.
  const folder = await pickAndroidFolder()

  if (!folder) return 'canceled'

  const base64 = await printPdfToBase64(pdf.html)

  // Com um arquivo de mesmo nome na pasta, o Android cria "nome (1).pdf" em vez de apagar o velho.
  folder.createFile(pdf.fileName, 'application/pdf').write(base64, { encoding: 'base64' })

  return 'saved'
}

/**
 * Guarda o PDF no celular. No Android, a pessoa escolhe a pasta no seletor do sistema e o
 * arquivo é gravado lá. No iPhone não há pasta para gravar direto: abre o menu de compartilhar,
 * que tem "Salvar em Arquivos". Na web (preview), faz o mesmo que `sharePdf`.
 *
 * @returns 'saved', 'canceled' (fechou o seletor) ou 'shared' (abriu o menu de compartilhar)
 * @example
 * const outcome = await savePdfToDevice({ html, fileName: 'REAP-2026-Ana.pdf' }, 'Salvar resumo')
 */
export async function savePdfToDevice(
  pdf: PdfDocument,
  dialogTitle: string,
): Promise<PdfSaveOutcome> {
  if (process.env.EXPO_OS === 'android') return saveOnAndroid(pdf)

  await sharePdf(pdf, dialogTitle)

  return 'shared'
}

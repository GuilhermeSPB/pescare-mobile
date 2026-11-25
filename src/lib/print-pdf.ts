import { printToFileAsync } from 'expo-print'

// A4 em pontos (72 por polegada). Sem isso, o expo-print usa o papel Carta, dos EUA.
const A4_PAGE_SIZE = { width: 595, height: 842 }
// Só o iOS lê esta margem; o Android usa o `@page` do HTML. 45 pt dá uns 16 mm nos dois.
const IOS_PAGE_MARGINS = { top: 45, right: 45, bottom: 45, left: 45 }

/**
 * Transforma o HTML num PDF A4 e devolve o conteúdo em base64, para gravar onde for preciso.
 * O arquivo que o expo-print grava fica em `cacheDir/Print`, fora da pasta que o
 * expo-file-system pode ler no Expo Go ("Missing 'READ' permission"), por isso não é usado.
 * Ele fica para trás no cache, que o sistema limpa sozinho.
 *
 * @example
 * const base64 = await printPdfToBase64('<!DOCTYPE html><html>...</html>')
 */
export async function printPdfToBase64(html: string): Promise<string> {
  const printed = await printToFileAsync({
    html,
    ...A4_PAGE_SIZE,
    margins: IOS_PAGE_MARGINS,
    base64: true,
  })

  if (!printed.base64) {
    throw new Error(`O expo-print não devolveu o PDF em base64 (arquivo: ${printed.uri})`)
  }

  return printed.base64
}

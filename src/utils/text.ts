// Minúsculas e sem acentos, para comparar o que a pessoa digita com nomes oficiais.
export function normalize(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? ''
}

/**
 * Junta parágrafos e quebras de linha num texto corrido. Serve para trechos cortados em poucas
 * linhas (`numberOfLines`), onde uma linha em branco gastaria uma das linhas visíveis.
 *
 * @example
 * toSingleLine('Reunião na sexta.\n\nTraga o celular.') // "Reunião na sexta. Traga o celular."
 */
export function toSingleLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

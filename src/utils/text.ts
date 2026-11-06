// Minúsculas e sem acentos, para comparar o que a pessoa digita com nomes oficiais.
export function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

export function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? ''
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

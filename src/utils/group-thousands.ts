/**
 * Separa os milhares com ponto, no padrão brasileiro. Recebe só a parte inteira, em dígitos.
 * Feito à mão, como `formatBrl`, para não depender do `Intl` do aparelho.
 *
 * @example
 * groupThousands('1250') // "1.250"
 */
export function groupThousands(integerDigits: string): string {
  return integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

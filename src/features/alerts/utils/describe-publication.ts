import { formatDatabaseDate } from '@/utils/iso-date'

/**
 * Data do comunicado como o pescador lê, no cartão e na leitura.
 *
 * @param publicationDate `publication_date` da API ("2026-11-09T00:00:00.000Z").
 * @example
 * describePublication('2026-11-09T00:00:00.000Z') // "Publicado em 09/11/2026"
 */
export function describePublication(publicationDate: string): string {
  return `Publicado em ${formatDatabaseDate(publicationDate)}`
}

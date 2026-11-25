import { escapeHtml } from '@/utils/escape-html'
import { formatDateLabel, formatMonthName } from '@/utils/iso-date'
import { formatSummaryPeriod } from '@/utils/summary-period'

import type { ReapCatalogs, ReapMonthSummary, ReapPdfContent, ReapSummary } from '../types/reap'
import { formatDays } from './format-worked-days'
import {
  describeMonthWithoutFishing,
  describeNoFinishedFishing,
  formatSaleStates,
  formatSoldAnswer,
  formatTargetGroups,
  formatYesNo,
  REAP_SECTIONS,
} from './reap-texts'
import {
  describeReapArea,
  toReapAreaRows,
  toReapCatchRows,
  toSaleStateNames,
  toTargetGroupNames,
} from './to-reap-rows'

type ReapSectionText = { title: string; reapField: string }
type SectionHeading = 'h2' | 'h3'

// Cores fixas de impressão, fora do tema do app: o PDF é papel (preto, cinza e branco), não tela.
// A margem de 16 mm vale no Android; no iOS ela vem das opções do expo-print (@/lib/share-pdf).
const REAP_PDF_STYLES = `
  @page { size: A4; margin: 16mm; }
  body { margin: 0; font-family: Roboto, -apple-system, 'Helvetica Neue', Arial, sans-serif;
    font-size: 12pt; line-height: 1.45; color: #1a1a1a; background: #ffffff; }
  h1 { font-size: 20pt; margin: 0 0 6pt; }
  h2 { font-size: 15pt; margin: 18pt 0 4pt; padding-top: 8pt; border-top: 1px solid #8a8a8a; }
  h3 { font-size: 12.5pt; margin: 12pt 0 2pt; }
  h2, h3 { break-after: avoid; page-break-after: avoid; }
  p { margin: 0 0 3pt; }
  section, .entry { break-inside: avoid; page-break-inside: avoid; }
  .field, .note, footer { color: #4d4d4d; }
  .field { font-size: 10pt; margin-bottom: 4pt; }
  .answer { font-size: 14pt; font-weight: bold; }
  .entry { margin-top: 6pt; }
  .entry-title { font-weight: bold; }
  footer { margin-top: 24pt; padding-top: 8pt; border-top: 1px solid #8a8a8a; font-size: 10pt; }
`

const REAP_PDF_DISCLAIMER = 'Este resumo não é o REAP. Copie os dados no PesqBrasil.'

function paragraph(text: string, className?: string): string {
  const classAttribute = className ? ` class="${className}"` : ''

  return `<p${classAttribute}>${escapeHtml(text)}</p>`
}

// Uma seção do REAP: o título, o nome do campo no PesqBrasil e o conteúdo (já em HTML).
function renderSection(section: ReapSectionText, heading: SectionHeading, bodyHtml: string) {
  const title = `<${heading}>${escapeHtml(section.title)}</${heading}>`

  return `<section>${title}${paragraph(`No REAP: ${section.reapField}`, 'field')}${bodyHtml}</section>`
}

// Um item de lista (um lugar, uma espécie): o nome em negrito e as linhas abaixo.
function renderEntry(title: string, lines: string[]): string {
  const linesHtml = lines.map((line) => paragraph(line)).join('')

  return `<div class="entry">${paragraph(title, 'entry-title')}${linesHtml}</div>`
}

function renderAreas(summary: ReapSummary, catalogs: ReapCatalogs): string {
  return toReapAreaRows(summary.areas, catalogs)
    .map((row) => renderEntry(row.placeName, describeReapArea(row)))
    .join('')
}

function renderCatches(summary: ReapSummary): string {
  return toReapCatchRows(summary.catches)
    .map((row) => renderEntry(row.speciesName, [row.quantityLabel, row.priceLabel]))
    .join('')
}

function renderSale(summary: ReapSummary, catalogs: ReapCatalogs): string {
  const soldHtml = paragraph(formatSoldAnswer(summary.hasSold))

  if (!summary.hasSold) return soldHtml

  const stateNames = toSaleStateNames(summary.saleMunicipalityCodes, catalogs)

  return soldHtml + paragraph(formatSaleStates(stateNames))
}

// As cinco seções de um período com pesca, na ordem dos cartões da tela e do PesqBrasil.
function renderFishedDetails(
  summary: ReapSummary,
  catalogs: ReapCatalogs,
  heading: SectionHeading,
): string {
  const targetGroups = formatTargetGroups(toTargetGroupNames(summary.speciesIds, catalogs))

  return [
    renderSection(REAP_SECTIONS.workedDays, heading, paragraph(formatDays(summary.workedDays))),
    renderSection(REAP_SECTIONS.areas, heading, renderAreas(summary, catalogs)),
    renderSection(REAP_SECTIONS.catches, heading, renderCatches(summary)),
    renderSection(REAP_SECTIONS.targetGroups, heading, paragraph(targetGroups)),
    renderSection(REAP_SECTIONS.sale, heading, renderSale(summary, catalogs)),
  ].join('')
}

// Um mês do ano: o nome do mês e, se pescou, as cinco seções; se não, a frase da tela.
function renderMonth({ month, summary }: ReapMonthSummary, catalogs: ReapCatalogs): string {
  const title = `<h2>${escapeHtml(formatMonthName(month - 1))}</h2>`

  if (!summary.hasFished) {
    return `<section>${title}${paragraph(describeMonthWithoutFishing(summary), 'note')}</section>`
  }

  return title + renderFishedDetails(summary, catalogs, 'h3')
}

function renderHeader(content: ReapPdfContent): string {
  const lines = [
    `Nome: ${content.fisherName}`,
    `Cidade: ${content.cityLabel}`,
    `Período: ${formatSummaryPeriod(content.period)}`,
    `Feito no app Pescare em ${formatDateLabel(content.generatedOn)}`,
  ]

  return `<header><h1>Resumo para o REAP</h1>${lines.map((line) => paragraph(line)).join('')}</header>`
}

// "Pescou neste período?" e, se pescou, o mês (cinco seções) ou o ano (mês a mês).
function renderActivity(content: ReapPdfContent): string {
  const { summary, period, catalogs } = content
  const fishedHtml = renderSection(
    REAP_SECTIONS.fished,
    'h2',
    paragraph(formatYesNo(summary.hasFished), 'answer'),
  )

  if (!summary.hasFished)
    return fishedHtml + paragraph(describeNoFinishedFishing(period.kind), 'note')
  if (period.kind === 'MONTH') return fishedHtml + renderFishedDetails(summary, catalogs, 'h2')

  return fishedHtml + content.monthSummaries.map((item) => renderMonth(item, catalogs)).join('')
}

/**
 * Monta a página HTML do PDF do REAP, com o mesmo conteúdo e a mesma ordem da tela. Todo texto
 * passa por `escapeHtml`, porque nomes de pessoa e de lugar são digitados por gente.
 *
 * @example
 * const html = buildReapHtml({ fisherName: 'Ana', cityLabel: 'Belmonte (Bahia)', ... })
 */
export function buildReapHtml(content: ReapPdfContent): string {
  const title = `Resumo para o REAP - ${formatSummaryPeriod(content.period)}`

  return [
    '<!DOCTYPE html>',
    '<html lang="pt-BR"><head><meta charset="utf-8">',
    `<title>${escapeHtml(title)}</title>`,
    `<style>${REAP_PDF_STYLES}</style></head><body>`,
    renderHeader(content),
    renderActivity(content),
    `<footer>${paragraph(REAP_PDF_DISCLAIMER)}</footer>`,
    '</body></html>',
  ].join('')
}

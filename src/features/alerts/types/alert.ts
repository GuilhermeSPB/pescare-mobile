import type { Municipality } from '@/types/municipality'

// Tabela `alert`: um comunicado da aba "Comunicados". Mesmo contrato do painel web
// (pescare-frontend/src/features/alerts/types/alert.ts). O pescador só recebe os publicados
// que valem para todos (GLOBAL) ou que cobrem a cidade dele (MUNICIPAL).
export type AlertScope = 'GLOBAL' | 'MUNICIPAL'
export type AlertStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

type AlertFields = {
  id: number
  title: string
  description: string
  // Coluna DATE, que a API serializa como meia-noite UTC: mostre com `formatDatabaseDate`.
  publication_date: string
  scope: AlertScope
  status: AlertStatus
}

// GET /alerts traz só a contagem: um comunicado pode cobrir milhares de municípios.
export type AlertListItem = AlertFields & {
  municipality_count: number
}

// GET /alerts/:id traz a lista de municípios cobertos.
export type AlertDetails = AlertFields & {
  municipalities: Municipality[]
}

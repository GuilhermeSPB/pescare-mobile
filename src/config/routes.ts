import type { Href } from 'expo-router'

// Início do fluxo de registro de pesca. O cast é preciso: as rotas tipadas geradas hoje não
// listam "/fishing-records/new" como href (a rota de índice aparece como ".../index").
export const NEW_RECORD_HREF = '/fishing-records/new' as Href

// Tela de leitura de uma pesca. Mesmo cast: a rota dinâmica ainda não entra nos tipos de rota.
export const fishingRecordHref = (recordId: number) => `/fishing-records/${recordId}` as Href

// Aba Histórico, que fica no menu lateral (o grupo (drawer) não aparece na URL).
export const HISTORY_HREF = '/history' as Href

// Resumo das pescas para preencher o REAP, também no menu lateral.
export const REAP_HREF = '/reap' as Href

// Minha produção: os indicadores do que foi pescado e vendido, também no menu lateral.
export const PRODUCTION_HREF = '/production' as Href

// Lista de defesos da cidade e o detalhe de um deles (mesmo cast das rotas dinâmicas acima).
export const FISHING_BANS_HREF = '/fishing-bans' as Href
// A cidade vai na URL quando o defeso é de outra cidade que não a do cadastro.
export const fishingBanHref = (banId: number, cityCode?: string) =>
  `/fishing-bans/${banId}${cityCode ? `?city=${cityCode}` : ''}` as Href

// Leitura de um comunicado (mesmo cast das rotas dinâmicas acima). A lista só abre pelo menu.
export const alertHref = (alertId: number) => `/alerts/${alertId}` as Href

// Telas de mudar os dados da conta, abertas pelo Perfil. Mesmo cast: as rotas tipadas só
// passam a listá-las depois que o servidor de desenvolvimento gera os tipos de novo.
export const EDIT_NAME_HREF = '/account/name' as Href
export const EDIT_CITY_HREF = '/account/city' as Href
export const CHANGE_PASSWORD_HREF = '/account/password' as Href

import styled from 'styled-components/native'

// Textos das telas de leitura de pesca (revisão e detalhe): mesmo espaçamento e mesmo tipo.
export const RecordBlock = styled.View`
  gap: ${({ theme }) => theme.space.lg}px;
`

// Um dado da pesca, como "Dia: 02/11/2026".
export const RecordLine = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurface};
`

// Frase de apoio, menor e mais suave: venda, compradores, avisos.
export const RecordNote = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

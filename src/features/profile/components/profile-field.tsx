import type { ReactNode } from 'react'
import styled from 'styled-components/native'

type ProfileFieldProps = {
  label: string
  value: string
  // Botão ao lado do valor (ex.: "Mudar nome"). Com letra grande, ele desce para baixo do valor.
  action?: ReactNode
}

const FieldRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  column-gap: ${({ theme }) => theme.space.md}px;
  row-gap: ${({ theme }) => theme.space.xs}px;
`

const FieldText = styled.View`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 120px;
  gap: ${({ theme }) => theme.space.xs}px;
`

const FieldLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`

const FieldValue = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
  line-height: ${({ theme }) => theme.typography.bodyLarge.lineHeight}px;
  color: ${({ theme }) => theme.colors.onSurface};
`

// Um dado da conta como o pescador lê: o nome do campo em cima e o valor embaixo.
export function ProfileField({ label, value, action }: ProfileFieldProps) {
  return (
    <FieldRow>
      <FieldText>
        <FieldLabel>{label}</FieldLabel>
        <FieldValue>{value}</FieldValue>
      </FieldText>
      {action}
    </FieldRow>
  )
}

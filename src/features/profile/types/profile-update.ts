// Corpo do PATCH /users/me. A API exige ao menos um dos dois campos; o e-mail não pode mudar.
export type UpdateMeInput = {
  name?: string
  fk_municipality_ibge_code?: string
}

// Corpo do PATCH /users/me/password. A nova senha precisa ser diferente da de hoje.
export type ChangePasswordInput = {
  current_password: string
  new_password: string
}

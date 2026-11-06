export type UserRole = 'FISHER' | 'ADMIN'

// Usuário como a API devolve (sem a senha).
export type User = {
  id: number
  name: string
  email: string
  role: UserRole
  is_active: boolean
  registration_date: string
  fk_municipality_ibge_code: string
}

export type Session = {
  token: string
  user: User
}

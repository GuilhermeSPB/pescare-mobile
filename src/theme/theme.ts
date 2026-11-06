import { ThemeProvider } from 'styled-components/native'

// Papéis de cor do Material 3 com a paleta do painel admin (pescare-frontend/DESIGN.md).
const colors = {
  primary: '#2563EB',
  primaryPressed: '#1D4ED8',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EFF6FF',
  onPrimaryContainer: '#1E40AF',
  primaryTrack: '#BFDBFE',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  onSurface: '#111827',
  onSurfaceVariant: '#4B5563',
  outline: '#6B7280',
  outlineVariant: '#E5E7EB',
  error: '#B91C1C',
  errorContainer: '#FEF2F2',
  // Texto sobre errorContainer: o cartão de defeso em vigor precisa de contraste AA.
  onErrorContainer: '#7F1D1D',
  success: '#15803D',
  // Estados desabilitados do M3: onSurface a 12% (fundo) e 38% (conteúdo).
  disabledContainer: 'rgba(17, 24, 39, 0.12)',
  disabledContent: 'rgba(17, 24, 39, 0.38)',
}

// Escala de tipo do M3, sem nada abaixo de 16: o público lê pouco e muitas vezes tem mais idade.
const typography = {
  display: { fontSize: 52, lineHeight: 60, fontWeight: '700', letterSpacing: -0.5 },
  headline: { fontSize: 28, lineHeight: 36, fontWeight: '500', letterSpacing: 0 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '500', letterSpacing: 0 },
  bodyLarge: { fontSize: 18, lineHeight: 26, fontWeight: '400', letterSpacing: 0 },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400', letterSpacing: 0.15 },
  label: { fontSize: 18, lineHeight: 24, fontWeight: '500', letterSpacing: 0.1 },
  // Frase da tela de abertura, sobre o azul.
  tagline: { fontSize: 20, lineHeight: 28, fontWeight: '400', letterSpacing: 0 },
  // Rótulo que fica no alto da borda do campo.
  fieldLabel: { fontSize: 16, lineHeight: 20, fontWeight: '500', letterSpacing: 0 },
} as const

// Grade de 4dp.
const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
}

const radius = {
  field: 4,
  card: 12,
  full: 999,
}

// Alvos de toque maiores que o mínimo de 48dp do Material.
const size = {
  control: 56,
  iconButton: 48,
  appBar: 64,
}

export const theme = {
  colors,
  typography,
  space,
  radius,
  size,
}

export type AppTheme = typeof theme

export { ThemeProvider }

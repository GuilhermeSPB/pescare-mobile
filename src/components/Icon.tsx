import type { ColorValue } from 'react-native'
import { SymbolView, type SymbolViewProps } from 'expo-symbols'

// Material Symbols no Android e na web; no iPhone, o SF Symbol de mesmo desenho.
const ICONS = {
  back: { ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  error: { ios: 'exclamationmark.circle.fill', android: 'error', web: 'error' },
  success: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  visibility: { ios: 'eye', android: 'visibility', web: 'visibility' },
  visibilityOff: { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' },
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  add: { ios: 'plus', android: 'add', web: 'add' },
  remove: { ios: 'minus.circle', android: 'remove_circle_outline', web: 'remove_circle_outline' },
  calendar: { ios: 'calendar', android: 'calendar_today', web: 'calendar_today' },
  chevronDown: { ios: 'chevron.down', android: 'expand_more', web: 'expand_more' },
  chevronUp: { ios: 'chevron.up', android: 'expand_less', web: 'expand_less' },
  chevronLeft: { ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  person: { ios: 'person.fill', android: 'person', web: 'person' },
  // Abre o menu lateral; o texto "Menu" fica ao lado no TopAppBar.
  menu: { ios: 'line.3.horizontal', android: 'menu', web: 'menu' },
  history: { ios: 'clock.arrow.circlepath', android: 'history', web: 'history' },
  // Item Defesos do menu: o sinal de proibição diz o que é a tela.
  fishingBan: { ios: 'nosign', android: 'block', web: 'block' },
  // Item REAP do menu: uma folha de relatório.
  report: { ios: 'doc.text', android: 'description', web: 'description' },
  // Item Minha produção do menu: um gráfico de barras.
  chart: { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' },
  // Item Comunicados do menu: o megafone de aviso.
  alerts: { ios: 'megaphone', android: 'campaign', web: 'campaign' },
} satisfies Record<string, SymbolViewProps['name']>

export type IconName = keyof typeof ICONS

type IconProps = {
  name: IconName
  // ColorValue: a cor que o React Navigation passa às abas não é só string.
  color: ColorValue
  size?: number
}

export function Icon({ name, color, size = 24 }: IconProps) {
  return (
    <SymbolView
      name={ICONS[name]}
      tintColor={color}
      size={size}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  )
}

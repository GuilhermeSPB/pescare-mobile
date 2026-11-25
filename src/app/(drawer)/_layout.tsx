import { router } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import { useTheme } from 'styled-components/native'

import { Icon } from '@/components/Icon'
import { MenuDrawerContent } from '@/components/menu-drawer-content'
import { NEW_RECORD_HREF } from '@/config/routes'

// Menu lateral da área logada. "Registrar pesca" fica no botão do rodapé, e não numa tela.
// O botão fecha o menu antes de abrir o fluxo; sem isso ele reaparece aberto ao voltar.
export default function DrawerLayout() {
  const { colors, typography } = useTheme()

  return (
    <Drawer
      drawerContent={(props) => (
        <MenuDrawerContent
          {...props}
          footerAction={{
            label: 'Registrar pesca',
            onPress: () => {
              props.navigation.closeDrawer()
              router.push(NEW_RECORD_HREF)
            },
          }}
        />
      )}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.onSurfaceVariant,
        drawerActiveBackgroundColor: colors.primaryContainer,
        drawerLabelStyle: {
          fontSize: typography.label.fontSize,
          fontWeight: typography.label.fontWeight,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Início',
          title: 'Início',
          drawerIcon: ({ color }) => <Icon name="home" color={color} />,
        }}
      />
      <Drawer.Screen
        name="history"
        options={{
          drawerLabel: 'Histórico',
          title: 'Histórico',
          drawerIcon: ({ color }) => <Icon name="history" color={color} />,
        }}
      />
      <Drawer.Screen
        name="production"
        options={{
          drawerLabel: 'Minha produção',
          title: 'Minha produção',
          drawerIcon: ({ color }) => <Icon name="chart" color={color} />,
        }}
      />
      <Drawer.Screen
        name="reap"
        options={{
          drawerLabel: 'REAP',
          title: 'REAP',
          drawerIcon: ({ color }) => <Icon name="report" color={color} />,
        }}
      />
      <Drawer.Screen
        name="fishing-bans"
        options={{
          drawerLabel: 'Defesos',
          title: 'Defesos',
          drawerIcon: ({ color }) => <Icon name="fishingBan" color={color} />,
        }}
      />
      <Drawer.Screen
        name="alerts"
        options={{
          drawerLabel: 'Comunicados',
          title: 'Comunicados',
          drawerIcon: ({ color }) => <Icon name="alerts" color={color} />,
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Perfil',
          title: 'Perfil',
          drawerIcon: ({ color }) => <Icon name="person" color={color} />,
        }}
      />
    </Drawer>
  )
}

import { useState } from 'react'

import { IconButton } from './IconButton'
import { TextField, type TextFieldProps } from './TextField'

type PasswordFieldProps = Omit<TextFieldProps, 'secureTextEntry' | 'trailing'>

// Campo de senha com o botão de mostrar e esconder: o pescador confere o que digitou antes
// de enviar. Usado no login, no cadastro e na troca de senha.
export function PasswordField(props: PasswordFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <TextField
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
      secureTextEntry={!isPasswordVisible}
      trailing={
        <IconButton
          icon={isPasswordVisible ? 'visibilityOff' : 'visibility'}
          accessibilityLabel={isPasswordVisible ? 'Esconder senha' : 'Mostrar senha'}
          onPress={() => setIsPasswordVisible((current) => !current)}
        />
      }
    />
  )
}

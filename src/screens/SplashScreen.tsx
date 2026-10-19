import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import styled from "styled-components/native";

import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 32px;
  font-weight: bold;
`;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace("Home");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <Container>
      <Title>Pescare</Title>
    </Container>
  );
}

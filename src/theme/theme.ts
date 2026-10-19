import styled, { ThemeProvider } from 'styled-components/native';

export const theme = {
  colors: {
    primary: '#2E7D32',
    background: '#FFFFFF',
    text: '#212121',
  },
};

export { ThemeProvider };

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 24px;
  font-weight: bold;
`;
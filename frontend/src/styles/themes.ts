// themes.js
// tokens de cor inspirados em psicologia das cores (confiança e ação)
export const light = {
  mode: 'light',
  colors: {
    primary:  '#5C6BC0',   // confiança
    primary700:'#3949ab',
    secondary:'#FFB300',   // ação (alaranjado)
    bg:       '#F7F9FC',
    surface:  '#FFFFFF',
    text:     '#1A1A1A',
    textMuted:'#4A4A4A'
  },
  radius: '12px',
  shadow: '0 4px 16px rgba(0,0,0,.08)'
};

export const dark = {
  ...light,
  mode: 'dark',
  colors: {
    ...light.colors,
    bg:'#121212',
    surface:'#1E1E1E',
    text:'#E0E0E0',
    textMuted:'#9A9A9A'
  },
  shadow: '0 4px 16px rgba(0,0,0,.4)'
};

// src/styles/themes.js

export const theme = {
  primary: '#1e88e5',      // azul ideal para confiança, tecnologia, ação
  primaryLight: '#71b5f9',
  primaryDark: '#135ba1',
  secondary: '#ffb300',    // amarelo para energia, alegria
  background: '#f7f9fb',   // cinza puro com leve azul (moderno)
  surface: '#fff',
  error: '#e53935',        // vermelho limpo para alerta
  success: '#43a047',      // verde bem otimista
  text: '#212121',         // quase preto para máxima leitura
  muted: '#707070',
  border: '#e0e0e0'
};


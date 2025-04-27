import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      blue: '#2B6CB0',
      lightBlue: '#4299E1',
      gray: '#4A5568',
      lightGray: '#A0AEC0',
      background: '#FFFFFF',
      error: '#E53E3E',
      success: '#38A169',
      warning: '#DD6B20'
    }
  },
  fonts: {
    heading: 'Roboto, system-ui, sans-serif',
    body: 'Roboto, system-ui, sans-serif'
  },
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem' // 30px
  },
  space: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem'        // 32px
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 500,
        borderRadius: 'md'
      },
      variants: {
        solid: {
          bg: 'brand.blue',
          color: 'white',
          _hover: {
            bg: 'brand.lightBlue'
          }
        },
        ghost: {
          color: 'brand.blue',
          _hover: {
            bg: 'brand.lightBlue',
            color: 'white'
          }
        }
      }
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'md',
          _focus: {
            borderColor: 'brand.blue',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-blue)'
          }
        }
      }
    },
    FormLabel: {
      baseStyle: {
        fontSize: 'sm',
        fontWeight: 500,
        color: 'brand.gray'
      }
    },
    IconButton: {
      baseStyle: {
        borderRadius: 'md'
      }
    }
  },
  styles: {
    global: {
      body: {
        bg: 'brand.background',
        color: 'brand.gray'
      }
    }
  }
});

export default theme; 
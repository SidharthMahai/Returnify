import { extendTheme, theme as baseTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: '"Space Grotesk", sans-serif',
    body: '"Manrope", sans-serif',
  },
  colors: {
    brand: {
      50: '#eef8ff',
      100: '#d7edff',
      200: '#aedcff',
      300: '#7ac6ff',
      400: '#44adff',
      500: '#1891ff',
      600: '#0c73db',
      700: '#0d5aae',
      800: '#104c8f',
      900: '#133f74',
    },
    ink: {
      900: '#0f172a',
      800: '#162033',
      700: '#334155',
      600: '#475569',
      500: '#64748b',
      400: '#94a3b8',
      300: '#cbd5e1',
    },
    surface: {
      50: '#f8fbff',
      100: '#eef4ff',
      200: '#d9e5ff',
      900: '#08111f',
      850: '#0f1b2d',
      800: '#132238',
    },
  },
  radii: {
    ...baseTheme.radii,
    '2xl': '1.5rem',
    '3xl': '2rem',
  },
  shadows: {
    ...baseTheme.shadows,
    outline: '0 0 0 3px rgba(24, 145, 255, 0.2)',
    soft: '0 24px 80px rgba(15, 23, 42, 0.14)',
    glass: '0 18px 50px rgba(15, 23, 42, 0.12)',
    glassDark: '0 20px 60px rgba(2, 6, 23, 0.55)',
  },
  styles: {
    global: (props) => ({
      'html, body, #root': {
        minHeight: '100%',
      },
      body: {
        bg: mode('transparent', 'transparent')(props),
        color: mode('ink.900', 'whiteAlpha.900')(props),
      },
      '*::placeholder': {
        color: mode('ink.500', 'whiteAlpha.500')(props),
      },
      '*, *::before, *::after': {
        borderColor: mode('surface.200', 'whiteAlpha.200')(props),
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight: '700',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.400',
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: 'brand.400',
      },
    },
    Slider: {
      baseStyle: {
        filledTrack: {
          bg: 'brand.500',
        },
        thumb: {
          bg: 'white',
          borderWidth: '4px',
          borderColor: 'brand.400',
        },
      },
    },
  },
});

export default theme;

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Nunito", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          backgroundColor: '#4880FF',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          padding: '10px 20px',
          '&:hover': {
            backgroundColor: '#3a6ad9',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#F5F5F5',
            '& fieldset': {
              borderColor: '#E0E0E0',
            },
            '&:hover fieldset': {
              borderColor: '#4880FF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4880FF',
            },
          },
          '& .MuiInputBase-input': {
            color: '#333333 !important',
          },
          '& .MuiInputLabel-root': {
            color: '#666666',
            position: 'relative',
            transform: 'none',
            marginBottom: '8px',
            '&.Mui-focused': {
              color: '#4880FF',
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            display: 'none',
          },
          '& .MuiFormHelperText-root': {
            color: '#666666',
            marginLeft: '8px',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backgroundColor: '#F5F5F5',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E0E0E0',
            display: 'none',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4880FF',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4880FF',
          },
          '& .MuiSelect-select': {
            color: '#333333 !important',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backgroundColor: '#F5F5F5',
          '& fieldset': {
            borderColor: '#E0E0E0',
            display: 'none',
          },
          '&:hover fieldset': {
            borderColor: '#4880FF',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#4880FF',
          },
        },
        input: {
          color: '#333333 !important',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#666666',
          position: 'relative',
          transform: 'none',
          marginBottom: '8px',
          '&.Mui-focused': {
            color: '#4880FF',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#666666',
          marginLeft: '8px',
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#666666',
          '&.Mui-checked': {
            color: '#4880FF',
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 20,
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: '#666666',
          fontSize: '14px',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#1b2431',
      paper: '#273142',
    },
    text: {
      primary: '#fff',
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: '"Nunito", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          backgroundColor: '#4880FF',
          borderRadius: '8px',
          color: '#fff',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          padding: '10px 20px',
          '&:hover': {
            backgroundColor: '#3a6ad9',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#1b2431',
            '& fieldset': {
              borderColor: '#404040',
            },
            '&:hover fieldset': {
              borderColor: '#4880FF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4880FF',
            },
          },
          '& .MuiInputBase-input': {
            color: '#E0E0E0 !important',
          },
          '& .MuiInputLabel-root': {
            color: '#B0B0B0',
            position: 'relative',
            transform: 'none',
            marginBottom: '8px',
            '&.Mui-focused': {
              color: '#4880FF',
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            display: 'none',
          },
          '& .MuiFormHelperText-root': {
            color: '#B0B0B0',
            marginLeft: '8px',
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backgroundColor: '#1b2431',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E0E0E0',
            display: 'none',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4880FF',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4880FF',
          },
          '& .MuiSelect-select': {
            color: '#E0E0E0 !important',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backgroundColor: '#1b2431',
          '& fieldset': {
            borderColor: '#E0E0E0',
            display: 'none',
          },
          '&:hover fieldset': {
            borderColor: '#4880FF',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#4880FF',
          },
        },
        input: {
          color: '#333333 !important',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#E0E0E0',
          position: 'relative',
          transform: 'none',
          marginBottom: '8px',
          '&.Mui-focused': {
            color: '#4880FF',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#E0E0E0',
          marginLeft: '8px',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#B0B0B0',
          '&.Mui-checked': {
            color: '#4880FF',
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 20,
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: '#B0B0B0',
          fontSize: '14px',
        },
      },
    },
  },
});

export { theme, darkTheme };

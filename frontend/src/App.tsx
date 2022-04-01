import { AppRouter } from './components/routes/AppRouter'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { AppContextProvider } from './components/providers/AppContextProvider'
import { QueryClient, QueryClientProvider } from 'react-query'

import './styles/styles.scss'

const theme = extendTheme({
    fonts: {
        body: "'Noto Serif', 'Times New Roman', Times, serif",
        heading: "'Oswald', 'Times New Roman', Times, serif",
    },

    components: {
        Button: {
            baseStyle: {
                fontFamily: "'Work Sans', 'Helvetica', sans-serif",
            },
            sizes: {
                xl: {
                    h: '30px',
                    fontSize: '1.3rem',
                    lineHeight: 1.1,
                    px: '12px',
                },
            },
        },
    },
})

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <AppContextProvider>
                    <AppRouter />
                </AppContextProvider>
            </ChakraProvider>
        </QueryClientProvider>
    )
}

export default App

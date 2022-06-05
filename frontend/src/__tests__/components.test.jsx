import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { AppContextProvider } from '../components/providers/AppContextProvider'
import { HomePage } from '../components/pages/HomePage'
import { MemoryRouter } from 'react-router-dom'

test('loads and displays home page', async () => {
    render(
        <AppContextProvider>
            <HomePage />
        </AppContextProvider>,
        { wrapper: MemoryRouter }
    )

    expect(screen.getByText('Witness the greatest taste')).toBeInTheDocument()
})

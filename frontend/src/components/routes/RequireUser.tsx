import { Outlet } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import useAppState from '../providers/AppContextProvider'

export const RequireUser = () => {
    const appState = useAppState()

    if (!appState.user) {
        return <LoginPage />
    }

    return <Outlet />
}

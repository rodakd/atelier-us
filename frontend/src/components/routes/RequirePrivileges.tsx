import { Outlet } from 'react-router-dom'
import useAppState from '../providers/AppContextProvider'
import { LoginPage } from '../pages/LoginPage'
import { isAdminOrMod } from '../../common/auth'

export const RequirePrivileges = () => {
    const appState = useAppState()

    if (!isAdminOrMod(appState.user)) {
        return <LoginPage requiredAdmin />
    }

    return <Outlet />
}

import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import Storage, { STORAGE_KEYS } from '../../common/Storage'
import { User } from '../../types'

interface IAppContext {
    user?: User
    logout: () => void
    login: (user: User) => void
}

const AppContext = createContext<IAppContext>({
    logout: () => {},
    login: () => {},
})

interface AppContextProviderProps {
    children: JSX.Element
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const [user, setUser] = useState<User>()

    useEffect(() => {
        const user = Storage.get(STORAGE_KEYS.USER)
        setUser(user)
    }, [])

    const logout = () => {
        setUser(undefined)
        Storage.delete(STORAGE_KEYS.USER)
    }

    const login = (user: User) => {
        setUser(user)
        Storage.set(STORAGE_KEYS.USER, user)
    }

    const memoizedContext = useMemo(
        () => ({
            user,
            login,
            logout,
        }),
        [user, login, logout]
    )

    return (
        <AppContext.Provider value={memoizedContext}>
            {children}
        </AppContext.Provider>
    )
}

export default function useAppState() {
    return useContext(AppContext)
}

import cn from 'classnames'
import useAppState from '../providers/AppContextProvider'

import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { AuthModal } from '../modals/AuthModal'
import { LogoutModal } from '../modals/LogoutModal'
import { NavItem } from './NavItem'
import { isAdminOrMod } from '../../common/auth'

interface NavLayoutProps {
    transparent?: boolean
}

export const NavLayout = (props: NavLayoutProps) => {
    const [authModal, setAuthModal] = useState(false)
    const [logoutModal, setLogoutModal] = useState(false)

    const appState = useAppState()

    let rightBtn = (
        <button className="nav-item" onClick={() => setAuthModal(true)}>
            Log in
        </button>
    )

    if (appState.user) {
        rightBtn = (
            <button className="nav-item" onClick={() => setLogoutModal(true)}>
                {appState.user.firstName} {appState.user.lastName}
            </button>
        )
    }

    return (
        <div className="nav-layout">
            <nav
                className={cn('navbar', {
                    'navbar--transparent': props.transparent,
                })}
            >
                <Link className="navbar__title" to="/">
                    Atelier UŚ
                </Link>
                {isAdminOrMod(appState.user) && (
                    <NavItem text="admin panel" to="/dashboard" />
                )}
                {appState.user && <NavItem text="reserve" to="/reserve" />}
                {appState.user && (
                    <NavItem text="my reservations" to="/my-reservations" />
                )}
                <NavItem text="contact" to="/contact" />
                {rightBtn}
            </nav>
            <Outlet />
            <AuthModal isOpen={authModal} onClose={() => setAuthModal(false)} />
            <LogoutModal
                isOpen={logoutModal}
                onClose={() => {
                    setLogoutModal(false)
                }}
            />
        </div>
    )
}

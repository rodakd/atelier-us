import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { NavLayout } from '../navigation/NavLayout'
import { SuccessPage } from '../pages/SuccessPage'
import { DashboardPage } from '../pages/DashboardPage'
import { RequirePrivileges } from './RequirePrivileges'
import { RequireUser } from './RequireUser'
import { MyReservationsPage } from '../pages/MyReservationsPage'
import { ReservePage } from '../pages/ReservePage'
import { ReservationsPage } from '../pages/dashboard/ReservationsPage'
import { TablesPage } from '../pages/dashboard/TablesPage'
import { ContactPage } from '../pages/ContactPage'

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<NavLayout />}>
                    <Route path="success" element={<SuccessPage />} />
                    <Route path="dashboard" element={<RequirePrivileges />}>
                        <Route index element={<DashboardPage />} />
                        <Route
                            path="reservations"
                            element={<ReservationsPage />}
                        />
                        <Route path="tables" element={<TablesPage />} />
                    </Route>
                    <Route path="my-reservations" element={<RequireUser />}>
                        <Route index element={<MyReservationsPage />} />
                    </Route>
                    <Route path="reserve" element={<RequireUser />}>
                        <Route index element={<ReservePage />} />
                    </Route>
                    <Route path="contact" element={<ContactPage />} />
                </Route>
                <Route path="/" element={<NavLayout transparent />}>
                    <Route index element={<HomePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

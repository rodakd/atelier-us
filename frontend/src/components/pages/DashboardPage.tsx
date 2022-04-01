import { Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export const DashboardPage = () => {
    return (
        <main className="dashboard-page">
            <Link to="/dashboard/reservations">
                <Button size="lg">Reservations</Button>
            </Link>
            <Link to="/dashboard/tables">
                <Button size="lg">Tables</Button>
            </Link>
        </main>
    )
}

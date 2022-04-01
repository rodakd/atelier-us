import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { getReservations } from '../../../api/routes/reservations'
import { getReservationStatus } from '../../../common/reservations'
import { APILoader } from '../../common/APILoader'

export const ReservationsPage = () => {
    const query = useQuery('reservations', getReservations, {
        refetchOnWindowFocus: false,
        retry: false,
    })

    return (
        <div className="reservations-page">
            <APILoader
                query={query}
                onSuccess={(data) => (
                    <Table>
                        <Thead>
                            <Th>Id</Th>
                            <Th>Date</Th>
                            <Th>People count</Th>
                            <Th>Table Id</Th>
                            <Th>Status</Th>
                        </Thead>
                        <Tbody>
                            {data.reservations.map((r) => {
                                const status = getReservationStatus(r)

                                return (
                                    <Tr>
                                        <Td>{r.id}</Td>
                                        <Td>
                                            {new Date(
                                                r.forDate
                                            ).toLocaleString()}
                                        </Td>
                                        <Td>{r.peopleCount}</Td>
                                        <Td>{r.tableId}</Td>
                                        <Td
                                            className={`status status--${status}`}
                                        >
                                            {status}
                                        </Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                )}
            />
        </div>
    )
}

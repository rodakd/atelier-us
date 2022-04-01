import { Spinner } from '@chakra-ui/react'
import { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { ApiError, extractError } from '../../api/errors'
import {
    cancelReservation,
    getMyReservations,
} from '../../api/routes/reservations'
import { getReservationStatus } from '../../common/reservations'
import { Reservation } from '../../types'
import { APILoader } from '../common/APILoader'
import { ConfirmationModal } from '../modals/ConfirmationModal'

export const MyReservationsPage = () => {
    const [reservationToCancel, setReservationToCancel] =
        useState<Reservation | null>(null)

    const queryClient = useQueryClient()
    const query = useQuery('my-reservations', getMyReservations, {
        refetchOnWindowFocus: false,
        retry: false,
    })

    const renderStatus = (reservation: Reservation) => {
        const status = getReservationStatus(reservation)

        switch (status) {
            case 'cancelled':
                return (
                    <span className="status status--cancelled">cancelled</span>
                )
            case 'expired':
                return <span className="status status--expired">expired</span>
            case 'open':
                return (
                    <span className="status status--open">
                        open
                        <button
                            onClick={() => setReservationToCancel(reservation)}
                        >
                            Cancel?
                        </button>
                    </span>
                )
        }
    }

    const handleCancelReservation = async () => {
        if (reservationToCancel) {
            await cancelReservation(reservationToCancel.id)
            setReservationToCancel(null)
            queryClient.invalidateQueries('my-reservations')
        }
    }

    return (
        <div className="my-reservations">
            <APILoader
                query={query}
                onSuccess={(data) => {
                    if (data.length) {
                        return (
                            <ul>
                                {data.map((r) => (
                                    <li key={r.id}>
                                        <div>
                                            <h3>
                                                {new Date(
                                                    r.forDate
                                                ).toLocaleString()}
                                            </h3>
                                            <h4>
                                                {r.peopleCount > 1
                                                    ? `${r.peopleCount} people`
                                                    : `${r.peopleCount} person`}
                                            </h4>
                                        </div>
                                        {renderStatus(r)}
                                    </li>
                                ))}
                            </ul>
                        )
                    }

                    return <span>No reservations</span>
                }}
            />
            {reservationToCancel && (
                <ConfirmationModal
                    title="Cancel reservation"
                    description={`Do you really want to cancel the reservation for ${new Date(
                        reservationToCancel.forDate
                    ).toLocaleString()}?`}
                    isOpen
                    onCancel={() => setReservationToCancel(null)}
                    onSubmit={handleCancelReservation}
                    buttonText="Cancel"
                    buttonColorScheme="red"
                />
            )}
        </div>
    )
}

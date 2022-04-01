import { Reservation } from '../types'

export const getReservationStatus = (r: Reservation) => {
    if (new Date(r.forDate) < new Date()) {
        return 'expired'
    }

    if (r.cancelled) {
        return 'cancelled'
    }

    return 'open'
}

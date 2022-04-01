import { getReservationStatus } from '../../common/reservations'
import Api from '../Api'
import {
    AvailableHoursResponse,
    GetAvailableHoursData,
    PostReservationData,
    ReservationResponse,
    ReservationsResponse,
} from '../types'

export const getReservations = async () => {
    const resp = await Api.get<ReservationsResponse>('/reservations')
    resp.data.reservations.forEach((r) => {})
    return resp.data
}

export const getMyReservations = async () => {
    const resp = await Api.get<ReservationsResponse>('/my-reservations')
    const { reservations } = resp.data

    for (let i = 0; i < reservations.length; i++) {
        const r = reservations[i]
        const status = getReservationStatus(r)

        if (status === 'open') {
            reservations.splice(i, 1)
            reservations.unshift(r)
        }
    }

    return reservations
}

export const postReservation = async (data: PostReservationData) => {
    const resp = await Api.post<ReservationResponse>('/reservations', data)
    return resp.data
}

export const getAvailableHours = async (data: GetAvailableHoursData) => {
    const resp = await Api.post<AvailableHoursResponse>(
        '/available-hours',
        data
    )
    return resp.data
}

export const cancelReservation = async (id: number) => {
    await Api.post('/reservations/cancel', { id })
}

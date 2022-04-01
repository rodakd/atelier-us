import { Reservation, Table, User } from '../types'

export interface PostUserData {
    first_name: string
    last_name: string
    email: string
    phone: string
    password: string
}

export interface LoginData {
    email: string
    password: string
}

export interface UserResponse {
    user: User
}

export interface PostTableData {
    available: boolean
    max_people: number
}

export interface PatchTableData extends PostTableData {}

export interface TablesResponse {
    tables: Table[]
}

export interface TableResponse {
    table: Table
}

export interface ReservationsResponse {
    reservations: Reservation[]
}

export interface ReservationResponse {
    reservation: Reservation
}

export interface PostReservationData {
    for_date: string | undefined
    people_count: number
}

export interface GetAvailableHoursData extends PostReservationData {}

export interface AvailableHoursResponse {
    hours: number[]
}

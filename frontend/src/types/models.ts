export interface User {
    firstName: string
    lastName: string
    email: string
    token: string
    phone: string
    urole: 1 | 2 | 3
}

export interface Table {
    available: boolean
    createdAt: string
    id: number
    maxPeople: number
    updatedAt: string
}

export interface Reservation {
    cancelled: boolean
    createdAt: string
    forDate: string
    id: number
    peopleCount: number
    tableId: number
    updatedAt: string
    userId: number
}

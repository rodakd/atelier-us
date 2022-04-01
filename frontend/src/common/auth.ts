import { User } from '../types'

export const isAdminOrMod = (user: User | undefined) => {
    if (!user) return false
    return [2, 3].includes(user.urole)
}

export const isAdmin = (user: User | undefined) => {
    if (!user) return false
    return user.urole === 3
}

import Api from '../Api'
import { LoginData, PostUserData, UserResponse } from '../types'

export const postUser = async (data: PostUserData) => {
    const resp = await Api.post<UserResponse>('/users', data)
    return resp.data
}

export const login = async (data: LoginData) => {
    const resp = await Api.post<UserResponse>('/users/login', data)
    return resp.data
}

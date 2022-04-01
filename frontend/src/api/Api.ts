import Storage, { STORAGE_KEYS } from '../common/Storage'
import ENV from '../env'
import axios, { AxiosRequestConfig } from 'axios'
import { ApiError, BadRequestError, UnauthorizedError } from './errors'
import _ from 'lodash'

export class Api {
    constructor() {
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (!error.response) {
                    if (error.message) {
                        return Promise.reject(new ApiError(error.message))
                    }
                    return Promise.reject(error)
                }

                const { status, data } = error.response

                if (status && data.error) {
                    switch (status) {
                        case 401:
                            return Promise.reject(
                                new UnauthorizedError(data.error)
                            )
                        case 404:
                            return Promise.reject(
                                new BadRequestError(data.error)
                            )
                        default:
                            return Promise.reject(
                                new ApiError('Something went wrong!')
                            )
                    }
                }

                return Promise.reject(error)
            }
        )
    }

    getConfig(customConfig?: AxiosRequestConfig) {
        const defaultConfig: AxiosRequestConfig = { headers: {} }
        const token = Storage.get(STORAGE_KEYS.USER)?.token

        if (token) {
            defaultConfig.headers = {
                ...defaultConfig.headers,
                Authorization: `Token ${token}`,
            }
        }

        if (customConfig) {
            return { ...defaultConfig, ...customConfig }
        }

        return defaultConfig
    }

    get<T>(path: string, customConfig?: AxiosRequestConfig) {
        return axios.get<T>(
            `${ENV.API_URL}${path}`,
            this.getConfig(customConfig)
        )
    }

    delete<T>(path: string, customConfig?: AxiosRequestConfig) {
        return axios.delete<T>(
            `${ENV.API_URL}${path}`,
            this.getConfig(customConfig)
        )
    }

    patch<T>(path: string, data: Object, customConfig?: AxiosRequestConfig) {
        return axios.patch<T>(
            `${ENV.API_URL}${path}`,
            data,
            this.getConfig(customConfig)
        )
    }

    post<T>(path: string, data: Object, customConfig?: AxiosRequestConfig) {
        return axios.post<T>(
            `${ENV.API_URL}${path}`,
            data,
            this.getConfig(customConfig)
        )
    }
}

export default new Api()

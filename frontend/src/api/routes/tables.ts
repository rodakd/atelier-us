import _ from 'lodash'
import Api from '../Api'
import {
    PatchTableData,
    PostTableData,
    TableResponse,
    TablesResponse,
} from '../types'

export const postTable = async (data: PostTableData) => {
    const resp = await Api.post<TableResponse>('/tables', data)
    return resp.data
}

export const getTables = async (sortBy = 'id') => {
    const resp = await Api.get<TablesResponse>('/tables')
    return _.sortBy(resp.data.tables, sortBy)
}

export const patchTable = async (id: number, data: PatchTableData) => {
    const resp = await Api.patch<TableResponse>(`/tables/${id}`, data)
    return resp.data
}

export const deleteTable = async (id: number) => {
    await Api.delete(`/tables/${id}`)
}

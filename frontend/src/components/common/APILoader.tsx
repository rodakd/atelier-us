import { Spinner } from '@chakra-ui/react'
import { UseQueryResult } from 'react-query'
import { extractError } from '../../api/errors'

type Props<T> = {
    query: UseQueryResult<T, unknown>
    onSuccess: (data: T) => JSX.Element
}

export function APILoader<T>(props: Props<T>) {
    const { isFetching, data, error } = props.query

    if (isFetching) {
        return (
            <div className="api-loader">
                <Spinner />
            </div>
        )
    }

    if (error) {
        return <span className="api-loader__error">{extractError(error)}</span>
    }

    return props.onSuccess(data!)
}

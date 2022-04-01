import { useToast, UseToastOptions } from '@chakra-ui/react'
import _ from 'lodash'
import { ApiError, BadRequestError, UnauthorizedError } from '../../api/errors'

export const useNotifier = () => {
    const toast = useToast()

    const common: Partial<UseToastOptions> = {
        position: 'top',
    }

    function error(err: ApiError | any) {
        const notify = (title: string) =>
            toast({
                ...common,
                status: 'error',
                title,
            })
        console.log(err)

        if (err?.message) {
            return notify(err.message)
        }

        if (err instanceof UnauthorizedError) {
            return notify('Unauthorized!')
        }

        if (err instanceof BadRequestError) {
            return notify('Invalid data')
        }

        if (_.isString(err)) {
            return notify(err)
        }

        return notify('Something went wrong')
    }

    function success(title: string) {
        return toast({
            ...common,
            title,
            status: 'success',
        })
    }

    return { error, success }
}

import * as Yup from 'yup'

import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
} from '@chakra-ui/react'

import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { EMAIL_REGEX } from '../../common/constants'
import _ from 'lodash'
import { login } from '../../api/routes/users'
import { yupResolver } from '@hookform/resolvers/yup'
import useAppState from '../providers/AppContextProvider'
import { useNotifier } from '../common/hooks'
import { isAdminOrMod } from '../../common/auth'

interface FormValues {
    email: string
    password: string
}

interface Props {
    requiredAdmin?: boolean
}

export const LoginPage = (props: Props) => {
    const [isLoading, setIsLoading] = useState(false)

    const notifier = useNotifier()
    const appState = useAppState()

    const validationSchema = Yup.object().shape({
        email: Yup.string().matches(EMAIL_REGEX),
        password: Yup.string().min(8),
    })

    const formOptions = { resolver: yupResolver(validationSchema) }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>(formOptions)

    const loginUser: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true)

        try {
            const response = await login({
                email: data.email,
                password: data.password,
            })

            if (props.requiredAdmin && !isAdminOrMod(response.user)) {
                notifier.error('This user has no access!')
            } else {
                appState.login(response.user)
            }
        } catch (err) {
            console.log(err)
            notifier.error(err)
        }

        setIsLoading(false)
    }

    return (
        <form className="login-page" onSubmit={handleSubmit(loginUser)}>
            <section className="login-page__body">
                <FormControl isInvalid={!!errors.email}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input id="email" type="email" {...register('email')} />
                    <FormErrorMessage>
                        {errors.email && 'Invalid email'}
                    </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.password}>
                    <FormLabel htmlFor="email">Password</FormLabel>
                    <Input
                        id="password"
                        type="password"
                        {...register('password')}
                    />
                    <FormErrorMessage>
                        {errors.password &&
                            _.capitalize(errors.password.message)}
                    </FormErrorMessage>
                </FormControl>
            </section>
            <Button type="submit" isLoading={isLoading}>
                Login
            </Button>
        </form>
    )
}

import * as Yup from 'yup'

import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@chakra-ui/react'

import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { EMAIL_REGEX } from '../../common/constants'
import _ from 'lodash'
import { login } from '../../api/routes/users'
import { yupResolver } from '@hookform/resolvers/yup'
import useAppState from '../providers/AppContextProvider'
import { useNotifier } from '../common/hooks'

interface LoginModalProps {
    onGoToSignup: () => void
    onClose: () => void
}

interface FormValues {
    email: string
    password: string
}

export const LoginModal = (props: LoginModalProps) => {
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
        try {
            setIsLoading(true)
            const response = await login({
                email: data.email,
                password: data.password,
            })
            appState.login(response.user)
            setIsLoading(false)
            props.onClose()
        } catch (err) {
            notifier.error(err)
            setIsLoading(false)
        }
    }

    return (
        <ModalContent className="auth-modal">
            <ModalHeader>Log into your account</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit(loginUser)}>
                <ModalBody>
                    <section className="auth-modal__body">
                        <FormControl isInvalid={!!errors.email}>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Input
                                id="email"
                                type="email"
                                autoFocus
                                {...register('email')}
                            />
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
                </ModalBody>

                <ModalFooter>
                    <Button
                        className="auth-modal__sign-up-btn"
                        onClick={props.onGoToSignup}
                    >
                        Sign Up
                    </Button>
                    <Button colorScheme="blue" mr={3} onClick={props.onClose}>
                        Close
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Login
                    </Button>
                </ModalFooter>
            </form>
        </ModalContent>
    )
}

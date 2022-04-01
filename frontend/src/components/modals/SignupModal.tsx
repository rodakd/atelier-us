import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

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

import { SubmitHandler, useForm } from 'react-hook-form'
import { EMAIL_REGEX, PHONE_REGEX } from '../../common/constants'
import _ from 'lodash'
import { useState } from 'react'
import { postUser } from '../../api/routes/users'
import useAppState from '../providers/AppContextProvider'
import { useNotifier } from '../common/hooks'

interface SignupModalProps {
    onGoToLogin: () => void
    onClose: () => void
}

interface FormValues {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
}

export const SignupModal = (props: SignupModalProps) => {
    const [isLoading, setIsLoading] = useState(false)

    const appState = useAppState()
    const notifier = useNotifier()

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required(),
        lastName: Yup.string().required(),
        email: Yup.string().matches(EMAIL_REGEX),
        phone: Yup.string().matches(PHONE_REGEX),
        password: Yup.string().min(8),
    })

    const formOptions = { resolver: yupResolver(validationSchema) }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>(formOptions)

    const signupUser: SubmitHandler<FormValues> = async (data) => {
        try {
            setIsLoading(true)
            const response = await postUser({
                email: data.email,
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone,
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
            <ModalHeader>Create new account</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit(signupUser)}>
                <ModalBody>
                    <section className="auth-modal__body">
                        <FormControl isInvalid={!!errors.firstName}>
                            <FormLabel htmlFor="firstName">
                                First name
                            </FormLabel>
                            <Input
                                id="firstName"
                                type="firstName"
                                autoFocus
                                {...register('firstName')}
                            />
                            <FormErrorMessage>
                                {errors.firstName && 'Invalid first name'}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.lastName}>
                            <FormLabel htmlFor="lastName">Last name</FormLabel>
                            <Input
                                id="lastName"
                                type="lastName"
                                {...register('lastName')}
                            />
                            <FormErrorMessage>
                                {errors.lastName && 'Invalid last name'}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.email}>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Input
                                id="email"
                                type="email"
                                {...register('email')}
                            />
                            <FormErrorMessage>
                                {errors.email && 'Invalid email'}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.phone}>
                            <FormLabel htmlFor="email">Phone number</FormLabel>
                            <Input
                                id="phone"
                                type="phone"
                                {...register('phone')}
                            />
                            <FormErrorMessage>
                                {errors.phone && 'Invalid phone number'}
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
                        onClick={props.onGoToLogin}
                    >
                        Back to Login
                    </Button>
                    <Button colorScheme="blue" mr={3} onClick={props.onClose}>
                        Close
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Signup
                    </Button>
                </ModalFooter>
            </form>
        </ModalContent>
    )
}

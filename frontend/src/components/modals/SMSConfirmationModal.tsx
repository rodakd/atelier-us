import * as Yup from 'yup'

import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react'

import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import _ from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotifier } from '../common/hooks'
import useAppState from '../providers/AppContextProvider'

interface SMSConfirmationModalProps {
    isOpen: boolean
    onSubmit: () => Promise<void>
    onClose: () => void
}

interface FormValues {
    code: string
}

export const SMSConfirmationModal = (props: SMSConfirmationModalProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const notifier = useNotifier()
    const { user } = useAppState()

    const validationSchema = Yup.object().shape({
        code: Yup.string().matches(new RegExp('1234')),
    })

    const formOptions = { resolver: yupResolver(validationSchema) }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>(formOptions)

    const submitReservation: SubmitHandler<FormValues> = async () => {
        try {
            setIsLoading(true)
            await props.onSubmit()
            setIsLoading(false)
            props.onClose()
        } catch (err) {
            notifier.error(err)
            setIsLoading(false)
        }
    }

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <ModalContent className="auth-modal">
                <ModalHeader>SMS confirmation</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit(submitReservation)}>
                    <ModalBody>
                        <p style={{ marginBottom: 10 }}>
                            We sent a confirmation code to <b>{user?.phone}</b>.
                            Please enter it below.
                        </p>
                        <section className="auth-modal__body">
                            <FormControl isInvalid={!!errors.code}>
                                <FormLabel htmlFor="code">Code</FormLabel>
                                <Input
                                    id="code"
                                    type="code"
                                    autoFocus
                                    {...register('code')}
                                />
                                <FormErrorMessage>
                                    {errors.code && 'Invalid code'}
                                </FormErrorMessage>
                            </FormControl>
                        </section>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={props.onClose}
                        >
                            Close
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            Confirm
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}

import {
    Button,
    Checkbox,
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
import { useNotifier } from '../common/hooks'
import { Table } from '../../types'

interface TableModalProps {
    submitText: string
    onClose: () => void
    onSubmit: (data: TableForm) => void | Promise<void>

    table?: Table
    submitColor?: string
}

export interface TableForm {
    maxPeople: number
    available: boolean
}

export const TableModal = (props: TableModalProps) => {
    const [isLoading, setIsLoading] = useState(false)

    const notifier = useNotifier()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TableForm>({
        defaultValues: {
            maxPeople: props.table?.maxPeople || 1,
            available: props.table?.available,
        },
    })

    const editTable: SubmitHandler<TableForm> = async (data) => {
        try {
            setIsLoading(true)
            await props.onSubmit(data)
        } catch (err) {
            notifier.error(err)
            setIsLoading(false)
        }
    }

    return (
        <Modal isOpen onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent className="auth-modal">
                <ModalHeader>Edit table</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit(editTable)}>
                    <ModalBody>
                        <section className="auth-modal__body">
                            <FormControl isInvalid={!!errors.maxPeople}>
                                <FormLabel htmlFor="maxPeople">
                                    Max people
                                </FormLabel>
                                <Input
                                    id="maxPople"
                                    type="number"
                                    min={1}
                                    autoFocus
                                    {...register('maxPeople')}
                                />
                                <FormErrorMessage>
                                    {errors.maxPeople && 'Invalid max people!'}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.available}>
                                <Checkbox
                                    id="available"
                                    type="checkbox"
                                    {...register('available')}
                                >
                                    Available
                                </Checkbox>
                                <FormErrorMessage>
                                    {errors.available &&
                                        _.capitalize(errors.available.message)}
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
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            colorScheme={props.submitColor || 'blue'}
                        >
                            {props.submitText}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}

import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react'
import { useState } from 'react'

import _ from 'lodash'

interface ConfirmationModalProps {
    title: string
    description: string
    isOpen: boolean
    onSubmit: () => Promise<void> | void
    onCancel: () => void
    buttonText?: string
    buttonColorScheme?: 'red' | 'blue' | 'green'
}

export const ConfirmationModal = (props: ConfirmationModalProps) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        setIsLoading(true)
        await props.onSubmit()
        setIsLoading(false)
    }

    return (
        <Modal isOpen={props.isOpen} onClose={props.onCancel}>
            <ModalOverlay />
            <ModalContent className="confirmation-modal">
                <ModalHeader fontSize="1.5rem">{props.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{props.description}</ModalBody>
                <ModalFooter>
                    <Button mr={3} onClick={props.onCancel}>
                        Close
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        colorScheme={props.buttonColorScheme || 'green'}
                        isLoading={isLoading}
                        autoFocus
                    >
                        {props.buttonText || 'Submit'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

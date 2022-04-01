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
import { useNavigate } from 'react-router-dom'

import _ from 'lodash'
import useAppState from '../providers/AppContextProvider'

interface LogoutModalProps {
    isOpen: boolean
    onClose: () => void
}

export const LogoutModal = (props: LogoutModalProps) => {
    const appState = useAppState()
    const navigate = useNavigate()

    const logoutUser = async () => {
        appState.logout()
        navigate('/')
        props.onClose()
    }

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Are you sure?</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Do you really want to log out of the account?
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={props.onClose}>
                        Close
                    </Button>
                    <Button onClick={logoutUser}>Yes, log me out</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

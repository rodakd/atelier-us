import { Modal, ModalOverlay } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { LoginModal } from './LoginModal'
import { SignupModal } from './SignupModal'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
}

type AuthModalType = 'login' | 'signup'

export const AuthModal = (props: AuthModalProps) => {
    const [type, setType] = useState<AuthModalType>('login')

    useEffect(() => {
        setType('login')
    }, [props.isOpen])

    let modalContent = (
        <LoginModal
            onGoToSignup={() => setType('signup')}
            onClose={props.onClose}
        />
    )

    if (type === 'signup') {
        modalContent = (
            <SignupModal
                onGoToLogin={() => setType('login')}
                onClose={props.onClose}
            />
        )
    }

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} size="lg">
            <ModalOverlay />
            {modalContent}
        </Modal>
    )
}

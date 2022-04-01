import { Button } from '@chakra-ui/react'
import { AiFillCheckCircle } from 'react-icons/ai'
import { Link } from 'react-router-dom'

export const SuccessPage = () => {
    return (
        <main className="success-page">
            <AiFillCheckCircle size={100} color="#00aa00" />
            <h2 className="success-page__title">
                Your reservation was a success!
            </h2>
            <p className="success-page__subtitle">
                You will soon enjoy our masterfully crafted food.
            </p>
            <Link to="/">
                <Button>Back to homepage</Button>
            </Link>
        </main>
    )
}

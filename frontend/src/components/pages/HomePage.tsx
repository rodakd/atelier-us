import { Button } from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'
import useAppState from '../providers/AppContextProvider'

export const HomePage = () => {
    const { user } = useAppState()

    const handleClick = (e: any) => {
        if (!user) {
            e.preventDefault()
        }
    }

    return (
        <main className="homepage">
            <section className="hero">
                <div className="hero__backdrop">
                    <h1 className="hero__headline">
                        Witness the greatest taste
                    </h1>
                    <p className="hero__description">
                        Enjoy the award winning food made by the most skilled
                        chefs in Poland
                    </p>
                    <Link to="/reserve" onClick={handleClick}>
                        <Button
                            size="md"
                            className="hero__button"
                            rightIcon={<ArrowForwardIcon boxSize={6} />}
                        >
                            {user
                                ? 'Make a reservation'
                                : 'Sign up to make a reservation'}
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    )
}

import * as Yup from 'yup'

import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Textarea,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { EMAIL_REGEX } from '../../common/constants'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useState } from 'react'
import { useNotifier } from '../common/hooks'
import emailjs from '@emailjs/browser'

interface FormValues {
    email: string
    text: string
}

export const ContactPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const notifier = useNotifier()

    const validationSchema = Yup.object().shape({
        email: Yup.string().matches(EMAIL_REGEX),
        text: Yup.string().min(1),
    })

    const formOptions = { resolver: yupResolver(validationSchema) }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>(formOptions)

    const send = async (data: FormValues) => {
        setIsLoading(true)
        try {
            await emailjs.send(
                'service_yv309cs',
                'template_hi9g911',
                {
                    from_name: data.email,
                    message: data.text,
                },
                '6XJ1bH085Z5Ksh6wA'
            )
            setSent(true)
        } catch (err) {
            notifier.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="contact-page">
                <h2>Your message has been sent! We will reply ASAP!</h2>
            </div>
        )
    }

    return (
        <div className="contact-page">
            <h2>Have questions? Let us know!</h2>
            <form onSubmit={handleSubmit(send)}>
                <FormControl isInvalid={!!errors.email}>
                    <FormLabel htmlFor="email">Your Email</FormLabel>
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
                <FormControl isInvalid={!!errors.text}>
                    <FormLabel htmlFor="text">Your Message</FormLabel>
                    <Textarea id="text" {...register('text')} />
                    <FormErrorMessage>{errors.text}</FormErrorMessage>
                </FormControl>
                <Button type="submit" colorScheme="blue" isLoading={isLoading}>
                    Send
                </Button>
            </form>
        </div>
    )
}

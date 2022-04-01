import {
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react'
import { ChangeEvent, FC } from 'react'
import { AiOutlineUser } from 'react-icons/ai'

type Props = {
    value: number
    onChange: (newValue: number) => void
}

export const PeopleCount: FC<Props> = (props) => {
    function handleInputChanged(e: ChangeEvent<HTMLInputElement>) {
        const value = e.currentTarget.value
        const count = parseInt(value)
        if (count > 0 && count <= 12) {
            props.onChange(count)
        }
    }

    return (
        <FormControl className="people-count">
            <FormLabel htmlFor="people_count">People</FormLabel>
            <InputGroup>
                <InputLeftElement children={<AiOutlineUser />} />
                <Input
                    id="people_count"
                    placeholder="Number of people (e.g. 3)"
                    type="number"
                    value={props.value}
                    onChange={handleInputChanged}
                />
            </InputGroup>
        </FormControl>
    )
}

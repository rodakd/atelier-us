import * as React from 'react'
import { DayPicker as ReactDayPicker } from 'react-day-picker'

import 'react-day-picker/dist/style.css'

type Props = {
    value: Date | undefined
    onChange: (newDate: Date | undefined) => void
}

export const DayPicker: React.FC<Props> = (props) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    return (
        <ReactDayPicker
            className="day-picker"
            mode="single"
            selected={props.value}
            onSelect={props.onChange}
            fromDate={tomorrow}
        />
    )
}

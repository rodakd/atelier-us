import cn from 'classnames'
import * as React from 'react'
import { OPENING_HOUR, CLOSING_HOUR } from '../../common/constants'

type Props = {
    value: number | undefined
    availableHours: number[]
    disabled: boolean
    onChange: (newValue: number | undefined) => void
}

export const HourPicker: React.FC<Props> = (props) => {
    const content: JSX.Element[] = []

    for (let i = OPENING_HOUR; i <= CLOSING_HOUR; i++) {
        const disabled = !props.disabled && !props.availableHours.includes(i)
        content.push(
            <button
                onClick={() => props.onChange(i)}
                key={i}
                className={cn('hour-picker__item', {
                    'hour-picker__item--active': i === props.value,
                })}
                disabled={disabled}
            >
                {i}:00
            </button>
        )
    }

    return (
        <div
            className={cn('hour-picker', {
                'hour-picker--disabled': props.disabled,
            })}
        >
            {content}
        </div>
    )
}

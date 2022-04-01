import { ArrowBackIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { DayPicker } from '../common/DayPicker'
import { HourPicker } from '../common/HourPicker'
import { PeopleCount } from '../common/PeopleCount'

import { useQuery } from 'react-query'
import {
    getAvailableHours,
    postReservation,
} from '../../api/routes/reservations'
import { Spinner } from '@chakra-ui/react'
import { extractError } from '../../api/errors'
import { ConfirmationModal } from '../modals/ConfirmationModal'
import { SMSConfirmationModal } from '../modals/SMSConfirmationModal'
import _ from 'lodash'
import { useNavigate } from 'react-router-dom'

export const ReservePage = () => {
    const [day, setDay] = useState<Date>()
    const [peopleCount, setPeopleCount] = useState<number>(1)
    const [hour, setHour] = useState<number>()
    const [smsModalOpen, setSmsModalOpen] = useState(false)
    const navigate = useNavigate()

    const { data, error, isFetching } = useQuery(
        ['hours', day, peopleCount],
        () => {
            if (!day) {
                return
            }

            return getAvailableHours({
                for_date: day.toISOString().slice(0, -2),
                people_count: peopleCount,
            })
        },
        { retry: false, refetchOnWindowFocus: false }
    )

    const reserve = async () => {
        if (!day || !_.isNumber(hour)) {
            return
        }

        const date = new Date(day)
        date.setTime(date.getTime() + (hour + 2) * 60 * 60 * 1000)

        await postReservation({
            for_date: date.toISOString().slice(0, -2),
            people_count: peopleCount,
        })

        _.defer(() => navigate('/success'))
    }

    const renderRightEl = () => {
        if (isFetching) {
            return <Spinner />
        }

        if (error) {
            return <span>{extractError(error)}</span>
        }

        return (
            <HourPicker
                value={hour}
                onChange={setHour}
                availableHours={data?.hours || []}
                disabled={!day || !data}
            />
        )
    }

    return (
        <div className="reserve-page">
            <h4 className="reserve-page__heading">Reserve a table</h4>
            <div className="reserve-page__box">
                <div className="reserve-page__left">
                    <PeopleCount
                        value={peopleCount}
                        onChange={setPeopleCount}
                    />
                    <DayPicker value={day} onChange={setDay} />
                </div>
                <div className="reserve-page__right">{renderRightEl()}</div>
            </div>
            {hour && (
                <ConfirmationModal
                    isOpen
                    title="Confirm a reservation"
                    description={`Do you really want to make a reservation for ${hour}:00 ${day?.toLocaleDateString()}?`}
                    onCancel={() => setHour(undefined)}
                    onSubmit={() => {
                        setSmsModalOpen(true)
                    }}
                />
            )}
            {smsModalOpen && (
                <SMSConfirmationModal
                    onSubmit={reserve}
                    isOpen
                    onClose={() => setSmsModalOpen(false)}
                />
            )}
        </div>
    )
}

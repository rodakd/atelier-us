import {
    Button,
    Table as ChakraTable,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import {
    deleteTable,
    getTables,
    patchTable,
    postTable,
} from '../../../api/routes/tables'
import { isAdmin } from '../../../common/auth'
import { Table } from '../../../types'
import { APILoader } from '../../common/APILoader'
import { ConfirmationModal } from '../../modals/ConfirmationModal'
import { TableForm, TableModal } from '../../modals/TableModal'
import useAppState from '../../providers/AppContextProvider'

export const TablesPage = () => {
    const [toDelete, setToDelete] = useState<Table | null>()
    const [toEdit, setToEdit] = useState<Table | null>()
    const [addModalOpen, setAddModalOpen] = useState(false)

    const { user } = useAppState()

    const queryClient = useQueryClient()
    const query = useQuery('tables', () => getTables(), {
        refetchOnWindowFocus: false,
        retry: false,
    })

    const handleEdit = async (data: TableForm) => {
        if (!toEdit) {
            return
        }

        await patchTable(toEdit.id, {
            max_people: Number(data.maxPeople),
            available: data.available,
        })

        queryClient.invalidateQueries('tables')
        setToEdit(null)
    }

    const handleDelete = async () => {
        if (!toDelete) {
            return
        }

        await deleteTable(toDelete.id)

        queryClient.invalidateQueries('tables')
        setToDelete(null)
    }

    const handleAdd = async (data: TableForm) => {
        await postTable({
            max_people: Number(data.maxPeople),
            available: data.available,
        })

        queryClient.invalidateQueries('tables')
        setAddModalOpen(false)
    }

    return (
        <div className="tables-page">
            <APILoader
                query={query}
                onSuccess={(data) => (
                    <ChakraTable>
                        <Thead>
                            <Th>Id</Th>
                            <Th>Max people</Th>
                            <Th>Available</Th>
                            <Th textAlign="right">
                                {isAdmin(user) && (
                                    <Button
                                        colorScheme="blue"
                                        onClick={() => setAddModalOpen(true)}
                                    >
                                        Add New Table
                                    </Button>
                                )}
                            </Th>
                        </Thead>
                        <Tbody>
                            {data.map((t) => (
                                <Tr>
                                    <Td>{t.id}</Td>
                                    <Td>{t.maxPeople}</Td>
                                    <Td paddingLeft={10}>
                                        <span
                                            className={
                                                'dot ' +
                                                (t.available
                                                    ? 'dot--green'
                                                    : 'dot--red')
                                            }
                                        ></span>
                                    </Td>
                                    <Td width={300} textAlign="right">
                                        <Button
                                            marginRight={5}
                                            onClick={() => setToEdit(t)}
                                        >
                                            Edit
                                        </Button>
                                        {isAdmin(user) && (
                                            <Button
                                                colorScheme="red"
                                                onClick={() => setToDelete(t)}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </ChakraTable>
                )}
            />
            {toDelete && (
                <ConfirmationModal
                    title={`Delete table`}
                    description={`Do you really want to delete table ${toDelete.id}?`}
                    isOpen
                    onSubmit={handleDelete}
                    onCancel={() => setToDelete(null)}
                    buttonColorScheme="red"
                    buttonText="Delete"
                />
            )}
            {toEdit && (
                <TableModal
                    table={toEdit}
                    onClose={() => setToEdit(null)}
                    onSubmit={handleEdit}
                    submitText="Edit"
                />
            )}
            {addModalOpen && (
                <TableModal
                    onClose={() => setAddModalOpen(false)}
                    onSubmit={handleAdd}
                    submitText="Add"
                    submitColor="green"
                />
            )}
        </div>
    )
}

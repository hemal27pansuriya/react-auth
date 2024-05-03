import PropTypes from 'prop-types'
import { useRef, useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton';
import { ArrowDropDown, ArrowRight } from "@mui/icons-material";
import { Tooltip } from '@mui/material'

const SingleTodo = ({ todo, isSub, handleConfirmModal, setIsSubModalOpen, key, openTodo, setOpenTodo }) => {
    const inputRef = useRef(null)
    const [editingId, setEditingId] = useState(null)
    const [editTodoText, setEditTodoText] = useState('')
    const [singleTodo, setSingleTodo] = useState({})
    const [allTodos, setAllTodos] = useState([])

    useEffect(() => {
        if (inputRef.current && editingId !== null) {
            inputRef.current.focus();
        }
    }, [editingId]);

    useEffect(() => {
        if (todo) {
            const latestTodos = JSON.parse(localStorage.getItem('todoData'))
            const latestSingleTodo = latestTodos.find(t => t.iId === todo.iId)
            setSingleTodo({
                ...latestSingleTodo
            })
            setAllTodos(latestTodos)
        }
    }, [todo])

    const handleUpdateTodo = () => {
        const newTodo = { ...singleTodo, sTitle: editTodoText }

        const newAllTodos = allTodos.map((todo) =>
            todo.iId === editingId ? { ...todo, sTitle: editTodoText } : todo
        )
        setSingleTodo(newTodo);
        setAllTodos(newAllTodos);
        if (openTodo && openTodo.iId === editingId) setOpenTodo({ ...openTodo, sTitle: editTodoText })
        localStorage.setItem('todoData', JSON.stringify(newAllTodos))
        setEditingId(null);
    };

    const handleCheckbox = (iId) => {
        let newTodo, newAllTodos
        if (isSub) {
            newAllTodos = allTodos.map((t) =>
                t.iId === singleTodo.iId ? {
                    ...t,
                    aSubTodos: t.aSubTodos.map((st) =>
                        st.iId === iId ? { ...st, bCompleted: !st.bCompleted } : st
                    )
                } : t
            );
            const newST = newAllTodos.find(t => t.iId === singleTodo.iId).aSubTodos
            const allChecked = newST.every(st => st.bCompleted)
            newAllTodos = newAllTodos.map((t) =>
                t.iId === singleTodo.iId ? {
                    ...t,
                    bCompleted: allChecked
                } : t
            );
            const curr = {
                ...singleTodo,
                aSubTodos: newST
            }
        } else {
            newTodo = {
                ...singleTodo, bCompleted: !singleTodo.bCompleted, aSubTodos: singleTodo?.aSubTodos?.map(st => { return { ...st, bCompleted: !singleTodo.bCompleted } }) || []
            }
            newAllTodos = allTodos.map((t) =>
                t.iId === iId ? { ...t, bCompleted: !t.bCompleted, aSubTodos: t?.aSubTodos?.map(st => { return { ...st, bCompleted: !t.bCompleted } }) || [] } : t
            )
            if (openTodo && openTodo.iId === iId) setOpenTodo({ ...openTodo, bCompleted: !openTodo.bCompleted })
        }
        setSingleTodo(newTodo);
        setAllTodos(newAllTodos);
        localStorage.setItem('todoData', JSON.stringify(newAllTodos))
    }

    const handleOpenSubTodoModal = (todo) => {
        if (todo.iId === openTodo?.iId) {
            setOpenTodo(openTodo ? null : todo)
            setIsSubModalOpen(openTodo ? false : true)
        } else {
            setOpenTodo(todo)
            setIsSubModalOpen(true)
        }
    }

    const handleTodoEdit = (iId, value) => {
        setEditingId(iId);
        setEditTodoText(value)
    }

    return (
        <div
            key={key}
            className={`flex items-center ${key > 0 ? 'mt-2' : ''}`}
        >
            <input
                type="checkbox"
                checked={singleTodo.bCompleted}
                onChange={() =>
                    handleCheckbox(singleTodo.iId)
                }
                className="mr-4 h-5 w-7 cursor-pointer appearance-none checkbox bg-white rounded-md checked:bg-yellow-900 checked:border-transparent focus:outline-none"
            />
            {editingId === singleTodo.iId ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleUpdateTodo()
                    }}
                    style={{ display: 'flex', alignItems: 'center', width: '100%' }}
                >
                    <input
                        type="text"
                        ref={inputRef}
                        value={editTodoText}
                        onChange={e => setEditTodoText(e.target.value)}
                        className={`box-border mr-3 mt-4 border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full patrick-hand-regular h-10`}
                    />
                    <button
                        className='bg-yellow-900 text-white rounded-lg px-4 py-2 hover:bg-yellow-700'
                        type='submit'
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="ml-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        onClick={() => handleConfirmModal(singleTodo, true)}
                    >
                        Delete
                    </button>
                </form>
            ) : (<>
                <span
                    className={`px-3 py-2 rounded-md p-2 ${singleTodo.bCompleted ? 'line-through text-gray-700' : ''} patrick-hand-regular cursor-pointer w-full`}
                    onClick={() =>
                        handleCheckbox(singleTodo.iId)
                    }
                >
                    {singleTodo.sTitle}
                </span>
                <button
                    type="button"
                    className="ml-5 bg-yellow-900 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                    onClick={() => handleTodoEdit(singleTodo.iId, singleTodo.sTitle)}
                >
                    Edit
                </button>
                <button
                    type="button"
                    className="ml-3 mr-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={() => handleConfirmModal(singleTodo, true)}
                >
                    Delete
                </button>
            </>)}
            {!isSub && <Tooltip title='Open Sub-Todos'>
                <IconButton onClick={() => handleOpenSubTodoModal(singleTodo)}>
                    {openTodo && openTodo.iId === singleTodo.iId ? <ArrowRight /> : <ArrowDropDown />}
                </IconButton>
            </Tooltip>}
        </div>
    )
}

SingleTodo.propTypes = {
    todo: PropTypes.object.isRequired,
    isSub: PropTypes.bool.isRequired,
    handleConfirmModal: PropTypes.func,
    setIsSubModalOpen: PropTypes.func,
    key: PropTypes.number,
    openTodo: PropTypes.object,
    setOpenTodo: PropTypes.func
}

export default SingleTodo
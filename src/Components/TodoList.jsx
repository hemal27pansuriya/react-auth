import { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const TodoList = ({ todos, handleCheckbox, handleOpenSubTodoModal, handleUpdateTodo, handleConfirmModal }) => {
    const inputRef = useRef(null)
    const [editingId, setEditingId] = useState(null)
    const [editTodoText, setEditTodoText] = useState('')

    useEffect(() => {
        if (inputRef.current && editingId !== null) {
            inputRef.current.focus();
        }
    }, [editingId]);

    const handleTodoEdit = (iId, value) => {
        setEditingId(iId);
        setEditTodoText(value)
    }

    return (
        <div>
            {todos.map((todo, index) => (
                <div
                    key={index}
                    className='flex items-center mb-2'
                >
                    <input
                        type="checkbox"
                        checked={todo.bCompleted}
                        onChange={() =>
                            handleCheckbox(todo.iId)
                        }
                        className="mr-2 cursor-pointer"
                    />
                    {editingId === todo.iId ? <input
                        type="text"
                        ref={inputRef}
                        value={editTodoText}
                        onChange={e => setEditTodoText(e.target.value)}
                        className={`mr-3 border border-gray-300 rounded-lg px-4 py-2 mb-4 ${todo.bCompleted ? 'line-through text-gray-500' : ''}`}
                    /> : <span
                        className={`${todo.bCompleted ? 'line-through text-gray-500' : ''} cursor-pointer`}
                        onClick={() => handleOpenSubTodoModal(todo)}
                    >
                        {todo.sTitle}
                    </span>}
                    {editingId === todo.iId ? <button
                        className='bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 h-10'
                        onClick={() => handleUpdateTodo(todo.iId)}
                    >
                        Save
                    </button> : <>
                        <button
                            type="button"
                            className="ml-10 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            onClick={() => handleTodoEdit(todo.iId, todo.sTitle)}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="ml-5 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            onClick={() => handleConfirmModal(todo, true)}
                        >
                            Delete
                        </button>
                    </>}
                </div>

            ))}
        </div>
    )
}

TodoList.propTypes = {
    todos: PropTypes.array.isRequired,
    handleCheckbox: PropTypes.func.isRequired,
    handleOpenSubTodoModal: PropTypes.func,
    handleUpdateTodo: PropTypes.func.isRequired,
    handleTodoEdit: PropTypes.func.isRequired,
    handleConfirmModal: PropTypes.func,
}

export default TodoList
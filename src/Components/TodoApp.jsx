import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types'
import ConfirmModal from './ConfirmModal';
import SubTodoModal from './SubTodoModal';
import { v4 as uuidv4 } from "uuid";

const TodoApp = ({ sUsername }) => {
    const [todos, setTodos] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [allTodos, setAllTodos] = useState([])
    // const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [openTodo, setOpenTodo] = useState(null)
    const [validateMsg, setValidateMsg] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [todoNew, setTodoNew] = useState('')
    const [editTodoText, setEditTodoText] = useState('')
    const inputRef = useRef(null)

    useEffect(() => {
        const todoData = JSON.parse(localStorage.getItem('todoData')) || [];
        const currTodos = todoData.filter((todo) => todo.sUsername === sUsername);
        setTodos(currTodos)
        setAllTodos(todoData)
    }, [sUsername])

    useEffect(() => {
        if (inputRef.current && editingId !== null) {
            inputRef.current.focus();
        }
    }, [editingId]);

    const handleAddTodo = (e) => {
        e.preventDefault()
        if (!todoNew) return setValidateMsg('Please enter a value')
        const iId = uuidv4()
        const newTodo = {
            sTitle: todoNew,
            bCompleted: false,
            sUsername,
            iId
        }
        setTodos([...todos, newTodo]);
        const updatedTodos = [...allTodos, newTodo];
        setAllTodos(updatedTodos)
        localStorage.setItem('todoData', JSON.stringify(updatedTodos));
    };

    const handleUpdateTodo = () => {
        const newTodos = todos.map((todo) =>
            todo.iId === editingId ? { ...todo, sTitle: editTodoText } : todo
        );
        const newAllTodos = allTodos.map((todo) =>
            todo.iId === editingId ? { ...todo, sTitle: editTodoText } : todo
        )
        setTodos(newTodos);
        setAllTodos(newAllTodos);
        localStorage.setItem('todoData', JSON.stringify(newAllTodos))
        setEditingId(null);
    };

    const handleDeleteTodo = () => {
        const newTodos = todos.filter((todo) => todo.iId !== editingId);
        const newAllTodos = allTodos.filter((todo) => todo.iId !== editingId);
        setTodos(newTodos);
        setAllTodos(newAllTodos);
        localStorage.setItem('todoData', JSON.stringify(newAllTodos))
        setEditingId(null);
    }

    // const handleOpenModal = (todo = null) => {
    //     setEditingTodo(todo);
    //     setIsModalOpen(true);
    // };

    const handleConfirmModal = (todo = null) => {
        setEditingId(todo.iId);
        setIsConfirmModalOpen(true)
    }

    // const handleCloseModal = () => {
    //     setIsModalOpen(false);
    //     setEditingTodo(null);
    // };

    const handleCheckbox = (iId) => {
        const newTodos = todos.map((t) =>
            t.iId === iId ? { ...t, bCompleted: !t.bCompleted } : t
        );
        const newAllTodos = allTodos.map((t) =>
            t.iId === iId && t.sUsername === sUsername ? { ...t, bCompleted: !t.bCompleted } : t
        )
        setTodos(newTodos);
        setAllTodos(newAllTodos);
        localStorage.setItem('todoData', JSON.stringify(newAllTodos))
    }

    const handleOpenSubTodoModal = (todo) => {
        setOpenTodo(todo)
        setIsSubModalOpen(true)
    }

    const handleCloseSubModal = () => {
        setIsSubModalOpen(false)
        setOpenTodo(null)
        const todoData = JSON.parse(localStorage.getItem('todoData')) || [];
        const currTodos = todoData.filter((todo) => todo.sUsername === sUsername);
        setTodos(currTodos)
        setAllTodos(todoData)

    }

    const handleTodoEdit = (iId, value) => {
        setEditingId(iId);
        setEditTodoText(value)
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Todo App</h1>

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

            <form onSubmit={handleAddTodo}>
                <div className='flex mt-5'>
                    <input
                        type="text"
                        value={todoNew}
                        onChange={(e) => {
                            setValidateMsg('')
                            setTodoNew(e.target.value)
                        }}
                        className="mr-3 border border-gray-300 rounded-lg px-4 py-2 mb-4"
                        placeholder="Enter todo..."
                    />
                    <button
                        type='submit'
                        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 h-10"
                    >
                        Add
                    </button>
                </div>
                {validateMsg && <p className='text-red-500 text-xs mb-1'>{validateMsg}</p>}
            </form>
            {/* <TodoModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
                initialValue={editingTodo ? editingTodo.sTitle : ''}
            /> */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onSubmit={handleDeleteTodo}
                title='Are you sure want to delete?'
            />
            <SubTodoModal
                isOpen={isSubModalOpen}
                onClose={handleCloseSubModal}
                todo={openTodo}
                allTodos={allTodos}
            />
        </div >
    );
};

TodoApp.propTypes = {
    sUsername: PropTypes.string.isRequired
}

export default TodoApp;
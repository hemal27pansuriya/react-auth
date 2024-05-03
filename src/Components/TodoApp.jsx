import { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types'
import ConfirmModal from './ConfirmModal';
import { v4 as uuidv4 } from "uuid";
import SubTodos from './SubTodos';
import SingleTodo from './SingleTodo';

const TodoApp = ({ sUsername }) => {
    const [todos, setTodos] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [allTodos, setAllTodos] = useState([])
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [openTodo, setOpenTodo] = useState(null)
    const [validateMsg, setValidateMsg] = useState('')
    // const [editingId, setEditingId] = useState(null)
    const [deletingId, setDeletingId] = useState(null)
    const [todoNew, setTodoNew] = useState('')
    // const [editTodoText, setEditTodoText] = useState('')
    // const inputRef = useRef(null)

    useEffect(() => {
        const todoData = JSON.parse(localStorage.getItem('todoData')) || [];
        const currTodos = todoData.filter((todo) => todo.sUsername === sUsername);
        setTodos(currTodos)
        setAllTodos(todoData)
    }, [sUsername])

    // useEffect(() => {
    //     if (inputRef.current && editingId !== null) {
    //         inputRef.current.focus();
    //     }
    // }, [editingId]);

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
        setTodoNew('')
    };

    // const handleUpdateTodo = () => {
    //     const newTodos = todos.map((todo) =>
    //         todo.iId === editingId ? { ...todo, sTitle: editTodoText } : todo
    //     );
    //     const newAllTodos = allTodos.map((todo) =>
    //         todo.iId === editingId ? { ...todo, sTitle: editTodoText } : todo
    //     )
    //     setTodos(newTodos);
    //     setAllTodos(newAllTodos);
    //     if (openTodo && openTodo.iId === editingId) setOpenTodo({ ...openTodo, sTitle: editTodoText })
    //     localStorage.setItem('todoData', JSON.stringify(newAllTodos))
    //     setEditingId(null);
    // };

    const handleDeleteTodo = () => {
        const newTodos = todos.filter((todo) => todo.iId !== deletingId);
        const newAllTodos = allTodos.filter((todo) => todo.iId !== deletingId);
        setTodos(newTodos);
        setAllTodos(newAllTodos);
        if (openTodo && openTodo.iId === deletingId) handleCloseSubModal()
        localStorage.setItem('todoData', JSON.stringify(newAllTodos))
        setDeletingId(null);
    }

    const handleConfirmModal = (todo = null) => {
        setDeletingId(todo.iId);
        setIsConfirmModalOpen(true)
    }

    // const handleCheckbox = (iId) => {
    //     const newTodos = todos.map((t) =>
    //         t.iId === iId ? {
    //             ...t, bCompleted: !t.bCompleted, aSubTodos: t?.aSubTodos?.map(st => { return { ...st, bCompleted: !t.bCompleted } }) || []
    //         } : t
    //     );
    //     const newAllTodos = allTodos.map((t) =>
    //         t.iId === iId ? { ...t, bCompleted: !t.bCompleted, aSubTodos: t?.aSubTodos?.map(st => { return { ...st, bCompleted: !t.bCompleted } }) || [] } : t
    //     )
    //     setTodos(newTodos);
    //     setAllTodos(newAllTodos);
    //     if (openTodo && openTodo.iId === iId) setOpenTodo({ ...openTodo, bCompleted: !openTodo.bCompleted })
    //     localStorage.setItem('todoData', JSON.stringify(newAllTodos))
    // }

    // const handleOpenSubTodoModal = (todo) => {
    //     if (todo.iId === openTodo?.iId) {
    //         setOpenTodo(openTodo ? null : todo)
    //         setIsSubModalOpen(openTodo ? false : true)
    //     } else {
    //         setOpenTodo(todo)
    //         setIsSubModalOpen(true)
    //     }
    // }

    const handleCloseSubModal = () => {
        setIsSubModalOpen(false)
        setOpenTodo(null)
    }

    const updateOnCheckbox = () => {
        const todoData = JSON.parse(localStorage.getItem('todoData')) || [];
        const currTodos = todoData.filter((todo) => todo.sUsername === sUsername);
        console.log('105-', currTodos)
        setTodos(currTodos)
        setAllTodos(todoData)
    }

    // const handleTodoEdit = (iId, value) => {
    //     setEditingId(iId);
    //     setEditTodoText(value)
    // }

    return (
        <div className="container mx-auto p-4 flex">
            <div className='todo-app w-1/2'>
                <h1 className="text-2xl font-bold mb-4 text-center">Todo App</h1>
                <form onSubmit={handleAddTodo}>
                    <div className='mb-5 rounded-lg p-5 bg-texture shadow-lg'>
                        <div className='flex'>
                            <input
                                type="text"
                                value={todoNew}
                                onChange={(e) => {
                                    setValidateMsg('')
                                    setTodoNew(e.target.value)
                                }}
                                className="mr-3 border border-gray-300 rounded-lg px-4 py-2 w-full patrick-hand-regular h-10"
                                placeholder="Enter todo..."
                            />
                            <button
                                type='submit'
                                className="bg-yellow-900 text-white rounded-lg px-4 py-2 hover:bg-yellow-800 h-10"
                            >
                                Add
                            </button>
                        </div>
                        {validateMsg && <p className='text-red-600 font-semibold text-xs mt-2'>{validateMsg}</p>}
                    </div>
                </form>
                <div
                    className='p-5 rounded-lg bg-texture shadow-lg'
                >
                    {todos.length <= 0 && <p className='text-center font-medium'>No todos found</p>}
                    {todos.length > 0 && todos.map((todo, index) => (
                        <Fragment key={index}>
                            <SingleTodo
                                todo={todo}
                                todos={todos}
                                handleConfirmModal={handleConfirmModal}
                                isSub={false}
                                setOpenTodo={setOpenTodo}
                                openTodo={openTodo}
                                setIsSubModalOpen={setIsSubModalOpen}
                            />
                        </Fragment>
                    ))
                    }
                </div >
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onSubmit={handleDeleteTodo}
                    title='Are you sure want to delete?'
                />
            </div >
            {
                isSubModalOpen && (
                    <div className="w-1/2 pl-5">
                        <SubTodos
                            isOpen={isSubModalOpen}
                            onClose={handleCloseSubModal}
                            todo={openTodo}
                            allTodos={allTodos}
                            updateOnCheckbox={updateOnCheckbox}
                        />
                    </div>
                )
            }
        </div>
    );
};

TodoApp.propTypes = {
    sUsername: PropTypes.string.isRequired
}

export default TodoApp;
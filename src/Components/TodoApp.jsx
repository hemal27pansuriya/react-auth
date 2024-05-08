import { useEffect, useState, Fragment } from 'react';
import ConfirmModal from './ConfirmModal';
import { v4 as uuidv4 } from "uuid";
import SubTodos from './SubTodos';
import SingleTodo from './SingleTodo';
import { useNavigate, useSearchParams } from 'react-router-dom';

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [allTodos, setAllTodos] = useState([])
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [openTodo, setOpenTodo] = useState(null)
    const [validateMsg, setValidateMsg] = useState('')
    const [deletingId, setDeletingId] = useState(null)
    const [todoNew, setTodoNew] = useState('')
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const [sUsername, setsUsername] = useState('')

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser')
        if (!currentUser) {
            navigate('/login')
        } else {
            setsUsername(currentUser)
        }
    }, [])

    useEffect(() => {
        const todoData = JSON.parse(localStorage.getItem('todoData')) || [];
        const currTodos = todoData.filter((todo) => todo.sUsername === sUsername);
        setTodos(currTodos)
        setAllTodos(todoData)
    }, [sUsername])


    useEffect(() => {
        const todoId = searchParams.get('todoId');
        if (todoId) {
            const id = todoId
            const todoData = JSON.parse(localStorage.getItem('todoData')) || [];
            const currTodo = todoData.find((todo) => todo.iId === id);
            setAllTodos(todoData)
            setOpenTodo(currTodo)
            setIsSubModalOpen(true)
        } else {
            setOpenTodo(null)
            setIsSubModalOpen(false)
        }
    }, [searchParams]);

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

    const handleCloseSubModal = () => {
        setIsSubModalOpen(false)
        setOpenTodo(null)
        navigate('/todo-app', { replace: true });
    }

    const updateOnCheckbox = () => {
        const todoData = JSON.parse(localStorage.getItem('todoData')) || [];
        const currTodos = todoData.filter((todo) => todo.sUsername === sUsername);
        setTodos(currTodos)
        setAllTodos(todoData)
    }

    const handleLogout = () => {
        localStorage.removeItem('currentUser')
        setsUsername('')
        return navigate('/login')
    }

    return (
        <div className="h-screen w-full flex flex-col">
            <nav className="bg-blue-500 p-4 flex justify-between items-center">
                <div className="text-white text-2xl font-semibold">Hello, {sUsername}</div>
                <button onClick={handleLogout} className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded">
                    Logout
                </button>
            </nav>
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
                                    className="bg-yellow-900 text-white rounded-lg px-4 py-2 hover:bg-yellow-700 h-10"
                                >
                                    Add
                                </button>
                            </div>
                            {validateMsg && <p className='text-red-600 font-semibold text-xs mt-2'>{validateMsg}</p>}
                        </div>
                    </form>
                    <div
                        className='overflow-y-auto'
                        style={{ height: '65vh' }}
                    >
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
                                        updateOnCheckbox={updateOnCheckbox}
                                        setSearchParams={setSearchParams}
                                    />
                                </Fragment>
                            ))
                            }
                        </div>
                    </div>
                    <ConfirmModal
                        isOpen={isConfirmModalOpen}
                        onClose={() => setIsConfirmModalOpen(false)}
                        onSubmit={handleDeleteTodo}
                        title='Are you sure want to delete?'
                    />
                </div>
                {
                    isSubModalOpen && (
                        <div className="w-1/2 pl-5">
                            <SubTodos
                                isOpen={isSubModalOpen}
                                onClose={handleCloseSubModal}
                                todo={openTodo}
                                allTodos={allTodos}
                                updateOnCheckboxMain={updateOnCheckbox}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default TodoApp;
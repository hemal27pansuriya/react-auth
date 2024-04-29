import { useEffect, useState, useRef } from 'react';
import PropTypes from "prop-types";
import { v4 as uuidv4 } from 'uuid'

const SubTodoModal = ({ isOpen, onClose, todo }) => {
    const [validateMsg, setValidateMsg] = useState('')
    const [subTodoText, setSubTodoText] = useState('')
    const [subTodo, setSubTodo] = useState({})
    const [subTodoNew, setSubTodoNew] = useState('')
    const [editingSTId, setEditingSTId] = useState(null)
    const [allTodos, setAllTodos] = useState(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if (todo) {
            const latestTodos = JSON.parse(localStorage.getItem('todoData'))
            const latestSubTodo = latestTodos.find(t => t.iId === todo.iId && t.sUsername === todo.sUsername)
            setSubTodo({
                ...latestSubTodo
            })
            setAllTodos(latestTodos)
        }
    }, [todo])

    const handleAddSubTodo = (e) => {
        e.preventDefault()
        if (!subTodoNew) return setValidateMsg('Please enter a value')
        const newST = { iId: uuidv4(), sTitle: subTodoNew, bCompleted: false }
        const updatedTodos = allTodos.map((t) => {
            if (t.iId === subTodo.iId) {
                const aSubTodos = t.aSubTodos || []
                aSubTodos.push(newST)
                return {
                    ...t,
                    aSubTodos
                }
            }
            return t
        })
        localStorage.setItem('todoData', JSON.stringify(updatedTodos))
        setSubTodo(updatedTodos.find(t => t.iId === subTodo.iId && t.sUsername === subTodo.sUsername));
        setSubTodoNew('')
        setAllTodos(updatedTodos)
    }

    const handleSubTodoCheckboxChange = (iId) => {
        let newTodos = allTodos.map((t) =>
            t.iId === subTodo.iId ? {
                ...t,
                aSubTodos: t.aSubTodos.map((st) =>
                    st.iId === iId ? { ...st, bCompleted: !st.bCompleted } : st
                )
            } : t
        );
        const newST = newTodos.find(t => t.iId === subTodo.iId && t.sUsername === subTodo.sUsername).aSubTodos
        const allChecked = newST.every(st => st.bCompleted)
        newTodos = newTodos.map((t) =>
            t.iId === subTodo.iId ? {
                ...t,
                bCompleted: allChecked
            } : t
        );
        const curr = {
            ...subTodo,
            aSubTodos: newST
        }
        setSubTodo(curr);
        setAllTodos(newTodos)
        localStorage.setItem('todoData', JSON.stringify(newTodos));
    };

    const handleSubTodoEdit = (iId, value) => {
        setEditingSTId(iId);
        setSubTodoText(value)
    }

    const handleSubTodoSave = (iId) => {
        const newTodos = allTodos.map((t) =>
            t.iId === subTodo.iId ? {
                ...t,
                aSubTodos: t.aSubTodos.map((st) =>
                    st.iId === iId ? { ...st, sTitle: subTodoText } : st
                )
            } : t
        );
        const curr = {
            ...subTodo,
            aSubTodos: newTodos.find(t => t.iId === subTodo.iId).aSubTodos
        }
        setSubTodo(curr);
        setAllTodos(newTodos)
        setEditingSTId(null)
        setSubTodoText('')
        localStorage.setItem('todoData', JSON.stringify(newTodos));
    }

    const handleSubTodoDelete = (iId) => {
        const newTodos = allTodos.map((t) =>
            t.iId === subTodo.iId ? {
                ...t,
                aSubTodos: t.aSubTodos.filter(st => st.iId !== iId)
            } : t
        );
        const curr = {
            ...subTodo,
            aSubTodos: newTodos.find(t => t.iId === subTodo.iId).aSubTodos
        }
        setSubTodo(curr);
        setAllTodos(newTodos)
        localStorage.setItem('todoData', JSON.stringify(newTodos));
    }

    useEffect(() => {
        if (inputRef.current && editingSTId !== null) {
            inputRef.current.focus();
        }
    }, [editingSTId]);

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h2 className="text-lg font-semibold">
                            {subTodo.sTitle}
                        </h2>
                        <div className="flex justify-between items-center mb-4">
                            <p className='text-sm'>Sub Todos</p>
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setValidateMsg('')
                                    setSubTodoNew('')
                                    setEditingSTId(null)
                                    onClose();
                                }}
                            >
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        {subTodo.aSubTodos && subTodo.aSubTodos.length > 0 &&
                            subTodo.aSubTodos.map((subTodo, i) => (
                                <div
                                    key={i}
                                    className='flex'
                                >
                                    <input
                                        type="checkbox"
                                        checked={subTodo.bCompleted}
                                        onChange={() =>
                                            handleSubTodoCheckboxChange(subTodo.iId)
                                        }
                                        className="mr-2 cursor-pointer"
                                    />
                                    {editingSTId === subTodo.iId ? <input
                                        type="text"
                                        ref={inputRef}
                                        value={subTodoText}
                                        onChange={e => setSubTodoText(e.target.value)}
                                        className={`mr-3 border border-gray-300 rounded-lg px-4 py-2 w-full mb-4 ${subTodo.bCompleted ? 'line-through text-gray-500' : ''}`}
                                    /> : <span
                                        className={`${todo.bCompleted ? 'line-through text-gray-500' : ''} cursor-pointer`}
                                    >
                                        {subTodo.sTitle}
                                    </span>}
                                    {editingSTId === subTodo.iId ? <button
                                        className='bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 h-10'
                                        onClick={() => handleSubTodoSave(subTodo.iId)}
                                    >
                                        Save
                                    </button> : <>
                                        <button
                                            className='bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 h-10'
                                            onClick={() => handleSubTodoEdit(subTodo.iId, subTodo.sTitle)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className='ml-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 h-10'
                                            onClick={() => handleSubTodoDelete(subTodo.iId)}
                                        >
                                            Delete
                                        </button>
                                    </>}
                                </div>
                            ))
                        }
                        {(subTodo.aSubTodos && subTodo.aSubTodos.length < 3 || !subTodo.aSubTodos) &&
                            <form onSubmit={handleAddSubTodo}>
                                <div className='flex'>
                                    <input
                                        type="text"
                                        value={subTodoNew}
                                        onChange={(e) => {
                                            setValidateMsg('')
                                            setSubTodoNew(e.target.value)
                                        }}
                                        className="mr-3 border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
                                        placeholder="Enter todo..."
                                    />
                                    <button
                                        type='submit'
                                        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 h-10"
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>}
                        {validateMsg && <p className='text-red-500 text-xs mb-1'>{validateMsg}</p>}
                    </div>
                </div >
            )}
        </>
    );
};

SubTodoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    todo: PropTypes.object
}

export default SubTodoModal;
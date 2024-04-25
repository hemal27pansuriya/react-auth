import { useEffect, useState } from 'react';
import PropTypes from "prop-types";

const SubTodoModal = ({ isOpen, onClose, todo, allTodos }) => {
    const [validateMsg, setValidateMsg] = useState('')
    const [subTodoText, setSubTodoText] = useState('')
    const [subTodo, setSubTodo] = useState({})
    useEffect(() => {
        setSubTodo({
            ...todo
        })
    }, [todo])

    const handleAddSubTodo = (subTodo) => {
        if (!subTodo) return setValidateMsg('Please enter a value')
        const updatedTodos = allTodos.map((t) => {
            if (t.iId === todo.iId) {
                const aSubTodos = t.aSubTodos || []
                aSubTodos.push({ iId: todo?.aSubTodos?.length + 1 || 1, sTitle: subTodo, bCompleted: false })
                return {
                    ...t,
                    aSubTodos
                }
            }
            return t
        })
        console.log('212121--', updatedTodos);
        localStorage.setItem('todoData', JSON.stringify(updatedTodos))
        setSubTodoText('')
        onClose()
    }

    const handleSubTodoCheckboxChange = () => {
        const newTodos = allTodos.map((t) =>
            t.iId === subTodo.iId ? {
                ...t,
                aSubTodos: t.aSubTodos.map((st) =>
                    st.sTitle === subTodo.sTitle ? { ...st, bCompleted: !st.bCompleted } : st
                )
            } : t
        );
        setSubTodo({
            ...subTodo,
            bCompleted: !subTodo.bCompleted
        });
        localStorage.setItem('todoData', JSON.stringify(newTodos));
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h2 className="text-lg font-semibold">
                            {todo.sTitle}
                        </h2>
                        <div className="flex justify-between items-center mb-4">
                            <p className='text-sm'>Sub Todos</p>
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setValidateMsg('')
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
                        {subTodo.aSubTodos && subTodo.aSubTodos.length &&
                            subTodo.aSubTodos.map((subTodo, i) => (
                                <div
                                    key={i}
                                    className='flex'
                                >
                                    <input
                                        type="checkbox"
                                        checked={subTodo.bCompleted}
                                        onChange={() =>
                                            handleSubTodoCheckboxChange()
                                        }
                                        className="mr-2"
                                    />
                                    <input
                                        type="text"
                                        value={subTodo.sTitle}
                                        className={`mr-3 border border-gray-300 rounded-lg px-4 py-2 w-full mb-4 ${todo.bCompleted ? 'line-through text-gray-500' : ''}`}
                                    />
                                </div>
                            ))
                        }
                        <div className='flex'>
                            <input
                                type="text"
                                value={subTodoText}
                                onChange={(e) => {
                                    setValidateMsg('')
                                    setSubTodoText(e.target.value)
                                }}
                                className="mr-3 border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
                                placeholder="Enter todo..."
                            />
                            <button
                                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 h-10"
                                onClick={() => handleAddSubTodo(subTodo)}
                            >
                                Add
                            </button>
                        </div>
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
    todo: PropTypes.object,
    allTodos: PropTypes.array
}

export default SubTodoModal;
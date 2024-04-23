import { useState } from 'react';
import PropTypes from "prop-types";

const SubTodoModal = ({ isOpen, onClose, todo, allTodos }) => {
    const [validateMsg, setValidateMsg] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        onClose();
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
                        {todo.aSubTodos && todo.aSubTodos.length &&
                            todo.aSubTodos.map((subTodo, index) => {
                                <input
                                    type="checkbox"
                                    checked={todo.bCompleted}
                                    onChange={() =>
                                        console.log('yes')
                                    }
                                    className="mr-2"
                                />
                            })
                        }
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value="hemal"
                                onChange={() => {
                                    setValidateMsg('')
                                }}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
                                placeholder="Enter todo..."
                            />
                            {validateMsg && <p className='text-red-500 text-xs mb-1'>{validateMsg}</p>}
                        </form>
                    </div>
                </div>
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
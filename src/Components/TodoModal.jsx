import { useState, useRef, useEffect } from 'react';
import PropTypes from "prop-types";

const TodoModal = ({ isOpen, onClose, onSubmit, initialValue = '' }) => {
    const [value, setValue] = useState(initialValue);
    const [validateMsg, setValidateMsg] = useState('')
    const inputRef = useRef()

    useEffect(() => {
        setValue(initialValue)
        if (isOpen) {
            inputRef.current.focus();
        }
    }, [initialValue, isOpen])


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value) return setValidateMsg('Please enter a value')
        onSubmit(value);
        setValue('');
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                {initialValue ? 'Update Todo' : 'Add Todo'}
                            </h2>
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
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                ref={inputRef}
                                value={value}
                                onChange={(e) => {
                                    setValidateMsg('')
                                    setValue(e.target.value)
                                }}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
                                placeholder="Enter todo..."
                            />
                            {validateMsg && <p className='text-red-500 text-xs mb-1'>{validateMsg}</p>}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
                                >
                                    {initialValue ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

TodoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialValue: PropTypes.string
}

export default TodoModal;
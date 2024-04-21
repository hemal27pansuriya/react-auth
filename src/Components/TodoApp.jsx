import { useEffect, useState } from 'react';
import TodoModal from './TodoModal';
import PropTypes from 'prop-types'
import ConfirmModal from './ConfirmModal';

const TodoApp = ({ sUsername }) => {
    const [todos, setTodos] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [allTodos, setAllTodos] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    useEffect(() => {
        const todoData = JSON.parse(localStorage.getItem('todoData')) || [];
        const currTodos = todoData.filter((todo) => todo.sUsername === sUsername);
        setTodos(currTodos);
        setAllTodos(todoData)
    }, [sUsername])

    const handleAddTodo = (text) => {
        const iId = todos.length ? todos.length + 1 : 1;
        const newTodo = {
            sTitle: text,
            bCompleted: false,
            sUsername,
            iId
        }
        setTodos([...todos, newTodo]);
        const updatedTodos = [...allTodos, newTodo];
        setAllTodos(updatedTodos)
        localStorage.setItem('todoData', JSON.stringify(updatedTodos));
    };

    const handleUpdateTodo = (text) => {
        const newTodos = todos.map((todo) =>
            todo === editingTodo ? { ...todo, sTitle: text } : todo
        );
        const newAllTodos = allTodos.map((todo) =>
            todo === editingTodo ? { ...todo, sTitle: text } : todo
        )
        setTodos(newTodos);
        setAllTodos(newAllTodos);
        localStorage.setItem('todoData', JSON.stringify(newAllTodos))
        setEditingTodo(null);
    };

    const handleDeleteTodo = () => {
        const newTodos = todos.filter((todo) => todo !== editingTodo);
        const newAllTodos = allTodos.filter((todo) => todo !== editingTodo);
        setTodos(newTodos);
        setAllTodos(newAllTodos);
        localStorage.setItem('todoData', JSON.stringify(newAllTodos))
        setEditingTodo(null);
    }

    const handleOpenModal = (todo = null) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };

    const handleConfirmModal = (todo = null) => {
        setEditingTodo(todo);
        setIsConfirmModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTodo(null);
    };

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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Todo App</h1>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            checked={todo.bCompleted}
                            onChange={() =>
                                handleCheckbox(todo.iId)
                            }
                            className="mr-2"
                        />
                        <span
                            className={`${todo.bCompleted ? 'line-through text-gray-500' : ''}`}
                        >
                            {todo.sTitle}
                        </span>
                        <button
                            type="button"
                            className="ml-10 text-blue-500 hover:text-blue-600"
                            onClick={() => handleOpenModal(todo)}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="ml-10 text-blue-500 hover:text-blue-600"
                            onClick={() => handleConfirmModal(todo, true)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <button
                type="button"
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={() => handleOpenModal()}
            >
                Add Todo
            </button>
            <TodoModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
                initialValue={editingTodo ? editingTodo.sTitle : ''}
            />
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onSubmit={handleDeleteTodo}
                title='Are you sure want to delete?'
            />
        </div>
    );
};

TodoApp.propTypes = {
    sUsername: PropTypes.string.isRequired
}

export default TodoApp;
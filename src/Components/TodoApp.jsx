import { useEffect, useState } from 'react';
import TodoModal from './TodoModal';
import PropTypes from 'prop-types'

const TodoApp = ({ sUsername }) => {
    const [todos, setTodos] = useState([]);
    const [allTodos, setAllTodos] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);

    useEffect(() => {
        const todoData = JSON.parse(localStorage.getItem('todoData')) || [];
        const currTodos = todoData.filter((todo) => todo.sUsername === sUsername);
        setTodos(currTodos);
        setAllTodos(todoData)
    }, [])

    const handleAddTodo = (text) => {
        const iId = todos.length ? todos.length + 1 : 1;
        const newTodo = {
            sTitle: text,
            bCompleted: false,
            sUsername,
            iId
        }
        console.log('26', newTodo);
        setTodos([...todos, newTodo]);
        setAllTodos([...allTodos, newTodo]);
        console.log('29', { todos, allTodos });
        localStorage.setItem('todoData', JSON.stringify(allTodos));
    };

    const handleUpdateTodo = (text) => {
        const newTodos = todos.map((todo) =>
            todo === editingTodo ? { ...todo, text } : todo
        );
        setTodos(newTodos);
        setEditingTodo(null);
    };

    const handleOpenModal = (todo = null) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTodo(null);
    };

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
                                setTodos(
                                    todos.map((t, i) =>
                                        i === index ? { ...t, bCompleted: !t.bCompleted } : t
                                    )
                                )
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
                            className="ml-auto text-blue-500 hover:text-blue-600"
                            onClick={() => handleOpenModal(todo)}
                        >
                            Edit
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
        </div>
    );
};

TodoApp.propTypes = {
    sUsername: PropTypes.string.isRequired
}

export default TodoApp;
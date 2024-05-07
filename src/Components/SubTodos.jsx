import { useEffect, useState, useRef, Fragment } from 'react';
import PropTypes from "prop-types";
import { v4 as uuidv4 } from 'uuid';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, IconButton, Box } from "@mui/material";
import SingleTodo from './SingleTodo';

const SubTodos = ({ onClose, todo, updateOnCheckboxMain }) => {
    const [validateMsg, setValidateMsg] = useState('')
    const [subTodo, setSubTodo] = useState({})
    const [subTodoNew, setSubTodoNew] = useState('')
    const [editingSTId, setEditingSTId] = useState(null)
    const [allTodos, setAllTodos] = useState(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if (todo) {
            const latestTodos = JSON.parse(localStorage.getItem('todoData'))
            const latestSubTodo = latestTodos.find(t => t.iId === todo.iId)
            setSubTodo({
                ...latestSubTodo
            })
            setAllTodos(latestTodos)
        }
        setSubTodoNew('')
        setEditingSTId(null)
    }, [todo])

    const handleAddSubTodo = (e) => {
        e.preventDefault()
        if (!subTodoNew) return setValidateMsg('Please enter a value')
        const newST = { iId: uuidv4(), sTitle: subTodoNew, bCompleted: false }
        let updatedTodos = allTodos.map((t) => {
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
        const newSubTodos = updatedTodos.find(t => t.iId === subTodo.iId).aSubTodos
        const allChecked = newSubTodos.every(st => st.bCompleted)
        updatedTodos = updatedTodos.map((t) =>
            t.iId === subTodo.iId ? {
                ...t,
                bCompleted: allChecked
            } : t
        );

        const curr = {
            ...subTodo,
            aSubTodos: newSubTodos
        }
        localStorage.setItem('todoData', JSON.stringify(updatedTodos))
        setSubTodo(curr);
        setSubTodoNew('')
        setAllTodos(updatedTodos)
        updateOnCheckbox()
    }

    const updateOnCheckbox = () => {
        const todoData = JSON.parse(localStorage.getItem('todoData')) || [];
        const currTodo = todoData.find((t) => t.iId === todo.iId);
        setSubTodo(currTodo)
        setAllTodos(todoData)
        updateOnCheckboxMain()
    }

    useEffect(() => {
        if (inputRef.current && editingSTId !== null) {
            inputRef.current.focus();
        }
    }, [editingSTId]);

    return (
        <>
            <h1 className="text-2xl font-bold mb-4 text-center">Sub Todos</h1>
            <div
                className='w-full relative'
            >
                <div className='bg-texture p-4 pr-10 rounded-t-lg'>
                    <span className='patrick-hand-regular'>
                        {subTodo.sTitle}
                    </span>
                </div>
                <IconButton onClick={() => {
                    setValidateMsg('')
                    setSubTodoNew('')
                    setEditingSTId(null)
                    onClose();
                }} sx={{ position: 'absolute', right: '8px', top: '8px' }}>
                    <CloseIcon />
                </IconButton>
                <div
                    className='px-6 py-4 bg-white shadow-lg rounded-b-lg'
                >
                    {(!subTodo.aSubTodos || (subTodo.aSubTodos && subTodo.aSubTodos.length <= 0)) && <p className='text-center font-medium'>No sub todos found</p>}
                    {subTodo.aSubTodos && subTodo.aSubTodos.length > 0 &&
                        subTodo.aSubTodos.map((st, index) => (
                            <Fragment key={index}>
                                <SingleTodo
                                    mainTodoId={subTodo.iId}
                                    todo={st}
                                    isSub={true}
                                    updateOnCheckbox={updateOnCheckbox}
                                />
                            </Fragment>
                        ))
                    }
                    {(subTodo.aSubTodos && subTodo.aSubTodos.length < 3 || !subTodo.aSubTodos) &&
                        <form onSubmit={handleAddSubTodo}>
                            <Box sx={{ display: 'flex', marginBottom: '16px', marginTop: '15px' }}>
                                <TextField
                                    value={subTodoNew}
                                    onChange={(e) => {
                                        setValidateMsg('')
                                        setSubTodoNew(e.target.value)
                                    }}
                                    variant="outlined"
                                    size="small"
                                    placeholder="Enter todo..."
                                    fullWidth
                                    sx={{ marginRight: '10px' }}
                                    InputProps={{
                                        style: {
                                            borderRadius: '7px',
                                            fontFamily: '"Patrick Hand", cursive',
                                            fontWeight: 400,
                                            fontStyle: 'normal',
                                            fontSize: '1.3rem',
                                            height: '40px'
                                        },
                                    }}
                                />
                                <button
                                    type='submit'
                                    className="bg-yellow-900 text-white rounded-lg px-4 py-2 hover:bg-yellow-800 h-10"
                                >
                                    Add
                                </button>
                            </Box>
                        </form>}
                    {validateMsg && <p className='text-red-500 text-xs'>{validateMsg}</p>}
                </div>
            </div>
        </>
    )
};

SubTodos.propTypes = {
    onClose: PropTypes.func.isRequired,
    todo: PropTypes.object,
    updateOnCheckboxMain: PropTypes.func.isRequired,
}

export default SubTodos;
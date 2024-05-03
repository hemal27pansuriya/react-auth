import { useEffect, useState, useRef } from 'react';
import PropTypes from "prop-types";
import { v4 as uuidv4 } from 'uuid';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, IconButton, Box } from "@mui/material";

const SubTodos = ({ isOpen, onClose, todo, updateOnCheckbox }) => {
    const [validateMsg, setValidateMsg] = useState('')
    const [subTodoText, setSubTodoText] = useState('')
    const [subTodo, setSubTodo] = useState({})
    const [subTodoNew, setSubTodoNew] = useState('')
    const [editingSTId, setEditingSTId] = useState(null)
    const [allTodos, setAllTodos] = useState(null)
    const inputRef = useRef(null)
    console.log('object sub todos -----')
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

    const handleSubTodoCheckboxChange = (iId) => {
        let newTodos = allTodos.map((t) =>
            t.iId === subTodo.iId ? {
                ...t,
                aSubTodos: t.aSubTodos.map((st) =>
                    st.iId === iId ? { ...st, bCompleted: !st.bCompleted } : st
                )
            } : t
        );
        const newST = newTodos.find(t => t.iId === subTodo.iId).aSubTodos
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
        updateOnCheckbox()
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
        updateOnCheckbox()
    }

    const handleSubTodoDelete = (iId) => {
        let newTodos = allTodos.map((t) =>
            t.iId === subTodo.iId ? {
                ...t,
                aSubTodos: t.aSubTodos.filter(st => st.iId !== iId)
            } : t
        );
        const newST = newTodos.find(t => t.iId === subTodo.iId).aSubTodos
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
        setSubTodo(curr)
        setAllTodos(newTodos)
        localStorage.setItem('todoData', JSON.stringify(newTodos));
        updateOnCheckbox()
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
                open={isOpen}
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
                    {subTodo.aSubTodos && subTodo.aSubTodos.length <= 0 && <p className='text-center font-medium'>No sub todos found</p>}
                    {subTodo.aSubTodos && subTodo.aSubTodos.length > 0 &&
                        subTodo.aSubTodos.map((st, index) => (
                            <Fragment key={index}>
                                <SingleTodo
                                    todo={st}
                                    isSub={true}
                                    updateOnCheckbox={updateOnCheckbox}
                                />
                            </Fragment>
                            {/* <div
                                key={index}
                                className={`flex items-center ${index > 0 ? 'mt-2' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={st.bCompleted}
                                    onChange={() =>
                                        handleSubTodoCheckboxChange(st.iId)
                                    }
                                    className="mr-4 h-5 w-7 cursor-pointer border border-black appearance-none checkbox bg-white rounded-md checked:bg-yellow-900 checked:border-transparent focus:outline-none"
                                />
                                {editingSTId === st.iId ? <input
                                    type="text"
                                    ref={inputRef}
                                    value={subTodoText}
                                    onChange={e => setSubTodoText(e.target.value)}
                                    className={`box-border mr-3 mt-1 border border-gray-300 rounded-lg px-4 py-2 w-full patrick-hand-regular h-10`}
                                /> : (
                                    <span
                                        className={`px-3 py-2 rounded-md p-2 ${st.bCompleted ? 'line-through text-gray-700' : ''} patrick-hand-regular cursor-pointer w-full`}
                                        onClick={() =>
                                            handleSubTodoCheckboxChange(st.iId)
                                        }
                                    >
                                        {st.sTitle}
                                    </span>
                                )}
                                {editingSTId === st.iId ? <>
                                    <button
                                        className='bg-yellow-900 text-white rounded-lg px-4 py-2 hover:bg-yellow-700'
                                        onClick={() => handleSubTodoSave(st.iId)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="ml-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                        onClick={() => handleSubTodoDelete(st.iId)}
                                    >
                                        Delete
                                    </button>
                                </> : <>
                                    <button
                                        type="button"
                                        className="ml-5 bg-yellow-900 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                                        onClick={() => handleSubTodoEdit(st.iId, st.sTitle)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="ml-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                        onClick={() => handleSubTodoDelete(st.iId)}
                                    >
                                        Delete
                                    </button>
                                </>}
                            </div> */}
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
            </div >
        </>
    )
};

SubTodos.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    todo: PropTypes.object,
    updateOnCheckbox: PropTypes.func.isRequired,
}

export default SubTodos;
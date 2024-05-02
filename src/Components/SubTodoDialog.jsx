import { useEffect, useState, useRef } from 'react';
import PropTypes from "prop-types";
import { v4 as uuidv4 } from 'uuid';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, DialogContent, TextField, Checkbox, FormControlLabel, IconButton, Box } from "@mui/material";

const SubTodoDialog = ({ isOpen, onClose, todo, updateOnCheckbox }) => {
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
        <Dialog
            open={isOpen}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle className='bg-texture' sx={{ backgroundColor: '#3f51b5', paddingRight: '45px' }}>
                <span className='patrick-hand-regular'>
                    {subTodo.sTitle}
                </span>
            </DialogTitle>
            <IconButton onClick={() => {
                setValidateMsg('')
                setSubTodoNew('')
                setEditingSTId(null)
                onClose();
            }} sx={{ position: 'absolute', right: '8px', top: '8px' }}>
                <CloseIcon />
            </IconButton>
            <DialogContent>
                {subTodo.aSubTodos && subTodo.aSubTodos.length > 0 &&
                    subTodo.aSubTodos.map((st, i) => (
                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={st.bCompleted}
                                        onChange={() => handleSubTodoCheckboxChange(st.iId)}
                                        color="primary"
                                    />
                                }
                                label={<span className={`patrick-hand-regular ${st.bCompleted ? 'line-through text-gray-700' : ''}`}>{editingSTId !== st.iId ? st.sTitle : ''}</span>}
                            />
                            {editingSTId === st.iId ? (
                                <TextField
                                    value={subTodoText}
                                    onChange={e => setSubTodoText(e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    sx={{ marginRight: '8px', flexGrow: 1 }}
                                    InputProps={{
                                        style: {
                                            fontFamily: '"Patrick Hand", cursive',
                                            fontWeight: 400,
                                            fontStyle: 'normal',
                                            fontSize: '1.3rem',
                                        }
                                    }}
                                />
                            ) : null}
                            {editingSTId === st.iId ? (
                                <button
                                    className='bg-yellow-900 text-white rounded-lg px-4 py-2 hover:bg-yellow-700'
                                    onClick={() => handleSubTodoSave(st.iId)}
                                >
                                    Save
                                </button>
                            ) : (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
                                </Box>
                            )}
                        </Box>
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
            </DialogContent>
        </Dialog >
    );
};

SubTodoDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    todo: PropTypes.object,
    updateOnCheckbox: PropTypes.func.isRequired,
}

export default SubTodoDialog;
import { useState } from 'react'
import { validatePassword, validateUsername } from '../utilities.services'
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate()
    const [loginData, setLoginData] = useState({
        sUsername: '',
        sPassword: ''
    })
    const [validateMsg, setValidateMsg] = useState({
        sUsernameMsg: '',
        sPasswordMsg: ''
    })

    const validateRegData = (loginData) => {
        const { sPassword, sUsername } = loginData
        setValidateMsg({
            sUsernameMsg: '',
            sEmailMsg: '',
            sMobileMsg: '',
            sPasswordMsg: ''
        })
        let isInvalid = false
        if (!sUsername || !validateUsername(sUsername)) {
            console.log('username');
            setValidateMsg({
                ...validateMsg,
                sUsernameMsg: 'Username is invalid'
            })
            isInvalid = true
        }
        if (!sPassword || !validatePassword(sPassword)) {
            console.log('password');
            setValidateMsg({
                ...validateMsg,
                sPasswordMsg: 'Password is invalid'
            })
            isInvalid = true
        }
        console.log('055edfc', validateMsg);
        return !isInvalid
    }

    const handleLogin = (e) => {
        e.preventDefault()
        const valRes = validateRegData(loginData)
        if (!valRes) return
        const usersData = JSON.parse(localStorage.getItem('usersData')) || []
        const isExists = usersData.find(user => user.sUsername === loginData.sUsername && user.sPassword === loginData.sPassword)
        if (!isExists) {
            alert('User not exists')
            return navigate('/register')
        }
        alert('Login successful')
        localStorage.setItem('currentUser', loginData.sUsername)
        navigate('/dashboard')
        console.log('object123', loginData);
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                Username: <input type="text" onChange={e => setLoginData({ ...loginData, sUsername: e.target.value })} value={loginData.sUsername} /><br />
                {validateMsg.sUsernameMsg && <p className='validate-msg'>{validateMsg.sUsernameMsg}</p>}
                Password: <input type="password" onChange={e => setLoginData({ ...loginData, sPassword: e.target.value })} value={loginData.sPassword} /><br />
                {validateMsg.sPasswordMsg && <p className='validate-msg'>{validateMsg.sPasswordMsg}</p>}
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default Login
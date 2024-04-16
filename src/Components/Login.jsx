import { useEffect, useState, useRef } from 'react'
import { validatePassword, validateUsername } from '../utilities.services'
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate()
    const inputRef = useRef()
    const [loginData, setLoginData] = useState({
        sUsername: '',
        sPassword: ''
    })
    const [validateMsg, setValidateMsg] = useState({
        sUsernameMsg: '',
        sPasswordMsg: ''
    })

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser')
        if (currentUser) {
            navigate('/dashboard')
        } else {
            inputRef.current.focus()
        }
    }, [])

    const validateLoginData = (loginData) => {
        const { sPassword, sUsername } = loginData
        setValidateMsg(() => {
            return {
                sUsername: '',
                sEmail: '',
                sMobile: '',
                sPassword: ''
            }

        })
        let isInvalid = false
        if (!sUsername || !validateUsername(sUsername)) {
            setValidateMsg((prev) => {
                return {
                    ...prev,
                    sUsername: 'Username is invalid'
                }
            })
            isInvalid = true
        }
        if (!sPassword || !validatePassword(sPassword)) {
            setValidateMsg((prev) => {
                return {
                    ...prev,
                    sPassword: 'Password is invalid'
                }
            })
            isInvalid = true
        }
        return !isInvalid
    }

    const handleLogin = (e) => {
        e.preventDefault()
        const valRes = validateLoginData(loginData)
        if (!valRes) return
        const usersData = JSON.parse(localStorage.getItem('usersData')) || []
        const isExists = usersData.find(user => user.sUsername === loginData.sUsername && user.sPassword === loginData.sPassword)
        if (!isExists) {
            return alert('User not exists')
        }
        alert('Login successful')

        localStorage.setItem('currentUser', loginData.sUsername)
        navigate('/dashboard')
    }

    const handleInputChange = (e, field) => {
        setValidateMsg({
            ...validateMsg,
            [field]: ''
        })
        setLoginData({ ...loginData, [field]: e.target.value })
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Login to your account
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <input
                                    type="text"
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Username"
                                    ref={inputRef}
                                    onChange={e => handleInputChange(e, 'sUsername')}
                                    value={loginData.sUsername}
                                />
                                {validateMsg.sUsername && <p className='text-red-500 text-xs mt-1 mb-1'>{validateMsg.sUsername}</p>}
                            </div>
                            <div>
                                <input
                                    type="password"
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    onChange={e => handleInputChange(e, 'sPassword')}
                                    value={loginData.sPassword}
                                />
                                {validateMsg.sPassword && <p className='text-red-500 text-xs mt-1'>{validateMsg.sPassword}</p>}
                            </div>
                        </div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Login
                        </button>
                    </form>
                    <p className='mt-2 text-center text-sm text-gray-600'>
                        Not registered?
                        <a onClick={() => navigate('/register')} className="font-medium text-indigo-600 hover:text-indigo-500">
                            Register Here
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Login
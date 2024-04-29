import { useEffect, useRef, useState } from 'react'
import { validateEmail, validateMobile, validatePassword, validateUsername } from '../utilities.services'
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate()
  const inputRef = useRef()
  const [regData, setRegData] = useState({
    sUsername: '',
    sEmail: '',
    sMobile: '',
    sPassword: ''
  })
  const [validateMsg, setValidateMsg] = useState({
    sUsername: '',
    sEmail: '',
    sMobile: '',
    sPassword: ''
  })

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      navigate('/dashboard')
      return
    } else {
      inputRef.current.focus()
    }
  }, [])


  const validateRegData = (regData) => {
    const { sEmail, sMobile, sPassword, sUsername } = regData
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
    if (!sEmail || !validateEmail(sEmail)) {
      setValidateMsg((prev) => {
        return {
          ...prev,
          sEmail: 'Email is invalid'
        }
      })
      isInvalid = true
    }
    if (!sMobile || !validateMobile(sMobile)) {
      setValidateMsg((prev) => {
        return {
          ...prev,
          sMobile: 'Mobile is invalid'
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

  const handleInputChange = (e, field) => {
    setValidateMsg({
      ...validateMsg,
      [field]: ''
    })
    setRegData({ ...regData, [field]: e.target.value })
  }


  const handleRegister = (e) => {
    e.preventDefault()
    const valRes = validateRegData(regData)
    if (!valRes) return
    const usersData = JSON.parse(localStorage.getItem('usersData')) || []
    const isExists = usersData.find(user => user.sEmail === regData.sEmail || user.sUsername === regData.sUsername || user.sMobile === regData.sMobile)
    if (isExists) {
      return alert('User already registered')
    }
    const newUser = {
      sEmail: regData.sEmail,
      sMobile: regData.sMobile,
      sPassword: regData.sPassword,
      sUsername: regData.sUsername
    }
    usersData.push(newUser)
    localStorage.setItem('usersData', JSON.stringify(usersData))
    alert('User registration successful!')
    localStorage.setItem('currentUser', newUser.sUsername)
    return navigate('/dashboard')
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign up to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                ref={inputRef}
                onChange={e => handleInputChange(e, 'sUsername')}
                value={regData.sUsername}
              />
              {validateMsg.sUsername && <p className='text-red-500 text-xs mt-1 mb-1'>{validateMsg.sUsername}</p>}
            </div>
            <div>
              <input
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                ref={inputRef}
                onChange={e => handleInputChange(e, 'sEmail')}
                value={regData.sEmail}
              />
              {validateMsg.sEmail && <p className='text-red-500 text-xs mt-1 mb-1'>{validateMsg.sEmail}</p>}
            </div>
            <div>
              <input
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mobile"
                ref={inputRef}
                onChange={e => handleInputChange(e, 'sMobile')}
                value={regData.sMobile}
              />
              {validateMsg.sMobile && <p className='text-red-500 text-xs mt-1 mb-1'>{validateMsg.sMobile}</p>}
            </div>
            <div>
              <input
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={e => handleInputChange(e, 'sPassword')}
                value={regData.sPassword}
              />
              {validateMsg.sPassword && <p className='text-red-500 text-xs mt-1'>{validateMsg.sPassword}</p>}
            </div>
          </div>
          <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Register
          </button>
        </form>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Already registered?
          <a onClick={() => navigate('/register')} className="ml-1 font-medium text-indigo-600 hover:text-indigo-500">
            Login Here
          </a>
        </p>
      </div>
    </div>
  )
}

export default Register
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
      alert('User already registered')
      return navigate('/login')
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
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <form onSubmit={handleRegister} className='justify-self-center'>
        Username: <input type="text" ref={inputRef} onChange={e => handleInputChange(e, 'sUsername')} value={regData.sUsername} /><br />
        {validateMsg.sUsername && <p className='font-small'>{validateMsg.sUsername}</p>}
        Email: <input type="email" onChange={e => handleInputChange(e, 'sEmail')} value={regData.sEmail} /><br />
        {validateMsg.sEmail && <p className='validate-msg'>{validateMsg.sEmail}</p>}
        Mobile: <input type="text" onChange={e => handleInputChange(e, 'sMobile')} value={regData.sMobile} /><br />
        {validateMsg.sMobile && <p className='validate-msg'>{validateMsg.sMobile}</p>}
        Password: <input type="password" onChange={e => handleInputChange(e, 'sPassword')} value={regData.sPassword} /><br />
        {validateMsg.sPassword && <p className='validate-msg'>{validateMsg.sPassword}</p>}
        <button type='submit' className=''>Register</button>
      </form>
      <a style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>Login Here</a>
    </div>
  )
}

export default Register
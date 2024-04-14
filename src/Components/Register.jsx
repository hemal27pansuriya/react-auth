import { useState } from 'react'
import { validateEmail, validateMobile, validatePassword, validateUsername } from '../utilities.services'
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate()
  const [regData, setRegData] = useState({
    sUsername: '',
    sEmail: '',
    sMobile: '',
    sPassword: ''
  })
  const [validateMsg, setValidateMsg] = useState({
    sUsernameMsg: '',
    sEmailMsg: '',
    sMobileMsg: '',
    sPasswordMsg: ''
  })

  const validateRegData = (regData) => {
    const { sEmail, sMobile, sPassword, sUsername } = regData
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
    if (!sEmail || !validateEmail(sEmail)) {
      console.log('email');
      setValidateMsg({
        ...validateMsg,
        sEmailMsg: 'Email is invalid'
      })
      isInvalid = true
    }
    if (!sMobile || !validateMobile(sMobile)) {
      console.log('mobile', sMobile, validateMobile(sMobile));
      setValidateMsg({
        ...validateMsg,
        sMobileMsg: 'Mobile is invalid'
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

  const handleRegister = (e) => {
    e.preventDefault()
    const valRes = validateRegData(regData)
    console.log('valMsg', valRes, validateMsg);
    if (!valRes) return
    const usersData = JSON.parse(localStorage.getItem('usersData')) || []
    const isExists = usersData.find(user => user.sEmail === regData.sEmail || user.sUsername === regData.sUsername || user.sMobile === regData.sMobile)
    if (isExists) {
      alert('User already registered')
      navigate('/login')
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
    navigate('/dashboard')
  }
  return (
    <div>
      <form onSubmit={handleRegister}>
        Username: <input type="text" onChange={e => setRegData({ ...regData, sUsername: e.target.value })} value={regData.sUsername} /><br />
        {validateMsg.sUsernameMsg && <p className='validate-msg'>{validateMsg.sUsernameMsg}</p>}
        Email: <input type="email" onChange={e => setRegData({ ...regData, sEmail: e.target.value })} value={regData.sEmail} /><br />
        {validateMsg.sEmailMsg && <p className='validate-msg'>{validateMsg.sEmailMsg}</p>}
        Mobile: <input type="text" onChange={e => setRegData({ ...regData, sMobile: e.target.value })} value={regData.sMobile} /><br />
        {validateMsg.sMobileMsg && <p className='validate-msg'>{validateMsg.sMobileMsg}</p>}
        Password: <input type="password" onChange={e => setRegData({ ...regData, sPassword: e.target.value })} value={regData.sPassword} /><br />
        {validateMsg.sPasswordMsg && <p className='validate-msg'>{validateMsg.sPasswordMsg}</p>}
        <button type='submit'>Register</button>
      </form>
    </div>
  )
}

export default Register
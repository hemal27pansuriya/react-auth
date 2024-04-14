import { useState } from 'react'

const Login = () => {
    const [loginData, setLoginData] = useState({
        sUsername: '',
        sPassword: ''
    })

    const handleLogin = (e) => {
        e.preventDefault()
        console.log('object123', loginData);
    }
    return (
        <div>
            <form onSubmit={handleLogin}>
                Username: <input type="text" onChange={e => setLoginData({ ...loginData, sUsername: e.target.value })} value={loginData.sUsername} /><br />
                Password: <input type="password" onChange={e => setLoginData({ ...loginData, sPassword: e.target.value })} value={loginData.sPassword} /><br />
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default Login
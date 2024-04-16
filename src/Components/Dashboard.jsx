import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState('')
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      navigate('/login')
    } else {
      setCurrentUser(currentUser)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setCurrentUser('')
    return navigate('/login')
  }
  return (
    <div style={{ display: 'flex' }}>
      <ul className="flex">
        <li className="mr-3">
          <a className="inline-block border border-blue-500 rounded py-1 px-3 bg-blue-500 text-white" href="#">Active Pill</a>
        </li>
        <li className="mr-3">
          <a className="inline-block border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-1 px-3" href="#">Pill</a>
        </li>
        <li className="mr-3">
          <a className="inline-block py-1 px-3 text-gray-400 cursor-not-allowed" href="#">Disabled Pill</a>
        </li>
      </ul>
      <h3>
        Hello {currentUser}
      </h3>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard
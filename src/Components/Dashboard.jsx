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
    <div className="h-screen w-full flex flex-col">
      <nav className="bg-blue-500 p-4 flex justify-between items-center">
        <div className="text-white text-2xl font-semibold">Hello, {currentUser}</div>
        <button onClick={handleLogout} className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded">
          Logout
        </button>
      </nav>
      <main className="flex-1 bg-gray-100 overflow-y-auto p-4">

      </main>
    </div>
  )
}

export default Dashboard
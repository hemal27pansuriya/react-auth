import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to='/login' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import './App.css';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { MyContext } from './MyContext';
import { useState , useEffect } from 'react';
import {v1 as uuidv1} from 'uuid';

// 🆕 Added: React Router imports
import { Routes, Route, useNavigate } from "react-router-dom";

// 🆕 Added: Auth pages
import Login from "./auth/Login";
import Signup from "./auth/Signup";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null); 
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of currthreads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const navigate = useNavigate(); // 🆕 added this--->when someone opens /, they’ll be redirected to /login if no token is found.

// useEffect(() => {
//   const token = localStorage.getItem("token");
//   if (!token && window.location.pathname === "/") {
//     navigate("/login");
//   }
// }, [navigate]);


  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats, 
    allThreads, setAllThreads
  }; //passing values

  return (
    // 🆕 Wrapped entire app in <Router>
      <Routes>
        {/* 🧠 Default Chat App (Home Route) */}
        <Route
          path="/"
          element={
      <div className="app">

        <MyContext.Provider value={providerValues}>
            <Sidebar></Sidebar>
            <ChatWindow></ChatWindow>
        </MyContext.Provider>

      </div>
      }
    />

        {/* 🆕 Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
  );
}

export default App;

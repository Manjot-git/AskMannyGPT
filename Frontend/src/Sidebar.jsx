import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid"; 
import { useNavigate } from "react-router-dom"; 
import blacklogo from './assets/blacklogo.png';

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080"  // remove /api here
    : import.meta.env.VITE_API_URL;

function Sidebar(){
    const navigate = useNavigate();  
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

    const token = localStorage.getItem("token"); //🆕 check login

    const getAllThreads = async () => {
        try {
            if (!token) return; // skip if guest
            const response = await fetch(`${BASE_URL}/api/thread` , {
            headers: { Authorization: `Bearer ${token}` }
            });
            const res = await response.json();
            //threadId, title
            const filterData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            // console.log(filterData);
            setAllThreads(filterData);
        }catch(err) {
            console.log(err);
        }
    };

    useEffect(() =>{
        if (!token) return;
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) =>{
        if (!token) {
        alert("Please log in to view this thread!");
        window.location.href = "/login"; // redirect guest
        return;
    }
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`${BASE_URL}/api/thread/${newThreadId}` , {
            headers: { Authorization: `Bearer ${token}` } // 🆕 include token
            });
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        }catch (err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) =>{
         if (!token) {
            alert("Please log in to delete a thread!");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/thread/${threadId}`, {method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
            });
            const res = await response.json();
            console.log(res);

            //update threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId){
                createNewChat();
            }

        }catch(err) {
            console.log(err);
        }
    }

    return(
        <>
            <section className="sidebar">
                {/* {new chat button} */}
                <button onClick={createNewChat}>
                    <img src={blacklogo} alt="logo-gpt" className="logo" />
                    <span><i className="fa-solid fa-pen-to-square"></i></span>
                </button>

                {/* {history} */}
                <ul className="history">
                    {token ? (

                        allThreads?.map((thread, idx) => (
                            <li key={idx}
                                onClick={(e) => changeThread(thread.threadId)}
                                className={thread.threadId === currThreadId ? "highlighted": " "}
                            >
                                {thread.title}
                                <i className="fa-solid fa-trash"
                                    onClick={(e) => {
                                        e.stopPropagation(); //stop event bubbling
                                        deleteThread(thread.threadId);
                                    }}
                                ></i>
                            </li>
                        ))
                    ) : (
                            <li className="guest-placeholder" onClick={() => navigate("/login")}>
                                <i className="fa-solid fa-user-lock"></i> 
                                <span>Login to view chats</span>
                            </li>
                        )}
                    </ul>

                {/* {sign} */}
                <div className="sign">
                    <p>By Manjot &hearts;</p>
                </div>

            </section>
        </>
    )
}

export default Sidebar;
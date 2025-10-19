import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow(){
    const {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); 

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);

        const options = {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            }) 
        };

        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);

        }catch (err) {
            console.log(err);
        }
        setLoading(false);
    }


    //Apply new chat to prevChats
    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ))
        }
        setPrompt("");
    }, [reply])


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }
    
    return(
        <>
            <div className="chatWindow">
                {/* {navbar} */}
                <div className="navbar">
                    <span>AskMannyGPT  <i className="fa-solid fa-chevron-down"></i></span>
                    <div className="userIconDiv" onClick={handleProfileClick}>
                        <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                    </div>
                </div>
                {/* {Profile dropdown} */}
                {
                    isOpen &&
                    <div className="dropDown">
                        <div className="dropDownItem">
                            <i className="fa-solid fa-cloud-arrow-up"></i> 
                            Upgrade plan
                        </div>
                        <div className="dropDownItem">
                            <i className="fa-solid fa-gear"></i> 
                            Settings
                        </div>
                        <div className="dropDownItem">
                            <i className="fa-solid fa-arrow-right-from-bracket"></i> 
                            Log-Out
                        </div>
                    </div>
                }

                {/* {Chat Area} */}
                <Chat></Chat>

                <ScaleLoader color="#fff" loading={loading}>

                </ScaleLoader>
                {/* {chat input area --messageInbox} */}
                <div className="chatInput">
                    <div className="inputBox">
                        <input placeholder="Ask anything" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}/>

                        <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                    </div>
                    <p className="info">
                        AskMannyGPT can make mistakes. Check important info. See Cookie Preferences.
                    </p>
                </div>
            </div>
        </>
    )
}

export default ChatWindow;
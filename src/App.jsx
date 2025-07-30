//import React from 'react'
import React, { useState, useEffect, useRef } from 'react';
import { ZIM } from 'zego-zim-web';
//import background from "./assets/background.jpg"
import background from "./assets/background.jpg"; 
import './index.css'


function App(){
  const[zimInstance,setZimInstance] = useState(null)
  const[userInfo, setUserInfo] = useState(null)
  const[messageText,setMessageText] = useState(" ")
  const[messages,setMessages] = useState([])
  const [selectedUser, setSelectedUser] = useState("archit")
  const[isLoggedIn, setIsLoggedIn] = useState(false)
  const appID = 1363658523
  const tokenA ="04AAAAAGiJ+PYADLwP4cxFtC2yaljO3QCweLuJYYZ2XDCRGzGO8bL9SwEYWDgcS1KcBrDFn98HZwkM/urrP9TXkDZUWaKocSGC2VEqFaQMGwZAr3PxeXVwxPPri0Rs2ekvQrwNVU/dt/NAtoWmqhMF25qzSK0vEgXYf3OFackMEUpCc96IdIOePNdGXF+kcDUQkkCtrlg8ii74Ml6q0tEbqu5NAx7OLVIRCbl6rckwSnYDFXd7v0UZq4hkJnDOyTAVnfKAp5vlr20B";
  const tokenB = "04AAAAAGiJ+SUADITk66qeoNLP+JgyOACvopfpXkVM8Ig4e4Q++H0aUL2OCCpOgLa7k0oGytK5BK1pb69Sd4UhWzrujY9GiVW26+gFf0yT2Sg5ZdOOBTQqeor//f8H1KNlP/Q5D+e5xxQRHk63GpORrNKngsiAt/zF7YyOLBxXer4R1jkkVrR1GB+XJNLhMHmLedQ87ZNmrlj9b5UnVDvwL3xmqLcZClA3SPXIOZnjoZ1zApaOjCQjGBJ9T/oIwW+AaC/2z2N4CwE="

/*
useRef is a React Hook that gives you a way to store a mutable value that:

doesn’t trigger re-renders when changed

and can be used to access DOM elements directly




*/
  const messageEndRef = useRef(null)
  useEffect(()=>{
    const instance = ZIM.create(appID)
    setZimInstance(instance)
    instance.on('error', function (zim, errorInfo) {
    console.log('error', errorInfo.code, errorInfo.message);
    });

    instance.on('connectionStateChanged', function (zim, { state, event }) {
    console.log('connectionStateChanged', state, event);
    
});

instance.on('peerMessageReceived', function (zim, { messageList}) {
    setMessages(prev=>[...prev,...messageList])
});

instance.on('tokenWillExpire', function (zim, { second }) {
    console.log('tokenWillExpire', second);
    // You can call the renewToken method to renew the token. 
    // To generate a new Token, refer to the Prerequisites.
    zim.renewToken(selectedUser==="archit"?tokenA:tokenB)
        .then(function(){
            console.log("token - renewed")
        })
        .catch(function(err){
           console.log(err)
        })
});
return ()=>{
  instance.destroy()
}
  },[])

  //for scrolling purposes
useEffect(()=>{
  if(messageEndRef.current){
    messageEndRef.current.scrollIntoView({behavior:'smooth'})
  }
  
},[messages])//dependency array

//useEffect is a React Hook that lets you perform side effects in functional components.

const handleLogin = ()=>{
  //const info = {userID:'selectedUser',userName:
   // selectedUser==="archit"?"archit":"arpit"};
   const info = {userID: selectedUser, userName: selectedUser === "archit" ? "archit" : "arpit" };


  setUserInfo(info)
  const loginToken = selectedUser ==="archit"?tokenA: tokenB
    if(zimInstance){
      
    
  zimInstance.login(info, loginToken)
    .then(function () {
      setIsLoggedIn(true)
        console.log("logged in")
    })
    .catch(function (err) {
        console.log("login failed ")
    });
    
  }else{
    console.log("instance error ")
  }

}


const handleSendMessage = ()=>{
  if(!isLoggedIn)return 


  const toConversationID = selectedUser==="archit"?"arpit":"archit"; // Peer user's ID.
  const conversationType = 0; // Message type; One-to-one chat: 0, in-room chat: 1, group chat:2 
  const config = { 
    priority: 1, // Set priority for the message. 1: Low (by default). 2: Medium. 3: High.
  };
  const messageTextObj = { 
    type: 1, 
    message:messageText , 
    extendedData:''
  };


  zimInstance.sendMessage(messageTextObj, toConversationID, conversationType, config)
    .then(function ({ message }) {
        setMessages(prev=>[...prev,message])
    })
    .catch(function (err) {
        console.log(err)
    });

    setMessageText("")
}

const formatTime = (timeStamp)=>{
  const date = new Date(timeStamp)
  return date.toLocaleTimeString([],{
    hour:'2-digit',minute:'2-digit'
  })
}



    return (
  <div
    className="w-full h-[100vh] flex items-center flex-col"
    style={{
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <h1 className="text-white font-bold text-[30px]">Real Time Chat App</h1>

    {!isLoggedIn ? (
      <div className="w-[90%] max-w-[600px] h-[400px] overflow-auto p-[20px] backdrop-blur shadow-2xl bg-[#00000020] mt-[30px] rounded-xl flex flex-col items-center justify-center gap-[30px] border-2 border-gray-700">
        <h1 className="text-[30px] font-semibold text-white">Select User</h1>

        <select
          className="px-[50px] py-[5px] bg-[#1f2525] text-white rounded-xl"
          onChange={(e) => setSelectedUser(e.target.value)}
          value={selectedUser}
        >
          <option value="archit">Archit Varma</option>
          <option value="arpit">Arpit</option>
        </select>

        <button
          className="p-[10px] bg-white font-semibold cursor-pointer text-black rounded-lg w-[100px]"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    ) : (
      <div className="w-[90%] max-w-[600px] h-[400px] overflow-auto p-[20px] backdrop-blur shadow-2xl bg-[#00000020] mt-[30px] rounded-xl flex flex-col items-center  border-2 border-gray-700">
        <h2 className = 'text-white  text-[20px]'>{userInfo.userName} <span className ='text-gray-200'>chatting with</span>  {selectedUser==="archit"?"arpit":"archit"}</h2>
      <div className = 'w-full h-[1px] bg-gray-800'></div>
     
      <div className='rounded-2xl w-full p-[20px] flex flex-col gap-[10px] items-center h-[400px] overflow-auto'>
        {messages.map((msg,i)=>{
          const isOwnMessage = msg.senderUserID=== userInfo.userID
          /*return <div key={i} className={`flex ${isOwnMessage? "justify-end":"justify-start"})`}> 


          <div className={`px-[20px] py-[10px] shadow-lg ${isOwnMessage?"bg-[#0f1010] rounded-br-0 rounded-t-2xl rounded-bl-2xl":"bg-[#1c2124] rounded-bl-0 rounded-t-2xl rounded-br-2xl"} text-white`}>
          <div>
            {msg.message}
          </div>
          <div className='text-[13px] text-gray-400'>
            {formatTime(msg.timestamp)}
          </div>
          </div>
                </div>*/

          //improvement code
          return (
  <div key={i} className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}>
    <div className={`px-[20px] py-[10px] shadow-lg text-white max-w-[70%] break-words 
      ${isOwnMessage 
        ? "bg-[#0f1010] rounded-br-0 rounded-t-2xl rounded-bl-2xl" 
        : "bg-[#1c2124] rounded-bl-0 rounded-t-2xl rounded-br-2xl"
      }`}
    >
      <div>{msg.message}</div>
      <div className="text-[13px] text-gray-400 text-right">{formatTime(msg.timestamp)}</div>
    </div>
  </div>
);


        })}

        <div ref={messageEndRef}/>

        <div className='flex items-center justify-center gap-[20px] w-full h-[100px] fixed bottom-0 px-[20px]'>
          <input type="text" placeholder='message' className='rounded-2xl bg-gray-700 outline-none text-white px-[20px] py-[10px] placeholder-white w-full' onChange={(e)=>setMessageText(e.target.value)} value={messageText}/>
          <button className='p-[10px] bg-white text-black rounded-2xl w-[100px] font-semibold' onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      </div>


     

    )}
    
  </div>)

}
export default App
import React,{useEffect,useState}from 'react'
import './SidebarChat.css'
import {Avatar} from "@material-ui/core";
import db from "./firebase"
import {Link} from "react-router-dom";
function SidebarChat( {id,name,addNewChat} ) {
    const [seed,setSeed] = useState("");
    const [message,setMessages] = useState("");
    useEffect(()=>{
        if(id){
            db.collection('rooms').doc(id).collection
            ('messages').orderBy('timestamp','desc').
            onSnapshot(snapshot=>(
                setMessages(snapshot.docs.map((doc)=>
                doc.data()))
            ))
        }
    },[id]);
    
    useEffect(()=>{
        setSeed(Math.floor(Math.random()* 5000));
    },[]);

    const createChat = () =>{
        const roomName = prompt("Please enter name for chat");
        if (roomName){
            //database
            db.collection("rooms").add({
                name: roomName,
            });
        }
    };
    return !addNewChat ? (
        <Link to ={`/rooms/${id}`}>
        <div className="sidebarChat">
            <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
            <div class="sidebarChat__info">
                <h2>{name}</h2>
                <p>{message[0]?.message} </p>
            </div>
        </div>
        </Link>
    ) :(
        <div onClick={createChat}
        className="sidebarChat">
            <h2>add new chat</h2>
        </div>

    )
}

export default SidebarChat

import './Chat.css';
import React,{useEffect,useState}from 'react'
import {Avatar,IconButton} from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AttachFile from '@material-ui/icons/AttachFileOutlined';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticonOutlined';
import MicNoneOutIcon from '@material-ui/icons/MicNoneOutlined';
import {useParams, userParams} from "react-router-dom"
import db from "./firebase"
import { useStateValue } from './StateProvider';
import firebase from "firebase"

function Chat() {
    const [input,setInput] = useState("");
    const [seed,setSeed] = useState("");
    const {roomId} = useParams();
    const [roomName,setRoomName] = useState("false");
    const [message, setMessage]  = useState([])
    const [{user}, dispatch] = useStateValue();
    useEffect(()=>{
        setSeed(Math.floor(Math.random()* 5000));
        if (roomId){   
            db.collection('rooms')
            .doc(roomId)
            .onSnapshot(snapshot=>
                setRoomName(snapshot.data().name));

            db.collection('rooms')
            .doc(roomId)
            .collection("messages")
            .orderBy('timestamp','asc')
            .onSnapshot((snapshot) =>{
                setMessage(snapshot.docs.map((doc)=>doc.data()));
                });              
            

        }

    },[roomId]);
  

    const sendMessage = (e)=>{
        e.preventDefault();
      
        

        db.collection("rooms").doc(roomId).collection("messages").add({
            message: input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL:localStorage.getItem("photoURL")
        });
        setInput("");
    }

    return (
        <div className="chat">

            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
    <p>Last seen{" "} 
        {new Date(
            message[message.length-1]?.
            timestamp?.toDate())
    .toUTCString()}</p>
                </div>
                <div className="chat__headerRight">
                    
            <IconButton>
                <SearchOutlinedIcon/>
            </IconButton>

            <IconButton>
                <AttachFile/>
            </IconButton>


            <IconButton>
                <MoreVertIcon/>
            </IconButton>

                </div>
            </div> 

            <div className="chat__body">
                {message.map((message)=>(
                    <p
                     className={`chat__message  ${message.name===user.displayName &&
                    "chat__reciever"}`}>
                       <span className="chat__name">
                           {message.name}
                       </span>
                       {message.message}
                       <span className="chat__timeStamp">
                        {new Date(message.timestamp?.toDate()).toUTCString()
                        }
                       </span>
                    </p>
                ))}
             
                 
            </div> 
            <div className="chat__footer">
                <InsertEmoticonIcon/>
                <form>
                    <input value={input} onChange={(e)=>setInput(e.target.value)}
                    placeholder="Type something"
                    type="text"/>
                    <button onClick={sendMessage}type="submit">Send a message</button>
                </form>
                <MicNoneOutIcon/>

            
            </div> 
            
        </div>
    )
}

export default Chat

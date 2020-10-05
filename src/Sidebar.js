import React,{useEffect,useState} from 'react'
import './Sidebar.css';
import {Avatar, IconButton} from "@material-ui/core";
import ChatIcon from '@material-ui/icons/Chat';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import Sidebarchat from "./SidebarChat";
import db from "./firebase"
import SidebarChat from './SidebarChat';
import { useStateValue } from './StateProvider';

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [{user},dispatch] = useStateValue();

  useEffect(()=>{
    db.collection("rooms").onSnapshot(
      (snapshot)=>
        setRooms(
          snapshot.docs.map((doc)=>({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    }, [] );
  

  return (
   
    <div className="sidebar">
        <div className="sidebar__header">
            <Avatar src={user?.photoURL}/>
            <div className="sidebar__headerRight">         

            <IconButton>
            <ChatIcon/>
            </IconButton>

            <IconButton>
            <DonutLargeIcon/>
            </IconButton>


            <IconButton>
            <MoreVertIcon/>
            </IconButton>
            </div>
        </div>
      
        <div className="sidebar__search">
            <div className="sidebar__searchContainer">
                <SearchOutlinedIcon/>
                <input placeholder="Search or start
                new chat" type="text"/>

            </div>
                
        </div>
          
        <div className="sidebar__chats">
           <Sidebarchat addNewChat/>
           {rooms.map((room) =>(
             <SidebarChat key={room.id} id={room.id}
             name={room.data.name}/>
           ))}
       
                    
        </div>
    </div>
  );
}

export default Sidebar;

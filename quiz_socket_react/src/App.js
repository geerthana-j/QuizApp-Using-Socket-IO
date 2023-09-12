import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {nameData} from "./UserName.js";
const socket = io.connect('http://localhost:8885');
function App() {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const[isAvailableRooms, setIsAvailableRooms] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const[currentPlace,setCurrentPlace] = useState('');
  const[username, setUsername] = useState('lobby');
  console.log(nameData.firstName.length+" "+nameData.lastNamePrefix.length+" "+nameData.lastNameSuffix.length);
  const [score, setScore] = useState(0);
  useEffect(()=>{
    setUsername(nameData.firstName[(Math.floor(Math.random() * nameData.firstName.length))]+" "+nameData.lastNamePrefix[(Math.floor(Math.random() * nameData.lastNamePrefix.length))]+nameData.lastNameSuffix[(Math.floor(Math.random() * nameData.lastNameSuffix.length))]);
  },[]);
    socket.on('connect', () => {
      console.log('Connected to Socket.io server');
      console.log('Time: ' + new Date().toUTCString());
      console.log(socket.id);
    })
    socket.on('availableRoom', (data) => {
      console.log('Available Rooms:');
      console.log(data.availableRooms);
      if (data.availableRooms && data.availableRooms.length > 0) {
          setAvailableRooms(data.availableRooms);
          setIsAvailableRooms(true);

      } else {
        setIsCreatingRoom(true);
      }
    });


  const handleCreateRoom = () => {
    if(availableRooms && availableRooms.length>0){
      alert('Room already exists Please Join the room');
    }
    else{
    setIsCreatingRoom(true);
  }
  };

  const handleJoinRoom = () => {
    const room = { roomName };
    socket.emit('addRoom', room);
  };
  const handleJoin=(name,index)=>{
    if(currentPlace=='Lobby'){
      console.log(availableRooms[index]);
      if(availableRooms[index].player1==null){
        availableRooms[index].player1==username
        setCurrentPlace(name);
       }    
    }
    else{
      alert(`you are already in ${currentPlace} waiting for `);
    }
    socket.emit('join',{name:name,username:username});
  };
  const cancelCreation = () => {
    setIsCreatingRoom(false);
  };

  return (
    <div className="container">
      <h3>Your name is {username} Welcome to the Real-Time Quiz Application, You are in {currentPlace}</h3>
    
     {availableRooms.length>0?(<div id="availableRoom">
        <h3>Available Room</h3>
        <div id="room">
          {availableRooms.map((room,index) => (
            <div key={index}><p>{room.name}</p><button onClick={handleJoin(room.name,index)}>Join</button></div>
          ))}
        </div>
      </div>):  <></>
        }
      <div id="createRoom">
        {isCreatingRoom ? (
          <div id="createRoomForm">
            <label htmlFor="roomName">Room Name:</label>
            <input
              type="text"
              id="roomName"
              name="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
            <button id="joinBtn" onClick={handleJoinRoom}>
              Join
            </button>
            <button id="cancelRoomBtn" onClick={cancelCreation}>
              Cancel
            </button>
          </div>
        ) :(
          <button id="createRoomBtn" onClick={handleCreateRoom}>
            Create a Room
          </button>
        )}
      </div>
      {/* Add the rest of your components and logic here */}
    </div>
  );
};

export default App;

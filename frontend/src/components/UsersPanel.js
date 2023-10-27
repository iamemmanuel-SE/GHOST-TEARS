import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { io } from 'socket.io-client';
import {FaBell, FaSadTear} from 'react-icons/fa';
import {ImHappy} from 'react-icons/im';
import { useCatContext } from '../hooks/useCatContext';
import { useKeyPadContext } from '../hooks/useKeyPadContext';
import { useRoomNameContext } from '../hooks/useRoomNameContext';
import { useKeySockContext } from "../hooks/useKeySockContext"
import { FaPaperPlane } from 'react-icons/fa';





let socket;


const UsersPanel = (props) => {
    const { user } = useAuthContext();
    const { keyboard, dispatchkey } = useKeyPadContext()
    const { dispatchroom } = useRoomNameContext()
    const {keySocket } = useKeySockContext()

    const [requestBut, setRequestBut] = useState(false) 

    const { category } = useCatContext();
    const [activeUsers, setActiveUsers] = useState([]);
    const [denyModal, setDenyModal] = useState('');

    const [theRoomName, setTheRoomName] = useState('')
   
    const [acceptModal, setAcceptModal] = useState('')
    const [okAccepter, setOkAccepter] = useState('') 

    const [occupiedUsers, setOccupiedUsers] = useState([])
    const [occupiedUsersTwo, setOccupiedUsersTwo] = useState([])

    const { onValueChange, onKeypadChange, reqButStat } = props;



    
  
  useEffect(() => {

    // connect  User socket
      socket = io('http://localhost:3000');
      socket.on('connect', () => {
        console.log('Connected to the socket server in the UserPanel');

        // emitting users to server
        socket.emit('activeUsers', {
          socketId: socket.id, ...user
          
        });
        // emit signal to server when new user joins for occupied updates
       
      });

 
      
     
      return () => {
        socket.disconnect();
        
      };
  }, []);

  useEffect(()=> {
    socket.emit('occupiedUsersSignal', {
      userSignal: 'wating for occupied'
    });
  }, [])

  useEffect(()=> {
    socket.on('activeUsers', (data)=>{
            setActiveUsers(data);
            console.log('this user is ACTIVE==',data)
          });

  }, [])
 

  
// send game connection request
  const sendConnectionRequest = (userId) => {
    if(category){
       socket.emit('connectionRequest', {
      senderId: user.id,
      senderEmail: user.email, 
      receiverId: userId,
      selectedCat: category
    })
   
    }
   
  };
  
  useEffect(() => {
     socket.on('connectionRequest', (data)=>{
   const value = data.senderEmail
   const valueTwo = data.seleCat
   
   console.log('this is the category of the sender',data.seleCat)
 
    // setAlert(value); 
    onValueChange(value, valueTwo)
  });


  })
  //listening for game deny request=============================================================================
  useEffect(()=>{
    socket.on('deny', (data) => {
      setDenyModal(data.denier)
    console.log('the denial data recieved',data.denier);
    });

    
},[])

useEffect(() => {
  socket.on('requestAccepted', (data) => {
    setAcceptModal(data.accepter)
    setOkAccepter(data.accepter)
    setRequestBut(true)// disabeling request button after acceptance
    const value = false;
    const roomName = data.roomName
    onKeypadChange(value)
    setTheRoomName(roomName)
    dispatchkey({type: 'SET_KEPADS', payload: false})
    dispatchroom({type: 'SET_ROOMNAME', payload: roomName})
     console.log('this is the roomName in UserPanel', roomName)
})

console.log('sending keyActivation from ok user should be false ',keyboard )
  // console.log('this is after receiving ok, it should be false', keyboard);     
}, [])




  const closeDenyModal = () => {
    
    setDenyModal('')
  }

  const closeAcceptModal = () => {
     //emitting users to server
    
    // return false also to accept request sender
    
    setAcceptModal('')
  }

//trying to emit the roomName backe to the accepter to begin communication
useEffect(()=>{
  if(theRoomName && okAccepter)
  socket.emit('ok', {
    okSender: okAccepter,
    roomName: theRoomName,
    keySocket: keySocket
  }, [theRoomName, okAccepter]);
  console.log('ROOMnMAE SENT BACK TO ACCEPTER AS:', theRoomName, okAccepter, keySocket )
}, [theRoomName, acceptModal])

useEffect(()=> (
  console.log('the category in user panel is now:',category)
), [category])



useEffect(()=>{
  socket.on('okReceived', (data) => {
  dispatchroom({type: 'SET_ROOMNAME', payload: data.roomName})
  console.log('the data recieved for ok to mario',data.roomName);
  });
}, [])

// Listening for occupied users and updating them
useEffect(()=>{
  socket.on('occupiedUsers', (data) => {
    setOccupiedUsers(data.opu)
  })
}, [])

// User oUTside the occupied updates recieves update
useEffect(()=>{
  socket.on('OcU', (data) => {
    setOccupiedUsersTwo(data.opu)
 })
}, [])

  
  return (
    <div className='scrolling-div'>

            {/* Acceptance Modal */}
            {acceptModal && (
            <div className="acceptModal" onClick={closeAcceptModal}>
                <div className="denyoverlay"></div>

                <div className="DenyrequestContainer">
                    <h3>Notifcation <FaBell/></h3>
                    <p>{`Player ${acceptModal} accepted your request.`}<ImHappy/> Kindly wait for the GhostTears word category from {acceptModal} </p>
                    <div className="DenydescideButtons">
                        <div onClick={()=> {closeAcceptModal(acceptModal)}}>ok</div>

                    </div>
                </div>
            </div>
            )}   
            {/* Acceptance Modal */}
        

           {denyModal && (
            <div className="denyModal" >
                <div className="denyoverlay"></div>

                <div className="DenyrequestContainer">
                    <h3>Notifcation <FaBell/></h3>
                    <p>{`Player ${denyModal} denied your request.`}<FaSadTear/> .Kindly select another player</p>
                    <div className="DenydescideButtons">
                        <div onClick={closeDenyModal}>ok</div>

                    </div>
                </div>
            </div>
        )} 
        
        <ul>
            {activeUsers.map((uSer, index) => {
              const isUserOccupied = occupiedUsers.some((occupiedUser) => occupiedUser === uSer.email);
              const isUserOccupiedTwo = occupiedUsersTwo.some((occupiedUserTwoo) => occupiedUserTwoo === uSer.email);
              

              if (user.id === uSer.id){
                return null;
              }
              return(
            <li key={index}>
                <div className='profPicAndName'>
                    <div className='profPic'>
                    </div>
                    <div className='userStatus'>
                        {uSer.email.slice(0, uSer.email.indexOf("@"))}
                        <h5>player occupied</h5>
                    </div>
                    
                </div> 
            <button className={isUserOccupied || isUserOccupiedTwo ? 'disabledRequest-player' : 'request-player'} onClick={()=>{sendConnectionRequest(uSer.id)}} disabled = {isUserOccupied||isUserOccupiedTwo }><FaPaperPlane size={25}/></button>
            {/* <button className={requestBut || reqButStat ? 'disabledRequest-player' : 'request-player'} onClick={()=>{sendConnectionRequest(uSer.id)}} disabled = {requestBut}>request</button> */}
            </li>
              )
              })}
        </ul>
    </div>
    
  );
};

export default UsersPanel;



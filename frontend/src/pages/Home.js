import React from 'react';
import { useState, useEffect} from 'react';
import Keypad from '../components/Keypad'
import UsersPanel from '../components/UsersPanel';
import {FaBell} from 'react-icons/fa';
import { io } from 'socket.io-client';
import { useAuthContext } from '../hooks/useAuthContext';
import { useKeyPadContext } from '../hooks/useKeyPadContext'
import { useKeySockContext } from '../hooks/useKeySockContext';
import { useGameOverContext } from '../hooks/useGameOverContext';
import { motion } from 'framer-motion';


const loaderVariantso = {
    initial: { color: '#f5f5f5'},
    animate: { color: '#e7195a', transition: { duration: 6 }}
}


let socket;

const Home = () => {

    const {user} = useAuthContext()
    const {keySocket} = useKeySockContext()
    const { ghostLett } = useGameOverContext()

    const { dispatchkey } = useKeyPadContext()
    const [alertStatus, setAlertStatus] = useState('')
    const [ activateKey, setActivateKey ] = useState(true)

    const[ recieveCat, setRecieveCat ] = useState('')

    const [requesterId, setRequesterId] = useState('')

    const [requestBut, setRequestBut] = useState(false)

    const [ keypadSocket, setKeyPadSocket] = useState('')
    
    const [isConnected, setIsConnected] = useState('hoverMessage')// Activating green hover message in player 2

    const [timer, setTimer] = useState('')

    const [showModal, setShowModal] = useState(false)
    
    
    
    // Callback function to receive the value from the UserPanel component
    const handleValueKeypadChange = (value, roomName) => {
        setActivateKey(value)
    };

    // Callback function to receive the value from the child component
    const catchKeySocket = (socketValue) => {
        setKeyPadSocket(socketValue)
    }
    
    
    // Function to get timer
    const handleTimer = (countdownT) => {
        setTimer(countdownT)
    }

    // Callback function to receive the value from the child component
        const handleValueChange = (value, valueTwo) => {
            setAlertStatus(value)
            setRecieveCat(valueTwo)
        };

      
       // Frontend code
        useEffect(() => {
        socket = io('http://localhost:3000');
        socket.on('connect', () => {
        console.log('Connected to the socket server in the home ooo');
        });
    
       
    }, []);
    
               
        // Emit denyRequest event
        
        const sendDenyRequest = (alertStatus) => {
            console.log('sending deny request')  
           socket.emit('denyRequest', {
                message: user.email,
                deniedUser: alertStatus
            });  
         
            setAlertStatus('')
        };

           
    const acceptModal = async (alertStatus) => {
        console.log('sending acceptance request')
     await socket.emit('acceptRequest', {
             message: user.email,
             acceptUser: alertStatus,
             acceptorKeySock: keySocket
         });

        dispatchkey({type: 'SET_KEPADS', payload: true})
        setIsConnected('connectedWait')
         setAlertStatus('')
         setRequesterId(alertStatus)
         setRequestBut(true)// Disabeling request button from user who accepted request
         console.log('requester id in Home,', requesterId)
         console.log(keySocket)
    }
    useEffect(() => {
        console.log('this is the timer too', timer)
    }, [timer])
  
    //Restart game for refreshing page=========================================
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if(showModal){
                setShowModal(true)
                // If the modal is shown, don't display the browser's default confirmation dialog
                e.preventDefault();
                

            }
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        // Clean up the event listener when the component unmounts
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, [showModal]);


    return (
        // <section className="horro" style={{ backgroundImage: `url(${img})`}}>
        <div className="home containerHome"> 

        {/* request notification */}
        {alertStatus && (
            <div className="Modal">
                <div className="overlay"></div>

                <div className="requestContainer">
                    <h3>Notifcation  <span><FaBell/></span></h3>
                    <p>{`Player ${alertStatus} sent you a request with the ${recieveCat} category`} </p>
                    <div className="descideButtons">
                        <div onClick={() =>{sendDenyRequest(alertStatus)}}>deny</div>
                        <div onClick={()=>{acceptModal(alertStatus)}}>accept</div>

                    </div>
                </div>
            </div>
        )}
        
            <div className="keyLet">
                <div className="keypadLet">
                    {/* letters */}
                    <div className="letter">
                        <h1>letters below</h1>
                    </div>
                    
                    {/* KEY PAD */}
                    <Keypad value={activateKey} requesterId={requesterId} catchSock={catchKeySocket} connected={isConnected} handleTimerFunc={handleTimer}/>
                    {/* KEY PAD */}

                </div>
                <motion.div className='ActiveUsers'
                    initial={{x: '100vw'}}
                    animate={{x: 0}}
                    transition={{type: 'spring', delay: 0.5}}
                >
                    <h3>Active Users</h3>
                    {/* <h4>received value:{alertStatus}</h4> */}
                    {/* User Panel */}
                        <UsersPanel onValueChange={handleValueChange} onKeypadChange={handleValueKeypadChange} reqButStat = {requestBut}/>
                    {/* User Panel */}
                </motion.div>
                

            </div>
           

            {/* GHOST TEARS BELOW*/}
                <motion.div className="gameOver"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{opacity: 0, delay: 2.5, duration: 5}}
                >
                    <motion.h1 className='gg'
                      variants={loaderVariantso}
                      initial = "initial"
                      animate = {ghostLett.length >= 1 ? "animate" : "initial"}
                      // whileHover="animationOne"
                      style={{color: ghostLett.length >= 1 ? '#e7195a' : '#f5f5f5'}}
                      
                    >G</motion.h1>

                    <motion.h1 className='hh'
                  
                        variants={loaderVariantso}
                        initial = "initial"
                        animate = {ghostLett.length >= 2 ? "animate" : "initial"}
                        // whileHover="animationOne"
                        style={{color: ghostLett.length >= 2 ? '#e7195a' : '#f5f5f5'}}
                    
                    >H</motion.h1>

                    <motion.h1 className='oo'
                     variants={loaderVariantso}
                      initial = "initial"
                      animate = {ghostLett.length >= 3 ? "animate" : "initial"}
                      // whileHover="animationOne"
                      style={{color: ghostLett.length >= 3 ? '#e7195a' : '#f5f5f5'}}
                    // initial={{color: '#ffffff'}}
                    // animate={{color: '#e7195a'}}
                    // transition={{delay: 10, duration: 8}}
                    >O</motion.h1>

                    <motion.h1 className='ss'
                        variants={loaderVariantso}
                        initial = "initial"
                        animate = {ghostLett.length >= 4 ? "animate" : "initial"}
                        // whileHover="animationOne"
                        style={{color: ghostLett.length >= 4 ? '#e7195a' : '#f5f5f5'}}
                    // initial={{color: '#ffffff'}}
                    // animate={{color: '#e7195a'}}
                    // transition={{delay: 12, duration: 10}}
                    >S</motion.h1>

                    <motion.h1 className='ttt'
                        variants={loaderVariantso}
                        initial = "initial"
                        animate = {ghostLett.length >= 5 ? "animate" : "initial"}
                        // whileHover="animationOne"
                        style={{color: ghostLett.length >= 5 ? '#e7195a' : '#f5f5f5'}}
                    // initial={{color: '#ffffff'}}
                    // animate={{color: '#e7195a'}}
                    // transition={{delay: 14, duration: 12}}
                    >T</motion.h1>

                    <motion.h1 className='tt'
                     variants={loaderVariantso}
                      initial = "initial"
                      animate = {ghostLett.length >= 7 ? "animate" : "initial"}
                      // whileHover="animationOne"
                      style={{color: ghostLett.length >= 7 ? '#e7195a' : '#f5f5f5'}}
                    // initial={{color: '#ffffff'}}
                    // animate={{color: '#e7195a'}}
                    // transition={{delay: 14, duration: 14}}
                    >T</motion.h1>

                    <motion.h1 className='ee'
                    variants={loaderVariantso}
                      initial = "initial"
                      animate = {ghostLett.length >= 8 ? "animate" : "initial"}
                      // whileHover="animationOne"
                      style={{color: ghostLett.length >= 8 ? '#e7195a' : '#f5f5f5'}}
                    // initial={{color: '#ffffff'}}
                    // animate={{color: '#e7195a'}}
                    // transition={{delay: 16, duration: 16}}
                    >E</motion.h1>

                    <motion.h1 className='aa'
                     variants={loaderVariantso}
                      initial = "initial"
                      animate = {ghostLett.length >= 9 ? "animate" : "initial"}
                      // whileHover="animationOne"
                      style={{color: ghostLett.length >= 9 ? '#e7195a' : '#f5f5f5'}}
                    // initial={{color: '#ffffff'}}
                    // animate={{color: '#e7195a'}}
                    // transition={{delay: 17, duration: 17}}
                    >A</motion.h1>

                    <motion.h1 className='rr'
                    variants={loaderVariantso}
                      initial = "initial"
                      animate = {ghostLett.length >= 10 ? "animate" : "initial"}
                      // whileHover="animationOne"
                      style={{color: ghostLett.length >= 10 ? '#e7195a' : '#f5f5f5'}}
                    // initial={{color: '#ffffff'}}
                    // animate={{color: '#e7195a'}}
                    // transition={{delay: 18, duration: 18}}
                    >R</motion.h1>
                    <motion.h1 className='ss'
                     variants={loaderVariantso}
                     initial = "initial"
                     animate = {ghostLett.length >= 11 ? "animate" : "initial"}
                     // whileHover="animationOne"
                     style={{color: ghostLett.length >= 11 ? '#e7195a' : '#f5f5f5'}}
                    // initial={{color: '#ffffff'}}
                    // animate={{color: '#e7195a'}}
                    // transition={{delay: 19, duration: 20}}
                    >S</motion.h1>
                </motion.div>
            {/* GHOST TEARS BELOW*/}

            <div>
                {/* Your component content */}
                {/* <button onClick={() => setShowModal(true)}>Open Modal</button> */}
                
                {/* Render the custom modal */}
                {showModal && (
                    <div className="custom-modal refreshModal">
                    {/* Your custom modal content */}
                    <p>Are you sure you want to leave this page?</p>
                    <button onClick={() => setShowModal(false)}>Cancel</button>
                    <button onClick={() => {
                        // Handle the user's confirmation action
                        // For example, you can perform additional actions here
                        window.location.href = 'http://localhost:3000'; // Redirect the user
                    }}>Confirm</button>
            </div>
      )}
    </div>
              
        </div>
        // </section>
    );
}
 
export default Home;
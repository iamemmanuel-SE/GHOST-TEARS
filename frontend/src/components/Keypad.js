import React from 'react'
import { useState, useEffect} from "react"
import {useAuthContext} from '../hooks/useAuthContext'
import { io } from 'socket.io-client';
import  { useKeyPadContext } from '../hooks/useKeyPadContext'
import { useRoomNameContext } from "../hooks/useRoomNameContext";
import { useKeySockContext } from "../hooks/useKeySockContext"
import { motion } from 'framer-motion'
import { useGameOverContext } from '../hooks/useGameOverContext';

const loaderVariants = {
    initial: { scale: 1 },
    animate: { scale: 3, transition: { duration: 1 }}
      // transition: {
      //         repeat: Infinity,  
      //         duration: 1, 
      //         type: 'spring',
      //         stiffness: 200,
      //         delay: 0
          
        
        
      // }
}


let socket;
let interval = null;

const Keypad = ({ connected, handleTimerFunc }) => {

    const { user } = useAuthContext()
    const { keyboard, dispatchkey } = useKeyPadContext()
    const { roomName } = useRoomNameContext()
    const { dispatchSockey } = useKeySockContext()
    const { dispatchghost } = useGameOverContext()
    

    const [letters, setLetters] = useState([])
    const [ghostLetters, setGhostLetters] = useState(['G', 'H', 'O', 'S', 'T', ' ', 'T', 'E', 'A', 'R', 'S']);

    const [ghosting, setGhosting] = useState([]);
    // const [gtl, setGtl] = useState([]);
    const [hovermsg, setHoverMsg] = useState('hoverMessage')
    
    const [countdown, setCountdown] = useState(11)
    const [keyClicked, setKeyClicked] = useState([])
 
    const keys = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

    useEffect(() =>  {
         const connectSocket = () => { 
          socket = io('http://localhost:3000');
            socket.on('connect', () => { 
            console.log('Connected to the socket for the keypadooo');
            dispatchSockey({type: 'SET_KEYSOCKET', payload: socket.id})
        });
        

    
        }
        if (user){
            connectSocket()
            

        } else {
            socket.disconnect()
        }

        return () => {
            if (socket) {
              socket.close();
            }
          }
   // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

       const printText = async (key) =>  { 
     await socket.emit('letter', {
        socketID: socket.id,
        roomName: roomName,
        message: key
    })
      setKeyClicked(key)
      console.log('this is the roomName id from keypad', roomName)
    }
  
    useEffect(()=>{
      if(letters){
        socket.on('letter', (data) => { 
          console.log('is ghostTears true: ', data.message )
        console.log('Receieved letter:', data.message)
        setLetters(data.message);
        // setLetters((letters) => [...letters, data.message]);
      })
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    useEffect(()=>{
     
     
          const printNextLetter = (data) => {
            if (data.message === 'ghostTears') {
              if (ghostLetters.length > 0) {
                console.log(ghostLetters[0]);
              
                const newGT = ghostLetters[0]
                setGhosting((ghosting) => [...ghosting, newGT]);
                // console.log(ghosting)

                setGhostLetters((ghostLetters) => ghostLetters.slice(1)); 
                
              } else {
                console.log('GAME OVER :=)')
              }
            }
          };
      
          socket.on('GhostFail', printNextLetter);
      
          return () => {
            socket.off('GhostFail', printNextLetter);
          };

    },[ghostLetters])

    useEffect(()=> {
       // eslint-disable-next-line react-hooks/exhaustive-deps
      console.log('I AM LOOKING FOR U',ghosting)
      dispatchghost({type: 'SET_GHOSTLETTER', payload: ghosting})
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ghosting])
     
    //Changes lock notification to green Waiting
    useEffect(() => {
      setHoverMsg(connected)
      console.log('connected but on hold', connected)
    },[connected])

    // for count down Engine 
    useEffect(() => { 
      socket.on('letter', (data) => { 
          // for count down
          if(socket.id !== data.keySockId && data.letterStats !== 'wrong'){
            interval = setInterval(() => {
            setCountdown((countdown) => countdown - 1);
            }, 1000);

          } 
          // else {
          //   setTimeout(()=>{
          //   setLetters([])
          //   }, 2000)
          // }
    
    }
    )
    }, [])

    useEffect(() => { 
      socket.on('letter', (data) => { 
          // console.log('YOU ENTERED A WRONG LETTER==')
          if(data.letterStats === 'wrong'){
            setTimeout(()=>{
            setLetters([])
            }, 2000)
          
          } 
          
           
    }
    )
    }, [])

    //printing out timing
    useEffect(() => {
       // eslint-disable-next-line react-hooks/exhaustive-deps
      if(countdown < 11){  
        if(countdown >= 0 && keyClicked.length === 0){
           console.log(countdown,' :seconds left')
          
          } else {
          clearInterval(interval)
          setCountdown(11)
        }

        
         
      } 
        
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countdown])

    useEffect(()=> {
      if(countdown === 0 && keyClicked.length === 0){
        socket.emit('letter', {
              socketID: socket.id,
              roomName: roomName,
              message: ''
          })
       } 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countdown])

    // useEffect(()=>{
    //   const ghosted = ['G', 'H', 'O', 'S', 'T', ' ', 'T', 'E', 'A', 'R', 'S'];
    //   if(ghosting == ghosted){
    //     clearInterval(interval)
    //     console.log('you have been GHOSTED')

    //     socket.emit('letter', {
    //       gameOver: 'ghosted' 
    //   })
    //   }
    // }, [ghosting])
    // useEffect(() => {
    //    if(countdown > 0){  
    //       if(keyClicked.length > 0 && countdown > 0){
    //         clearInterval(interval)
    //       }
    //         console.log('i am counting', countdown)

    // //   } else{
    // //     dispatchkey({type: 'SET_KEPADS', payload: true})
    // //     setHoverMsg(connected)
      
    // //     console.log('i am counting', countdown)
    // //     clearInterval(interval)
    //  } else {
    //     socket.emit('letter', {
    //     socketID: socket.id,
    //     roomName: roomName,
    //     message: 'empty'
    // })
    //     clearInterval(interval)
    //  }
        
      
    // //   // handleTimerFunc(countdownT)
      
    // }, [countdown])

    useEffect(() => {  
      socket.on('letter', (data) => { 
        console.log('is ghostTears true: ', data.keySockId )
      
        if(socket.id === data.keySockId){
          dispatchkey({type: 'SET_KEPADS', payload: true})
          setHoverMsg('connectedWait')
        } else {
          setKeyClicked([])
          dispatchkey({type: 'SET_KEPADS', payload: false})
            
        }
      // setLetters((letters) => [...letters, data.message]);
    }) 
     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

     return ( 
        <div className="letterspace"> 
        <div className="countdown">
         <motion.p
        variants={loaderVariants}
        initial = "initial"
        animate = "animate"
        // whileHover="animationOne"
        style={{scale: countdown > 10 ? 1 : 3}}
        
         >{countdown}</motion.p> 
        </div>
            <motion.h1 className='letterBox'
                initial={{x: '-100vw'}}
                animate={{x: 0}}
                transition={{type: 'spring', delay: 2.5, duration: 3, stiffness: 60}}
            >{letters && letters}
            </motion.h1>

             <motion.div className="keypads"
             initial={{x: '-100vw'}}
             animate={{x: 0}}
             transition={{type: 'spring', delay: 1}}
             >
                {keys.map((key) => {
                return(   
                <motion.button className={ keyboard ? hovermsg : 'noHoverMessage' } key={key} onClick={() => printText(key)} disabled={keyboard}
                whileTap={{
                    scale: 0.95,
                    // rotate: -90,
                    // borderRadius: "100%"
                  }}
                  transition={{type: 'spring', duration: 0.5}}

                >
                  {key}
                  </motion.button>
                )
                })}
               
            </motion.div>
        </div>
           
     );
}
 
export default Keypad;
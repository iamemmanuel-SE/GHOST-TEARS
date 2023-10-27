import React from 'react';
import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import {IoMdSettings} from 'react-icons/io'
import { useState, useEffect } from 'react'
import { useCatContext } from '../hooks/useCatContext'
import Logo from './Glogo'
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { useRoomNameContext } from '../hooks/useRoomNameContext';
import { useKeySockContext } from '../hooks/useKeySockContext';

let socket;


const Navbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthContext()
    const { dispatch } = useCatContext()
    const [catModal, setCatModal] = useState(false)
    const [ textCategory, setTextCategory ] = useState('')
    const { roomName } = useRoomNameContext()
    const { KeySock} = useKeySockContext()

    //Navbar socket connection
    useEffect(() => {

        // connect  User socket 
          socket = io('http://localhost:3000');
          socket.on('connect', () => {
            console.log('Connected to the socket server in the Navbar');
          });
         
        //   return () => {
        //     socket.disconnect();
            
        //   };
      }, []);
    //Navbar socket connection
    
    // useEffect(() => {
    //     socket.on('connectionRequest', (data)=>{
    //   console.log('this is the category of the sender Navbar',data.seleCat)
    //  });
   
   
    //  })
    
    const handleClick = () => {
        logout()
        // sending socket message to disconnect users from room
        socket.emit('UserRoomDisconnect', {
        userDisconnectSockId: user.email,
        roomName: roomName
        
             
         });  
         console.log('A DEY LOGOUT OOO==')
      
    }

    const wordCategory = () => {
        setCatModal(!catModal)
    }

    const selectedFunc = (event) => {
        const clickedElement = event.target
        setTextCategory(clickedElement.textContent)
        

    }

        useEffect(()=>{
            if(textCategory){
                dispatch({type: 'SET_CATEGORY', payload: textCategory})
            }
            
        },[textCategory])
    

    return ( 
        <header>
            <motion.div className="containerMy"
                initial={{ y: -250 }}
                animate={{ y: 10 }}
                transition={{delay: 1.5, type: 'spring', stiffness: 700}}
            >
                {user && (
                <div className='settings'>
                    <motion.div className='setIcon' onClick={wordCategory}
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{
                      scale: 0.8,
                      rotate: -90,
                      borderRadius: "100%"
                    }}
                        // initial={{rotate: 0}}
                        // animate={{rotate: 360}}
                        // transition={{duration: 5, repeat: 'Infinity', ease: 'linear', type: 'tween'}}
                    >
                         <div className="icon-container">
                        <IoMdSettings />
                        </div>
                    </motion.div>
                    <div className='SC'>{textCategory}</div>
                </div>
                    )}
                <Link to="/">
                    <Logo/>
                    {/* <h1 style={{ fontFamily: 'Poppins', fontWeight: 400}}>

                    </h1> */}
                </Link>
                <nav>
                    {user && (
                        <div>
                            <span>{user.email}</span>
                            <motion.button onClick={handleClick}
                                whileHover={{scale: 1.2}}
                                whileTap={{scale: 0.95}}
                            >Log out</motion.button>
                        </div>
                    )}
                    {!user && (
                    <div>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </div>
                    )}
                </nav> 
            </motion.div>

            {catModal && (
            <div className="catModal" onClick={wordCategory}>
                <div className="catListOverlay">
                    
                    <motion.ul className='categoryContain'
                    initial={{x: '-100vw'}}
                    animate={{x: 0}}
                    transition={{type: 'spring', stiffness: 30}}
                    >
                        <li onClick={selectedFunc}>Countries</li>
                        <li onClick={selectedFunc}>Animals</li>
                        <li onClick={selectedFunc}>Universities</li>
                        <li onClick={selectedFunc}>Presidents</li>
                    </motion.ul>
                </div>

            </div>
        )} 
        

        </header>
     );
}
 
export default Navbar;
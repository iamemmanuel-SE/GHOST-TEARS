import React from "react";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import img1 from "../image/img1.jpeg"
// import GhostAnime from "../components/ghost"
import { motion, spring } from 'framer-motion'
import ghoster1 from "../image/ghoster1.png"
import ghosted from "../image/ghosted.png"
import logSound from "../sounds/logSound.mp3"


const loaderVariants = {
    animationOne: {
        y: [40, -60, 40],
        opacity: 0.5,
        transition: {
           
            y:{
                repeat: Infinity,  
                duration: 4, 
            },
            opacity:{
                delay: 2,
                duration: 5
            }
          
        }
    }
}


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, error, isLoading} = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Play the click sound when the button is clicked
        const clickAudio = new Audio(logSound);
        clickAudio.play();


        await login(email, password)
    }

    // function playClickSound() {
    //     const audio = document.getElementById('click-audio');
    //     if (audio) {
    //       audio.play();
    //     }
    //   }
      


    return ( 
  <div className="creepyLogin">
    <audio id="click-audio" src={logSound}/>

    {/* <GhostAnime /> */}
    <motion.div className="gost" style={{ backgroundImage: `url(${ghosted})`}}
        variants={loaderVariants}
        animate="animationOne"
        initial={{opacity: 0}}
    >
    
    </motion.div>  
    <div className="creepyLoginContainer">
        <div className="formFlex">
             <form className="login" onSubmit={handleSubmit}>
            <h3>Log in</h3>

            {/* <label>Email:</label> */}
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)} 
                value={email}
                placeholder="Email"
            />
            
            {/* <label>Password:</label> */}
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
                placeholder="Password"
            />
            <motion.button disabled={isLoading}
             whileTap={{
                scale: 0.97,
                // rotate: -90,
                // borderRadius: "100%"
              }}
              transition={{type: 'spring', duration: 0.5}}
            >Log in</motion.button>
            {error && <div className="error">{error}</div>}
        </form>
        </div>
       
            <div className="creepyScene" style={{ backgroundImage: `url(${img1})`}}>
                
            </div>
    </div>
        </div>
     );
}
 
export default Login;
import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import img1 from "../image/img1.jpeg"
// import GhostAnime from "../components/ghost"
import { motion } from 'framer-motion'
// import ghoster1 from "../image/ghoster1.png"
import ghosted from "../image/ghosted.png"

const loaderVariants = {
    animationOne: {
        y: [40, -60, 40],
        transition: {
           
            y:{
                repeat: Infinity,  
                duration: 4, 
               
                
            },
          
        }
    }
}

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {signup, error, isLoading} = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await signup(email, password)
    }


    return ( 
        <div className="creepyLogin">

    <motion.div className="gost" style={{ backgroundImage: `url(${ghosted})`}}
        variants={loaderVariants}
        animate="animationOne"
        initial={{opacity: 0.5}}
    >
    
    </motion.div>  
    <div className="creepyLoginContainer">
    <div className="formFlex">
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign up</h3>

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
            <button disabled={isLoading}>Sign up</button>
            {error && <div className="error">{error}</div>}
        </form>
        </div>
        <div className="creepyScene" style={{ backgroundImage: `url(${img1})`}}>
                
        </div>
        </div>
        </div>
     );
}
 
export default Signup;
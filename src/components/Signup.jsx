import React from "react";
import App from "../App";"./app.css";

import { useState } from "react";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  return (
    <> 
      

        <div className="signup">
          <form className="signup-form">
            <h2 className="signup-head"> Login</h2>
            <label>Email: </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder=" Email"
              required
            />
            <label>Password: </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder=" Password"
              required
            />

            <button type="submit">
            
              Login
            </button>
          
          </form>
        </div>
  
    </>
  );
};

export default Login;
// import { Link, useNavigate } from "react-router-dom";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { app } from "./Firebase";
// import Google from "./Google";

// const auth = getAuth(app);
// const navigate = useNavigate();

  // const handleLogin = (e) => {
  //   e.preventDefault();

    // signInWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     console.log("Successfully logged in:", userCredential.user);

    //     setEmail("");
    //     setPassword("");
    //     navigate("/home");
    //   })

    //   .catch((error) => {
    //     console.error("Error logging in:", error);
    //     alert("Incorrect Email and Password");
    //   });
  // };
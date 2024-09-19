import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../config/Firebase";
import { useNavigate } from "react-router-dom";


const auth = getAuth(app);

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const signupUser = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User signed up successfully:", userCredential.user);
        setMessage("Registered Successfully!");
        setName("");
        setEmail("");
        setPassword("");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing up:", error);
      });
  };

  return (
    <>
      <div className="Home">
      

        <div className="signup">
          <form className="signup-form">
            <h2 className="signup-head">Join us Today, Signup</h2>

            <label>Name: </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder=" Name"
              required
            />

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
            <button type="submit" onClick={signupUser}>
              {" "}
              Signup
            </button>

          

          
          
          </form>
        </div>
      </div>
    </>
  );
};
export default Signup;

import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Courses = () => {
  const navigate = useNavigate();
  const [userAuth, setUserAuth] = useState(false);
    useEffect(() => {
      const token = localStorage.getItem("token"); 
      if (token) {
        setUserAuth(true);
      } else {
        setUserAuth(false);
        navigate("/auth")
      }
    }, []);
  return (
    <div>
      {
        userAuth ? <div>Coursers </div> :
        <div>
          <h1>TO access courses you should login first</h1>
          {/* <button onClick={navigate("/auth")}> click here to login </button> */}
           </div>
      }
      
    </div>
  )
}

export default Courses

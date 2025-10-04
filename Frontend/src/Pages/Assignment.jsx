import React from 'react'
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateAssignment from '../Components/Assignment/CreateAssignment';
import FetchAssignment from '../Components/Assignment/FetchAssignment';

const Assignment = () => {
 const navigate = useNavigate();
  const [userAuth, setUserAuth] = useState(false);
  const role = localStorage.getItem("role");
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
        userAuth ? <div>{role === "student" ? <CreateAssignment/> :
          role === "Teacher" || role === "admin" ? <FetchAssignment/> :
           <h1>Only student can access this page</h1>
          } </div> :
        <div>
          <h1>TO access courses you should login first</h1>
          {/* <button onClick={navigate("/auth")}> click here to login </button> */}
           </div>
      }
      
    </div>
  )}

export default Assignment

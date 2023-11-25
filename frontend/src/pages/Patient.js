import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Medicine from "../components/Medicine";
import PatientActivities from "../components/PatientActivities";
import ViewCartItems from "../components/ViewCartItems";
import ViewAndCancelOrder from "../components/viewAndCancelOrder";
import CheckingOut from "../components/CheckingOut";
import ChangePassword from "../components/ChangePassword";
import PatientChats from "../components/PatientChats";

const Patient = () => {
  const [sharedState, setSharedState] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]); // Add this line

  const navigate = useNavigate();

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const response = await fetch("/patient");
        if (response.status === 401 || response.status === 403) {
          // Close the active chat before navigating away
          if (activeChat) {
            await closeActiveChat(activeChat);
          }
          navigate("/", { state: { errorMessage: "Access Denied" } });
        }
      } catch (error) {
        console.error(error);
      }
    };

    return () => {
      // Clean up: Close the active chat if the component is unmounted
      if (activeChat) {
        closeActiveChat(activeChat);
      }
    };
  }, [navigate, activeChat]);

  const handleLogout = async () => {
    try {
      // Close the active chat before logging out
      if (activeChat) {
        await closeActiveChat(activeChat);
      }
  
      const response = await fetch("/api/patient/logout", {
        method: "GET",
      });
  
      if (response.ok) {
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  

  const closeActiveChat = async (chatId) => {
    try {
      await axios.delete(`/api/patient/deleteChat/${chatId}`);
      console.log('Chat closed:', chatId);
      setActiveChat(null);
      // Refresh the chat list by filtering out the closed chat
      setChats(chats.filter((chat) => chat._id !== chatId));
    } catch (error) {
      console.error('Error closing chat:', error);
    }
  };

  return (
    <div className="container">
      <button onClick={handleLogout} className="btn btn-danger mt-2">
        Logout
      </button>
      <h1 className="mb-4 text-center">Patient Dashboard</h1>
      <div className="card mt-4">
        <ChangePassword userType="patient" />
      </div>
      <div className="card mt-4"> {<Medicine sharedState={sharedState} modelName="patient" />}</div>
      <div className="card mt-4">{<PatientActivities modelName="patient" />}</div>
      <div className="card mt-4">
        <PatientChats setChats={setChats} chats={chats} /> {/* Pass setChats and chats to PatientChats */}
      </div>
      <div className="container card mt-4">
        <h3>Order CheckOut </h3>
        <div>
          <ViewCartItems />
        </div>
        <div >{<CheckingOut sharedState={sharedState} setSharedState={setSharedState} modelName="patient" />}</div>
      </div>
      <div className="card mt-4">
        <ViewAndCancelOrder />
      </div>
    </div>
  );
};

export default Patient;

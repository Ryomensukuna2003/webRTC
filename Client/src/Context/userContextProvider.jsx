import React, { useState } from "react";
import UserContext from "./userContext";

const UserContextProvider = ({ children }) => {
    const [url, setUrl] = useState('neko');
    
    return (
        <UserContext.Provider value={{ url, setUrl }}>
        {children}
        </UserContext.Provider>
    );
    };

export default UserContextProvider;
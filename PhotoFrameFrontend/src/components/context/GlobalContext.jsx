import React, { createContext, useEffect, useState } from "react";

// Create a context
export const GlobalContext = createContext(null);

// Define the provider component
export default function Globalstate({ children }) {
    const [user, setUser] = useState(''); // State for user
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
        if (token && role) {
          setUser({ role });
        }
      }, []); 
    return (
        <GlobalContext.Provider value={{ user, setUser }}>
            {children}
        </GlobalContext.Provider>
    );
}

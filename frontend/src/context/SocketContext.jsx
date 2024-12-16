import React, { useEffect } from 'react'
import { createContext } from 'react'

export const SocketContext=createContext();

const socket=io(`${import.meta.env.VITE_BASE_URL}`);

const SocketContext = ({children}) => {

    useEffect(()=>{
        socket.on('connect',()=>{
            console.log('Connected to server');
        });

        socket.on('disconnect',()=>{
            console.log('Disonnected from server');
        });
    },[]);

  return (
    <div>
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    </div>
  );
};

export default SocketContext

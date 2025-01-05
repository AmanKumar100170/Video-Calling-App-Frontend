import SocketIoClient from "socket.io-client";
import React, { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WS_Server = "http://localhost:5500";

export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(WS_Server, {
    withCredentials: false,
    transports: ['polling', 'websocket']
});

interface Props {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {

    const navigate = useNavigate();
    useEffect(() => {

        const enterRoom = ({ roomId } : { roomId: string }) => {
            navigate(`/room/${roomId}`);
        }

        socket.on('room-created', enterRoom);
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>

            {children}
            
        </SocketContext.Provider>
    )
}
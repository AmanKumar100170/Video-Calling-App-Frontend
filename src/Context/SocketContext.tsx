import SocketIoClient from "socket.io-client";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as UUIDv4 } from 'uuid';

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

    const [user, setUser] = useState<Peer>();

    const [stream, setStream] = useState<MediaStream>();

    const fetchParticipantList = ({ participants, roomId } : { participants: string[], roomId: string }) => {
        console.log('Current Room Id: ', roomId);
        console.log('Current Participants: ', participants);
    }

    const fetchUserFeed = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); // Get user's video and audio feed
        setStream(stream);
    }

    useEffect(() => {

        const userId = UUIDv4();
        const newPeer = new Peer(userId);
        setUser(newPeer);

        fetchUserFeed(); 

        const enterRoom = ({ roomId } : { roomId: string }) => {
            navigate(`/room/${roomId}`);
        }

        socket.on('room-created', enterRoom);

        socket.on('get-users', fetchParticipantList);
    }, []);

    return (
        <SocketContext.Provider value={{ socket, user, stream }}>

            {children}
            
        </SocketContext.Provider>
    )
}
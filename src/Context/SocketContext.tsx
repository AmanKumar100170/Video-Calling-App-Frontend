import SocketIoClient from "socket.io-client";
import React, { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as UUIDv4 } from 'uuid';
import { peerReducer } from "../Reducers/peerReducer";
import { addPeerAction } from "../Actions/peerAction";

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

    const [peers, dispatch] = useReducer(peerReducer, {});

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
        const newPeer = new Peer(userId, {
            host: 'localhost',
            port: 9000,
            path: '/myapp'
        });
        setUser(newPeer);

        fetchUserFeed(); 

        const enterRoom = ({ roomId } : { roomId: string }) => {
            navigate(`/room/${roomId}`);
        }

        socket.on('room-created', enterRoom);

        socket.on('get-users', fetchParticipantList);
    }, []);

    useEffect(() => {
        if(!user || !stream) return;

        socket.on('user-joined', ({ peerId }) => {
            const call = user.call(peerId, stream);
            console.log('Calling the new peer:', peerId);

            call.on('stream', () => {
                dispatch(addPeerAction(peerId, stream));
            })
        })

        user.on('call', (call) => {
            // tells what to do when the other peers on the group, call the user when user joined
            console.log('Received a call from peers');
            call.answer(stream);

            call.on('stream', () => {
                dispatch(addPeerAction(call.peer, stream));
            })
        })

        socket.emit('ready'); 

    }, [user, stream])

    return (
        <SocketContext.Provider value={{ socket, user, stream, peers }}>

            {children}
            
        </SocketContext.Provider>
    )
}
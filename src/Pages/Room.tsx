import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";

const Room: React.FC = () => {

    const { id } = useParams();
    const { socket, user } = useContext(SocketContext);

    useEffect(() => {
        if (user) socket.emit('joined-room', { roomId: id, peerId: user._id });
    }, [user, id, socket]);

    return (
        <div>
            Room : {id}
        </div>
    )
}

export default Room;
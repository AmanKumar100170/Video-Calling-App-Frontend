import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";

const Room: React.FC = () => {

    const { id } = useParams();
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        socket.emit('joined-room', { roomId: id });
    }, []);

    return (
        <div>
            Room : {id}
        </div>
    )
}

export default Room;
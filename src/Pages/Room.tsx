import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";
import UserFeedPlayer from "../Components/UserFeedPlayer";

const Room: React.FC = () => {

    const { id } = useParams();
    const { socket, user, stream } = useContext(SocketContext);

    useEffect(() => {
        if (user) socket.emit('joined-room', { roomId: id, peerId: user._id });
    }, [user, id, socket]);

    return (
        <div>
            Room : {id}
            <UserFeedPlayer stream={stream}/>
        </div>
    )
}

export default Room;
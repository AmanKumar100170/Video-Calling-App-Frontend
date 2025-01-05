import CreateRoom from "../Components/CreateRoom";

const Home: React.FC = () => {
    return (
        <div
            className="h-[100vh] flex justify-center items-center"
        >
            <CreateRoom />
        </div>
    )
}   

export default Home;
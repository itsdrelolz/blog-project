import useAuth from "../hooks/useAuth";




const ProfilePage = () => {

const { user } = useAuth();
    return ( 
        <>
        <h1>Profile</h1>
        <p>{user?.username}</p>
        </>
    )
}


export default ProfilePage;
import useAuth from "../hooks/useAuth";




const ProfilePage = () => {
    const { user } = useAuth();
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!profile) return <div>No profile found</div>;

    return (
        <div>
            <h1>{profile.name}</h1>
            <p>{profile.email}</p>
        </div>
    )
}

export default ProfilePage;
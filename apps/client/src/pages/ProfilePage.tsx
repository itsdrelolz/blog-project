import useAuth from "../hooks/useAuth";
import { AuthContextType } from "../hooks/AuthContext";
import Post from "../components/Post";


const ProfilePage = () => {
    const { user, isLoading } = useAuth() as AuthContextType;  

    if (isLoading) return <div>Loading...</div>;
    if (!user) return <div>No profile found</div>;

    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                
            </div>
            <h1 className="text-2xl font-bold">Published Posts</h1>
            <div className="grid grid-cols-1 gap-4 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.posts?.map((post) => (
                        <Post
                            key={post.id} 
                            {...post}
                            authorId={user.id}
                            published={true}
                            author={user}
                            comments={[]}
                            thumbnail={post.thumbnail || null}
                        /> 
                    ))}
                </div>
            </div>
        </>
    )
}

export default ProfilePage;
import useAuth from "../hooks/useAuth";
import { AuthContextType } from "../hooks/AuthContext";
import Post from "../components/Post";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deletePost, updatePost } from "../hooks/postsApi";
import { UpdatePostData } from "@blog-project/shared-types/types/post";

const ProfilePage = () => {
    const { user, isLoading } = useAuth() as AuthContextType;  
    const [activeTab, setActiveTab] = useState<'published' | 'unpublished'>('published');
    const navigate = useNavigate();
    const [userPosts, setUserPosts] = useState<any[]>([]);
    
    useEffect(() => {
        if (user && user.posts) {
            setUserPosts(user.posts);
        }
    }, [user]); 
    
    if (isLoading) return <div>Loading...</div>;
    if (!user) return <div>No profile found</div>;

    // Filter posts based on their published status
    const publishedPosts = userPosts.filter(post => post.published === true);
    const unpublishedPosts = userPosts.filter(post => post.published === false);

    const handlePublish = async (postId: number) => {
        const postToUpdate = userPosts.find(post => post.id === postId);
        if (!postToUpdate) return;
        
        // Preserve all post data and only update the published status
        const updateData: UpdatePostData = {
            title: postToUpdate.title,
            content: postToUpdate.content,
            thumbnail: postToUpdate.thumbnail,
            published: true
        };
        
        await updatePost(postId, updateData);
        setUserPosts(prevPosts => 
            prevPosts.map(post => 
                post.id === postId ? { ...post, published: true } : post
            )
        );
    };

    const handleUnpublish = async (postId: number) => {
        const postToUpdate = userPosts.find(post => post.id === postId);
        if (!postToUpdate) return;
        
        // Preserve all post data and only update the published status
        const updateData: UpdatePostData = {
            title: postToUpdate.title,
            content: postToUpdate.content,
            thumbnail: postToUpdate.thumbnail,
            published: false
        };
        
        await updatePost(postId, updateData);
        setUserPosts(prevPosts => 
            prevPosts.map(post => 
                post.id === postId ? { ...post, published: false } : post
            )
        );
    };

    const handleEdit = (postId: number) => {
        navigate(`/edit/${postId}`);    
    };

    const handleDelete = async (postId: number) => {
        await deletePost(postId);
        setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        navigate('/');
    };

    return (
        <>
            <div>
                <h1>{user.name}</h1>
                <p>{user.email}</p>
            </div>
            
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                    <button
                        onClick={() => setActiveTab('published')}
                        className={`py-2 px-4 border-b-2 font-medium text-sm ${
                            activeTab === 'published'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Published ({publishedPosts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('unpublished')}
                        className={`py-2 px-4 border-b-2 font-medium text-sm ${
                            activeTab === 'unpublished'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Unpublished ({unpublishedPosts.length})
                    </button>
                </nav>
            </div>

            <div className="grid grid-cols-1 gap-4 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeTab === 'published' && publishedPosts.length > 0 ? (
                        publishedPosts.map((post) => (
                            <div key={post.id} className="relative">
                                <Post
                                    {...post}
                                    authorId={user.id}
                                    published={post.published}
                                    author={user}
                                    comments={[]}
                                    thumbnail={post.thumbnail || null}
                                />
                                <div className="absolute top-2 right-2 bg-white rounded shadow-md">
                                    <button
                                        onClick={() => handleEdit(post.id)}
                                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleUnpublish(post.id)}
                                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Unpublish
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : activeTab === 'unpublished' && unpublishedPosts.length > 0 ? (
                        unpublishedPosts.map((post) => (
                            <div key={post.id} className="relative">
                                <Post
                                    {...post}
                                    authorId={user.id}
                                    published={post.published}
                                    author={user}
                                    comments={[]}
                                    thumbnail={post.thumbnail || null}
                                />
                                <div className="absolute top-2 right-2 bg-white rounded shadow-md">
                                    <button
                                        onClick={() => handleEdit(post.id)}
                                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handlePublish(post.id)}
                                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Publish
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500">
                            No posts to display in this tab
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ProfilePage;
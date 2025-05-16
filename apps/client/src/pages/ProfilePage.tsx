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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="mt-2 text-gray-600">Manage your blog posts</p>
            </div>
            
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('published')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'published'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Published ({publishedPosts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('unpublished')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'unpublished'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Unpublished ({unpublishedPosts.length})
                    </button>
                </nav>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTab === 'published' && publishedPosts.length > 0 ? (
                        publishedPosts.map((post) => (
                            <div key={post.id} className="flex flex-col">
                                <Post
                                    {...post}
                                    authorId={user.id}
                                    published={post.published}
                                    author={user}
                                    comments={[]}
                                    thumbnail={post.thumbnail || null}
                                />
                                <div className="mt-4 flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(post.id)}
                                        className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleUnpublish(post.id)}
                                        className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Unpublish
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : activeTab === 'unpublished' && unpublishedPosts.length > 0 ? (
                        unpublishedPosts.map((post) => (
                            <div key={post.id} className="flex flex-col">
                                <Post
                                    {...post}
                                    authorId={user.id}
                                    published={post.published}
                                    author={user}
                                    comments={[]}
                                    thumbnail={post.thumbnail || null}
                                />
                                <div className="mt-4 flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(post.id)}
                                        className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handlePublish(post.id)}
                                        className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Publish
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 text-lg">No posts to display in this tab</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;
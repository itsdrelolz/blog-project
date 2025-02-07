
import { useState, useEffect } from 'react';
import { fetchPosts } from './postsApi';
import React from 'react';
import Post from '../components/Post';
export const usePosts = () => { 
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => { 
        const getPosts = async () => { 
            try { 
                const data = await fetchPosts();
                setPosts(data);
            } catch (error) { 
                setError(error)
                console.error("Error creating post: ", error); 
            }
            finally {
                setLoading(false)
            }
        };
            getPosts(); 
         }, []);

        


        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) { 
            return <div>Error: {error.message}</div>;
        }

        return ( 
            <div>
            {posts.map((post) => (
                <Post key={post.id} {...post} />
            ))}
                </div>
        );
    }
export default usePosts;
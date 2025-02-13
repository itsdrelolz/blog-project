
import { useState, useEffect } from 'react';
import { fetchPosts } from './postsApi';
import Post from '../components/Post';
import { Post as PostInterface} from '../types/post';

export const usePosts = () => { 
    const [posts, setPosts] = useState<PostInterface[]>([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        const getPosts = async () => { 
            try { 
                const data = await fetchPosts();
                setPosts(data);
            } catch (error) { 
                setError(error as Error)
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
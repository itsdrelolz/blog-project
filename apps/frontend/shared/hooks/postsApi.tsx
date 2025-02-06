
export const fetchPosts = async () => { 
    const response = await fetch('http://localhost:3000/home');
    if (!response.ok) { 
        throw new Error('Failed to fetch posts')
        
    }
    return response.json();
}
import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";


const prisma = new PrismaClient();


const postsController = {
    getAllPosts: async (_req: Request, res: Response) => {
        try {
            const posts = await prisma.post.findMany({
                where: { 
                    published: true 
                },
                include: { 
                    author: {
                        select: {
                            email: true  // Only including email since it's used as username
                        }
                    }
                },
                orderBy: { 
                    createdAt: 'desc' 
                }
            })
            return res.status(200).json({ posts })
        } 
        catch (error) {
            console.error('Error fetching posts:', error)
            return res.status(500).json({
                error: 'Failed to fetch posts'
            })
        }
    },


    getPost: async( req: Request, res: Response) => { 
        try { 
            const postId = parseInt(req.params.id)

            if (isNaN(postId)) {
                return res.status(400).json({
                    error: 'Invalid post ID'
                })
            }

            const post = await prisma.post.findUnique({ 
                where: {
                    postId, 
                }, 
                include: { 
                    author: {
                        select: {
                            email: true
                        }
                    }
                }
            })



            if (!post) { 
                return res.status(404).json({ 
                    error: 'Post not found'
                })
            }



            if (!post.published) { 
                return res.status(403).json({
                    error: 'Post not available'
                })
            }
            return res.status(200).json({
                post
            })
        } catch (error) { 
            console.error(`Error fetching post ${error}`)
            return res.status(500).json({ 
                error: 'Error fetching post'
            })
        }
        
    },

      // only for the user route 
    getUserPosts: async ( req: Request, res: Response) => { 
        try { 
            const userId = req.user?.id
        

        const posts = await prisma.post.findMany({
            where: { 
                authorId: userId, 
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return res.status(200).json( { posts })
        
        
    }
    catch (error) { 
        console.error(`Error fetching posts: ${error}`)
        return res.status(500).json({
            error: 'Failed to fetch posts'
        })
    }
},
    // Only a post author or admin can create a post 
    createPost: async (req: Request, res: Response) => { 
        try { 
            const { title, content } = req.body;


            if (!title) { 
                return res.status(400).json({
                    error: 'Title is required'
                })
            }
            if (!content) { 
                return res.status(400).json({
                    error: 'Content is required'
                })
            }
            const authorId = req.user.id;



            const post = await prisma.post.create({ 
                data: {
                    title, 
                    content,
                    authorId
                }
            })
        
            return res.status(201).json({
                post
            })
        } catch (error) {
            console.error(`Error creating post: ${error}`)
            return res.status(500).json({
                error: 'Failed to create post'
            })
        }
    },
    updatePost: async (req: Request, res: Response) => {

    }
    , 
    // only the post author or admin can delete a post
    deletePost: async (req: Request, res:Response) => { 
        try { 

        } catch (error) {

        }
        }
}



export default postsController;
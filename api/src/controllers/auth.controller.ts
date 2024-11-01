import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';






const prisma = new PrismaClient();

const authController = {
    signup: async (req, res) => {
        try {
            const { email, password, name } = req.body;

            if (!email || !password || !name) {
                return res.status(400).json({
                    error: 'Missing required fields'
                });
            }

            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                return res.status(400).json({
                    error: 'User with this email already exists'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    role: 'READER'
                }
            });

            // Create JWT payload
            const payload = {
                userId: user.id,
                role: user.role
            };

            // Sign token using the same secret as the JwtStrategy
            const token = ExtractJwt.fromAuthHeaderWithScheme('jwt').toString();
            const signedToken = await new Promise((resolve, reject) => {
                passport.authenticate('jwt', { session: false }, (err, token) => {
                    if (err) reject(err);
                    resolve(token);
                })({ headers: { authorization: `Bearer ${payload}` }}, {}, () => {});
            });

            const { password: _, ...userWithoutPassword } = user;
            res.status(201).json({
                user: userWithoutPassword,
                token: signedToken
            });
        } catch (error) {
            console.error(`Signup error: ${error}`);
            res.status(500).json({
                error: 'Internal server error during signup'
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email and password are required'
                });
            }

            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            // Create JWT payload
            const payload = {
                userId: user.id,
                role: user.role
            };

            // Sign token using the same secret as the JwtStrategy
            const token = ExtractJwt.fromAuthHeaderWithScheme('jwt').toString();
            const signedToken = await new Promise((resolve, reject) => {
                passport.authenticate('jwt', { session: false }, (err, token) => {
                    if (err) reject(err);
                    resolve(token);
                })({ headers: { authorization: `Bearer ${payload}` }}, {}, () => {});
            });

            const { password: _, ...userWithoutPassword } = user;
            res.json({
                user: userWithoutPassword,
                token: signedToken
            });
        } catch (error) {
            console.error(`Login error: ${error}`);
            res.status(500).json({
                error: 'Internal server error during login'
            });
        }
    }
};

export default authController;
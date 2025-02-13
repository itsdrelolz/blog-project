"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCreatorRole = exports.requireRoles = exports.authMiddleware = exports.AuthError = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../../config"));
class AuthError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthError';
    }
}
exports.AuthError = AuthError;
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new AuthError('No authorization token provided');
        }
        const [type, token] = authHeader.split(' ');
        if (!token || type !== 'Bearer') {
            throw new AuthError('Invalid token format');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret || '');
            req.user = {
                id: decoded.id,
                role: decoded.role,
                email: decoded.email
            };
            next();
        }
        catch (jwtError) {
            throw new AuthError('Invalid or expired token');
        }
    }
    catch (error) {
        if (error instanceof AuthError) {
            res.status(401).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.authMiddleware = authMiddleware;
const requireRoles = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new AuthError('Authentication required');
            }
            if (!roles.includes(req.user.role)) {
                res.status(403).json({
                    error: `Access denied. Required roles: ${roles.join(' or ')}`,
                    currentRole: req.user.role,
                });
                return;
            }
            next();
        }
        catch (error) {
            if (error instanceof AuthError) {
                res.status(401).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Error checking user role' });
        }
    };
};
exports.requireRoles = requireRoles;
const checkCreatorRole = (req, res, next) => {
    try {
        if (!req.user) {
            throw new AuthError('Authentication required');
        }
        const allowedRoles = [client_1.Role.CREATOR, client_1.Role.ADMIN];
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                error: 'Access denied. Creator or Admin role required.',
                currentRole: req.user.role,
            });
            return;
        }
        next();
    }
    catch (error) {
        if (error instanceof AuthError) {
            res.status(401).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Error checking user role' });
    }
};
exports.checkCreatorRole = checkCreatorRole;

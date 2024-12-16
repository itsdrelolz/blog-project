"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_services_1 = require("../../services/auth.services");
class AuthController {
    constructor(prisma) {
        this.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, name } = req.body;
                // Validation
                if (!email || !password || !name) {
                    res.status(400).json({
                        error: 'Missing required fields',
                    });
                    return;
                }
                if (password.length < 6) {
                    res.status(400).json({
                        error: 'Password must be at least 6 characters long',
                    });
                    return;
                }
                const result = yield this.authService.createUser({
                    email,
                    password,
                    name,
                });
                res.status(201).json(result);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Email already exists') {
                    res.status(400).json({
                        error: error.message,
                    });
                    return;
                }
                console.error('Signup error:', error);
                res.status(500).json({
                    error: 'Internal server error during signup',
                });
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({
                        error: 'Email and password are required',
                    });
                    return;
                }
                const result = yield this.authService.login(email, password);
                if (!result) {
                    res.status(401).json({
                        error: 'Invalid credentials',
                    });
                    return;
                }
                res.json(result);
            }
            catch (error) {
                console.error('Login error:', error);
                res.status(500).json({
                    error: 'Internal server error during login',
                });
            }
        });
        this.authService = new auth_services_1.AuthService(prisma);
    }
}
exports.AuthController = AuthController;
exports.default = AuthController;

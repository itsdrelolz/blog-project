"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const auth_middleware_1 = require("../api/middlewares/auth.middleware");
const auth_routes_1 = __importDefault(require("../api/routes/auth.routes"));
const creator_routes_1 = __importDefault(require("../api/routes/creator.routes"));
const public_routes_1 = __importDefault(require("../api/routes/public.routes"));
exports.default = ({ app }) => {
    // Global middleware
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(passport_1.default.initialize());
    // Routes
    app.use('/auth', auth_routes_1.default);
    app.use('/public', public_routes_1.default);
    app.use('/creator', auth_middleware_1.authMiddleware, creator_routes_1.default);
    // Error handling
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong!' });
    });
    return app;
};

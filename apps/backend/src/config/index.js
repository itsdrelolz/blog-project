"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv_1.default.config();
if (envFound.error) {
    throw new Error("Couldn't find .env file");
}
exports.default = {
    port: parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000', 10),
    databaseURL: process.env._DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    logs: {
        level: process.env.LOG_LEVEL || 'info',
    },
    api: {
        prefix: '/api',
    },
};

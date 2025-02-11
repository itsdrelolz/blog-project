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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../config"));
class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
            const user = yield this.prisma.user.create({
                data: Object.assign(Object.assign({}, userData), { password: hashedPassword, role: userData.role || 'READER' }),
            });
            const token = this.generateToken(user);
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            return {
                user: userWithoutPassword,
                token,
            };
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({
                where: { email },
            });
            if (!user)
                return null;
            const isValidPassword = yield bcryptjs_1.default.compare(password, user.password);
            if (!isValidPassword)
                return null;
            const token = this.generateToken(user);
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            return {
                user: userWithoutPassword,
                token,
            };
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.user.findUnique({
                where: { email },
            });
        });
    }
    generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        return jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret || 'defaultSecret', {
            expiresIn: '24h',
        });
    }
}
exports.AuthService = AuthService;

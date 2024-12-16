"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_validator_1 = require("../validators/auth.validator");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const router = (0, express_1.Router)();
const authController = new auth_controller_1.default(prisma_1.default);
router.post('/login', auth_validator_1.authValidators.login, authController.login);
router.post('/signup', auth_validator_1.authValidators.signup, authController.signup);
exports.default = router;

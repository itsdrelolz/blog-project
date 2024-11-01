"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidators = void 0;
var express_validator_1 = require("express-validator");
exports.authValidators = {
    signup: [
        (0, express_validator_1.body)('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters'),
        (0, express_validator_1.body)('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Must be a valid email')
            .normalizeEmail(),
        (0, express_validator_1.body)('password')
            .trim()
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters')
            .matches(/[A-Z]/)
            .withMessage('Password must contain at least one uppercase letter')
            .matches(/[a-z]/)
            .withMessage('Password must contain at least one lowercase letter')
            .matches(/[0-9]/)
            .withMessage('Password must contain at least one number')
            .matches(/[!@#$%^&*(),.?":{}|<>]/)
            .withMessage('Password must contain at least one special character'),
        (0, express_validator_1.body)('confirmPassword')
            .trim()
            .notEmpty()
            .withMessage('Password confirmation is required')
            .custom(function (value, _a) {
            var req = _a.req;
            if (value !== req.body.password) {
                throw new Error('Passwords must match');
            }
            return true;
        }),
    ],
    login: [
        (0, express_validator_1.body)('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Must be a valid email')
            .normalizeEmail(),
        (0, express_validator_1.body)('password').trim().notEmpty().withMessage('Password is required'),
    ],
};

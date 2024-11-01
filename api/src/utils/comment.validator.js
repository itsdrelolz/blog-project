"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentValidators = void 0;
var express_validator_1 = require("express-validator");
exports.commentValidators = {
    createComment: [
        (0, express_validator_1.body)('title')
            .trim()
            .notEmpty()
            .withMessage('Title is Required')
            .isLength({ min: 3, max: 100 })
            .withMessage('Title must be between 3 and 100 character')
            .escape(),
        (0, express_validator_1.body)('content')
            .trim()
            .notEmpty()
            .withMessage('Content is Required')
            .isLength({ min: 10 })
            .withMessage('Content must be at least 10 characters')
            .escape()
    ],
    updatePost: [
        (0, express_validator_1.body)('title')
            .optional()
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage('Title must be between 3 and 100 characters')
            .escape(),
        (0, express_validator_1.body)('content')
            .optional()
            .trim()
            .isLength({ min: 10 })
            .withMessage('Content must be at least 10 characters')
            .escape()
    ]
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCreatorRole = void 0;
var dotenv_1 = require("dotenv");
var user_model_1 = require("../models/user.model");
dotenv_1.default.config();
// checks if user has the correct role
var checkCreatorRole = function (req, res, next) {
    try {
        if (!req.user) {
            res.status(401).json({
                error: 'Authentication required.',
            });
            return;
        }
        var allowedRoles = [user_model_1.UserRole.CREATOR, user_model_1.UserRole.ADMIN];
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
        res.status(500).json({
            error: 'Error checking user role',
        });
        return;
    }
};
exports.checkCreatorRole = checkCreatorRole;

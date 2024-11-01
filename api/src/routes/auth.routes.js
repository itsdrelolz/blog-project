"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_controller_1 = require("../controllers/auth.controller");
var auth_validator_1 = require("../utils/auth.validator");
var router = (0, express_1.Router)();
router.post('/login', auth_validator_1.authValidators.login, auth_controller_1.default.login);
router.post('/signup', auth_validator_1.authValidators.signup, auth_controller_1.default.signup);
exports.default = router;

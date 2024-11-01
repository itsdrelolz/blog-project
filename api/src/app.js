"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var auth_routes_1 = require("../src/routes/auth.routes");
var passport_1 = require("passport");
var cors_1 = require("cors");
var creator_routes_1 = require("../src/routes/creator.routes");
var public_routes_1 = require("../src/routes/public.routes");
var app = (0, express_1.default)();
dotenv_1.default.config();
var PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
// public auth routes
app.use('/api/auth', auth_routes_1.default);
// this line should be app.use(authmiddleware) we need to check if the user is signed in to be able to use the routes
// public routes
app.use('/api/public', public_routes_1.default);
// creator only routes
app.use('/api/creator', creator_routes_1.default);
app.listen(PORT, function () {
    console.log("App listening on port: ".concat(PORT));
});

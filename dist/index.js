"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
// const app = express();
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/v1/signup", async (req, res) => {
    const { username, password, email } = req.body;
    try {
        // find that user is already present or not
        const existingUser = await db_1.User.findOne({ username, email });
        // 403: User already exists
        if (existingUser) {
            res.status(403).json({ error: 'User already exists with this username' });
            return;
        }
        // Hash password and create user
        const finalPassword = await bcrypt_1.default.hash(password, 5);
        await db_1.User.create({
            username,
            email,
            password: finalPassword
        });
        // 200: Signed up successfully
        res.status(200).json({ msg: "Signed up successfully!" });
    }
    catch (err) {
        // 500: Server error
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
app.post("/api/v1/signin", (req, res) => {
});
app.post("/api/v1/content", (req, res) => {
});
app.get("/api/v1/content", (req, res) => {
});
app.delete("/api/v1/content", (req, res) => {
});
app.post("/api/v1/brain/share", (req, res) => {
});
app.get("/api/v1/brain/:shareLink", (req, res) => {
});
app.listen(3000);

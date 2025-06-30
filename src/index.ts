// const express = require('express');
// const app = express();
import express from "express";
import  bcrypt from "bcrypt";
import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { inputValidation, userMiddleware } from "./middleware";
import { ContentModel, UserModel } from "./db";
import { JWT_PASSWORD } from "./config";
const app = express();


app.use(express.json());

app.post("/api/v1/signup",  inputValidation, async (req: Request, res: Response)=> {
    const { username, password, email } = req.body;

    try {
        // find that user is already present or not
        const existingUser = await UserModel.findOne({ username, email });

        // 403: User already exists
        if (existingUser) {
            res.status(403).json({ error: 'User already exists with this username' });
            return;
        }

        // Hash password and create user
        const finalPassword = await bcrypt.hash(password, 5);

        await UserModel.create({
            username,
            email,
            password: finalPassword
        });

        // 200: Signed up successfully
        res.status(200).json({ msg: "Signed up successfully!" });

    } catch (err) {
        // 500: Server error
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/v1/signin", inputValidation, async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await UserModel.findOne({
            username
        })
        if(user){
            const token = jwt.sign({
                id: user._id
            }, JWT_PASSWORD)
            res.status(200).json({
                token: token
            })
            return;
        }
        else {
            res.status(403).json({
                msg: "Invalid Credentail"
            })
            return;
        }
    } catch (error){
        res.status(500).json({
            msg: "Internal server error"
        })
    }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const { title, tag, link, type } = req.body;
    //@ts-ignore
    const { userId } = req;

    await ContentModel.create({
        title,
        tag, 
        link, 
        type, 
        userId
    });

    res.json({
        message: "Content Post SuccessFully"
    })

});

app.get("/api/v1/content", (req, res) => {

});

app.delete("/api/v1/content", (req, res) => {

});

app.post("/api/v1/brain/share", (req, res) => {

});

app.get("/api/v1/brain/:shareLink", (req, res) => {

});


app.listen(3001);
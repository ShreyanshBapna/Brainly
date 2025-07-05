// const express = require('express');
// const app = express();
import express from "express";
import  bcrypt from "bcrypt";
import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { inputValidation, userMiddleware } from "./middleware";
import { ContentModel, LinkModel, UserModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { randomHash } from "./utiles";

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

        // password and user both are exist 
        if((user) && (user?.password)){
            const realPassword = await bcrypt.compare(password, user.password);

            if(realPassword){
                const token = jwt.sign({
                    id: user._id
                }, JWT_PASSWORD)
                res.status(200).json({
                    token: token
                })
                return;
            } else {
                res.json({
                    message: "Password is Incorrect"!!
                })
                return;
            }
          
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

app.get("/api/v1/content", userMiddleware, async(req, res) => {
    //@ts-ignore
    const { userId } = req;

    try {
      
        const content = await ContentModel.find({ 
            userId 
        }).populate("userId");

        res.status(200).json({ 
            content 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            msg: "Server Crash!!" 
        });
    }
});

app.delete("/api/v1/content", userMiddleware, async(req, res) => {
    //@ts-ignore
    const { userId } = req;
    const { contentId } = req.body;

    try {
        const result = await ContentModel.deleteOne({
            _id: contentId,
            userId
        });
     
        res.status(200).json({ 
            message: "SuccessFully Deleted!!" 
        });

    } catch (error) {
        console.error(error);
        res.json({
            message: "Server is crush"
        })
    }
});

app.post("/api/v1/brain/share", userMiddleware, async(req, res) => {
    const { share } = req.body;
    const hash = randomHash(10);
    //@ts-ignore
    const userId = req.userId;
    try{
        if(share){
            await LinkModel.create({
                hash,
                userId
            })
            res.json({
                hash: hash,
                massage: "link Created SuccessFully!!"
            })
        }
        else {
            await LinkModel.deleteOne({
                userId
            })
            res.json({
                massage: "link Deleted SuccessFully!!"
            })
        }
    } catch(error){
        res.json({
            massage: "something want Wrong"
        })
    }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const { shareLink } = req.params

    try{
        const link = await LinkModel.findOne({
            hash: shareLink
        })

        if(!link){
            res.json({
                massage: "Invalid Link"
            })
            return;
        }
        const user = await UserModel.findOne({
            _id: link.userId
        });
        
        const content = await ContentModel.find({
            userId: link.userId
        })

        res.json({
            username: user?.username,
            content
        })

    } catch(error){
        res.json({
            massage: "Server Crush!!"
        })
    }

});


app.listen(3000);
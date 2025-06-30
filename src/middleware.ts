import { string, z } from "zod";

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { JWT_PASSWORD } from "./config";

const validCridential = z.object({
    username: z.string().min(3).max(15).regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Must contain at least one special character",
    }),
    password: z.string().min(8).max(20).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[!@#$%^&*(),.?":{}|<>]/),
    email: z.string().email()
});

export function inputValidation(req: Request, res: Response, next: NextFunction){

    const parseGivenData = validCridential.safeParse(req.body)

    if(parseGivenData.success) {
        next();
    }
    else {
        res.status(411).json({
            msg : "Invalid cridentail!!",
            Error : parseGivenData.error
        })
        return; 
    }
}

export type cridential = z.infer<typeof validCridential>;

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.headers;
    try{
        const decoded = jwt.verify(token as string, JWT_PASSWORD);
        if(decoded){
            // @ts-ignore
            req.userId = decoded.id;
            next();
        } else {
            res.status(403).json({
                message: "You are not longged in"
            })
            return;
        }
    } catch (e) {
        res.status(500).json({
                message: "server crush!!"
        })
    }
}
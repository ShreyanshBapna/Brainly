"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidation = inputValidation;
const zod_1 = require("zod");
const validCridential = zod_1.z.object({
    username: zod_1.z.string().min(3).max(10).regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Must contain at least one special character",
    }),
    password: zod_1.z.string().min(8).max(20).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[!@#$%^&*(),.?":{}|<>]/),
    email: zod_1.z.string().email()
});
function inputValidation(req, res, next) {
    const parseGivenData = validCridential.safeParse(req.body);
    if (parseGivenData.success) {
        next();
    }
    else {
        res.status(411).json({
            msg: "Invalid cridentail!!",
            Error: parseGivenData.error
        });
        return;
    }
}

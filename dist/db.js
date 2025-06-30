"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = exports.Tag = exports.User = exports.Content = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
mongoose_2.default.connect('mongodb+srv://shreyansh:<db_password>@cluster0.2ek6toj.mongodb.net/Braily');
const userSchemea = new mongoose_1.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    }
});
const constentTypes = ['image', 'video', 'article', 'audio'];
const contentSchema = new mongoose_1.Schema({
    title: {
        type: String,
        require: true
    },
    link: {
        type: String,
        require: true
    },
    type: {
        type: String,
        enum: constentTypes,
        require: true
    },
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Tag' }],
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
});
const tagSchema = new mongoose_1.Schema({
    title: {
        type: String,
        require: true,
        unique: true
    }
});
const linkSchema = new mongoose_1.Schema({
    hash: {
        type: String,
        require: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    }
});
// used to interect with mongoodp 
exports.Content = (0, mongoose_1.model)('Content', contentSchema);
exports.User = (0, mongoose_1.model)('User', userSchemea);
exports.Tag = (0, mongoose_1.model)('Tag', tagSchema);
exports.Link = (0, mongoose_1.model)('Link', linkSchema);

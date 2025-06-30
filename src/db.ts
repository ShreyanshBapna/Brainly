import { string } from "zod";
import { model, Schema, ObjectId } from "mongoose";
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://shreyansh:Eshbp%402005@cluster0.2ek6toj.mongodb.net/Braily');

const userSchemea = new Schema({
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
})


const constentTypes = ['image', 'video', 'article', 'audio'];

const contentSchema = new Schema({
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

    tags: [{type: Schema.Types.ObjectId, ref:'Tag'}],
    
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        require: true
    }
})

const tagSchema = new Schema({
    title: {
        type: String,
        require: true,
        unique: true
    }
})


const linkSchema = new Schema({
    hash: {
        type: String,
        require: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

// used to interect with mongoodp 
export const ContentModel = model('Content', contentSchema); 
export const UserModel  = model('User', userSchemea);
export const TagModel  = model('Tag', tagSchema);
export const LinkModel  = model('Link', linkSchema);


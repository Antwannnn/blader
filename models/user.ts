import { HydratedDocument, Schema, model, models } from 'mongoose';
import { unique } from 'next/dist/build/utils';

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        unique: true,
        required: true,
        //match: true,
    },
    image: {
        type: String,
        default: 'default.svg'
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    averageWPM: {
        type: Number,
        default: 0,
    },

    averageAccuracy: {
        type: Number,
        default: 0,
    },

    averageErrors: {
        type: Number,
        default: 0,
    },

    totalWords: {
        type: Number,
        default: 0,
    },
},
    { timestamps: true }
);

const User = models.User || model('User', UserSchema);

export default User;
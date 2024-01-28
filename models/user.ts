import { Schema, model, models } from 'mongoose';
import { AdapterUser } from 'next-auth/adapters';

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
    },

    name: {
        type: String,
        unique: true,
        required: true,
        //match: true,
    },
    image: {
        type: String,
        default: '/assets/icons/default.png'
    },

    keyboard:{
        type: String,
        default: 'Some obscure keyboard...'
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

const registeredModel = models.User;

export default registeredModel || model<AdapterUser>('User', UserSchema);
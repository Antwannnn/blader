import { Schema, model, models } from 'mongoose';
import { AdapterUser } from 'next-auth/adapters';
import { GameResults } from '@app/types/GameResults';

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
        default: 'This user has not set a keyboard yet.'
    },

    bio: {
        type: String,
        default: 'This user has not set a bio yet.'
    },

    badges: {
        type: Array,
        default: [],
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },
},
    { timestamps: true }
);

const registeredModel = models.User;

export default registeredModel || model<AdapterUser>('User', UserSchema);
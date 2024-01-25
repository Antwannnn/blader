import { HydratedDocument, Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
        //match: true,
    },
    image: {
        type: String,
    },
},
    { timestamps: true }
);

const User = models.User || model('User', UserSchema);

export default User;
import { HydratedDocument, Schema, model, models } from 'mongoose';
import { connectToDatabase } from '@utils/database';

interface IUser {
    email: string;
    username: string;
    image: string;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        required: true,
        //match: true,
    },
    image: {
        type: String,
    },
});

const User = models.User || model('User', UserSchema);

const c: HydratedDocument<IUser> = new User({
    email: 'test',
    username: 'test',
    image: 'test',
});

export default User;
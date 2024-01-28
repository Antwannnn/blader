// Will be useful for later when we want to add more statistics to the user

import { Schema, model, models } from 'mongoose';

const UserStatisticsSchema = new Schema({

    user: {
        type: String,
        ref: 'User',
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

    totalGames: {
        type: Number,
        default: 0,
    },

    totalCharacters: {
        type: Number,
        default: 0,
    },

    totalCorrectCharacters: {
        type: Number,
        default: 0,
    },

    totalErrors: {
        type: Number,
        default: 0,
    },

});

const UserStatistics = models.UserStatistics || model('UserStatistics', UserStatisticsSchema);

export default UserStatistics;
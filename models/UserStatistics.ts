// Will be useful for later when we want to add more statistics to the user

import { Schema, model, models } from "mongoose";

const UserStatisticsSchema = new Schema({

  userRef: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Allow to avoid duplicate statistics
  uniqueHash: {
    type: String,
    required: true,
  },

  wpm: {
    type: Number,
    required: true,
  },

  accuracy: {
    type: Number,
    required: true,
  },

  totalWords: {
    type: Number,
    required: true,
  },

  totalCharacters: {
    type: Number,
    required: true,
  },

  totalErrors: {
    type: Number,
    required: true,
  },

  sentenceParameter: {
    type: String,
    required: true,
  },

  lengthParameter: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const UserStatistics =
  models.UserStatistics || model("UserStatistics", UserStatisticsSchema);

export default UserStatistics;

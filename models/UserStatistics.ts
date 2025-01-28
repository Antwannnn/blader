// Will be useful for later when we want to add more statistics to the user

import { Schema, model, models } from "mongoose";

const UserStatisticsSchema = new Schema({
  userRef: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  wpm: {
    type: Map<Date, Number>,
    default: 0,
  },

  accuracy: {
    type: Map<Date, Number>,
    default: 0,
  },

  totalWords: {
    type: Number,
    default: 0,
  },

  totalCharacters: {
    type: Number,
    default: 0,
  },

  totalErrors: {
    type: Number,
    default: 0,
  },
});

const UserStatistics =
  models.UserStatistics || model("UserStatistics", UserStatisticsSchema);

export default UserStatistics;

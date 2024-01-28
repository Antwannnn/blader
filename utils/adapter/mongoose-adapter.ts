/**
 * @file Mongoose Adapter
 * 
 * Taken from 
 */

import mongoose, {Mongoose, Model} from "mongoose";
import type {
  Adapter,
  AdapterUser,
  AdapterSession,
  VerificationToken as AdapterVerificationToken,
} from "next-auth/adapters";
import type {Account as AdapterAccount} from "next-auth";

interface MongooseAdapterModels {
  user?: Model<AdapterUser>;
  session?: Model<AdapterSession>;
  account?: Model<AdapterAccount>;
  verificationToken?: Model<AdapterVerificationToken>;
}

const MongooseAdapter = (
  dbConnect: Promise<Mongoose>,
  models?: MongooseAdapterModels
): Adapter => {
  // Load Backup Models
  if (!mongoose.models.User) {
    require("@models/User");
  }

  if (!mongoose.models.Session) {
    require("@models/Session");
  }

  if (!mongoose.models.VerificationToken) {
    require("@models/VerificationToken");
  }

  if (!mongoose.models.Account) {
    require("@models/Account");
  }

  // Models
  const User: Model<AdapterUser> = mongoose.models.User;
  const Session: Model<AdapterSession> = mongoose.models.Session;
  const VerificationToken: Model<AdapterVerificationToken> =
    mongoose.models.VerificationToken;
  const Account: Model<AdapterAccount> = mongoose.models.Account;

  // Methods
  const adaptorMethods: Adapter = {
    // These methods are required for all sign in flows:
    async createUser(data) {
      await dbConnect;
      const user = await User.create(data);
      return user;
    },

    async getUser(id) {
      await dbConnect;
      const user = await User.findById(id);
      return user;
    },

    async getUserByEmail(email) {

      await dbConnect;
      const user = await User.findOne({email});
      return user;
    },
    async getUserByAccount(data) {
        const {providerAccountId, provider} = data;
        await dbConnect;

        // Get Account
        const account = await Account.findOne({providerAccountId, provider});
        if (!account) return null;

        // Find User
        const user = await (adaptorMethods?.getUser && account.userId ? adaptorMethods.getUser(account.userId) : null);
        return user;
    },
    async updateUser(data) {
      const {id, ...restData} = data;
      await dbConnect;
      const user = await User.findByIdAndUpdate(id, restData, {
        new: true,
        runValidators: true,
        returnDocument: "after",
      });

      return user!;
    },
    async deleteUser(userId) {

      await dbConnect;
      const user = await User.findByIdAndDelete(userId);
      return user;
    },
    async linkAccount(data) {

      await dbConnect;
      const account = await Account.create(data);
      return account;
    },
    async unlinkAccount(data) {
      const {providerAccountId, provider} = data;
      await dbConnect;
      const account = await Account.findOneAndDelete({
        providerAccountId,
        provider,
      });

      if (account) return account;
    },
    async createSession(data) {

      await dbConnect;
      const session = await Session.create(data);
      return session;
    },
    async getSessionAndUser(sessionToken) {
        await dbConnect;

        // Get Session
        const session = await Session.findOne({sessionToken});
        if (!session) return null;

        // Find User
        const user = adaptorMethods?.getUser && session.userId ? await adaptorMethods.getUser(session.userId) : null;
        if (!user) return null;

        return {user, session};
    },
    async updateSession(data: { id: string, [key: string]: any }) {
        const {id, ...restData} = data;
        await dbConnect;
        const session = await Session.findByIdAndUpdate(id, restData, {
            new: true,
            runValidators: true,
        });
        return session;
    },
    async deleteSession(sessionToken) {
      await dbConnect;
      const session = await Session.findOneAndDelete({sessionToken});
      return session;
    },
    // These methods are required to support email / passwordless sign in:
    async createVerificationToken(data) {

      await dbConnect;
      const verificationToken = await VerificationToken.create(data);
      return verificationToken;
    },
    async useVerificationToken(data) {
      const {identifier, token} = data;
      await dbConnect;
      const verificationToken = await VerificationToken.findOne({
        identifier,
        token,
      });
      return verificationToken;
    },
    // ################################################################################
    // These methods will be required in a future release, but are not yet invoked:
    // async deleteUser() {
    //   return;
    // },
    // async unlinkAccount() {
    //   return;
    // },
  };

  return adaptorMethods;
};

export default MongooseAdapter;
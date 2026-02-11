import { UserModel } from "../models/user.model.js";
import { cartModel } from "./models/cartModel.js";

class userDBManager {
  async getUserByEmail(email) {
    return UserModel.findOne({ email });
  }

  async getUserByID(uid) {
    return UserModel.findById(uid);
  }

  async createUser(userData) {
    const cart = await cartModel.create({ products: [] });
    return UserModel.create({ ...userData, cart: cart._id });
  }
}

export { userDBManager };

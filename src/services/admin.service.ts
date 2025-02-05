import { User } from "../models/user.model";

export class AdminService {
  static async fetchUsers() {
    const users = await User.find().select({ password: 0 });
    return users;
  }
}

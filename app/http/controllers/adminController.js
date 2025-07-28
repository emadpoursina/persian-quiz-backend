import User from "../../models/user.js";
import { validateUser } from "../../models/user.js";

const adminController = {
  // 9. Get all users
  async getAllUsers(req, res) {
    const {
      limit = 20,
      page = 1,
      searchTerm = "", // include in name, email
      role = "all", // possible values: all, user, admin
      status = "all",
    } = req.query;

    try {
      // Build filter for searchTerm in name or email
      let filter = {};

      // Search term filter
      if (searchTerm && searchTerm.trim() !== "") {
        const regex = new RegExp(searchTerm, "i");
        filter.$or = [
          { name: { $regex: regex } },
          { email: { $regex: regex } },
        ];
      }

      // Role filter
      if (role && role !== "all") {
        filter.role = role;
      }

      // Status filter
      if (status && status !== "all") {
        status == "active"
          ? (filter.isActive = true)
          : (filter.isActive = false);
      }

      // Parse pagination parameters, with defaults
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        pagination: parseInt(limit) !== -1,
      };

      const users = await User.paginate(filter, options);

      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 10. Get a single user
  async getUser(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 11. Remove a user
  async removeUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json({ message: "User removed", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 12. Edit a user
  async editUser(req, res) {
    try {
      // If password is present, hash it
      if (req.body.password) {
        req.body.password = await User.hashPassword(req.body.password);
      }
      // Check for duplicate email if email is being changed
      if (req.body.email) {
        const existing = await User.findOne({ email: req.body.email });
        if (existing && existing._id.toString() !== req.params.userId) {
          return res.status(409).json({ error: "duplicated email" });
        }
      }
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
        new: true,
      });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // 13. Create a user
  async createUser(req, res) {
    // Validate input
    const { error } = validateUser({ ...req.body, joinDate: new Date() });
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
      // Check for existing email
      const existing = await User.findOne({ email: req.body.email });
      if (existing)
        return res.status(409).json({ error: "Email already registered" });
      // Hash password
      req.body.password = await User.hashPassword(req.body.password);
      // Create user
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role || "user",
        avatar: req.body.avatar,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        joinDate: new Date(),
      });
      await user.save();
      // Remove password from response
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).json(userObj);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default adminController;

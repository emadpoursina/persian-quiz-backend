import Controller from "../controller.js";
import User from "../../../models/user.js";

class registerController extends Controller {
  async register(req, res) {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email already registered." });
      }

      // Create new user
      const newUser = new User({
        name,
        email,
        password: "", // will hash below
        joinDate: Date.now(),
      });
      newUser.password = newUser.hashPassword(password);
      await newUser.save();

      // Generate JWT token
      const token = newUser.generateAuthToken();

      // Prepare response (omit password)
      const userResponse = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
        role: newUser.role,
      };

      // Set JWT token in response header
      res.setHeader("X-Auth-Token", token);

      res
        .status(201)
        .json({ message: "User registered successfully", user: userResponse });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
}

export default new registerController();

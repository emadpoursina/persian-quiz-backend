import Controller from "../controller.js";
import User from "../../../models/User.js";

class loginController extends Controller {
  async login(req, res, next) {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ message: "Invalid credentials." });

      const isMatch = user.comparePassword(password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials." });

      const token = user.generateAuthToken();

      // Send user info and token in response
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        isActive: user.isActive,
      };

      // Set JWT token in response header
      res.setHeader("X-Auth-Token", token);
      // Expose X-Auth-Token header to the frontend
      res.setHeader("Access-Control-Expose-Headers", "X-Auth-Token");

      res
        .status(200)
        .json({ message: "Login successful", token, user: userResponse });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
}

export default new loginController();

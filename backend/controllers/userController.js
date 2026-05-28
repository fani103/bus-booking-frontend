const User = require("../models/User");

exports.loginOrCreateUser = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    // Validate input
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Valid name is required" });
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Valid 10-digit phone number is required" });
    }

    let user = await User.findOne({ phone });

    // Create new user
    if (!user) {
      user = await User.create({
        name: name.trim(),
        phone,
        email: email || ""
      });
    } 
    // Update existing user
    else {
      user.name = name.trim();
      if (email) user.email = email;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again."
    });
  }
};
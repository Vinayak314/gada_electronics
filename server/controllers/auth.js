import User from "../models/User.js";

export const login = async (req, res) => {
  const { uid, email, name, picture } = req.user;

  try {
    let user = await User.findById(uid);

    if (!user) {
      user = await User.create({
        _id: uid,
        email,
        name,
        photoURL: picture,
      });
    } else {
      if (user.photoURL !== picture) {
        user.photoURL = picture;
      }
      user.lastActiveAt = new Date();
      await user.save();
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        photoURL: user.photoURL,
        tokens: user.tokens,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


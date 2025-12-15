import User from "../models/User.js";

export const login =  async (req, res) => {
  const { uid, email, name } = req.user;

  try {
    let user = await User.findById(uid);

    if (!user) {
      user = await User.create({
        _id: uid,
        email,
        name,
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.uid);
  res.json(user);
};


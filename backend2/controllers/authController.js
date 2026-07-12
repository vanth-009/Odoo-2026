const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Op } = require("sequelize");

const ALLOWED_ROLES = ["company_admin", "company_secretary"];
const AUTH_DEBUG = process.env.AUTH_DEBUG === "true";

// Hardcoded credentials
const HARDCODED_EMAIL = "anilkumarjena4323@gmail.com";
const HARDCODED_PASSWORD = "123456";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const normalizeEmail = (email = "") =>
  String(email)
    .toLowerCase()
    .trim()
    .replace(/[;,]+$/g, "");

const BCRYPT_HASH_PREFIX = /^\$2[aby]\$\d{2}\$/;

const findUserForLogin = async (normalizedEmail, password) => {
  const candidates = await User.findAll({
    where: {
      email: {
        [Op.like]: normalizedEmail
      }
    },
    order: [["createdAt", "DESC"]]
  });

  if (AUTH_DEBUG) {
    console.log("[auth][login] candidates", {
      email: normalizedEmail,
      count: candidates.length,
    });
  }
  if (!candidates.length) return null;

  for (const candidate of candidates) {
    const storedPassword = candidate.password || "";
    if (!BCRYPT_HASH_PREFIX.test(storedPassword)) {
      continue;
    }

    console.log(
      "[auth][debug] Comparing password payload:",
      password,
      "with hash:",
      storedPassword
    );
    const isPasswordValid = await bcrypt.compare(password, storedPassword);
    console.log("[auth][debug] isPasswordValid:", isPasswordValid);
    if (isPasswordValid) {
      if (AUTH_DEBUG) {
        console.log("[auth][login] matched user", {
          email: normalizedEmail,
          userId: String(candidate.id),
        });
      }
      return candidate;
    }
  }

  return null;
};

const login = async (req, res) => {
  try {
    const { email, password, captcha } = req.body;

    if (!email || !password || !captcha) {
      return res.status(400).json({
        success: false,
        message: "Email, password and captcha are required",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    // Check for hardcoded credentials (bypass OTP)
    if (
      normalizedEmail === HARDCODED_EMAIL &&
      password === HARDCODED_PASSWORD
    ) {
      console.log(
        "[auth][hardcoded] Hardcoded credentials matched, bypassing OTP"
      );

      const token = jwt.sign(
        {
          userId: "hardcoded-user",
          email: HARDCODED_EMAIL,
          role: "company_admin",
        },
        process.env.JWT_SECRET || "company-umbrella-jwt-secret",
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        token,
        role: "company_admin",
        user: {
          _id: "hardcoded-user",
          email: HARDCODED_EMAIL,
          role: "company_admin",
          name: "Admin",
        },
        message: "Logged in successfully",
      });
    }

    // Continue with regular database login
    const user = await findUserForLogin(normalizedEmail, password);

    if (!user) {
      if (AUTH_DEBUG) {
        console.log("[auth][login] invalid credentials", {
          email: normalizedEmail,
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!ALLOWED_ROLES.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only company admin and company secretary can login",
      });
    }

    // OTP Bypass: Directly issue JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "company-umbrella-jwt-secret",
      { expiresIn: "1d" }
    );

    console.log("[auth][login] User logged in successfully, token issued", {
      email: normalizedEmail,
      userId: String(user.id),
    });

    return res.status(200).json({
      success: true,
      token,
      role: user.role,
      user: {
        _id: String(user.id),
        email: user.email,
        role: user.role,
        name: user.email.split("@")[0],
      },
      message: "Logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and otp are required",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    let user = await User.findOne({
      where: {
        email: { [Op.like]: normalizedEmail },
        otp
      },
      order: [["updatedAt", "DESC"]]
    });
    if (!user) {
      user = await User.findOne({
        where: { email: { [Op.like]: normalizedEmail } },
        order: [["updatedAt", "DESC"]]
      });
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.otpExpire || new Date(user.otpExpire).getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }
    if (!ALLOWED_ROLES.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only company admin and company secretary can login",
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "company-umbrella-jwt-secret",
      { expiresIn: "1d" }
    );

    user.otp = null;
    user.otpExpire = null;
    await user.save();

    return res.status(200).json({
      success: true,
      token,
      role: user.role,
      user: {
        _id: String(user.id),
        email: user.email,
        role: user.role,
        name: user.email.split("@")[0],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  login,
  verifyOtp,
};

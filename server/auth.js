import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// A real deploy must set JWT_SECRET so sessions survive a server restart and
// can't be forged by anyone who guesses a default. Local dev without it still
// works, signing with a secret that's regenerated (and logged) on every boot.
const JWT_SECRET =
  process.env.JWT_SECRET ??
  (() => {
    const generated = crypto.randomBytes(32).toString("hex");
    console.warn(
      "JWT_SECRET is not set — using a random secret for this process only. " +
        "Existing logins will be invalidated on every restart. Set JWT_SECRET in server/.env for real use.",
    );
    return generated;
  })();

const TOKEN_TTL = "30d";
const SALT_ROUNDS = 10;

export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL },
  );
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Sign in required" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch {
    res.status(401).json({ error: "Session expired, please sign in again" });
  }
}

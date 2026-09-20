import { config } from "../config/config.js";
import jwt from "jsonwebtoken";

export function createAccessToken({ userId, role }) {
  const accessToken = jwt.sign(
    {
      userId,
      role,
    },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: "15Min" },
  );

  return accessToken;
}

export function createRefreshToken({ userId, role }) {
  const refreshToken = jwt.sign(
    {
      userId,
      role,
    },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: "7Days" },
  );

  return refreshToken;
}

export function readAccessToken(accessToken) {
  const decoded = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET)
  return decoded
}

export function readRefreshToken(refreshToken) {
  const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET)
  return decoded
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokens = (payload) => {
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'fallback_secret';
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';
    const accessToken = jsonwebtoken_1.default.sign(payload, accessTokenSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' });
    const refreshToken = jsonwebtoken_1.default.sign(payload, refreshTokenSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
const verifyAccessToken = (token) => {
    const secret = process.env.JWT_ACCESS_SECRET || 'fallback_secret';
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    const secret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=jwt.js.map
import jwt from 'jsonwebtoken';
export const generateTokens = (payload) => {
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'fallback_secret';
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';
    const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
    return { accessToken, refreshToken };
};
export const verifyAccessToken = (token) => {
    const secret = process.env.JWT_ACCESS_SECRET || 'fallback_secret';
    return jwt.verify(token, secret);
};
export const verifyRefreshToken = (token) => {
    const secret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';
    return jwt.verify(token, secret);
};
//# sourceMappingURL=jwt.js.map
export const authConfing = () => ({
  access: process.env.ACCESS_SECRET,
  refresh: process.env.REFRESH_SECRET,
  accessExpireTime: process.env.JWT_ACCESS_EXPIRE_TIME,
  refreshExpireTime: process.env.JWT_REFRESH_EXPIRE_TIME,
  cookieMaxAge: parseInt(process.env.COOKIE_MAX_AGE),
});

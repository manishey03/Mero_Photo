export const jwtConfig = {
  access: {
    secret: process.env.JWT_SECRET ?? 'this_is_access_secret',
    expiration: Number(process.env.JWT_EXPIRATION) || 360000,
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET ?? 'this_is_refresh_secret',
    expiration: process.env.JWT_REFRESH_EXPIRATION ?? '10d',
  },
};

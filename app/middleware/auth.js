const { isTokenValid } = require("../utils");
const CustomError = require("../errors");

const authenticateUser = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }

    const payload = isTokenValid({ token });

    req.user = {

      username: payload.username,
      userId: payload.userId,
      role: payload.role,
      email: payload.email,
      avatar: payload.avatar,
      avatarUrl: payload.avatarUrl,
    };
    next();
  } catch (error) {
    next(error);
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = {
    authenticateUser,
    authorizeRoles
}
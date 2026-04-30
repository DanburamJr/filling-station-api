import { User } from "../models/index.js";
import ApiError from "../utils/api-error.js";
import { verifyToken } from "../utils/jwt.js";

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authorization token is required");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    const user = await User.findByPk(payload.userId);
    if (!user) {
      throw new ApiError(401, "Invalid token: user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, "Invalid or expired token"));
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthenticated request"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Access denied for your role"));
    }

    return next();
  };
}

export {
  authenticate,
  authorize
};

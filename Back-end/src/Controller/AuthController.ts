import { NextFunction, Request, Response } from "express";
import User,{IUser} from "../Model/User";
import jwt from "jsonwebtoken";
import { env } from "node:process";
import dotenv from "dotenv";
import AppError from "../utils/AppError";
import crypto from "node:crypto";
import Email from "../utils/email";
dotenv.config({ path: "./config.env" });
export const signToken = (id: string): string => {
  console.log(env.JWT_SECRET)
  return jwt.sign({ id }, env.JWT_SECRET!, {
    expiresIn: env.JWT_EXPIRES_IN!,
  });
};
export const createSendToken = (
  user: IUser,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + Number(env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
   user.password=undefined
  res.status(statusCode).json({
    status: "succes",
    token,
    data: {
      user,
    },
  });
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  createSendToken(user, 201, req, res);
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new Error("'Please provide email and password!', 400"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password as string ))) {
    return next(new Error("Incorrect Email or Password"));
  }
  createSendToken(user, 200, req, res);
};



export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address", 404));
  }
  try {
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();

    // Save the user with the reset token and its expiration
    await user.save({ validateBeforeSave: false });

    // 3) Send it to the user's email (Here we only send it in response for testing)
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    // Normally, you'd use a mail service like Nodemailer
    res.status(200).json({
      status: "success",
      message: "Password reset token sent!",
      resetURL, // For testing
    });
  } catch (error) {
    // 4) Reset fields if error occurs
    console.error("Error during password reset:", error);

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the reset token. Try again later!",
        500
      )
    );
  }
};
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  console.log(user);
  if (!user) {
    return next(new AppError("Token is invalid or has expried", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, req, res);
};
export interface AuthRequest extends Request {
  user?: IUser; // Extending Request to include user info
}
export const UpdatePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // 1) Get user from collection
  if (!req.user || !req.user.id) {
    return next(new AppError("You are not logged in!", 401));
  }

  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // 2) Check if POSTed current password is correct
  const isPasswordCorrect = await user.comparePassword(
    req.body.passwordCurrent,
    user.password as string
  );

  if (!isPasswordCorrect) {
    return next(new AppError("Your current password is wrong.", 401));
  }
  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // Triggers pre-save middleware for hashing
  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
};
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }else if(req.cookies.jwt){
    token=req.cookies.jwt
  }
  // Ensure JWT_SECRET is defined
  if (!env.JWT_SECRET) {
    return next(new AppError('tokeen is not defined in the environment variables.', 500));
  }
  // 2) Verification token
  const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat as number)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser.toObject() as IUser;
  res.locals.user = currentUser;
  next();
};

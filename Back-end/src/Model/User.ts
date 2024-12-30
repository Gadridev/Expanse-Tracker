import { Document, Model, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

// User Interface
export interface IUser extends Document {
  _id:string;
  name: string;
  email: string;
  password?: string;
  passwordConfirm?: string;
  role?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: Date;
  comparePassword(candidatePassword: string,userPassword:string): Promise<boolean>;
  createPasswordResetToken(): string;
  changePasswordAfter(JWTTimestamp: number): boolean;
}

// User Schema
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
        },
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, `Password must be at least 6 characters long`],
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (this: IUser, el: string): boolean {
          return el === this.password;
        },
        message: "Passwords do not match",
      },
    },
    role: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password
UserSchema.pre<IUser>("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password") || !this.password) return next();
  // Generate a salt and hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // Clear passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function ( 
  candidatePassword: string,userPassword:string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword,userPassword );
};

UserSchema.methods.createPasswordResetToken = function (this: IUser) {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

UserSchema.methods.changePasswordAfter = function (this: IUser, JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changeTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changeTimestamp;
  }
  return false;
};

// Create and export the model
const User = model<IUser>("User", UserSchema);
export default User;
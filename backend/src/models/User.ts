import mongoose, { Document, Schema, CallbackWithoutResultAndOptionalError } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "member";
  avatarColor: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const AVATAR_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#3b82f6", "#ef4444", "#14b8a6",
];

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    avatarColor: {
      type: String,
      default: () =>
        AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ret as any).password = undefined;
        return ret;
      },
    },
  }
);

// Hash password before save — Mongoose v9: async hooks don't use next()
UserSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);

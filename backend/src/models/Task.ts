import mongoose, { Document, Schema } from "mongoose";

export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface ITask extends Document {
  title: string;
  description: string;
  project: mongoose.Types.ObjectId;
  assignee: mongoose.Types.ObjectId | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  createdBy: mongoose.Types.ObjectId;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    assignee: { type: Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);

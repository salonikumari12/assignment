import { Calendar, Edit2, Trash2 } from "lucide-react";
import type { Task } from "../types";
import { useAuth } from "../context/AuthContext";

export type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: Task["status"]) => void;
}

const statusLabel: Record<Task["status"], string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const { user } = useAuth();
  const isOverdue =
    task.dueDate &&
    task.status !== "done" &&
    new Date(task.dueDate) < new Date();

  return (
    <div className="bg-[#13131a] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200 hover:border-white/15 hover:shadow-[0_4px_24px_rgba(99,102,241,0.06)]">
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-[15px] font-semibold text-[#f1f1f5] leading-snug flex-1">
          {task.title}
        </h3>
        <div className="flex gap-1 shrink-0">
          {user?.role === "admin" && onEdit && (
            <button
              className="bg-transparent text-[#9191a8] border border-white/10 hover:bg-[#1a1a24] hover:text-[#f1f1f5] hover:border-white/15 px-2 py-1.5 text-xs rounded-lg inline-flex items-center justify-center cursor-pointer transition-all focus:outline-none"
              onClick={() => onEdit(task)}
              title="Edit"
            >
              <Edit2 size={13} />
            </button>
          )}
          {user?.role === "admin" && onDelete && (
            <button
              className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 px-2 py-1.5 text-xs rounded-lg inline-flex items-center justify-center cursor-pointer transition-all focus:outline-none"
              onClick={() => onDelete(task._id)}
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-[13px] text-[#5a5a72] leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Badges row */}
      <div className="flex gap-1.5 flex-wrap items-center">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            task.status === "todo" ? "bg-[#9191a8]/15 text-[#9191a8]" :
            task.status === "in-progress" ? "bg-blue-500/15 text-blue-400" :
            "bg-emerald-500/15 text-emerald-400"
          }`}
        >
          {statusLabel[task.status]}
        </span>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
            task.priority === "low" ? "bg-emerald-500/15 text-emerald-400" :
            task.priority === "medium" ? "bg-amber-500/15 text-amber-400" :
            "bg-red-500/15 text-red-400"
          }`}
        >
          {task.priority}
        </span>
        {task.project?.name && (
          <span className="text-[11px] text-[#5a5a72] bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
            {task.project.name}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-auto pt-1">
        {/* Assignee */}
        {task.assignee ? (
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
              style={{ background: task.assignee.avatarColor }}
            >
              {task.assignee.name[0].toUpperCase()}
            </div>
            <span className="text-xs text-[#5a5a72]">
              {task.assignee.name}
            </span>
          </div>
        ) : (
          <span className="text-xs text-[#5a5a72]">Unassigned</span>
        )}

        {/* Due date */}
        {task.dueDate && (
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-500" : "text-[#5a5a72]"}`}>
            <Calendar size={12} />
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        )}
      </div>

      {/* Quick status change */}
      {onStatusChange && task.status !== "done" && (
        <select
          className="w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-xs font-sans transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none cursor-pointer mt-1"
          value={task.status}
          onChange={(e) =>
            onStatusChange(task._id, e.target.value as Task["status"])
          }
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      )}
    </div>
  );
};

export default TaskCard;

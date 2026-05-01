import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../lib/api";
import type { Task } from "../types";
import toast from "react-hot-toast";

interface Member {
  _id: string;
  name: string;
  email: string;
  avatarColor: string;
}

interface Project {
  _id: string;
  name: string;
  members: Member[];
}

interface TaskModalProps {
  task?: Task | null;
  projectId?: string;
  projects?: Project[];
  onClose: () => void;
  onSave: (task: Task) => void;
}

const TaskModal = ({ task, projectId, projects = [], onClose, onSave }: TaskModalProps) => {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    project: projectId || task?.project?._id || "",
    assignee: (task?.assignee as any)?._id || "",
    status: task?.status || "todo",
    priority: task?.priority || "medium",
    dueDate: task?.dueDate ? task.dueDate.substring(0, 10) : "",
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (form.project) {
      const found = projects.find((p) => p._id === form.project);
      if (found) {
        setMembers(found.members);
      } else {
        api.get(`/projects/${form.project}`).then((r) => {
          setMembers(r.data.project?.members || []);
        }).catch(() => {});
      }
    }
  }, [form.project, projects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.project) return toast.error("Project is required");

    setSaving(true);
    try {
      const payload = {
        ...form,
        assignee: form.assignee || null,
        dueDate: form.dueDate || null,
      };

      const res = task
        ? await api.put(`/tasks/${task._id}`, payload)
        : await api.post("/tasks", payload);

      toast.success(task ? "Task updated!" : "Task created!");
      onSave(res.data);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease]" onClick={onClose}>
      <div className="bg-[#13131a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-[slideUp_0.2s_ease]" onClick={(e) => e.stopPropagation()}>
        <div className="pt-6 px-6 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#f1f1f5]">
            {task ? "Edit Task" : "New Task"}
          </h2>
          <button className="bg-transparent border border-white/10 text-[#9191a8] hover:bg-[#1a1a24] hover:text-[#f1f1f5] hover:border-white/15 p-1.5 rounded-lg transition-all focus:outline-none cursor-pointer" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#9191a8] mb-1.5">Title *</label>
            <input
              id="task-title"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none"
              placeholder="Task title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#9191a8] mb-1.5">Description</label>
            <textarea
              id="task-description"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none resize-y min-h-[80px]"
              placeholder="Describe the task..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {!projectId && (
            <div>
              <label className="block text-[13px] font-medium text-[#9191a8] mb-1.5">Project *</label>
              <select
                id="task-project"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none cursor-pointer"
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value, assignee: "" })}
              >
                <option value="">Select project...</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-[#9191a8] mb-1.5">Status</label>
              <select
                id="task-status"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none cursor-pointer"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Task["status"] })}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#9191a8] mb-1.5">Priority</label>
              <select
                id="task-priority"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none cursor-pointer"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as Task["priority"] })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-[#9191a8] mb-1.5">Assignee</label>
              <select
                id="task-assignee"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none cursor-pointer"
                value={form.assignee}
                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#9191a8] mb-1.5">Due Date</label>
              <input
                id="task-duedate"
                type="date"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none color-scheme-dark"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2.5 justify-end pt-1">
            <button type="button" className="bg-transparent border border-white/10 text-[#9191a8] hover:bg-[#1a1a24] hover:text-[#f1f1f5] hover:border-white/15 px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] hover:-translate-y-px px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-none" disabled={saving}>
              {saving ? "Saving..." : task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

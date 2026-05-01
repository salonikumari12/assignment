import React, { useState } from "react";
import { X } from "lucide-react";
import api from "../lib/api";
import toast from "react-hot-toast";

interface Project {
  _id: string;
  name: string;
  description: string;
  owner: any;
  members: any[];
}

interface ProjectModalProps {
  project?: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const ProjectModal = ({ project, onClose, onSave }: ProjectModalProps) => {
  const [form, setForm] = useState({
    name: project?.name || "",
    description: project?.description || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Project name is required");

    setSaving(true);
    try {
      const res = project
        ? await api.put(`/projects/${project._id}`, form)
        : await api.post("/projects", form);

      toast.success(project ? "Project updated!" : "Project created!");
      onSave(res.data);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease]" onClick={onClose}>
      <div className="bg-[#13131a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-[slideUp_0.2s_ease]" onClick={(e) => e.stopPropagation()}>
        <div className="pt-6 px-6 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#f1f1f5]">
            {project ? "Edit Project" : "New Project"}
          </h2>
          <button className="bg-transparent border border-white/10 text-[#9191a8] hover:bg-[#1a1a24] hover:text-[#f1f1f5] hover:border-white/15 p-1.5 rounded-lg transition-all focus:outline-none cursor-pointer" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#9191a8] mb-1.5">Project Name *</label>
            <input
              id="project-name"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none"
              placeholder="e.g. Website Redesign"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#9191a8] mb-1.5">Description</label>
            <textarea
              id="project-description"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none resize-y min-h-[80px]"
              placeholder="What is this project about?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="flex gap-2.5 justify-end mt-2">
            <button type="button" className="bg-transparent border border-white/10 text-[#9191a8] hover:bg-[#1a1a24] hover:text-[#f1f1f5] hover:border-white/15 px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] hover:-translate-y-px px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-none" disabled={saving}>
              {saving ? "Saving..." : project ? "Update" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;

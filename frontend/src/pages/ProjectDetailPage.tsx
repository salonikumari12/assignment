import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import type { Task } from "../types";
import TaskModal from "../components/TaskModal";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Plus, Users, Trash2, UserPlus, X } from "lucide-react";
import toast from "react-hot-toast";

interface Project {
  _id: string;
  name: string;
  description: string;
  members: any[];
}

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [addEmail, setAddEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.project);
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error("Project not found");
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm("Delete this project and all its tasks?")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted");
      navigate("/projects");
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(`/projects/${id}/members`, { email: addEmail });
      setProject(res.data);
      setAddEmail("");
      toast.success("Member added");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (uid: string) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      const res = await api.delete(`/projects/${id}/members/${uid}`);
      setProject(res.data);
      toast.success("Member removed");
    } catch (err) {
      toast.error("Failed to remove member");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { status });
      setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
      toast.success("Status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <Layout><div className="p-8 text-[#9191a8]">Loading...</div></Layout>;
  if (!project) return null;

  const columns: { id: Task["status"]; title: string }[] = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  return (
    <Layout>
      <div className="p-8 h-full flex flex-col gap-6 w-full animate-[fadeIn_0.3s_ease]">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#f1f1f5] mb-2">
              {project.name}
            </h1>
            <p className="text-[#9191a8] text-sm max-w-2xl leading-relaxed">
              {project.description || "No description provided."}
            </p>
          </div>
          <div className="flex gap-2">
            {user?.role === "admin" && (
              <>
                <button
                  className="bg-transparent border border-red-500/20 text-red-500 hover:bg-red-500/10 px-3 py-2 text-sm font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  onClick={handleDeleteProject}
                >
                  <Trash2 size={16} /> Delete
                </button>
                <button
                  className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] hover:-translate-y-px px-4 py-2.5 text-sm font-medium rounded-lg inline-flex items-center gap-2 transition-all cursor-pointer border-none"
                  onClick={() => {
                    setEditTask(null);
                    setShowTaskModal(true);
                  }}
                >
                  <Plus size={16} /> Add Task
                </button>
              </>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-[#13131a] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-[#9191a8]" />
            <h3 className="text-sm font-semibold text-[#f1f1f5]">Team Members</h3>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {project.members.map((m) => (
              <div key={m._id} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full py-1 pl-1 pr-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: m.avatarColor }}
                >
                  {m.name[0].toUpperCase()}
                </div>
                <span className="text-xs text-[#f1f1f5]">{m.name}</span>
                {user?.role === "admin" && (
                  <button
                    className="bg-transparent border-none text-[#5a5a72] hover:text-red-500 cursor-pointer flex items-center justify-center p-0.5"
                    onClick={() => handleRemoveMember(m._id)}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {user?.role === "admin" && (
            <form onSubmit={handleAddMember} className="flex gap-2 mt-4">
              <input
                id="add-member-email"
                className="flex-1 max-w-[240px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none"
                placeholder="Username or email"
                type="text"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
              />
              <button type="submit" className="bg-white/5 border border-white/10 text-[#f1f1f5] hover:bg-[#1a1a24] hover:border-white/15 px-3 py-1.5 text-sm font-medium rounded-lg inline-flex items-center gap-1.5 transition-all cursor-pointer">
                <UserPlus size={14} /> Add
              </button>
            </form>
          )}
        </div>

        {/* Kanban Board */}
        <div className="flex-1 flex gap-5 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="min-w-[300px] w-[300px] flex flex-col gap-3">
                <div className="flex items-center justify-between mb-1 px-1">
                  <h3 className="text-[13px] font-bold text-[#9191a8] uppercase tracking-wider">
                    {col.title}
                  </h3>
                  <span className="bg-[#1a1a24] text-[#9191a8] text-xs font-semibold px-2 py-0.5 rounded-full border border-white/5">
                    {colTasks.length}
                  </span>
                </div>
                {colTasks.length === 0 ? (
                  <div className="text-[13px] text-[#5a5a72] text-center py-6 border-2 border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                    No tasks
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {colTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onEdit={(t) => {
                          setEditTask(t);
                          setShowTaskModal(true);
                        }}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showTaskModal && (
        <TaskModal
          task={editTask}
          projectId={project._id}
          projects={[project]}
          onClose={() => setShowTaskModal(false)}
          onSave={(t) => {
            if (editTask) {
              setTasks(tasks.map((x) => (x._id === t._id ? t : x)));
            } else {
              setTasks([t, ...tasks]);
            }
          }}
        />
      )}
    </Layout>
  );
};

export default ProjectDetailPage;

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import type { Task } from "../types";
import TaskModal from "../components/TaskModal";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { CheckSquare, Plus, Filter } from "lucide-react";
import toast from "react-hot-toast";

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterProject, setFilterProject] = useState("");

  useEffect(() => {
    fetchData();
  }, [filterStatus, filterPriority, filterProject]);

  const fetchData = async () => {
    try {
      const [taskRes, projRes] = await Promise.all([
        api.get("/tasks", {
          params: {
            status: filterStatus,
            priority: filterPriority,
            project: filterProject,
          },
        }),
        api.get("/projects"),
      ]);
      setTasks(taskRes.data);
      setProjects(projRes.data);
    } catch (err) {
      toast.error("Failed to load data");
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

  return (
    <Layout>
      <div className="p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#f1f1f5] flex items-center gap-2.5">
              <CheckSquare className="text-indigo-500" /> All Tasks
            </h1>
            <p className="text-[#9191a8] mt-1 text-sm">
              Manage and track tasks across all your projects.
            </p>
          </div>
          {user?.role === "admin" && (
            <button
              className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] hover:-translate-y-px px-4 py-2.5 text-sm font-medium rounded-lg inline-flex items-center gap-2 transition-all cursor-pointer border-none"
              onClick={() => {
                setEditTask(null);
                setShowModal(true);
              }}
            >
              <Plus size={16} /> New Task
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-[#13131a] border border-white/10 rounded-2xl p-4 flex gap-4 flex-wrap items-center">
          <div className="flex items-center gap-2 text-[#9191a8] font-medium text-sm mr-2">
            <Filter size={16} /> Filters:
          </div>

          <select
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none cursor-pointer min-w-[140px]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none cursor-pointer min-w-[140px]"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none cursor-pointer min-w-[140px]"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map((p: any) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="text-center py-16 text-[#5a5a72] bg-[#13131a] border border-white/10 rounded-2xl">
            <CheckSquare size={48} className="mx-auto mb-4 opacity-20" />
            <p>No tasks match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={(t) => {
                  setEditTask(t);
                  setShowModal(true);
                }}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={editTask}
          projects={projects}
          onClose={() => setShowModal(false)}
          onSave={() => {
            fetchData(); // Simplest way to ensure sorting/filtering applies
          }}
        />
      )}
    </Layout>
  );
};

export default TasksPage;

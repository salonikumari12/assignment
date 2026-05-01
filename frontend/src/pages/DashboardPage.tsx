import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import type { Task } from "../types";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FolderKanban,
  ListTodo,
} from "lucide-react";

interface DashboardStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
  projectCount: number;
  recentTasks: Task[];
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api.get("/tasks/dashboard").then((res) => {
      setStats(res.data);
    }).catch(() => {});
  }, []);

  if (!stats) return <Layout><div className="p-8 text-[#9191a8]">Loading...</div></Layout>;

  const progress = stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);

  return (
    <Layout>
      <div className="p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-8 animate-[fadeIn_0.3s_ease]">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[#f1f1f5]">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-[#9191a8]">
            Here's what's happening in your workspace today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Tasks"
            value={stats.total}
            icon={ListTodo}
            color="#6366f1"
            bgColor="rgba(99,102,241,0.15)"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={Clock}
            color="#3b82f6"
            bgColor="rgba(59,130,246,0.15)"
          />
          <StatCard
            label="Completed"
            value={stats.done}
            icon={CheckCircle}
            color="#10b981"
            bgColor="rgba(16,185,129,0.15)"
          />
          <StatCard
            label="Overdue"
            value={stats.overdue}
            icon={AlertCircle}
            color="#ef4444"
            bgColor="rgba(239,68,68,0.15)"
            subtitle="Needs attention"
          />
        </div>

        {/* Progress & Projects Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Progress Card */}
          <div className="lg:col-span-2 bg-[#13131a] border border-white/10 rounded-2xl p-6">
            <h2 className="text-[17px] font-semibold text-[#f1f1f5] mb-6">
              Overall Progress
            </h2>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-4xl font-bold text-[#f1f1f5] leading-none">
                {progress}%
              </span>
              <span className="text-sm text-[#9191a8] mb-1">completed</span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#5a5a72] mt-3">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-[#13131a] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 flex items-center justify-center mb-4">
              <FolderKanban size={28} className="text-indigo-500" />
            </div>
            <h3 className="text-3xl font-bold text-[#f1f1f5] mb-1">
              {stats.projectCount}
            </h3>
            <p className="text-sm text-[#9191a8]">Active Projects</p>
          </div>
        </div>

        {/* Recent Tasks */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-[17px] font-semibold text-[#f1f1f5]">
              Recent Tasks
            </h2>
          </div>
          {stats.recentTasks.length === 0 ? (
            <div className="text-center py-12 text-[#5a5a72] bg-[#13131a] border border-white/10 rounded-2xl">
              No tasks found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.recentTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  LogOut,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    { to: "/tasks", label: "All Tasks", icon: CheckSquare },
  ];

  return (
    <aside className="w-60 min-h-screen bg-[#0f0f16] border-r border-white/10 flex flex-col p-5 fixed top-0 left-0 z-30">
      {/* Brand */}
      <div className="px-3 pb-5 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-bold text-base text-[#f1f1f5]">
          TaskFlow
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all no-underline ` +
              (isActive
                ? "bg-indigo-500/15 text-indigo-500"
                : "text-[#9191a8] hover:bg-[#1a1a24] hover:text-[#f1f1f5]")
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="h-px bg-white/10 my-4" />
      <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
          style={{ background: user?.avatarColor || "#6366f1" }}
        >
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[#f1f1f5] overflow-hidden text-ellipsis whitespace-nowrap">
            {user?.name}
          </div>
          <div className={`text-xs capitalize ${user?.role === "admin" ? "text-indigo-500" : "text-[#5a5a72]"}`}>
            {user?.role}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-transparent border-none cursor-pointer text-[#5a5a72] flex items-center p-1 rounded-md transition-colors hover:text-red-500"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-60 flex-1 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;

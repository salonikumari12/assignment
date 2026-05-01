import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ProjectModal from "../components/ProjectModal";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { FolderKanban, Plus, Users } from "lucide-react";
import toast from "react-hot-toast";

interface Project {
  _id: string;
  name: string;
  description: string;
  owner: any;
  members: any[];
}

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      toast.error("Failed to load projects");
    }
  };

  return (
    <Layout>
      <div className="p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#f1f1f5] flex items-center gap-2.5">
              <FolderKanban className="text-indigo-500" /> Projects
            </h1>
            <p className="text-[#9191a8] mt-1 text-sm">
              Manage your team's workspaces and projects.
            </p>
          </div>
          {user?.role === "admin" && (
            <button
              className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] hover:-translate-y-px px-4 py-2.5 text-sm font-medium rounded-lg inline-flex items-center gap-2 transition-all cursor-pointer border-none"
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} /> New Project
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 text-[#5a5a72] bg-[#13131a] border border-white/10 rounded-2xl">
            <FolderKanban size={48} className="mx-auto mb-4 opacity-20" />
            <p>No projects found. {user?.role === "admin" && "Create one to get started."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => (
              <Link
                key={p._id}
                to={`/projects/${p._id}`}
                className="bg-[#13131a] border border-white/10 rounded-2xl p-5 no-underline flex flex-col gap-3 transition-all duration-200 hover:border-white/15 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(99,102,241,0.06)] group"
              >
                <h3 className="text-[17px] font-semibold text-[#f1f1f5] group-hover:text-indigo-400 transition-colors">
                  {p.name}
                </h3>
                <p className="text-sm text-[#5a5a72] leading-relaxed line-clamp-2 min-h-[40px]">
                  {p.description || "No description provided."}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[#9191a8] mt-2 pt-3 border-t border-white/10">
                  <Users size={14} />
                  <span>{p.members.length} members</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ProjectModal
          onClose={() => setShowModal(false)}
          onSave={(p) => {
            setProjects([p, ...projects]);
            toast.success("Project created");
          }}
        />
      )}
    </Layout>
  );
};

export default ProjectsPage;

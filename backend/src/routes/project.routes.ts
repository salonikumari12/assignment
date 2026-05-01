import { Router } from "express";
import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getAllUsers,
} from "../controllers/project.controller";
import { protect, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(protect);

router.get("/users", getAllUsers);
router.get("/", getProjects);
router.post("/", requireAdmin, createProject);
router.get("/:id", getProjectById);
router.put("/:id", requireAdmin, updateProject);
router.delete("/:id", requireAdmin, deleteProject);
router.post("/:id/members", requireAdmin, addMember);
router.delete("/:id/members/:userId", requireAdmin, removeMember);

export default router;

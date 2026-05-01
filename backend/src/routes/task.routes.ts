import { Router } from "express";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboard,
} from "../controllers/task.controller";
import { protect, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(protect);

router.get("/dashboard", getDashboard);
router.get("/", getTasks);
router.post("/", requireAdmin, createTask);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", requireAdmin, deleteTask);

export default router;

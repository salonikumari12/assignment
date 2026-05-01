import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Task } from "../models/Task";
import { Project } from "../models/Project";

// GET /api/tasks?project=&assignee=&status=&priority=
export const getTasks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { project, assignee, status, priority } = req.query;
    const filter: Record<string, unknown> = {};

    if (project) filter.project = project;
    if (assignee) filter.assignee = assignee;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Non-admins only see tasks in their projects
    if (req.user!.role !== "admin") {
      const userProjects = await Project.find({
        $or: [{ owner: req.user!._id }, { members: req.user!._id }],
      }).select("_id");
      const projectIds = userProjects.map((p) => p._id);
      filter.project = project
        ? filter.project
        : { $in: projectIds };
    }

    const tasks = await Task.find(filter)
      .populate("assignee", "name email avatarColor")
      .populate("createdBy", "name email avatarColor")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// POST /api/tasks
export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, project, assignee, priority, dueDate } =
      req.body;

    if (!title || !project) {
      res.status(400).json({ message: "Title and project are required" });
      return;
    }

    // Verify user has access to this project
    const proj = await Project.findById(project);
    if (!proj) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const task = await Task.create({
      title,
      description: description || "",
      project,
      assignee: assignee || null,
      priority: priority || "medium",
      dueDate: dueDate || null,
      createdBy: req.user!._id,
    });

    const populated = await task.populate([
      { path: "assignee", select: "name email avatarColor" },
      { path: "createdBy", select: "name email avatarColor" },
      { path: "project", select: "name" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// GET /api/tasks/:id
export const getTaskById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignee", "name email avatarColor")
      .populate("createdBy", "name email avatarColor")
      .populate("project", "name");

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// PUT /api/tasks/:id
export const updateTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, assignee, status, priority, dueDate } =
      req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const isAdmin = req.user!.role === "admin";

    if (isAdmin && title !== undefined) task.title = title;
    if (isAdmin && description !== undefined) task.description = description;
    if (isAdmin && assignee !== undefined) task.assignee = assignee || null;
    if (status !== undefined) task.status = status;
    if (isAdmin && priority !== undefined) task.priority = priority;
    if (isAdmin && dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;

    await task.save();

    const populated = await task.populate([
      { path: "assignee", select: "name email avatarColor" },
      { path: "createdBy", select: "name email avatarColor" },
      { path: "project", select: "name" },
    ]);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// DELETE /api/tasks/:id (admin only — enforced in route)
export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// GET /api/dashboard
export const getDashboard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const now = new Date();

    let projectFilter: Record<string, unknown> = {};
    if (req.user!.role !== "admin") {
      const userProjects = await Project.find({
        $or: [{ owner: userId }, { members: userId }],
      }).select("_id");
      const projectIds = userProjects.map((p) => p._id);
      projectFilter = { project: { $in: projectIds } };
    }

    const [total, todo, inProgress, done, overdue, myTasks, recentTasks] =
      await Promise.all([
        Task.countDocuments(projectFilter),
        Task.countDocuments({ ...projectFilter, status: "todo" }),
        Task.countDocuments({ ...projectFilter, status: "in-progress" }),
        Task.countDocuments({ ...projectFilter, status: "done" }),
        Task.countDocuments({
          ...projectFilter,
          status: { $ne: "done" },
          dueDate: { $lt: now },
        }),
        Task.countDocuments({ ...projectFilter, assignee: userId }),
        Task.find(projectFilter)
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("assignee", "name avatarColor")
          .populate("project", "name"),
      ]);

    const projectCount = await Project.countDocuments(
      req.user!.role === "admin"
        ? {}
        : { $or: [{ owner: userId }, { members: userId }] }
    );

    res.json({
      total,
      todo,
      inProgress,
      done,
      overdue,
      myTasks,
      projectCount,
      recentTasks,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

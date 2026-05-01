import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Project } from "../models/Project";
import { Task } from "../models/Task";
import { User } from "../models/User";
import mongoose from "mongoose";

// GET /api/projects
export const getProjects = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    })
      .populate("owner", "name email avatarColor role")
      .populate("members", "name email avatarColor role")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// POST /api/projects
export const createProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400).json({ message: "Project name is required" });
      return;
    }

    const project = await Project.create({
      name,
      description: description || "",
      owner: req.user!._id,
      members: [req.user!._id],
    });

    const populated = await project.populate([
      { path: "owner", select: "name email avatarColor role" },
      { path: "members", select: "name email avatarColor role" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// GET /api/projects/:id
export const getProjectById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email avatarColor role")
      .populate("members", "name email avatarColor role");

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const userId = req.user!._id.toString();
    const isMember =
      project.owner._id.toString() === userId ||
      project.members.some((m: any) => m._id.toString() === userId);

    if (!isMember) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const tasks = await Task.find({ project: project._id })
      .populate("assignee", "name email avatarColor")
      .populate("createdBy", "name email avatarColor")
      .sort({ createdAt: -1 });

    res.json({ project, tasks });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// PUT /api/projects/:id
export const updateProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const { name, description } = req.body;
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    await project.save();

    const populated = await project.populate([
      { path: "owner", select: "name email avatarColor role" },
      { path: "members", select: "name email avatarColor role" },
    ]);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    await Task.deleteMany({ project: req.params.id });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// POST /api/projects/:id/members
export const addMember = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const alreadyMember = project.members.some(
      (m) => m.toString() === user._id.toString()
    );
    if (alreadyMember) {
      res.status(400).json({ message: "User is already a member" });
      return;
    }

    project.members.push(user._id as mongoose.Types.ObjectId);
    await project.save();

    const populated = await project.populate([
      { path: "owner", select: "name email avatarColor role" },
      { path: "members", select: "name email avatarColor role" },
    ]);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// DELETE /api/projects/:id/members/:userId
export const removeMember = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    if (project.owner.toString() === req.params.userId) {
      res.status(400).json({ message: "Cannot remove project owner" });
      return;
    }

    project.members = project.members.filter(
      (m) => m.toString() !== req.params.userId
    );
    await project.save();

    const populated = await project.populate([
      { path: "owner", select: "name email avatarColor role" },
      { path: "members", select: "name email avatarColor role" },
    ]);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// GET /api/users — list all users (admin use: assign members)
export const getAllUsers = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select("name email avatarColor role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  project: { _id: string; name: string };
  assignee: { _id: string; name: string; avatarColor: string } | null;
  createdBy: { _id: string; name: string; avatarColor: string };
}

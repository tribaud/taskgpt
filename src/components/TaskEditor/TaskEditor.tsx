import React, { useState } from "react";
import Toolbar from "./Toolbar";
import TaskTable from "./TaskTable";

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: string;
  done: boolean;
  dependencies: string[];
  tags: string[];
};

const initialTasks: Task[] = [
  {
    id: "T001",
    title: "Exemple",
    description: "Description de la tâche",
    priority: "medium",
    done: false,
    dependencies: [],
    tags: ["demo", "test"]
  }
];

const TaskEditor: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = () => {
    const nextId = "T" + String(tasks.length + 1).padStart(3, "0");
    setTasks([
      ...tasks,
      {
        id: nextId,
        title: "",
        description: "",
        priority: "low",
        done: false,
        dependencies: [],
        tags: []
      }
    ]);
  };

  const sortTasks = () => {
    setTasks([...tasks].sort((a, b) => (a.id || "").localeCompare(b.id || "")));
  };

  // TODO: handlers pour édition, suppression, etc.

  return (
    <div>
      <Toolbar onAdd={addTask} onSort={sortTasks} />
      <TaskTable tasks={tasks} />
    </div>
  );
};

export default TaskEditor;

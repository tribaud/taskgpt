import React, { useState } from "react";
import Toolbar from "./Toolbar";
import TaskTable from "./TaskTable";
import SettingsModal from "../Settings/SettingsModal";
import ChatPanel from "../Chat/ChatPanel";

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

// Utilitaire pour exporter en markdown
function toMD(tasks: Task[]): string {
  const lines: string[] = ['# Tasks', ''];
  for (const t of tasks) {
    const check = t.done ? 'x' : ' ';
    const prio = t.priority || 'n/a';
    const deps = (t.dependencies || []).join(', ');
    const tags = (t.tags || []).join(', ');
    lines.push(`- [${check}] **${t.id}** ${t.title || ''} (prio: ${prio})`);
    if (t.description) lines.push(`  - ${t.description}`);
    if (deps) lines.push(`  - deps: ${deps}`);
    if (tags) lines.push(`  - tags: ${tags}`);
  }
  return lines.join('\n');
}

const TaskEditor: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showSettings, setShowSettings] = useState(false);

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

  const editTask = (index: number, updated: Partial<Task>) => {
    setTasks(tasks =>
      tasks.map((t, i) => (i === index ? { ...t, ...updated } : t))
    );
  };

  const deleteTask = (index: number) => {
    setTasks(tasks => tasks.filter((_, i) => i !== index));
  };

  // Ouvrir un fichier JSON (web only)
  const openFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target?.result as string);
          if (Array.isArray(data)) setTasks(data);
          else if (data.tasks) setTasks(data.tasks);
        } catch (err) {
          alert("Erreur lors de l'ouverture du fichier : " + err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Sauvegarder le fichier JSON (web only)
  const saveFile = () => {
    const blob = new Blob([JSON.stringify({ tasks }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tasks.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Exporter en markdown (web only)
  const exportMD = () => {
    const md = toMD(tasks);
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tasks.md";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <Toolbar
        onAdd={addTask}
        onSort={sortTasks}
        onOpen={openFile}
        onSave={saveFile}
        onExport={exportMD}
        onSettings={() => setShowSettings(true)}
      />
      <TaskTable
        tasks={tasks}
        onEditTask={editTask}
        onDeleteTask={deleteTask}
      />
      <ChatPanel onImportTasks={(imported: Task[]) => setTasks(imported)} />
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
};

export default TaskEditor;

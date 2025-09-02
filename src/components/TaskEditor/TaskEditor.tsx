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
  tags: string[];
};

const initialTasks: Task[] = [
  {
    id: "T001",
    title: "Exemple",
    description: "Description de la tâche",
    priority: "medium",
    done: false,
    tags: ["demo", "test"]
  }
];

// Utilitaire pour exporter en markdown
function toMD(tasks: Task[]): string {
  const lines: string[] = ['# Tasks', ''];
  for (const t of tasks) {
    const check = t.done ? 'x' : ' ';
    const prio = t.priority || 'n/a';
    const tags = (t.tags || []).join(', ');
    lines.push(`- [${check}] **${t.id}** ${t.title || ''} (prio: ${prio})`);
    if (t.description) lines.push(`  - ${t.description}`);
    if (tags) lines.push(`  - tags: ${tags}`);
  }
  return lines.join('\n');
}

type TaskEditorProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const TaskEditor: React.FC<TaskEditorProps> = ({ tasks, setTasks }) => {
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
          // Stocker le nom et le chemin du fichier dans localStorage
          localStorage.setItem("taskgpt_lastfile_name", file.name);
          localStorage.setItem("taskgpt_lastfile_path", file.webkitRelativePath || file.name);
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
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="schemaSelect" style={{ fontWeight: "bold", marginRight: 8 }}>Modèle JSON :</label>
        <select
          id="schemaSelect"
          value="v1"
          style={{ minWidth: 120 }}
          disabled
        >
          <option value="v1">v1 (id, title, description, priority, done, tags)</option>
        </select>
      </div>
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
        allTags={Array.from(new Set(tasks.flatMap(t => t.tags)))}
      />
      {/* <ChatPanel onImportTasks={(imported: Task[]) => setTasks(imported)} /> */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
};

export default TaskEditor;

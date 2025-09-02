import React from "react";
import TaskRow from "./TaskRow";

// TODO: Remplacer par un vrai state global ou context
const mockTasks = [
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

const TaskTable: React.FC = () => {
  // À terme, remplacer mockTasks par un state/context global
  return (
    <div style={{ overflow: "auto", maxHeight: "60vh" }}>
      <table>
        <thead>
          <tr>
            <th style={{ width: 60 }}>Done</th>
            <th style={{ width: 110 }}>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th style={{ width: 120 }}>Priority</th>
            <th>Dependencies</th>
            <th>Tags</th>
            <th style={{ width: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockTasks.map((task, idx) => (
            <TaskRow key={task.id} task={task} index={idx} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
